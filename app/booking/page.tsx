'use client'
import React, { useState, useCallback } from 'react';
import {
    User,
    Calendar,
    Clock,
    CheckCircle,
    MessageCircle,
} from 'lucide-react';
import { BOTTOM_NAVIGATION, FormData, INITIAL_NOTIFICATIONS, NAVIGATION_ITEMS, NavigationItem, Notification, Step } from '@/types/booking';
import { NavigationButton } from '@/component/NavigationButton';
import { StepIndicator } from '@/component/StepIndicator';
import { FormStep } from '@/component/FormStep';
import { NotificationCard } from '@/component/NotificationCard';

const AppointmentBooking: React.FC = () => {
    const [currentStep, setCurrentStep] = useState<number>(1);
    const [formData, setFormData] = useState<FormData>({
        name: '',
        date: '',
        time: '',
    });
    const [notifications, setNotifications] = useState<Notification[]>(INITIAL_NOTIFICATIONS);

    const steps: Step[] = [
        { id: 1, title: 'Personal Info', icon: User, active: currentStep === 1 },
        { id: 2, title: 'Select Date', icon: Calendar, active: currentStep === 2 },
        { id: 3, title: 'Choose Time', icon: Clock, active: currentStep === 3 },
        { id: 4, title: 'Confirmation', icon: CheckCircle, active: currentStep === 4 },
    ];

    const handleNext = useCallback((): void => {
        if (currentStep < 4) {
            setCurrentStep(prev => prev + 1);
        }
    }, [currentStep]);

    const handlePrevious = useCallback((): void => {
        if (currentStep > 1) {
            setCurrentStep(prev => prev - 1);
        }
    }, [currentStep]);

    const handleInputChange = useCallback((field: keyof FormData, value: string): void => {
        setFormData(prev => ({
            ...prev,
            [field]: value
        }));
    }, []);

    const dismissNotification = useCallback((id: number): void => {
        setNotifications(prev => prev.filter(notif => notif.id !== id));
    }, []);

    const handleNavigationClick = useCallback((item: NavigationItem): void => {
        console.log(`Navigating to ${item.label}`);
        // Add navigation logic here
    }, []);

    return (
        <div className="min-h-screen" style={{ backgroundColor: '#F5F7FA' }}>
            {/* Top Navigation Bar */}
            <nav className="bg-white shadow-sm border-b border-gray-100">
                <div className="container mx-auto px-4 py-3">
                    <div className="flex items-center justify-between">
                        {/* Left - Chat Icon */}
                        <div className="flex items-center">
                            <div
                                className="w-12 h-12 rounded-full flex items-center justify-center text-white shadow-md"
                                style={{ background: 'linear-gradient(135deg, #4CAF50 0%, #1976D2 100%)' }}
                            >
                                <MessageCircle size={20} />
                            </div>
                        </div>

                        {/* Right - Navigation Icons */}
                        <div className="flex items-center space-x-3">
                            {NAVIGATION_ITEMS.map((item, index) => (
                                <NavigationButton
                                    key={index}
                                    item={item}
                                    onClick={() => handleNavigationClick(item)}
                                />
                            ))}
                        </div>
                    </div>
                </div>
            </nav>

            <div className="container mx-auto px-4 py-8">
                <div className="relative">

                    <div className="text-center mb-12">
                        <h1 className="text-4xl font-bold mb-4" style={{ color: '#1976D2', fontFamily: 'Inter, sans-serif' }}>
                            Book Your Appointment
                        </h1>
                        <p className="text-lg" style={{ color: '#2C3E50', fontFamily: 'Open Sans, sans-serif' }}>
                            Let's get you the best care plan in just a few steps
                        </p>
                    </div>

                    <StepIndicator steps={steps} />

                    <div className="max-w-2xl mx-auto">
                        <div className="bg-white rounded-2xl shadow-lg p-8 mb-8">
                            <div className="flex items-center mb-6">
                                <div
                                    className="w-12 h-12 rounded-full flex items-center justify-center text-white mr-4"
                                    style={{ backgroundColor: '#1976D2' }}
                                >
                                    <User size={20} />
                                </div>
                                <h2 className="text-xl font-semibold" style={{ color: '#2C3E50', fontFamily: 'Inter, sans-serif' }}>
                                    Hi! Let's get you the best care plan. What's your name?
                                </h2>
                            </div>

                            <FormStep
                                currentStep={currentStep}
                                formData={formData}
                                onInputChange={handleInputChange}
                            />


                            <div className="flex justify-between mt-8">
                                <button
                                    onClick={handlePrevious}
                                    disabled={currentStep === 1}
                                    className="px-6 py-3 rounded-lg font-medium transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                                    style={{
                                        color: '#2C3E50',
                                        fontFamily: 'Inter, sans-serif',
                                        backgroundColor: 'transparent'
                                    }}
                                >
                                    Previous
                                </button>

                                {currentStep < 4 && (
                                    <button
                                        onClick={handleNext}
                                        className="px-8 py-3 rounded-lg font-medium text-white transition-all hover:opacity-90 transform hover:scale-105"
                                        style={{
                                            backgroundColor: '#1976D2',
                                            fontFamily: 'Inter, sans-serif'
                                        }}
                                    >
                                        Next
                                    </button>
                                )}
                            </div>
                        </div>

                        {/* Bottom Navigation Cards */}
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                            {BOTTOM_NAVIGATION.map((item, index) => {
                                const Icon = item.icon;
                                return (
                                    <div
                                        key={index}
                                        className="p-4 rounded-xl text-center text-white transition-all hover:scale-105 cursor-pointer"
                                        style={{ backgroundColor: item.color }}
                                        onClick={() => handleNavigationClick(item)}
                                        role="button"
                                        tabIndex={0}
                                        onKeyDown={(e) => {
                                            if (e.key === 'Enter' || e.key === ' ') {
                                                handleNavigationClick(item);
                                            }
                                        }}
                                    >
                                        <Icon size={24} className="mx-auto mb-2" />
                                        <span className="text-sm font-medium" style={{ fontFamily: 'Inter, sans-serif' }}>
                                            {item.label}
                                        </span>
                                    </div>
                                );
                            })}
                        </div>
                    </div>


                    <div className="fixed top-20 right-4 space-y-3 z-50 hidden md:block">
                        {notifications.map((notification) => (
                            <NotificationCard
                                key={notification.id}
                                notification={notification}
                                onDismiss={dismissNotification}
                            />
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AppointmentBooking;