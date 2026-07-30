import { cn } from '@/lib/utils'

export function SectionHeading({
  eyebrow,
  title,
  description,
  align = 'left',
}: {
  eyebrow: string
  title: string
  description?: string
  align?: 'left' | 'center'
}) {
  return (
    <div
      className={cn(
        'flex max-w-2xl flex-col',
        align === 'center' && 'mx-auto items-center text-center',
      )}
    >
      <p className="text-xs font-medium tracking-[0.08em] text-brand uppercase">
        {eyebrow}
      </p>
      <h2 className="mt-3 text-3xl font-semibold tracking-[-0.03em] text-balance sm:text-4xl">
        {title}
      </h2>
      {description ? (
        <p className="mt-4 text-base leading-relaxed text-pretty text-muted-foreground">
          {description}
        </p>
      ) : null}
    </div>
  )
}
