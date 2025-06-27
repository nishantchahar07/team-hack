'use client'

import { Notification } from '@/types/notification';
import React, { useState, useEffect } from 'react';


const HealthCarePro: React.FC = () => {
  const [isEmergencyActive, setIsEmergencyActive] = useState(false);
  const [activeFAQ, setActiveFAQ] = useState<number | null>(null);
  const [notifications, setNotifications] = useState<Notification[]>([
    { id: 1, title: 'Take evening medicine', time: '6:00 PM' },
    { id: 2, title: 'Tele check-up scheduled', time: 'Tomorrow 10 AM' }
  ]);

  const toggleEmergency = () => {
    setIsEmergencyActive(!isEmergencyActive);
    if (!isEmergencyActive) {
      playEmergencyAlert();
    }
  };

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
      console.log('Audio not supported');
    }
  };

  const toggleFAQ = (index: number) => {
    setActiveFAQ(activeFAQ === index ? null : index);
  };

  const closeNotification = (id: number) => {
    setNotifications(notifications.filter(n => n.id !== id));
  };

  const faqItems = [
    {
      question: "What is HealthCare Pro and how does it work?",
      answer: "HealthCare Pro is an AI-powered healthcare platform that provides personalized medical care, real-time nurse tracking, and 24/7 emergency services. Our platform uses advanced algorithms to create customized health plans and connects you with qualified healthcare professionals."
    },
    {
      question: "How does the AI health plan feature work?",
      answer: "Our AI analyzes your health data, medical history, and current conditions to create personalized care plans. These plans adapt in real-time based on your progress, symptoms, and feedback, ensuring optimal health outcomes."
    },
    {
      question: "Is the nurse tracking feature safe and secure?",
      answer: "Yes, absolutely. All location data is encrypted and only shared between you and your assigned nurse. We follow strict privacy protocols and comply with healthcare data protection regulations to ensure your information remains secure."
    },
    {
      question: "What happens when I activate emergency mode?",
      answer: "When emergency mode is activated, our system immediately connects you to the nearest available nurse and emergency services. Your location is shared with the response team, and you'll receive step-by-step guidance until help arrives."
    },
    {
      question: "How much does HealthCare Pro cost?",
      answer: "We offer flexible pricing plans starting from ₹999/month for basic care, ₹1,999/month for premium features, and ₹2,999/month for comprehensive care with 24/7 support. Contact us for enterprise and family plan options."
    },
    {
      question: "Can I cancel my subscription at any time?",
      answer: "Yes, you can cancel your subscription at any time without any penalties. Your service will continue until the end of your current billing period, and you'll retain access to your health data even after cancellation."
    }
  ];

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

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-100 text-slate-800">
      <style jsx>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&family=Open+Sans:wght@300;400;500;600&display=swap');
        
        .font-inter { font-family: 'Inter', sans-serif; }
        .font-open-sans { font-family: 'Open Sans', sans-serif; }
        
        .glass-effect {
          background: rgba(255, 255, 255, 0.95);
          backdrop-filter: blur(10px);
          border: 1px solid rgba(255, 255, 255, 0.2);
        }
        
        .emergency-toggle {
          position: relative;
          display: inline-block;
        }
        
        .toggle-slider {
          position: relative;
          display: inline-block;
          width: 90px;
          height: 36px;
          background: linear-gradient(135deg, #ff6b6b, #ee5a24);
          border-radius: 18px;
          cursor: pointer;
          transition: all 0.3s ease;
          box-shadow: 0 3px 12px rgba(238, 90, 36, 0.3);
        }
        
        .toggle-slider::before {
          position: absolute;
          content: "";
          height: 30px;
          width: 30px;
          left: 3px;
          top: 3px;
          background: white;
          border-radius: 50%;
          transition: 0.3s;
          box-shadow: 0 2px 8px rgba(0, 0, 0, 0.2);
        }
        
        .toggle-slider.active {
          background: linear-gradient(135deg, #4CAF50, #81C784);
          box-shadow: 0 3px 12px rgba(76, 175, 80, 0.3);
        }
        
        .toggle-slider.active::before {
          transform: translateX(54px);
        }
        
        .toggle-text {
          position: absolute;
          top: 50%;
          transform: translateY(-50%);
          font-size: 10px;
          font-weight: 600;
          color: white;
          transition: opacity 0.3s;
        }
        
        .toggle-text.off {
          left: 8px;
        }
        
        .toggle-text.on {
          right: 8px;
          opacity: 0;
        }
        
        .toggle-slider.active .toggle-text.off {
          opacity: 0;
        }
        
        .toggle-slider.active .toggle-text.on {
          opacity: 1;
        }
        
        .emergency-overlay {
          animation: emergencyPulse 1s infinite alternate;
        }
        
        @keyframes emergencyPulse {
          0% { opacity: 0.9; }
          100% { opacity: 1; }
        }
        
        .notification-enter {
          animation: slideIn 0.3s ease;
        }
        
        @keyframes slideIn {
          from {
            transform: translateX(100%);
            opacity: 0;
          }
          to {
            transform: translateX(0);
            opacity: 1;
          }
        }
      `}</style>

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

    
      <div className="fixed top-28 right-8 z-40 space-y-4">
        {notifications.map((notification) => (
          <div key={notification.id} className="glass-effect rounded-2xl p-5 min-w-80 shadow-xl border-l-4 border-yellow-400 notification-enter">
            <button
              onClick={() => closeNotification(notification.id)}
              className="absolute top-3 right-4 text-slate-400 hover:text-slate-600"
            >
              ×
            </button>
            <div className="font-semibold text-slate-800 mb-1">{notification.title}</div>
            <div className="text-sm text-slate-600">{notification.time}</div>
          </div>
        ))}
      </div>

      <main className="max-w-6xl mx-auto px-6 py-16">
        
        <section className="text-center mb-16">
          <h1 className="text-5xl md:text-6xl font-inter font-bold mb-6 bg-gradient-to-r from-slate-800 to-blue-600 bg-clip-text text-transparent">
            Smart Healthcare at Your Fingertips
          </h1>
          <p className="text-xl text-slate-600 mb-12 max-w-2xl mx-auto">
            Experience personalized care with AI-powered health plans, real-time nurse tracking,
            and 24/7 emergency support
          </p>

          <div className="flex flex-col sm:flex-row gap-5 justify-center mb-16">
            <button className="bg-gradient-to-r from-green-500 to-green-400 text-white px-8 py-4 rounded-full text-lg font-semibold hover:shadow-xl hover:-translate-y-1 transition-all duration-300 flex items-center gap-3 justify-center">
              <i className="fas fa-calendar-plus"></i>
              Book Appointment
            </button>
            <button className="glass-effect text-slate-800 px-8 py-4 rounded-full text-lg font-semibold hover:shadow-xl hover:-translate-y-1 transition-all duration-300 flex items-center gap-3 justify-center">
              <i className="fas fa-robot"></i>
              Talk to AI Assistant
            </button>
          </div>
        </section>

        <section className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
          <div className="glass-effect rounded-3xl p-8 shadow-xl hover:shadow-2xl hover:-translate-y-2 transition-all duration-300">
            <div className="w-16 h-16 bg-gradient-to-br from-blue-600 to-blue-400 rounded-2xl flex items-center justify-center text-white text-3xl mb-6">
              <i className="fas fa-calendar-alt"></i>
            </div>
            <h3 className="text-2xl font-inter font-bold mb-4 text-slate-800">Smart Care Plans</h3>
            <p className="text-slate-600 leading-relaxed">
              AI-generated personalized care plans that adapt to your health conditions and needs
            </p>
          </div>

          <div className="glass-effect rounded-3xl p-8 shadow-xl hover:shadow-2xl hover:-translate-y-2 transition-all duration-300">
            <div className="w-16 h-16 bg-gradient-to-br from-green-500 to-green-400 rounded-2xl flex items-center justify-center text-white text-3xl mb-6">
              <i className="fas fa-map-marker-alt"></i>
            </div>
            <h3 className="text-2xl font-inter font-bold mb-4 text-slate-800">Live Nurse Tracking</h3>
            <p className="text-slate-600 leading-relaxed">
              Real-time GPS tracking of your assigned nurse with accurate arrival predictions
            </p>
          </div>

          <div className="glass-effect rounded-3xl p-8 shadow-xl hover:shadow-2xl hover:-translate-y-2 transition-all duration-300">
            <div className="w-16 h-16 bg-gradient-to-br from-red-500 to-red-400 rounded-2xl flex items-center justify-center text-white text-3xl mb-6">
              <i className="fas fa-shield-alt"></i>
            </div>
            <h3 className="text-2xl font-inter font-bold mb-4 text-slate-800">24/7 Emergency</h3>
            <p className="text-slate-600 leading-relaxed">
              Instant emergency response with nearest nurse and ambulance dispatch
            </p>
          </div>
        </section>

      
        <section className="mb-16">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-inter font-bold text-slate-800 mb-4">Frequently Asked Questions</h2>
            <p className="text-lg text-slate-600 max-w-lg mx-auto">Everything you need to know about HealthCare Pro</p>
          </div>

          <div className="max-w-4xl mx-auto space-y-4">
            {faqItems.map((item, index) => (
              <div key={index} className="glass-effect rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300">
                <div
                  className="p-6 cursor-pointer flex justify-between items-center hover:bg-green-50 rounded-2xl transition-colors"
                  onClick={() => toggleFAQ(index)}
                >
                  <span className="font-semibold text-slate-800 flex-1 mr-4">{item.question}</span>
                  <i className={`fas fa-chevron-down text-green-500 transition-transform duration-300 ${activeFAQ === index ? 'rotate-180' : ''}`}></i>
                </div>
                <div className={`overflow-hidden transition-all duration-300 ${activeFAQ === index ? 'max-h-48 pb-6' : 'max-h-0'}`}>
                  <div className="px-6 text-slate-600 leading-relaxed">
                    {item.answer}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>
      </main>

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

      <footer className="bg-gradient-to-r from-slate-800 to-slate-700 text-white mt-16">
        <div className="max-w-6xl mx-auto px-6 py-12">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <h3 className="text-xl font-bold mb-4 text-green-400">HealthCare Pro</h3>
              <p className="text-slate-300 mb-4">
                Your trusted partner in health and wellness. Providing innovative healthcare solutions with cutting-edge technology and compassionate care.
              </p>
              <div className="flex gap-4">
                <a href="#" className="w-10 h-10 bg-green-500/20 rounded-full flex items-center justify-center text-green-400 hover:bg-green-500 hover:text-white transition-colors">
                  <i className="fab fa-facebook-f"></i>
                </a>
                <a href="#" className="w-10 h-10 bg-green-500/20 rounded-full flex items-center justify-center text-green-400 hover:bg-green-500 hover:text-white transition-colors">
                  <i className="fab fa-twitter"></i>
                </a>
                <a href="#" className="w-10 h-10 bg-green-500/20 rounded-full flex items-center justify-center text-green-400 hover:bg-green-500 hover:text-white transition-colors">
                  <i className="fab fa-instagram"></i>
                </a>
                <a href="#" className="w-10 h-10 bg-green-500/20 rounded-full flex items-center justify-center text-green-400 hover:bg-green-500 hover:text-white transition-colors">
                  <i className="fab fa-linkedin-in"></i>
                </a>
              </div>
            </div>

            <div>
              <h3 className="text-lg font-semibold mb-4 text-green-400">Services</h3>
              <div className="space-y-2">
                <a href="#" className="block text-slate-300 hover:text-green-400 transition-colors">AI Health Plans</a>
                <a href="#" className="block text-slate-300 hover:text-green-400 transition-colors">Nurse Tracking</a>
                <a href="#" className="block text-slate-300 hover:text-green-400 transition-colors">Emergency Response</a>
                <a href="#" className="block text-slate-300 hover:text-green-400 transition-colors">Telemedicine</a>
                <a href="#" className="block text-slate-300 hover:text-green-400 transition-colors">Health Monitoring</a>
              </div>
            </div>

            <div>
              <h3 className="text-lg font-semibold mb-4 text-green-400">Support</h3>
              <div className="space-y-2">
                <a href="#" className="block text-slate-300 hover:text-green-400 transition-colors">Help Center</a>
                <a href="#" className="block text-slate-300 hover:text-green-400 transition-colors">Contact Us</a>
                <a href="#" className="block text-slate-300 hover:text-green-400 transition-colors">Privacy Policy</a>
                <a href="#" className="block text-slate-300 hover:text-green-400 transition-colors">Terms of Service</a>
                <a href="#" className="block text-slate-300 hover:text-green-400 transition-colors">FAQ</a>
              </div>
            </div>

            <div>
              <h3 className="text-lg font-semibold mb-4 text-green-400">Contact Info</h3>
              <div className="space-y-2 text-slate-300">
                <p><i className="fas fa-phone w-4"></i> +91 98765 43210</p>
                <p><i className="fas fa-envelope w-4"></i> support@healthcarepro.com</p>
                <p><i className="fas fa-map-marker-alt w-4"></i> 123 Health Street, Ahmedabad, Gujarat</p>
              </div>
            </div>
          </div>

          <div className="border-t border-slate-600 mt-8 pt-8 text-center text-slate-400">
            <p>&copy; 2025 HealthCare Pro. All rights reserved. Made with ❤ for better health.</p>
          </div>
        </div>
      </footer>

      <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0/css/all.min.css" />
    </div>
  );
};

export default HealthCarePro;