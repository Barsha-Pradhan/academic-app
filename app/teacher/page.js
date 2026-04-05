'use client'
import { useState } from 'react'
import {
  FileText, Printer, X, ClipboardList, BookOpen, Shield, CalendarOff,
  Users, CalendarDays, Clock, TrendingUp, CheckCircle, Upload, Bell, ChevronRight
} from 'lucide-react'
import Link from 'next/link'

// ── Mock Data (replace with Supabase fetches later) ────────────────────────────

const semesterLogs = [
  { date: '2025-06-02', startTime: '09:00 AM', lesson: 'Introduction to Arrays',      duration: '1 hr' },
  { date: '2025-06-04', startTime: '09:00 AM', lesson: 'Linked Lists – Singly',        duration: '1 hr' },
  { date: '2025-06-06', startTime: '11:00 AM', lesson: 'Linked Lists – Doubly',        duration: '1 hr' },
  { date: '2025-06-09', startTime: '09:00 AM', lesson: 'Stacks and Queues',            duration: '1 hr' },
  { date: '2025-06-11', startTime: '09:00 AM', lesson: 'Binary Trees – Introduction', duration: '1 hr' },
  { date: '2025-06-13', startTime: '11:00 AM', lesson: 'Binary Search Trees',          duration: '1 hr' },
  { date: '2025-06-16', startTime: '09:00 AM', lesson: 'Graph Basics – BFS & DFS',    duration: '1 hr' },
  { date: '2025-06-18', startTime: '09:00 AM', lesson: 'Sorting Algorithms',           duration: '1 hr' },
]

const todaySchedule = [
  { time: '09:00 AM', section: 'CSE-A', subject: 'Data Structures', room: 'Room 101', status: 'completed' },
  { time: '11:00 AM', section: 'CSE-B', subject: 'Algorithms',      room: 'Room 203', status: 'ongoing'   },
  { time: '02:00 PM', section: 'MCA-A', subject: 'Database Systems',room: 'Room 105', status: 'upcoming'  },
]

const upcomingLessons = [
  { date: '2026-04-07', section: 'CSE-A', topic: 'Heap Data Structure',       subject: 'Data Structures' },
  { date: '2026-04-08', section: 'CSE-B', topic: 'Dynamic Programming Intro', subject: 'Algorithms'      },
  { date: '2026-04-09', section: 'MCA-A', topic: 'Indexing & Query Opt.',     subject: 'Database Systems'},
]

const recentActivity = [
  { type: 'attendance', text: 'Attendance marked for CSE-A',          time: '10 mins ago',  icon: ClipboardList, color: 'text-blue-500 bg-blue-50'    },
  { type: 'material',   text: 'Uploaded notes for CSE-B – Algorithms',time: '1 hour ago',   icon: Upload,        color: 'text-emerald-500 bg-emerald-50'},
  { type: 'leave',      text: 'Leave application submitted',           time: '2 hours ago',  icon: CalendarOff,   color: 'text-rose-500 bg-rose-50'      },
  { type: 'lesson',     text: 'Lesson plan updated for MCA-A',         time: 'Yesterday',    icon: BookOpen,      color: 'text-amber-500 bg-amber-50'    },
  { type: 'attendance', text: 'Attendance marked for MCA-A',           time: 'Yesterday',    icon: ClipboardList, color: 'text-blue-500 bg-blue-50'      },
]

const notices = [
  { title: 'Mid-semester exams scheduled',   date: 'Apr 15–20', priority: 'high'   },
  { title: 'Faculty meeting on Friday 3 PM', date: 'Apr 11',    priority: 'medium' },
  { title: 'Submit lesson plans by Apr 10',  date: 'Apr 10',    priority: 'low'    },
]

const quickLinks = [
  { label: 'Attendance',        href: '/teacher/attendance',  icon: ClipboardList, color: 'bg-blue-50 border-blue-200 text-blue-600'    },
  { label: 'Lesson Plan',       href: '/teacher/lesson-plan', icon: BookOpen,      color: 'bg-emerald-50 border-emerald-200 text-emerald-600'},
  { label: 'Exam Duty',         href: '/teacher/exam-duty',   icon: Shield,        color: 'bg-amber-50 border-amber-200 text-amber-600'  },
  { label: 'Leave Application', href: '/teacher/leave',       icon: CalendarOff,   color: 'bg-rose-50 border-rose-200 text-rose-600'     },
]

const stats = [
  { label: 'Total Students', value: '119', icon: Users,        color: 'bg-blue-50 text-blue-600 border-blue-200'       },
  { label: 'Classes Today',  value: '3',   icon: CalendarDays, color: 'bg-emerald-50 text-emerald-600 border-emerald-200'},
  { label: 'Pending Leaves', value: '1',   icon: Clock,        color: 'bg-amber-50 text-amber-600 border-amber-200'    },
  { label: 'Lessons This Month', value: semesterLogs.length.toString(), icon: TrendingUp, color: 'bg-purple-50 text-purple-600 border-purple-200'},
]

// ── Helpers ───────────────────────────────────────────────────────────────────

function formatDate(dateStr) {
  return new Date(dateStr).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' })
}

function formatUpcomingDate(dateStr) {
  return new Date(dateStr).toLocaleDateString('en-IN', { weekday: 'short', day: '2-digit', month: 'short' })
}

function getGreeting() {
  const h = new Date().getHours()
  if (h < 12) return 'Good morning'
  if (h < 17) return 'Good afternoon'
  return 'Good evening'
}

function todayFormatted() {
  return new Date().toLocaleDateString('en-IN', { weekday: 'long', day: '2-digit', month: 'long', year: 'numeric' })
}

// ── Printable Report Modal ────────────────────────────────────────────────────

function PrintableReport({ onClose }) {
  return (
    <>
      <style>{`
        @media print {
          body * { visibility: hidden; }
          #printable-report, #printable-report * { visibility: visible; }
          #printable-report { position: fixed; top: 0; left: 0; width: 100%; padding: 32px; }
          .no-print { display: none !important; }
        }
      `}</style>

      <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4" onClick={onClose}>
        <div
          id="printable-report"
          className="bg-white rounded-2xl w-full max-w-3xl max-h-[90vh] overflow-y-auto shadow-2xl"
          onClick={e => e.stopPropagation()}
        >
          <div className="flex items-center justify-between px-6 py-5 border-b border-slate-100 no-print">
            <div className="flex items-center gap-3">
              <FileText size={20} className="text-slate-500" />
              <h2 className="text-lg font-bold text-slate-800">Semester Report</h2>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={() => window.print()}
                className="flex items-center gap-2 px-4 py-2 bg-slate-900 text-white text-sm font-medium rounded-lg hover:bg-slate-700 transition"
              >
                <Printer size={15} /> Print Report
              </button>
              <button onClick={onClose} className="p-2 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-lg transition">
                <X size={18} />
              </button>
            </div>
          </div>

          <div className="px-6 py-6">
            <div className="grid grid-cols-3 gap-4 mb-6">
              <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 text-center">
                <p className="text-3xl font-bold text-slate-800">{semesterLogs.length}</p>
                <p className="text-xs text-slate-500 mt-1 uppercase tracking-wide">Total Lessons</p>
              </div>
              <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-4 text-center">
                <p className="text-3xl font-bold text-emerald-700">{semesterLogs.length} hrs</p>
                <p className="text-xs text-emerald-600 mt-1 uppercase tracking-wide">Hours Conducted</p>
              </div>
              <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 text-center">
                <p className="text-3xl font-bold text-blue-700">{new Date().toLocaleDateString('en-IN', { day: '2-digit', month: 'short' })}</p>
                <p className="text-xs text-blue-600 mt-1 uppercase tracking-wide">Generated On</p>
              </div>
            </div>

            <div className="border border-slate-200 rounded-xl overflow-hidden">
              <table className="w-full text-sm">
                <thead>
                  <tr className="bg-slate-900 text-white text-xs uppercase tracking-wide">
                    <th className="px-5 py-3 text-left font-semibold">#</th>
                    <th className="px-5 py-3 text-left font-semibold">Date</th>
                    <th className="px-5 py-3 text-left font-semibold">Start Time</th>
                    <th className="px-5 py-3 text-left font-semibold">Lesson Name</th>
                    <th className="px-5 py-3 text-left font-semibold">Duration</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {semesterLogs.map((log, idx) => (
                    <tr key={idx} className={idx % 2 === 0 ? 'bg-white' : 'bg-slate-50'}>
                      <td className="px-5 py-3 text-slate-400">{idx + 1}</td>
                      <td className="px-5 py-3 text-slate-700 font-medium">{formatDate(log.date)}</td>
                      <td className="px-5 py-3 text-slate-600">{log.startTime}</td>
                      <td className="px-5 py-3 text-slate-800">{log.lesson}</td>
                      <td className="px-5 py-3">
                        <span className="inline-block bg-slate-100 text-slate-600 text-xs font-semibold px-2.5 py-1 rounded-full">{log.duration}</span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="flex items-center justify-between mt-5 pt-4 border-t border-slate-100">
              <p className="text-xs text-slate-400 uppercase tracking-widest">Report Generated: {new Date().toLocaleDateString('en-IN')}</p>
              <div className="text-right">
                <p className="text-xs text-slate-500 uppercase font-semibold">Total Lessons Conducted</p>
                <p className="text-2xl font-black text-slate-900">{semesterLogs.length}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}

// ── Main Page ─────────────────────────────────────────────────────────────────

export default function FacultyPage() {
  const [showReport, setShowReport] = useState(false)

  return (
    <div className="p-6 max-w-6xl mx-auto">

      {/* ── Top Header ── */}
      <div className="flex items-start justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-slate-800">{getGreeting()}, Professor</h1>
          <p className="text-slate-400 text-sm mt-0.5">{todayFormatted()}</p>
        </div>
        <button
          onClick={() => setShowReport(true)}
          className="flex items-center gap-2 px-5 py-2.5 bg-slate-900 text-white text-sm font-semibold rounded-lg hover:bg-slate-700 transition shadow-sm"
        >
          <FileText size={16} /> View Report
        </button>
      </div>

      {/* ── Stats Row ── */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        {stats.map(({ label, value, icon: Icon, color }) => (
          <div key={label} className={`flex items-center gap-4 p-4 rounded-xl border bg-white ${color.split(' ')[2]}`}>
            <div className={`p-2.5 rounded-lg ${color.split(' ')[0]}`}>
              <Icon size={20} className={color.split(' ')[1]} />
            </div>
            <div>
              <p className="text-2xl font-bold text-slate-800">{value}</p>
              <p className="text-xs text-slate-500">{label}</p>
            </div>
          </div>
        ))}
      </div>

      {/* ── Middle Row: Today's Schedule + Notice Board ── */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5 mb-5">

        {/* Today's Schedule — takes 2/3 width */}
        <div className="lg:col-span-2 bg-white border border-slate-200 rounded-xl overflow-hidden">
          <div className="flex items-center justify-between px-5 py-4 border-b border-slate-100">
            <div className="flex items-center gap-2">
              <CalendarDays size={17} className="text-slate-500" />
              <h2 className="font-semibold text-slate-800">Today's Schedule</h2>
            </div>
            <span className="text-xs text-slate-400">{todaySchedule.length} classes</span>
          </div>
          <div className="divide-y divide-slate-100">
            {todaySchedule.map((cls, i) => (
              <div key={i} className="flex items-center gap-4 px-5 py-4">
                <div className="w-20 shrink-0">
                  <p className="text-xs font-semibold text-slate-800">{cls.time}</p>
                </div>
                <div className={`w-1 h-10 rounded-full shrink-0 ${
                  cls.status === 'completed' ? 'bg-slate-300' :
                  cls.status === 'ongoing'   ? 'bg-emerald-500' : 'bg-blue-300'
                }`} />
                <div className="flex-1">
                  <p className="text-sm font-semibold text-slate-800">{cls.subject}</p>
                  <p className="text-xs text-slate-400">{cls.section} · {cls.room}</p>
                </div>
                <span className={`text-xs font-semibold px-2.5 py-1 rounded-full ${
                  cls.status === 'completed' ? 'bg-slate-100 text-slate-500' :
                  cls.status === 'ongoing'   ? 'bg-emerald-100 text-emerald-700' :
                  'bg-blue-50 text-blue-600'
                }`}>
                  {cls.status === 'completed' ? 'Done' : cls.status === 'ongoing' ? 'Ongoing' : 'Upcoming'}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Notice Board — takes 1/3 width */}
        <div className="bg-white border border-slate-200 rounded-xl overflow-hidden">
          <div className="flex items-center gap-2 px-5 py-4 border-b border-slate-100">
            <Bell size={17} className="text-slate-500" />
            <h2 className="font-semibold text-slate-800">Notice Board</h2>
          </div>
          <div className="divide-y divide-slate-100">
            {notices.map((n, i) => (
              <div key={i} className="px-5 py-4">
                <div className="flex items-start justify-between gap-2">
                  <p className="text-sm font-medium text-slate-700 leading-snug">{n.title}</p>
                  <span className={`shrink-0 text-xs font-semibold px-2 py-0.5 rounded-full ${
                    n.priority === 'high'   ? 'bg-red-100 text-red-600' :
                    n.priority === 'medium' ? 'bg-amber-100 text-amber-600' :
                    'bg-slate-100 text-slate-500'
                  }`}>
                    {n.priority}
                  </span>
                </div>
                <p className="text-xs text-slate-400 mt-1">{n.date}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ── Bottom Row: Quick Links + Upcoming Lessons + Recent Activity ── */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">

        {/* Quick Links */}
        <div className="bg-white border border-slate-200 rounded-xl overflow-hidden">
          <div className="px-5 py-4 border-b border-slate-100">
            <h2 className="font-semibold text-slate-800">Quick Access</h2>
          </div>
          <div className="p-3 space-y-2">
            {quickLinks.map(({ label, href, icon: Icon, color }) => (
              <Link
                key={href}
                href={href}
                className="flex items-center justify-between px-3 py-3 rounded-lg hover:bg-slate-50 transition group"
              >
                <div className="flex items-center gap-3">
                  <div className={`p-2 rounded-lg border ${color}`}>
                    <Icon size={15} />
                  </div>
                  <span className="text-sm font-medium text-slate-700">{label}</span>
                </div>
                <ChevronRight size={15} className="text-slate-300 group-hover:text-slate-500 transition" />
              </Link>
            ))}
          </div>
        </div>

        {/* Upcoming Lessons */}
        <div className="bg-white border border-slate-200 rounded-xl overflow-hidden">
          <div className="flex items-center justify-between px-5 py-4 border-b border-slate-100">
            <div className="flex items-center gap-2">
              <BookOpen size={17} className="text-slate-500" />
              <h2 className="font-semibold text-slate-800">Upcoming Lessons</h2>
            </div>
            <Link href="/teacher/lesson-plan" className="text-xs text-blue-500 hover:underline">View all</Link>
          </div>
          <div className="divide-y divide-slate-100">
            {upcomingLessons.map((lesson, i) => (
              <div key={i} className="px-5 py-4">
                <div className="flex items-start justify-between gap-2 mb-1">
                  <p className="text-sm font-semibold text-slate-800 leading-snug">{lesson.topic}</p>
                  <span className="shrink-0 text-xs font-semibold bg-slate-100 text-slate-600 px-2 py-0.5 rounded-full">{lesson.section}</span>
                </div>
                <p className="text-xs text-slate-400">{lesson.subject} · {formatUpcomingDate(lesson.date)}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Recent Activity */}
        <div className="bg-white border border-slate-200 rounded-xl overflow-hidden">
          <div className="flex items-center gap-2 px-5 py-4 border-b border-slate-100">
            <TrendingUp size={17} className="text-slate-500" />
            <h2 className="font-semibold text-slate-800">Recent Activity</h2>
          </div>
          <div className="divide-y divide-slate-100">
            {recentActivity.map((item, i) => {
              const Icon = item.icon
              return (
                <div key={i} className="flex items-start gap-3 px-5 py-3.5">
                  <div className={`p-1.5 rounded-lg shrink-0 mt-0.5 ${item.color}`}>
                    <Icon size={13} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm text-slate-700 leading-snug">{item.text}</p>
                    <p className="text-xs text-slate-400 mt-0.5">{item.time}</p>
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      </div>

      {/* Report Modal */}
      {showReport && <PrintableReport onClose={() => setShowReport(false)} />}
    </div>
  )
}