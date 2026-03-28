'use client'
import { useEffect, useState } from 'react'
import { supabase } from '../lib/supabase'
import { useRouter } from 'next/navigation'

export default function TimetablePage() {
  const router = useRouter()
  const [user, setUser] = useState(null)
  const [timetable, setTimetable] = useState([])
  const [showAdd, setShowAdd] = useState(false)
  const [day, setDay] = useState('Monday')
  const [time, setTime] = useState('')
  const [room, setRoom] = useState('')
  const [courseId, setCourseId] = useState('')
  const [courses, setCourses] = useState([])

  const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday']

  useEffect(() => {
    const getData = async () => {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) { router.push('/'); return }
      const { data: userData } = await supabase.from('users').select('*').eq('id', user.id).single()
      setUser(userData)

      const { data: ttData } = await supabase
        .from('timetable')
        .select('*, courses(name)')
        .order('day')
      setTimetable(ttData || [])

      if (userData.role === 'teacher') {
        const { data: coursesData } = await supabase.from('courses').select('*').eq('teacher_id', user.id)
        setCourses(coursesData || [])
        if (coursesData?.length > 0) setCourseId(coursesData[0].id)
      }
    }
    getData()
  }, [])

  const handleAddSlot = async () => {
    const { data } = await supabase.from('timetable').insert({
      course_id: courseId, day, time, room
    }).select('*, courses(name)')
    setTimetable([...timetable, ...(data || [])])
    setTime(''); setRoom(''); setShowAdd(false)
  }

  return (
    <div className="min-h-screen bg-gray-100">
      <nav className="bg-white shadow p-4 flex justify-between items-center">
        <h1 className="text-xl font-bold text-blue-600">Academic App</h1>
        <div className="flex items-center gap-4">
          <span className="text-gray-600">👋 {user?.name}</span>
          <button onClick={() => router.push(`/${user?.role}`)} className="text-sm text-gray-500 hover:underline">← Back</button>
        </div>
      </nav>

      <div className="max-w-5xl mx-auto p-6">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold">Timetable</h2>
          {user?.role === 'teacher' && (
            <button onClick={() => setShowAdd(true)} className="bg-blue-600 text-white px-4 py-2 rounded-lg text-sm">+ Add Slot</button>
          )}
        </div>

        {showAdd && (
          <div className="bg-white p-5 rounded-xl shadow mb-6">
            <h3 className="font-semibold mb-3">New Timetable Slot</h3>
            <select className="w-full border p-3 rounded-lg mb-3 text-sm" value={courseId} onChange={e => setCourseId(e.target.value)}>
              {courses.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
            </select>
            <select className="w-full border p-3 rounded-lg mb-3 text-sm" value={day} onChange={e => setDay(e.target.value)}>
              {days.map(d => <option key={d} value={d}>{d}</option>)}
            </select>
            <input type="time" className="w-full border p-3 rounded-lg mb-3 text-sm" value={time} onChange={e => setTime(e.target.value)} />
            <input type="text" placeholder="Room (e.g. Room 101)" className="w-full border p-3 rounded-lg mb-3 text-sm" value={room} onChange={e => setRoom(e.target.value)} />
            <div className="flex gap-2">
              <button onClick={handleAddSlot} className="bg-green-600 text-white px-4 py-2 rounded-lg text-sm">Save</button>
              <button onClick={() => setShowAdd(false)} className="bg-gray-200 px-4 py-2 rounded-lg text-sm">Cancel</button>
            </div>
          </div>
        )}

        {days.map(d => {
          const slots = timetable.filter(t => t.day === d)
          if (slots.length === 0) return null
          return (
            <div key={d} className="mb-4">
              <h3 className="font-semibold text-gray-600 mb-2">{d}</h3>
              {slots.map(slot => (
                <div key={slot.id} className="bg-white p-4 rounded-xl shadow mb-2 flex justify-between items-center">
                  <div>
                    <p className="font-medium">{slot.courses?.name}</p>
                    <p className="text-gray-400 text-sm">📍 {slot.room}</p>
                  </div>
                  <p className="text-blue-600 font-medium">{slot.time}</p>
                </div>
              ))}
            </div>
          )
        })}

        {timetable.length === 0 && (
          <div className="bg-white p-5 rounded-xl shadow">
            <p className="text-gray-400 text-sm">No timetable entries yet.</p>
          </div>
        )}
      </div>
    </div>
  )
}