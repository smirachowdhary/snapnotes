import Image from 'next/image'
import {
  Check,
  FileText,
  Folder,
  Layers,
  ListChecks,
  Search,
  Sparkles,
  Star,
} from 'lucide-react'

import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'

const courses = [
  { label: 'BIO 202 · Cell Biology', count: 24, active: true },
  { label: 'CHEM 141 · Organic I', count: 18 },
  { label: 'PSY 110 · Cognition', count: 11 },
  { label: 'ECON 201 · Micro', count: 9 },
]

const keyPoints = [
  'Glycolysis splits one glucose into two pyruvate, netting 2 ATP and 2 NADH.',
  'The citric acid cycle runs twice per glucose inside the mitochondrial matrix.',
  'Oxidative phosphorylation produces roughly 34 of the ~38 total ATP.',
]

const terms = [
  { term: 'Glycolysis', where: 'p. 1 · line 4' },
  { term: 'Acetyl-CoA', where: 'p. 2 · line 11' },
  { term: 'Electron transport chain', where: 'p. 3 · line 2' },
]

export function ProductMockup() {
  return (
    <div className="overflow-hidden rounded-2xl border border-border bg-background shadow-panel">
      {/* Window chrome */}
      <div className="flex items-center gap-3 border-b border-border bg-muted/50 px-4 py-3">
        <div className="flex items-center gap-1.5">
          <span className="size-2.5 rounded-full bg-border" />
          <span className="size-2.5 rounded-full bg-border" />
          <span className="size-2.5 rounded-full bg-border" />
        </div>
        <div className="mx-auto flex h-7 w-full max-w-sm items-center gap-2 rounded-lg border border-border bg-background px-2.5 text-xs text-muted-foreground">
          <Search className="size-3.5" aria-hidden="true" />
          <span className="truncate">Search all notes, terms, and slides…</span>
          <span className="ml-auto hidden font-mono text-[10px] text-muted-foreground/70 sm:inline">
            ⌘K
          </span>
        </div>
        <div className="flex size-6 shrink-0 items-center justify-center rounded-full bg-foreground text-[10px] font-medium text-background">
          MJ
        </div>
      </div>

      <div className="flex">
        {/* Sidebar */}
        <aside className="hidden w-56 shrink-0 flex-col gap-1 border-r border-border bg-muted/30 p-3 lg:flex">
          <p className="px-2 pt-1 pb-2 text-[11px] font-medium tracking-wide text-muted-foreground uppercase">
            Courses
          </p>
          {courses.map((course) => (
            <div
              key={course.label}
              className={
                course.active
                  ? 'flex items-center gap-2 rounded-lg bg-background px-2 py-1.5 text-[13px] font-medium text-foreground shadow-xs'
                  : 'flex items-center gap-2 rounded-lg px-2 py-1.5 text-[13px] text-muted-foreground'
              }
            >
              <Folder className="size-3.5 shrink-0" aria-hidden="true" />
              <span className="truncate">{course.label}</span>
              <span className="ml-auto text-[11px] text-muted-foreground/70">
                {course.count}
              </span>
            </div>
          ))}
          <Separator className="my-3" />
          <p className="px-2 pb-2 text-[11px] font-medium tracking-wide text-muted-foreground uppercase">
            Study
          </p>
          <div className="flex items-center gap-2 rounded-lg px-2 py-1.5 text-[13px] text-muted-foreground">
            <Layers className="size-3.5" aria-hidden="true" /> Flashcards
          </div>
          <div className="flex items-center gap-2 rounded-lg px-2 py-1.5 text-[13px] text-muted-foreground">
            <ListChecks className="size-3.5" aria-hidden="true" /> Quizzes
          </div>
          <div className="flex items-center gap-2 rounded-lg px-2 py-1.5 text-[13px] text-muted-foreground">
            <FileText className="size-3.5" aria-hidden="true" /> Study guides
          </div>
        </aside>

        {/* Note */}
        <div className="min-w-0 flex-1 p-5 sm:p-7">
          <div className="flex items-center gap-2 text-[11px] text-muted-foreground">
            <span>BIO 202</span>
            <span aria-hidden="true">/</span>
            <span>Lecture 14</span>
            <Badge
              variant="secondary"
              className="ml-auto gap-1 rounded-full text-[10px] font-medium"
            >
              <Sparkles className="size-3" aria-hidden="true" />
              Generated in 6s
            </Badge>
          </div>

          <h3 className="mt-2 text-lg font-semibold tracking-[-0.02em] sm:text-xl">
            Cellular Respiration: from glucose to ATP
          </h3>

          <div className="mt-4 flex gap-4">
            <div className="min-w-0 flex-1">
              <p className="text-[13px] leading-relaxed text-muted-foreground">
                Respiration converts the chemical energy in glucose into ATP
                across three linked stages. Each stage hands its products to the
                next, and oxygen only appears at the very end as the final
                electron acceptor.
              </p>

              <ul className="mt-4 flex flex-col gap-2.5">
                {keyPoints.map((point) => (
                  <li key={point} className="flex gap-2.5 text-[13px] leading-relaxed">
                    <Check
                      className="mt-0.5 size-3.5 shrink-0 text-brand"
                      aria-hidden="true"
                    />
                    <span className="text-foreground/90">{point}</span>
                  </li>
                ))}
              </ul>

              <div className="mt-5 rounded-xl border border-border bg-muted/40 p-3">
                <p className="text-[11px] font-medium tracking-wide text-muted-foreground uppercase">
                  Key terms
                </p>
                <div className="mt-2 flex flex-col gap-2">
                  {terms.map((t) => (
                    <div
                      key={t.term}
                      className="flex items-baseline justify-between gap-3 text-[12px]"
                    >
                      <span className="font-medium">{t.term}</span>
                      <span className="font-mono text-[10px] text-muted-foreground">
                        {t.where}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Source + flashcard rail */}
            <div className="hidden w-52 shrink-0 flex-col gap-3 xl:flex">
              <div className="overflow-hidden rounded-xl border border-border">
                <Image
                  src="/lecture-photo.png"
                  alt="Photo of handwritten lecture notes uploaded to SnapNotes"
                  width={320}
                  height={220}
                  className="h-28 w-full object-cover"
                />
                <div className="flex items-center gap-1.5 border-t border-border bg-muted/40 px-2.5 py-2 text-[10px] text-muted-foreground">
                  <FileText className="size-3" aria-hidden="true" />
                  <span className="truncate">IMG_4821.HEIC</span>
                  <span className="ml-auto">3 pages</span>
                </div>
              </div>

              <div className="rounded-xl border border-border p-3">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-medium tracking-wide text-muted-foreground uppercase">
                    Flashcard 4 / 12
                  </span>
                  <Star className="size-3 text-muted-foreground" aria-hidden="true" />
                </div>
                <p className="mt-2 text-[12px] font-medium leading-relaxed">
                  Where does the citric acid cycle take place?
                </p>
                <p className="mt-2 rounded-lg bg-brand-subtle px-2 py-1.5 text-[11px] leading-relaxed text-foreground/80">
                  In the mitochondrial matrix.
                </p>
              </div>

              <div className="rounded-xl border border-border p-3">
                <div className="flex items-baseline justify-between">
                  <span className="text-[10px] font-medium tracking-wide text-muted-foreground uppercase">
                    Quiz readiness
                  </span>
                  <span className="text-[11px] font-medium">78%</span>
                </div>
                <div className="mt-2 h-1.5 w-full overflow-hidden rounded-full bg-muted">
                  <div className="h-full w-[78%] rounded-full bg-brand" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
