'use client'

import { useState, useRef, useEffect } from 'react'
import { supabase } from '@/lib/supabase'
import { Send, MessageCircle, AlertTriangle, Calendar } from 'lucide-react'

export default function StudentAttendanceView() {
  const [user, setUser] = useState(null)
  const [regCode, setRegCode] = useState('')
  const [submittedCode, setSubmittedCode] = useState('')
  const [showTable, setShowTable] = useState(false)
  const [loading, setLoading] = useState(false)
  const [activeTab, setActiveTab] = useState('attendance')

  const [messages, setMessages] = useState([])
  const [questionText, setQuestionText] = useState('')
  const chatEndRef = useRef(null)

  useEffect(() => {
    const getUserData = async () => {
      const { data: { user: authUser } } = await supabase.auth.getUser()
      if (authUser) {
        const { data } = await supabase
          .from('users')
          .select('*')
          .eq('id', authUser.id)
          .single()

        setUser(data)
      }
    }

    getUserData()
  }, [])

  // ... keep ALL your remaining code exactly same ...

  const allAttendanceData = {
    "FALL SEMESTER 2024-25": [
      { s_no: 1, sty_no: 4, code: 'CHM2042', subject: 'INTRODUCTION TO DISASTER MANAGEMENT', total: '7/14', percent: '50.0' },
      { s_no: 2, sty_no: 4, code: 'CSE2632', subject: 'ALGORITHMS ANALYSIS AND DESIGN 2', total: '13/25', percent: '52.0' },
      { s_no: 3, sty_no: 4, code: 'CSE3141', subject: 'COMPUTER SCIENCE WORKSHOP 2', total: '11/23', percent: '47.83' },
      { s_no: 4, sty_no: 4, code: 'EET2211', subject: 'COMPUTER ORGANISATION AND ARCHITECTURE', total: '15/28', percent: '53.57' },
      { s_no: 5, sty_no: 4, code: 'HSS2024', subject: 'INTRODUCTION TO MACROECONOMICS', total: '10/20', percent: '50.0' },
      { s_no: 6, sty_no: 4, code: 'MTH3003', subject: 'APPLIED LINEAR ALGEBRA', total: '15/27', percent: '55.56' },
    ],
    "SPRING SEMESTER 2024-25": [
      { s_no: 1, sty_no: 3, code: 'CSE2101', subject: 'DATA STRUCTURES AND ALGORITHMS', total: '20/24', percent: '83.33' },
      { s_no: 2, sty_no: 3, code: 'CSE2203', subject: 'OPERATING SYSTEMS', total: '18/22', percent: '81.82' },
      { s_no: 3, sty_no: 3, code: 'MTH2011', subject: 'DISCRETE MATHEMATICS', total: '16/20', percent: '80.0' },
      { s_no: 4, sty_no: 3, code: 'EET2101', subject: 'DIGITAL ELECTRONICS', total: '14/20', percent: '70.0' },
      { s_no: 5, sty_no: 3, code: 'HSS2011', subject: 'TECHNICAL COMMUNICATION', total: '10/14', percent: '71.43' },
      { s_no: 6, sty_no: 3, code: 'CSE2301', subject: 'DATABASE MANAGEMENT SYSTEMS', total: '19/22', percent: '86.36' },
    ],
    "WINTER TERM 2023-24": [
      { s_no: 1, sty_no: 2, code: 'CSE1101', subject: 'INTRODUCTION TO PROGRAMMING', total: '22/24', percent: '91.67' },
      { s_no: 2, sty_no: 2, code: 'MTH1011', subject: 'ENGINEERING MATHEMATICS I', total: '20/24', percent: '83.33' },
      { s_no: 3, sty_no: 2, code: 'PHY1011', subject: 'ENGINEERING PHYSICS', total: '18/22', percent: '81.82' },
      { s_no: 4, sty_no: 2, code: 'CHM1011', subject: 'ENGINEERING CHEMISTRY', total: '15/20', percent: '75.0' },
      { s_no: 5, sty_no: 2, code: 'EET1101', subject: 'BASIC ELECTRICAL ENGINEERING', total: '17/22', percent: '77.27' },
      { s_no: 6, sty_no: 2, code: 'HSS1011', subject: 'PROFESSIONAL ETHICS', total: '12/14', percent: '85.71' },
    ],
  }

  const timetables = {
    "FALL SEMESTER 2024-25": {
      slots: ['8:00–9:00', '9:00–10:00', '10:00–11:00', '11:00–12:00', '12:00–1:00', '1:00–2:00', '2:00–3:00', '3:00–4:00'],
      days: {
        Monday:    ['CHM2042', 'CSE2632', '-', 'MTH3003', 'LUNCH', 'EET2211', 'CSE3141', '-'],
        Tuesday:   ['MTH3003', '-', 'EET2211', 'CSE2632', 'LUNCH', 'HSS2024', '-', 'CHM2042'],
        Wednesday: ['-', 'CSE3141', 'MTH3003', '-', 'LUNCH', 'CSE2632', 'EET2211', 'HSS2024'],
        Thursday:  ['EET2211', 'CHM2042', '-', 'HSS2024', 'LUNCH', 'MTH3003', 'CSE2632', '-'],
        Friday:    ['CSE2632', 'MTH3003', 'HSS2024', '-', 'LUNCH', 'CHM2042', '-', 'CSE3141'],
      }
    },
    "SPRING SEMESTER 2024-25": {
      slots: ['8:00–9:00', '9:00–10:00', '10:00–11:00', '11:00–12:00', '12:00–1:00', '1:00–2:00', '2:00–3:00', '3:00–4:00'],
      days: {
        Monday:    ['CSE2101', 'MTH2011', '-', 'CSE2301', 'LUNCH', 'EET2101', 'CSE2203', '-'],
        Tuesday:   ['CSE2203', '-', 'CSE2301', 'MTH2011', 'LUNCH', 'CSE2101', '-', 'EET2101'],
        Wednesday: ['EET2101', 'CSE2101', '-', 'HSS2011', 'LUNCH', 'MTH2011', 'CSE2301', '-'],
        Thursday:  ['-', 'CSE2301', 'CSE2203', 'EET2101', 'LUNCH', '-', 'HSS2011', 'MTH2011'],
        Friday:    ['MTH2011', '-', 'HSS2011', 'CSE2101', 'LUNCH', 'CSE2203', 'EET2101', '-'],
      }
    },
    "WINTER TERM 2023-24": {
      slots: ['9:00–10:00', '10:00–11:00', '11:00–12:00', '12:00–1:00', '1:00–2:00', '2:00–3:00', '3:00–4:00'],
      days: {
        Monday:    ['CSE1101', 'MTH1011', '-', 'LUNCH', 'PHY1011', 'CHM1011', '-'],
        Tuesday:   ['PHY1011', '-', 'HSS1011', 'LUNCH', 'CSE1101', '-', 'MTH1011'],
        Wednesday: ['MTH1011', 'CHM1011', 'EET1101', 'LUNCH', '-', 'HSS1011', 'PHY1011'],
        Thursday:  ['-', 'EET1101', 'CSE1101', 'LUNCH', 'MTH1011', 'EET1101', '-'],
        Friday:    ['CHM1011', 'HSS1011', '-', 'LUNCH', 'EET1101', '-', 'CSE1101'],
      }
    }
  }

  const subjectColorMap = {
    'CHM2042': 'bg-purple-100 text-purple-800',
    'CSE2632': 'bg-blue-100 text-blue-800',
    'CSE3141': 'bg-green-100 text-green-800',
    'EET2211': 'bg-orange-100 text-orange-800',
    'HSS2024': 'bg-pink-100 text-pink-800',
    'MTH3003': 'bg-yellow-100 text-yellow-800',
    'CSE2101': 'bg-blue-100 text-blue-800',
    'CSE2203': 'bg-green-100 text-green-800',
    'MTH2011': 'bg-yellow-100 text-yellow-800',
    'EET2101': 'bg-orange-100 text-orange-800',
    'HSS2011': 'bg-pink-100 text-pink-800',
    'CSE2301': 'bg-indigo-100 text-indigo-800',
    'CSE1101': 'bg-blue-100 text-blue-800',
    'MTH1011': 'bg-yellow-100 text-yellow-800',
    'PHY1011': 'bg-cyan-100 text-cyan-800',
    'CHM1011': 'bg-purple-100 text-purple-800',
    'EET1101': 'bg-orange-100 text-orange-800',
    'HSS1011': 'bg-pink-100 text-pink-800',
    'LUNCH': 'bg-gray-200 text-gray-500',
    '-': 'bg-white text-gray-300',
  }

  const semesterOptions = [
    "FALL SEMESTER 2024-25",
    "SPRING SEMESTER 2024-25",
    "WINTER TERM 2023-24"
  ]

  useEffect(() => {
    if (!user) return
    const today = new Date().toISOString().split('T')[0]
    const fetchMessages = async () => {
      const { data } = await supabase
        .from('attendance_chat')
        .select('*')
        .eq('section_id', user.branch || 'GENERAL')
        .eq('date', today)
        .order('created_at', { ascending: true })
      if (data) setMessages(data)
    }
    fetchMessages()

    const channel = supabase
      .channel(`chat-${user.branch}-${today}`)
      .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'attendance_chat' }, (payload) => {
        setMessages(prev => [...prev, payload.new])
      }).subscribe()

    return () => { supabase.removeChannel(channel) }
  }, [user])

  useEffect(() => { chatEndRef.current?.scrollIntoView({ behavior: 'smooth' }) }, [messages])

  const sendQuestion = async () => {
    if (!questionText.trim()) return
    const msg = questionText.trim()
    setQuestionText('')
    await supabase.from('attendance_chat').insert({
      section_id: user.branch || 'GENERAL',
      date: new Date().toISOString().split('T')[0],
      sender: 'student',
      sender_name: user.full_name,
      message: msg,
    })
  }

  const handleSubmit = () => {
    if (!regCode) return
    setLoading(true)
    setActiveTab('attendance')
    setTimeout(() => {
      setSubmittedCode(regCode) // ✅ lock in the submitted semester key
      setShowTable(true)
      setLoading(false)
    }, 600)
  }

  // ✅ Use submittedCode (not regCode) so lookup always matches the correct key
  const attendanceData = allAttendanceData[submittedCode] || []
  const currentTimetable = timetables[submittedCode] || null
  const currentSubjects = attendanceData.map(r => r.code)

  return (
    <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
      {/* HEADER */}
      <div className="bg-[#003a70] text-white p-5 rounded-t-xl shadow-lg flex items-center gap-3">
        <span className="text-xl">👤</span>
        <h2 className="text-xl font-bold tracking-tight">Attendance View</h2>
      </div>

      <div className="bg-white rounded-b-xl shadow-2xl border border-gray-100 p-8 min-h-[600px]">

        {/* SELECTION AREA */}
        <div className="flex flex-col md:flex-row items-end gap-6 mb-8 border-b pb-8">
          <div className="flex-1 max-w-md relative">
            <label className="text-[10px] font-bold text-red-500 uppercase tracking-tighter mb-1 block">
              Semester Code *
            </label>
            <select
              value={regCode}
              onChange={(e) => {
                setRegCode(e.target.value)
                setShowTable(false)
                setSubmittedCode('')
                setActiveTab('attendance')
              }}
              className="w-full border-b-2 border-gray-200 py-2 text-sm font-semibold focus:outline-none focus:border-blue-600 transition-colors bg-transparent appearance-none cursor-pointer"
            >
              <option value="">-- Select --</option>
              {semesterOptions.map(opt => (
                <option key={opt} value={opt}>{opt}</option>
              ))}
            </select>
            <span className="absolute right-2 bottom-3 text-gray-400 pointer-events-none text-[10px]">▼</span>
          </div>

          <button
            onClick={handleSubmit}
            disabled={!regCode || loading}
            className={`flex items-center gap-2 px-6 py-2 rounded shadow-md text-xs font-bold transition-all ${!regCode ? 'bg-gray-300 text-gray-500 cursor-not-allowed' : 'bg-[#5cb85c] text-white hover:bg-green-700'}`}
          >
            <span className="text-sm">💾</span> {loading ? 'Loading...' : 'Submit'}
          </button>
        </div>

        {/* TABS + CONTENT */}
        {showTable && submittedCode && (
          <div>
            {/* TAB BUTTONS */}
            <div className="flex gap-2 mb-6 border-b border-gray-200">
              <button
                onClick={() => setActiveTab('attendance')}
                className={`px-4 py-2 text-xs font-bold rounded-t transition-all border-b-2 ${activeTab === 'attendance' ? 'border-[#003a70] text-[#003a70]' : 'border-transparent text-gray-400 hover:text-gray-600'}`}
              >
                📋 Attendance
              </button>
              <button
                onClick={() => setActiveTab('timetable')}
                className={`px-4 py-2 text-xs font-bold rounded-t transition-all border-b-2 ${activeTab === 'timetable' ? 'border-[#003a70] text-[#003a70]' : 'border-transparent text-gray-400 hover:text-gray-600'}`}
              >
                📅 Timetable
              </button>
            </div>

            {/* ATTENDANCE TAB */}
            {activeTab === 'attendance' && (
              <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
                <div className="xl:col-span-2 overflow-x-auto border border-gray-200 rounded-lg shadow-sm">
                  <table className="w-full border-collapse bg-white text-sm">
                    <thead>
                      <tr className="bg-gray-100 border-b border-gray-300">
                        <th className="p-3 text-left font-bold text-gray-700 border-r border-gray-200 text-[11px]">S.No</th>
                        <th className="p-3 text-left font-bold text-gray-700 border-r border-gray-200 text-[11px]">Sty No</th>
                        <th className="p-3 text-left font-bold text-gray-700 border-r border-gray-200 text-[11px]">Subject Code</th>
                        <th className="p-3 text-left font-bold text-gray-700 border-r border-gray-200 text-[11px]">Subject</th>
                        <th className="p-3 text-left font-bold text-gray-700 border-r border-gray-200 text-[11px]">Total Class</th>
                        <th className="p-3 text-right font-bold text-gray-700 text-[11px]">Attendance %</th>
                      </tr>
                    </thead>
                    <tbody>
                      {attendanceData.map((row, idx) => (
                        <tr key={row.s_no} className={`border-b hover:bg-blue-50 transition-colors ${idx % 2 === 0 ? 'bg-white' : 'bg-gray-50'}`}>
                          <td className="p-3 border-r border-gray-200 text-gray-600 text-[11px]">{row.s_no}</td>
                          <td className="p-3 border-r border-gray-200 text-gray-600 text-[11px]">{row.sty_no}</td>
                          <td className="p-3 border-r border-gray-200 font-semibold text-gray-800 text-[11px]">{row.code}</td>
                          <td className="p-3 border-r border-gray-200 text-gray-800 text-[11px]">{row.subject}</td>
                          <td className="p-3 border-r border-gray-200 text-gray-600 text-[11px]">{row.total}</td>
                          <td className={`p-3 text-right font-bold text-[11px] ${parseFloat(row.percent) < 75 ? 'text-red-600' : 'text-green-600'}`}>
                            {row.percent}%
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                {/* CHAT BOX */}
                <div className="bg-slate-50 border rounded-xl overflow-hidden shadow-inner flex flex-col h-[400px]">
                  <div className="bg-[#002d5b] text-white p-3 flex items-center gap-2">
                    <MessageCircle size={14} />
                    <span className="text-[10px] font-bold uppercase tracking-widest">Absence Inquiry Chat</span>
                  </div>
                  <div className="p-2 bg-amber-50 text-[9px] text-amber-700 border-b italic flex items-center gap-1">
                    <AlertTriangle size={10} /> Material doubts only for absent dates.
                  </div>
                  <div className="flex-1 overflow-y-auto p-4 space-y-3">
                    {messages.length === 0 && (
                      <div className="flex items-center justify-center h-full opacity-30">
                        <p className="text-[10px] text-gray-500 uppercase tracking-widest text-center">No messages yet</p>
                      </div>
                    )}
                    {messages.map((msg) => (
                      <div key={msg.id} className={`flex ${msg.sender === 'student' ? 'justify-end' : 'justify-start'}`}>
                        <div className={`max-w-[80%] rounded-lg p-2 text-[11px] shadow-sm ${msg.sender === 'student' ? 'bg-blue-600 text-white' : 'bg-white border text-gray-700'}`}>
                          <p className="text-[9px] opacity-70 mb-1 font-bold">{msg.sender === 'student' ? 'You' : 'Faculty'}</p>
                          <p>{msg.message}</p>
                        </div>
                      </div>
                    ))}
                    <div ref={chatEndRef} />
                  </div>
                  <div className="p-3 bg-white border-t flex gap-2">
                    <input
                      type="text"
                      value={questionText}
                      onChange={e => setQuestionText(e.target.value)}
                      onKeyDown={e => e.key === 'Enter' && sendQuestion()}
                      placeholder="Ask a doubt..."
                      className="flex-1 border rounded-lg px-3 py-1.5 text-xs focus:outline-none focus:ring-1 focus:ring-blue-500"
                    />
                    <button onClick={sendQuestion} className="bg-blue-600 text-white p-2 rounded-lg hover:bg-blue-700">
                      <Send size={14} />
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* TIMETABLE TAB */}
            {activeTab === 'timetable' && (
              <div>
                {!currentTimetable ? (
                  <div className="py-16 text-center text-gray-400 text-xs uppercase tracking-widest">
                    No timetable available for this semester.
                  </div>
                ) : (
                  <>
                    <div className="flex items-center gap-2 mb-4">
                      <Calendar size={14} className="text-[#003a70]" />
                      <span className="text-xs font-bold text-[#003a70] uppercase tracking-widest">{submittedCode} — Weekly Timetable</span>
                    </div>

                    <div className="flex flex-wrap gap-2 mb-5">
                      {currentSubjects.map(code => (
                        <span key={code} className={`px-2 py-0.5 rounded text-[10px] font-bold ${subjectColorMap[code] || 'bg-gray-100 text-gray-600'}`}>{code}</span>
                      ))}
                      <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-gray-200 text-gray-500">LUNCH</span>
                    </div>

                    <div className="overflow-x-auto border border-gray-200 rounded-lg shadow-sm">
                      <table className="w-full border-collapse text-[11px]">
                        <thead>
                          <tr className="bg-[#003a70] text-white">
                            <th className="p-2 text-left font-bold border-r border-blue-800 min-w-[80px]">Day</th>
                            {currentTimetable.slots.map(slot => (
                              <th key={slot} className="p-2 text-center font-bold border-r border-blue-800 min-w-[90px] whitespace-nowrap">{slot}</th>
                            ))}
                          </tr>
                        </thead>
                        <tbody>
                          {Object.entries(currentTimetable.days).map(([day, slots], idx) => (
                            <tr key={day} className={`border-b border-gray-200 ${idx % 2 === 0 ? 'bg-white' : 'bg-gray-50'}`}>
                              <td className="p-2 font-bold text-gray-700 border-r border-gray-200">{day}</td>
                              {slots.map((subject, i) => (
                                <td key={i} className="p-1.5 border-r border-gray-200 text-center">
                                  {subject === '-' ? (
                                    <span className="text-gray-200">—</span>
                                  ) : (
                                    <span className={`inline-block px-1.5 py-0.5 rounded text-[10px] font-bold w-full ${subjectColorMap[subject] || 'bg-gray-100 text-gray-600'}`}>
                                      {subject}
                                    </span>
                                  )}
                                </td>
                              ))}
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>

                    <p className="text-[10px] text-gray-400 mt-3 italic">* Timetable is subject to change. Check with faculty for updates.</p>
                  </>
                )}
              </div>
            )}
          </div>
        )}

        {/* EMPTY STATE */}
        {!showTable && !loading && (
          <div className="py-24 flex flex-col items-center justify-center opacity-30 select-none grayscale">
            <span className="text-7xl mb-4">📊</span>
            <p className="font-black text-gray-500 uppercase tracking-[0.2em] text-[10px]">Select Semester to view Attendance</p>
          </div>
        )}
      </div>
    </div>
  )
}