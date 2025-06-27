import { SelectFieldProps } from "@/types/booking";

export const SelectField: React.FC<SelectFieldProps> = ({
  value,
  onChange,
  options,
  placeholder
}) => {
  const handleFocus = (e: React.FocusEvent<HTMLSelectElement>): void => {
    e.target.style.borderColor = '#1976D2';
  };

  const handleBlur = (e: React.FocusEvent<HTMLSelectElement>): void => {
    e.target.style.borderColor = '#81C784';
  };

  return (
    <select
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
    >
      <option value="">{placeholder}</option>
      {options.map((option) => (
        <option key={option.value} value={option.value}>
          {option.label}
        </option>
      ))}
    </select>
  );
};