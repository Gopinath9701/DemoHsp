import React, { useState } from 'react';
import {
  Users, UserPlus, Calendar, CreditCard, DollarSign, FileText, CheckCircle2,
  Send, Search, Plus, Printer, Phone, Mail, Clock, ShieldCheck
} from 'lucide-react';
import axios from 'axios';

const API_BASE = 'http://localhost:5000/api';

export default function ReceptionistDashboard({
  patients,
  visits,
  billing,
  fetchAllData,
  showToast
}) {
  const [activeTab, setActiveTab] = useState('register'); // 'register' | 'visits' | 'billing'

  // Patient Registration Form
  const [patientForm, setPatientForm] = useState({
    name: '', age: '', gender: 'Male', email: '', phone: '', address: '', contact_person: '', contact_person_phone: ''
  });

  // Visit Scheduling Form
  const [visitForm, setVisitForm] = useState({
    patient_id: '', reason_for_visit: '', doctor_assigned: 'Dr. Sarah Jenkins'
  });

  // Billing Form
  const [billingForm, setBillingForm] = useState({
    visit_id: '', patient_id: '', test_type: 'Complete Blood Count (CBC)', amount: '1500', discount: '0', payment_method: 'Cash'
  });

  const [searchQuery, setSearchQuery] = useState('');

  // Modals
  const [showPatientModal, setShowPatientModal] = useState(false);
  const [showVisitModal, setShowVisitModal] = useState(false);
  const [showBillingModal, setShowBillingModal] = useState(false);
  const [receiptModalBill, setReceiptModalBill] = useState(null);

  // Handle Patient Intake Submission
  const handleAddPatient = async (e) => {
    e.preventDefault();
    try {
      await axios.post(`${API_BASE}/users`, patientForm);
      showToast('Patient registered in system successfully!', 'success');
      setShowPatientModal(false);
      setPatientForm({
        name: '', age: '', gender: 'Male', email: '', phone: '', address: '', contact_person: '', contact_person_phone: ''
      });
      fetchAllData();
    } catch (err) {
      console.error(err);
      showToast('Error registering patient', 'error');
    }
  };

  // Handle Visit Assignment Submission
  const handleAddVisit = async (e) => {
    e.preventDefault();
    try {
      await axios.post(`${API_BASE}/visits`, visitForm);
      showToast('Patient visit scheduled & doctor assigned!', 'success');
      setShowVisitModal(false);
      setVisitForm({ patient_id: '', reason_for_visit: '', doctor_assigned: 'Dr. Sarah Jenkins' });
      fetchAllData();
    } catch (err) {
      console.error(err);
      showToast('Error scheduling visit', 'error');
    }
  };

  // Handle Billing Submission
  const handleAddBilling = async (e) => {
    e.preventDefault();
    try {
      await axios.post(`${API_BASE}/billing`, billingForm);
      showToast('Test billing invoice created!', 'success');
      setShowBillingModal(false);
      setBillingForm({ visit_id: '', patient_id: '', test_type: 'Complete Blood Count (CBC)', amount: '1500', discount: '0', payment_method: 'Cash' });
      fetchAllData();
    } catch (err) {
      console.error(err);
      showToast('Error creating bill', 'error');
    }
  };

  // Mark Payment as Paid & Send Automated SMS Receipt
  const handlePayBill = async (billId) => {
    try {
      await axios.patch(`${API_BASE}/billing/${billId}/pay`);
      showToast('Payment recorded as PAID! SMS receipt dispatched to patient.', 'success');
      fetchAllData();
    } catch (err) {
      console.error(err);
      showToast('Payment update failed', 'error');
    }
  };

  // Filtered lists
  const filteredPatients = patients.filter(p => p.name?.toLowerCase().includes(searchQuery.toLowerCase()) || p.phone?.includes(searchQuery));
  const filteredVisits = visits.filter(v => v.patient_name?.toLowerCase().includes(searchQuery.toLowerCase()));
  const filteredBilling = billing.filter(b => b.patient_name?.toLowerCase().includes(searchQuery.toLowerCase()));

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="bg-gradient-to-r from-emerald-700 via-teal-700 to-slate-900 rounded-3xl p-6 sm:p-8 text-white shadow-xl flex flex-col md:flex-row items-start md:items-center justify-between gap-6 relative overflow-hidden">
        <div className="space-y-2 z-10">
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-white/10 backdrop-blur rounded-full text-xs font-semibold text-emerald-200">
            <Users size={14} />
            <span>Reception & Patient Registration Suite</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight">Front Desk Operations</h2>
          <p className="text-emerald-100 text-sm max-w-xl">
            Register new patient medical files, schedule consultations with attending doctors, issue billing receipts, and send automated SMS confirmations.
          </p>
        </div>

        <div className="flex items-center gap-3 z-10">
          <button
            onClick={() => setShowPatientModal(true)}
            className="px-5 py-3 bg-white text-emerald-800 hover:bg-emerald-50 font-bold rounded-xl shadow-lg transition-all text-xs flex items-center gap-2"
          >
            <UserPlus size={16} />
            <span>Register New Patient</span>
          </button>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-slate-200 gap-4 overflow-x-auto pb-1">
        <button
          onClick={() => setActiveTab('register')}
          className={`flex items-center gap-2 px-5 py-3 font-semibold text-sm rounded-t-xl transition-all ${
            activeTab === 'register'
              ? 'bg-white border-t-2 border-emerald-600 text-emerald-600 shadow-sm'
              : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
          }`}
        >
          <Users size={18} />
          <span>Patient EHR Directory ({patients.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('visits')}
          className={`flex items-center gap-2 px-5 py-3 font-semibold text-sm rounded-t-xl transition-all ${
            activeTab === 'visits'
              ? 'bg-white border-t-2 border-emerald-600 text-emerald-600 shadow-sm'
              : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
          }`}
        >
          <Calendar size={18} />
          <span>Visit Scheduling & Doctors ({visits.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('billing')}
          className={`flex items-center gap-2 px-5 py-3 font-semibold text-sm rounded-t-xl transition-all ${
            activeTab === 'billing'
              ? 'bg-white border-t-2 border-emerald-600 text-emerald-600 shadow-sm'
              : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
          }`}
        >
          <CreditCard size={18} />
          <span>Billing & Automated Receipts ({billing.length})</span>
        </button>
      </div>

      {/* Search Header */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 bg-white p-4 rounded-2xl border border-slate-200 shadow-sm">
        <div className="relative w-full sm:w-80">
          <Search className="absolute left-3 top-2.5 text-slate-400" size={18} />
          <input
            type="text"
            placeholder="Search patient, phone, or doctor..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-slate-300 rounded-xl text-sm focus:ring-2 focus:ring-emerald-500 outline-none"
          />
        </div>

        <div className="flex items-center gap-3">
          {activeTab === 'visits' && (
            <button
              onClick={() => setShowVisitModal(true)}
              className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-xs rounded-xl shadow-sm transition-all flex items-center gap-1.5"
            >
              <Plus size={16} />
              <span>Schedule Visit</span>
            </button>
          )}

          {activeTab === 'billing' && (
            <button
              onClick={() => setShowBillingModal(true)}
              className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-xs rounded-xl shadow-sm transition-all flex items-center gap-1.5"
            >
              <Plus size={16} />
              <span>New Bill Invoice</span>
            </button>
          )}
        </div>
      </div>

      {/* Tab 1: Patient Directory */}
      {activeTab === 'register' && (
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm border-collapse">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-200 text-xs font-bold text-slate-500 uppercase">
                  <th className="p-4">Patient Name</th>
                  <th className="p-4">Age / Gender</th>
                  <th className="p-4">Phone / Email</th>
                  <th className="p-4">Address</th>
                  <th className="p-4">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 font-medium text-slate-700">
                {filteredPatients.map((patient) => (
                  <tr key={patient.id} className="hover:bg-slate-50/80 transition-colors">
                    <td className="p-4 font-bold text-slate-900">{patient.name}</td>
                    <td className="p-4 text-xs">{patient.age || 'N/A'} yrs / {patient.gender || 'N/A'}</td>
                    <td className="p-4 text-xs">
                      <div>{patient.phone}</div>
                      <div className="text-slate-400">{patient.email}</div>
                    </td>
                    <td className="p-4 text-xs text-slate-500">{patient.address || 'Local'}</td>
                    <td className="p-4">
                      <button
                        onClick={() => {
                          setVisitForm(f => ({ ...f, patient_id: patient.id }));
                          setShowVisitModal(true);
                        }}
                        className="px-3 py-1.5 bg-emerald-50 hover:bg-emerald-100 text-emerald-700 rounded-lg text-xs font-semibold border border-emerald-200 transition-all flex items-center gap-1"
                      >
                        <Calendar size={14} />
                        <span>Schedule Visit</span>
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Tab 2: Visits */}
      {activeTab === 'visits' && (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredVisits.map((v) => (
            <div key={v.id} className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm space-y-4">
              <div className="flex items-start justify-between border-b border-slate-100 pb-3">
                <div>
                  <h4 className="font-bold text-slate-900 text-base">{v.patient_name}</h4>
                  <p className="text-xs text-slate-400 font-medium">{v.visit_date ? new Date(v.visit_date).toLocaleDateString() : 'Today'}</p>
                </div>
                <span className="px-2.5 py-1 bg-emerald-100 text-emerald-800 rounded-full text-xs font-semibold">
                  {v.status || 'Registered'}
                </span>
              </div>

              <div className="space-y-1">
                <p className="text-xs text-slate-400 font-bold uppercase">Consultation Reason</p>
                <p className="text-sm font-semibold text-slate-800">{v.reason_for_visit}</p>
              </div>

              <div className="flex items-center justify-between text-xs text-slate-600 bg-slate-50 p-3 rounded-xl">
                <span>Doctor: <strong className="text-slate-900">{v.doctor_assigned}</strong></span>
              </div>

              <button
                onClick={() => {
                  setBillingForm(b => ({ ...b, visit_id: v.id, patient_id: v.patient_id }));
                  setShowBillingModal(true);
                }}
                className="w-full py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold rounded-xl text-xs shadow-sm transition-all flex items-center justify-center gap-1.5"
              >
                <CreditCard size={14} />
                <span>Create Bill Invoice</span>
              </button>
            </div>
          ))}
        </div>
      )}

      {/* Tab 3: Billing & Invoices */}
      {activeTab === 'billing' && (
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm border-collapse">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-200 text-xs font-bold text-slate-500 uppercase">
                  <th className="p-4">Bill ID</th>
                  <th className="p-4">Patient Name</th>
                  <th className="p-4">Test Service</th>
                  <th className="p-4">Amount</th>
                  <th className="p-4">Status</th>
                  <th className="p-4">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 font-medium text-slate-700">
                {filteredBilling.map((b) => (
                  <tr key={b.id} className="hover:bg-slate-50/80 transition-colors">
                    <td className="p-4 text-xs font-bold text-slate-400">#BILL-{b.id}</td>
                    <td className="p-4 font-bold text-slate-900">{b.patient_name}</td>
                    <td className="p-4 text-xs text-emerald-700 font-semibold">{b.test_type}</td>
                    <td className="p-4 text-xs font-bold text-slate-900">
                      ₹{b.final_amount || b.amount}
                      {b.discount > 0 && <span className="text-[10px] text-emerald-600 block">(Saved ₹{b.discount})</span>}
                    </td>
                    <td className="p-4">
                      <span className={`px-2.5 py-1 rounded-full text-xs font-bold ${
                        b.payment_status === 'Paid'
                          ? 'bg-emerald-100 text-emerald-800'
                          : 'bg-amber-100 text-amber-800'
                      }`}>
                        {b.payment_status}
                      </span>
                    </td>
                    <td className="p-4 flex items-center gap-2">
                      {b.payment_status !== 'Paid' && (
                        <button
                          onClick={() => handlePayBill(b.id)}
                          className="px-3 py-1 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-xs font-semibold shadow-sm transition-all"
                        >
                          Mark Paid & SMS
                        </button>
                      )}
                      <button
                        onClick={() => setReceiptModalBill(b)}
                        className="px-3 py-1 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg text-xs font-semibold transition-all flex items-center gap-1"
                      >
                        <Printer size={12} />
                        <span>Receipt</span>
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Patient Registration Modal */}
      {showPatientModal && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl p-6 sm:p-8 max-w-md w-full shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="font-bold text-slate-900 text-lg">Register Patient EHR</h3>
              <button onClick={() => setShowPatientModal(false)} className="text-slate-400 font-bold">✕</button>
            </div>

            <form onSubmit={handleAddPatient} className="space-y-3">
              <div>
                <label className="block text-xs font-bold text-slate-600 mb-1">Full Name</label>
                <input
                  required
                  type="text"
                  placeholder="Patient Full Name"
                  value={patientForm.name}
                  onChange={(e) => setPatientForm({ ...patientForm, name: e.target.value })}
                  className="w-full px-3.5 py-2 border border-slate-300 rounded-xl text-sm outline-none focus:ring-2 focus:ring-emerald-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-600 mb-1">Age</label>
                  <input
                    required
                    type="number"
                    placeholder="35"
                    value={patientForm.age}
                    onChange={(e) => setPatientForm({ ...patientForm, age: e.target.value })}
                    className="w-full px-3.5 py-2 border border-slate-300 rounded-xl text-sm outline-none focus:ring-2 focus:ring-emerald-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-600 mb-1">Gender</label>
                  <select
                    value={patientForm.gender}
                    onChange={(e) => setPatientForm({ ...patientForm, gender: e.target.value })}
                    className="w-full px-3.5 py-2 border border-slate-300 rounded-xl text-sm outline-none focus:ring-2 focus:ring-emerald-500"
                  >
                    <option>Male</option>
                    <option>Female</option>
                    <option>Other</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-600 mb-1">Phone Number</label>
                <input
                  required
                  type="text"
                  placeholder="+1 (555) 019-2834"
                  value={patientForm.phone}
                  onChange={(e) => setPatientForm({ ...patientForm, phone: e.target.value })}
                  className="w-full px-3.5 py-2 border border-slate-300 rounded-xl text-sm outline-none focus:ring-2 focus:ring-emerald-500"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-600 mb-1">Email Address</label>
                <input
                  required
                  type="email"
                  placeholder="patient@example.com"
                  value={patientForm.email}
                  onChange={(e) => setPatientForm({ ...patientForm, email: e.target.value })}
                  className="w-full px-3.5 py-2 border border-slate-300 rounded-xl text-sm outline-none focus:ring-2 focus:ring-emerald-500"
                />
              </div>

              <div className="flex justify-end gap-3 pt-3">
                <button
                  type="button"
                  onClick={() => setShowPatientModal(false)}
                  className="px-4 py-2 bg-slate-100 text-slate-700 font-semibold rounded-xl text-xs"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl text-xs shadow-md"
                >
                  Register Patient
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Schedule Visit Modal */}
      {showVisitModal && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl p-6 sm:p-8 max-w-md w-full shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="font-bold text-slate-900 text-lg">Schedule Doctor Visit</h3>
              <button onClick={() => setShowVisitModal(false)} className="text-slate-400 font-bold">✕</button>
            </div>

            <form onSubmit={handleAddVisit} className="space-y-3">
              <div>
                <label className="block text-xs font-bold text-slate-600 mb-1">Select Patient</label>
                <select
                  required
                  value={visitForm.patient_id}
                  onChange={(e) => setVisitForm({ ...visitForm, patient_id: e.target.value })}
                  className="w-full px-3.5 py-2 border border-slate-300 rounded-xl text-sm outline-none focus:ring-2 focus:ring-emerald-500"
                >
                  <option value="">-- Choose Registered Patient --</option>
                  {patients.map(p => (
                    <option key={p.id} value={p.id}>{p.name} ({p.phone})</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-600 mb-1">Reason for Visit</label>
                <input
                  required
                  type="text"
                  placeholder="e.g. Fever, Routine Lab Test, Cardiology checkup"
                  value={visitForm.reason_for_visit}
                  onChange={(e) => setVisitForm({ ...visitForm, reason_for_visit: e.target.value })}
                  className="w-full px-3.5 py-2 border border-slate-300 rounded-xl text-sm outline-none focus:ring-2 focus:ring-emerald-500"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-600 mb-1">Assign Doctor</label>
                <select
                  value={visitForm.doctor_assigned}
                  onChange={(e) => setVisitForm({ ...visitForm, doctor_assigned: e.target.value })}
                  className="w-full px-3.5 py-2 border border-slate-300 rounded-xl text-sm outline-none focus:ring-2 focus:ring-emerald-500"
                >
                  <option>Dr. Sarah Jenkins (General Medicine)</option>
                  <option>Dr. Robert Chen (Cardiology)</option>
                  <option>Dr. Emily Taylor (Pathology)</option>
                </select>
              </div>

              <div className="flex justify-end gap-3 pt-3">
                <button
                  type="button"
                  onClick={() => setShowVisitModal(false)}
                  className="px-4 py-2 bg-slate-100 text-slate-700 font-semibold rounded-xl text-xs"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl text-xs shadow-md"
                >
                  Schedule Visit
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Bill Invoice Modal */}
      {showBillingModal && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl p-6 sm:p-8 max-w-md w-full shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="font-bold text-slate-900 text-lg">Generate Billing Invoice</h3>
              <button onClick={() => setShowBillingModal(false)} className="text-slate-400 font-bold">✕</button>
            </div>

            <form onSubmit={handleAddBilling} className="space-y-3">
              <div>
                <label className="block text-xs font-bold text-slate-600 mb-1">Select Patient</label>
                <select
                  required
                  value={billingForm.patient_id}
                  onChange={(e) => setBillingForm({ ...billingForm, patient_id: e.target.value })}
                  className="w-full px-3.5 py-2 border border-slate-300 rounded-xl text-sm outline-none focus:ring-2 focus:ring-emerald-500"
                >
                  <option value="">-- Choose Patient --</option>
                  {patients.map(p => (
                    <option key={p.id} value={p.id}>{p.name}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-600 mb-1">Test Service</label>
                <select
                  value={billingForm.test_type}
                  onChange={(e) => setBillingForm({ ...billingForm, test_type: e.target.value })}
                  className="w-full px-3.5 py-2 border border-slate-300 rounded-xl text-sm outline-none focus:ring-2 focus:ring-emerald-500"
                >
                  <option>Complete Blood Count (CBC)</option>
                  <option>Lipid Profile & Cholesterol</option>
                  <option>Liver Function Test (LFT)</option>
                  <option>Thyroid Profile (T3, T4, TSH)</option>
                  <option>Chest X-Ray Diagnostic</option>
                </select>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-600 mb-1">Amount (₹)</label>
                  <input
                    required
                    type="number"
                    value={billingForm.amount}
                    onChange={(e) => setBillingForm({ ...billingForm, amount: e.target.value })}
                    className="w-full px-3.5 py-2 border border-slate-300 rounded-xl text-sm outline-none focus:ring-2 focus:ring-emerald-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-600 mb-1">Discount (₹)</label>
                  <input
                    type="number"
                    value={billingForm.discount}
                    onChange={(e) => setBillingForm({ ...billingForm, discount: e.target.value })}
                    className="w-full px-3.5 py-2 border border-slate-300 rounded-xl text-sm outline-none focus:ring-2 focus:ring-emerald-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-600 mb-1">Payment Method</label>
                <select
                  value={billingForm.payment_method}
                  onChange={(e) => setBillingForm({ ...billingForm, payment_method: e.target.value })}
                  className="w-full px-3.5 py-2 border border-slate-300 rounded-xl text-sm outline-none focus:ring-2 focus:ring-emerald-500"
                >
                  <option>Cash</option>
                  <option>UPI / Credit Card</option>
                  <option>Health Insurance</option>
                </select>
              </div>

              <div className="flex justify-end gap-3 pt-3">
                <button
                  type="button"
                  onClick={() => setShowBillingModal(false)}
                  className="px-4 py-2 bg-slate-100 text-slate-700 font-semibold rounded-xl text-xs"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl text-xs shadow-md"
                >
                  Create Invoice
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Printable Receipt Preview Modal */}
      {receiptModalBill && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl p-6 sm:p-8 max-w-md w-full shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div>
                <h3 className="font-bold text-slate-900 text-lg">HealthCare Pro Invoice Receipt</h3>
                <p className="text-xs text-slate-400">Bill ID: #BILL-{receiptModalBill.id}</p>
              </div>
              <button onClick={() => setReceiptModalBill(null)} className="text-slate-400 font-bold">✕</button>
            </div>

            <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200 space-y-2 text-xs text-slate-700">
              <p><strong>Patient Name:</strong> {receiptModalBill.patient_name}</p>
              <p><strong>Test Service:</strong> {receiptModalBill.test_type}</p>
              <p><strong>Payment Method:</strong> {receiptModalBill.payment_method}</p>
              <p><strong>Payment Status:</strong> <span className="text-emerald-700 font-bold">{receiptModalBill.payment_status}</span></p>
              <div className="border-t border-slate-200 pt-2 flex justify-between font-bold text-sm text-slate-900">
                <span>Total Amount:</span>
                <span>₹{receiptModalBill.final_amount || receiptModalBill.amount}</span>
              </div>
            </div>

            <div className="flex justify-end gap-3 pt-2">
              <button
                onClick={() => setReceiptModalBill(null)}
                className="px-4 py-2 bg-slate-100 text-slate-700 font-semibold rounded-xl text-xs"
              >
                Close
              </button>
              <button
                onClick={() => {
                  window.print();
                }}
                className="px-5 py-2 bg-slate-900 hover:bg-slate-800 text-white font-bold rounded-xl text-xs shadow-md flex items-center gap-1.5"
              >
                <Printer size={14} />
                <span>Print Receipt</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
