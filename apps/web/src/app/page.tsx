import { Suspense } from 'react';
import { Hero } from '@/components/sections/hero';
import { Features } from '@/components/sections/features';
import { HowItWorks } from '@/components/sections/how-it-works';
import { Testimonials } from '@/components/sections/testimonials';
import { FAQ } from '@/components/sections/faq';
import { CTA } from '@/components/sections/cta';
import { Navigation } from '@/components/navigation';
import { Footer } from '@/components/footer';
import { LoadingSkeleton } from '@/components/ui/loading-skeleton';

export default function HomePage() {
  return (
    <>
      {/* Navigation */}
      <Navigation />
      
      {/* Main content */}
      <main className="flex-1">
        {/* Hero Section */}
        <Suspense fallback={<LoadingSkeleton className="h-screen" />}>
          <Hero />
        </Suspense>
        
        {/* Features Section */}
        <Suspense fallback={<LoadingSkeleton className="h-96" />}>
          <Features />
        </Suspense>
        
        {/* How It Works Section */}
        <Suspense fallback={<LoadingSkeleton className="h-96" />}>
          <HowItWorks />
        </Suspense>
        
        {/* Testimonials Section */}
        <Suspense fallback={<LoadingSkeleton className="h-96" />}>
          <Testimonials />
        </Suspense>
        
        {/* FAQ Section */}
        <Suspense fallback={<LoadingSkeleton className="h-96" />}>
          <FAQ />
        </Suspense>
        
        {/* CTA Section */}
        <Suspense fallback={<LoadingSkeleton className="h-64" />}>
          <CTA />
        </Suspense>
      </main>
      
      {/* Footer */}
      <Footer />
    </>
  );
}