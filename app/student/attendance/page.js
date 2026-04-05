'use client'
import { useState, useRef, useEffect } from 'react'
import { createClient } from '@supabase/supabase-js'
import { Send, MessageCircle, AlertTriangle } from 'lucide-react'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
)

// Change this to match the student's actual section and name
// In real app, pull these from your auth session / student profile table
const STUDENT_SECTION = 'CSE-A'
const STUDENT_NAME    = 'Absent Student' // replace with session user's name

function todayStr() { return new Date().toISOString().split('T')[0] }

function formatTime(ts) {
  return new Date(ts).toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' })
}

export default function StudentAttendanceChatPage() {
  const [messages, setMessages]   = useState([])
  const [questionText, setQuestionText] = useState('')
  const [selectedDate] = useState(todayStr())
  const chatEndRef = useRef(null)

  // ── Fetch + realtime ────────────────────────────────────────────────────
  useEffect(() => {
    const fetchMessages = async () => {
      const { data } = await supabase
        .from('attendance_chat')
        .select('*')
        .eq('section_id', STUDENT_SECTION)
        .eq('date', selectedDate)
        .order('created_at', { ascending: true })
      if (data) setMessages(data)
    }

    fetchMessages()

    const channel = supabase
      .channel(`student-chat-${STUDENT_SECTION}-${selectedDate}`)
      .on('postgres_changes', {
        event: 'INSERT',
        schema: 'public',
        table: 'attendance_chat',
        filter: `section_id=eq.${STUDENT_SECTION}`,
      }, (payload) => {
        if (payload.new.date === selectedDate) {
          setMessages(prev => [...prev, payload.new])
        }
      })
      .subscribe()

    return () => { supabase.removeChannel(channel) }
  }, [selectedDate])

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  // ── Student sends question ───────────────────────────────────────────────
  const sendQuestion = async () => {
    const msg = questionText.trim()
    if (!msg) return
    setQuestionText('')

    await supabase.from('attendance_chat').insert({
      section_id: STUDENT_SECTION,
      date: selectedDate,
      sender: 'student',
      sender_name: STUDENT_NAME,
      message: msg,
    })
  }

  return (
    <div className="p-6 max-w-2xl mx-auto">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-slate-800">Ask a Doubt</h1>
        <p className="text-slate-500 text-sm mt-1">
          You were marked absent. Post your material-related doubts below — your faculty will reply here.
        </p>
      </div>

      <div className="bg-white border border-slate-200 rounded-xl overflow-hidden">
        {/* Header */}
        <div className="flex items-center gap-3 px-5 py-4 border-b border-slate-100">
          <MessageCircle size={18} className="text-slate-500" />
          <div>
            <p className="font-semibold text-slate-800 text-sm">Class Chat — {STUDENT_SECTION}</p>
            <p className="text-xs text-slate-400">Today: {new Date().toLocaleDateString('en-IN', { weekday: 'long', day: '2-digit', month: 'long' })}</p>
          </div>
        </div>

        {/* Notice */}
        <div className="px-5 py-2 bg-amber-50 border-b border-amber-100 text-xs text-amber-700 flex items-center gap-2">
          <AlertTriangle size={13} />
          Only material-related questions are allowed in this chat.
        </div>

        {/* Messages */}
        <div className="h-96 overflow-y-auto px-5 py-4 space-y-3 bg-slate-50">
          {messages.length === 0 && (
            <p className="text-center text-slate-400 text-sm mt-32">No messages yet. Ask your first doubt below.</p>
          )}
          {messages.map((msg) => (
            <div key={msg.id} className={`flex ${msg.sender === 'student' ? 'justify-end' : 'justify-start'}`}>
              <div className={`max-w-sm rounded-xl px-4 py-2.5 text-sm shadow-sm ${
                msg.sender === 'student'
                  ? 'bg-blue-600 text-white rounded-br-none'
                  : 'bg-white border border-slate-200 text-slate-700 rounded-bl-none'
              }`}>
                <p className={`text-xs font-semibold mb-1 ${msg.sender === 'student' ? 'text-blue-200' : 'text-emerald-600'}`}>
                  {msg.sender === 'student' ? 'You' : msg.sender_name}
                </p>
                <p>{msg.message}</p>
                <p className="text-xs mt-1 text-right opacity-60">{formatTime(msg.created_at)}</p>
              </div>
            </div>
          ))}
          <div ref={chatEndRef} />
        </div>

        {/* Input */}
        <div className="px-4 py-3 border-t border-slate-100 flex gap-2 bg-white">
          <input
            type="text"
            value={questionText}
            onChange={e => setQuestionText(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && sendQuestion()}
            placeholder="Type your doubt about today's material..."
            className="flex-1 border border-slate-200 rounded-lg px-3 py-2 text-sm text-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-400"
          />
          <button onClick={sendQuestion} className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition">
            <Send size={16} />
          </button>
        </div>
      </div>
    </div>
  )
}