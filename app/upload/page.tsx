'use client'

import { useRef, useState } from 'react'
import { useRouter } from 'next/navigation'
import axios from 'axios'
import { supabase } from '@/lib/supabase'

export default function UploadPage() {
  const inputRef = useRef<HTMLInputElement>(null)
  const router = useRouter()

  const [file, setFile] = useState<File | null>(null)
  const [title, setTitle] = useState('')
  const [loading, setLoading] = useState(false)

  function chooseFile(selectedFile: File | null) {
    if (!selectedFile) return

    setFile(selectedFile)
    setTitle(selectedFile.name.replace(/\.[^/.]+$/, ''))
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

      const response = await axios.post('/api/ocr', formData)

      const extractedText = response.data.text
      
      const fileName = `${user.id}/${Date.now()}-${file.name}`

      const { error: uploadError } = await supabase.storage
        .from('lecture-images')
        .upload(fileName, file)

      if (uploadError) throw uploadError

      const { error: dbError } = await supabase
        .from('lectures')
        .insert({
          user_id: user.id,
          title: title.trim() || file.name,
          image_url: fileName,
          ocr_text: extractedText,
        })

      if (dbError) throw dbError

      router.push('/dashboard')
      router.refresh()
    } catch (error: any) {
      console.error(error)
      alert(error?.message || JSON.stringify(error))
    } finally {
      setLoading(false)
    }
  }

  return (
    <main className="min-h-screen bg-gray-50 px-6 py-12">
      <div className="mx-auto max-w-4xl">
        <h1 className="text-4xl font-bold">
          Upload Lecture
        </h1>

        <p className="mt-2 text-gray-500">
          Upload a lecture image and give it a title.
        </p>

        <div
          onClick={() => inputRef.current?.click()}
          className="mt-10 cursor-pointer rounded-2xl border-2 border-dashed bg-white p-16 text-center hover:border-black"
        >
          <h2 className="text-2xl font-semibold">
            Click to Upload
          </h2>

          <p className="mt-2 text-gray-500">
            PNG • JPG • JPEG
          </p>

          <input
            ref={inputRef}
            hidden
            type="file"
            accept="image/*"
            onChange={(e) => chooseFile(e.target.files?.[0] ?? null)}
          />
        </div>

        {file && (
          <div className="mt-8 rounded-xl bg-white p-6 shadow">
            <label className="mb-2 block text-sm font-medium">
              Lecture Title
            </label>

            <input
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full rounded-xl border p-3"
              placeholder="e.g. Biology Chapter 3"
            />

            <p className="mt-4 text-sm text-gray-500">
              {file.name}
            </p>

            <button
              onClick={uploadLecture}
              disabled={loading}
              className="mt-6 rounded-xl bg-black px-6 py-3 text-white disabled:opacity-50"
            >
              {loading ? 'Uploading...' : 'Upload & Extract'}
            </button>
          </div>
        )}
      </div>
    </main>
  )
}