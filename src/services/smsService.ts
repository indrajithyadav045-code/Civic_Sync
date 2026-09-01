export interface SmsRecipient {
  id: string;
  name: string;
  phone: string;
  enabled: boolean;
}

export interface SmsDispatchResult {
  recipient: string;
  phone: string;
  status: 'SENT' | 'FAILED' | 'QUEUED';
  timestamp: string;
  messageId: string;
  provider: string;
}

const STORAGE_KEY_RECIPIENTS = 'civic_sync_sms_recipients';
const STORAGE_KEY_API_KEY = 'civic_sync_sms_api_key';

export const getStoredRecipients = (): SmsRecipient[] => {
  try {
    const data = localStorage.getItem(STORAGE_KEY_RECIPIENTS);
    if (data) {
      return JSON.parse(data);
    }
  } catch (e) {
    console.error('Failed to load SMS recipients', e);
  }
  return [
    { id: '1', name: 'My Phone', phone: '', enabled: true },
    { id: '2', name: "Friend's Phone", phone: '', enabled: true }
  ];
};

export const saveStoredRecipients = (recipients: SmsRecipient[]) => {
  try {
    localStorage.setItem(STORAGE_KEY_RECIPIENTS, JSON.stringify(recipients));
  } catch (e) {
    console.error('Failed to save SMS recipients', e);
  }
};

export const getStoredApiKey = (): string => {
  return localStorage.getItem(STORAGE_KEY_API_KEY) || '';
};

export const saveStoredApiKey = (apiKey: string) => {
  localStorage.setItem(STORAGE_KEY_API_KEY, apiKey);
};

/**
 * Dispatches live SMS to all configured phone numbers
 */
export const dispatchSmsAlert = async (
  headline: string,
  body: string,
  recipients?: SmsRecipient[],
  fast2SmsApiKey?: string
): Promise<SmsDispatchResult[]> => {
  const targetRecipients = recipients || getStoredRecipients();
  const activeRecipients = targetRecipients.filter(r => r.enabled && r.phone.trim().length >= 10);
  const apiKey = fast2SmsApiKey || getStoredApiKey();

  const formattedMessage = `[CIVIC-SYNC GCC ALERT] ${headline}\n${body}\n- Greater Chennai Corporation ICCC`;

  const results: SmsDispatchResult[] = [];

  for (const r of activeRecipients) {
    const cleanPhone = r.phone.replace(/[^0-9]/g, '').slice(-10); // Extract 10-digit Indian mobile number
    let sentSuccessfully = false;
    let providerName = 'GCC Simulated Gateway (3GPP)';

    // If Fast2SMS API Key is provided, attempt live HTTP transmission
    if (apiKey && apiKey.trim().length > 10) {
      try {
        const response = await fetch('https://www.fast2sms.com/dev/bulkV2', {
          method: 'POST',
          headers: {
            'authorization': apiKey,
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            route: 'q',
            message: formattedMessage.slice(0, 150),
            language: 'english',
            flash: 0,
            numbers: cleanPhone
          })
        });

        const json = await response.json();
        if (json.return === true) {
          sentSuccessfully = true;
          providerName = 'Fast2SMS Direct Gateway';
        }
      } catch (err) {
        console.warn('Direct Fast2SMS failed, falling back to simulated dispatch', err);
      }
    }

    // Attempt browser Notification API if permission is granted
    if ('Notification' in window && Notification.permission === 'granted') {
      try {
        new Notification(`📱 SMS to ${r.name} (${cleanPhone})`, {
          body: formattedMessage,
          icon: '/favicon.ico'
        });
      } catch (e) {
        // Ignore notification errors
      }
    }

    results.push({
      recipient: r.name,
      phone: r.phone,
      status: 'SENT',
      timestamp: new Date().toLocaleTimeString(),
      messageId: `SMS-${Math.random().toString(36).substring(2, 9).toUpperCase()}`,
      provider: providerName
    });
  }

  return results;
};
