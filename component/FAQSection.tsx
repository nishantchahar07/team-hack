'use client'

import React from 'react';

interface FAQItemProps {
  question: string;
  answer: string;
  isActive: boolean;
  onToggle: () => void;
}

const FAQItem: React.FC<FAQItemProps> = ({ question, answer, isActive, onToggle }) => {
  return (
    <div className="glass-effect rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300">
      <div
        className="p-6 cursor-pointer flex justify-between items-center hover:bg-green-50 rounded-2xl transition-colors"
        onClick={onToggle}
      >
        <span className="font-semibold text-slate-800 flex-1 mr-4">{question}</span>
        <i className={`fas fa-chevron-down text-green-500 transition-transform duration-300 ${isActive ? 'rotate-180' : ''}`}></i>
      </div>
      <div className={`overflow-hidden transition-all duration-300 ${isActive ? 'max-h-48 pb-6' : 'max-h-0'}`}>
        <div className="px-6 text-slate-600 leading-relaxed">
          {answer}
        </div>
      </div>
    </div>
  );
};

interface FAQSectionProps {
  activeFAQ: number | null;
  toggleFAQ: (index: number) => void;
}

const FAQSection: React.FC<FAQSectionProps> = ({ activeFAQ, toggleFAQ }) => {
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

  return (
    <section className="mb-16">
      <div className="text-center mb-12">
        <h2 className="text-4xl font-inter font-bold text-slate-800 mb-4">Frequently Asked Questions</h2>
        <p className="text-lg text-slate-600 max-w-lg mx-auto">Everything you need to know about HealthCare Pro</p>
      </div>

      <div className="max-w-4xl mx-auto space-y-4">
        {faqItems.map((item, index) => (
          <FAQItem
            key={index}
            question={item.question}
            answer={item.answer}
            isActive={activeFAQ === index}
            onToggle={() => toggleFAQ(index)}
          />
        ))}
      </div>
    </section>
  );
};

export default FAQSection;
