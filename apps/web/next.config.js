/** @type {import('next').NextConfig} */
const nextConfig = {
  // Enable experimental features for better performance
  experimental: {
    // App Router is now stable in Next.js 14
    serverComponentsExternalPackages: ['@google-cloud/documentai'],
  },

  // Transpile workspace packages
  transpilePackages: ['@legalease/types', '@legalease/utils', '@legalease/config'],

  // Webpack configuration to handle server-side only modules
  webpack: (config, { isServer }) => {
    if (!isServer) {
      // For client-side, exclude Node.js modules but keep Google Cloud as external
      config.resolve.fallback = {
        ...config.resolve.fallback,
        'child_process': false,
        'fs': false,
        'net': false,
        'tls': false,
        'stream': false,
        'http': false,
        'https': false,
        'zlib': false,
        'querystring': false,
        'path': false,
        'os': false,
      };
    }
    
    // Handle node: protocol imports
    config.resolve.alias = {
      ...config.resolve.alias,
      'node:events': 'events',
      'node:util': 'util',
      'node:process': 'process/browser',
      'node:stream': 'stream-browserify',
    };
    
    return config;
  },

  // Image optimization
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'firebasestorage.googleapis.com',
        pathname: '/v0/b/*/o/**'
      },
      {
        protocol: 'https',
        hostname: 'lh3.googleusercontent.com',
        pathname: '/**'
      }
    ],
    formats: ['image/webp', 'image/avif']
  },

  // Security headers
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          {
            key: 'X-Frame-Options',
            value: 'DENY'
          },
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff'
          },
          {
            key: 'Referrer-Policy',
            value: 'origin-when-cross-origin'
          },
          {
            key: 'Permissions-Policy',
            value: 'camera=(), microphone=(), geolocation=()'
          }
        ]
      }
    ];
  },

  // Redirects for SEO
  async redirects() {
    return [
      {
        source: '/home',
        destination: '/',
        permanent: true
      },
      {
        source: '/dashboard/documents',
        destination: '/dashboard',
        permanent: false
      }
    ];
  },

  // Rewrites for API routes (optional)
  async rewrites() {
    return [
      {
        source: '/api/v1/:path*',
        destination: 'https://us-central1-legalease-ai.cloudfunctions.net/api/:path*'
      }
    ];
  },

  // Environment variables
  env: {
    CUSTOM_KEY: 'legalease-ai-web'
  },

  // Enable PWA features
  swcMinify: true,
  
  // Compiler options
  compiler: {
    removeConsole: process.env.NODE_ENV === 'production'
  },

  // TypeScript configuration
  typescript: {
    ignoreBuildErrors: false
  },

  // ESLint configuration
  eslint: {
    ignoreDuringBuilds: false
  },

  // Static optimization
  trailingSlash: false,
  
  // Internationalization
  i18n: {
    locales: [
      'en', 'es', 'fr', 'de', 'it', 'pt', 'ru', 'ja', 'ko', 'zh-CN',
      'zh-TW', 'ar', 'hi', 'nl', 'sv', 'da', 'no', 'fi', 'pl', 'tr'
    ],
    defaultLocale: 'en',
    localeDetection: false,
  }
};

module.exports = nextConfig;