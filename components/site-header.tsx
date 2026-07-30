'use client'

import { useEffect, useState } from 'react'
import { Menu, X } from 'lucide-react'

import { Button } from '@/components/ui/button'
import { Logo } from '@/components/logo'
import { cn } from '@/lib/utils'

const links = [
  { label: 'Features', href: '#features' },
  { label: 'How it works', href: '#how-it-works' },
  { label: 'Pricing', href: '#pricing' },
  { label: 'FAQ', href: '#faq' },
]

export function SiteHeader() {
  const [open, setOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  return (
    <header
      className={cn(
        'sticky top-0 z-50 w-full border-b border-transparent bg-background/80 backdrop-blur-xl transition-colors duration-200',
        scrolled && 'border-border',
      )}
    >
      <div className="mx-auto flex h-16 w-full max-w-6xl items-center justify-between px-6">
        <a
          href="#"
          className="rounded-md outline-none focus-visible:ring-3 focus-visible:ring-ring/50"
        >
          <Logo />
          <span className="sr-only">SnapNotes home</span>
        </a>

        <nav aria-label="Main" className="hidden md:block">
          <ul className="flex items-center gap-1">
            {links.map((link) => (
              <li key={link.href}>
                <a
                  href={link.href}
                  className="rounded-lg px-3 py-2 text-sm text-muted-foreground transition-colors hover:text-foreground focus-visible:ring-3 focus-visible:ring-ring/50 focus-visible:outline-none"
                >
                  {link.label}
                </a>
              </li>
            ))}
          </ul>
        </nav>

        <div className="hidden items-center gap-2 md:flex">
          <Button
            variant="ghost"
            nativeButton={false}
            render={<a href="#pricing" />}
            className="h-9 px-3 text-muted-foreground hover:text-foreground"
          >
            Log in
          </Button>
          <Button
            nativeButton={false}
            render={<a href="#pricing" />}
            className="h-9 rounded-xl px-4"
          >
            Get started
          </Button>
        </div>

        <Button
          variant="ghost"
          size="icon-lg"
          aria-expanded={open}
          aria-controls="mobile-nav"
          onClick={() => setOpen((v) => !v)}
          className="md:hidden"
        >
          {open ? <X /> : <Menu />}
          <span className="sr-only">Toggle navigation</span>
        </Button>
      </div>

      {open ? (
        <div id="mobile-nav" className="border-t border-border md:hidden">
          <nav aria-label="Mobile" className="mx-auto max-w-6xl px-6 py-4">
            <ul className="flex flex-col gap-1">
              {links.map((link) => (
                <li key={link.href}>
                  <a
                    href={link.href}
                    onClick={() => setOpen(false)}
                    className="block rounded-lg px-2 py-2.5 text-sm text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
                  >
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
            <div className="mt-4 flex flex-col gap-2">
              <Button
                variant="outline"
                nativeButton={false}
                render={<a href="#pricing" />}
                className="h-10 rounded-xl"
              >
                Log in
              </Button>
              <Button
                nativeButton={false}
                render={<a href="#pricing" />}
                className="h-10 rounded-xl"
              >
                Get started
              </Button>
            </div>
          </nav>
        </div>
      ) : null}
    </header>
  )
}
