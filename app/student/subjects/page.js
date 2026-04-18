'use client'
import { useState } from 'react'

const semesterSubjects = {
  "FALL SEMESTER 2024-25": [
    { sno: 1, code: "CS101", subject: "INTRODUCTION TO PROGRAMMING", credits: 4, styType: "REG", styNo: 4 },
    { sno: 2, code: "MA202", subject: "DISCRETE MATHEMATICS", credits: 3, styType: "REG", styNo: 4 },
    { sno: 3, code: "PHY102", subject: "ENGINEERING PHYSICS", credits: 3, styType: "REG", styNo: 4 },
    { sno: 4, code: "ENG105", subject: "TECHNICAL COMMUNICATION", credits: 2, styType: "REG", styNo: 4 },
    { sno: 5, code: "CS203", subject: "DATA STRUCTURES AND ALGORITHMS", credits: 4, styType: "REG", styNo: 4 },
    { sno: 6, code: "HSS301", subject: "PROFESSIONAL ETHICS", credits: 2, styType: "REG", styNo: 4 },
  ],
  "SPRING SEMESTER 2024-25": [
    { sno: 1, code: "CS301", subject: "OPERATING SYSTEMS", credits: 4, styType: "REG", styNo: 4 },
    { sno: 2, code: "CS302", subject: "DATABASE MANAGEMENT SYSTEMS", credits: 4, styType: "REG", styNo: 4 },
    { sno: 3, code: "MA301", subject: "PROBABILITY AND STATISTICS", credits: 3, styType: "REG", styNo: 4 },
    { sno: 4, code: "CS303", subject: "COMPUTER NETWORKS", credits: 4, styType: "REG", styNo: 4 },
    { sno: 5, code: "HSS302", subject: "ECONOMICS FOR ENGINEERS", credits: 2, styType: "REG", styNo: 4 },
  ],
  "WINTER TERM 2023-24": [
    { sno: 1, code: "CS401", subject: "MACHINE LEARNING", credits: 4, styType: "REG", styNo: 4 },
    { sno: 2, code: "CS402", subject: "CLOUD COMPUTING", credits: 3, styType: "REG", styNo: 4 },
    { sno: 3, code: "CS403", subject: "SOFTWARE ENGINEERING", credits: 4, styType: "REG", styNo: 4 },
    { sno: 4, code: "MA401", subject: "NUMERICAL METHODS", credits: 3, styType: "REG", styNo: 4 },
  ],
}

export default function RegisteredSubjectsPage() {
  const [semester, setSemester] = useState('')
  const [showTable, setShowTable] = useState(false)
  const [loading, setLoading] = useState(false)

  const semesterOptions = Object.keys(semesterSubjects)

  const handleSubmit = () => {
    if (!semester) return
    setLoading(true)
    setTimeout(() => {
      setShowTable(true)
      setLoading(false)
    }, 600)
  }

  const subjects = semesterSubjects[semester] || []

  return (
    <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
      {/* HEADER */}
      <div className="bg-[#003a70] text-white p-5 rounded-t-xl shadow-lg flex items-center gap-3">
        <span className="text-xl">📋</span>
        <h2 className="text-xl font-bold tracking-tight">Registered Subjects</h2>
      </div>

      <div className="bg-white rounded-b-xl shadow-2xl border border-gray-100 p-8 min-h-[600px]">

        {/* SELECTION AREA */}
        <div className="flex flex-col md:flex-row items-end gap-6 mb-10 border-b pb-8">
          <div className="flex-1 max-w-md relative">
            <label className="text-[10px] font-bold text-red-500 uppercase tracking-tighter mb-1 block">
              Semester Code *
            </label>
            <select
              value={semester}
              onChange={(e) => { setSemester(e.target.value); setShowTable(false) }}
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
            disabled={!semester || loading}
            className={`flex items-center gap-2 px-6 py-2 rounded shadow-md text-xs font-bold transition-all ${!semester ? 'bg-gray-300 text-gray-500 cursor-not-allowed' : 'bg-[#5cb85c] text-white hover:bg-green-700'}`}
          >
            <span className="text-sm">💾</span> {loading ? 'Loading...' : 'Submit'}
          </button>
        </div>

        {/* SUBJECT TABLE */}
        {showTable && (
          <>
            <div className="overflow-x-auto border border-gray-200 rounded-lg shadow-sm mb-6">
              <table className="w-full border-collapse bg-white text-sm">
                <thead>
                  <tr className="bg-gray-100 border-b border-gray-300">
                    <th className="p-3 text-left font-bold text-gray-700 border-r border-gray-200">S.No</th>
                    <th className="p-3 text-left font-bold text-gray-700 border-r border-gray-200">Subject Code</th>
                    <th className="p-3 text-left font-bold text-gray-700 border-r border-gray-200">Subject</th>
                    <th className="p-3 text-left font-bold text-gray-700 border-r border-gray-200">Credits</th>
                    <th className="p-3 text-left font-bold text-gray-700 border-r border-gray-200">Sty Type</th>
                    <th className="p-3 text-left font-bold text-gray-700">Sty No.</th>
                  </tr>
                </thead>
                <tbody>
                  {subjects.map((row, idx) => (
                    <tr key={row.sno} className={idx % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                      <td className="p-3 border-r border-gray-200 text-gray-600">{row.sno}</td>
                      <td className="p-3 border-r border-gray-200 font-semibold text-gray-800">{row.code}</td>
                      <td className="p-3 border-r border-gray-200 text-gray-800">{row.subject}</td>
                      <td className="p-3 border-r border-gray-200 text-gray-600">{row.credits}</td>
                      <td className="p-3 border-r border-gray-200 text-gray-600">{row.styType}</td>
                      <td className="p-3 text-gray-600">{row.styNo}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* DOWNLOAD PDF */}
            <div className="flex justify-center">
              <button
                onClick={() => window.print()}
                className="flex items-center gap-2 px-8 py-3 rounded-lg shadow-md text-sm font-bold bg-[#003a70] text-white hover:bg-blue-900 transition-all"
              >
                ⬇️ Download PDF
              </button>
            </div>
          </>
        )}

        {/* EMPTY STATE */}
        {!showTable && !loading && (
          <div className="py-24 flex flex-col items-center justify-center opacity-30 select-none grayscale">
            <span className="text-7xl mb-4">📚</span>
            <p className="font-black text-gray-500 uppercase tracking-[0.2em] text-[10px]">Select Semester to view Subjects</p>
          </div>
        )}
      </div>
    </div>
  )
}