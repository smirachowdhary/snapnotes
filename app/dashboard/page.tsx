'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabase'

type Lecture = {
  id: string
  title: string
  ocr_text: string
  created_at: string
}

export default function Dashboard() {
  const router = useRouter()

  const [lectures, setLectures] = useState<Lecture[]>([])
  const [selectedLecture, setSelectedLecture] = useState<Lecture | null>(null)
  const [search, setSearch] = useState('')

  useEffect(() => {
    loadLectures()
  }, [])

  async function loadLectures() {
    const { data, error } = await supabase
      .from('lectures')
      .select('*')
      .order('created_at', { ascending: false })

    if (!error && data) {
      setLectures(data)
    }
  }

  async function logout() {
    await supabase.auth.signOut()
    router.push('/')
  }

  async function deleteLecture(id: string) {
    if (!confirm('Delete this lecture?')) return

    await supabase.from('lectures').delete().eq('id', id)

    if (selectedLecture?.id === id) {
      setSelectedLecture(null)
    }

    loadLectures()
  }

  const filtered = lectures.filter(
    (lecture) =>
      lecture.title.toLowerCase().includes(search.toLowerCase()) ||
      lecture.ocr_text.toLowerCase().includes(search.toLowerCase())
  )

  return (
    <main className="min-h-screen bg-gray-50">
      <header className="border-b bg-white">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-8 py-5">
          <h1 className="text-2xl font-bold">SnapNotes</h1>

          <div className="flex items-center gap-3">
            <input
              placeholder="Search notes..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="rounded-lg border px-3 py-2"
            />

            <button
              onClick={logout}
              className="rounded-lg border px-4 py-2 hover:bg-gray-100"
            >
              Log Out
            </button>
          </div>
        </div>
      </header>

      <div className="mx-auto flex max-w-7xl gap-8 px-8 py-12">
        <div className="w-full lg:w-1/2">
          <div className="mb-8 flex items-center justify-between">
            <div>
              <h2 className="text-4xl font-bold">My Notes</h2>

              <p className="mt-2 text-gray-500">
                {lectures.length} lecture{lectures.length !== 1 ? 's' : ''}
              </p>
            </div>

            <Link href="/upload">
              <button className="rounded-xl bg-black px-6 py-3 text-white">
                Upload Lecture
              </button>
            </Link>
          </div>

          {filtered.length === 0 ? (
            <div className="rounded-xl border bg-white p-10 text-center text-gray-500">
              No lectures found.
            </div>
          ) : (
            <div className="space-y-4">
              {filtered.map((lecture) => (
                <div
                  key={lecture.id}
                  className={`cursor-pointer rounded-xl border bg-white p-5 transition hover:shadow ${
                    selectedLecture?.id === lecture.id
                      ? 'border-black'
                      : ''
                  }`}
                >
                  <div className="flex items-start justify-between">
                    <div
                      className="flex-1"
                      onClick={() => setSelectedLecture(lecture)}
                    >
                      <h3 className="text-xl font-semibold">
                        {lecture.title}
                      </h3>

                      <p className="mt-1 text-sm text-gray-500">
                        {new Date(
                          lecture.created_at
                        ).toLocaleDateString()}
                      </p>

                      <p className="mt-4 line-clamp-3 whitespace-pre-wrap text-gray-700">
                        {lecture.ocr_text}
                      </p>
                    </div>

                    <button
                      onClick={() => deleteLecture(lecture.id)}
                      className="ml-4 text-red-500 hover:text-red-700"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="hidden rounded-xl border bg-white p-8 lg:block lg:w-1/2">
          {selectedLecture ? (
            <>
              <h2 className="text-3xl font-bold">
                {selectedLecture.title}
              </h2>

              <p className="mt-2 text-sm text-gray-500">
                {new Date(
                  selectedLecture.created_at
                ).toLocaleDateString()}
              </p>

              <div className="mt-8 max-h-[70vh] overflow-y-auto whitespace-pre-wrap leading-7 text-gray-800">
                {selectedLecture.ocr_text}
              </div>
            </>
          ) : (
            <div className="flex h-full items-center justify-center text-center text-gray-500">
              <div>
                <h3 className="text-2xl font-semibold">
                  Select a lecture
                </h3>

                <p className="mt-3">
                  Click any note to read the extracted text.
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </main>
  )
}