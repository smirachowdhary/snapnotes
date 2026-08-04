'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { useParams, useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabase'

type Lecture = {
  id: string
  title: string
  notes: string
  summary: string
  created_at: string
}

type Subject = {
  id: string
  name: string
  icon: string
  color: string
}

export default function SubjectPage() {
  const { subject } = useParams()
  const router = useRouter()

  const [loading, setLoading] = useState(true)
  const [subjectData, setSubjectData] = useState<Subject | null>(null)
  const [lectures, setLectures] = useState<Lecture[]>([])

  useEffect(() => {
    loadSubject()
  }, [])

  async function loadSubject() {
    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (!user) {
      router.push('/login')
      return
    }

    const { data: subjectRow } = await supabase
      .from('subjects')
      .select('*')
      .eq('user_id', user.id)
      .eq('name', decodeURIComponent(subject as string))
      .single()

    if (!subjectRow) {
      setLoading(false)
      return
    }

    setSubjectData(subjectRow)

    const { data: notes } = await supabase
      .from('lectures')
      .select('*')
      .eq('subject_id', subjectRow.id)
      .order('created_at', {
        ascending: false,
      })

    setLectures(notes || [])
    setLoading(false)
  }

  if (loading) {
    return (
      <main className="min-h-screen flex items-center justify-center text-xl">
        Loading...
      </main>
    )
  }

  if (!subjectData) {
    return (
      <main className="min-h-screen flex flex-col items-center justify-center gap-6">
        <h1 className="text-4xl font-bold">
          Subject not found
        </h1>

        <Link
          href="/dashboard"
          className="rounded-xl bg-black px-6 py-3 text-white"
        >
          Back to Dashboard
        </Link>
      </main>
    )
  }

  return (
    <main className="min-h-screen bg-gray-100">
      <div className="mx-auto max-w-6xl p-10">

        <div className="mb-10 flex items-center justify-between">

          <div>
            <div className="text-6xl">
              {subjectData.icon}
            </div>

            <h1 className="mt-3 text-5xl font-bold">
              {subjectData.name}
            </h1>

            <p className="mt-2 text-gray-500">
              {lectures.length} lecture
              {lectures.length !== 1 && 's'}
            </p>
          </div>

          <Link
            href="/dashboard"
            className="rounded-xl border px-6 py-3"
          >
            ← Dashboard
          </Link>

        </div>

        {lectures.length === 0 ? (
          <div className="rounded-2xl bg-white p-10 text-center shadow">
            No lectures yet.
          </div>
        ) : (
          <div className="grid gap-6">

            {lectures.map((lecture) => (
              <Link
                key={lecture.id}
                href={`/lectures/${lecture.id}`}
              >
                <div className="rounded-2xl bg-white p-6 shadow transition hover:shadow-lg">

                  <h2 className="text-2xl font-bold">
                    {lecture.title}
                  </h2>

                  <p className="mt-3 line-clamp-3 whitespace-pre-wrap text-gray-600">
                    {lecture.summary || lecture.notes}
                  </p>

                  <p className="mt-4 text-sm text-gray-400">
                    {new Date(
                      lecture.created_at
                    ).toLocaleDateString()}
                  </p>

                </div>
              </Link>
            ))}

          </div>
        )}
      </div>
    </main>
  )
}