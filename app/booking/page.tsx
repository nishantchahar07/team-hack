'use client'
import React, { useState, useCallback } from 'react';
import {
    User,
    Calendar,
    Clock,
    MessageCircle,
    MapPin,
    Phone,
    Mail,
    Award,
    HeartHandshake,
    Stethoscope
} from 'lucide-react';

// Types
interface FormData {
    name: string;
    age: string;
    gender: string;
    disease: string;
    duration_months: number;
    symptoms: string;
    pain_level: number;
    prior_diagnosis: string;
    preferred_language: string;
    location: string;
    date: string;
    time: string;
}

interface Step {
    id: number;
    title: string;
    icon: any;
    active: boolean;
}

interface Notification {
    id: number;
    message: string;
    type: 'success' | 'info' | 'warning';
}

interface NurseData {
    id: string;
    name: string;
    specialization: string;
    experienceYears: number;
    language: string;
    gender: string;
    phone: string;
    email: string;
    available: boolean;
    Location: {
        id: string;
        lat: number;
        lng: number;
        address: string;
    };
}

interface NavigationItem {
    label: string;
    icon: any;
    color: string;
}

const BOTTOM_NAVIGATION: NavigationItem[] = [
    { label: 'Emergency', icon: HeartHandshake, color: '#F44336' },
    { label: 'Consultation', icon: Stethoscope, color: '#2196F3' },
    { label: 'Appointment', icon: Calendar, color: '#4CAF50' },
    { label: 'Support', icon: MessageCircle, color: '#9C27B0' },
];

const INITIAL_NOTIFICATIONS: Notification[] = [
    { id: 1, message: 'Your appointment request is being processed', type: 'info' },
    { id: 2, message: 'Please complete all required fields', type: 'warning' },
];

const AppointmentBooking: React.FC = () => {
    const [currentStep, setCurrentStep] = useState<number>(1);
    const [formData, setFormData] = useState<FormData>({
        name: '',
        age: '',
        gender: '',
        disease: '',
        duration_months: 0,
        symptoms: '',
        pain_level: 0,
        prior_diagnosis: '',
        preferred_language: '',
        location: '',
        date: '',
        time: '',
    });
    const [notifications, setNotifications] = useState<Notification[]>(INITIAL_NOTIFICATIONS);
    const [nurseData, setNurseData] = useState<NurseData | null>(null);
    const [loading, setLoading] = useState<boolean>(false);
    const [showNurseProfile, setShowNurseProfile] = useState<boolean>(false);

    const steps: Step[] = [
        { id: 1, title: 'Personal Info', icon: User, active: currentStep === 1 },
        { id: 2, title: 'Disease Info', icon: Stethoscope, active: currentStep === 2 },
        { id: 3, title: 'Symptoms', icon: HeartHandshake, active: currentStep === 3 },
        { id: 4, title: 'Pain & History', icon: Award, active: currentStep === 4 },
        { id: 5, title: 'Select Date', icon: Calendar, active: currentStep === 5 },
        { id: 6, title: 'Choose Time', icon: Clock, active: currentStep === 6 },
    ];

    const handleNext = useCallback(async (): Promise<void> => {
        if (currentStep < 6) {
            setCurrentStep(prev => prev + 1);
        } else if (currentStep === 6) {
            // Submit form data
            await submitFormData();
        }
    }, [currentStep]);

    const handlePrevious = useCallback((): void => {
        if (currentStep > 1) {
            setCurrentStep(prev => prev - 1);
        }
    }, [currentStep]);

    const handleInputChange = useCallback((field: keyof FormData, value: string | number): void => {
        setFormData(prev => ({
            ...prev,
            [field]: value
        }));
    }, []);

    const submitFormData = async (): Promise<void> => {
        setLoading(true);
        try {
            // Prepare payload for prediction endpoint
            const payload = {
                disease: formData.disease,
                duration_months: formData.duration_months,
                symptoms: formData.symptoms,
                pain_level: formData.pain_level,
                prior_diagnosis: formData.prior_diagnosis,
                preferred_language: formData.preferred_language
            };

            // Send data to prediction endpoint
            const response = await fetch(`${process.env.NEXT_PUBLIC_SERVER_URL}/predict`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(payload),
            });

            if (!response.ok) {
                throw new Error('Failed to submit form data');
            }

            const result = await response.json();
            const id = result.prediction;
            console.log('Prediction result:', result);

            if (id) {
                await fetchNurseData(id);
            } else {
                throw new Error('No valid ID returned from prediction');
            }

        } catch (error) {
            console.error('Error submitting form:', error);
            setNotifications(prev => [...prev, {
                id: Date.now(),
                message: 'Failed to process your request. Please try again.',
                type: 'warning'
            }]);
        } finally {
            setLoading(false);
        }
    };

    const fetchNurseData = async (id: string): Promise<void> => {
        try {
            const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/nurses/${id}`);

            if (!response.ok) {
                throw new Error('Failed to fetch nurse data');
            }

            const data = await response.json();
            setNurseData(data.data || data);
            setShowNurseProfile(true);

            setNotifications(prev => [...prev, {
                id: Date.now(),
                message: 'Great! We found the perfect nurse for you.',
                type: 'success'
            }]);

        } catch (error) {
            console.error('Error fetching nurse data:', error);
            setNotifications(prev => [...prev, {
                id: Date.now(),
                message: 'Failed to fetch nurse information. Please try again.',
                type: 'warning'
            }]);
        }
    };

    const dismissNotification = useCallback((id: number): void => {
        setNotifications(prev => prev.filter(notif => notif.id !== id));
    }, []);

    const handleNavigationClick = useCallback((item: NavigationItem): void => {
        console.log(`Navigating to ${item.label}`);
    }, []);

    const renderFormStep = () => {
        switch (currentStep) {
            case 1:
                return (
                    <div className="space-y-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">Full Name</label>
                            <input
                                type="text"
                                value={formData.name}
                                onChange={(e) => handleInputChange('name', e.target.value)}
                                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                placeholder="Enter your full name"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">Age</label>
                            <input
                                type="number"
                                value={formData.age}
                                onChange={(e) => handleInputChange('age', e.target.value)}
                                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                placeholder="Enter your age"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">Gender</label>
                            <select
                                value={formData.gender}
                                onChange={(e) => handleInputChange('gender', e.target.value)}
                                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            >
                                <option value="">Select Gender</option>
                                <option value="male">Male</option>
                                <option value="female">Female</option>
                                <option value="other">Other</option>
                            </select>
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">Location</label>
                            <input
                                type="text"
                                value={formData.location}
                                onChange={(e) => handleInputChange('location', e.target.value)}
                                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                placeholder="Enter your location or address"
                            />
                        </div>
                    </div>
                );
            case 2:
                return (
                    <div className="space-y-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">Disease/Condition</label>
                            <input
                                type="text"
                                value={formData.disease}
                                onChange={(e) => handleInputChange('disease', e.target.value)}
                                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                placeholder="e.g., Hypertension, Diabetes, etc."
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">Duration (in months)</label>
                            <input
                                type="number"
                                value={formData.duration_months}
                                onChange={(e) => handleInputChange('duration_months', parseInt(e.target.value) || 0)}
                                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                placeholder="How long have you had this condition?"
                                min="0"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">Preferred Language</label>
                            <select
                                value={formData.preferred_language}
                                onChange={(e) => handleInputChange('preferred_language', e.target.value)}
                                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            >
                                <option value="">Select Language</option>
                                <option value="English">English</option>
                                <option value="Hindi">Hindi</option>
                                <option value="Bengali">Bengali</option>
                                <option value="Tamil">Tamil</option>
                                <option value="Telugu">Telugu</option>
                                <option value="Marathi">Marathi</option>
                                <option value="Gujarati">Gujarati</option>
                            </select>
                        </div>
                    </div>
                );
            case 3:
                return (
                    <div className="space-y-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">Symptoms</label>
                            <textarea
                                value={formData.symptoms}
                                onChange={(e) => handleInputChange('symptoms', e.target.value)}
                                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                placeholder="Enter symptoms separated by commas (e.g., nausea,frequent urination,light sensitivity,stiffness)"
                                rows={4}
                            />
                            <p className="text-sm text-gray-500 mt-1">
                                Please separate multiple symptoms with commas
                            </p>
                        </div>
                    </div>
                );
            case 4:
                return (
                    <div className="space-y-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">Pain Level (1-10)</label>
                            <input
                                type="range"
                                min="1"
                                max="10"
                                value={formData.pain_level}
                                onChange={(e) => handleInputChange('pain_level', parseInt(e.target.value))}
                                className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
                            />
                            <div className="flex justify-between text-sm text-gray-500">
                                <span>1 (Mild)</span>
                                <span className="font-semibold text-blue-600">{formData.pain_level}</span>
                                <span>10 (Severe)</span>
                            </div>
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">Prior Diagnosis</label>
                            <select
                                value={formData.prior_diagnosis}
                                onChange={(e) => handleInputChange('prior_diagnosis', e.target.value)}
                                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            >
                                <option value="">Have you been diagnosed before?</option>
                                <option value="Yes">Yes</option>
                                <option value="No">No</option>
                            </select>
                        </div>
                    </div>
                );
            case 5:
                return (
                    <div className="space-y-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">Preferred Date</label>
                            <input
                                type="date"
                                value={formData.date}
                                onChange={(e) => handleInputChange('date', e.target.value)}
                                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                min={new Date().toISOString().split('T')[0]}
                            />
                        </div>
                    </div>
                );
            case 6:
                return (
                    <div className="space-y-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">Preferred Time</label>
                            <select
                                value={formData.time}
                                onChange={(e) => handleInputChange('time', e.target.value)}
                                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            >
                                <option value="">Select Time</option>
                                <option value="09:00">9:00 AM</option>
                                <option value="10:00">10:00 AM</option>
                                <option value="11:00">11:00 AM</option>
                                <option value="14:00">2:00 PM</option>
                                <option value="15:00">3:00 PM</option>
                                <option value="16:00">4:00 PM</option>
                                <option value="17:00">5:00 PM</option>
                            </select>
                        </div>
                    </div>
                );
            default:
                return null;
        }
    };

    if (showNurseProfile && nurseData) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 p-6 flex items-center justify-center">
                <div className="max-w-2xl w-full">
                    {/* Main Card */}
                    <div className="bg-white rounded-3xl shadow-2xl overflow-hidden backdrop-blur-sm border border-gray-100">
                        {/* Header Section */}
                        <div className="relative bg-gradient-to-r from-blue-600 via-purple-600 to-pink-500 p-8 text-white">
                            <div className="absolute inset-0 bg-black opacity-10"></div>
                            <div className="relative z-10">
                                <div className="flex items-start justify-between">
                                    <div className="flex items-center space-x-4">
                                        <div className="w-20 h-20 bg-white/20 rounded-full flex items-center justify-center backdrop-blur-sm border border-white/30">
                                            <User className="w-10 h-10 text-white" />
                                        </div>
                                        <div>
                                            <h1 className="text-3xl font-bold mb-1">{nurseData.name}</h1>
                                            <p className="text-blue-100 text-lg font-medium">{nurseData.specialization} Specialist</p>
                                            <p className="text-blue-200 text-sm">{nurseData.experienceYears} years of experience</p>
                                        </div>
                                    </div>
                                    <div className="text-right">
                                        <div className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${nurseData.available
                                                ? 'bg-green-500/20 text-green-100 border border-green-400/30'
                                                : 'bg-red-500/20 text-red-100 border border-red-400/30'
                                            }`}>
                                            <div className={`w-2 h-2 rounded-full mr-2 ${nurseData.available ? 'bg-green-400' : 'bg-red-400'
                                                }`}></div>
                                            {nurseData.available ? 'Available' : 'Unavailable'}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Content Section */}
                        <div className="p-8">
                            {/* Stats Row */}
                            <div className="grid grid-cols-3 gap-6 mb-8">
                                <div className="text-center p-4 bg-gradient-to-br from-blue-50 to-blue-100 rounded-2xl border border-blue-200">
                                    <Award className="w-8 h-8 text-blue-600 mx-auto mb-2" />
                                    <div className="text-2xl font-bold text-blue-800">{nurseData.experienceYears}</div>
                                    <div className="text-sm text-blue-600 font-medium">Years Experience</div>
                                </div>
                                <div className="text-center p-4 bg-gradient-to-br from-purple-50 to-purple-100 rounded-2xl border border-purple-200">
                                    <User className="w-8 h-8 text-purple-600 mx-auto mb-2" />
                                    <div className="text-lg font-bold text-purple-800 capitalize">{nurseData.gender.toLowerCase()}</div>
                                    <div className="text-sm text-purple-600 font-medium">Gender</div>
                                </div>
                                <div className="text-center p-4 bg-gradient-to-br from-pink-50 to-pink-100 rounded-2xl border border-pink-200">
                                    <div className="text-lg font-bold text-pink-800">{nurseData.language}</div>
                                    <div className="text-sm text-pink-600 font-medium">Language</div>
                                </div>
                            </div>

                            {/* Contact Information */}
                            <div className="space-y-4 mb-8">
                                <h3 className="text-xl font-bold text-gray-800 mb-4 flex items-center">
                                    <Clock className="w-5 h-5 mr-2 text-blue-600" />
                                    Contact Information
                                </h3>

                                <div className="grid gap-4">
                                    <div className="flex items-center p-4 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors">
                                        <Phone className="w-5 h-5 text-green-600 mr-4" />
                                        <div>
                                            <div className="font-medium text-gray-800">Phone</div>
                                            <div className="text-gray-600">{nurseData.phone}</div>
                                        </div>
                                    </div>

                                    <div className="flex items-center p-4 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors">
                                        <Mail className="w-5 h-5 text-blue-600 mr-4" />
                                        <div>
                                            <div className="font-medium text-gray-800">Email</div>
                                            <div className="text-gray-600">{nurseData.email}</div>
                                        </div>
                                    </div>

                                    <div className="flex items-center p-4 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors">
                                        <MapPin className="w-5 h-5 text-red-600 mr-4" />
                                        <div>
                                            <div className="font-medium text-gray-800">Location</div>
                                            <div className="text-gray-600">{nurseData.Location.address}</div>
                                            <div className="text-sm text-gray-500">
                                                Coordinates: {nurseData.Location.lat}, {nurseData.Location.lng}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Action Buttons */}
                            <div className="flex gap-4 mt-8">
                                <button className="flex-1 bg-gradient-to-r from-blue-600 to-purple-600 text-white py-3 px-6 rounded-xl font-medium hover:from-blue-700 hover:to-purple-700 transition-all duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5">
                                    Contact Nurse
                                </button>
                                <button
                                    onClick={() => {
                                        setShowNurseProfile(false);
                                        setCurrentStep(1);
                                        setFormData({
                                            name: '',
                                            age: '',
                                            gender: '',
                                            disease: '',
                                            duration_months: 0,
                                            symptoms: '',
                                            pain_level: 0,
                                            prior_diagnosis: '',
                                            preferred_language: '',
                                            location: '',
                                            date: '',
                                            time: '',
                                        });
                                    }}
                                    className="flex-1 bg-white border-2 border-gray-300 text-gray-700 py-3 px-6 rounded-xl font-medium hover:border-gray-400 hover:bg-gray-50 transition-all duration-200"
                                >
                                    Book Another
                                </button>
                            </div>
                        </div>
                    </div>

                    {/* Profile ID Footer */}
                    <div className="mt-4 text-center">
                        <p className="text-sm text-gray-500">
                            Profile ID: <span className="font-mono text-gray-600">{nurseData.id}</span>
                        </p>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen" style={{ backgroundColor: '#F5F7FA' }}>
            {/* Top Navigation Bar */}

            <div className="container mx-auto px-4 py-8">
                <div className="relative">
                    <div className="text-center mb-12">
                        <h1 className="text-4xl font-bold mb-4" style={{ color: '#1976D2', fontFamily: 'Inter, sans-serif' }}>
                            Book Your Appointment
                        </h1>
                        <p className="text-lg" style={{ color: '#2C3E50', fontFamily: 'Open Sans, sans-serif' }}>
                            Let&apos;s get you the best care plan in just a few steps
                        </p>
                    </div>

                    {/* Step Indicator */}
                    <div className="flex justify-center mb-8">
                        <div className="flex items-center space-x-4">
                            {steps.map((step, index) => {
                                const Icon = step.icon;
                                return (
                                    <div key={step.id} className="flex items-center">
                                        <div className={`w-10 h-10 rounded-full flex items-center justify-center ${step.active
                                                ? 'bg-blue-600 text-white'
                                                : currentStep > step.id
                                                    ? 'bg-green-500 text-white'
                                                    : 'bg-gray-200 text-gray-400'
                                            }`}>
                                            <Icon size={20} />
                                        </div>
                                        {index < steps.length - 1 && (
                                            <div className={`w-8 h-0.5 mx-2 ${currentStep > step.id ? 'bg-green-500' : 'bg-gray-200'
                                                }`} />
                                        )}
                                    </div>
                                );
                            })}
                        </div>
                    </div>

                    <div className="max-w-2xl mx-auto">
                        <div className="bg-white rounded-2xl shadow-lg p-8 mb-8">
                            <div className="flex items-center mb-6">
                                <div
                                    className="w-12 h-12 rounded-full flex items-center justify-center text-white mr-4"
                                    style={{ backgroundColor: '#1976D2' }}
                                >
                                    {React.createElement(steps[currentStep - 1].icon, { size: 20 })}
                                </div>
                                <h2 className="text-xl font-semibold" style={{ color: '#2C3E50', fontFamily: 'Inter, sans-serif' }}>
                                    Step {currentStep}: {steps[currentStep - 1].title}
                                </h2>
                            </div>

                            {renderFormStep()}

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

                                <button
                                    onClick={handleNext}
                                    disabled={loading}
                                    className="px-8 py-3 rounded-lg font-medium text-white transition-all hover:opacity-90 transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed"
                                    style={{
                                        backgroundColor: '#1976D2',
                                        fontFamily: 'Inter, sans-serif'
                                    }}
                                >
                                    {loading ? 'Processing...' : currentStep === 6 ? 'Find My Nurse' : 'Next'}
                                </button>
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

                    {/* Notifications */}
                    <div className="fixed top-20 right-4 space-y-3 z-50 hidden md:block">
                        {notifications.map((notification) => (
                            <div
                                key={notification.id}
                                className={`p-4 rounded-lg shadow-lg border-l-4 bg-white max-w-sm ${notification.type === 'success' ? 'border-green-500' :
                                        notification.type === 'warning' ? 'border-yellow-500' :
                                            'border-blue-500'
                                    }`}
                            >
                                <div className="flex justify-between items-start">
                                    <p className="text-sm text-gray-700">{notification.message}</p>
                                    <button
                                        onClick={() => dismissNotification(notification.id)}
                                        className="ml-2 text-gray-400 hover:text-gray-600"
                                    >
                                        ×
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AppointmentBooking;