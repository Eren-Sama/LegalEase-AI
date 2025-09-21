# LegalEase AI - Legal Document Analysis Platform 🏛️

> **AI-powered legal document analysis platform built with Next.js 14.2, Firebase, and Gemini AI. Features document analysis, chatbot assistance, PDF reports, and comprehensive legal insights.**

[![Next.js](https://img.shields.io/badge/Next.js-14.2-black?logo=next.js)](https://nextjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue?logo=typescript)](https://www.typescriptlang.org/)
[![Firebase](https://img.shields.io/badge/Firebase-10.0-orange?logo=firebase)](https://firebase.google.com/)
[![Gemini AI](https://img.shields.io/badge/Gemini_AI-Latest-purple?logo=google)](https://ai.google.dev/)
[![License](https://img.shields.io/badge/License-MIT-green.svg)](LICENSE)

## 🎯 Live Demo & Repository

- **🌐 Repository:** https://github.com/Eren-Sama/LegalEase-AI
- **📱 Demo:** *Coming Soon - Deploy with one click!*

## 🚀 Quick Start

### Prerequisites
- Node.js 18+ 
- pnpm (recommended) or npm
- Firebase account
- Google Cloud account (for Gemini AI)

### 1. Clone & Install
```bash
git clone https://github.com/Eren-Sama/LegalEase-AI.git
cd LegalEase-AI
pnpm install
```

### 2. Environment Setup
```bash
# Copy environment template
cp .env.example .env.local
cp apps/web/.env.local.example apps/web/.env.local

# Edit with your credentials
nano .env.local
nano apps/web/.env.local
```

### 3. Firebase Configuration
1. Create Firebase project at https://console.firebase.google.com
2. Enable Authentication, Firestore, Storage
3. Add your config to `.env.local`

### 4. Get Gemini API Key
1. Visit https://aistudio.google.com/app/apikey
2. Create API key
3. Add to `GEMINI_API_KEY` in `.env.local`

### 5. Run Development Server
```bash
cd apps/web
pnpm dev
```

Visit http://localhost:3000 🎉

## 🚀 Features

### Core Features
- ✅ **AI-Powered Document Analysis**: Advanced legal document processing with risk assessment
- ✅ **20+ Language Support**: Multi-language document processing and translation
- ✅ **Interactive Q&A**: Chat-based interface for document queries
- ✅ **Real-time Collaboration**: Team-based document review and sharing
- ✅ **Premium Dashboard**: Comprehensive analytics and document management
- ✅ **Secure Authentication**: Firebase Auth with Google SSO
- ✅ **Document Processing**: Support for PDF, DOC, DOCX, and more
- ✅ **Risk Assessment**: AI-powered legal risk evaluation
- ✅ **Export & Sharing**: Multiple export formats and secure sharing

### Technical Features
- ✅ **Modern Tech Stack**: Next.js 14 with App Router, TypeScript, Tailwind CSS
- ✅ **Serverless Backend**: Firebase Functions with Express API
- ✅ **Real-time Database**: Firestore with security rules
- ✅ **File Storage**: Firebase Storage with CDN
- ✅ **AI Integration**: Google Cloud Vertex AI, Document AI, Translation API
- ✅ **State Management**: Zustand + TanStack Query
- ✅ **Form Handling**: React Hook Form + Zod validation
- ✅ **UI Components**: Custom design system with Radix UI
- ✅ **Animations**: Framer Motion for smooth interactions
- ✅ **Testing Suite**: Jest + Testing Library (configured)
- ✅ **Code Quality**: ESLint, Prettier, Husky pre-commit hooks

## 🛠️ Technology Stack

### Frontend
- **Framework**: Next.js 14 with App Router
- **Language**: TypeScript
- **Styling**: Tailwind CSS + Custom Design System
- **UI Components**: Radix UI + Custom Components
- **State Management**: Zustand + TanStack React Query
- **Forms**: React Hook Form + Zod
- **Animations**: Framer Motion
- **Icons**: Lucide React + React Icons
- **Charts**: Recharts
- **PDF Processing**: React-PDF + PDF-lib

### Backend
- **Runtime**: Firebase Functions (Node.js 20)
- **Database**: Firestore
- **Authentication**: Firebase Auth
- **Storage**: Firebase Storage
- **AI Services**: Google Cloud Vertex AI, Document AI, Translation API

### Development Tools
- **Package Manager**: PNPM (Monorepo)
- **Linting**: ESLint + Prettier
- **Testing**: Jest + Testing Library
- **Git Hooks**: Husky + lint-staged
- **Build Tools**: Next.js built-in + PostCSS
- **Development**: Hot reload, TypeScript checking

## 📁 Project Structure

```
legalease-ai/
├── apps/
│   ├── web/                     # Next.js frontend application
│   │   ├── src/
│   │   │   ├── app/            # Next.js 14 App Router
│   │   │   ├── components/     # React components
│   │   │   ├── contexts/       # React contexts
│   │   │   ├── lib/           # Utilities and configurations
│   │   │   ├── hooks/         # Custom React hooks
│   │   │   ├── store/         # Zustand stores
│   │   │   └── styles/        # Global styles
│   │   └── public/            # Static assets
│   └── functions/             # Firebase Functions backend
│       ├── src/
│       │   ├── api/          # API routes
│       │   ├── triggers/     # Firestore triggers
│       │   └── scheduled/    # Scheduled functions
│       └── package.json
├── packages/
│   ├── types/                # Shared TypeScript types
│   ├── utils/                # Shared utilities
│   └── config/               # Shared configuration
├── firebase.json             # Firebase configuration
├── firestore.rules          # Database security rules
├── storage.rules            # Storage security rules
└── package.json             # Root workspace configuration
```

## 🚀 Quick Start (Windows)

### Prerequisites
- **Node.js**: v20.x or higher
- **PNPM**: Latest version
- **Firebase CLI**: For deployment
- **Git**: For version control

### Step 1: Install Prerequisites

```powershell
# Install Node.js (if not installed)
# Download from https://nodejs.org/

# Install PNPM globally
npm install -g pnpm

# Install Firebase CLI globally
npm install -g firebase-tools
```

### Step 2: Clone and Setup

```powershell
# Clone the repository
git clone <repository-url>
cd legalease-ai

# Install all dependencies
pnpm install
```

### Step 3: Firebase Setup

1. **Create Firebase Project**:
   - Go to [Firebase Console](https://console.firebase.google.com/)
   - Create a new project
   - Enable Authentication, Firestore, Storage, and Functions

2. **Configure Environment Variables**:
   ```powershell
   # Copy environment template
   cp apps/web/.env.example apps/web/.env.local
   ```

3. **Update `.env.local`** with your Firebase configuration:
   ```env
   NEXT_PUBLIC_FIREBASE_API_KEY=your-api-key
   NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your-project.firebaseapp.com
   NEXT_PUBLIC_FIREBASE_PROJECT_ID=your-project-id
   NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your-project.appspot.com
   NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=123456789
   NEXT_PUBLIC_FIREBASE_APP_ID=1:123456789:web:abcdef123456
   ```

### Step 4: Google Cloud AI Setup

1. **Enable APIs** in Google Cloud Console:
   - Vertex AI API
   - Document AI API
   - Translation API
   - Text-to-Speech API

2. **Create Service Account**:
   - Download service account JSON
   - Set environment variable or configure Firebase Functions

### Step 5: Development Server

```powershell
# Start the development server
cd apps/web
pnpm dev
```

The application will be available at [http://localhost:3000](http://localhost:3000)

### Step 6: Deploy Firebase Functions

```powershell
# Deploy Functions (one-time setup)
firebase deploy --only functions

# Deploy Database Rules
firebase deploy --only firestore:rules
firebase deploy --only storage
```

## 🧪 Testing

```powershell
# Run all tests
pnpm test

# Run tests in watch mode
pnpm test:watch

# Run tests with coverage
pnpm test:coverage

# Run E2E tests (when configured)
pnpm test:e2e
```

## 🏗️ Building for Production

```powershell
# Build the application
pnpm build

# Preview production build
pnpm start
```

## 🚀 Deployment

### Frontend Deployment (Vercel/Netlify)
```powershell
# Build for deployment
pnpm build

# Deploy to Vercel
vercel --prod

# Or deploy to Netlify
netlify deploy --prod --dir=.next
```

### Backend Deployment (Firebase)
```powershell
# Deploy all Firebase services
firebase deploy

# Deploy specific services
firebase deploy --only functions
firebase deploy --only firestore:rules
firebase deploy --only storage
```

## 🔧 Configuration

### Environment Variables

#### Frontend (.env.local)
```env
# Firebase Configuration
NEXT_PUBLIC_FIREBASE_API_KEY=
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=
NEXT_PUBLIC_FIREBASE_PROJECT_ID=
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=
NEXT_PUBLIC_FIREBASE_APP_ID=

# API Configuration
NEXT_PUBLIC_API_BASE_URL=

# Feature Flags
NEXT_PUBLIC_ENABLE_ANALYTICS=true
NEXT_PUBLIC_ENABLE_CHAT=true
```

#### Backend (Firebase Functions)
```env
# Google Cloud Configuration
GOOGLE_CLOUD_PROJECT_ID=
GOOGLE_CLOUD_LOCATION=us-central1

# AI Service Configuration
VERTEX_AI_LOCATION=us-central1
DOCUMENT_AI_PROCESSOR_ID=
```

## 📚 API Documentation

The application provides RESTful APIs for:

### Authentication
- `POST /api/auth/signin` - User sign in
- `POST /api/auth/signup` - User registration
- `POST /api/auth/signout` - User sign out

### Documents
- `POST /api/documents` - Upload document
- `GET /api/documents` - Get user documents
- `GET /api/documents/:id` - Get document details
- `DELETE /api/documents/:id` - Delete document

### AI Processing
- `POST /api/process` - Process document with AI
- `POST /api/analyze` - Analyze document risks
- `POST /api/qa` - Ask questions about document

### Users
- `GET /api/users/profile` - Get user profile
- `PATCH /api/users/profile` - Update user profile

## 🔒 Security Features

- **Authentication**: Firebase Auth with JWT tokens
- **Authorization**: Role-based access control
- **Data Validation**: Zod schemas for all inputs
- **CSRF Protection**: Built-in Next.js protection
- **XSS Protection**: Content Security Policy headers
- **Rate Limiting**: API rate limiting implemented
- **Input Sanitization**: All user inputs sanitized
- **Secure Headers**: Security headers configured

## 🎨 UI/UX Features

- **Responsive Design**: Mobile-first approach
- **Dark Mode**: System preference detection
- **Accessibility**: WCAG 2.1 AA compliance
- **Internationalization**: 20+ language support
- **Loading States**: Skeleton screens and spinners
- **Error Boundaries**: Graceful error handling
- **Animations**: Smooth micro-interactions
- **Toast Notifications**: Real-time feedback

## 🚨 Troubleshooting

### Common Issues

1. **Module not found errors**: 
   ```powershell
   pnpm install
   ```

2. **Firebase connection issues**:
   - Check environment variables
   - Verify Firebase project configuration

3. **Build errors**:
   ```powershell
   pnpm clean
   pnpm install
   pnpm build
   ```

## 🚀 Deployment

### Deploy to Vercel (Recommended)
1. **Connect Repository:**
   - Visit [Vercel](https://vercel.com)
   - Import `https://github.com/Eren-Sama/LegalEase-AI`

2. **Configure Build:**
   - Root Directory: `apps/web`
   - Build Command: `pnpm build`
   - Output Directory: `.next`

3. **Environment Variables:**
   Add all variables from `.env.local` to Vercel dashboard

4. **Deploy:**
   - Click "Deploy" 
   - Get your live URL! 🎉

### Deploy to Netlify
1. **Connect Repository:**
   - Visit [Netlify](https://netlify.com)
   - Import from Git: `https://github.com/Eren-Sama/LegalEase-AI`

2. **Build Settings:**
   - Base Directory: `apps/web`
   - Build Command: `pnpm build && pnpm export`
   - Publish Directory: `apps/web/out`

3. **Environment Variables:**
   Add all your `.env.local` variables in Netlify dashboard

### Deploy to Firebase Hosting
```bash
# Install Firebase CLI
npm install -g firebase-tools

# Login to Firebase
firebase login

# Deploy
firebase deploy --only hosting
```

### Manual Server Deployment
```bash
# Build production
cd apps/web
pnpm build

# Start production server
pnpm start
# or
node .next/standalone/server.js
```

## 🔧 Troubleshooting
   - Change port in package.json dev script
   - Kill processes using port 3000

### Debug Mode
```powershell
# Run in debug mode
DEBUG=* pnpm dev

# Check logs
firebase functions:log
```

## 📈 Performance Optimizations

- **Code Splitting**: Automatic route-based splitting
- **Image Optimization**: Next.js built-in optimization
- **Bundle Analysis**: webpack-bundle-analyzer configured
- **Caching**: Service Worker + API caching
- **CDN**: Firebase Storage CDN
- **Compression**: Gzip/Brotli compression
- **Tree Shaking**: Dead code elimination
- **Lazy Loading**: Component-level lazy loading

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/amazing-feature`
3. Commit changes: `git commit -m 'Add amazing feature'`
4. Push to branch: `git push origin feature/amazing-feature`
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🆘 Support

For support and questions:
- **Email**: support@legalease-ai.com
- **Documentation**: [docs.legalease-ai.com](https://docs.legalease-ai.com)
- **Issues**: GitHub Issues tracker

## 🎯 Roadmap

### Phase 1 (Current) - MVP
- [x] Core document processing
- [x] Basic AI analysis
- [x] User authentication
- [x] Premium UI

### Phase 2 - Enhanced Features
- [ ] Advanced collaboration tools
- [ ] Custom AI models
- [ ] Enterprise features
- [ ] API marketplace

### Phase 3 - Scale
- [ ] Multi-tenant architecture
- [ ] Advanced analytics
- [ ] White-label solutions
- [ ] Mobile applications

---

**Built with ❤️ by the LegalEase AI Team**

*This is a complete, production-ready MVP with all features implemented and ready for deployment.*