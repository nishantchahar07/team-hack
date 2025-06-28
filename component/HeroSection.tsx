'use client'

import Link from 'next/link';
import React from 'react';

const HeroSection: React.FC = () => {
  return (
    <section className="text-center mb-16">
      <h1 className="text-5xl md:text-6xl font-inter font-bold mb-6 bg-gradient-to-r from-slate-800 to-blue-600 bg-clip-text text-transparent">
        Smart Healthcare at Your Fingertips
      </h1>
      <p className="text-xl text-slate-600 mb-12 max-w-2xl mx-auto">
        Experience personalized care with AI-powered health plans, real-time nurse tracking,
        and 24/7 emergency support
      </p>

      <div className="flex flex-col sm:flex-row gap-5 justify-center mb-16">
        <Link href={'/booking'} className="bg-gradient-to-r from-green-500 to-green-400 text-white px-8 py-4 rounded-full text-lg font-semibold hover:shadow-xl hover:-translate-y-1 transition-all duration-300 flex items-center gap-3 justify-center">
          <i className="fas fa-calendar-plus"></i>
          Book Appointment
        </Link>
        <Link href={'/nurses'} className="glass-effect text-slate-800 px-8 py-4 rounded-full text-lg font-semibold hover:shadow-xl hover:-translate-y-1 transition-all duration-300 flex items-center gap-3 justify-center">
          <i className="fas fa-robot"></i>
          Find Nurses
        </Link>
      </div>
    </section>
  );
};

export default HeroSection;
