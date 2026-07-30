import { SiteHeader } from '@/components/site-header'
import { Hero } from '@/components/hero'
import { Features } from '@/components/features'
import { HowItWorks } from '@/components/how-it-works'
import { Pricing } from '@/components/pricing'
import { Faq } from '@/components/faq'
import { Cta } from '@/components/cta'
import { SiteFooter } from '@/components/site-footer'

export default function Page() {
  return (
    <div className="min-h-svh">
      <SiteHeader />
      <main>
        <Hero />
        <Features />
        <HowItWorks />
        <Pricing />
        <Faq />
        <Cta />
      </main>
      <SiteFooter />
    </div>
  )
}
