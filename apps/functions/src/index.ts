// Firebase Functions - Main Entry Point
import * as functions from 'firebase-functions';
import * as admin from 'firebase-admin';
import express from 'express';
import cors from 'cors';
import helmet from 'helmet';

// Initialize Firebase Admin
admin.initializeApp();

// Create Express app
const app = express();

// Middleware
app.use(helmet());
app.use(cors({
  origin: process.env.NODE_ENV === 'production' 
    ? ['https://legalease.ai', 'https://www.legalease.ai']
    : ['http://localhost:3000', 'http://127.0.0.1:3000']
}));
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

// Import route handlers
import { authRoutes } from './api/auth';
import { documentsRoutes } from './api/documents';
import { processRoutes } from './api/process';
import { analyzeRoutes } from './api/analyze';
import { qaRoutes } from './api/qa';
import { usersRoutes } from './api/users';
import { adminRoutes } from './api/admin';
import { chatbotRoutes } from './api/chatbot';

// API Routes
app.use('/auth', authRoutes);
app.use('/documents', documentsRoutes);
app.use('/process', processRoutes);
app.use('/analyze', analyzeRoutes);
app.use('/qa', qaRoutes);
app.use('/users', usersRoutes);
app.use('/admin', adminRoutes);
app.use('/chatbot', chatbotRoutes);

// Health check endpoint
app.get('/health', (req, res) => {
  res.status(200).json({
    status: 'healthy',
    timestamp: new Date().toISOString(),
    version: '1.0.0'
  });
});

// Error handling middleware
app.use((error: Error, req: express.Request, res: express.Response, next: express.NextFunction) => {
  console.error('API Error:', error);
  
  res.status(500).json({
    success: false,
    error: {
      code: 'INTERNAL_ERROR',
      message: process.env.NODE_ENV === 'production' 
        ? 'An internal error occurred' 
        : error.message
    },
    timestamp: new Date().toISOString()
  });
});

// Export HTTP functions
export const api = functions
  .region('us-central1')
  .runWith({
    timeoutSeconds: 540,
    memory: '2GB'
  })
  .https
  .onRequest(app);