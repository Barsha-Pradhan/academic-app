'use client'

import { useState } from 'react'
import { FileText, Download, Calendar, Clock, BookOpen, Printer } from 'lucide-react'

export default function SemesterReportPage() {
  // Sample data - This would eventually come from your 'attendance_reports' table in Supabase
  const [classLogs] = useState([
    { id: 1, date: '2024-01-15', time: '09:00 AM', lessonName: 'Introduction to Data Structures', duration: '60 mins' },
    { id: 2, date: '2024-01-17', time: '11:30 AM', lessonName: 'Array Operations & Memory Mapping', duration: '90 mins' },
    { id: 3, date: '2024-01-20', time: '09:00 AM', lessonName: 'Linked List Implementation', duration: '60 mins' },
    { id: 4, date: '2024-01-22', time: '11:30 AM', lessonName: 'Stack and Queue Applications', duration: '90 mins' },
    { id: 5, date: '2024-01-25', time: '09:00 AM', lessonName: 'Binary Tree Traversal Algorithms', duration: '60 mins' },
    { id: 6, date: '2024-01-27', time: '02:00 PM', lessonName: 'Graph Theory & Shortest Path', duration: '120 mins' },
  ])

  const handlePrint = () => {
    window.print()
  }

  return (
    <div className="text-black space-y-6">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 border-b pb-6">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Semester Academic Report</h1>
          <p className="text-slate-500 text-sm mt-1">Detailed log of all classes conducted during the current semester.</p>
        </div>
        
        <div className="flex gap-3 no-print">
          <button 
            onClick={handlePrint}
            className="flex items-center gap-2 bg-white border border-slate-200 px-4 py-2 rounded-xl text-sm font-bold hover:bg-slate-50 transition-all shadow-sm"
          >
            <Printer size={18} className="text-slate-500"/> Print Report
          </button>
          <button className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-xl text-sm font-bold hover:bg-blue-700 transition-all shadow-md shadow-blue-100">
            <Download size={18}/> Export CSV
          </button>
        </div>
      </div>

      {/* Report Table Container */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden min-h-[600px]">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200">
                <th className="px-6 py-4 text-[11px] font-black text-slate-500 uppercase tracking-widest">
                  <div className="flex items-center gap-2"><Calendar size={14}/> Date</div>
                </th>
                <th className="px-6 py-4 text-[11px] font-black text-slate-500 uppercase tracking-widest">
                  <div className="flex items-center gap-2"><Clock size={14}/> Start Time</div>
                </th>
                <th className="px-6 py-4 text-[11px] font-black text-slate-500 uppercase tracking-widest">
                  <div className="flex items-center gap-2"><BookOpen size={14}/> Lesson Name / Topic</div>
                </th>
                <th className="px-6 py-4 text-[11px] font-black text-slate-500 uppercase tracking-widest">
                   Duration
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 font-medium text-slate-700">
              {classLogs.map((log) => (
                <tr key={log.id} className="hover:bg-slate-50/50 transition-colors group">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="text-sm font-bold text-slate-900">{log.date}</span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="text-sm font-semibold text-blue-600 bg-blue-50 px-2 py-1 rounded-lg border border-blue-100">
                        {log.time}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <span className="text-sm font-bold text-slate-800">{log.lessonName}</span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="text-xs font-bold text-slate-500 bg-slate-100 px-3 py-1 rounded-full">
                        {log.duration}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Empty State Check */}
        {classLogs.length === 0 && (
          <div className="flex flex-col items-center justify-center py-20 text-slate-400">
            <FileText size={48} strokeWidth={1} className="mb-4 opacity-20"/>
            <p className="font-bold">No class records found for this semester.</p>
          </div>
        )}
      </div>

      {/* Footer / Summary Info */}
      <div className="flex justify-between items-center px-2">
        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
          Report Generated: {new Date().toLocaleDateString()}
        </p>
        <div className="text-right">
           <p className="text-xs font-bold text-slate-500 uppercase">Total Lessons Conducted</p>
           <p className="text-xl font-black text-slate-900">{classLogs.length}</p>
        </div>
      </div>
    </div>
  )
}