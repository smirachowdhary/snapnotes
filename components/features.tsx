import {
  ArrowRight,
  BookOpen,
  Layers,
  ListChecks,
  Search,
  Sparkles,
  Users,
} from 'lucide-react'

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { SectionHeading } from '@/components/section-heading'

const smallFeatures = [
  {
    icon: Sparkles,
    title: 'Summaries that keep the detail',
    description:
      'Every note gets a one-paragraph overview and a key-points list, with formulas and definitions preserved exactly as written.',
  },
  {
    icon: ListChecks,
    title: 'Practice quizzes',
    description:
      'Multiple choice and short answer questions generated from your own material, with explanations that cite the source line.',
  },
  {
    icon: BookOpen,
    title: 'Exam study guides',
    description:
      'Merge a whole unit into a single guide, ordered by topic and weighted toward the concepts you keep missing.',
  },
  {
    icon: Users,
    title: 'Shared course spaces',
    description:
      'Invite classmates to a course, pool everyone’s photos, and study from one canonical set of notes.',
  },
]

const searchResults = [
  { title: 'Krebs cycle intermediates', course: 'BIO 202 · Lec 14', match: 'p. 2' },
  { title: 'ATP yield per glucose', course: 'BIO 202 · Lec 14', match: 'p. 3' },
  { title: 'Substrate-level phosphorylation', course: 'BIO 202 · Lec 12', match: 'p. 1' },
]

export function Features() {
  return (
    <section
      id="features"
      className="mx-auto w-full max-w-6xl scroll-mt-20 px-6 py-20 sm:py-28"
    >
      <SectionHeading
        eyebrow="Features"
        title="One photo becomes an entire study set"
        description="SnapNotes reads the page once and produces every format you actually study from — nothing to retype, nothing to reformat."
      />

      <div className="mt-14 grid gap-4 md:grid-cols-2">
        {/* Search feature */}
        <Card className="overflow-hidden">
          <CardHeader>
            <Badge variant="secondary" className="w-fit gap-1.5 rounded-full">
              <Search className="size-3" aria-hidden="true" />
              Full-text search
            </Badge>
            <CardTitle className="mt-3 text-lg">
              Search handwriting like it were typed
            </CardTitle>
            <CardDescription className="leading-relaxed">
              Every word from every photo is indexed the moment it uploads —
              including sloppy handwriting, marginalia, and whiteboard diagrams.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="rounded-xl border border-border bg-muted/30 p-3">
              <div className="flex items-center gap-2 rounded-lg border border-border bg-background px-2.5 py-2 text-[13px]">
                <Search className="size-3.5 text-muted-foreground" aria-hidden="true" />
                <span>citric acid cycle</span>
                <span className="ml-auto font-mono text-[10px] text-muted-foreground">
                  3 results
                </span>
              </div>
              <div className="mt-2 flex flex-col gap-1.5">
                {searchResults.map((result) => (
                  <div
                    key={result.title}
                    className="flex items-center gap-3 rounded-lg bg-background px-2.5 py-2 text-[12px] shadow-xs"
                  >
                    <span className="min-w-0 truncate font-medium">
                      {result.title}
                    </span>
                    <span className="ml-auto shrink-0 text-[11px] text-muted-foreground">
                      {result.course}
                    </span>
                    <span className="shrink-0 font-mono text-[10px] text-muted-foreground/70">
                      {result.match}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Flashcards feature */}
        <Card className="overflow-hidden">
          <CardHeader>
            <Badge variant="secondary" className="w-fit gap-1.5 rounded-full">
              <Layers className="size-3" aria-hidden="true" />
              Spaced repetition
            </Badge>
            <CardTitle className="mt-3 text-lg">
              Flashcards written from your own lecture
            </CardTitle>
            <CardDescription className="leading-relaxed">
              Cards are drafted from the concepts your professor actually
              emphasized, then scheduled so you review each one right before you
              would forget it.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="rounded-xl border border-border bg-muted/30 p-3">
              <div className="rounded-lg border border-border bg-background p-3 shadow-xs">
                <p className="text-[10px] font-medium tracking-wide text-muted-foreground uppercase">
                  Card 7 of 12
                </p>
                <p className="mt-2 text-[13px] font-medium leading-relaxed">
                  Which stage of respiration requires oxygen directly?
                </p>
                <p className="mt-2.5 rounded-lg bg-brand-subtle px-2.5 py-2 text-[12px] leading-relaxed text-foreground/80">
                  Oxidative phosphorylation — O₂ is the final electron acceptor
                  in the electron transport chain.
                </p>
              </div>
              <div className="mt-2 grid grid-cols-3 gap-1.5">
                {['Again', 'Good', 'Easy'].map((label) => (
                  <div
                    key={label}
                    className="rounded-lg bg-background py-1.5 text-center text-[11px] font-medium shadow-xs"
                  >
                    {label}
                  </div>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>

        {smallFeatures.map((feature) => (
          <Card key={feature.title} className="md:col-span-1">
            <CardHeader>
              <span className="flex size-9 items-center justify-center rounded-xl border border-border bg-muted/50">
                <feature.icon className="size-4" aria-hidden="true" />
              </span>
              <CardTitle className="mt-3 text-base">{feature.title}</CardTitle>
              <CardDescription className="leading-relaxed">
                {feature.description}
              </CardDescription>
            </CardHeader>
          </Card>
        ))}
      </div>

      <a
        href="#pricing"
        className="mt-8 inline-flex items-center gap-1.5 text-sm font-medium text-brand transition-opacity hover:opacity-70"
      >
        See everything included in each plan
        <ArrowRight className="size-3.5" aria-hidden="true" />
      </a>
    </section>
  )
}
