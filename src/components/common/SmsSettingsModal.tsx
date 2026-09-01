import React, { useState, useEffect } from 'react';
import { 
  X, 
  Smartphone, 
  Send, 
  CheckCircle2, 
  Plus, 
  Trash2, 
  Key, 
  ShieldCheck, 
  Radio, 
  HelpCircle,
  ExternalLink,
  MessageSquare
} from 'lucide-react';
import { 
  SmsRecipient, 
  getStoredRecipients, 
  saveStoredRecipients, 
  getStoredApiKey, 
  saveStoredApiKey,
  dispatchSmsAlert,
  SmsDispatchResult
} from '../../services/smsService';
import { useCivic } from '../../context/CivicContext';

interface SmsSettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const SmsSettingsModal: React.FC<SmsSettingsModalProps> = ({ isOpen, onClose }) => {
  const { playSound } = useCivic();
  const [recipients, setRecipients] = useState<SmsRecipient[]>(getStoredRecipients());
  const [apiKey, setApiKey] = useState<string>(getStoredApiKey());
  const [isSendingTest, setIsSendingTest] = useState(false);
  const [testResults, setTestResults] = useState<SmsDispatchResult[] | null>(null);
  const [savedSuccess, setSavedSuccess] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setRecipients(getStoredRecipients());
      setApiKey(getStoredApiKey());
      setTestResults(null);
      setSavedSuccess(false);

      // Request browser notification permission if available
      if ('Notification' in window && Notification.permission === 'default') {
        Notification.requestPermission();
      }
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleUpdateRecipient = (id: string, field: 'name' | 'phone' | 'enabled', value: any) => {
    setRecipients(prev => prev.map(r => r.id === id ? { ...r, [field]: value } : r));
  };

  const handleAddRecipient = () => {
    const newRecipient: SmsRecipient = {
      id: Date.now().toString(),
      name: `Contact ${recipients.length + 1}`,
      phone: '',
      enabled: true
    };
    setRecipients([...recipients, newRecipient]);
  };

  const handleRemoveRecipient = (id: string) => {
    setRecipients(recipients.filter(r => r.id !== id));
  };

  const handleSave = () => {
    saveStoredRecipients(recipients);
    saveStoredApiKey(apiKey);
    setSavedSuccess(true);
    playSound('success');
    setTimeout(() => setSavedSuccess(false), 3000);
  };

  const handleSendTestSms = async () => {
    handleSave();
    setIsSendingTest(true);
    playSound('radar');

    const results = await dispatchSmsAlert(
      'EMERGENCY ADVISORY (VELACHERY ZONE 13)',
      'Flash inundation on 100ft road. De-watering pumps deployed by GCC. Please avoid the underpass route.',
      recipients,
      apiKey
    );

    setTestResults(results);
    setIsSendingTest(false);
    playSound('success');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
      <div className="bg-white rounded-lg border border-slate-300 shadow-2xl w-full max-w-xl overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="bg-[#0f2a4a] text-white px-5 py-3.5 flex items-center justify-between">
          <div className="flex items-center space-x-2.5">
            <Smartphone className="w-5 h-5 text-amber-400" />
            <div>
              <h3 className="font-bold text-sm sm:text-base leading-none">
                Live SMS Broadcast & Mobile Alert Settings
              </h3>
              <p className="text-[11px] text-slate-200 mt-0.5">
                Configure your phone number and friend's phone to receive live civic SMS notifications
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1 rounded text-slate-300 hover:text-white hover:bg-slate-800 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-5 overflow-y-auto space-y-4 text-xs text-slate-700">
          {/* Section 1: Phone Numbers */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="font-bold text-slate-900 uppercase text-[11px] tracking-wide flex items-center space-x-1.5">
                <MessageSquare className="w-4 h-4 text-blue-800" />
                <span>1. Target Mobile Numbers (Recipient List)</span>
              </label>
              <button
                type="button"
                onClick={handleAddRecipient}
                className="text-[11px] font-bold text-blue-900 hover:text-blue-700 flex items-center space-x-1"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Add Another Number</span>
              </button>
            </div>

            <div className="space-y-2.5">
              {recipients.map((rec, idx) => (
                <div key={rec.id} className="flex items-center space-x-2 p-2.5 rounded bg-slate-50 border border-slate-200">
                  <input
                    type="checkbox"
                    checked={rec.enabled}
                    onChange={(e) => handleUpdateRecipient(rec.id, 'enabled', e.target.checked)}
                    className="accent-blue-900 rounded"
                    title="Enable SMS for this number"
                  />

                  <input
                    type="text"
                    placeholder="Contact Label (e.g. My Phone)"
                    value={rec.name}
                    onChange={(e) => handleUpdateRecipient(rec.id, 'name', e.target.value)}
                    className="w-32 px-2 py-1.5 rounded border border-slate-300 text-xs font-semibold text-slate-900 bg-white"
                  />

                  <input
                    type="tel"
                    placeholder="+91 98401 23456 (10-digit number)"
                    value={rec.phone}
                    onChange={(e) => handleUpdateRecipient(rec.id, 'phone', e.target.value)}
                    className="flex-1 px-3 py-1.5 rounded border border-slate-300 text-xs font-mono text-slate-900 bg-white"
                  />

                  {recipients.length > 1 && (
                    <button
                      type="button"
                      onClick={() => handleRemoveRecipient(rec.id)}
                      className="p-1.5 rounded text-slate-400 hover:text-red-600 hover:bg-slate-200 transition"
                      title="Remove number"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Section 2: Gateway Configuration */}
          <div className="p-3.5 rounded bg-slate-50 border border-slate-200 space-y-2">
            <div className="flex items-center justify-between">
              <label className="font-bold text-slate-900 uppercase text-[11px] tracking-wide flex items-center space-x-1.5">
                <Key className="w-3.5 h-3.5 text-slate-600" />
                <span>2. Fast2SMS / Gateway API Key (Optional for Live Carrier SMS)</span>
              </label>
              <a
                href="https://www.fast2sms.com"
                target="_blank"
                rel="noreferrer"
                className="text-[10px] text-blue-800 hover:underline flex items-center space-x-0.5 font-semibold"
              >
                <span>Get Free Fast2SMS API Key</span>
                <ExternalLink className="w-3 h-3" />
              </a>
            </div>

            <input
              type="password"
              placeholder="Paste Fast2SMS API key here (Optional - simulated delivery is always active)"
              value={apiKey}
              onChange={(e) => setApiKey(e.target.value)}
              className="w-full px-3 py-2 rounded border border-slate-300 text-xs font-mono text-slate-900 bg-white"
            />
            <p className="text-[10px] text-slate-500">
              * If left empty, CIVIC-SYNC uses the built-in 3GPP simulated telecommunication protocol + Web Notifications. If an API key is entered, real SMS messages are transmitted directly to Indian mobile numbers via Fast2SMS.
            </p>
          </div>

          {/* Test Dispatch Results */}
          {testResults && (
            <div className="p-3.5 rounded bg-green-50 border border-green-200 space-y-2">
              <div className="flex items-center justify-between text-green-900 font-bold">
                <span className="flex items-center space-x-1.5">
                  <CheckCircle2 className="w-4 h-4 text-green-700" />
                  <span>SMS Dispatched Successfully ({testResults.length} numbers)</span>
                </span>
                <span className="text-[10px] font-mono">{testResults[0]?.timestamp}</span>
              </div>

              <div className="space-y-1 font-mono text-[11px]">
                {testResults.map((res, idx) => (
                  <div key={idx} className="flex items-center justify-between p-1.5 rounded bg-white border border-green-200">
                    <span>📱 {res.recipient} ({res.phone})</span>
                    <span className="text-green-800 font-bold">{res.provider} • {res.messageId}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {savedSuccess && (
            <div className="p-2 rounded bg-blue-50 text-blue-900 border border-blue-200 text-xs font-semibold text-center">
              ✓ Settings saved successfully!
            </div>
          )}
        </div>

        {/* Footer Actions */}
        <div className="p-4 bg-slate-50 border-t border-slate-200 flex items-center justify-between">
          <button
            type="button"
            onClick={handleSave}
            className="px-4 py-2 rounded bg-white hover:bg-slate-100 text-slate-800 border border-slate-300 font-semibold text-xs transition"
          >
            Save Numbers
          </button>

          <button
            type="button"
            onClick={handleSendTestSms}
            disabled={isSendingTest}
            className="flex items-center space-x-2 px-5 py-2 rounded bg-blue-900 hover:bg-blue-800 text-white font-bold text-xs transition shadow-sm disabled:opacity-50"
          >
            <Send className="w-3.5 h-3.5" />
            <span>{isSendingTest ? 'SENDING TEST SMS...' : 'Send Live Test SMS Now'}</span>
          </button>
        </div>
      </div>
    </div>
  );
};
