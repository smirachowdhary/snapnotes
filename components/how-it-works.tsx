import Image from 'next/image'
import { Check, Circle, ScanLine } from 'lucide-react'

import { SectionHeading } from '@/components/section-heading'

const pipeline = [
  { label: 'Reading handwriting & print', done: true },
  { label: 'Detecting diagrams and formulas', done: true },
  { label: 'Structuring headings and sections', done: true },
  { label: 'Writing summary and key points', done: true },
  { label: 'Generating 12 flashcards', done: false },
]

const options = [
  { label: 'Cytoplasm', correct: false },
  { label: 'Mitochondrial matrix', correct: true },
  { label: 'Inner membrane', correct: false },
]

export function HowItWorks() {
  return (
    <section
      id="how-it-works"
      className="scroll-mt-20 border-y border-border bg-muted/30"
    >
      <div className="mx-auto w-full max-w-6xl px-6 py-20 sm:py-28">
        <SectionHeading
          eyebrow="How it works"
          title="Three steps, and you are done before the room clears"
          description="No transcribing, no tagging, no template setup. Point, upload, study."
        />

        <ol className="mt-14 grid gap-10 md:grid-cols-3 md:gap-6">
          {/* Step 1 */}
          <li className="flex flex-col gap-5">
            <div className="relative overflow-hidden rounded-2xl border border-border bg-background p-2 shadow-panel">
              <div className="relative overflow-hidden rounded-xl">
                <Image
                  src="/whiteboard-photo.png"
                  alt="Lecture hall whiteboard covered in handwritten equations, framed inside the SnapNotes camera"
                  width={640}
                  height={420}
                  priority
                  className="h-44 w-full object-cover object-[center_28%]"
                />
                <div
                  aria-hidden="true"
                  className="absolute inset-3 rounded-lg border-2 border-background/80"
                />
                <div className="absolute bottom-2 left-2 flex items-center gap-1.5 rounded-full bg-background/90 px-2 py-1 text-[10px] font-medium backdrop-blur">
                  <ScanLine className="size-3" aria-hidden="true" />
                  Edges detected
                </div>
              </div>
              <div className="flex items-center justify-between px-1.5 py-2 text-[11px] text-muted-foreground">
                <span>3 photos selected</span>
                <span className="font-medium text-brand">Upload</span>
              </div>
            </div>
            <Step
              number="01"
              title="Snap the board"
              description="Take photos of slides, whiteboards, or your own notebook. SnapNotes straightens the page, fixes glare, and stitches multi-page sets together."
            />
          </li>

          {/* Step 2 */}
          <li className="flex flex-col gap-5">
            <div className="rounded-2xl border border-border bg-background p-4 shadow-panel">
              <div className="flex items-baseline justify-between">
                <p className="text-[11px] font-medium tracking-wide text-muted-foreground uppercase">
                  Processing
                </p>
                <span className="font-mono text-[10px] text-muted-foreground">
                  00:06
                </span>
              </div>
              <div className="mt-3 flex flex-col gap-2.5">
                {pipeline.map((step) => (
                  <div
                    key={step.label}
                    className="flex items-center gap-2.5 text-[12px]"
                  >
                    {step.done ? (
                      <span className="flex size-4 shrink-0 items-center justify-center rounded-full bg-brand text-brand-foreground">
                        <Check className="size-2.5" aria-hidden="true" />
                      </span>
                    ) : (
                      <Circle
                        className="size-4 shrink-0 animate-pulse text-muted-foreground/50"
                        aria-hidden="true"
                      />
                    )}
                    <span
                      className={
                        step.done ? 'text-foreground/90' : 'text-muted-foreground'
                      }
                    >
                      {step.label}
                    </span>
                  </div>
                ))}
              </div>
              <div className="mt-4 h-1.5 w-full overflow-hidden rounded-full bg-muted">
                <div className="h-full w-[82%] rounded-full bg-brand" />
              </div>
            </div>
            <Step
              number="02"
              title="Let SnapNotes read it"
              description="Text, equations, and diagram labels are extracted and rebuilt as structured notes, then filed under the right course automatically."
            />
          </li>

          {/* Step 3 */}
          <li className="flex flex-col gap-5">
            <div className="rounded-2xl border border-border bg-background p-4 shadow-panel">
              <p className="text-[11px] font-medium tracking-wide text-muted-foreground uppercase">
                Quiz · question 3 of 10
              </p>
              <p className="mt-3 text-[13px] font-medium leading-relaxed">
                Where does the citric acid cycle occur in eukaryotic cells?
              </p>
              <div className="mt-3 flex flex-col gap-2">
                {options.map((option) => (
                  <div
                    key={option.label}
                    className={
                      option.correct
                        ? 'flex items-center gap-2 rounded-lg border border-brand bg-brand-subtle px-2.5 py-2 text-[12px] font-medium'
                        : 'flex items-center gap-2 rounded-lg border border-border px-2.5 py-2 text-[12px] text-muted-foreground'
                    }
                  >
                    <span
                      className={
                        option.correct
                          ? 'flex size-4 shrink-0 items-center justify-center rounded-full bg-brand text-brand-foreground'
                          : 'size-4 shrink-0 rounded-full border border-border'
                      }
                    >
                      {option.correct ? (
                        <Check className="size-2.5" aria-hidden="true" />
                      ) : null}
                    </span>
                    {option.label}
                  </div>
                ))}
              </div>
              <p className="mt-3 text-[11px] leading-relaxed text-muted-foreground">
                From your notes, page 2 · line 11
              </p>
            </div>
            <Step
              number="03"
              title="Study, then prove it"
              description="Review the summary, drill the flashcards, and take a quiz built from the same lecture. Weak topics come back around until they stick."
            />
          </li>
        </ol>
      </div>
    </section>
  )
}

function Step({
  number,
  title,
  description,
}: {
  number: string
  title: string
  description: string
}) {
  return (
    <div className="flex flex-col gap-2">
      <div className="flex items-center gap-2.5">
        <span className="font-mono text-[11px] text-muted-foreground">
          {number}
        </span>
        <h3 className="text-base font-semibold">{title}</h3>
      </div>
      <p className="text-[13px] leading-relaxed text-muted-foreground">
        {description}
      </p>
    </div>
  )
}
