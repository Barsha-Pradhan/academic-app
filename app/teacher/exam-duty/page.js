'use client'

import { Calendar, MapPin, Clock, Shield } from 'lucide-react'

export default function ExamDutyPage() {
  const duties = [
    { 
      id: 1,
      type: 'Final Semester Examination', 
      date: 'May 20, 2024', 
      time: '10:00 AM - 01:00 PM', 
      room: 'Main Hall (Room 201)',
      status: 'Upcoming'
    },
    { 
      id: 2,
      type: 'Mid-Term Internal Test', 
      date: 'June 05, 2024', 
      time: '02:00 PM - 04:00 PM', 
      room: 'Computer Lab 4',
      status: 'Pending'
    },
  ]

  return (
    <div className="text-black space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Exam Duty Schedule</h1>
        <p className="text-slate-500 text-sm">View your assigned invigilation duties and venues.</p>
      </div>

      <div className="grid gap-6">
        {duties.map((duty) => (
          <div 
            key={duty.id} 
            className="bg-white p-6 rounded-2xl border border-slate-100 flex flex-col md:flex-row justify-between items-start md:items-center shadow-sm hover:shadow-md transition-all group"
          >
            <div className="flex items-center gap-5">
              <div className="p-4 bg-blue-50 rounded-2xl text-blue-600 group-hover:bg-blue-600 group-hover:text-white transition-colors shadow-inner">
                <Shield size={28}/>
              </div>
              <div>
                <h4 className="font-bold text-lg text-slate-900">{duty.type}</h4>
                <div className="flex flex-wrap gap-4 mt-1">
                  <span className="flex items-center text-xs text-slate-500 gap-1 font-medium">
                    <Calendar size={14}/> {duty.date}
                  </span>
                  <span className="flex items-center text-xs text-slate-500 gap-1 font-medium">
                    <Clock size={14}/> {duty.time}
                  </span>
                </div>
              </div>
            </div>

            <div className="mt-4 md:mt-0 flex flex-col items-end w-full md:w-auto border-t md:border-t-0 pt-4 md:pt-0 border-slate-50">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1 flex items-center gap-1">
                <MapPin size={12}/> Venue
              </span>
              <p className="font-bold text-blue-600 text-lg">{duty.room}</p>
              <span className={`mt-2 text-[10px] font-bold px-3 py-1 rounded-full uppercase tracking-wider ${
                duty.status === 'Upcoming' ? 'bg-blue-100 text-blue-700' : 'bg-slate-100 text-slate-600'
              }`}>
                {duty.status}
              </span>
            </div>
          </div>
        ))}
      </div>

      {/* Admin Notice Section */}
      <div className="bg-amber-50 border border-amber-100 p-6 rounded-2xl">
        <h5 className="text-amber-800 font-bold text-sm mb-2 uppercase tracking-wide">Notice from Controller of Exams</h5>
        <p className="text-amber-700 text-sm leading-relaxed">
          Please report to the examination cell at least 30 minutes before the scheduled time. 
          Carry your ID card and ensure all student devices are deposited outside.
        </p>
      </div>
    </div>
  )
}