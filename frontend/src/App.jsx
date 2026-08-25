import React, { useState, useEffect } from 'react';
import axios from 'axios';
import {
  Menu, X, LogOut, Users, FileText, DollarSign, Calendar,
  Plus, Edit2, Trash2, Eye, Download, TrendingUp, Home, Settings, ArrowLeft
} from 'lucide-react';
import LandingPage from './components/LandingPage';
import DoctorDashboard from './components/DoctorDashboard';
import ReceptionistDashboard from './components/ReceptionistDashboard';
import AdminDashboard from './components/AdminDashboard';

const API_BASE = 'http://localhost:5000/api';

const ROLES = {
  ADMIN: 'admin',
  RECEPTIONIST: 'receptionist',
  DOCTOR: 'doctor'
};

const LOGIN_CREDENTIALS = {
  admin: { password: 'admin123', role: ROLES.ADMIN },
  receptionist: { password: 'recept123', role: ROLES.RECEPTIONIST },
  doctor: { password: 'doctor123', role: ROLES.DOCTOR }
};

export default function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [viewState, setViewState] = useState('landing'); // 'landing' | 'login' | 'dashboard'
  const [userRole, setUserRole] = useState(null);
  const [loginForm, setLoginForm] = useState({ username: '', password: '' });
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [activeTab, setActiveTab] = useState('dashboard');
  const [emergencyAlert, setEmergencyAlert] = useState(false);

  const [stats, setStats] = useState(null);
  const [patients, setPatients] = useState([]);
  const [visits, setVisits] = useState([]);
  const [billing, setBilling] = useState([]);
  const [records, setRecords] = useState([]);
  const [loading, setLoading] = useState(false);
  const [toast, setToast] = useState(null);

  const toggleEmergencyAlert = () => {
    const newState = !emergencyAlert;
    setEmergencyAlert(newState);
    if (newState) {
      showToast('🚨 CRITICAL ALERT DISPATCHED: Code Blue Trauma Response Team Alerted!', 'error');
    } else {
      showToast('✅ Emergency Alert Cleared & Resolved', 'success');
    }
  };

  const handleLogin = (e) => {
    e.preventDefault();
    const cred = LOGIN_CREDENTIALS[loginForm.username];
    if (cred && cred.password === loginForm.password) {
      setIsLoggedIn(true);
      setViewState('dashboard');
      setUserRole(cred.role);
      setLoginForm({ username: '', password: '' });
      showToast('Login successful!', 'success');
      fetchAllData();
    } else {
      showToast('Invalid credentials', 'error');
    }
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
    setViewState('landing');
    setUserRole(null);
    setActiveTab('dashboard');
    setLoginForm({ username: '', password: '' });
  };

  const fetchAllData = async () => {
    setLoading(true);
    try {
      const [statsRes, patientsRes, visitsRes, billingRes, recordsRes] = await Promise.all([
        axios.get(`${API_BASE}/stats`).catch(() => ({ data: {} })),
        axios.get(`${API_BASE}/users`).catch(() => ({ data: [] })),
        axios.get(`${API_BASE}/visits`).catch(() => ({ data: [] })),
        axios.get(`${API_BASE}/billing`).catch(() => ({ data: [] })),
        axios.get(`${API_BASE}/records`).catch(() => ({ data: [] }))
      ]);

      setStats(statsRes.data || {});
      setPatients(Array.isArray(patientsRes.data) ? patientsRes.data : []);
      setVisits(Array.isArray(visitsRes.data) ? visitsRes.data : []);
      setBilling(Array.isArray(billingRes.data) ? billingRes.data : []);
      setRecords(Array.isArray(recordsRes.data) ? recordsRes.data : []);
    } catch (err) {
      console.error('Fetch error:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleSimulateLiveEvent = async () => {
    try {
      const res = await axios.post(`${API_BASE}/demo/simulate-activity`);
      showToast(`⚡ Live Event Simulated: ${res.data.patient} checked in!`, 'success');
      fetchAllData();
    } catch (err) {
      console.error(err);
      showToast('Simulation failed', 'error');
    }
  };

  useEffect(() => {
    if (isLoggedIn) {
      fetchAllData();
      const interval = setInterval(fetchAllData, 10000); // 10s auto-polling
      return () => clearInterval(interval);
    }
  }, [isLoggedIn]);

  const showToast = (msg, type) => {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 3500);
  };

  const quickLogin = (roleKey) => {
    const cred = LOGIN_CREDENTIALS[roleKey];
    if (cred) {
      setIsLoggedIn(true);
      setViewState('dashboard');
      setUserRole(cred.role);
      setLoginForm({ username: '', password: '' });
      showToast(`⚡ Switched to ${cred.role.toUpperCase()} Portal!`, 'success');
      fetchAllData();
    }
  };

  if (!isLoggedIn) {
    if (viewState === 'landing') {
      return <LandingPage onLoginClick={() => setViewState('login')} onQuickDemo={quickLogin} />;
    }

    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-slate-100 to-indigo-100 flex flex-col items-center justify-center p-4 relative">
        {/* Back to Home Button */}
        <button
          onClick={() => setViewState('landing')}
          className="absolute top-6 left-6 flex items-center gap-2 px-4 py-2 bg-white/90 hover:bg-white text-slate-700 hover:text-blue-600 rounded-xl shadow-md border border-slate-200 text-sm font-semibold transition-all cursor-pointer"
        >
          <ArrowLeft size={16} />
          <span>Back to Home</span>
        </button>

        <div className="bg-white rounded-3xl shadow-2xl p-8 max-w-md w-full border border-slate-100">
          <div className="text-center mb-6">
            <div className="inline-block p-3 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-2xl text-white mb-3 shadow-lg shadow-blue-500/20">
              <Home size={32} />
            </div>
            <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">HealthCare Pro</h1>
            <p className="text-slate-500 text-sm mt-1">Enterprise Hospital Management Portal</p>
          </div>

          {/* 1-Click Quick Demo Launcher Cards for Hospital Manager */}
          <div className="mb-6 bg-slate-50 p-3.5 rounded-2xl border border-slate-200/80">
            <div className="flex items-center gap-1.5 mb-2.5">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
              <p className="text-xs font-bold text-slate-700 uppercase tracking-wider">⚡ Quick Presentation Demo (1-Click Login)</p>
            </div>
            <div className="grid grid-cols-3 gap-2">
              <button
                type="button"
                onClick={() => quickLogin('admin')}
                className="px-2.5 py-2 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-bold transition-all shadow-md text-center cursor-pointer hover:scale-[1.02]"
              >
                👑 Admin
              </button>
              <button
                type="button"
                onClick={() => quickLogin('doctor')}
                className="px-2.5 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold transition-all shadow-md text-center cursor-pointer hover:scale-[1.02]"
              >
                🩺 Doctor
              </button>
              <button
                type="button"
                onClick={() => quickLogin('receptionist')}
                className="px-2.5 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold transition-all shadow-md text-center cursor-pointer hover:scale-[1.02]"
              >
                🏥 Front Desk
              </button>
            </div>
          </div>

          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-1">Username</label>
              <input
                required
                placeholder="admin / receptionist / doctor"
                className="w-full px-4 py-2.5 border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none text-sm"
                value={loginForm.username}
                onChange={(e) => setLoginForm({ ...loginForm, username: e.target.value })}
              />
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-1">Password</label>
              <input
                required
                type="password"
                placeholder="Enter password"
                className="w-full px-4 py-2.5 border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none text-sm"
                value={loginForm.password}
                onChange={(e) => setLoginForm({ ...loginForm, password: e.target.value })}
              />
            </div>

            <button
              type="submit"
              className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-bold py-3 rounded-xl shadow-lg shadow-blue-500/25 transition-all cursor-pointer text-sm"
            >
              Sign In to Portal
            </button>
          </form>

          <div className="mt-5 p-3.5 bg-blue-50/80 rounded-xl text-xs text-slate-600 space-y-1 border border-blue-100">
            <p className="font-bold text-slate-900">Manual Credentials:</p>
            <p><span className="font-semibold text-slate-700">Admin:</span> admin / admin123</p>
            <p><span className="font-semibold text-slate-700">Receptionist:</span> receptionist / recept123</p>
            <p><span className="font-semibold text-slate-700">Doctor:</span> doctor / doctor123</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 font-sans">
      {/* Emergency Code Blue Alert Bar */}
      {emergencyAlert && (
        <div className="bg-red-600 text-white px-4 py-2 text-xs font-bold flex items-center justify-between animate-pulse shadow-md border-b border-red-700 z-50">
          <div className="max-w-7xl mx-auto w-full flex items-center justify-between px-2">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-white animate-ping"></span>
              <span>🚨 EMERGENCY TRIAGE ALERT: CODE BLUE IN ICU BED #04 &bull; Trauma Response Team Dispatched &bull; Triage Protocol Level 1 Active</span>
            </div>
            <button
              onClick={toggleEmergencyAlert}
              className="bg-white/20 hover:bg-white/30 text-white px-3 py-0.5 rounded-lg text-[11px] font-extrabold uppercase tracking-wider cursor-pointer"
            >
              Clear Alert ✕
            </button>
          </div>
        </div>
      )}

      {/* App Header */}
      <header className="bg-white border-b border-slate-200 sticky top-0 z-40 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3.5 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-xl text-white shadow-md shadow-blue-500/20">
              <Home size={20} />
            </div>
            <div>
              <h1 className="text-lg font-bold text-slate-900 leading-tight">HealthCare Pro</h1>
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
                <span className="text-xs text-slate-500 capitalize font-semibold">Active Portal: {userRole}</span>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-3">
            {/* Quick Portal Switcher dropdown / buttons in header */}
            <div className="hidden md:flex items-center gap-1.5 bg-slate-100 p-1 rounded-xl border border-slate-200">
              <span className="text-[11px] font-bold text-slate-500 px-2 uppercase tracking-wider">Switch Portal:</span>
              <button
                onClick={() => quickLogin('admin')}
                className={`px-2.5 py-1 rounded-lg text-xs font-bold transition-all ${
                  userRole === 'admin' ? 'bg-slate-900 text-white shadow-sm' : 'text-slate-600 hover:text-slate-900 hover:bg-white'
                }`}
              >
                👑 Admin
              </button>
              <button
                onClick={() => quickLogin('doctor')}
                className={`px-2.5 py-1 rounded-lg text-xs font-bold transition-all ${
                  userRole === 'doctor' ? 'bg-blue-600 text-white shadow-sm' : 'text-slate-600 hover:text-slate-900 hover:bg-white'
                }`}
              >
                🩺 Doctor
              </button>
              <button
                onClick={() => quickLogin('receptionist')}
                className={`px-2.5 py-1 rounded-lg text-xs font-bold transition-all ${
                  userRole === 'receptionist' ? 'bg-emerald-600 text-white shadow-sm' : 'text-slate-600 hover:text-slate-900 hover:bg-white'
                }`}
              >
                🏥 Front Desk
              </button>
            </div>

            {/* Emergency Code Blue Button */}
            <button
              onClick={toggleEmergencyAlert}
              className={`flex items-center gap-1.5 px-3 py-2 border rounded-xl text-xs font-bold transition-all shadow-sm cursor-pointer ${
                emergencyAlert
                  ? 'bg-red-600 text-white border-red-700 animate-pulse'
                  : 'bg-red-50 hover:bg-red-100 text-red-700 border-red-200'
              }`}
            >
              <span>🚨 {emergencyAlert ? 'Code Blue Active' : 'Simulate Code Blue'}</span>
            </button>

            <button
              onClick={handleSimulateLiveEvent}
              className="flex items-center gap-1.5 px-3.5 py-2 bg-amber-50 hover:bg-amber-100 text-amber-900 border border-amber-300/80 rounded-xl text-xs font-bold transition-all shadow-sm cursor-pointer"
            >
              <span>⚡ Simulate Check-In</span>
            </button>

            <button
              onClick={handleLogout}
              className="flex items-center gap-2 px-4 py-2 text-slate-700 hover:bg-slate-100 rounded-xl transition-all font-semibold text-xs border border-slate-200 cursor-pointer"
            >
              <LogOut size={16} />
              <span>Logout</span>
            </button>
          </div>
        </div>

        {/* Live Data Sync Ticker Bar */}
        <div className="bg-slate-900 text-slate-300 py-1.5 px-4 text-[11px] border-t border-slate-800 flex items-center justify-between">
          <div className="max-w-7xl mx-auto w-full flex items-center justify-between px-2">
            <div className="flex items-center gap-2 font-medium">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping"></span>
              <span>LIVE DATA ENGINE ACTIVE: Polling every 10s &bull; Real-time sync across Admin, Clinical & Front-Desk</span>
            </div>
            <div className="hidden sm:block text-slate-400 font-semibold">
              Click &quot;⚡ Simulate Live Event&quot; to test live hospital check-in
            </div>
          </div>
        </div>
      </header>

      {/* Toast Notification */}
      {toast && (
        <div className={`fixed top-4 right-4 px-6 py-3 rounded-xl text-white text-xs font-bold z-50 shadow-xl animate-in fade-in slide-in-from-top-4 ${
          toast.type === 'success' ? 'bg-emerald-600' : 'bg-red-600'
        }`}>
          {toast.msg}
        </div>
      )}

      {/* Main Container */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {(userRole === ROLES.DOCTOR || userRole?.toLowerCase() === 'doctor') && (
          <DoctorDashboard
            visits={visits}
            records={records}
            fetchAllData={fetchAllData}
            showToast={showToast}
          />
        )}

        {(userRole === ROLES.RECEPTIONIST || userRole?.toLowerCase() === 'receptionist') && (
          <ReceptionistDashboard
            patients={patients}
            visits={visits}
            billing={billing}
            fetchAllData={fetchAllData}
            showToast={showToast}
          />
        )}

        {(userRole === ROLES.ADMIN || userRole?.toLowerCase() === 'admin' || (!userRole || (userRole !== 'doctor' && userRole !== 'receptionist'))) && (
          <AdminDashboard
            stats={stats}
            patients={patients}
            visits={visits}
            billing={billing}
            showToast={showToast}
          />
        )}
      </main>
    </div>
  );
}
