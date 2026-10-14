import React, { useState } from 'react';
import {
  Bell,
  Clock,
  Moon,
  Sun,
  Volume2,
  VolumeX,
  X,
  CheckCircle,
  AlertCircle,
  Info,
  Sparkles,
} from 'lucide-react';
import { ReminderConfig } from '../../types';
import { playReminderChime } from '../../utils/notificationAudio';

interface ReminderSettingsModalProps {
  config: ReminderConfig;
  isOpen: boolean;
  onClose: () => void;
  onSaveConfig: (newConfig: ReminderConfig) => void;
}

export const ReminderSettingsModal: React.FC<ReminderSettingsModalProps> = ({
  config,
  isOpen,
  onClose,
  onSaveConfig,
}) => {
  const [currentConfig, setCurrentConfig] = useState<ReminderConfig>(config);
  const [permissionState, setPermissionState] = useState<NotificationPermission>(
    typeof window !== 'undefined' && 'Notification' in window ? Notification.permission : 'default'
  );
  const [testNotificationSent, setTestNotificationSent] = useState(false);

  if (!isOpen) return null;

  // Request browser permission
  const handleRequestPermission = async () => {
    if (!('Notification' in window)) {
      alert('This browser does not support desktop notifications.');
      return;
    }

    try {
      const permission = await Notification.requestPermission();
      setPermissionState(permission);
      setCurrentConfig((prev) => ({
        ...prev,
        browserPermission: permission as any,
      }));
      if (permission === 'granted') {
        playReminderChime('success');
      }
    } catch (err) {
      console.warn('Error requesting notification permission:', err);
    }
  };

  // Test Notification
  const handleSendTestNotification = () => {
    playReminderChime(currentConfig.soundEnabled ? 'alert' : 'gentle');

    if ('Notification' in window && Notification.permission === 'granted') {
      try {
        new Notification('NEC Pulse • Evening Bag Packing Reminder', {
          body: 'Don’t forget: Pack your DSA Lab Record and College ID Card for tomorrow (9:10 AM start).',
          icon: '/favicon.ico',
        });
      } catch (err) {
        console.warn('Browser notification error:', err);
      }
    }

    setTestNotificationSent(true);
    setTimeout(() => setTestNotificationSent(false), 3500);
  };

  const handleSave = () => {
    onSaveConfig(currentConfig);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 max-w-lg w-full shadow-2xl space-y-5 animate-in fade-in zoom-in-95">
        <div className="flex items-center justify-between pb-3 border-b border-slate-800">
          <div className="flex items-center gap-2">
            <span className="p-2 rounded-xl bg-teal-500/10 text-teal-400 border border-teal-500/20">
              <Bell className="w-5 h-5" />
            </span>
            <div>
              <h3 className="text-base font-semibold text-white tracking-tight">
                Daily Notification & Readiness Reminders
              </h3>
              <p className="text-xs text-slate-400">
                Browser notifications and audio chimes for bag packing & morning college readiness
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-slate-200 p-1 rounded-lg"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Prototype & Browser Limitations Notice */}
        <div className="p-3 rounded-2xl bg-amber-950/20 border border-amber-500/30 flex items-start gap-2.5 text-xs text-amber-300">
          <Info className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
          <p className="leading-relaxed text-[11px]">
            <strong>Front-End Reliability Note:</strong> Native browser notifications require this tab or browser session to remain open.
            Background delivery when the browser is terminated requires server-side push notification infrastructure (FCM/Web Push).
          </p>
        </div>

        {/* Permission Request Banner */}
        <div className="p-3.5 rounded-2xl bg-slate-950/80 border border-slate-800 flex items-center justify-between">
          <div className="space-y-0.5">
            <span className="text-xs font-medium text-slate-300">Browser Notification Permission:</span>
            <div className="flex items-center gap-1.5 text-xs">
              <span
                className={`w-2 h-2 rounded-full ${
                  permissionState === 'granted'
                    ? 'bg-emerald-400'
                    : permissionState === 'denied'
                    ? 'bg-rose-500'
                    : 'bg-amber-400'
                }`}
              />
              <span className="capitalize font-mono text-[11px] text-slate-400">
                {permissionState}
              </span>
            </div>
          </div>

          {permissionState !== 'granted' && (
            <button
              onClick={handleRequestPermission}
              className="px-3 py-1.5 rounded-xl bg-teal-600 hover:bg-teal-500 text-white font-medium text-xs shadow-md transition"
            >
              Enable Notifications
            </button>
          )}
        </div>

        {/* Reminders Controls */}
        <div className="space-y-4 text-xs">
          {/* 1. Night-Before Reminder */}
          <div className="p-4 rounded-2xl bg-slate-950/50 border border-slate-800 space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Moon className="w-4 h-4 text-indigo-400" />
                <div>
                  <h4 className="font-semibold text-slate-200">Night-Before Packing Reminder</h4>
                  <p className="text-[11px] text-slate-400">
                    Default 9:00 PM (1 hour before 10:00 PM bedtime)
                  </p>
                </div>
              </div>
              <input
                type="checkbox"
                checked={currentConfig.nightBeforeEnabled}
                onChange={(e) =>
                  setCurrentConfig({ ...currentConfig, nightBeforeEnabled: e.target.checked })
                }
                className="w-4 h-4 rounded text-teal-600 focus:ring-teal-500"
              />
            </div>

            <div className="grid grid-cols-2 gap-3 pt-1">
              <div className="space-y-1">
                <label className="text-[11px] text-slate-400">Reminder Time</label>
                <input
                  type="time"
                  value={currentConfig.nightBeforeTime}
                  onChange={(e) =>
                    setCurrentConfig({ ...currentConfig, nightBeforeTime: e.target.value })
                  }
                  className="w-full px-3 py-1.5 rounded-xl bg-slate-900 border border-slate-700 text-slate-200"
                />
              </div>
              <div className="space-y-1">
                <label className="text-[11px] text-slate-400">Estimated Bedtime</label>
                <input
                  type="time"
                  value={currentConfig.bedtime}
                  onChange={(e) =>
                    setCurrentConfig({ ...currentConfig, bedtime: e.target.value })
                  }
                  className="w-full px-3 py-1.5 rounded-xl bg-slate-900 border border-slate-700 text-slate-200"
                />
              </div>
            </div>
          </div>

          {/* 2. Morning Readiness Reminder */}
          <div className="p-4 rounded-2xl bg-slate-950/50 border border-slate-800 space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Sun className="w-4 h-4 text-amber-400" />
                <div>
                  <h4 className="font-semibold text-slate-200">Morning Readiness & Transit Alert</h4>
                  <p className="text-[11px] text-slate-400">
                    Default 8:50 AM (20 mins before 9:10 AM college start)
                  </p>
                </div>
              </div>
              <input
                type="checkbox"
                checked={currentConfig.morningEnabled}
                onChange={(e) =>
                  setCurrentConfig({ ...currentConfig, morningEnabled: e.target.checked })
                }
                className="w-4 h-4 rounded text-teal-600 focus:ring-teal-500"
              />
            </div>

            <div className="grid grid-cols-2 gap-3 pt-1">
              <div className="space-y-1">
                <label className="text-[11px] text-slate-400">Morning Alert Time</label>
                <input
                  type="time"
                  value={currentConfig.morningTime}
                  onChange={(e) =>
                    setCurrentConfig({ ...currentConfig, morningTime: e.target.value })
                  }
                  className="w-full px-3 py-1.5 rounded-xl bg-slate-900 border border-slate-700 text-slate-200"
                />
              </div>
              <div className="space-y-1">
                <label className="text-[11px] text-slate-400">College Start Time</label>
                <input
                  type="time"
                  value={currentConfig.collegeStartTime}
                  onChange={(e) =>
                    setCurrentConfig({ ...currentConfig, collegeStartTime: e.target.value })
                  }
                  className="w-full px-3 py-1.5 rounded-xl bg-slate-900 border border-slate-700 text-slate-200"
                />
              </div>
            </div>
          </div>

          {/* Audio Chime Setting */}
          <div className="flex items-center justify-between p-3 rounded-xl bg-slate-950/40 border border-slate-800">
            <div className="flex items-center gap-2">
              {currentConfig.soundEnabled ? (
                <Volume2 className="w-4 h-4 text-teal-400" />
              ) : (
                <VolumeX className="w-4 h-4 text-slate-500" />
              )}
              <span className="text-slate-300">Play Web Audio Harmonic Chime</span>
            </div>
            <input
              type="checkbox"
              checked={currentConfig.soundEnabled}
              onChange={(e) =>
                setCurrentConfig({ ...currentConfig, soundEnabled: e.target.checked })
              }
              className="w-4 h-4 rounded text-teal-600"
            />
          </div>
        </div>

        {/* Test Alert Button */}
        <div className="pt-2 border-t border-slate-800 flex items-center justify-between gap-3">
          <button
            onClick={handleSendTestNotification}
            className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs transition"
          >
            <Sparkles className="w-3.5 h-3.5 text-amber-400" />
            <span>{testNotificationSent ? 'Chime & Alert Dispatched!' : 'Test Notification'}</span>
          </button>

          <div className="flex items-center gap-2">
            <button
              onClick={onClose}
              className="px-3 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs"
            >
              Cancel
            </button>
            <button
              onClick={handleSave}
              className="px-4 py-2 rounded-xl bg-teal-600 hover:bg-teal-500 text-white font-medium text-xs shadow-md shadow-teal-950/40"
            >
              Save Reminder Settings
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
