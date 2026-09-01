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
  MessageSquare,
  MessageCircle,
  PhoneCall
} from 'lucide-react';
import { 
  SmsRecipient, 
  getStoredRecipients, 
  saveStoredRecipients, 
  getStoredApiKey, 
  saveStoredApiKey,
  dispatchSmsAlert,
  SmsDispatchResult,
  getDirectSmsUrl,
  getDirectWhatsAppUrl
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
      name: `Friend ${recipients.length}`,
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

    const sampleMsg = 'Heavy flash flood on Velachery 100ft road near DAV School. Please avoid this route.';
    const results = await dispatchSmsAlert(
      'EMERGENCY ADVISORY (VELACHERY ZONE 13)',
      sampleMsg,
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
                Live SMS & WhatsApp Dispatch Settings
              </h3>
              <p className="text-[11px] text-slate-200 mt-0.5">
                Send real-time alerts to your mobile phone and your friend's phone
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
          {/* How real SMS works info banner */}
          <div className="p-3 rounded bg-amber-50 border border-amber-200 text-amber-900 space-y-1">
            <div className="font-bold flex items-center space-x-1.5 text-xs">
              <span>💡 How real SMS delivery works to your SIM card:</span>
            </div>
            <p className="text-[11px] leading-relaxed text-amber-950">
              Web browsers cannot send telecom SMS directly without an SMS Gateway (telecom regulation). Enter your <strong>10-digit mobile numbers</strong> below, and use one of the two instant methods:
            </p>
            <ul className="text-[11px] list-disc list-inside space-y-0.5 pt-0.5 text-amber-950">
              <li><strong>Method 1 (Instant):</strong> Tap <em>"Open in SMS"</em> or <em>"WhatsApp"</em> to send instantly from your phone!</li>
              <li><strong>Method 2 (Automated Carrier SMS):</strong> Paste a free <strong>Fast2SMS API Key</strong> below to automatically deliver SMS to any Indian number.</li>
            </ul>
          </div>

          {/* Section 1: Phone Numbers */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="font-bold text-slate-900 uppercase text-[11px] tracking-wide flex items-center space-x-1.5">
                <MessageSquare className="w-4 h-4 text-blue-800" />
                <span>1. Enter Mobile Numbers</span>
              </label>
              <button
                type="button"
                onClick={handleAddRecipient}
                className="text-[11px] font-bold text-blue-900 hover:text-blue-700 flex items-center space-x-1"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Add Another Friend</span>
              </button>
            </div>

            <div className="space-y-2.5">
              {recipients.map((rec) => (
                <div key={rec.id} className="flex items-center space-x-2 p-2.5 rounded bg-slate-50 border border-slate-200">
                  <input
                    type="checkbox"
                    checked={rec.enabled}
                    onChange={(e) => handleUpdateRecipient(rec.id, 'enabled', e.target.checked)}
                    className="accent-blue-900 rounded"
                    title="Enable alert for this number"
                  />

                  <input
                    type="text"
                    placeholder="Name (e.g. My Phone)"
                    value={rec.name}
                    onChange={(e) => handleUpdateRecipient(rec.id, 'name', e.target.value)}
                    className="w-32 px-2 py-1.5 rounded border border-slate-300 text-xs font-semibold text-slate-900 bg-white"
                  />

                  <input
                    type="tel"
                    placeholder="10-digit number (e.g. 9840123456)"
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

          {/* Section 2: Fast2SMS API Key */}
          <div className="p-3.5 rounded bg-slate-50 border border-slate-200 space-y-2">
            <div className="flex items-center justify-between">
              <label className="font-bold text-slate-900 uppercase text-[11px] tracking-wide flex items-center space-x-1.5">
                <Key className="w-3.5 h-3.5 text-slate-600" />
                <span>2. Fast2SMS API Key (For Automated Telecom SMS)</span>
              </label>
              <a
                href="https://www.fast2sms.com"
                target="_blank"
                rel="noreferrer"
                className="text-[10px] text-blue-800 hover:underline flex items-center space-x-0.5 font-bold"
              >
                <span>Get Free Fast2SMS Key (fast2sms.com)</span>
                <ExternalLink className="w-3 h-3" />
              </a>
            </div>

            <input
              type="text"
              placeholder="Paste your Fast2SMS authorization key here"
              value={apiKey}
              onChange={(e) => setApiKey(e.target.value)}
              className="w-full px-3 py-2 rounded border border-slate-300 text-xs font-mono text-slate-900 bg-white"
            />
            <p className="text-[10px] text-slate-500">
              * Fast2SMS provides instant free SMS credits for Indian phone numbers (+91).
            </p>
          </div>

          {/* Dispatch Results with Instant One-Tap Links */}
          {testResults && (
            <div className="p-3.5 rounded bg-green-50 border border-green-200 space-y-2.5">
              <div className="flex items-center justify-between text-green-900 font-bold">
                <span className="flex items-center space-x-1.5">
                  <CheckCircle2 className="w-4 h-4 text-green-700" />
                  <span>Alert Prepared for {testResults.length} Numbers!</span>
                </span>
                <span className="text-[10px] font-mono">{testResults[0]?.timestamp}</span>
              </div>

              <div className="space-y-2 font-mono text-xs">
                {testResults.map((res, idx) => (
                  <div key={idx} className="p-2.5 rounded bg-white border border-green-200 space-y-1.5">
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-slate-900">📱 {res.recipient} ({res.phone})</span>
                      <span className="text-green-800 font-bold text-[10px]">{res.provider}</span>
                    </div>

                    <div className="flex items-center space-x-2 pt-1">
                      {res.smsUrl && (
                        <a
                          href={res.smsUrl}
                          className="px-2.5 py-1 rounded bg-blue-50 hover:bg-blue-100 text-blue-900 border border-blue-200 text-[11px] font-sans font-semibold flex items-center space-x-1"
                        >
                          <MessageSquare className="w-3 h-3 text-blue-700" />
                          <span>📲 Open in Phone SMS App</span>
                        </a>
                      )}

                      {res.whatsappUrl && (
                        <a
                          href={res.whatsappUrl}
                          target="_blank"
                          rel="noreferrer"
                          className="px-2.5 py-1 rounded bg-green-600 hover:bg-green-700 text-white text-[11px] font-sans font-semibold flex items-center space-x-1"
                        >
                          <MessageCircle className="w-3 h-3 fill-current" />
                          <span>💬 Send via WhatsApp</span>
                        </a>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {savedSuccess && (
            <div className="p-2 rounded bg-blue-50 text-blue-900 border border-blue-200 text-xs font-semibold text-center">
              ✓ Numbers saved successfully!
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
            className="flex items-center space-x-2 px-5 py-2 rounded bg-[#0f2a4a] hover:bg-[#1a3860] text-white font-bold text-xs transition shadow-sm disabled:opacity-50"
          >
            <Send className="w-3.5 h-3.5" />
            <span>{isSendingTest ? 'PREPARING ALERT...' : 'Dispatch Live Alert to Both Phones'}</span>
          </button>
        </div>
      </div>
    </div>
  );
};
