import React from 'react';
import {
  Activity, ShieldCheck, UserCheck, CreditCard, BarChart2, Clock,
  ArrowRight, PhoneCall, CheckCircle2, Stethoscope, Heart, Users,
  Award, Building2, ChevronRight, Sparkles, FileText, Lock
} from 'lucide-react';

export default function LandingPage({ onLoginClick }) {
  return (
    <div className="min-h-screen bg-slate-50 text-slate-800 font-sans">
      {/* Top Bar / Navigation */}
      <header className="sticky top-0 z-50 bg-white/90 backdrop-blur-md border-b border-slate-200 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
          {/* Logo */}
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-xl text-white shadow-md shadow-blue-500/20">
              <Activity className="h-6 w-6 animate-pulse" />
            </div>
            <div>
              <span className="text-2xl font-extrabold tracking-tight bg-gradient-to-r from-blue-700 via-indigo-600 to-blue-900 bg-clip-text text-transparent">
                HealthCare Pro
              </span>
              <span className="block text-[10px] uppercase tracking-widest text-slate-400 font-semibold">
                Hospital System
              </span>
            </div>
          </div>

          {/* Desktop Navigation Links */}
          <nav className="hidden md:flex items-center gap-8 font-medium text-slate-600 text-sm">
            <a href="#features" className="hover:text-blue-600 transition-colors">Features</a>
            <a href="#departments" className="hover:text-blue-600 transition-colors">Departments</a>
            <a href="#stats" className="hover:text-blue-600 transition-colors">Analytics</a>
            <a href="#about" className="hover:text-blue-600 transition-colors">About Us</a>
            <a href="#contact" className="hover:text-blue-600 transition-colors">Contact</a>
          </nav>

          {/* Top-Right Login Button */}
          <div className="flex items-center gap-4">
            <button
              onClick={onLoginClick}
              className="inline-flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-semibold rounded-xl shadow-lg shadow-blue-500/25 transition-all transform hover:-translate-y-0.5 active:translate-y-0 text-sm cursor-pointer"
              id="top-right-login-btn"
            >
              <UserCheck size={18} />
              <span>Portal Login</span>
              <ArrowRight size={16} className="ml-0.5" />
            </button>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative pt-12 pb-20 md:pt-20 md:pb-28 overflow-hidden bg-gradient-to-b from-blue-50/60 via-slate-50 to-white">
        <div className="absolute top-0 right-1/4 w-96 h-96 bg-blue-400/10 rounded-full blur-3xl -z-10"></div>
        <div className="absolute bottom-10 left-10 w-80 h-80 bg-indigo-400/10 rounded-full blur-3xl -z-10"></div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-12 gap-12 items-center">
            {/* Left Hero Text */}
            <div className="lg:col-span-7 space-y-6 text-center lg:text-left">
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-blue-100/80 border border-blue-200 text-blue-800 text-xs font-semibold">
                <Sparkles className="h-4 w-4 text-blue-600" />
                <span>Next-Generation Healthcare Management</span>
              </div>

              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-slate-900 tracking-tight leading-[1.15]">
                Smart Hospital Management{' '}
                <span className="bg-gradient-to-r from-blue-600 via-indigo-600 to-teal-500 bg-clip-text text-transparent">
                  Made Effortless
                </span>
              </h1>

              <p className="text-lg text-slate-600 max-w-2xl mx-auto lg:mx-0 font-normal leading-relaxed">
                Streamline clinical workflows, patient registrations, doctor assignments, and automated billing in one secure, unified platform. Built for modern medical institutions.
              </p>

              <div className="pt-2 flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
                <button
                  onClick={onLoginClick}
                  className="px-7 py-3.5 bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-semibold rounded-xl shadow-xl shadow-blue-500/20 hover:from-blue-700 hover:to-indigo-700 transition-all flex items-center justify-center gap-2 text-base cursor-pointer"
                >
                  <span>Sign In to Staff Portal</span>
                  <ArrowRight size={18} />
                </button>
                <a
                  href="#features"
                  className="px-7 py-3.5 bg-white text-slate-700 font-semibold rounded-xl border border-slate-300 hover:bg-slate-50 transition-all flex items-center justify-center gap-2 text-base shadow-sm"
                >
                  Explore System Features
                </a>
              </div>

              {/* Badges / Micro Features */}
              <div className="pt-6 grid grid-cols-3 gap-4 border-t border-slate-200/80 max-w-lg mx-auto lg:mx-0">
                <div className="flex items-center gap-2 text-xs font-medium text-slate-600">
                  <CheckCircle2 size={16} className="text-emerald-500 shrink-0" />
                  <span>24/7 Availability</span>
                </div>
                <div className="flex items-center gap-2 text-xs font-medium text-slate-600">
                  <CheckCircle2 size={16} className="text-emerald-500 shrink-0" />
                  <span>Role Security</span>
                </div>
                <div className="flex items-center gap-2 text-xs font-medium text-slate-600">
                  <CheckCircle2 size={16} className="text-emerald-500 shrink-0" />
                  <span>Instant Analytics</span>
                </div>
              </div>
            </div>

            {/* Right Hero Interactive Visual */}
            <div className="lg:col-span-5 relative">
              <div className="relative mx-auto max-w-md lg:max-w-none bg-white rounded-3xl p-6 shadow-2xl border border-slate-100 space-y-5">
                {/* Visual Header */}
                <div className="flex items-center justify-between border-b border-slate-100 pb-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 font-bold">
                      HP
                    </div>
                    <div>
                      <h4 className="font-bold text-slate-900 text-sm">System Live Overview</h4>
                      <p className="text-xs text-slate-500">Real-time status</p>
                    </div>
                  </div>
                  <span className="px-2.5 py-1 rounded-full text-[11px] font-semibold bg-emerald-100 text-emerald-800 flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping"></span>
                    Active
                  </span>
                </div>

                {/* Stat Cards preview */}
                <div className="grid grid-cols-2 gap-3">
                  <div className="p-3.5 rounded-2xl bg-blue-50/70 border border-blue-100">
                    <p className="text-xs text-slate-500 font-medium">Daily Patients</p>
                    <p className="text-xl font-extrabold text-blue-900 mt-1">148+</p>
                    <span className="text-[10px] text-emerald-600 font-semibold">↑ 12% today</span>
                  </div>
                  <div className="p-3.5 rounded-2xl bg-indigo-50/70 border border-indigo-100">
                    <p className="text-xs text-slate-500 font-medium">Active Doctors</p>
                    <p className="text-xl font-extrabold text-indigo-900 mt-1">24 On Duty</p>
                    <span className="text-[10px] text-slate-500">5 Departments</span>
                  </div>
                </div>

                {/* Recent Activity Mock */}
                <div className="space-y-2.5 pt-1">
                  <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">Quick Actions</p>
                  
                  <div 
                    onClick={onLoginClick}
                    className="flex items-center justify-between p-3 rounded-xl bg-slate-50 border border-slate-100 hover:bg-blue-50/50 transition-colors cursor-pointer"
                  >
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-emerald-100 text-emerald-600 rounded-lg">
                        <Users size={16} />
                      </div>
                      <div>
                        <p className="text-xs font-semibold text-slate-800">Patient Intake & EMR</p>
                        <p className="text-[11px] text-slate-500">Instant registration modal</p>
                      </div>
                    </div>
                    <ChevronRight size={16} className="text-slate-400" />
                  </div>

                  <div 
                    onClick={onLoginClick}
                    className="flex items-center justify-between p-3 rounded-xl bg-slate-50 border border-slate-100 hover:bg-blue-50/50 transition-colors cursor-pointer"
                  >
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-blue-100 text-blue-600 rounded-lg">
                        <CreditCard size={16} />
                      </div>
                      <div>
                        <p className="text-xs font-semibold text-slate-800">Automated Billing</p>
                        <p className="text-[11px] text-slate-500">Calculates discounts & receipts</p>
                      </div>
                    </div>
                    <ChevronRight size={16} className="text-slate-400" />
                  </div>
                </div>

                {/* Floating badge */}
                <div className="absolute -bottom-5 -left-5 bg-gradient-to-r from-slate-900 to-slate-800 text-white p-3.5 rounded-2xl shadow-xl flex items-center gap-3 border border-slate-700">
                  <div className="p-2 bg-blue-500 text-white rounded-xl">
                    <ShieldCheck size={20} />
                  </div>
                  <div>
                    <p className="text-xs font-bold">HIPAA Compliant</p>
                    <p className="text-[10px] text-slate-400">Encrypted Patient Data</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-16 space-y-3">
            <h2 className="text-xs font-bold text-blue-600 uppercase tracking-widest">Built for Healthcare Teams</h2>
            <p className="text-3xl sm:text-4xl font-extrabold text-slate-900">
              Complete Hospital Management Capabilities
            </p>
            <p className="text-slate-600 text-base">
              Designed to give receptionists, medical staff, and administrators total control over hospital workflows.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {/* Feature 1 */}
            <div className="p-7 rounded-2xl bg-slate-50 border border-slate-200/80 hover:shadow-xl hover:-translate-y-1 transition-all group">
              <div className="w-12 h-12 rounded-xl bg-blue-100 text-blue-600 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                <Users size={24} />
              </div>
              <h3 className="text-xl font-bold text-slate-900 mb-2">Patient Records (EHR)</h3>
              <p className="text-slate-600 text-sm leading-relaxed">
                Centralized database for storing complete patient details, age, gender, contact information, and emergency contacts securely.
              </p>
            </div>

            {/* Feature 2 */}
            <div className="p-7 rounded-2xl bg-slate-50 border border-slate-200/80 hover:shadow-xl hover:-translate-y-1 transition-all group">
              <div className="w-12 h-12 rounded-xl bg-indigo-100 text-indigo-600 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                <Stethoscope size={24} />
              </div>
              <h3 className="text-xl font-bold text-slate-900 mb-2">Doctor Visit Tracking</h3>
              <p className="text-slate-600 text-sm leading-relaxed">
                Log patient visits, reason for consultation, and assign attending physicians seamlessly in real-time.
              </p>
            </div>

            {/* Feature 3 */}
            <div className="p-7 rounded-2xl bg-slate-50 border border-slate-200/80 hover:shadow-xl hover:-translate-y-1 transition-all group">
              <div className="w-12 h-12 rounded-xl bg-emerald-100 text-emerald-600 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                <CreditCard size={24} />
              </div>
              <h3 className="text-xl font-bold text-slate-900 mb-2">Smart Invoicing & Billing</h3>
              <p className="text-slate-600 text-sm leading-relaxed">
                Generate itemized medical test bills, apply discounts, support cash/card payments, and print invoices.
              </p>
            </div>

            {/* Feature 4 */}
            <div className="p-7 rounded-2xl bg-slate-50 border border-slate-200/80 hover:shadow-xl hover:-translate-y-1 transition-all group">
              <div className="w-12 h-12 rounded-xl bg-purple-100 text-purple-600 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                <BarChart2 size={24} />
              </div>
              <h3 className="text-xl font-bold text-slate-900 mb-2">Executive Analytics</h3>
              <p className="text-slate-600 text-sm leading-relaxed">
                Visual charts powered by Recharts detailing revenue metrics, patient growth trends, and department activity.
              </p>
            </div>

            {/* Feature 5 */}
            <div className="p-7 rounded-2xl bg-slate-50 border border-slate-200/80 hover:shadow-xl hover:-translate-y-1 transition-all group">
              <div className="w-12 h-12 rounded-xl bg-amber-100 text-amber-600 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                <Lock size={24} />
              </div>
              <h3 className="text-xl font-bold text-slate-900 mb-2">Role-Based Access</h3>
              <p className="text-slate-600 text-sm leading-relaxed">
                Dedicated interfaces customized for Administrators, Receptionists, and Attending Doctors to prevent unauthorized data edits.
              </p>
            </div>

            {/* Feature 6 */}
            <div className="p-7 rounded-2xl bg-slate-50 border border-slate-200/80 hover:shadow-xl hover:-translate-y-1 transition-all group">
              <div className="w-12 h-12 rounded-xl bg-teal-100 text-teal-600 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                <Clock size={24} />
              </div>
              <h3 className="text-xl font-bold text-slate-900 mb-2">Live Synchronization</h3>
              <p className="text-slate-600 text-sm leading-relaxed">
                Automated 30-second background polling keeps stats, visit status, and payment ledgers fully synchronized across devices.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Departments Section */}
      <section id="departments" className="py-20 bg-slate-100/70 border-y border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-12">
            <div>
              <h2 className="text-xs font-bold text-blue-600 uppercase tracking-widest">Medical Excellence</h2>
              <p className="text-3xl font-extrabold text-slate-900 mt-1">Specialized Medical Departments</p>
            </div>
            <button
              onClick={onLoginClick}
              className="mt-4 md:mt-0 text-sm font-semibold text-blue-600 hover:text-blue-800 flex items-center gap-1 cursor-pointer"
            >
              <span>Login to view department rosters</span>
              <ChevronRight size={16} />
            </button>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm text-center space-y-3">
              <div className="w-12 h-12 mx-auto rounded-full bg-red-100 text-red-600 flex items-center justify-center">
                <Heart size={24} />
              </div>
              <h4 className="font-bold text-slate-900">Cardiology</h4>
              <p className="text-xs text-slate-500">Heart care & diagnostic ECGs</p>
            </div>

            <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm text-center space-y-3">
              <div className="w-12 h-12 mx-auto rounded-full bg-blue-100 text-blue-600 flex items-center justify-center">
                <Stethoscope size={24} />
              </div>
              <h4 className="font-bold text-slate-900">General Medicine</h4>
              <p className="text-xs text-slate-500">Routine checkups & wellness</p>
            </div>

            <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm text-center space-y-3">
              <div className="w-12 h-12 mx-auto rounded-full bg-amber-100 text-amber-600 flex items-center justify-center">
                <Activity size={24} />
              </div>
              <h4 className="font-bold text-slate-900">Emergency 24/7</h4>
              <p className="text-xs text-slate-500">Trauma & immediate care</p>
            </div>

            <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm text-center space-y-3">
              <div className="w-12 h-12 mx-auto rounded-full bg-indigo-100 text-indigo-600 flex items-center justify-center">
                <Building2 size={24} />
              </div>
              <h4 className="font-bold text-slate-900">Orthopedics</h4>
              <p className="text-xs text-slate-500">Bone, joint & spinal care</p>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Counter Bar */}
      <section id="stats" className="py-16 bg-gradient-to-r from-blue-700 via-indigo-700 to-blue-900 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            <div>
              <p className="text-4xl font-extrabold">15,000+</p>
              <p className="text-xs text-blue-200 uppercase tracking-wider font-semibold mt-1">Patients Served</p>
            </div>
            <div>
              <p className="text-4xl font-extrabold">120+</p>
              <p className="text-xs text-blue-200 uppercase tracking-wider font-semibold mt-1">Specialist Doctors</p>
            </div>
            <div>
              <p className="text-4xl font-extrabold">99.4%</p>
              <p className="text-xs text-blue-200 uppercase tracking-wider font-semibold mt-1">Patient Satisfaction</p>
            </div>
            <div>
              <p className="text-4xl font-extrabold">&lt; 15 mins</p>
              <p className="text-xs text-blue-200 uppercase tracking-wider font-semibold mt-1">Avg Check-in Time</p>
            </div>
          </div>
        </div>
      </section>

      {/* Call To Action Banner */}
      <section className="py-20 bg-white">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-gradient-to-br from-slate-900 to-slate-800 rounded-3xl p-8 sm:p-12 text-white text-center shadow-2xl relative overflow-hidden">
            <div className="absolute top-0 right-0 w-64 h-64 bg-blue-500/10 rounded-full blur-2xl"></div>

            <h2 className="text-3xl sm:text-4xl font-extrabold mb-4">Ready to Access HealthCare Pro?</h2>
            <p className="text-slate-300 max-w-xl mx-auto mb-8 text-base">
              Authorized hospital staff can log in to view real-time patient charts, manage doctor appointments, and issue billing invoices.
            </p>

            <button
              onClick={onLoginClick}
              className="inline-flex items-center gap-2 px-8 py-4 bg-gradient-to-r from-blue-500 to-indigo-500 hover:from-blue-600 hover:to-indigo-600 text-white font-bold rounded-xl shadow-lg transition-all text-base transform hover:scale-105 cursor-pointer"
            >
              <UserCheck size={20} />
              <span>Go to Login Page</span>
            </button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer id="contact" className="bg-slate-900 text-slate-400 py-12 border-t border-slate-800 text-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-blue-600 rounded-lg text-white">
              <Activity size={20} />
            </div>
            <div>
              <span className="text-lg font-bold text-white">HealthCare Pro</span>
              <p className="text-xs text-slate-500">© 2026 HealthCare Pro Inc. All rights reserved.</p>
            </div>
          </div>

          <div className="flex items-center gap-6 text-xs text-slate-400">
            <span className="flex items-center gap-1">
              <PhoneCall size={14} className="text-blue-400" />
              Emergency Helpline: +1 (800) 555-HOSP
            </span>
            <a href="#privacy" className="hover:text-white">Privacy Policy</a>
            <a href="#terms" className="hover:text-white">Terms of Service</a>
          </div>
        </div>
      </footer>
    </div>
  );
}
