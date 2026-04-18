'use client'

import { useState, useRef } from 'react'
import { supabase } from '@/lib/supabase'
import {
  Download,
  CreditCard,
  ChevronDown,
  MapPin,
  Clock,
  User,
  BookOpen,
  Stamp,
  AlertCircle,
  Printer,
} from 'lucide-react'

// ─── MOCK DATA (replace with real Supabase fetches) ──────────────────────────

const REGISTRATION_CODES = [
  { value: 'FALL_2526', label: 'FALL SEMESTER 2025-26' },
  { value: 'SPRING_2526', label: 'SPRING SEMESTER 2025-26' },
  { value: 'WINTER_2425', label: 'WINTER SEMESTER 2025-26' },
]

const EXAM_DESCRIPTIONS = [
  { value: 'internal', label: 'Internal Exam' },
  { value: 'end_sem', label: 'End Semester Exam' },
  { value: 'supplementary', label: 'Supplementary Exam' },
]

const EXAM_CODES = {
  internal: [
    { value: '4SEM_INT_APR26', label: '4TH SEM INTERNAL APRIL 2026' },
    { value: '2SEM_INT_APR26', label: '2ND SEM INTERNAL APRIL 2026' },
  ],
  end_sem: [
    { value: '4SEM_END_MAY26', label: '4TH SEM END SEM MAY 2026' },
    { value: '2SEM_END_MAY26', label: '2ND SEM END SEM MAY 2026' },
  ],
  supplementary: [
    { value: '4SEM_SUPP_JUN26', label: '4TH SEM SUPPLEMENTARY JUNE 2026' },
  ],
}

// Mock admit card data — replace with Supabase query result
const MOCK_ADMIT_CARD = {
  student: {
    name: 'ROHAN KUMAR DASH',
    rollNo: '2201289054',
    regNo: '2022BCS054',
    branch: 'Computer Science & Engineering',
    semester: '4th Semester',
    section: 'A',
    photoUrl: null, // replace with actual photo URL from Supabase storage
  },
  exam: {
    center: 'Campus1 — Block B, Exam Hall 3',
    room: 'B-301',
    seatNo: 'A-27',
    reportingTime: '09:00 AM',
  },
  schedule: [
    {
      date: '14 April 2026',
      day: 'Tuesday',
      time: '10:00 AM – 12:00 PM',
      subjectCode: 'CS401',
      subjectName: 'Design & Analysis of Algorithms',
    },
    {
      date: '16 April 2026',
      day: 'Thursday',
      time: '10:00 AM – 12:00 PM',
      subjectCode: 'CS402',
      subjectName: 'Operating Systems',
    },
    {
      date: '18 April 2026',
      day: 'Saturday',
      time: '10:00 AM – 12:00 PM',
      subjectCode: 'CS403',
      subjectName: 'Computer Networks',
    },
    {
      date: '21 April 2026',
      day: 'Tuesday',
      time: '10:00 AM – 12:00 PM',
      subjectCode: 'CS404',
      subjectName: 'Software Engineering',
    },
    {
      date: '23 April 2026',
      day: 'Thursday',
      time: '10:00 AM – 12:00 PM',
      subjectCode: 'CS405',
      subjectName: 'Database Management Systems',
    },
  ],
}

// ─── CUSTOM SELECT ────────────────────────────────────────────────────────────

function Select({ label, value, onChange, options, placeholder = 'Select...' }) {
  const [open, setOpen] = useState(false)
  const selected = options.find((o) => o.value === value)

  return (
    <div className="relative">
      <label className="block text-[11px] font-semibold uppercase tracking-widest text-slate-400 mb-1.5">
        {label} <span className="text-blue-400">*</span>
      </label>
      <button
        type="button"
        onClick={() => setOpen(!open)}
        className="w-full flex items-center justify-between px-4 py-2.5 bg-slate-800/60 border border-slate-700 rounded-lg text-sm text-slate-200 hover:border-blue-500 transition-colors focus:outline-none focus:border-blue-500"
      >
        <span className={selected ? 'text-slate-100' : 'text-slate-500'}>
          {selected ? selected.label : placeholder}
        </span>
        <ChevronDown
          size={14}
          className={`text-slate-400 transition-transform ${open ? 'rotate-180' : ''}`}
        />
      </button>
      {open && (
        <div className="absolute z-50 mt-1 w-full bg-slate-800 border border-slate-700 rounded-lg shadow-xl overflow-hidden">
          {options.map((opt) => (
            <button
              key={opt.value}
              type="button"
              onClick={() => { onChange(opt.value); setOpen(false) }}
              className={`w-full text-left px-4 py-2.5 text-sm hover:bg-slate-700 transition-colors ${
                value === opt.value ? 'text-blue-400 bg-slate-700/50' : 'text-slate-200'
              }`}
            >
              {opt.label}
            </button>
          ))}
        </div>
      )}
    </div>
  )
}

// ─── ADMIT CARD PRINT VIEW ───────────────────────────────────────────────────

function AdmitCardView({ data, examLabel }) {
  return (
    <div
      id="admit-card-printable"
      className="bg-white text-slate-900 rounded-xl overflow-hidden shadow-2xl"
      style={{ fontFamily: "'Georgia', serif" }}
    >
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-900 to-blue-700 text-white px-8 py-5 flex items-center gap-6">
        <div className="w-14 h-14 rounded-full bg-white/20 flex items-center justify-center shrink-0">
          <CreditCard size={28} className="text-white" />
        </div>
        <div>
          <p className="text-blue-200 text-xs tracking-widest uppercase font-semibold">
            Institute of Technical Education & Research
          </p>
          <h2 className="text-2xl font-bold tracking-tight leading-tight">
            ADMIT CARD
          </h2>
          <p className="text-blue-200 text-sm mt-0.5">{examLabel}</p>
        </div>
        <div className="ml-auto text-right">
          <p className="text-blue-200 text-xs uppercase tracking-wider">Seat No.</p>
          <p className="text-3xl font-bold">{data.exam.seatNo}</p>
        </div>
      </div>

      {/* Body */}
      <div className="p-8">
        {/* Student Details */}
        <div className="flex gap-8 mb-8 pb-8 border-b border-slate-200">
          {/* Photo */}
          <div className="shrink-0">
            <div className="w-28 h-32 border-2 border-slate-300 rounded-lg overflow-hidden bg-slate-100 flex items-center justify-center">
              {data.student.photoUrl ? (
                <img
                  src={data.student.photoUrl}
                  alt="Student"
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="text-center p-2">
                  <User size={32} className="text-slate-300 mx-auto mb-1" />
                  <p className="text-[9px] text-slate-400">Photo</p>
                </div>
              )}
            </div>
          </div>

          {/* Info grid */}
          <div className="grid grid-cols-2 gap-x-12 gap-y-4 flex-1">
            {[
              ['Student Name', data.student.name],
              ['Roll Number', data.student.rollNo],
              ['Registration No.', data.student.regNo],
              ['Branch', data.student.branch],
              ['Semester', data.student.semester],
              ['Section', data.student.section],
            ].map(([label, val]) => (
              <div key={label}>
                <p className="text-[10px] uppercase tracking-widest text-slate-400 font-semibold mb-0.5">
                  {label}
                </p>
                <p className="text-sm font-semibold text-slate-800">{val}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Exam Center Info */}
        <div className="grid grid-cols-3 gap-6 mb-8 pb-8 border-b border-slate-200">
          <div className="flex gap-3 items-start">
            <MapPin size={16} className="text-blue-600 mt-0.5 shrink-0" />
            <div>
              <p className="text-[10px] uppercase tracking-widest text-slate-400 font-semibold mb-0.5">
                Exam Center
              </p>
              <p className="text-sm font-semibold text-slate-800">{data.exam.center}</p>
            </div>
          </div>
          <div className="flex gap-3 items-start">
            <BookOpen size={16} className="text-blue-600 mt-0.5 shrink-0" />
            <div>
              <p className="text-[10px] uppercase tracking-widest text-slate-400 font-semibold mb-0.5">
                Room No.
              </p>
              <p className="text-sm font-semibold text-slate-800">{data.exam.room}</p>
            </div>
          </div>
          <div className="flex gap-3 items-start">
            <Clock size={16} className="text-blue-600 mt-0.5 shrink-0" />
            <div>
              <p className="text-[10px] uppercase tracking-widest text-slate-400 font-semibold mb-0.5">
                Reporting Time
              </p>
              <p className="text-sm font-semibold text-slate-800">{data.exam.reportingTime}</p>
            </div>
          </div>
        </div>

        {/* Exam Schedule Table */}
        <div className="mb-8">
          <h3 className="text-xs uppercase tracking-widest font-bold text-slate-500 mb-3">
            Examination Schedule
          </h3>
          <table className="w-full text-sm border-collapse">
            <thead>
              <tr className="bg-blue-900 text-white">
                {['Date', 'Day', 'Time', 'Subject Code', 'Subject Name'].map((h) => (
                  <th
                    key={h}
                    className="text-left px-4 py-2.5 text-[11px] uppercase tracking-wider font-semibold"
                  >
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {data.schedule.map((row, i) => (
                <tr
                  key={i}
                  className={i % 2 === 0 ? 'bg-slate-50' : 'bg-white'}
                >
                  <td className="px-4 py-2.5 font-semibold text-slate-700">{row.date}</td>
                  <td className="px-4 py-2.5 text-slate-600">{row.day}</td>
                  <td className="px-4 py-2.5 text-slate-600 whitespace-nowrap">{row.time}</td>
                  <td className="px-4 py-2.5 font-mono text-blue-700 font-semibold">{row.subjectCode}</td>
                  <td className="px-4 py-2.5 text-slate-700">{row.subjectName}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Signature Block */}
        <div className="flex justify-between items-end pt-6 border-t border-slate-200">
          <div className="text-center">
            <div className="w-40 border-b border-slate-400 mb-1 h-10 flex items-end justify-center">
              <Stamp size={20} className="text-slate-300 mb-1" />
            </div>
            <p className="text-[10px] uppercase tracking-wider text-slate-500">
              Student Signature
            </p>
          </div>
          <div className="text-center">
            <div className="w-40 border-b border-slate-400 mb-1 h-10" />
            <p className="text-[10px] uppercase tracking-wider text-slate-500">
              Invigilator Signature
            </p>
          </div>
          <div className="text-center">
            <div className="w-40 border-b border-slate-400 mb-1 h-10" />
            <p className="text-[10px] uppercase tracking-wider text-slate-500">
              Controller of Examinations
            </p>
          </div>
        </div>

        {/* Notes */}
        <div className="mt-6 bg-amber-50 border border-amber-200 rounded-lg px-5 py-4 space-y-1.5">
          {[
            'Please Contact Our University Office in case of any dispute or mismatch in data.',
            'This is a Computer Generated Report.',
            'Carry this Admit Card along with a valid photo ID on the day of examination.',
          ].map((note, i) => (
            <p key={i} className="text-xs text-amber-800">
              <span className="font-bold">Note {i + 1}:</span> {note}
            </p>
          ))}
        </div>
      </div>
    </div>
  )
}

// ─── MAIN PAGE ────────────────────────────────────────────────────────────────

export default function AdmitCardPage() {
  const [regCode, setRegCode] = useState('')
  const [examDesc, setExamDesc] = useState('')
  const [examCode, setExamCode] = useState('')
  const [generated, setGenerated] = useState(false)
  const [loading, setLoading] = useState(false)
  const printRef = useRef(null)

  const availableExamCodes = examDesc ? (EXAM_CODES[examDesc] || []) : []

  // Reset dependent dropdowns when parent changes
  const handleExamDescChange = (val) => {
    setExamDesc(val)
    setExamCode('')
    setGenerated(false)
  }

  const handleGenerate = async () => {
    if (!regCode || !examDesc || !examCode) return
    setLoading(true)

    // TODO: Replace with actual Supabase fetch:
    // const supabase = createClientComponentClient()
    // const { data } = await supabase
    //   .from('admit_cards')
    //   .select('*, exam_schedule(*)')
    //   .eq('exam_code', examCode)
    //   .eq('student_id', currentUser.id)
    //   .single()

    await new Promise((r) => setTimeout(r, 800)) // simulate fetch
    setLoading(false)
    setGenerated(true)
  }

  const handleDownload = () => {
    // Uses browser print dialog scoped to the admit card div
    const printContents = document.getElementById('admit-card-printable').innerHTML
    const win = window.open('', '_blank')
    win.document.write(`
      <!DOCTYPE html>
      <html>
        <head>
          <title>Admit Card</title>
          <link href="https://cdn.jsdelivr.net/npm/tailwindcss@2.2.19/dist/tailwind.min.css" rel="stylesheet">
          <style>
            body { margin: 0; padding: 24px; font-family: Georgia, serif; }
            @media print {
              body { padding: 0; }
              @page { margin: 1cm; }
            }
          </style>
        </head>
        <body onload="window.print(); window.close();">
          <div style="max-width: 900px; margin: 0 auto;">
            ${printContents}
          </div>
        </body>
      </html>
    `)
    win.document.close()
  }

  const selectedExamLabel =
    EXAM_CODES[examDesc]?.find((e) => e.value === examCode)?.label || ''

  return (
    <div className="min-h-screen bg-slate-900 text-slate-100">
      <div className="max-w-5xl mx-auto px-6 py-10">

        {/* Page Header */}
        <div className="flex items-center gap-3 mb-8">
          <div className="w-10 h-10 rounded-lg bg-blue-600 flex items-center justify-center">
            <CreditCard size={20} className="text-white" />
          </div>
          <div>
            <h1 className="text-2xl font-bold tracking-tight">My Admit Card</h1>
            <p className="text-slate-400 text-sm mt-0.5">
              Select your exam details to generate and download your admit card.
            </p>
          </div>
        </div>

        {/* Selection Panel */}
        <div className="bg-slate-800/50 border border-slate-700 rounded-xl p-6 mb-8">
          {/* Student info row (hidden — pulled from session) */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5 mb-5">
            <Select
              label="Registration Code"
              value={regCode}
              onChange={(v) => { setRegCode(v); setGenerated(false) }}
              options={REGISTRATION_CODES}
              placeholder="Select registration..."
            />
            <Select
              label="Exam Description"
              value={examDesc}
              onChange={handleExamDescChange}
              options={EXAM_DESCRIPTIONS}
              placeholder="Select exam type..."
            />
            <Select
              label="Exam Code"
              value={examCode}
              onChange={(v) => { setExamCode(v); setGenerated(false) }}
              options={availableExamCodes}
              placeholder={examDesc ? 'Select exam code...' : 'Select exam type first'}
            />
          </div>

          <div className="flex items-center justify-between pt-4 border-t border-slate-700">
            <div className="flex items-center gap-2 text-amber-400 text-xs">
              <AlertCircle size={14} />
              <span>
                All fields are required to generate the admit card.
              </span>
            </div>
            <div className="flex gap-3">
              {generated && (
                <button
                  onClick={handleDownload}
                  className="flex items-center gap-2 px-5 py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white text-sm font-semibold rounded-lg transition-colors"
                >
                  <Printer size={15} />
                  Download PDF
                </button>
              )}
              <button
                onClick={handleGenerate}
                disabled={!regCode || !examDesc || !examCode || loading}
                className="flex items-center gap-2 px-5 py-2.5 bg-blue-600 hover:bg-blue-500 disabled:opacity-40 disabled:cursor-not-allowed text-white text-sm font-semibold rounded-lg transition-colors"
              >
                {loading ? (
                  <>
                    <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24" fill="none">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" />
                    </svg>
                    Generating...
                  </>
                ) : (
                  <>
                    <Download size={15} />
                    Generate Admit Card
                  </>
                )}
              </button>
            </div>
          </div>
        </div>

        {/* Admit Card Preview */}
        {generated && (
          <div ref={printRef}>
            <AdmitCardView data={MOCK_ADMIT_CARD} examLabel={selectedExamLabel} />
          </div>
        )}

        {/* Notes (always visible) */}
        <div className="mt-6 text-xs text-slate-500 space-y-1">
          <p>• Note 1: Please Contact Our University Office in case of any dispute or mismatch in data.</p>
          <p>• Note 2: This is a Computer Generated Report.</p>
        </div>
      </div>
    </div>
  )
}