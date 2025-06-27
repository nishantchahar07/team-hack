import { NurseCardProps } from "@/types/nurse";
import { getStatusBadgeClass } from "@/utils/getStatusBadgeClass";
import { getStatusColors } from "@/utils/getStatusColors";
import { getStatusText } from "@/utils/getStatusText";
import { useCallback } from "react";

export const NurseCard: React.FC<NurseCardProps> = ({ nurse, isHovered, onHover }) => {
    const colors = getStatusColors(nurse.status);
    const statusText = getStatusText(nurse.status);
    const statusBadgeClass = getStatusBadgeClass(nurse.status);

    const cardStyle: React.CSSProperties = {
        borderLeftColor: colors.borderColor,
        background: colors.backgroundColor,
        transform: isHovered ? 'translateY(-8px)' : '',
        boxShadow: isHovered ? '0 16px 48px rgba(0, 0, 0, 0.2)' : '',
        transition: 'all 0.3s ease',
    };

    const avatarStyle: React.CSSProperties = {
        background: colors.gradient,
        boxShadow: colors.avatarShadow,
    };

    const etaBadgeStyle: React.CSSProperties = {
        background: colors.gradient,
        color: nurse.status === 'completing' ? '#2C3E50' : 'white',
    };

    const handleMouseEnter = useCallback(() => {
        onHover(nurse.id);
    }, [nurse.id, onHover]);

    const handleMouseLeave = useCallback(() => {
        onHover(null);
    }, [onHover]);

    return (
        <div
            className={`nurse-card ${nurse.status}`}
            style={cardStyle}
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
        >
            <div className="nurse-header">
                <div className="nurse-avatar" style={avatarStyle}>
                    {nurse.avatar}
                </div>
                <div className="nurse-name">
                    {nurse.emoji} {nurse.name}
                </div>
            </div>
            <div className="nurse-info">
                <div className="info-row">
                    <span className="info-label">ETA:</span>
                    <span className="eta-badge" style={etaBadgeStyle}>
                        {nurse.eta} minutes
                    </span>
                </div>
                <div className="info-row">
                    <span className="info-label">Next Visit:</span>
                    <span className="visit-type">{nurse.nextVisit}</span>
                </div>
                <div className="info-row">
                    <span className="info-label">Status:</span>
                    <span className={`status-badge ${statusBadgeClass}`}>{statusText}</span>
                </div>
            </div>
        </div>
    );
};