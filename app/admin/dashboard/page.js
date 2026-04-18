'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'

// ─── Dummy Data ───────────────────────────────────────────────────────────────

const facultyData = [
  { id: 'F001', name: 'Dr. Arjun Mehta', department: 'CSE', designation: 'Professor & HOD', email: 'arjun.mehta@college.edu', phone: '9876543210', subjects: ['Data Structures', 'Algorithms'], experience: '18 yrs' },
  { id: 'F002', name: 'Dr. Priya Sharma', department: 'CSE', designation: 'Associate Professor', email: 'priya.sharma@college.edu', phone: '9876543211', subjects: ['DBMS', 'Cloud Computing'], experience: '12 yrs' },
  { id: 'F003', name: 'Prof. Rohit Verma', department: 'CSE', designation: 'Assistant Professor', email: 'rohit.verma@college.edu', phone: '9876543212', subjects: ['Web Development', 'OS'], experience: '7 yrs' },
  { id: 'F004', name: 'Dr. Sunita Nair', department: 'EE', designation: 'Professor & HOD', email: 'sunita.nair@college.edu', phone: '9876543213', subjects: ['Power Systems', 'Control Systems'], experience: '20 yrs' },
  { id: 'F005', name: 'Prof. Kiran Das', department: 'EE', designation: 'Associate Professor', email: 'kiran.das@college.edu', phone: '9876543214', subjects: ['Analog Electronics', 'Signals'], experience: '10 yrs' },
  { id: 'F006', name: 'Dr. Amit Joshi', department: 'MATH', designation: 'Professor', email: 'amit.joshi@college.edu', phone: '9876543215', subjects: ['Linear Algebra', 'Calculus'], experience: '15 yrs' },
]

const internalSchedule = [
  { date: '2025-07-10', day: 'Thursday', time: '10:00 AM', subject: 'Data Structures', branch: 'CSE', semester: '3rd', room: 'A-101' },
  { date: '2025-07-11', day: 'Friday', time: '10:00 AM', subject: 'DBMS', branch: 'CSE', semester: '5th', room: 'A-102' },
  { date: '2025-07-12', day: 'Saturday', time: '02:00 PM', subject: 'Power Systems', branch: 'EE', semester: '5th', room: 'B-201' },
  { date: '2025-07-14', day: 'Monday', time: '10:00 AM', subject: 'Analog Electronics', branch: 'EE', semester: '3rd', room: 'B-202' },
  { date: '2025-07-15', day: 'Tuesday', time: '10:00 AM', subject: 'Linear Algebra', branch: 'CSE/EE', semester: '1st', room: 'C-101' },
]

const externalSchedule = [
  { date: '2025-11-03', day: 'Monday', time: '09:00 AM', subject: 'Data Structures', branch: 'CSE', semester: '3rd', room: 'Hall-1' },
  { date: '2025-11-04', day: 'Tuesday', time: '09:00 AM', subject: 'DBMS', branch: 'CSE', semester: '5th', room: 'Hall-1' },
  { date: '2025-11-05', day: 'Wednesday', time: '09:00 AM', subject: 'Power Systems', branch: 'EE', semester: '5th', room: 'Hall-2' },
  { date: '2025-11-06', day: 'Thursday', time: '09:00 AM', subject: 'Analog Electronics', branch: 'EE', semester: '3rd', room: 'Hall-2' },
  { date: '2025-11-07', day: 'Friday', time: '09:00 AM', subject: 'Linear Algebra', branch: 'CSE/EE', semester: '1st', room: 'Hall-3' },
  { date: '2025-11-10', day: 'Monday', time: '09:00 AM', subject: 'Cloud Computing', branch: 'CSE', semester: '7th', room: 'Hall-1' },
]

// ─── Icons (inline SVG) ───────────────────────────────────────────────────────

const Icons = {
  Academic: () => (
    <svg width="18" height="18" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M12 14l9-5-9-5-9 5 9 5z" />
      <path strokeLinecap="round" strokeLinejoin="round" d="M12 14l6.16-3.422A12.083 12.083 0 0121 13c0 3.866-4.03 7-9 7s-9-3.134-9-7c0-.546.08-1.077.22-1.578L12 14z" />
    </svg>
  ),
  Exam: () => (
    <svg width="18" height="18" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
    </svg>
  ),
  Department: () => (
    <svg width="18" height="18" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" />
    </svg>
  ),
  Upload: () => (
    <svg width="20" height="20" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
    </svg>
  ),
  ChevronDown: ({ open }) => (
    <svg width="14" height="14" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}
      style={{ transition: 'transform 0.25s', transform: open ? 'rotate(180deg)' : 'rotate(0deg)' }}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
    </svg>
  ),
  Logout: () => (
    <svg width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
    </svg>
  ),
  Calendar: () => (
    <svg width="20" height="20" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
      <rect x="3" y="4" width="18" height="18" rx="2" strokeLinecap="round" strokeLinejoin="round" />
      <path strokeLinecap="round" strokeLinejoin="round" d="M16 2v4M8 2v4M3 10h18" />
    </svg>
  ),
}

// ─── Sub-components ───────────────────────────────────────────────────────────

function AcademicsPanel() {
  const [file, setFile] = useState(null)
  const [uploaded, setUploaded] = useState(false)
  const [dragging, setDragging] = useState(false)

  const handleFile = (f) => {
    if (f && (f.type === 'application/pdf' || f.name.endsWith('.pdf') || f.name.endsWith('.xlsx'))) {
      setFile(f)
      setUploaded(false)
    }
  }

  const handleDrop = (e) => {
    e.preventDefault()
    setDragging(false)
    handleFile(e.dataTransfer.files[0])
  }

  const handleUpload = () => {
    if (!file) return
    setTimeout(() => setUploaded(true), 800)
  }

  return (
    <div>
      <div style={{ marginBottom: '2rem' }}>
        <h2 style={{ fontSize: '1.5rem', fontWeight: 700, color: '#0d1b2a', marginBottom: '0.3rem' }}>Academic Calendar</h2>
        <p style={{ color: '#64748b', fontSize: '0.875rem' }}>Upload the official academic calendar for the current session.</p>
      </div>

      {/* Upload Zone */}
      <div
        onDragOver={(e) => { e.preventDefault(); setDragging(true) }}
        onDragLeave={() => setDragging(false)}
        onDrop={handleDrop}
        style={{
          border: `2px dashed ${dragging ? '#3b82f6' : file ? '#22c55e' : '#cbd5e1'}`,
          borderRadius: '16px',
          padding: '3rem 2rem',
          textAlign: 'center',
          background: dragging ? '#eff6ff' : file ? '#f0fdf4' : '#f8fafc',
          transition: 'all 0.2s',
          cursor: 'pointer',
          marginBottom: '1.5rem',
        }}
        onClick={() => document.getElementById('cal-input').click()}
      >
        <input id="cal-input" type="file" accept=".pdf,.xlsx" hidden onChange={(e) => handleFile(e.target.files[0])} />
        <div style={{ fontSize: '3rem', marginBottom: '0.75rem' }}>{file ? '📄' : '📅'}</div>
        {file ? (
          <>
            <p style={{ fontWeight: 600, color: '#15803d', fontSize: '1rem' }}>{file.name}</p>
            <p style={{ color: '#64748b', fontSize: '0.8rem', marginTop: '0.25rem' }}>{(file.size / 1024).toFixed(1)} KB — Click to replace</p>
          </>
        ) : (
          <>
            <p style={{ fontWeight: 600, color: '#334155', fontSize: '1rem' }}>Drop your file here or click to browse</p>
            <p style={{ color: '#94a3b8', fontSize: '0.8rem', marginTop: '0.25rem' }}>Supports PDF, XLSX</p>
          </>
        )}
      </div>

      {file && !uploaded && (
        <button onClick={handleUpload} style={{
          display: 'flex', alignItems: 'center', gap: '0.5rem',
          background: '#0d1b2a', color: '#fff', border: 'none',
          padding: '0.85rem 2rem', borderRadius: '10px', fontWeight: 700,
          fontSize: '0.9rem', cursor: 'pointer', letterSpacing: '0.05em',
        }}>
          <Icons.Upload /> UPLOAD CALENDAR
        </button>
      )}

      {uploaded && (
        <div style={{
          display: 'flex', alignItems: 'center', gap: '0.75rem',
          background: '#f0fdf4', border: '1px solid #bbf7d0',
          borderRadius: '10px', padding: '1rem 1.5rem', color: '#15803d', fontWeight: 600,
        }}>
          ✅ Academic calendar uploaded successfully!
        </div>
      )}

      {/* Info cards */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '1rem', marginTop: '2.5rem' }}>
        {[
          { label: 'Session', value: '2025–26', icon: '🗓️' },
          { label: 'Working Days', value: '220', icon: '📊' },
          { label: 'Holidays', value: '18', icon: '🎉' },
        ].map(c => (
          <div key={c.label} style={{
            background: '#fff', border: '1px solid #e2e8f0', borderRadius: '12px',
            padding: '1.25rem', textAlign: 'center',
          }}>
            <div style={{ fontSize: '1.75rem' }}>{c.icon}</div>
            <div style={{ fontSize: '1.5rem', fontWeight: 800, color: '#0d1b2a', marginTop: '0.25rem' }}>{c.value}</div>
            <div style={{ fontSize: '0.75rem', color: '#94a3b8', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em' }}>{c.label}</div>
          </div>
        ))}
      </div>
    </div>
  )
}

function ExamPanel() {
  const [examType, setExamType] = useState('')
  const [open, setOpen] = useState(false)
  const schedule = examType === 'internal' ? internalSchedule : examType === 'external' ? externalSchedule : []

  return (
    <div>
      <div style={{ marginBottom: '2rem' }}>
        <h2 style={{ fontSize: '1.5rem', fontWeight: 700, color: '#0d1b2a', marginBottom: '0.3rem' }}>Exam Schedule</h2>
        <p style={{ color: '#64748b', fontSize: '0.875rem' }}>Select exam type to view the schedule.</p>
      </div>

      {/* Dropdown */}
      <div style={{ position: 'relative', display: 'inline-block', minWidth: '260px', marginBottom: '2rem' }}>
        <button onClick={() => setOpen(!open)} style={{
          width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          background: '#fff', border: '2px solid #e2e8f0', borderRadius: '12px',
          padding: '0.85rem 1.25rem', fontWeight: 600, fontSize: '0.95rem',
          color: examType ? '#0d1b2a' : '#94a3b8', cursor: 'pointer',
        }}>
          {examType ? (examType === 'internal' ? '📝 Internal Examination' : '📋 External Examination') : 'Select Exam Type'}
          <Icons.ChevronDown open={open} />
        </button>
        {open && (
          <div style={{
            position: 'absolute', top: 'calc(100% + 6px)', left: 0, right: 0,
            background: '#fff', border: '1px solid #e2e8f0', borderRadius: '12px',
            boxShadow: '0 8px 24px rgba(0,0,0,0.1)', zIndex: 50, overflow: 'hidden',
          }}>
            {[
              { val: 'internal', label: '📝 Internal Examination', sub: 'Mid-semester assessments' },
              { val: 'external', label: '📋 External Examination', sub: 'End-semester university exams' },
            ].map(opt => (
              <button key={opt.val} onClick={() => { setExamType(opt.val); setOpen(false) }} style={{
                width: '100%', textAlign: 'left', padding: '0.85rem 1.25rem',
                background: examType === opt.val ? '#f0f9ff' : '#fff',
                border: 'none', cursor: 'pointer', borderBottom: '1px solid #f1f5f9',
              }}>
                <div style={{ fontWeight: 600, color: '#0d1b2a', fontSize: '0.9rem' }}>{opt.label}</div>
                <div style={{ fontSize: '0.75rem', color: '#94a3b8', marginTop: '2px' }}>{opt.sub}</div>
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Badge */}
      {examType && (
        <div style={{
          display: 'inline-flex', alignItems: 'center', gap: '0.5rem',
          background: examType === 'internal' ? '#fef3c7' : '#ede9fe',
          color: examType === 'internal' ? '#92400e' : '#5b21b6',
          padding: '0.4rem 1rem', borderRadius: '999px', fontSize: '0.8rem',
          fontWeight: 700, marginBottom: '1.5rem', marginLeft: '1rem',
        }}>
          {examType === 'internal' ? '⚡ Internal' : '🏛️ External'} — {schedule.length} Exams Scheduled
        </div>
      )}

      {/* Table */}
      {schedule.length > 0 && (
        <div style={{ background: '#fff', borderRadius: '16px', border: '1px solid #e2e8f0', overflow: 'hidden' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.875rem' }}>
            <thead>
              <tr style={{ background: '#0d1b2a', color: '#fff' }}>
                {['Date', 'Day', 'Time', 'Subject', 'Branch', 'Semester', 'Room'].map(h => (
                  <th key={h} style={{ padding: '0.85rem 1rem', textAlign: 'left', fontWeight: 600, fontSize: '0.75rem', letterSpacing: '0.05em', textTransform: 'uppercase' }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {schedule.map((row, i) => (
                <tr key={i} style={{ borderBottom: '1px solid #f1f5f9', background: i % 2 === 0 ? '#fff' : '#fafafa' }}>
                  <td style={{ padding: '0.85rem 1rem', fontWeight: 600, color: '#0d1b2a' }}>{row.date}</td>
                  <td style={{ padding: '0.85rem 1rem', color: '#64748b' }}>{row.day}</td>
                  <td style={{ padding: '0.85rem 1rem', color: '#64748b' }}>{row.time}</td>
                  <td style={{ padding: '0.85rem 1rem', fontWeight: 600, color: '#1e293b' }}>{row.subject}</td>
                  <td style={{ padding: '0.85rem 1rem' }}>
                    <span style={{
                      background: row.branch === 'CSE' ? '#dbeafe' : row.branch === 'EE' ? '#fce7f3' : '#e0e7ff',
                      color: row.branch === 'CSE' ? '#1d4ed8' : row.branch === 'EE' ? '#be185d' : '#4338ca',
                      padding: '0.2rem 0.6rem', borderRadius: '999px', fontSize: '0.75rem', fontWeight: 700,
                    }}>{row.branch}</span>
                  </td>
                  <td style={{ padding: '0.85rem 1rem', color: '#64748b' }}>{row.semester}</td>
                  <td style={{ padding: '0.85rem 1rem', color: '#64748b', fontWeight: 500 }}>{row.room}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {!examType && (
        <div style={{ textAlign: 'center', padding: '4rem 2rem', color: '#cbd5e1' }}>
          <div style={{ fontSize: '3.5rem', marginBottom: '1rem' }}>📋</div>
          <p style={{ fontSize: '1rem', fontWeight: 500 }}>Select an exam type to view the schedule</p>
        </div>
      )}
    </div>
  )
}

function DepartmentPanel() {
  const [filter, setFilter] = useState('All')
  const departments = ['All', 'CSE', 'EE', 'MATH']
  const filtered = filter === 'All' ? facultyData : facultyData.filter(f => f.department === filter)

  const deptColor = { CSE: { bg: '#dbeafe', text: '#1d4ed8' }, EE: { bg: '#fce7f3', text: '#be185d' }, MATH: { bg: '#d1fae5', text: '#065f46' } }

  return (
    <div>
      <div style={{ marginBottom: '2rem' }}>
        <h2 style={{ fontSize: '1.5rem', fontWeight: 700, color: '#0d1b2a', marginBottom: '0.3rem' }}>Department Faculty</h2>
        <p style={{ color: '#64748b', fontSize: '0.875rem' }}>Directory of all faculty members across departments.</p>
      </div>

      {/* Filter tabs */}
      <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '1.75rem' }}>
        {departments.map(d => (
          <button key={d} onClick={() => setFilter(d)} style={{
            padding: '0.5rem 1.25rem', borderRadius: '999px', fontWeight: 600, fontSize: '0.85rem',
            border: filter === d ? 'none' : '1px solid #e2e8f0',
            background: filter === d ? '#0d1b2a' : '#fff',
            color: filter === d ? '#fff' : '#64748b',
            cursor: 'pointer', transition: 'all 0.15s',
          }}>{d} {d !== 'All' && `(${facultyData.filter(f => f.department === d).length})`}</button>
        ))}
      </div>

      {/* Faculty cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '1.25rem' }}>
        {filtered.map(f => (
          <div key={f.id} style={{
            background: '#fff', border: '1px solid #e2e8f0', borderRadius: '16px',
            padding: '1.5rem', transition: 'box-shadow 0.2s',
          }}
            onMouseEnter={e => e.currentTarget.style.boxShadow = '0 4px 20px rgba(0,0,0,0.08)'}
            onMouseLeave={e => e.currentTarget.style.boxShadow = 'none'}
          >
            {/* Avatar + name */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1rem' }}>
              <div style={{
                width: 48, height: 48, borderRadius: '50%',
                background: deptColor[f.department]?.bg || '#f1f5f9',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontWeight: 800, fontSize: '1.1rem', color: deptColor[f.department]?.text || '#475569',
                flexShrink: 0,
              }}>
                {f.name.split(' ').slice(-1)[0][0]}
              </div>
              <div>
                <div style={{ fontWeight: 700, color: '#0d1b2a', fontSize: '0.95rem' }}>{f.name}</div>
                <div style={{ fontSize: '0.78rem', color: '#64748b' }}>{f.designation}</div>
              </div>
            </div>

            {/* Dept badge */}
            <span style={{
              ...deptColor[f.department],
              padding: '0.2rem 0.7rem', borderRadius: '999px', fontSize: '0.72rem', fontWeight: 700,
            }}>{f.department}</span>

            {/* Info rows */}
            <div style={{ marginTop: '1rem', display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
              {[
                { icon: '🪪', val: f.id },
                { icon: '📧', val: f.email },
                { icon: '📱', val: f.phone },
                { icon: '⏳', val: `${f.experience} experience` },
              ].map(row => (
                <div key={row.icon} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.8rem', color: '#475569' }}>
                  <span>{row.icon}</span><span>{row.val}</span>
                </div>
              ))}
            </div>

            {/* Subjects */}
            <div style={{ marginTop: '0.85rem', display: 'flex', flexWrap: 'wrap', gap: '0.4rem' }}>
              {f.subjects.map(s => (
                <span key={s} style={{
                  background: '#f1f5f9', color: '#475569', padding: '0.2rem 0.6rem',
                  borderRadius: '6px', fontSize: '0.72rem', fontWeight: 500,
                }}>{s}</span>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

// ─── Main Admin Page ──────────────────────────────────────────────────────────

export default function AdminPage() {
  const router = useRouter()
  const [active, setActive] = useState('academics')

  const session = typeof window !== 'undefined'
    ? JSON.parse(localStorage.getItem('session') || '{}')
    : {}

  const handleLogout = () => {
    localStorage.removeItem('session')
    router.push('/')
  }

  const navItems = [
    { id: 'academics', label: 'Academics', icon: <Icons.Academic /> },
    { id: 'exam', label: 'Exam', icon: <Icons.Exam /> },
    { id: 'department', label: 'Department', icon: <Icons.Department /> },
  ]

  return (
    <div style={{ display: 'flex', minHeight: '100vh', background: '#f1f5f9', fontFamily: "'Segoe UI', system-ui, sans-serif" }}>

      {/* ── Sidebar ── */}
      <aside style={{
        width: '240px', flexShrink: 0,
        background: '#0d1b2a',
        display: 'flex', flexDirection: 'column',
        position: 'sticky', top: 0, height: '100vh',
      }}>
        {/* Logo area */}
        <div style={{ padding: '1.75rem 1.5rem', borderBottom: '1px solid rgba(255,255,255,0.08)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <div style={{
              width: 38, height: 38, background: 'linear-gradient(135deg,#3b82f6,#1d4ed8)',
              borderRadius: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontSize: '1.1rem',
            }}>🛡️</div>
            <div>
              <div style={{ color: '#fff', fontWeight: 800, fontSize: '0.95rem', lineHeight: 1.2 }}>Admin Panel</div>
              <div style={{ color: '#64748b', fontSize: '0.7rem', fontWeight: 500 }}>Academic Portal</div>
            </div>
          </div>
        </div>

        {/* Nav items */}
        <nav style={{ flex: 1, padding: '1.25rem 0.75rem', display: 'flex', flexDirection: 'column', gap: '0.25rem' }}>
          <div style={{ fontSize: '0.65rem', fontWeight: 700, color: '#475569', letterSpacing: '0.1em', textTransform: 'uppercase', padding: '0 0.75rem', marginBottom: '0.5rem' }}>
            Navigation
          </div>
          {navItems.map(item => (
            <button key={item.id} onClick={() => setActive(item.id)} style={{
              display: 'flex', alignItems: 'center', gap: '0.75rem',
              padding: '0.75rem 1rem', borderRadius: '10px', border: 'none',
              background: active === item.id ? 'rgba(59,130,246,0.15)' : 'transparent',
              color: active === item.id ? '#60a5fa' : '#94a3b8',
              fontWeight: active === item.id ? 700 : 500,
              fontSize: '0.9rem', cursor: 'pointer', textAlign: 'left', width: '100%',
              borderLeft: active === item.id ? '3px solid #3b82f6' : '3px solid transparent',
              transition: 'all 0.15s',
            }}>
              {item.icon}
              {item.label}
            </button>
          ))}
        </nav>

        {/* User + Logout */}
        <div style={{ padding: '1rem 0.75rem', borderTop: '1px solid rgba(255,255,255,0.08)' }}>
          <div style={{ padding: '0.75rem 1rem', marginBottom: '0.5rem' }}>
            <div style={{ color: '#e2e8f0', fontWeight: 600, fontSize: '0.85rem', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
              {session.full_name || 'Admin'}
            </div>
            <div style={{ color: '#475569', fontSize: '0.72rem', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
              {session.email || ''}
            </div>
          </div>
          <button onClick={handleLogout} style={{
            display: 'flex', alignItems: 'center', gap: '0.6rem',
            width: '100%', padding: '0.65rem 1rem', borderRadius: '8px',
            background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.2)',
            color: '#f87171', fontWeight: 600, fontSize: '0.82rem', cursor: 'pointer',
          }}>
            <Icons.Logout /> Logout
          </button>
        </div>
      </aside>

      {/* ── Main Content ── */}
      <main style={{ flex: 1, padding: '2.5rem', overflowY: 'auto' }}>
        {/* Top bar */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '2rem' }}>
          <div>
            <div style={{ fontSize: '0.75rem', color: '#94a3b8', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.08em' }}>
              Admin Dashboard
            </div>
            <h1 style={{ fontSize: '1.6rem', fontWeight: 800, color: '#0d1b2a', marginTop: '0.15rem' }}>
              {active === 'academics' && '📚 Academics'}
              {active === 'exam' && '📝 Examinations'}
              {active === 'department' && '🏫 Departments'}
            </h1>
          </div>
          <div style={{
            background: '#fff', border: '1px solid #e2e8f0',
            borderRadius: '12px', padding: '0.6rem 1rem',
            fontSize: '0.8rem', color: '#64748b', fontWeight: 500,
          }}>
            {new Date().toLocaleDateString('en-IN', { weekday: 'short', year: 'numeric', month: 'short', day: 'numeric' })}
          </div>
        </div>

        {/* Panel content */}
        <div style={{ background: '#fff', borderRadius: '20px', border: '1px solid #e2e8f0', padding: '2rem', minHeight: '60vh' }}>
          {active === 'academics' && <AcademicsPanel />}
          {active === 'exam' && <ExamPanel />}
          {active === 'department' && <DepartmentPanel />}
        </div>
      </main>
    </div>
  )
}