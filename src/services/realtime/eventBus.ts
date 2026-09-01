import { CityLiveEvent } from '../../types';

export type CityEventType = 
  | 'INCIDENT_CREATED'
  | 'INCIDENT_UPDATED'
  | 'INCIDENT_MERGED'
  | 'AI_TRIAGE_COMPLETED'
  | 'FLOOD_ALERT'
  | 'WEATHER_ALERT'
  | 'TRAFFIC_CHANGE'
  | 'AQI_UPDATE'
  | 'WATER_LEVEL_CHANGE'
  | 'WASTE_STATUS_CHANGE'
  | 'LIGHT_FAILURE'
  | 'EMERGENCY_DISPATCH'
  | 'INCIDENT_RESOLVED';

export interface CityEventPayload {
  type: CityEventType;
  timestamp: string;
  data: any;
  source: string;
}

type EventListener = (payload: CityEventPayload) => void;

class CityRealtimeEventBus {
  private socket: WebSocket | null = null;
  private listeners: Map<CityEventType | '*', Set<EventListener>> = new Map();
  private isConnected: boolean = false;
  private reconnectTimer: any = null;

  constructor() {
    this.connect();
  }

  public connect() {
    if (typeof window === 'undefined') return;

    try {
      const wsProtocol = window.location.protocol === 'https:' ? 'wss:' : 'ws:';
      const wsHost = window.location.hostname === 'localhost' ? 'localhost:8000' : window.location.host;
      const wsUrl = `${wsProtocol}//${wsHost}/ws/city`;

      this.socket = new WebSocket(wsUrl);

      this.socket.onopen = () => {
        this.isConnected = true;
        console.debug('🛰️ CIVIC-SYNC City WebSocket connected:', wsUrl);
        if (this.reconnectTimer) clearTimeout(this.reconnectTimer);
      };

      this.socket.onmessage = (event) => {
        try {
          const payload: CityEventPayload = JSON.parse(event.data);
          this.emitLocal(payload);
        } catch (e) {
          // Non-JSON telemetry
        }
      };

      this.socket.onclose = () => {
        this.isConnected = false;
        // Automated reconnection attempt
        this.reconnectTimer = setTimeout(() => this.connect(), 8000);
      };

      this.socket.onerror = () => {
        this.isConnected = false;
        if (this.socket) this.socket.close();
      };
    } catch (e) {
      this.isConnected = false;
    }
  }

  public subscribe(eventType: CityEventType | '*', listener: EventListener) {
    if (!this.listeners.has(eventType)) {
      this.listeners.set(eventType, new Set());
    }
    this.listeners.get(eventType)!.add(listener);

    return () => {
      this.listeners.get(eventType)?.delete(listener);
    };
  }

  public publish(type: CityEventType, data: any, source: string = 'CIVIC-SYNC Local Mesh') {
    const payload: CityEventPayload = {
      type,
      timestamp: new Date().toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit', second: '2-digit' }),
      data,
      source
    };

    // Send through WebSocket if available
    if (this.socket && this.socket.readyState === WebSocket.OPEN) {
      try {
        this.socket.send(JSON.stringify(payload));
      } catch (e) {
        // Socket send error
      }
    }

    // Local dispatch
    this.emitLocal(payload);
  }

  private emitLocal(payload: CityEventPayload) {
    // Exact match listeners
    const specificListeners = this.listeners.get(payload.type);
    if (specificListeners) {
      specificListeners.forEach(listener => listener(payload));
    }

    // Wildcard listeners
    const wildcardListeners = this.listeners.get('*');
    if (wildcardListeners) {
      wildcardListeners.forEach(listener => listener(payload));
    }
  }

  public getStatus(): { isConnected: boolean } {
    return { isConnected: this.isConnected };
  }
}

export const realtimeEventBus = new CityRealtimeEventBus();
