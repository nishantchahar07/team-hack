import { FormStepProps, TIME_SLOTS } from "@/types/booking";
import { InputField } from "./InputField";
import { CheckCircle, User } from "lucide-react";
import { SelectField } from "./SelectField";

export const FormStep: React.FC<FormStepProps> = ({ currentStep, formData, onInputChange }) => {
    switch (currentStep) {
        case 1:
            return (
                <div className="space-y-6">
                    <InputField
                        type="text"
                        placeholder="Enter your full name..."
                        value={formData.name}
                        onChange={(value) => onInputChange('name', value)}
                        icon={User}
                    />
                </div>
            );

        case 2:
            return (
                <div className="space-y-6">
                    <h3 className="text-lg font-medium mb-4" style={{ color: '#2C3E50', fontFamily: 'Inter, sans-serif' }}>
                        Select your preferred date
                    </h3>
                    <InputField
                        type="date"
                        value={formData.date}
                        onChange={(value) => onInputChange('date', value)}
                    />
                </div>
            );

        case 3:
            return (
                <div className="space-y-6">
                    <h3 className="text-lg font-medium mb-4" style={{ color: '#2C3E50', fontFamily: 'Inter, sans-serif' }}>
                        Choose your preferred time
                    </h3>
                    <SelectField
                        value={formData.time}
                        onChange={(value) => onInputChange('time', value)}
                        options={TIME_SLOTS}
                        placeholder="Select time slot..."
                    />
                </div>
            );

        case 4:
            return (
                <div className="space-y-6 text-center">
                    <div
                        className="w-16 h-16 rounded-full flex items-center justify-center text-white mx-auto mb-4"
                        style={{ backgroundColor: '#4CAF50' }}
                    >
                        <CheckCircle size={32} />
                    </div>
                    <h3 className="text-xl font-semibold mb-4" style={{ color: '#2C3E50', fontFamily: 'Inter, sans-serif' }}>
                        Appointment Confirmed!
                    </h3>
                    <div className="space-y-2" style={{ color: '#2C3E50', fontFamily: 'Open Sans, sans-serif' }}>
                        <p><strong>Name:</strong> {formData.name}</p>
                        <p><strong>Date:</strong> {formData.date}</p>
                        <p><strong>Time:</strong> {formData.time}</p>
                    </div>
                </div>
            );

        default:
            return null;
    }
};