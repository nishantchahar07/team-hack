'use client'

import Link from 'next/link';
import React from 'react';

interface HeaderProps {
  isEmergencyActive?: boolean;
  toggleEmergency?: () => void;
}

const Header: React.FC<HeaderProps> = () => {
  return (
    <header className="glass-effect sticky top-0 z-50 shadow-lg">
      <div className="max-w-6xl mx-auto px-6 py-4 flex justify-between items-center">
        <Link href="/" className="flex items-center gap-3">
          <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-green-400 rounded-xl flex items-center justify-center text-white text-2xl">
            <i className="fas fa-heartbeat"></i>
          </div>
          <div >
            <h1 className="text-2xl font-inter font-bold bg-gradient-to-r from-green-500 to-blue-600 bg-clip-text text-transparent">
              {process.env.NEXT_PUBLIC_APP_NAME}
            </h1>
            <p className="text-sm text-slate-600">{process.env.NEXT_PUBLIC_SLOGAN_NAME}</p>
          </div>
        </Link>

        <div className="flex items-center gap-5">

            {typeof window !== 'undefined' && localStorage.getItem('token') ? (
            <div
              onClick={() => {
              localStorage.removeItem('token');
              window.location.reload();
              }}
              className="bg-gradient-to-r from-red-600 to-red-500 text-white px-6 py-3 rounded-full font-semibold hover:shadow-lg hover:-translate-y-0.5 transition-all duration-300 flex items-center gap-2 cursor-pointer"
            >
              <i className="fas fa-sign-out-alt"></i>
              Sign Out
            </div>
            ) : (
            <Link href="/auth/signin" className="bg-gradient-to-r from-blue-600 to-blue-500 text-white px-6 py-3 rounded-full font-semibold hover:shadow-lg hover:-translate-y-0.5 transition-all duration-300 flex items-center gap-2 cursor-pointer">
              <i className="fas fa-user"></i>
              Sign In
            </Link>
            )}
        </div>
      </div>
    </header>
  );
};

export default Header;
