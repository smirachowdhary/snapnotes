import { ArrowRight, Camera } from 'lucide-react'

import { Button } from '@/components/ui/button'
import { ProductMockup } from '@/components/product-mockup'

const stats = [
  { value: '1.2M', label: 'pages turned into notes' },
  { value: '6s', label: 'average processing time' },
  { value: '340+', label: 'campuses using SnapNotes' },
  { value: '4.9', label: 'average student rating' },
]

export function Hero() {
  return (
    <section className="relative overflow-hidden">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-0 top-0 h-[560px] grid-bg [mask-image:radial-gradient(120%_60%_at_50%_0%,black,transparent_70%)] opacity-60"
      />

      <div className="relative mx-auto w-full max-w-6xl px-6 pt-16 pb-12 sm:pt-24 sm:pb-16">
        <div className="mx-auto flex max-w-2xl flex-col items-center text-center">
          <span className="inline-flex items-center gap-2 rounded-full border border-border bg-background/70 px-3 py-1 text-xs text-muted-foreground backdrop-blur">
            <Camera className="size-3.5" aria-hidden="true" />
            Now reading handwriting, whiteboards, and slides
          </span>

          <h1 className="mt-6 text-4xl font-semibold tracking-[-0.035em] text-balance sm:text-6xl">
            Photograph the lecture. Study the notes.
          </h1>

          <p className="mt-5 max-w-xl text-base leading-relaxed text-pretty text-muted-foreground sm:text-lg">
            SnapNotes turns a photo of any board, notebook, or slide into
            searchable notes, clean summaries, flashcards, and practice quizzes —
            organized by course, ready before you leave the room.
          </p>

          <div className="mt-8 flex w-full flex-col gap-3 sm:w-auto sm:flex-row sm:items-center">
            <Button
              nativeButton={false}
              render={<a href="#pricing" />}
              className="h-11 rounded-xl px-5 text-[0.95rem]"
            >
              Start free with 20 pages
              <ArrowRight data-icon="inline-end" />
            </Button>
            <Button
              variant="outline"
              nativeButton={false}
              render={<a href="#how-it-works" />}
              className="h-11 rounded-xl px-5 text-[0.95rem]"
            >
              See how it works
            </Button>
          </div>

          <p className="mt-4 text-xs text-muted-foreground">
            No credit card required · Free for your first 20 pages every month
          </p>
        </div>

        <div className="mt-14 sm:mt-20">
          <ProductMockup />
        </div>

        <dl className="mt-14 grid grid-cols-2 gap-x-6 gap-y-8 border-t border-border pt-10 sm:mt-16 md:grid-cols-4">
          {stats.map((stat) => (
            <div key={stat.label} className="flex flex-col gap-1">
              <dt className="sr-only">{stat.label}</dt>
              <dd className="text-2xl font-semibold tracking-[-0.03em] sm:text-3xl">
                {stat.value}
              </dd>
              <p className="text-[13px] leading-relaxed text-muted-foreground">
                {stat.label}
              </p>
            </div>
          ))}
        </dl>
      </div>
    </section>
  )
}
