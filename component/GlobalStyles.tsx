import React from 'react';

const GlobalStyles: React.FC = () => {
  return (
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
  );
};

export default GlobalStyles;
