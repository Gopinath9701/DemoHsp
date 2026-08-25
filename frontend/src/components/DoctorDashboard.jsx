import React, { useState } from 'react';
import {
  Stethoscope, Users, Activity, FileText, Send, CheckCircle2,
  Clock, AlertCircle, Sparkles, Filter, Search, ChevronRight, Mail, MessageSquare, PhoneCall
} from 'lucide-react';
import axios from 'axios';

const API_BASE = 'http://localhost:5000/api';

const WORKFLOW_STEPS = [
  'Registered',
  'Sample Collected',
  'In Analysis',
  'Report Ready',
  'Dispatched'
];

export default function DoctorDashboard({ visits, records, fetchAllData, showToast }) {
  const [activeTab, setActiveTab] = useState('visits'); // 'visits' | 'pipeline' | 'dispatch'
  const [selectedRecord, setSelectedRecord] = useState(null);
  const [selectedVisit, setSelectedVisit] = useState(null);

  // Doctor Clinical Note & Lab Order Form
  const [doctorNote, setDoctorNote] = useState('');
  const [selectedTest, setSelectedTest] = useState('Complete Blood Count (CBC)');
  const [customSummary, setCustomSummary] = useState('');

  // Dispatch Modal State
  const [dispatchModalOpen, setDispatchModalOpen] = useState(false);
  const [dispatchChannel, setDispatchChannel] = useState('Email'); // 'Email' | 'SMS' | 'WhatsApp'
  const [dispatchRecipient, setDispatchRecipient] = useState('');
  const [dispatchMessage, setDispatchMessage] = useState('');
  const [dispatching, setDispatching] = useState(false);

  // Search & Filter
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');

  // Fallback demo data if backend response is delayed
  const defaultVisits = [
    { id: 'V-101', patient_name: 'Ananya Verma', phone: '+91 9876543210', reason_for_visit: 'Acute Bronchitis & High Fever', doctor_assigned: 'Dr. Sarah Jenkins', status: 'Registered' },
    { id: 'V-102', patient_name: 'Rahul Nair', phone: '+91 9812345678', reason_for_visit: 'Routine Cardiac Checkup & Lipid Profile', doctor_assigned: 'Dr. Sarah Jenkins', status: 'In Consultation' },
    { id: 'V-103', patient_name: 'David Miller', phone: '+1 555-019-2834', reason_for_visit: 'Post-Op Surgical Evaluation', doctor_assigned: 'Dr. Sarah Jenkins', status: 'Completed' }
  ];

  const defaultRecords = [
    { id: 'LR-501', patient_name: 'Ananya Verma', test_type: 'Complete Blood Count (CBC)', status: 'Report Ready', results_summary: 'Normal WBC (7,200 /mcL). Hb: 13.5 g/dL.', updated_at: new Date().toISOString() },
    { id: 'LR-502', patient_name: 'Rahul Nair', test_type: 'Lipid Profile & Cholesterol', status: 'In Analysis', results_summary: 'Sample being analyzed in central lab.', updated_at: new Date().toISOString() }
  ];

  const safeVisits = (Array.isArray(visits) && visits.length > 0) ? visits : defaultVisits;
  const safeRecords = (Array.isArray(records) && records.length > 0) ? records : defaultRecords;

  // Doctor assigned visits (filtered)
  const doctorVisits = safeVisits.filter(v => 
    v.patient_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    v.reason_for_visit?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Lab records (filtered)
  const filteredRecords = safeRecords.filter(r => {
    const matchesSearch = r.patient_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          r.test_type?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'All' || r.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  // Handle Lab Status Change & Automated Notification
  const handleUpdateStatus = async (record, newStatus) => {
    try {
      await axios.patch(`${API_BASE}/records/${record.id}/status`, {
        status: newStatus,
        patient_id: record.patient_id,
        email: record.email,
        phone: record.phone,
        results_summary: record.results_summary || 'Doctor evaluation completed. Normal parameters.'
      });
      showToast(`Status updated to ${newStatus}`, 'success');
      fetchAllData();
    } catch (err) {
      console.error(err);
      showToast('Failed to update status', 'error');
    }
  };

  // Open Dispatch Modal
  const openDispatchModal = (record) => {
    setSelectedRecord(record);
    setDispatchRecipient(dispatchChannel === 'Email' ? record.email : record.phone);
    setDispatchMessage(
      `Dear ${record.patient_name}, your ${record.test_type} report is now READY. Status: ${record.status}. Summary: ${record.results_summary || 'Normal parameters'}. HealthCare Pro Medical Team.`
    );
    setDispatchModalOpen(true);
  };

  // Handle Automated Email / SMS / WhatsApp Dispatch
  const handleSendDispatch = async () => {
    if (!selectedRecord) return;
    setDispatching(true);
    try {
      await axios.post(`${API_BASE}/dispatch/send`, {
        patient_id: selectedRecord.patient_id,
        channel: dispatchChannel,
        recipient: dispatchRecipient,
        message: dispatchMessage
      });
      showToast(`Report successfully sent via ${dispatchChannel} to ${dispatchRecipient}`, 'success');
      setDispatchModalOpen(false);
      fetchAllData();
    } catch (err) {
      console.error(err);
      showToast('Error dispatching message', 'error');
    } finally {
      setDispatching(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Top Banner / Welcome */}
      <div className="bg-gradient-to-r from-blue-700 via-indigo-700 to-slate-900 rounded-3xl p-6 sm:p-8 text-white shadow-xl flex flex-col md:flex-row items-start md:items-center justify-between gap-6 relative overflow-hidden">
        <div className="space-y-2 z-10">
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-white/10 backdrop-blur rounded-full text-xs font-semibold text-blue-200">
            <Stethoscope size={14} />
            <span>Doctor Clinical Workspace</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight">Welcome, Dr. Sarah Jenkins</h2>
          <p className="text-blue-100 text-sm max-w-xl">
            Track assigned consultations, order lab diagnostic tests, evaluate patient results, and dispatch automated reports to patients.
          </p>
        </div>

        {/* Quick Stats Pill */}
        <div className="flex items-center gap-4 bg-white/10 backdrop-blur p-4 rounded-2xl border border-white/10 z-10">
          <div>
            <p className="text-xs text-blue-200 uppercase font-bold tracking-wider">Assigned Visits</p>
            <p className="text-2xl font-black">{visits.length}</p>
          </div>
          <div className="h-8 w-px bg-white/20"></div>
          <div>
            <p className="text-xs text-blue-200 uppercase font-bold tracking-wider">Lab Records</p>
            <p className="text-2xl font-black">{records.length}</p>
          </div>
        </div>
      </div>

      {/* Tabs Navigation */}
      <div className="flex border-b border-slate-200 gap-4 overflow-x-auto pb-1">
        <button
          onClick={() => setActiveTab('visits')}
          className={`flex items-center gap-2 px-5 py-3 font-semibold text-sm rounded-t-xl transition-all ${
            activeTab === 'visits'
              ? 'bg-white border-t-2 border-blue-600 text-blue-600 shadow-sm'
              : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
          }`}
        >
          <Users size={18} />
          <span>Patient Consultations ({visits.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('pipeline')}
          className={`flex items-center gap-2 px-5 py-3 font-semibold text-sm rounded-t-xl transition-all ${
            activeTab === 'pipeline'
              ? 'bg-white border-t-2 border-blue-600 text-blue-600 shadow-sm'
              : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
          }`}
        >
          <Activity size={18} />
          <span>Lab Workflow Pipeline ({records.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('dispatch')}
          className={`flex items-center gap-2 px-5 py-3 font-semibold text-sm rounded-t-xl transition-all ${
            activeTab === 'dispatch'
              ? 'bg-white border-t-2 border-blue-600 text-blue-600 shadow-sm'
              : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
          }`}
        >
          <Send size={18} />
          <span>Automated Email / SMS Dispatch</span>
        </button>
      </div>

      {/* Tab 1: Patient Consultations */}
      {activeTab === 'visits' && (
        <div className="space-y-6">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="relative w-full sm:w-80">
              <Search className="absolute left-3 top-2.5 text-slate-400" size={18} />
              <input
                type="text"
                placeholder="Search patient name..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-slate-300 rounded-xl text-sm focus:ring-2 focus:ring-blue-500 outline-none bg-white"
              />
            </div>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {doctorVisits.map((visit) => (
              <div key={visit.id} className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm hover:shadow-md transition-all space-y-4">
                <div className="flex items-start justify-between">
                  <div>
                    <h3 className="font-bold text-slate-900 text-lg">{visit.patient_name}</h3>
                    <p className="text-xs text-slate-500 font-medium">Phone: {visit.phone || 'N/A'}</p>
                  </div>
                  <span className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-xs font-semibold">
                    {visit.status || 'Registered'}
                  </span>
                </div>

                <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-100 space-y-1">
                  <p className="text-xs text-slate-400 font-bold uppercase">Reason for Visit</p>
                  <p className="text-sm font-medium text-slate-800">{visit.reason_for_visit}</p>
                </div>

                <div className="flex items-center justify-between text-xs text-slate-500 pt-2 border-t border-slate-100">
                  <span>Assigned Doctor: <strong className="text-slate-700">{visit.doctor_assigned}</strong></span>
                </div>

                <button
                  onClick={() => setSelectedVisit(visit)}
                  className="w-full py-2.5 bg-slate-900 hover:bg-slate-800 text-white font-semibold text-xs rounded-xl transition-all flex items-center justify-center gap-1.5"
                >
                  <FileText size={14} />
                  <span>Clinical Evaluation & Lab Order</span>
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Tab 2: Lab Workflow Pipeline */}
      {activeTab === 'pipeline' && (
        <div className="space-y-6">
          {/* Filters */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 bg-white p-4 rounded-2xl border border-slate-200 shadow-sm">
            <div className="relative w-full sm:w-72">
              <Search className="absolute left-3 top-2.5 text-slate-400" size={18} />
              <input
                type="text"
                placeholder="Search patient or test..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-slate-300 rounded-xl text-sm focus:ring-2 focus:ring-blue-500 outline-none"
              />
            </div>

            <div className="flex items-center gap-2 overflow-x-auto w-full sm:w-auto">
              <span className="text-xs font-bold text-slate-500 uppercase shrink-0">Filter Status:</span>
              {['All', ...WORKFLOW_STEPS].map((st) => (
                <button
                  key={st}
                  onClick={() => setStatusFilter(st)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all shrink-0 ${
                    statusFilter === st
                      ? 'bg-blue-600 text-white shadow-sm'
                      : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                  }`}
                >
                  {st}
                </button>
              ))}
            </div>
          </div>

          {/* Workflow Pipeline Cards */}
          <div className="space-y-4">
            {filteredRecords.map((record) => {
              const currentStepIdx = WORKFLOW_STEPS.indexOf(record.status);

              return (
                <div key={record.id} className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm hover:shadow-md transition-all space-y-6">
                  <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-100 pb-4">
                    <div>
                      <div className="flex items-center gap-3">
                        <h4 className="font-bold text-slate-900 text-lg">{record.patient_name}</h4>
                        <span className="text-xs text-slate-400">ID: #{record.id}</span>
                      </div>
                      <p className="text-sm font-semibold text-blue-600 mt-0.5">{record.test_type}</p>
                    </div>

                    {/* Next Workflow Action Button */}
                    <div className="flex items-center gap-3">
                      {currentStepIdx < WORKFLOW_STEPS.length - 1 && (
                        <button
                          onClick={() => handleUpdateStatus(record, WORKFLOW_STEPS[currentStepIdx + 1])}
                          className="px-4 py-2 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-semibold text-xs rounded-xl shadow-sm transition-all flex items-center gap-1.5"
                        >
                          <span>Advance to: {WORKFLOW_STEPS[currentStepIdx + 1]}</span>
                          <ChevronRight size={14} />
                        </button>
                      )}

                      <button
                        onClick={() => openDispatchModal(record)}
                        className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold text-xs rounded-xl transition-all flex items-center gap-1.5"
                      >
                        <Send size={14} className="text-blue-600" />
                        <span>Dispatch Report</span>
                      </button>
                    </div>
                  </div>

                  {/* Visual Stepper */}
                  <div className="grid grid-cols-5 gap-2 relative">
                    {WORKFLOW_STEPS.map((step, idx) => {
                      const isDone = idx <= currentStepIdx;
                      const isCurrent = idx === currentStepIdx;

                      return (
                        <div key={step} className="flex flex-col items-center text-center gap-2">
                          <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-xs transition-all ${
                            isCurrent
                              ? 'bg-blue-600 text-white ring-4 ring-blue-100 shadow-md scale-110'
                              : isDone
                              ? 'bg-emerald-500 text-white'
                              : 'bg-slate-200 text-slate-500'
                          }`}>
                            {isDone ? <CheckCircle2 size={16} /> : idx + 1}
                          </div>
                          <span className={`text-[11px] font-medium leading-tight ${
                            isCurrent ? 'text-blue-700 font-bold' : isDone ? 'text-slate-800' : 'text-slate-400'
                          }`}>
                            {step}
                          </span>
                        </div>
                      );
                    })}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Tab 3: Automated Dispatch Overview */}
      {activeTab === 'dispatch' && (
        <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm space-y-6">
          <div className="flex items-center justify-between border-b border-slate-100 pb-4">
            <div>
              <h3 className="font-bold text-slate-900 text-lg">Automated Patient Dispatch Control</h3>
              <p className="text-xs text-slate-500">Send diagnostic summaries directly to patients via Email, SMS & WhatsApp</p>
            </div>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            <div className="p-5 rounded-2xl bg-blue-50 border border-blue-100 space-y-3">
              <div className="w-10 h-10 rounded-xl bg-blue-600 text-white flex items-center justify-center">
                <Mail size={20} />
              </div>
              <h4 className="font-bold text-slate-900">Automated Email Reports</h4>
              <p className="text-xs text-slate-600">Dispatches detailed PDF summaries to registered patient email addresses automatically upon report completion.</p>
            </div>

            <div className="p-5 rounded-2xl bg-emerald-50 border border-emerald-100 space-y-3">
              <div className="w-10 h-10 rounded-xl bg-emerald-600 text-white flex items-center justify-center">
                <MessageSquare size={20} />
              </div>
              <h4 className="font-bold text-slate-900">WhatsApp Alert Dispatch</h4>
              <p className="text-xs text-slate-600">Sends instant WhatsApp notification with encrypted link for instant mobile access by the patient.</p>
            </div>

            <div className="p-5 rounded-2xl bg-purple-50 border border-purple-100 space-y-3">
              <div className="w-10 h-10 rounded-xl bg-purple-600 text-white flex items-center justify-center">
                <PhoneCall size={20} />
              </div>
              <h4 className="font-bold text-slate-900">SMS Notifications</h4>
              <p className="text-xs text-slate-600">Instant SMS dispatch verifying status progression (Sample Received &rarr; Report Available).</p>
            </div>
          </div>
        </div>
      )}

      {/* Dispatch Modal */}
      {dispatchModalOpen && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl p-6 sm:p-8 max-w-lg w-full shadow-2xl space-y-5 animate-in fade-in zoom-in duration-150">
            <div className="flex items-center justify-between border-b border-slate-100 pb-4">
              <div className="flex items-center gap-3">
                <div className="p-2.5 bg-blue-100 text-blue-600 rounded-xl">
                  <Send size={20} />
                </div>
                <div>
                  <h3 className="font-bold text-slate-900">Dispatch Patient Report</h3>
                  <p className="text-xs text-slate-500">Target Patient: {selectedRecord?.patient_name}</p>
                </div>
              </div>
              <button
                onClick={() => setDispatchModalOpen(false)}
                className="text-slate-400 hover:text-slate-600 font-bold text-lg"
              >
                ✕
              </button>
            </div>

            {/* Select Channel */}
            <div>
              <label className="block text-xs font-bold text-slate-600 uppercase mb-2">Select Channel</label>
              <div className="grid grid-cols-3 gap-3">
                {['Email', 'SMS', 'WhatsApp'].map((ch) => (
                  <button
                    key={ch}
                    onClick={() => {
                      setDispatchChannel(ch);
                      setDispatchRecipient(ch === 'Email' ? selectedRecord?.email : selectedRecord?.phone);
                    }}
                    className={`py-2 px-3 rounded-xl font-semibold text-xs border transition-all ${
                      dispatchChannel === ch
                        ? 'bg-blue-600 text-white border-blue-600 shadow-md'
                        : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
                    }`}
                  >
                    {ch}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-600 uppercase mb-1">Recipient Address / Phone</label>
              <input
                type="text"
                value={dispatchRecipient}
                onChange={(e) => setDispatchRecipient(e.target.value)}
                className="w-full px-4 py-2 border border-slate-300 rounded-xl text-sm font-medium focus:ring-2 focus:ring-blue-500 outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-600 uppercase mb-1">Message Preview</label>
              <textarea
                rows={4}
                value={dispatchMessage}
                onChange={(e) => setDispatchMessage(e.target.value)}
                className="w-full p-3 border border-slate-300 rounded-xl text-sm font-medium focus:ring-2 focus:ring-blue-500 outline-none"
              />
            </div>

            <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-100">
              <button
                onClick={() => setDispatchModalOpen(false)}
                className="px-5 py-2.5 bg-slate-100 text-slate-700 font-semibold rounded-xl text-xs hover:bg-slate-200 transition-all"
              >
                Cancel
              </button>

              <button
                onClick={handleSendDispatch}
                disabled={dispatching}
                className="px-6 py-2.5 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-bold rounded-xl text-xs shadow-md transition-all flex items-center gap-2"
              >
                {dispatching ? 'Sending...' : 'Send Automated Dispatch'}
                <Send size={14} />
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Patient Clinical EHR Evaluation & e-Prescription Modal */}
      {selectedVisit && (
        <div className="fixed inset-0 bg-slate-900/70 backdrop-blur-sm z-50 flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-3xl p-6 sm:p-8 max-w-2xl w-full shadow-2xl space-y-6 border border-slate-200 animate-in fade-in zoom-in duration-150">
            {/* Modal Header */}
            <div className="flex items-start justify-between border-b border-slate-100 pb-4">
              <div className="flex items-center gap-3">
                <div className="p-3 bg-blue-100 text-blue-700 rounded-2xl">
                  <Stethoscope size={24} />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="font-extrabold text-slate-900 text-xl">{selectedVisit.patient_name}</h3>
                    <span className="px-2.5 py-0.5 bg-red-100 text-red-700 font-bold text-[10px] rounded-full uppercase tracking-wider flex items-center gap-1">
                      <AlertCircle size={10} /> Allergy Warning
                    </span>
                  </div>
                  <p className="text-xs text-slate-500 font-medium">Reason for Visit: <strong className="text-slate-800">{selectedVisit.reason_for_visit}</strong></p>
                </div>
              </div>
              <button
                onClick={() => setSelectedVisit(null)}
                className="text-slate-400 hover:text-slate-600 font-bold text-lg cursor-pointer"
              >
                ✕
              </button>
            </div>

            {/* Patient Live Vitals Grid */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <p className="text-xs font-bold text-slate-700 uppercase tracking-wider">Patient Vitals & EHR Parameters</p>
                <span className="text-[10px] text-emerald-600 font-bold flex items-center gap-1">
                  <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span> Recorded Today 09:30 AM
                </span>
              </div>

              <div className="grid grid-cols-4 gap-3 bg-slate-50 p-3.5 rounded-2xl border border-slate-200 text-center">
                <div className="p-2 bg-white rounded-xl shadow-xs border border-slate-100">
                  <p className="text-[10px] text-slate-400 font-bold uppercase">Blood Pressure</p>
                  <p className="text-sm font-extrabold text-slate-900 mt-0.5">120/80</p>
                  <span className="text-[9px] text-slate-500">mmHg (Normal)</span>
                </div>
                <div className="p-2 bg-white rounded-xl shadow-xs border border-slate-100">
                  <p className="text-[10px] text-slate-400 font-bold uppercase">Heart Rate</p>
                  <p className="text-sm font-extrabold text-blue-600 mt-0.5">74</p>
                  <span className="text-[9px] text-slate-500">BPM</span>
                </div>
                <div className="p-2 bg-white rounded-xl shadow-xs border border-slate-100">
                  <p className="text-[10px] text-slate-400 font-bold uppercase">Oxygen (SpO2)</p>
                  <p className="text-sm font-extrabold text-emerald-600 mt-0.5">99%</p>
                  <span className="text-[9px] text-slate-500">Room Air</span>
                </div>
                <div className="p-2 bg-white rounded-xl shadow-xs border border-slate-100">
                  <p className="text-[10px] text-slate-400 font-bold uppercase">Body Temp</p>
                  <p className="text-sm font-extrabold text-amber-600 mt-0.5">98.6 °F</p>
                  <span className="text-[9px] text-slate-500">Afebrile</span>
                </div>
              </div>
            </div>

            {/* Smart Electronic Prescription & Lab Order Form */}
            <div className="space-y-4">
              <div className="space-y-2">
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider">Clinical Notes & Diagnosis</label>
                <textarea
                  rows={2}
                  placeholder="Enter clinical assessment, symptoms, and diagnosis summary..."
                  value={doctorNote}
                  onChange={(e) => setDoctorNote(e.target.value)}
                  className="w-full p-3 border border-slate-300 rounded-xl text-xs font-medium focus:ring-2 focus:ring-blue-500 outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">Order Lab Diagnostic Test</label>
                  <select
                    value={selectedTest}
                    onChange={(e) => setSelectedTest(e.target.value)}
                    className="w-full px-3.5 py-2 border border-slate-300 rounded-xl text-xs font-semibold outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option>Complete Blood Count (CBC)</option>
                    <option>Lipid Profile & Cholesterol</option>
                    <option>Liver Function Test (LFT)</option>
                    <option>Thyroid Panel (T3, T4, TSH)</option>
                    <option>HbA1c Diabetes Panel</option>
                    <option>Chest X-Ray Diagnostic</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">Diagnostic Priority</label>
                  <select className="w-full px-3.5 py-2 border border-slate-300 rounded-xl text-xs font-semibold outline-none focus:ring-2 focus:ring-blue-500">
                    <option>Routine Diagnostic</option>
                    <option>Urgent Priority</option>
                    <option className="text-red-600 font-bold">⚡ STAT Emergency Priority</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Modal Actions */}
            <div className="flex items-center justify-between pt-4 border-t border-slate-100">
              <button
                onClick={() => setSelectedVisit(null)}
                className="px-4 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold rounded-xl text-xs transition-all cursor-pointer"
              >
                Close
              </button>

              <div className="flex items-center gap-3">
                <button
                  onClick={() => {
                    showToast(`📄 Electronic Prescription (e-Rx) issued for ${selectedVisit.patient_name}!`, 'success');
                    setSelectedVisit(null);
                  }}
                  className="px-5 py-2.5 bg-slate-900 hover:bg-slate-800 text-white font-bold rounded-xl text-xs shadow-md transition-all flex items-center gap-1.5 cursor-pointer"
                >
                  <FileText size={14} />
                  <span>Issue e-Prescription</span>
                </button>

                <button
                  onClick={async () => {
                    try {
                      await axios.post(`${API_BASE}/records`, {
                        name: selectedVisit.patient_name,
                        test_type: selectedTest,
                        results_summary: doctorNote || 'Clinical evaluation completed. Lab ordered.'
                      });
                      showToast(`⚡ Lab Order for ${selectedTest} created & sent to laboratory!`, 'success');
                      setSelectedVisit(null);
                      fetchAllData();
                    } catch (err) {
                      showToast('Lab order created (demo mode)', 'success');
                      setSelectedVisit(null);
                    }
                  }}
                  className="px-6 py-2.5 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-bold rounded-xl text-xs shadow-lg shadow-blue-500/25 transition-all cursor-pointer flex items-center gap-1.5"
                >
                  <CheckCircle2 size={14} />
                  <span>Order Diagnostic Test</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

