'use client'

import Link from 'next/link'
import { Check } from 'lucide-react'

import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { SectionHeading } from '@/components/section-heading'
import { cn } from '@/lib/utils'

const tiers = [
  {
    name: 'Free',
    price: '$0',
    subtitle: 'forever',
    description: 'Enough to get through a light week of lectures.',
    cta: 'Create an account',
    variant: 'outline' as const,
    href: '/signup',
    features: [
      '20 pages per month',
      'Searchable notes',
      'Up to 3 courses',
      'Flashcards for every note',
    ],
  },
  {
    name: 'Student Pro',
    price: '$9.90',
    subtitle: '/ month',
    description: 'For a full course load and finals week.',
    cta: 'Start 14-day trial',
    variant: 'default' as const,
    href: '#',
    featured: true,
    features: [
      'Unlimited pages and courses',
      'Practice quizzes and exam study guides',
      'Spaced repetition scheduling',
      'Handwriting and diagram recognition',
      'Export to PDF, Markdown, and Anki',
      'Priority processing',
    ],
  },
  {
    name: 'Campus',
    price: 'Custom',
    subtitle: '',
    description: 'For schools, clubs, and departments.',
    cta: 'Talk to us',
    variant: 'outline' as const,
    href: '#',
    features: [
      'Everything in Student Pro',
      'Shared course spaces',
      'Admin controls',
      'SSO integration',
      'Dedicated onboarding',
    ],
  },
]

export function Pricing() {
  return (
    <section
      id="pricing"
      className="mx-auto w-full max-w-6xl scroll-mt-20 px-6 py-20 sm:py-28"
    >
      <SectionHeading
        eyebrow="Pricing"
        title="Priced like a textbook you actually use"
        description="Start free and upgrade when your semester gets heavy. Cancel any time."
        align="center"
      />

      <div className="mt-12 grid gap-4 lg:grid-cols-3">
        {tiers.map((tier) => (
          <Card
            key={tier.name}
            className={cn(
              'h-full',
              tier.featured && 'border-foreground/15 shadow-panel'
            )}
          >
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>{tier.name}</CardTitle>

                {tier.featured && (
                  <Badge className="rounded-full">
                    Most popular
                  </Badge>
                )}
              </div>

              <div className="mt-4 flex items-baseline gap-2">
                <span className="text-4xl font-semibold tracking-tight">
                  {tier.price}
                </span>

                {tier.subtitle && (
                  <span className="text-sm text-muted-foreground">
                    {tier.subtitle}
                  </span>
                )}
              </div>

              <CardDescription className="mt-2">
                {tier.description}
              </CardDescription>
            </CardHeader>

            <CardContent>
              <ul className="space-y-3">
                {tier.features.map((feature) => (
                  <li key={feature} className="flex gap-2 text-sm">
                    <Check className="mt-0.5 h-4 w-4 shrink-0 text-brand" />
                    <span>{feature}</span>
                  </li>
                ))}
              </ul>
            </CardContent>

            <CardFooter className="mt-auto">
              <Link href={tier.href} className="w-full">
                <Button
                  variant={tier.variant}
                  className="w-full rounded-xl"
                >
                  {tier.cta}
                </Button>
              </Link>
            </CardFooter>
          </Card>
        ))}
      </div>

      <p className="mt-8 text-center text-xs text-muted-foreground">
        Verified students get 40% off Student Pro with a .edu email.
      </p>
    </section>
  )
}