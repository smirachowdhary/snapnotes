'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { useParams, useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabase'

type Flashcard = {
  question: string
  answer: string
}

type Lecture = {
  id: string
  title: string
  notes: string
  summary: string
  image_url: string
  created_at: string
  flashcards: Flashcard[] | null
  subjects: {
    id: string
    name: string
    icon: string
    color: string
  } | null
}

export default function LecturePage() {
  const { id } = useParams()
  const router = useRouter()

  const [lecture, setLecture] = useState<Lecture | null>(null)
  const [loading, setLoading] = useState(true)
  const [activeTab, setActiveTab] = useState<
    'notes' | 'summary' | 'flashcards'
  >('notes')

  useEffect(() => {
    loadLecture()
  }, [])

  async function loadLecture() {
    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (!user) {
      router.push('/login')
      return
    }

    const { data, error } = await supabase
      .from('lectures')
      .select(
        `
        *,
        subjects (
          id,
          name,
          icon,
          color
        )
      `
      )
      .eq('id', id)
      .single()

    if (error || !data) {
      router.push('/dashboard')
      return
    }

    setLecture(data as Lecture)
    setLoading(false)
  }

  async function deleteLecture() {
    if (!lecture) return

    if (!confirm('Delete this lecture?')) return

    await supabase
      .from('lectures')
      .delete()
      .eq('id', lecture.id)

    router.push('/dashboard')
  }

  if (loading) {
    return (
      <main className="min-h-screen flex items-center justify-center">
        <div className="text-xl font-semibold">
          Loading...
        </div>
      </main>
    )
  }

  if (!lecture) {
    return null
  }

  return (
    <main className="min-h-screen bg-gray-100">

      <div className="mx-auto max-w-6xl p-10">

        <div className="mb-8 flex items-center justify-between">

          <div>

            <Link
              href={`/subjects/${encodeURIComponent(
                lecture.subjects?.name || 'Other'
              )}`}
              className="text-blue-600 hover:underline"
            >
              ← {lecture.subjects?.name || 'Other'}
            </Link>

            <h1 className="mt-3 text-5xl font-bold">
              {lecture.title}
            </h1>

            <p className="mt-3 text-gray-500">
              {new Date(
                lecture.created_at
              ).toLocaleDateString()}
            </p>

          </div>

          <button
            onClick={deleteLecture}
            className="rounded-xl bg-red-600 px-5 py-3 text-white hover:bg-red-700"
          >
            Delete
          </button>

        </div>

        <div className="mb-8 flex gap-3">

          <button
            onClick={() => setActiveTab('notes')}
            className={`rounded-xl px-5 py-3 ${
              activeTab === 'notes'
                ? 'bg-black text-white'
                : 'bg-white'
            }`}
          >
            📄 Notes
          </button>

          <button
            onClick={() => setActiveTab('summary')}
            className={`rounded-xl px-5 py-3 ${
              activeTab === 'summary'
                ? 'bg-black text-white'
                : 'bg-white'
            }`}
          >
            📝 Summary
          </button>

          <button
            onClick={() => setActiveTab('flashcards')}
            className={`rounded-xl px-5 py-3 ${
              activeTab === 'flashcards'
                ? 'bg-black text-white'
                : 'bg-white'
            }`}
          >
            🧠 Flashcards
          </button>

        </div>

                <div className="rounded-2xl bg-white p-8 shadow">

          {activeTab === 'notes' && (
            <div className="prose prose-lg max-w-none">
                <div
                    dangerouslySetInnerHTML={{
                    __html: lecture.notes
                        .replace(/\n/g, '<br/>')
                        .replace(/^# (.*)$/gm, '<h1>$1</h1>')
                        .replace(/^## (.*)$/gm, '<h2>$1</h2>')
                        .replace(/^### (.*)$/gm, '<h3>$1</h3>')
                        .replace(/^\- (.*)$/gm, '<li>$1</li>'),
                    }}
                />
            </div>
          )}

          {activeTab === 'summary' && (
            <article className="prose prose-lg max-w-none">
              <h2>Summary</h2>

              <p className="whitespace-pre-wrap">
                {lecture.summary || 'No summary available.'}
              </p>

              <hr className="my-8" />

              <h2>Original Lecture Image</h2>

              <p className="text-gray-500">
                Original image coming soon.
              </p>
            </article>
          )}

          {activeTab === 'flashcards' && (
            <>
              {lecture.flashcards &&
              lecture.flashcards.length > 0 ? (
                <div className="space-y-5">

                  {lecture.flashcards.map(
                    (card, index) => (
                      <div
                        key={index}
                        className="rounded-2xl border bg-gray-50 p-6"
                      >
                        <p className="mb-3 text-sm font-semibold uppercase tracking-wide text-blue-600">
                          Question {index + 1}
                        </p>

                        <h3 className="text-xl font-semibold">
                          {card.question}
                        </h3>

                        <div className="mt-6 rounded-xl bg-white p-5">
                          <p className="font-medium text-green-700">
                            Answer
                          </p>

                          <p className="mt-2 whitespace-pre-wrap leading-7">
                            {card.answer}
                          </p>
                        </div>
                      </div>
                    )
                  )}

                </div>
              ) : (
                <div className="py-12 text-center text-gray-500">
                  No flashcards available.
                </div>
              )}
            </>
          )}

        </div>
      </div>
    </main>
  )
}