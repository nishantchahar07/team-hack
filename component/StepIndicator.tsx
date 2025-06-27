import { StepIndicatorProps } from "@/types/booking";
import React from "react";

export const StepIndicator: React.FC<StepIndicatorProps> = ({ steps }) => (
    <div className="flex justify-center items-center mb-12">
        <div className="flex items-center space-x-4 md:space-x-8">
            {steps.map((step, index) => (
                <React.Fragment key={step.id}>
                    <div className="flex flex-col items-center">
                        <div
                            className={`w-16 h-16 rounded-full flex items-center justify-center text-white transition-all duration-300 ${step.active ? 'scale-110' : ''
                                }`}
                            style={{
                                backgroundColor: step.active ? '#1976D2' : '#81C784'
                            }}
                        >
                            <step.icon size={24} />
                        </div>
                        <span
                            className="mt-2 text-sm font-medium"
                            style={{
                                color: step.active ? '#1976D2' : '#2C3E50',
                                fontFamily: 'Inter, sans-serif'
                            }}
                        >
                            {step.title}
                        </span>
                    </div>
                    {index < steps.length - 1 && (
                        <div
                            className="h-1 w-12 md:w-20 rounded"
                            style={{ backgroundColor: '#81C784' }}
                        />
                    )}
                </React.Fragment>
            ))}
        </div>
    </div>
);