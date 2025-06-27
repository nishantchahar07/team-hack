'use client'

import React from 'react';

interface FeatureCardProps {
  icon: string;
  title: string;
  description: string;
  gradientFrom: string;
  gradientTo: string;
}

const FeatureCard: React.FC<FeatureCardProps> = ({ icon, title, description, gradientFrom, gradientTo }) => {
  return (
    <div className="glass-effect rounded-3xl p-8 shadow-xl hover:shadow-2xl hover:-translate-y-2 transition-all duration-300">
      <div className={`w-16 h-16 bg-gradient-to-br ${gradientFrom} ${gradientTo} rounded-2xl flex items-center justify-center text-white text-3xl mb-6`}>
        <i className={icon}></i>
      </div>
      <h3 className="text-2xl font-inter font-bold mb-4 text-slate-800">{title}</h3>
      <p className="text-slate-600 leading-relaxed">{description}</p>
    </div>
  );
};

const FeaturesSection: React.FC = () => {
  const features = [
    {
      icon: "fas fa-calendar-alt",
      title: "Smart Care Plans",
      description: "AI-generated personalized care plans that adapt to your health conditions and needs",
      gradientFrom: "from-blue-600",
      gradientTo: "to-blue-400"
    },
    {
      icon: "fas fa-map-marker-alt",
      title: "Live Nurse Tracking",
      description: "Real-time GPS tracking of your assigned nurse with accurate arrival predictions",
      gradientFrom: "from-green-500",
      gradientTo: "to-green-400"
    },
    {
      icon: "fas fa-shield-alt",
      title: "24/7 Emergency",
      description: "Instant emergency response with nearest nurse and ambulance dispatch",
      gradientFrom: "from-red-500",
      gradientTo: "to-red-400"
    }
  ];

  return (
    <section className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
      {features.map((feature, index) => (
        <FeatureCard
          key={index}
          icon={feature.icon}
          title={feature.title}
          description={feature.description}
          gradientFrom={feature.gradientFrom}
          gradientTo={feature.gradientTo}
        />
      ))}
    </section>
  );
};

export default FeaturesSection;
