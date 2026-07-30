import { ScanText } from 'lucide-react'

import { cn } from '@/lib/utils'

export function Logo({ className }: { className?: string }) {
  return (
    <span className={cn('flex items-center gap-2', className)}>
      <span className="flex size-7 items-center justify-center rounded-[9px] bg-foreground text-background">
        <ScanText className="size-4" aria-hidden="true" />
      </span>
      <span className="text-[0.975rem] font-semibold tracking-[-0.02em]">
        SnapNotes
      </span>
    </span>
  )
}
