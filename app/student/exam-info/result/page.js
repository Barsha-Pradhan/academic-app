'use client'

import { useState, useEffect } from 'react'

const DUMMY_DATA = {
  student: {
    name: 'Rahul Kumar',
    roll_number: 'ODI-2024-045',
    class: '10',
    section: 'A',
    exam_name: 'Annual Examination 2024',
  },
  marks: [
    { subject: 'Mathematics',      marks_obtained: 88, max_marks: 100 },
    { subject: 'Science',          marks_obtained: 76, max_marks: 100 },
    { subject: 'English',          marks_obtained: 91, max_marks: 100 },
    { subject: 'Social Studies',   marks_obtained: 65, max_marks: 100 },
    { subject: 'Hindi',            marks_obtained: 70, max_marks: 100 },
    { subject: 'Computer Science', marks_obtained: 95, max_marks: 100 },
  ],
}

const gradeInfo = (percentage) => {
  if (percentage >= 90) return { grade: 'A+', gpa: '4.0', color: '#16a34a' }
  if (percentage >= 80) return { grade: 'A',  gpa: '3.7', color: '#2563eb' }
  if (percentage >= 70) return { grade: 'B',  gpa: '3.3', color: '#7c3aed' }
  if (percentage >= 60) return { grade: 'C',  gpa: '2.7', color: '#d97706' }
  if (percentage >= 45) return { grade: 'D',  gpa: '2.0', color: '#ea580c' }
  return                        { grade: 'F',  gpa: '0.0', color: '#dc2626' }
}

export default function StudentResultPage() {
  const [result, setResult]   = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError]     = useState(null)

  useEffect(() => {
    const timer = setTimeout(() => {
      setResult(DUMMY_DATA)
      setLoading(false)
    }, 600)
    return () => clearTimeout(timer)
  }, [])

  if (loading) return <LoadingState />
  if (error)   return <ErrorState message={error} />
  if (!result) return <ErrorState message="No result data found." />

  const { student, marks } = result
  const totalObtained = marks.reduce((s, m) => s + m.marks_obtained, 0)
  const totalMax      = marks.reduce((s, m) => s + m.max_marks, 0)
  const percentage    = totalMax > 0 ? ((totalObtained / totalMax) * 100).toFixed(2) : 0
  const overall       = gradeInfo(parseFloat(percentage))
  const passed        = parseFloat(percentage) >= 45

  return (
    <div style={styles.page}>
      {/* Header */}
      <div style={styles.header}>
        <div style={styles.headerInner}>
          <div style={styles.schoolBadge}>🎓</div>
          <div>
            <h1 style={styles.schoolName}>Academic Result Sheet</h1>
            <p style={styles.examLabel}>{student.exam_name || 'Final Examination'}</p>
          </div>
        </div>
      </div>

      <div style={styles.container}>
        {/* Summary Strip */}
        <div style={styles.summaryStrip}>
          <SummaryBadge label="Total Marks"  value={`${totalObtained} / ${totalMax}`} />
          <SummaryBadge label="Percentage"   value={`${percentage}%`} />
          <SummaryBadge label="GPA"          value={overall.gpa} />
          <SummaryBadge label="Grade"        value={overall.grade} accent={overall.color} />
          <SummaryBadge
            label="Status"
            value={passed ? 'PASS' : 'FAIL'}
            accent={passed ? '#16a34a' : '#dc2626'}
            bold
          />
        </div>

        {/* Marks Table */}
        <div style={styles.tableWrapper}>
          <table style={styles.table}>
            <thead>
              <tr style={styles.theadRow}>
                <th style={{ ...styles.th, width: '40px' }}>#</th>
                <th style={styles.th}>Subject</th>
                <th style={styles.th}>Max Marks</th>
                <th style={styles.th}>Marks Obtained</th>
                <th style={styles.th}>Percentage</th>
                <th style={styles.th}>Grade</th>
                <th style={styles.th}>Status</th>
              </tr>
            </thead>
            <tbody>
              {marks.map((m, i) => {
                const pct  = ((m.marks_obtained / m.max_marks) * 100).toFixed(1)
                const info = gradeInfo(parseFloat(pct))
                const pass = parseFloat(pct) >= 45
                return (
                  <tr key={i} style={i % 2 === 0 ? styles.trEven : styles.trOdd}>
                    <td style={styles.tdCenter}>{i + 1}</td>
                    <td style={{ ...styles.td, fontWeight: 600 }}>{m.subject}</td>
                    <td style={styles.tdCenter}>{m.max_marks}</td>
                    <td style={styles.tdCenter}>{m.marks_obtained}</td>
                    <td style={styles.tdCenter}>{pct}%</td>
                    <td style={{ ...styles.tdCenter }}>
                      <span style={{ ...styles.gradePill, background: info.color + '18', color: info.color, border: `1px solid ${info.color}40` }}>
                        {info.grade}
                      </span>
                    </td>
                    <td style={styles.tdCenter}>
                      <span style={{ ...styles.statusPill, background: pass ? '#dcfce7' : '#fee2e2', color: pass ? '#15803d' : '#b91c1c' }}>
                        {pass ? 'Pass' : 'Fail'}
                      </span>
                    </td>
                  </tr>
                )
              })}
            </tbody>
            <tfoot>
              <tr style={styles.tfootRow}>
                <td colSpan={2} style={{ ...styles.td, fontWeight: 700 }}>TOTAL</td>
                <td style={{ ...styles.tdCenter, fontWeight: 700 }}>{totalMax}</td>
                <td style={{ ...styles.tdCenter, fontWeight: 700 }}>{totalObtained}</td>
                <td style={{ ...styles.tdCenter, fontWeight: 700 }}>{percentage}%</td>
                <td style={{ ...styles.tdCenter, fontWeight: 700 }}>{overall.grade}</td>
                <td style={styles.tdCenter}>
                  <span style={{ ...styles.statusPill, background: passed ? '#dcfce7' : '#fee2e2', color: passed ? '#15803d' : '#b91c1c', fontWeight: 700 }}>
                    {passed ? 'Pass' : 'Fail'}
                  </span>
                </td>
              </tr>
            </tfoot>
          </table>
        </div>

        <p style={styles.footer}>
          This is a computer-generated result. For discrepancies, contact the examination office.
        </p>
      </div>
    </div>
  )
}

/* ── Sub-components ── */

function SummaryBadge({ label, value, accent, bold }) {
  return (
    <div style={styles.summaryBadge}>
      <p style={styles.summaryLabel}>{label}</p>
      <p style={{ ...styles.summaryValue, color: accent || '#1e293b', fontWeight: bold ? 800 : 700 }}>
        {value}
      </p>
    </div>
  )
}

function LoadingState() {
  return (
    <div style={styles.centerState}>
      <div style={styles.spinner} />
      <p style={{ color: '#64748b', marginTop: 16 }}>Loading your result…</p>
    </div>
  )
}

function ErrorState({ message }) {
  return (
    <div style={styles.centerState}>
      <p style={{ fontSize: 40 }}>⚠️</p>
      <p style={{ color: '#dc2626', fontWeight: 600, marginTop: 8 }}>{message}</p>
    </div>
  )
}

/* ── Styles ── */

const styles = {
  page: {
    minHeight: '100vh',
    background: '#f1f5f9',
    fontFamily: "'Segoe UI', system-ui, sans-serif",
  },
  header: {
    background: 'linear-gradient(135deg, #1e3a5f 0%, #2563eb 100%)',
    padding: '28px 32px',
    color: '#fff',
  },
  headerInner: {
    maxWidth: 900,
    margin: '0 auto',
    display: 'flex',
    alignItems: 'center',
    gap: 16,
  },
  schoolBadge: { fontSize: 40 },
  schoolName: { margin: 0, fontSize: 22, fontWeight: 700, letterSpacing: '-0.3px' },
  examLabel:  { margin: '4px 0 0', fontSize: 14, opacity: 0.8 },
  container:  { maxWidth: 900, margin: '0 auto', padding: '28px 16px' },

  summaryStrip: {
    display: 'flex',
    flexWrap: 'wrap',
    gap: 12,
    marginBottom: 20,
  },
  summaryBadge: {
    flex: '1 1 120px',
    background: '#fff',
    borderRadius: 12,
    padding: '14px 18px',
    boxShadow: '0 1px 4px rgba(0,0,0,0.08)',
    border: '1px solid #e2e8f0',
    textAlign: 'center',
  },
  summaryLabel: { margin: 0, fontSize: 11, fontWeight: 600, color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.05em' },
  summaryValue: { margin: '6px 0 0', fontSize: 20, fontWeight: 700 },

  tableWrapper: {
    background: '#fff',
    borderRadius: 12,
    overflow: 'hidden',
    boxShadow: '0 1px 4px rgba(0,0,0,0.08)',
    border: '1px solid #e2e8f0',
    overflowX: 'auto',
  },
  table:    { width: '100%', borderCollapse: 'collapse', fontSize: 14 },
  theadRow: { background: '#1e3a5f', color: '#fff' },
  th: {
    padding: '13px 16px',
    textAlign: 'left',
    fontWeight: 600,
    fontSize: 12,
    letterSpacing: '0.05em',
    textTransform: 'uppercase',
    color: '#cbd5e1',
  },
  trEven: { background: '#fff' },
  trOdd:  { background: '#f8fafc' },
  td: { padding: '12px 16px', color: '#334155', borderBottom: '1px solid #f1f5f9' },
  tdCenter: { padding: '12px 16px', color: '#334155', borderBottom: '1px solid #f1f5f9', textAlign: 'center' },
  tfootRow: { background: '#eff6ff', borderTop: '2px solid #bfdbfe' },
  gradePill: {
    display: 'inline-block',
    padding: '2px 10px',
    borderRadius: 20,
    fontSize: 12,
    fontWeight: 700,
  },
  statusPill: {
    display: 'inline-block',
    padding: '2px 12px',
    borderRadius: 20,
    fontSize: 12,
    fontWeight: 600,
  },
  footer: {
    marginTop: 20,
    textAlign: 'center',
    fontSize: 12,
    color: '#94a3b8',
  },
  centerState: {
    minHeight: '60vh',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
  },
  spinner: {
    width: 40,
    height: 40,
    border: '4px solid #e2e8f0',
    borderTop: '4px solid #2563eb',
    borderRadius: '50%',
    animation: 'spin 0.8s linear infinite',
  },
}