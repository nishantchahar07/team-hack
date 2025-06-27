import { NotificationCardProps } from "@/types/booking";
import { X } from "lucide-react";

export const NotificationCard: React.FC<NotificationCardProps> = ({ notification, onDismiss }) => (
    <div
        className="bg-white rounded-lg shadow-lg p-4 w-64 border-l-4 transform transition-all duration-300 ease-out hover:scale-105"
        style={{ borderLeftColor: '#4CAF50' }}
    >
        <div className="flex items-start justify-between">
            <div className="flex-1">
                <h4
                    className="font-semibold text-sm mb-1"
                    style={{ color: '#2C3E50', fontFamily: 'Inter, sans-serif' }}
                >
                    {notification.title}
                </h4>
                <p
                    className="text-xs opacity-70"
                    style={{ color: '#2C3E50', fontFamily: 'Open Sans, sans-serif' }}
                >
                    {notification.time}
                </p>
            </div>
            <button
                onClick={() => onDismiss(notification.id)}
                className="ml-3 p-1 text-gray-400 hover:text-gray-600 transition-colors rounded"
                aria-label="Dismiss notification"
            >
                <X size={16} />
            </button>
        </div>
    </div>
);