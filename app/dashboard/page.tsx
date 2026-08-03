'use client'

import { useEffect, useMemo, useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabase'

type Lecture = {
  id: string
  title: string
  subject: string | null
  ocr_text: string
  created_at: string
}

export default function DashboardPage() {
  const router = useRouter()

  const [loading, setLoading] = useState(true)
  const [lectures, setLectures] = useState<Lecture[]>([])
  const [search, setSearch] = useState('')

  useEffect(() => {
    checkUser()
    loadLectures()
  }, [])

  async function checkUser() {
    const {
      data: { session },
    } = await supabase.auth.getSession()

    if (!session) {
      router.push('/login')
    }
  }

  async function loadLectures() {
    setLoading(true)

    const { data, error } = await supabase
      .from('lectures')
      .select('*')
      .order('created_at', { ascending: false })

    if (!error && data) {
      setLectures(data as Lecture[])
    }

    setLoading(false)
  }

  async function logout() {
    await supabase.auth.signOut()
    router.push('/')
  }

  const filtered = useMemo(() => {
    if (!search.trim()) return lectures

    const q = search.toLowerCase()

    return lectures.filter(
      (lecture) =>
        lecture.title.toLowerCase().includes(q) ||
        lecture.subject?.toLowerCase().includes(q) ||
        lecture.ocr_text.toLowerCase().includes(q)
    )
  }, [lectures, search])

  const recent = filtered[0]

  const groupedSubjects = useMemo(() => {
    const groups: Record<string, Lecture[]> = {}

    filtered.forEach((lecture) => {
      const subject =
        lecture.subject && lecture.subject.trim().length > 0
          ? lecture.subject
          : 'Uncategorized'

      if (!groups[subject]) groups[subject] = []

      groups[subject].push(lecture)
    })

    return Object.entries(groups).sort((a, b) => b[1].length - a[1].length)
  }, [filtered])

  return (
    <main className="min-h-screen bg-gray-100">
      <div className="mx-auto max-w-7xl px-6 py-10">
        {/* Header */}
        <div className="mb-8 flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <h1 className="text-4xl font-bold text-gray-900">
              SnapNotes
            </h1>
            <p className="mt-2 text-gray-500">
              Organize your lectures by subject.
            </p>
          </div>

          <div className="flex flex-wrap gap-3">
            <Link
              href="/upload"
              className="rounded-lg bg-blue-600 px-5 py-3 font-semibold text-white hover:bg-blue-700"
            >
              Upload
            </Link>

            <Link
              href="/subjects/new"
              className="rounded-lg bg-green-600 px-5 py-3 font-semibold text-white hover:bg-green-700"
            >
              New Subject
            </Link>

            <button
              onClick={logout}
              className="rounded-lg border border-red-500 px-5 py-3 font-semibold text-red-600 hover:bg-red-50"
            >
              Logout
            </button>
          </div>
        </div>

        {/* Search */}
        <div className="mb-8">
          <input
            type="text"
            placeholder="Search notes..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full rounded-xl border border-gray-300 bg-white px-5 py-4 text-lg outline-none focus:border-blue-500"
          />
        </div>

        {/* Recent Note */}
        <section className="mb-10">
          <h2 className="mb-4 text-2xl font-bold text-gray-900">
            Most Recent Note
          </h2>

          {recent ? (
            <Link href={`/lectures/${recent.id}`}>
              <div className="rounded-2xl bg-white p-6 shadow transition hover:shadow-lg">
                <div className="mb-3 inline-flex rounded-full bg-blue-100 px-3 py-1 text-sm font-medium text-blue-700">
                  {recent.subject || 'Uncategorized'}
                </div>

                <h3 className="text-2xl font-bold">
                  {recent.title}
                </h3>

                <p className="mt-4 line-clamp-3 text-gray-600">
                  {recent.ocr_text}
                </p>

                <p className="mt-5 text-sm text-gray-400">
                  {new Date(recent.created_at).toLocaleDateString()}
                </p>
              </div>
            </Link>
          ) : (
            <div className="rounded-2xl bg-white p-10 text-center shadow">
              <p className="text-gray-500">
                No notes yet.
              </p>
            </div>
          )}
        </section>

        {/* Subject Cards */}
        <section>
          <div className="mb-5 flex items-center justify-between">
            <h2 className="text-2xl font-bold">
              Subjects
            </h2>
          </div>

          {loading ? (
            <div className="py-16 text-center text-gray-500">
              Loading...
            </div>
          ) : groupedSubjects.length === 0 ? (
            <div className="rounded-xl bg-white p-12 text-center shadow">
              No notes found.
            </div>
          ) : (
            <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
              {groupedSubjects.map(([subject, notes]) => (
                <div
                  key={subject}
                  className="rounded-2xl bg-white p-6 shadow"
                >
                  <div className="mb-5 flex items-center justify-between">
                    <div>
                      <h3 className="text-xl font-bold">
                        {subject}
                      </h3>

                      <p className="text-sm text-gray-500">
                        {notes.length} notes
                      </p>
                    </div>

                    <Link
                      href={`/subjects/${encodeURIComponent(subject)}`}
                      className="text-sm font-semibold text-blue-600 hover:text-blue-700"
                    >
                      View All →
                    </Link>
                  </div>

                  <div className="space-y-3">
                    {notes.slice(0, 3).map((note) => (
                      <Link
                        key={note.id}
                        href={`/lectures/${note.id}`}
                      >
                        <div className="rounded-xl border p-4 transition hover:bg-gray-50">
                          <h4 className="font-semibold">
                            {note.title}
                          </h4>

                          <p className="mt-2 line-clamp-2 text-sm text-gray-500">
                            {note.ocr_text}
                          </p>

                          <p className="mt-3 text-xs text-gray-400">
                            {new Date(
                              note.created_at
                            ).toLocaleDateString()}
                          </p>
                        </div>
                      </Link>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>
      </div>
    </main>
  )
}