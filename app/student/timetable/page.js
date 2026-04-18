'use client'
import { useState } from 'react'

export default function ClassTimetable() {
  const [regCode, setRegCode] = useState('')
  const [activeData, setActiveData] = useState(null) // Stores data for the selected sem
  const [showTable, setShowTable] = useState(false)
  const [loading, setLoading] = useState(false)

  const registrationOptions = [
    "FALL SEMESTER 2024-25",
    "SPRING SEMESTER 2024-25",
    "WINTER TERM 2023-24"
  ]

  // Data categorized by Semester
  const timetableDatabase = {
    "FALL SEMESTER 2024-25": {
      Monday: [
        { time: "08:00 AM - 10:00 AM", subject: "CS101 (Intro to Programming)", teacher: "Dr. Alan Turing", room: "Room 101 / Block A" },
        { time: "11:00 AM - 01:00 PM", subject: "MA202 (Calculus I)", teacher: "Prof. Newton", room: "Room 205 / Block B" }
      ],
      Tuesday: [
        { time: "09:00 AM - 11:00 AM", subject: "PHY102 (Engineering Physics)", teacher: "Dr. Marie Curie", room: "Lab 02 / Science Wing" }
      ],
      Wednesday: [
        { time: "10:00 AM - 12:00 PM", subject: "CS203 (Digital Logic)", teacher: "Dr. Claude Shannon", room: "Room 310 / Block C" }
      ],
      Thursday: [
        { time: "08:00 AM - 10:00 AM", subject: "CS101 (Intro to Programming)", teacher: "Dr. Alan Turing", room: "Room 101 / Block A" }
      ],
      Friday: [
        { time: "09:00 AM - 11:00 AM", subject: "CS203 (Digital Logic)", teacher: "Dr. Claude Shannon", room: "Room 310 / Block C" }
      ],
      Saturday: [
        { time: "10:00 AM - 01:00 PM", subject: "CS101P (Python Lab)", teacher: "Dr. Alan Turing", room: "Computer Center 1" }
      ]
    },
    "SPRING SEMESTER 2024-25": {
      Monday: [
        { time: "09:00 AM - 11:00 AM", subject: "CS301 (Data Structures)", teacher: "Dr. Grace Hopper", room: "Room 404 / Block D" }
      ],
      Tuesday: [
        { time: "10:00 AM - 12:00 PM", subject: "MA305 (Linear Algebra)", teacher: "Prof. Gauss", room: "Room 202 / Block B" },
        { time: "02:00 PM - 04:00 PM", subject: "ENG201 (Technical Writing)", teacher: "Dr. Maya Angelou", room: "Library Hall" }
      ],
      Wednesday: [
        { time: "08:00 AM - 10:00 AM", subject: "CS301 (Data Structures)", teacher: "Dr. Grace Hopper", room: "Room 404 / Block D" }
      ],
      Thursday: [
        { time: "11:00 AM - 01:00 PM", subject: "CS302 (Database Systems)", teacher: "Dr. Edgar Codd", room: "Room 108 / Block A" }
      ],
      Friday: [
        { time: "01:00 PM - 03:00 PM", subject: "CS302 (Database Systems)", teacher: "Dr. Edgar Codd", room: "Lab 05 / Main" }
      ],
      Saturday: []
    },
    "WINTER TERM 2023-24": {
      Monday: [
        { time: "10:00 AM - 01:00 PM", subject: "AI-W1 (AI Workshop)", teacher: "Dr. Hinton", room: "Innovation Lab" }
      ],
      Tuesday: [
        { time: "10:00 AM - 01:00 PM", subject: "AI-W1 (AI Workshop)", teacher: "Dr. Hinton", room: "Innovation Lab" }
      ],
      Wednesday: [
        { time: "10:00 AM - 01:00 PM", subject: "CS-ELC (Cloud Elective)", teacher: "Prof. Werner Vogels", room: "Room 501 / Block E" }
      ],
      Thursday: [
        { time: "10:00 AM - 01:00 PM", subject: "CS-ELC (Cloud Elective)", teacher: "Prof. Werner Vogels", room: "Room 501 / Block E" }
      ],
      Friday: [
        { time: "09:00 AM - 12:00 PM", subject: "HSS-Ethics (Seminars)", teacher: "Prof. Socrates", room: "Seminar Hall" }
      ],
      Saturday: []
    }
  }

  const handleSubmit = () => {
    if (!regCode) return
    setLoading(true)
    setShowTable(false) // Reset table visibility to trigger animation
    
    setTimeout(() => {
      setActiveData(timetableDatabase[regCode])
      setShowTable(true)
      setLoading(false)
    }, 600)
  }

  const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday']

  return (
    <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
      {/* 1. HEADER BAR */}
      <div className="bg-[#003a70] text-white p-5 rounded-t-xl shadow-lg flex items-center gap-3">
         <span className="text-xl">📅</span>
         <h2 className="text-xl font-bold tracking-tight">Class Time Table</h2>
      </div>

      <div className="bg-white rounded-b-xl shadow-2xl border border-gray-100 p-8 min-h-[600px]">
        
        {/* 2. SELECTION AREA */}
        <div className="flex flex-col md:flex-row items-end gap-6 mb-10 border-b pb-8">
           <div className="flex-1 max-w-md relative">
              <label className="text-[10px] font-bold text-red-500 uppercase tracking-tighter mb-1 block">
                Registration Code *
              </label>
              <select 
                value={regCode}
                onChange={(e) => setRegCode(e.target.value)}
                className="w-full border-b-2 border-gray-200 py-2 text-sm font-semibold focus:outline-none focus:border-blue-600 transition-colors bg-transparent appearance-none cursor-pointer"
              >
                <option value="">-- Select Semester --</option>
                {registrationOptions.map(opt => (
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

        {/* 3. TIMETABLE GRID */}
        {showTable && activeData && (
          <div className="overflow-x-auto border border-gray-200 rounded-lg shadow-sm animate-in fade-in zoom-in-95 duration-300">
            <div className="bg-gray-100 p-3 text-[10px] font-bold text-gray-600 border-b uppercase tracking-widest text-center">
                Showing Schedule for: <span className="text-blue-700">{regCode}</span>
            </div>
            <table className="w-full border-collapse bg-white">
              <thead>
                <tr className="bg-gray-50 border-b border-gray-200">
                  {days.map(day => (
                    <th key={day} className="p-4 text-center text-[11px] font-black text-[#002d5b] border-r border-gray-200 uppercase w-[16.6%] last:border-r-0">
                      {day}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                <tr>
                  {days.map(day => (
                    <td key={day} className="align-top border-r border-gray-200 p-0 h-[450px] last:border-r-0">
                      <div className="flex flex-col">
                        {activeData[day]?.length > 0 ? (
                          activeData[day].map((session, idx) => (
                            <div key={idx} className="p-4 border-b border-gray-100 last:border-0 hover:bg-blue-50 transition-colors cursor-default">
                              <p className="text-[9px] font-bold text-gray-400 mb-1">{session.time}</p>
                              <p className="text-[11px] font-black text-gray-800 leading-tight uppercase mb-1">
                                {session.subject}
                              </p>
                              <p className="text-[10px] font-semibold text-gray-500 mb-1">{session.teacher}</p>
                              <p className="text-[10px] font-bold text-blue-600 tracking-tighter uppercase">{session.room}</p>
                            </div>
                          ))
                        ) : (
                          <div className="p-4 text-center text-[9px] text-gray-300 italic">No classes scheduled</div>
                        )}
                      </div>
                    </td>
                  ))}
                </tr>
              </tbody>
            </table>
          </div>
        )}

        {/* 4. EMPTY STATE */}
        {!showTable && !loading && (
           <div className="py-24 flex flex-col items-center justify-center opacity-30 select-none grayscale">
              <span className="text-7xl mb-4">🗓️</span>
              <p className="font-black text-gray-500 uppercase tracking-[0.2em] text-[10px]">Select Semester to view Schedule</p>
           </div>
        )}
      </div>
    </div>
  )
}