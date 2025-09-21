import type { Metadata } from 'next';
import { Inter, Fira_Code } from 'next/font/google';
import { Providers } from '@/providers/Providers';
import { Toaster } from '@/components/ui/toaster';
import { cn } from '@/lib/utils';
import '@/styles/globals.css';

const inter = Inter({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-inter',
});

const firaCode = Fira_Code({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-fira-code',
});

export const metadata: Metadata = {
  title: {
    default: 'LegalEase AI - Simplify Legal Documents with AI',
    template: '%s | LegalEase AI',
  },
  description: 'Transform complex legal documents into clear, understandable language with our AI-powered platform. Get instant analysis, risk assessment, and plain-English summaries.',
  keywords: [
    'legal AI',
    'document analysis',
    'contract review',
    'legal tech',
    'document simplification',
    'legal assistant',
    'contract analysis',
    'legal document processing',
  ],
  authors: [
    {
      name: 'LegalEase AI Team',
      url: 'https://legalease-ai.com',
    },
  ],
  creator: 'LegalEase AI',
  publisher: 'LegalEase AI',
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  metadataBase: new URL('https://legalease-ai.com'),
  alternates: {
    canonical: '/',
    languages: {
      'en-US': '/en',
      'es-ES': '/es',
      'fr-FR': '/fr',
      'de-DE': '/de',
      'it-IT': '/it',
      'pt-PT': '/pt',
      'ru-RU': '/ru',
      'zh-CN': '/zh',
      'ja-JP': '/ja',
      'ko-KR': '/ko',
      'ar-SA': '/ar',
      'hi-IN': '/hi',
      'th-TH': '/th',
      'vi-VN': '/vi',
      'tr-TR': '/tr',
      'pl-PL': '/pl',
      'nl-NL': '/nl',
      'sv-SE': '/sv',
      'da-DK': '/da',
      'no-NO': '/no',
    },
  },
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: '/',
    siteName: 'LegalEase AI',
    title: 'LegalEase AI - Simplify Legal Documents with AI',
    description: 'Transform complex legal documents into clear, understandable language with our AI-powered platform.',
    images: [
      {
        url: '/og-image.jpg',
        width: 1200,
        height: 630,
        alt: 'LegalEase AI - Simplify Legal Documents',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    site: '@legalease_ai',
    creator: '@legalease_ai',
    title: 'LegalEase AI - Simplify Legal Documents with AI',
    description: 'Transform complex legal documents into clear, understandable language with our AI-powered platform.',
    images: ['/twitter-image.jpg'],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  manifest: '/manifest.json',
  icons: {
    icon: '/favicon.ico',
    shortcut: '/favicon-16x16.png',
    apple: '/apple-touch-icon.png',
  },
  verification: {
    google: 'your-google-verification-code',
    yandex: 'your-yandex-verification-code',
    yahoo: 'your-yahoo-verification-code',
  },
  category: 'Legal Technology',
};

interface RootLayoutProps {
  children: React.ReactNode;
  params: {
    locale: string;
  };
}

export default function RootLayout({
  children,
  params,
}: RootLayoutProps) {
  return (
    <html 
      lang={params.locale || 'en'} 
      className={cn(
        inter.variable,
        firaCode.variable,
        'antialiased'
      )}
      suppressHydrationWarning
    >
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta name="theme-color" content="#3b82f6" />
        <meta name="color-scheme" content="light dark" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="default" />
        <meta name="apple-mobile-web-app-title" content="LegalEase AI" />
        <meta name="format-detection" content="telephone=no" />
        <meta name="mobile-web-app-capable" content="yes" />
        <meta name="msapplication-config" content="/browserconfig.xml" />
        <meta name="msapplication-TileColor" content="#3b82f6" />
        <meta name="msapplication-tap-highlight" content="no" />
        
        {/* Preconnect to external domains */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link rel="preconnect" href="https://firebaseapp.com" />
        <link rel="preconnect" href="https://googleapis.com" />
        
        {/* DNS prefetch for better performance */}
        <link rel="dns-prefetch" href="//fonts.googleapis.com" />
        <link rel="dns-prefetch" href="//fonts.gstatic.com" />
        <link rel="dns-prefetch" href="//firebaseapp.com" />
        <link rel="dns-prefetch" href="//googleapis.com" />
        
        {/* Favicon and app icons */}
        <link rel="icon" href="/favicon.ico" sizes="any" />
        <link rel="icon" href="/icon.svg" type="image/svg+xml" />
        <link rel="apple-touch-icon" href="/apple-touch-icon.png" />
        <link rel="manifest" href="/manifest.json" />
      </head>
      <body className={cn(
        'min-h-screen bg-background font-sans antialiased',
        'selection:bg-primary/20 selection:text-primary-foreground'
      )}>
        <Providers>
          <div className="relative flex min-h-screen flex-col">
            {/* Skip to main content for accessibility */}
            <a 
              href="#main-content" 
              className="sr-only focus:not-sr-only focus:absolute focus:top-2 focus:left-2 z-50 bg-primary text-primary-foreground px-4 py-2 rounded-md"
            >
              Skip to main content
            </a>
            
            {/* Global loading indicator */}
            <div id="loading-indicator" className="hidden">
              <div className="fixed inset-0 z-50 bg-background/80 backdrop-blur-sm">
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
                  <div className="loading-spinner w-8 h-8 border-primary" />
                </div>
              </div>
            </div>
            
            {/* Main content */}
            <main id="main-content" className="flex-1">
              {children}
            </main>
            
            {/* Toast notifications */}
            <Toaster />
            
            {/* Service worker registration script */}
            <script
              dangerouslySetInnerHTML={{
                __html: `
                  if ('serviceWorker' in navigator) {
                    navigator.serviceWorker.register('/sw.js')
                      .then(function(registration) {
                        console.log('SW registered: ', registration);
                      })
                      .catch(function(registrationError) {
                        console.log('SW registration failed: ', registrationError);
                      });
                  }
                `,
              }}
            />
          </div>
        </Providers>
      </body>
    </html>
  );
}