'use client'

import React, { useState } from 'react';
import GlobalStyles from '@/component/GlobalStyles';
import { faqItems } from '@/services/faq';

export default function Page() {
  const [activeFAQ, setActiveFAQ] = useState<number | null>(null);


  const toggleFAQ = (index: number) => {
    setActiveFAQ(activeFAQ === index ? null : index);
  };
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-100 text-slate-800">
      <GlobalStyles />
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
      <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0/css/all.min.css" />
    </div>
  );
};