'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabase'

const icons = [
  '📁',
  '🧬',
  '⚗️',
  '⚛️',
  '📐',
  '💻',
  '📖',
  '🏛️',
  '📈',
  '🧠',
  '🎨',
  '🎵',
]

const colors = [
  'gray',
  'blue',
  'green',
  'purple',
  'orange',
  'red',
  'pink',
  'cyan',
  'amber',
  'emerald',
]

export default function NewSubjectPage() {
  const router = useRouter()

  const [name, setName] = useState('')
  const [icon, setIcon] = useState('📁')
  const [color, setColor] = useState('gray')
  const [loading, setLoading] = useState(false)

  async function createSubject() {
    if (!name.trim()) {
      alert('Enter a subject name.')
      return
    }

    setLoading(true)

    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (!user) {
      router.push('/login')
      return
    }

    const { error } = await supabase.from('subjects').insert({
      user_id: user.id,
      name: name.trim(),
      icon,
      color,
    })

    setLoading(false)

    if (error) {
      alert(error.message)
      return
    }

    router.push('/dashboard')
    router.refresh()
  }

  return (
    <main className="min-h-screen bg-gray-100 flex items-center justify-center p-8">
      <div className="w-full max-w-xl rounded-2xl bg-white p-8 shadow-lg">
        <h1 className="text-3xl font-bold">
          Create Subject
        </h1>

        <p className="mt-2 text-gray-500">
          Organize your lectures into subjects.
        </p>

        <div className="mt-8">
          <label className="mb-2 block font-medium">
            Subject Name
          </label>

          <input
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Biology"
            className="w-full rounded-xl border p-3"
          />
        </div>

        <div className="mt-8">
          <label className="mb-3 block font-medium">
            Icon
          </label>

          <div className="grid grid-cols-6 gap-3">
            {icons.map((emoji) => (
              <button
                key={emoji}
                onClick={() => setIcon(emoji)}
                className={`rounded-xl border p-3 text-2xl transition ${
                  icon === emoji
                    ? 'border-blue-600 bg-blue-50'
                    : ''
                }`}
              >
                {emoji}
              </button>
            ))}
          </div>
        </div>

        <div className="mt-8">
          <label className="mb-3 block font-medium">
            Color
          </label>

          <div className="grid grid-cols-5 gap-3">
            {colors.map((c) => (
              <button
                key={c}
                onClick={() => setColor(c)}
                className={`rounded-xl border p-3 capitalize ${
                  color === c
                    ? 'border-blue-600 bg-blue-50'
                    : ''
                }`}
              >
                {c}
              </button>
            ))}
          </div>
        </div>

        <div className="mt-10 flex gap-3">
          <button
            onClick={createSubject}
            disabled={loading}
            className="rounded-xl bg-blue-600 px-6 py-3 font-semibold text-white hover:bg-blue-700 disabled:opacity-50"
          >
            {loading ? 'Creating...' : 'Create Subject'}
          </button>

          <button
            onClick={() => router.push('/dashboard')}
            className="rounded-xl border px-6 py-3"
          >
            Cancel
          </button>
        </div>
      </div>
    </main>
  )
}