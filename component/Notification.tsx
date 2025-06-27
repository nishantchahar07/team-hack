'use client';
import { Notification as ntc } from "@/types/notification";
import { useState } from "react";

export default function Notification() {

    const [notifications, setNotifications] = useState<ntc[]>([
        { id: 1, title: 'Take evening medicine', time: '6:00 PM' },
        { id: 2, title: 'Tele check-up scheduled', time: 'Tomorrow 10 AM' }
    ]);

    const closeNotification = (id: number) => {
        setNotifications(notifications.filter(n => n.id !== id));
    };

    return (
        <div className="fixed top-28 right-8 z-40 space-y-4">
            {notifications.map((notification: any) => (
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
    )
}