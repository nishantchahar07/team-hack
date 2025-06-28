'use client'

import { Notification } from '@/types/notification';
import React, { useState, useEffect } from 'react';
import {
  Header,
  NotificationPanel,
  HeroSection,
  FeaturesSection,
  FAQSection,
  EmergencyOverlay,

  GlobalStyles
} from '@/component';
import useAudioAlert from '@/hooks/useAudioAlert';

const HealthCarePro: React.FC = () => {
  const [isEmergencyActive, setIsEmergencyActive] = useState(false);
  const [activeFAQ, setActiveFAQ] = useState<number | null>(null);
  const [notifications, setNotifications] = useState<Notification[]>([
    { id: 1, title: 'Take evening medicine', time: '6:00 PM' },
    { id: 2, title: 'Tele check-up scheduled', time: 'Tomorrow 10 AM' }
  ]);

  const { playEmergencyAlert } = useAudioAlert();

  const toggleEmergency = () => {
    setIsEmergencyActive(!isEmergencyActive);
    if (!isEmergencyActive) {
      playEmergencyAlert();
    }
  };

  const toggleFAQ = (index: number) => {
    setActiveFAQ(activeFAQ === index ? null : index);
  };

  const closeNotification = (id: number) => {
    setNotifications(notifications.filter(n => n.id !== id));
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

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-100 text-slate-800">
      <GlobalStyles />

      <Header 
        isEmergencyActive={isEmergencyActive} 
        toggleEmergency={toggleEmergency} 
      />

      <NotificationPanel 
        notifications={notifications} 
        closeNotification={closeNotification} 
      />

      <main className="max-w-6xl mx-auto px-6 py-16">
        <HeroSection />
        <FeaturesSection />
        <FAQSection activeFAQ={activeFAQ} toggleFAQ={toggleFAQ} />
      </main>

      <EmergencyOverlay 
        isActive={isEmergencyActive} 
        onDeactivate={() => setIsEmergencyActive(false)} 
      />

   

      <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0/css/all.min.css" />
    </div>
  );
};

export default HealthCarePro;