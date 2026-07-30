import { ArrowRight } from 'lucide-react'

import { Button } from '@/components/ui/button'

export function Cta() {
  return (
    <section className="mx-auto w-full max-w-6xl px-6 py-20 sm:py-28">
      <div className="relative overflow-hidden rounded-3xl border border-border bg-background px-6 py-14 text-center shadow-panel sm:px-12 sm:py-20">
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 grid-bg [mask-image:radial-gradient(90%_70%_at_50%_0%,black,transparent_75%)] opacity-50"
        />
        <div className="relative mx-auto flex max-w-xl flex-col items-center">
          <h2 className="text-3xl font-semibold tracking-[-0.03em] text-balance sm:text-4xl">
            Your next lecture could be studied by tonight
          </h2>
          <p className="mt-4 text-base leading-relaxed text-pretty text-muted-foreground">
            Twenty free pages a month, no card required. Most students have their
            first study set before the walk back to the dorm.
          </p>
          <div className="mt-8 flex w-full flex-col gap-3 sm:w-auto sm:flex-row">
            <Button
              nativeButton={false}
              render={<a href="#pricing" />}
              className="h-11 rounded-xl px-5 text-[0.95rem]"
            >
              Get started free
              <ArrowRight data-icon="inline-end" />
            </Button>
            <Button
              variant="outline"
              nativeButton={false}
              render={<a href="#features" />}
              className="h-11 rounded-xl px-5 text-[0.95rem]"
            >
              Explore features
            </Button>
          </div>
        </div>
      </div>
    </section>
  )
}
