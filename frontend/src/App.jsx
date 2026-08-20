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

  const [stats, setStats] = useState(null);
  const [patients, setPatients] = useState([]);
  const [visits, setVisits] = useState([]);
  const [billing, setBilling] = useState([]);
  const [records, setRecords] = useState([]);
  const [loading, setLoading] = useState(false);
  const [toast, setToast] = useState(null);

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

  if (!isLoggedIn) {
    if (viewState === 'landing') {
      return <LandingPage onLoginClick={() => setViewState('login')} />;
    }

    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex flex-col items-center justify-center p-4 relative">
        {/* Back to Home Button */}
        <button
          onClick={() => setViewState('landing')}
          className="absolute top-6 left-6 flex items-center gap-2 px-4 py-2 bg-white/90 hover:bg-white text-slate-700 hover:text-blue-600 rounded-xl shadow-md border border-slate-200 text-sm font-semibold transition-all cursor-pointer"
        >
          <ArrowLeft size={16} />
          <span>Back to Home</span>
        </button>

        <div className="bg-white rounded-2xl shadow-2xl p-8 max-w-md w-full">
          <div className="text-center mb-8">
            <div className="inline-block p-3 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-full text-white mb-4">
              <Home size={32} />
            </div>
            <h1 className="text-3xl font-bold text-gray-900">HealthCare Pro</h1>
            <p className="text-gray-500 mt-2">Medical Management Portal</p>
          </div>

          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Username</label>
              <input
                required
                placeholder="admin / receptionist / doctor"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                value={loginForm.username}
                onChange={(e) => setLoginForm({ ...loginForm, username: e.target.value })}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
              <input
                required
                type="password"
                placeholder="Enter password"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                value={loginForm.password}
                onChange={(e) => setLoginForm({ ...loginForm, password: e.target.value })}
              />
            </div>

            <button
              type="submit"
              className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-semibold py-2 rounded-lg hover:shadow-lg transition-all cursor-pointer"
            >
              Sign In
            </button>
          </form>

          <div className="mt-6 p-4 bg-blue-50 rounded-lg text-sm text-gray-700 space-y-1">
            <p className="font-semibold text-gray-900">Demo Credentials:</p>
            <p><span className="font-medium">Admin:</span> admin / admin123</p>
            <p><span className="font-medium">Receptionist:</span> receptionist / recept123</p>
            <p><span className="font-medium">Doctor:</span> doctor / doctor123</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 font-sans">
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
            <button
              onClick={handleSimulateLiveEvent}
              className="flex items-center gap-1.5 px-3.5 py-2 bg-amber-50 hover:bg-amber-100 text-amber-900 border border-amber-300/80 rounded-xl text-xs font-bold transition-all shadow-sm cursor-pointer"
            >
              <span>⚡ Simulate Live Event</span>
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
              <span>LIVE DATA ENGINE ACTIVE: Polling every 10s &bull; Auto-refreshing metrics live</span>
            </div>
            <div className="hidden sm:block text-slate-400 font-semibold">
              Click &quot;⚡ Simulate Live Event&quot; to test real-time data updates
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
        {userRole === ROLES.DOCTOR && (
          <DoctorDashboard
            visits={visits}
            records={records}
            fetchAllData={fetchAllData}
            showToast={showToast}
          />
        )}

        {userRole === ROLES.RECEPTIONIST && (
          <ReceptionistDashboard
            patients={patients}
            visits={visits}
            billing={billing}
            fetchAllData={fetchAllData}
            showToast={showToast}
          />
        )}

        {userRole === ROLES.ADMIN && (
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
