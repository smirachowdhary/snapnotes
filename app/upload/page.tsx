'use client'

import { useEffect, useRef, useState } from 'react'
import { useRouter } from 'next/navigation'
import axios from 'axios'
import { supabase } from '@/lib/supabase'

export default function UploadPage() {
  const inputRef = useRef<HTMLInputElement>(null)
  const router = useRouter()

  const [files, setFiles] = useState<File[]>([])
  const [loading, setLoading] = useState(false)

  const [subjects, setSubjects] = useState<any[]>([])
  const [subjectId, setSubjectId] = useState('')

  useEffect(() => {
    loadSubjects()
  }, [])

  async function loadSubjects() {
    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (!user) return

    const { data } = await supabase
      .from('subjects')
      .select('*')
      .eq('user_id', user.id)
      .order('name')

    setSubjects(data ?? [])
  }

  function chooseFiles(selectedFiles: FileList | null) {
    if (!selectedFiles) return

    setFiles(Array.from(selectedFiles))
  }

  async function uploadLecture() {
    if (files.length === 0) return

    if (!subjectId) {
      alert('Please select a subject.')
      return
    }

    setLoading(true)

    try {
      const {
        data: { user },
      } = await supabase.auth.getUser()

      if (!user) {
        router.push('/login')
        return
      }

      for (const file of files) {
        const formData = new FormData()

        formData.append('file', file)
        formData.append('userId', user.id)
        formData.append('subjectId', subjectId)

        const response = await axios.post(
          '/api/ocr',
          formData
        )

        if (!response.data.success) {
          throw new Error(
            response.data.error || `Failed to upload ${file.name}`
          )
        }
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
          Upload a lecture image and choose a subject.
        </p>

        <div className="mt-8">

          <label className="mb-2 block font-medium">
            Subject
          </label>

          <select
            value={subjectId}
            onChange={(e) =>
              setSubjectId(e.target.value)
            }
            className="w-full rounded-xl border bg-white p-3"
          >
            <option value="">
              Select Subject
            </option>

            {subjects.map((subject) => (
              <option
                key={subject.id}
                value={subject.id}
              >
                {subject.icon} {subject.name}
              </option>
            ))}
          </select>

        </div>

        <div
          onClick={() => inputRef.current?.click()}
          className="mt-8 cursor-pointer rounded-2xl border-2 border-dashed bg-white p-20 text-center transition hover:border-black"
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
            multiple
            accept="image/*"
            onChange={(e) =>
              chooseFiles(e.target.files)
            }
          />
        </div>

        {files.length > 0 && (
          <div className="mt-8 rounded-xl bg-white p-6 shadow">

            <p className="font-semibold">
              {files.length} file(s) selected
            </p>

            <p className="mt-1 text-sm text-gray-500">
              {files.map((file) => (
                <p key={file.name} className="text-sm text-gray-500">
                  {file.name} ({(file.size / 1024 / 1024).toFixed(2)} MB)
                </p>
              ))}
            </p>

            <button
              onClick={uploadLecture}
              disabled={loading}
              className="mt-6 rounded-xl bg-black px-6 py-3 text-white disabled:opacity-50"
            >
              {loading
                ? 'Generating Notes...'
                : 'Upload & Generate'}
            </button>

          </div>
        )}

      </div>
    </main>
  )
}