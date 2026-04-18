'use client';

import { useState, useEffect } from 'react';
import { createBrowserClient } from '@supabase/ssr';
import { useRouter } from 'next/navigation';

const supabase = createBrowserClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
);

export default function StudentProfile() {
  const [studentData, setStudentData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const router = useRouter();

  // ✅ FIXED FUNCTION (ONLY ONE)
  const fetchStudentData = async () => {
    try {
      setLoading(true);

      const { data: { user }, error: userError } = await supabase.auth.getUser();

      console.log("USER:", user);

      if (!user) {
        router.push('/login');
        return;
      }

      const { data, error } = await supabase
        .from('students')
        .select('*')
        .eq('email', user.email);

      console.log("DATA:", data);
      console.log("ERROR:", error);

      if (error) throw error;

      setStudentData(data?.[0] || null);

    } catch (err) {
      console.error('Error fetching student data:', err);
      setError(err.message || JSON.stringify(err));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStudentData();
  }, []);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.push('/login');
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <p>Loading profile...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center text-red-600">
        {error}
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="ml-64 p-8">

        <div className="flex justify-between mb-6">
          <h2 className="text-2xl font-bold">Student Profile</h2>

          <button
            onClick={handleLogout}
            className="bg-red-600 text-white px-4 py-2 rounded"
          >
            Logout
          </button>
        </div>

        <div className="bg-white p-6 rounded shadow">
          <p><b>Name:</b> {studentData?.full_name || '---'}</p>
          <p><b>Email:</b> {studentData?.email || '---'}</p>
          <p><b>Student ID:</b> {studentData?.student_id || '---'}</p>
        </div>

      </div>
    </div>
  );
}