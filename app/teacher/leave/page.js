'use client'

import { useState } from 'react'
import { FileText, Calendar, Send, AlertCircle, Clock, CheckCircle, XCircle, Calculator, HeartPulse, UserMinus } from 'lucide-react'

export default function LeaveApplicationPage() {
  const [formData, setFormData] = useState({
    startDate: '',
    endDate: '',
    reason: '',
    type: 'Sick Leave'
  })

  // Leave Policy constants
  const totalBalance = 24; // Total leaves allowed per year

  const [history] = useState([
    { id: 1, type: 'Casual Leave', from: '2024-04-10', to: '2024-04-11', status: 'Approved', days: 2 },
    { id: 2, type: 'Sick Leave', from: '2024-05-01', to: '2024-05-03', status: 'Pending', days: 3 },
    { id: 3, type: 'Duty Leave', from: '2024-02-15', to: '2024-02-15', status: 'Approved', days: 1 },
  ])

  // Calculation logic
  const leavesTaken = history
    .filter(l => l.status === 'Approved')
    .reduce((sum, item) => sum + item.days, 0);
    
  const leavesRemaining = totalBalance - leavesTaken;

  const handleSubmit = (e) => {
    e.preventDefault()
    alert("Leave application submitted successfully!")
    setFormData({ startDate: '', endDate: '', reason: '', type: 'Sick Leave' })
  }

  return (
    <div className="text-black space-y-8">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Leave Management</h1>
        <p className="text-slate-500 text-sm">Submit requests and track your yearly leave balance.</p>
      </div>

      {/* LEAVE STATS ROW */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm flex items-center gap-4">
          <div className="p-4 bg-blue-50 text-blue-600 rounded-xl">
            <Calculator size={24}/>
          </div>
          <div>
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Yearly Quota</p>
            <p className="text-2xl font-bold text-slate-800">{totalBalance} Days</p>
          </div>
        </div>

        <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm flex items-center gap-4">
          <div className="p-4 bg-red-50 text-red-600 rounded-xl">
            <UserMinus size={24}/>
          </div>
          <div>
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Leaves Taken</p>
            <p className="text-2xl font-bold text-slate-800">{leavesTaken} Days</p>
          </div>
        </div>

        <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm flex items-center gap-4 ring-2 ring-emerald-500/20">
          <div className="p-4 bg-emerald-50 text-emerald-600 rounded-xl">
            <HeartPulse size={24}/>
          </div>
          <div>
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Remaining Balance</p>
            <p className="text-2xl font-bold text-emerald-600">{leavesRemaining} Days</p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Application Form */}
        <div className="lg:col-span-2">
          <div className="bg-white p-8 rounded-2xl border shadow-sm space-y-6">
            <h3 className="font-bold flex items-center text-lg gap-2 border-b pb-4">
              <FileText className="text-blue-600" size={20}/> 
              Submit New Request
            </h3>

            <form onSubmit={handleSubmit} className="space-y-5">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="text-xs font-bold text-slate-400 uppercase ml-1">Leave Type</label>
                  <select 
                    className="w-full p-3 bg-slate-50 border rounded-xl mt-1 outline-none focus:ring-2 focus:ring-blue-500"
                    value={formData.type}
                    onChange={(e) => setFormData({...formData, type: e.target.value})}
                  >
                    <option>Sick Leave</option>
                    <option>Casual Leave</option>
                    <option>Duty Leave</option>
                  </select>
                </div>
                <div>
                  <label className="text-xs font-bold text-slate-400 uppercase ml-1">From Date</label>
                  <input type="date" required className="w-full p-3 bg-slate-50 border rounded-xl mt-1" onChange={(e) => setFormData({...formData, startDate: e.target.value})} />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="text-xs font-bold text-slate-400 uppercase ml-1">To Date</label>
                  <input type="date" required className="w-full p-3 bg-slate-50 border rounded-xl mt-1" onChange={(e) => setFormData({...formData, endDate: e.target.value})} />
                </div>
                <div className="flex items-center p-4 bg-amber-50 rounded-xl text-amber-700 text-[10px] font-bold gap-2 mt-1 uppercase tracking-wider">
                  <AlertCircle size={16}/>
                  Substitutes must be arranged for assigned classes.
                </div>
              </div>

              <div>
                <label className="text-xs font-bold text-slate-400 uppercase ml-1">Reason</label>
                <textarea rows="3" required placeholder="Explain why you need leave..." className="w-full p-4 bg-slate-50 border rounded-xl mt-1 outline-none" onChange={(e) => setFormData({...formData, reason: e.target.value})}></textarea>
              </div>

              <button type="submit" className="w-full bg-slate-900 text-white p-4 rounded-xl font-bold shadow-lg hover:bg-black transition-all flex items-center justify-center gap-2">
                <Send size={18}/> Send Application
              </button>
            </form>
          </div>
        </div>

        {/* History Sidebar */}
        <div className="space-y-4">
          <h3 className="font-bold text-xs uppercase tracking-widest text-slate-400 ml-1">Application History</h3>
          
          {history.map((item) => (
            <div key={item.id} className="bg-white p-5 rounded-2xl border border-slate-100 shadow-sm space-y-3 hover:border-blue-200 transition-all">
              <div className="flex justify-between items-start">
                <div>
                  <p className="font-bold text-slate-800">{item.type}</p>
                  <p className="text-[10px] text-slate-400 font-bold uppercase">{item.days} Day Request</p>
                </div>
                <span className={`text-[10px] font-bold px-2 py-1 rounded-md uppercase ${
                  item.status === 'Approved' ? 'bg-emerald-100 text-emerald-700' : 'bg-amber-100 text-amber-700'
                }`}>
                  {item.status}
                </span>
              </div>
              <div className="flex items-center gap-2 text-xs text-slate-500 font-medium">
                <Calendar size={14}/>
                <span>{item.from} — {item.to}</span>
              </div>
            </div>
          ))}
        </div>

      </div>
    </div>
  )
}