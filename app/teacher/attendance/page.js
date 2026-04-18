'use client'
import { useState, useRef, useEffect } from 'react'
import { supabase } from '@/lib/supabase'
import { Upload, Send, MessageCircle, X, CheckCircle, XCircle, AlertTriangle } from 'lucide-react'



// ─── Config ───────────────────────────────────────────────────────────────────

const HOLIDAYS = [
  '2025-01-14','2025-01-26','2025-03-17','2025-04-14','2025-04-18',
  '2025-05-12','2025-08-15','2025-10-02','2025-10-20','2025-11-05',
  '2025-12-25','2026-01-14','2026-01-26',
]

const SECTIONS = [
  {
    id: 'CSE-A', subject: 'Data Structures',
    students: [
      { id: 1, name: 'Arjun Patel' }, { id: 2, name: 'Sneha Rao' },
      { id: 3, name: 'Mohit Sharma' }, { id: 4, name: 'Priya Singh' },
      { id: 5, name: 'Karan Mehta' }, { id: 6, name: 'Divya Nair' },
      { id: 7, name: 'Rohit Das' }, { id: 8, name: 'Ananya Iyer' },
    ],
  },
  {
    id: 'CSE-B', subject: 'Algorithms',
    students: [
      { id: 9, name: 'Vikram Reddy' }, { id: 10, name: 'Pooja Gupta' },
      { id: 11, name: 'Aditya Kumar' }, { id: 12, name: 'Riya Verma' },
      { id: 13, name: 'Siddharth Joshi' }, { id: 14, name: 'Kavya Pillai' },
    ],
  },
  {
    id: 'MCA-A', subject: 'Database Systems',
    students: [
      { id: 15, name: 'Neha Desai' }, { id: 16, name: 'Amrit Bose' },
      { id: 17, name: 'Tanvi Malhotra' }, { id: 18, name: 'Harsh Pandey' },
      { id: 19, name: 'Shweta Patil' },
    ],
  },
]

// ─── Helpers ──────────────────────────────────────────────────────────────────

function todayStr() { return new Date().toISOString().split('T')[0] }

function getBlockReason(dateStr) {
  if (!dateStr) return null
  const d = new Date(dateStr)
  if (d.getDay() === 0) return 'Sundays are non-working days. Attendance cannot be marked.'
  if (HOLIDAYS.includes(dateStr)) return 'This date is a public holiday. Attendance cannot be marked.'
  return null
}

function formatDate(dateStr) {
  if (!dateStr) return ''
  return new Date(dateStr).toLocaleDateString('en-IN', {
    weekday: 'long', day: '2-digit', month: 'long', year: 'numeric',
  })
}

function formatTime(ts) {
  return new Date(ts).toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' })
}

// ─── Main Component ───────────────────────────────────────────────────────────

export default function AttendancePage() {
  const [activeSection, setActiveSection] = useState(SECTIONS[0].id)
  const [selectedDate, setSelectedDate] = useState(todayStr())
  const [attendance, setAttendance] = useState({})
  const [materials, setMaterials] = useState({})
  const [chatOpen, setChatOpen] = useState(false)
  const [messages, setMessages] = useState([])
  const [replyText, setReplyText] = useState('')
  const chatEndRef = useRef(null)
  const fileInputRef = useRef(null)

  const section = SECTIONS.find(s => s.id === activeSection)
  const blocked = getBlockReason(selectedDate)

  // ── Fetch messages from Supabase ──────────────────────────────────────────
  useEffect(() => {
    if (!chatOpen) return

    const fetchMessages = async () => {
      const { data } = await supabase
        .from('attendance_chat')
        .select('*')
        .eq('section_id', activeSection)
        .eq('date', selectedDate)
        .order('created_at', { ascending: true })
      if (data) setMessages(data)
    }

    fetchMessages()

    // Realtime subscription
    const channel = supabase
      .channel(`chat-${activeSection}-${selectedDate}`)
      .on('postgres_changes', {
        event: 'INSERT',
        schema: 'public',
        table: 'attendance_chat',
        filter: `section_id=eq.${activeSection}`,
      }, (payload) => {
        if (payload.new.date === selectedDate) {
          setMessages(prev => [...prev, payload.new])
        }
      })
      .subscribe()

    return () => { supabase.removeChannel(channel) }
  }, [chatOpen, activeSection, selectedDate])

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  // ── Faculty sends reply ───────────────────────────────────────────────────
  const sendReply = async () => {
    const msg = replyText.trim()
    if (!msg) return
    setReplyText('')

    await supabase.from('attendance_chat').insert({
      section_id: activeSection,
      date: selectedDate,
      sender: 'faculty',
      sender_name: 'Faculty',
      message: msg,
    })
  }

  // ── Attendance helpers ────────────────────────────────────────────────────
  const getAttendance = () => attendance[activeSection]?.[selectedDate] ?? {}

  const setStudentAttendance = (studentId, present) => {
    setAttendance(prev => ({
      ...prev,
      [activeSection]: {
        ...prev[activeSection],
        [selectedDate]: { ...prev[activeSection]?.[selectedDate], [studentId]: present },
      },
    }))
  }

  const markAll = (present) => {
    const record = {}
    section.students.forEach(s => { record[s.id] = present })
    setAttendance(prev => ({
      ...prev,
      [activeSection]: { ...prev[activeSection], [selectedDate]: record },
    }))
  }

  const att = getAttendance()
  const markedCount   = Object.keys(att).length
  const presentCount  = Object.values(att).filter(Boolean).length
  const absentCount   = markedCount - presentCount
  const totalStudents = section.students.length

  // ── Material helpers ──────────────────────────────────────────────────────
  const getMaterials = () => materials[activeSection]?.[selectedDate] ?? []

  const handleFileUpload = (e) => {
    const file = e.target.files[0]
    if (!file) return
    setMaterials(prev => ({
      ...prev,
      [activeSection]: {
        ...prev[activeSection],
        [selectedDate]: [...(prev[activeSection]?.[selectedDate] ?? []), { name: file.name, url: URL.createObjectURL(file) }],
      },
    }))
    e.target.value = ''
  }

  const removeMaterial = (idx) => {
    setMaterials(prev => {
      const updated = (prev[activeSection]?.[selectedDate] ?? []).filter((_, i) => i !== idx)
      return { ...prev, [activeSection]: { ...prev[activeSection], [selectedDate]: updated } }
    })
  }

  const studentMessages = messages.filter(m => m.sender === 'student')
  const unreadCount = studentMessages.length

  return (
    <div className="p-6 max-w-5xl mx-auto">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-slate-800">Attendance</h1>
        <p className="text-slate-500 text-sm mt-1">Mark attendance, upload materials, and reply to student queries.</p>
      </div>

      {/* Section Tabs */}
      <div className="flex gap-2 mb-5 flex-wrap">
        {SECTIONS.map(s => (
          <button key={s.id} onClick={() => { setActiveSection(s.id); setChatOpen(false) }}
            className={`px-4 py-2 rounded-lg text-sm font-semibold border transition-all ${
              activeSection === s.id ? 'bg-slate-900 text-white border-slate-900' : 'bg-white text-slate-600 border-slate-200 hover:border-slate-400'
            }`}>
            {s.id} <span className="ml-2 text-xs opacity-60">{s.subject}</span>
          </button>
        ))}
      </div>

      {/* Date Picker */}
      <div className="bg-white border border-slate-200 rounded-xl p-4 mb-5 flex flex-col sm:flex-row sm:items-center gap-4">
        <div>
          <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wide mb-1">Select Date</label>
          <input type="date" value={selectedDate} onChange={e => setSelectedDate(e.target.value)}
            className="border border-slate-200 rounded-lg px-3 py-2 text-sm text-slate-700 focus:outline-none focus:ring-2 focus:ring-slate-400" />
        </div>
        {selectedDate && (
          <div className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium ${
            blocked ? 'bg-red-50 text-red-700 border border-red-200' : 'bg-emerald-50 text-emerald-700 border border-emerald-200'
          }`}>
            {blocked ? <AlertTriangle size={16} /> : <CheckCircle size={16} />}
            {blocked ?? `Working day — ${formatDate(selectedDate)}`}
          </div>
        )}
      </div>

      {blocked ? (
        <div className="bg-red-50 border border-red-200 rounded-xl p-8 text-center">
          <AlertTriangle size={40} className="mx-auto text-red-400 mb-3" />
          <p className="text-red-700 font-semibold text-lg">Attendance Unavailable</p>
          <p className="text-red-500 text-sm mt-1">{blocked}</p>
        </div>
      ) : (
        <div className="space-y-5">
          {/* Stats */}
          <div className="grid grid-cols-3 gap-4">
            <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 text-center">
              <p className="text-2xl font-bold text-slate-800">{totalStudents}</p>
              <p className="text-xs text-slate-500 mt-1">Total Students</p>
            </div>
            <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-4 text-center">
              <p className="text-2xl font-bold text-emerald-700">{presentCount}</p>
              <p className="text-xs text-emerald-600 mt-1">Present</p>
            </div>
            <div className="bg-red-50 border border-red-200 rounded-xl p-4 text-center">
              <p className="text-2xl font-bold text-red-700">{absentCount}</p>
              <p className="text-xs text-red-600 mt-1">Absent</p>
            </div>
          </div>

          {/* Attendance Table */}
          <div className="bg-white border border-slate-200 rounded-xl overflow-hidden">
            <div className="flex items-center justify-between px-5 py-4 border-b border-slate-100">
              <div>
                <h2 className="font-semibold text-slate-800">{activeSection} — {section.subject}</h2>
                <p className="text-xs text-slate-400 mt-0.5">{markedCount}/{totalStudents} marked</p>
              </div>
              <div className="flex gap-2">
                <button onClick={() => markAll(true)} className="text-xs px-3 py-1.5 bg-emerald-50 text-emerald-700 border border-emerald-200 rounded-lg hover:bg-emerald-100 font-medium transition">Mark All Present</button>
                <button onClick={() => markAll(false)} className="text-xs px-3 py-1.5 bg-red-50 text-red-700 border border-red-200 rounded-lg hover:bg-red-100 font-medium transition">Mark All Absent</button>
              </div>
            </div>
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-slate-50 text-xs text-slate-500 uppercase tracking-wide">
                  <th className="px-5 py-3 text-left font-semibold">#</th>
                  <th className="px-5 py-3 text-left font-semibold">Student Name</th>
                  <th className="px-5 py-3 text-center font-semibold">Status</th>
                  <th className="px-5 py-3 text-center font-semibold">Mark</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {section.students.map((student, idx) => {
                  const status = att[student.id]
                  const isPresent = status === true
                  const isAbsent  = status === false
                  return (
                    <tr key={student.id} className="hover:bg-slate-50 transition-colors">
                      <td className="px-5 py-3 text-slate-400">{idx + 1}</td>
                      <td className="px-5 py-3 font-medium text-slate-700">{student.name}</td>
                      <td className="px-5 py-3 text-center">
                        {status === undefined ? (
                          <span className="text-xs text-slate-400 italic">Not marked</span>
                        ) : isPresent ? (
                          <span className="inline-flex items-center gap-1 text-xs font-semibold text-emerald-700 bg-emerald-50 border border-emerald-200 px-2.5 py-1 rounded-full"><CheckCircle size={12} /> Present</span>
                        ) : (
                          <span className="inline-flex items-center gap-1 text-xs font-semibold text-red-700 bg-red-50 border border-red-200 px-2.5 py-1 rounded-full"><XCircle size={12} /> Absent</span>
                        )}
                      </td>
                      <td className="px-5 py-3">
                        <div className="flex justify-center gap-2">
                          <button onClick={() => setStudentAttendance(student.id, true)}
                            className={`w-8 h-8 rounded-lg text-xs font-bold border transition-all ${isPresent ? 'bg-emerald-600 text-white border-emerald-600' : 'bg-white text-slate-400 border-slate-200 hover:border-emerald-400 hover:text-emerald-600'}`}>P</button>
                          <button onClick={() => setStudentAttendance(student.id, false)}
                            className={`w-8 h-8 rounded-lg text-xs font-bold border transition-all ${isAbsent ? 'bg-red-600 text-white border-red-600' : 'bg-white text-slate-400 border-slate-200 hover:border-red-400 hover:text-red-600'}`}>A</button>
                        </div>
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>

          {/* Upload Material */}
          <div className="bg-white border border-slate-200 rounded-xl p-5">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h2 className="font-semibold text-slate-800">Lesson Materials</h2>
                <p className="text-xs text-slate-400 mt-0.5">Upload notes, slides, or PDFs for this lesson</p>
              </div>
              <button onClick={() => fileInputRef.current?.click()}
                className="flex items-center gap-2 px-4 py-2 bg-slate-900 text-white text-sm font-medium rounded-lg hover:bg-slate-700 transition">
                <Upload size={15} /> Upload Material
              </button>
              <input ref={fileInputRef} type="file" className="hidden" accept=".pdf,.ppt,.pptx,.doc,.docx,.png,.jpg" onChange={handleFileUpload} />
            </div>
            {getMaterials().length === 0 ? (
              <div onClick={() => fileInputRef.current?.click()} className="border-2 border-dashed border-slate-200 rounded-xl p-8 text-center cursor-pointer hover:border-slate-400 transition">
                <Upload size={28} className="mx-auto text-slate-300 mb-2" />
                <p className="text-slate-400 text-sm">Click to upload or drag and drop</p>
                <p className="text-slate-300 text-xs mt-1">PDF, PPT, DOC, PNG supported</p>
              </div>
            ) : (
              <div className="space-y-2">
                {getMaterials().map((mat, i) => (
                  <div key={i} className="flex items-center justify-between bg-slate-50 border border-slate-200 rounded-lg px-4 py-3">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 bg-slate-200 rounded-lg flex items-center justify-center text-xs font-bold text-slate-600">
                        {mat.name.split('.').pop().toUpperCase()}
                      </div>
                      <div>
                        <p className="text-sm font-medium text-slate-700">{mat.name}</p>
                        <p className="text-xs text-slate-400">Lesson {i + 1}</p>
                      </div>
                    </div>
                    <button onClick={() => removeMaterial(i)} className="text-slate-400 hover:text-red-500 transition"><X size={16} /></button>
                  </div>
                ))}
                <button onClick={() => fileInputRef.current?.click()} className="w-full text-center text-xs text-slate-500 hover:text-slate-800 border border-dashed border-slate-200 rounded-lg py-2 transition">
                  + Add another file
                </button>
              </div>
            )}
          </div>

          {/* Chat — Faculty Reply Panel */}
          <div className="bg-white border border-slate-200 rounded-xl overflow-hidden">
            <button onClick={() => setChatOpen(o => !o)} className="w-full flex items-center justify-between px-5 py-4 hover:bg-slate-50 transition">
              <div className="flex items-center gap-3">
                <MessageCircle size={18} className="text-slate-500" />
                <div className="text-left">
                  <p className="font-semibold text-slate-800 text-sm">Student Queries</p>
                  <p className="text-xs text-slate-400">Reply to absent student doubts from here</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                {unreadCount > 0 && (
                  <span className="bg-red-500 text-white text-xs font-bold px-2 py-0.5 rounded-full">{unreadCount}</span>
                )}
                <span className="text-slate-400 text-xs">{chatOpen ? '▲ Hide' : '▼ Show'}</span>
              </div>
            </button>

            {chatOpen && (
              <div className="border-t border-slate-100">
                <div className="px-5 py-2 bg-amber-50 border-b border-amber-100 text-xs text-amber-700 flex items-center gap-2">
                  <AlertTriangle size={13} />
                  Only material-related questions are allowed. You are replying as Faculty.
                </div>

                {/* Messages */}
                <div className="h-72 overflow-y-auto px-5 py-4 space-y-3 bg-slate-50">
                  {messages.length === 0 && (
                    <p className="text-center text-slate-400 text-sm mt-20">No student queries yet for this date.</p>
                  )}
                  {messages.map((msg) => (
                    <div key={msg.id} className={`flex ${msg.sender === 'faculty' ? 'justify-end' : 'justify-start'}`}>
                      <div className={`max-w-sm rounded-xl px-4 py-2.5 text-sm shadow-sm ${
                        msg.sender === 'faculty'
                          ? 'bg-slate-900 text-white rounded-br-none'
                          : 'bg-white border border-slate-200 text-slate-700 rounded-bl-none'
                      }`}>
                        <p className={`text-xs font-semibold mb-1 ${msg.sender === 'faculty' ? 'text-slate-300' : 'text-blue-500'}`}>
                          {msg.sender_name}
                        </p>
                        <p>{msg.message}</p>
                        <p className="text-xs mt-1 text-right opacity-60">{formatTime(msg.created_at)}</p>
                      </div>
                    </div>
                  ))}
                  <div ref={chatEndRef} />
                </div>

                {/* Faculty reply input */}
                <div className="px-4 py-3 border-t border-slate-100 flex gap-2 bg-white">
                  <input
                    type="text"
                    value={replyText}
                    onChange={e => setReplyText(e.target.value)}
                    onKeyDown={e => e.key === 'Enter' && sendReply()}
                    placeholder="Type your reply to the student..."
                    className="flex-1 border border-slate-200 rounded-lg px-3 py-2 text-sm text-slate-700 focus:outline-none focus:ring-2 focus:ring-slate-400"
                  />
                  <button onClick={sendReply} className="px-4 py-2 bg-slate-900 text-white rounded-lg hover:bg-slate-700 transition">
                    <Send size={16} />
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Save */}
          <div className="flex justify-end">
            <button disabled={markedCount < totalStudents}
              className="px-6 py-2.5 bg-slate-900 text-white rounded-lg font-semibold text-sm hover:bg-slate-700 disabled:opacity-40 disabled:cursor-not-allowed transition">
              {markedCount < totalStudents ? `Save (${totalStudents - markedCount} unmarked)` : 'Save Attendance'}
            </button>
          </div>
        </div>
      )}
    </div>
  )
}