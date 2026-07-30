import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion'
import { SectionHeading } from '@/components/section-heading'

const faqs = [
  {
    question: 'Can it really read my handwriting?',
    answer:
      'Yes — including cursive, shorthand, and notes written at speed. SnapNotes reads the whole page in context, so it can recover words that are individually unclear. If a word is genuinely ambiguous it is flagged inline so you can correct it in one tap.',
  },
  {
    question: 'What can I photograph?',
    answer:
      'Notebook pages, whiteboards and chalkboards, projected slides, printed handouts, and textbook pages. You can also upload existing PDFs and screenshots, and SnapNotes will treat them the same way.',
  },
  {
    question: 'How accurate are the summaries and quizzes?',
    answer:
      'Every summary line, flashcard, and quiz question links back to the exact page and line it came from, so you can verify anything in a second. SnapNotes never invents outside material — it only works from what is on your pages.',
  },
  {
    question: 'Does it handle equations and diagrams?',
    answer:
      'Formulas are preserved as proper math rather than flattened text, and diagrams are kept as images with their labels extracted and indexed so they turn up in search.',
  },
  {
    question: 'Is my course material private?',
    answer:
      'Your notes are yours. Uploads are encrypted in transit and at rest, are never used to train models, and are only visible to you unless you explicitly share a course space with classmates. You can delete any note or your entire account at any time.',
  },
  {
    question: 'Can I get my notes out of SnapNotes?',
    answer:
      'Always. Export any note or full course to PDF, Markdown, or an Anki deck. There is no lock-in, and exports stay available even if you downgrade to the free plan.',
  },
  {
    question: 'Does this count as academic dishonesty?',
    answer:
      'SnapNotes organizes material you were already given in class — it does not write assignments or complete assessments for you. If your instructor restricts note-sharing, keep your course space private.',
  },
]

export function Faq() {
  return (
    <section
      id="faq"
      className="scroll-mt-20 border-t border-border bg-muted/30"
    >
      <div className="mx-auto grid w-full max-w-6xl gap-12 px-6 py-20 sm:py-28 lg:grid-cols-[minmax(0,22rem)_1fr] lg:gap-16">
        <SectionHeading
          eyebrow="FAQ"
          title="Questions students ask first"
          description="Still unsure about something? Email support@snapnotes.app and a human will answer."
        />

        <Accordion
          multiple={false}
          defaultValue={[0]}
          className="border-t border-border"
        >
          {faqs.map((faq, index) => (
            <AccordionItem key={faq.question} value={index} className="border-b">
              <AccordionTrigger className="py-5 text-[0.95rem] font-medium no-underline hover:no-underline">
                {faq.question}
              </AccordionTrigger>
              <AccordionContent className="pr-8 pb-5 text-[13px] leading-relaxed text-muted-foreground">
                {faq.answer}
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </div>
    </section>
  )
}
