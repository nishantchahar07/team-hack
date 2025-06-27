import { InputFieldProps } from "@/types/booking";

export const InputField: React.FC<InputFieldProps> = ({
    type,
    placeholder,
    value,
    onChange,
    icon: Icon
}) => {
    const handleFocus = (e: React.FocusEvent<HTMLInputElement>): void => {
        e.target.style.borderColor = '#1976D2';
    };

    const handleBlur = (e: React.FocusEvent<HTMLInputElement>): void => {
        e.target.style.borderColor = '#81C784';
    };

    return (
        <div className="relative">
            <input
                type={type}
                placeholder={placeholder}
                value={value}
                onChange={(e) => onChange(e.target.value)}
                className="w-full px-4 py-4 border-2 rounded-lg text-lg focus:outline-none focus:ring-2 transition-all"
                style={{
                    borderColor: '#81C784',
                    color: '#2C3E50',
                    fontFamily: 'Open Sans, sans-serif'
                }}
                onFocus={handleFocus}
                onBlur={handleBlur}
            />
            {Icon && (
                <Icon
                    className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400"
                    size={20}
                />
            )}
        </div>
    );
};