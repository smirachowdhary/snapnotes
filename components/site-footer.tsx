import { Logo } from '@/components/logo'

const groups = [
  {
    title: 'Product',
    links: ['Features', 'How it works', 'Pricing', 'Changelog', 'Download apps'],
  },
  {
    title: 'Study',
    links: ['Flashcards', 'Practice quizzes', 'Study guides', 'Course spaces'],
  },
  {
    title: 'Company',
    links: ['About', 'Campus program', 'Careers', 'Contact'],
  },
  {
    title: 'Legal',
    links: ['Privacy', 'Terms', 'Security', 'Academic integrity'],
  },
]

export function SiteFooter() {
  return (
    <footer className="border-t border-border">
      <div className="mx-auto w-full max-w-6xl px-6 py-14">
        <div className="grid gap-10 md:grid-cols-[minmax(0,18rem)_1fr]">
          <div className="flex flex-col gap-4">
            <Logo />
            <p className="max-w-xs text-[13px] leading-relaxed text-muted-foreground">
              SnapNotes turns lecture photos into searchable notes, summaries,
              flashcards, and quizzes — built for students who take notes by
              hand.
            </p>
          </div>

          <div className="grid grid-cols-2 gap-8 sm:grid-cols-4">
            {groups.map((group) => (
              <nav key={group.title} aria-label={group.title}>
                <p className="text-[13px] font-medium">{group.title}</p>
                <ul className="mt-3 flex flex-col gap-2.5">
                  {group.links.map((link) => (
                    <li key={link}>
                      <a
                        href="#"
                        className="text-[13px] text-muted-foreground transition-colors hover:text-foreground"
                      >
                        {link}
                      </a>
                    </li>
                  ))}
                </ul>
              </nav>
            ))}
          </div>
        </div>

        <div className="mt-12 flex flex-col gap-3 border-t border-border pt-6 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-xs text-muted-foreground">
            © {new Date().getFullYear()} SnapNotes Labs, Inc. All rights
            reserved.
          </p>
          <p className="text-xs text-muted-foreground">
            Made for students in Boston, MA
          </p>
        </div>
      </div>
    </footer>
  )
}
