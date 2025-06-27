'use client'

import React from 'react';
import { Notification } from '@/types/notification';

interface NotificationPanelProps {
  notifications: Notification[];
  closeNotification: (id: number) => void;
}

const NotificationPanel: React.FC<NotificationPanelProps> = ({ notifications, closeNotification }) => {
  return (
    <div className="fixed top-28 right-8 z-40 space-y-4">
      {notifications.map((notification) => (
        <div key={notification.id} className="glass-effect rounded-2xl p-5 min-w-80 shadow-xl border-l-4 border-yellow-400 notification-enter">
          <button
            onClick={() => closeNotification(notification.id)}
            className="absolute top-3 right-4 text-slate-400 hover:text-slate-600"
          >
            ×
          </button>
          <div className="font-semibold text-slate-800 mb-1">{notification.title}</div>
          <div className="text-sm text-slate-600">{notification.time}</div>
        </div>
      ))}
    </div>
  );
};

export default NotificationPanel;
