import { NavigationButtonProps } from "@/types/booking";

export const NavigationButton: React.FC<NavigationButtonProps> = ({ item, onClick }) => {
    const { icon: Icon, color } = item;

    return (
        <div
            className="w-10 h-10 rounded-full flex items-center justify-center text-white hover:scale-105 transition-transform cursor-pointer"
            style={{ backgroundColor: color }}
            onClick={onClick}
            role="button"
            tabIndex={0}
            onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                    onClick?.();
                }
            }}
        >
            <Icon size={18} />
        </div>
    );
};