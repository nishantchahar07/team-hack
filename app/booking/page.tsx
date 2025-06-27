'use client'
import React, { useState, useCallback, useEffect } from 'react';
import { toast } from 'sonner';
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

interface NursePrediction {
    nurse_id: string;
    probability: number;
}

interface NurseWithDistance extends NurseData {
    distance?: number;
    probability: number;
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
    const [nurses, setNurses] = useState<NurseWithDistance[]>([]);
    const [, setSelectedNurse] = useState<NurseWithDistance | null>(null);
    const [loading, setLoading] = useState<boolean>(false);
    const [showNurseProfile, setShowNurseProfile] = useState<boolean>(false);
    const [userCoordinates, setUserCoordinates] = useState<{ lat: number; lng: number } | null>(null);

    const steps: Step[] = [
        { id: 1, title: 'Personal Info', icon: User, active: currentStep === 1 },
        { id: 2, title: 'Disease Info', icon: Stethoscope, active: currentStep === 2 },
        { id: 3, title: 'Symptoms', icon: HeartHandshake, active: currentStep === 3 },
        { id: 4, title: 'Pain & History', icon: Award, active: currentStep === 4 },
        { id: 5, title: 'Select Date', icon: Calendar, active: currentStep === 5 },
        { id: 6, title: 'Choose Time', icon: Clock, active: currentStep === 6 },
    ];

    const calculateDistance = useCallback((lat1: number, lng1: number, lat2: number, lng2: number): number => {
        const R = 6371; // Radius of the Earth in kilometers
        const dLat = (lat2 - lat1) * Math.PI / 180;
        const dLng = (lng2 - lng1) * Math.PI / 180;
        const a = 
            Math.sin(dLat / 2) * Math.sin(dLat / 2) +
            Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
            Math.sin(dLng / 2) * Math.sin(dLng / 2);
        const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
        return R * c; // Distance in kilometers
    }, []);

    const getUserLocation = useCallback((): Promise<GeolocationPosition> => {
        return new Promise((resolve, reject) => {
            if (!navigator.geolocation) {
                reject(new Error('Geolocation is not supported by this browser.'));
            } else {
                navigator.geolocation.getCurrentPosition(resolve, reject, {
                    enableHighAccuracy: true,
                    timeout: 10000,
                    maximumAge: 60000
                });
            }
        });
    }, []);

    useEffect(() => {
        const initializeLocation = async () => {
            try {
                const position = await getUserLocation();
                setUserCoordinates({
                    lat: position.coords.latitude,
                    lng: position.coords.longitude
                });
                toast.info('Location access granted for distance calculation');
            } catch (error) {
                console.warn('Could not get user location:', error);
                toast.warning('Location access denied. Distance calculation unavailable.');
            }
        };

        initializeLocation();
    }, [getUserLocation]);

    const fetchNurseData = useCallback(async (nursePredictions: NursePrediction[]): Promise<void> => {
        try {
            const ids = nursePredictions.map(pred => pred.nurse_id);
            console.log('Fetching data for nurse IDs:', ids);

            const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/nurses/get-many`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ ids }),
            });

            if (!response.ok) {
                throw new Error('Failed to fetch nurse data');
            }

            const data = await response.json();
            const nursesData: NurseData[] = data.data;

            const nursesWithProbability: NurseWithDistance[] = nursesData.map(nurse => {
                const prediction = nursePredictions.find(pred => pred.nurse_id === nurse.id);
                let distance: number | undefined;

                if (userCoordinates && nurse.Location) {
                    distance = calculateDistance(
                        userCoordinates.lat,
                        userCoordinates.lng,
                        nurse.Location.lat,
                        nurse.Location.lng
                    );
                }

                return {
                    ...nurse,
                    probability: prediction?.probability || 0,
                    distance
                };
            });

            const sortedNurses = nursesWithProbability.sort((a, b) => {
                if (a.probability !== b.probability) {
                    return b.probability - a.probability;
                }
                if (a.distance !== undefined && b.distance !== undefined) {
                    return a.distance - b.distance;
                }
                return 0;
            });

            setNurses(sortedNurses);
            setSelectedNurse(sortedNurses[0] || null);
            setShowNurseProfile(true);

            toast.success(`Found ${sortedNurses.length} qualified nurses for you!`);

        } catch (error) {
            console.error('Error fetching nurse data:', error);
            toast.error('Failed to fetch nurse information. Please try again.');
        }
    }, [userCoordinates, calculateDistance]);

    const submitFormData = useCallback(async (): Promise<void> => {
        setLoading(true);
        try {
            const payload = {
                disease: formData.disease,
                duration_months: formData.duration_months,
                symptoms: formData.symptoms,
                pain_level: formData.pain_level,
                prior_diagnosis: formData.prior_diagnosis,
                preferred_language: formData.preferred_language
            };

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
            
            const nursePredictions: NursePrediction[] = result.top_nurses;

            if (nursePredictions && nursePredictions.length > 0) {
                await fetchNurseData(nursePredictions);
            } else {
                throw new Error('No nurses found matching your criteria');
            }

        } catch (error) {
            console.error('Error submitting form:', error);
            toast.error('Failed to process your request. Please try again.');
        } finally {
            setLoading(false);
        }
    }, [formData, fetchNurseData]);

    const handleNext = useCallback(async (): Promise<void> => {
        if (currentStep < 6) {
            setCurrentStep(prev => prev + 1);
        } else if (currentStep === 6) {
            // Submit form data
            await submitFormData();
        }
    }, [currentStep, submitFormData]);

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

    if (showNurseProfile && nurses.length > 0) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 p-6">
                <div className="max-w-6xl mx-auto">
                    {/* Header */}
                    <div className="text-center mb-8">
                        <h1 className="text-4xl font-bold text-gray-800 mb-2">
                            Top Matching Nurses
                        </h1>
                        <p className="text-lg text-gray-600">
                            Found {nurses.length} qualified nurses ranked by compatibility and distance
                        </p>
                    </div>

                    {/* Nurses Grid */}
                    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                        {nurses.map((nurse, index) => (
                            <div
                                key={nurse.id}
                                className="bg-white rounded-3xl shadow-lg overflow-hidden hover:shadow-xl transition-all duration-300 cursor-pointer transform hover:-translate-y-1"
                                onClick={() => setSelectedNurse(nurse)}
                            >
                                {/* Rank Badge */}
                                <div className="relative">
                                    <div className="absolute top-4 left-4 z-10">
                                        <div className={`w-8 h-8 rounded-full flex items-center justify-center text-white font-bold text-sm ${
                                            index === 0 ? 'bg-yellow-500' : 
                                            index === 1 ? 'bg-gray-400' : 
                                            index === 2 ? 'bg-amber-600' : 'bg-blue-500'
                                        }`}>
                                            {index + 1}
                                        </div>
                                    </div>
                                    
                                    {/* Header Section */}
                                    <div className="bg-gradient-to-r from-blue-600 via-purple-600 to-pink-500 p-6 text-white">
                                        <div className="flex items-center space-x-3 mt-6">
                                            <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center">
                                                <User className="w-6 h-6 text-white" />
                                            </div>
                                            <div>
                                                <h3 className="text-xl font-bold">{nurse.name}</h3>
                                                <p className="text-blue-100">{nurse.specialization}</p>
                                            </div>
                                        </div>
                                        
                                        {/* Availability */}
                                        <div className="mt-4 flex justify-end">
                                            <div className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${
                                                nurse.available
                                                    ? 'bg-green-500/20 text-green-100 border border-green-400/30'
                                                    : 'bg-red-500/20 text-red-100 border border-red-400/30'
                                            }`}>
                                                <div className={`w-2 h-2 rounded-full mr-2 ${
                                                    nurse.available ? 'bg-green-400' : 'bg-red-400'
                                                }`}></div>
                                                {nurse.available ? 'Available' : 'Unavailable'}
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                {/* Content */}
                                <div className="p-6">
                                    {/* Stats */}
                                    <div className="grid grid-cols-2 gap-4 mb-4">
                                        <div className="text-center p-3 bg-blue-50 rounded-xl">
                                            <div className="text-lg font-bold text-blue-800">{nurse.experienceYears}y</div>
                                            <div className="text-xs text-blue-600">Experience</div>
                                        </div>
                                        <div className="text-center p-3 bg-purple-50 rounded-xl">
                                            <div className="text-lg font-bold text-purple-800 capitalize">{nurse.gender.toLowerCase()}</div>
                                            <div className="text-xs text-purple-600">Gender</div>
                                        </div>
                                        <div className="text-center p-3 bg-pink-50 rounded-xl">
                                            <div className="text-lg font-bold text-pink-800">{nurse.language}</div>
                                            <div className="text-xs text-pink-600">Language</div>
                                        </div>
                                        <div className="text-center p-3 bg-green-50 rounded-xl">
                                            <MapPin className="w-4 h-4 text-green-600 mx-auto mb-1" />
                                            <div className="text-lg font-bold text-green-800">
                                                {nurse.distance ? `${nurse.distance.toFixed(1)}km` : 'N/A'}
                                            </div>
                                            <div className="text-xs text-green-600">Distance</div>
                                        </div>
                                    </div>

                                    {/* Compatibility Score */}
                                    <div className="mb-4">
                                        <div className="flex justify-between items-center mb-2">
                                            <span className="text-sm font-medium text-gray-600">Match Score</span>
                                            <span className="text-sm font-bold text-gray-800">{(nurse.probability * 100).toFixed(1)}%</span>
                                        </div>
                                        <div className="w-full bg-gray-200 rounded-full h-2">
                                            <div 
                                                className="bg-gradient-to-r from-blue-500 to-purple-500 h-2 rounded-full transition-all duration-300"
                                                style={{ width: `${nurse.probability * 100}%` }}
                                            ></div>
                                        </div>
                                    </div>

                                    {/* Contact Info */}
                                    <div className="space-y-2 text-sm">
                                        <div className="flex items-center text-gray-600">
                                            <Phone className="w-4 h-4 mr-2" />
                                            {nurse.phone}
                                        </div>
                                        <div className="flex items-center text-gray-600">
                                            <Mail className="w-4 h-4 mr-2" />
                                            {nurse.email}
                                        </div>
                                        <div className="flex items-center text-gray-600">
                                            <MapPin className="w-4 h-4 mr-2" />
                                            {nurse.Location.address}
                                        </div>
                                    </div>

                                    {/* Action Button */}
                                    <button
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            setSelectedNurse(nurse);
                                            toast.success(`Selected ${nurse.name} as your nurse!`);
                                        }}
                                        className="w-full mt-4 bg-gradient-to-r from-blue-600 to-purple-600 text-white py-2 px-4 rounded-xl font-medium hover:from-blue-700 hover:to-purple-700 transition-all duration-200"
                                    >
                                        Select This Nurse
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* Back Button */}
                    <div className="text-center mt-8">
                        <button
                            onClick={() => {
                                setShowNurseProfile(false);
                                setNurses([]);
                                setSelectedNurse(null);
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
                            className="bg-white border-2 border-gray-300 text-gray-700 py-3 px-8 rounded-xl font-medium hover:border-gray-400 hover:bg-gray-50 transition-all duration-200"
                        >
                            Search Again
                        </button>
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
                </div>
            </div>
        </div>
    );
};

export default AppointmentBooking;