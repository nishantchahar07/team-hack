'use client';

import { useEffect, useState } from "react";

export default function Navbar() {

    const [isEmergencyActive, setIsEmergencyActive] = useState(false);

    const toggleEmergency = () => {
        setIsEmergencyActive(!isEmergencyActive);
        if (!isEmergencyActive) {
            playEmergencyAlert();
        }
    };


    useEffect(() => {
        const interval = setInterval(() => {
            if (!isEmergencyActive) {
                const toggle = document.querySelector('.emergency-toggle');
                if (toggle) {
                    toggle.classList.add('animate-pulse');
                    setTimeout(() => {
                        toggle.classList.remove('animate-pulse');
                    }, 2000);
                }
            }
        }, 5000);

        return () => clearInterval(interval);
    }, [isEmergencyActive]);

    const playEmergencyAlert = () => {
        try {
            const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
            const oscillator = audioContext.createOscillator();
            const gainNode = audioContext.createGain();

            oscillator.connect(gainNode);
            gainNode.connect(audioContext.destination);

            oscillator.frequency.setValueAtTime(800, audioContext.currentTime);
            gainNode.gain.setValueAtTime(0.1, audioContext.currentTime);

            oscillator.start();
            oscillator.stop(audioContext.currentTime + 0.5);
        } catch (error) {
            console.error('Error playing emergency alert sound:', error);
            console.log('Audio not supported');
        }
    };

    return (
        <div>
            <header className="glass-effect sticky top-0 z-50 shadow-lg">
                <div className="max-w-6xl mx-auto px-6 py-4 flex justify-between items-center">
                    <div className="flex items-center gap-3">
                        <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-green-400 rounded-xl flex items-center justify-center text-white text-2xl">
                            <i className="fas fa-heartbeat"></i>
                        </div>
                        <div>
                            <h1 className="text-2xl font-inter font-bold bg-gradient-to-r from-green-500 to-blue-600 bg-clip-text text-transparent">
                                HealthCare Pro
                            </h1>
                            <p className="text-sm text-slate-600">Your Health, Our Priority</p>
                        </div>
                    </div>

                    <div className="flex items-center gap-5">
                        <div className="emergency-toggle">
                            <div
                                className={`toggle-slider ${isEmergencyActive ? 'active' : ''}`}
                                onClick={toggleEmergency}
                            >
                                <span className="toggle-text off">Emergency</span>
                                <span className="toggle-text on">Active</span>
                            </div>
                        </div>

                        <button className="bg-gradient-to-r from-blue-600 to-blue-500 text-white px-6 py-3 rounded-full font-semibold hover:shadow-lg hover:-translate-y-0.5 transition-all duration-300 flex items-center gap-2">
                            <i className="fas fa-user"></i>
                            Sign In
                        </button>
                    </div>
                </div>
            </header>
            {isEmergencyActive && (
                <div className="fixed inset-0 bg-gradient-to-br from-red-600/95 to-red-500/95 backdrop-blur-md z-50 flex items-center justify-center text-white text-center emergency-overlay">
                    <div className="max-w-2xl mx-auto p-8">
                        <h1 className="text-6xl font-bold mb-4 drop-shadow-lg">
                            <i className="fas fa-exclamation-triangle"></i> EMERGENCY MODE
                        </h1>
                        <p className="text-2xl mb-8 drop-shadow">
                            Emergency services have been activated. Help is on the way. Stay calm and follow the instructions below.
                        </p>

                        <div className="flex flex-wrap gap-5 justify-center">
                            <button className="bg-white/20 border-2 border-white text-white px-6 py-4 rounded-full text-lg font-semibold hover:bg-white/30 transition-all duration-300 flex items-center gap-3">
                                <i className="fas fa-phone"></i>
                                Call 108
                            </button>
                            <button className="bg-white/20 border-2 border-white text-white px-6 py-4 rounded-full text-lg font-semibold hover:bg-white/30 transition-all duration-300 flex items-center gap-3">
                                <i className="fas fa-map-marker-alt"></i>
                                Share Location
                            </button>
                            <button className="bg-white/20 border-2 border-white text-white px-6 py-4 rounded-full text-lg font-semibold hover:bg-white/30 transition-all duration-300 flex items-center gap-3">
                                <i className="fas fa-user-md"></i>
                                Contact Doctor
                            </button>
                            <button
                                onClick={() => setIsEmergencyActive(false)}
                                className="bg-white/90 text-red-600 px-6 py-4 rounded-full text-lg font-semibold hover:bg-white transition-all duration-300 flex items-center gap-3"
                            >
                                <i className="fas fa-times"></i>
                                Deactivate
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    )
}