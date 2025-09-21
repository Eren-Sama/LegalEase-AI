'use client';

export function Features() {
  return (
    <section className="py-20 bg-white dark:bg-gray-900">
      <div className="container mx-auto px-4">
        <h2 className="text-4xl font-bold text-center mb-16">Features</h2>
        <div className="grid md:grid-cols-3 gap-8">
          <div className="card text-center p-8">
            <h3 className="text-2xl font-semibold mb-4">AI Analysis</h3>
            <p>Advanced AI-powered document analysis and risk assessment.</p>
          </div>
          <div className="card text-center p-8">
            <h3 className="text-2xl font-semibold mb-4">20+ Languages</h3>
            <p>Support for over 20 languages with accurate translation.</p>
          </div>
          <div className="card text-center p-8">
            <h3 className="text-2xl font-semibold mb-4">Secure & Private</h3>
            <p>Enterprise-grade security with end-to-end encryption.</p>
          </div>
        </div>
      </div>
    </section>
  );
}

export function HowItWorks() {
  return (
    <section className="py-20 bg-gray-50 dark:bg-gray-800">
      <div className="container mx-auto px-4">
        <h2 className="text-4xl font-bold text-center mb-16">How It Works</h2>
      </div>
    </section>
  );
}

export function Testimonials() {
  return (
    <section className="py-20 bg-white dark:bg-gray-900">
      <div className="container mx-auto px-4">
        <h2 className="text-4xl font-bold text-center mb-16">Testimonials</h2>
      </div>
    </section>
  );
}

export function Pricing() {
  return (
    <section className="py-20 bg-gray-50 dark:bg-gray-800">
      <div className="container mx-auto px-4">
        <h2 className="text-4xl font-bold text-center mb-16">Pricing</h2>
      </div>
    </section>
  );
}

export function FAQ() {
  return (
    <section className="py-20 bg-white dark:bg-gray-900">
      <div className="container mx-auto px-4">
        <h2 className="text-4xl font-bold text-center mb-16">FAQ</h2>
      </div>
    </section>
  );
}

export function CTA() {
  return (
    <section className="py-20 bg-primary text-primary-foreground">
      <div className="container mx-auto px-4 text-center">
        <h2 className="text-4xl font-bold mb-8">Ready to Get Started?</h2>
        <button className="btn bg-white text-primary hover:bg-gray-100 px-8 py-4">
          Start Free Trial
        </button>
      </div>
    </section>
  );
}