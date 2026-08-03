'use client'

import { useRef, useState } from 'react'
import { useRouter } from 'next/navigation'
import axios from 'axios'
import { supabase } from '@/lib/supabase'

export default function UploadPage() {
  const inputRef = useRef<HTMLInputElement>(null)
  const router = useRouter()

  const [file, setFile] = useState<File | null>(null)
  const [loading, setLoading] = useState(false)

  function chooseFile(selectedFile: File | null) {
    if (!selectedFile) return

    setFile(selectedFile)
  }

  async function uploadLecture() {
    if (!file) return

    setLoading(true)

    try {
      const {
        data: { user },
      } = await supabase.auth.getUser()

      if (!user) {
        router.push('/login')
        return
      }

      const formData = new FormData()

      formData.append('file', file)
      formData.append('userId', user.id)

      const response = await axios.post(
        '/api/ocr',
        formData
      )

      console.log(response.data)

      if (!response.data.success) {
        throw new Error(
          response.data.error || 'Upload failed'
        )
      }

      router.push('/dashboard')
      router.refresh()
    } catch (err: any) {
      console.error(err)

      alert(
        err?.response?.data?.error ||
          err?.message ||
          'Upload failed.'
      )
    } finally {
      setLoading(false)
    }
  }

  return (
    <main className="min-h-screen bg-gray-50 px-6 py-12">
      <div className="mx-auto max-w-3xl">
        <h1 className="text-4xl font-bold">
          Upload Lecture
        </h1>

        <p className="mt-2 text-gray-500">
          Upload a lecture image. SnapNotes will
          automatically identify the subject,
          organize your notes, generate a summary,
          and create flashcards.
        </p>

        <div
          onClick={() => inputRef.current?.click()}
          className="mt-10 cursor-pointer rounded-2xl border-2 border-dashed bg-white p-20 text-center transition hover:border-black"
        >
          <h2 className="text-2xl font-semibold">
            Click to Upload
          </h2>

          <p className="mt-3 text-gray-500">
            PNG • JPG • JPEG
          </p>

          <input
            hidden
            ref={inputRef}
            type="file"
            accept="image/*"
            onChange={(e) =>
              chooseFile(
                e.target.files?.[0] ?? null
              )
            }
          />
        </div>

        {file && (
          <div className="mt-8 rounded-xl bg-white p-6 shadow">
            <div className="flex items-center justify-between">
              <div>
                <p className="font-semibold">
                  {file.name}
                </p>

                <p className="mt-1 text-sm text-gray-500">
                  {(file.size / 1024 / 1024).toFixed(2)} MB
                </p>
              </div>

              <button
                onClick={uploadLecture}
                disabled={loading}
                className="rounded-xl bg-black px-6 py-3 text-white disabled:opacity-50"
              >
                {loading
                  ? 'Generating Notes...'
                  : 'Upload & Generate'}
              </button>
            </div>
          </div>
        )}
      </div>
    </main>
  )
}