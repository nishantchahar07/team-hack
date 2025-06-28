'use client'

import React, { useState, useEffect } from 'react';
import { toast } from 'sonner';
import {
  HeroSection,
  FeaturesSection,
  FAQSection,
  EmergencyOverlay,
  GlobalStyles
} from '@/component';

const HealthCarePro: React.FC = () => {
  const [isEmergencyActive, setIsEmergencyActive] = useState(false);
  const [activeFAQ, setActiveFAQ] = useState<number | null>(null);

  const toggleFAQ = (index: number) => {
    setActiveFAQ(activeFAQ === index ? null : index);
  };

  useEffect(() => {
    setTimeout(() => {
      toast.success('Welcome to HealthCare Pro!', {
        description: 'Your comprehensive healthcare platform',
        duration: 3000,
      });
    }, 1000);

  }, []);

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