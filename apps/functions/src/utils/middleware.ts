// Middleware utilities for Firebase Functions
import { Request, Response, NextFunction } from 'express';
import * as admin from 'firebase-admin';
import { z } from 'zod';

// Extend Request interface to include user
declare global {
  namespace Express {
    interface Request {
      user?: admin.auth.DecodedIdToken;
    }
  }
}

// Response types
interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  error?: {
    code: string;
    message: string;
    details?: any;
  };
}

// Authentication middleware
export const authenticateUser = async (
  req: Request,
  res: Response<ApiResponse>,
  next: NextFunction
): Promise<void> => {
  try {
    const authHeader = req.headers.authorization;
    
    if (!authHeader) {
      res.status(401).json({
        success: false,
        error: {
          code: 'MISSING_AUTH_HEADER',
          message: 'Authorization header is required'
        }
      });
      return;
    }

    const token = authHeader.split(' ')[1];
    if (!token) {
      res.status(401).json({
        success: false,
        error: {
          code: 'MISSING_TOKEN',
          message: 'Bearer token is required'
        }
      });
      return;
    }

    // Verify the ID token
    const decodedToken = await admin.auth().verifyIdToken(token);
    req.user = decodedToken;
    
    next();
  } catch (error: any) {
    console.error('Authentication error:', error);
    
    let errorMessage = 'Authentication failed';
    let errorCode = 'AUTH_ERROR';
    
    if (error.code === 'auth/id-token-expired') {
      errorMessage = 'Token has expired';
      errorCode = 'TOKEN_EXPIRED';
    } else if (error.code === 'auth/id-token-revoked') {
      errorMessage = 'Token has been revoked';
      errorCode = 'TOKEN_REVOKED';
    } else if (error.code === 'auth/argument-error') {
      errorMessage = 'Invalid token format';
      errorCode = 'INVALID_TOKEN';
    }

    res.status(401).json({
      success: false,
      error: {
        code: errorCode,
        message: errorMessage
      }
    });
  }
};

// Admin authentication middleware
export const authenticateAdmin = async (
  req: Request,
  res: Response<ApiResponse>,
  next: NextFunction
): Promise<void> => {
  try {
    // First authenticate the user
    await authenticateUser(req, res, () => {});
    
    if (!req.user) {
      return; // Response already sent by authenticateUser
    }

    // Check if user has admin role
    const userDoc = await admin.firestore()
      .collection('users')
      .doc(req.user.uid)
      .get();

    if (!userDoc.exists) {
      res.status(404).json({
        success: false,
        error: {
          code: 'USER_NOT_FOUND',
          message: 'User profile not found'
        }
      });
      return;
    }

    const userData = userDoc.data();
    if (userData?.role !== 'admin') {
      res.status(403).json({
        success: false,
        error: {
          code: 'INSUFFICIENT_PERMISSIONS',
          message: 'Admin access required'
        }
      });
      return;
    }

    next();
  } catch (error: any) {
    console.error('Admin authentication error:', error);
    res.status(500).json({
      success: false,
      error: {
        code: 'ADMIN_AUTH_ERROR',
        message: 'Admin authentication failed'
      }
    });
  }
};

// Subscription validation middleware
export const requireSubscription = (allowedPlans: string[]) => {
  return async (
    req: Request,
    res: Response<ApiResponse>,
    next: NextFunction
  ): Promise<void> => {
    try {
      if (!req.user) {
        res.status(401).json({
          success: false,
          error: {
            code: 'AUTHENTICATION_REQUIRED',
            message: 'Authentication required'
          }
        });
        return;
      }

      // Get user subscription status
      const userDoc = await admin.firestore()
        .collection('users')
        .doc(req.user.uid)
        .get();

      if (!userDoc.exists) {
        res.status(404).json({
          success: false,
          error: {
            code: 'USER_NOT_FOUND',
            message: 'User profile not found'
          }
        });
        return;
      }

      const userData = userDoc.data();
      const userPlan = userData?.subscription || 'free';

      if (!allowedPlans.includes(userPlan)) {
        res.status(403).json({
          success: false,
          error: {
            code: 'SUBSCRIPTION_REQUIRED',
            message: `This feature requires one of these subscriptions: ${allowedPlans.join(', ')}`,
            details: {
              currentPlan: userPlan,
              requiredPlans: allowedPlans
            }
          }
        });
        return;
      }

      next();
    } catch (error: any) {
      console.error('Subscription validation error:', error);
      res.status(500).json({
        success: false,
        error: {
          code: 'SUBSCRIPTION_CHECK_ERROR',
          message: 'Failed to validate subscription'
        }
      });
    }
  };
};

// Request validation middleware
export const validateRequest = <T>(schema: z.ZodSchema<T>) => {
  return (req: Request, res: Response<ApiResponse>, next: NextFunction): void => {
    try {
      const validatedData = schema.parse(req.body);
      req.body = validatedData;
      next();
    } catch (error) {
      if (error instanceof z.ZodError) {
        res.status(400).json({
          success: false,
          error: {
            code: 'VALIDATION_ERROR',
            message: 'Request validation failed',
            details: error.errors.map(err => ({
              field: err.path.join('.'),
              message: err.message,
              code: err.code
            }))
          }
        });
      } else {
        console.error('Validation middleware error:', error);
        res.status(500).json({
          success: false,
          error: {
            code: 'VALIDATION_MIDDLEWARE_ERROR',
            message: 'Internal validation error'
          }
        });
      }
    }
  };
};

// Rate limiting middleware (basic implementation)
interface RateLimitStore {
  [key: string]: {
    count: number;
    resetTime: number;
  };
}

const rateLimitStore: RateLimitStore = {};

export const rateLimit = (options: {
  windowMs: number;
  max: number;
  keyGenerator?: (req: Request) => string;
}) => {
  return (req: Request, res: Response<ApiResponse>, next: NextFunction): void => {
    const key = options.keyGenerator 
      ? options.keyGenerator(req)
      : req.ip || req.connection.remoteAddress || 'unknown';
    
    const now = Date.now();
    const windowStart = now - options.windowMs;

    // Clean up expired entries
    if (rateLimitStore[key] && rateLimitStore[key].resetTime < windowStart) {
      delete rateLimitStore[key];
    }

    // Initialize or update counter
    if (!rateLimitStore[key]) {
      rateLimitStore[key] = {
        count: 1,
        resetTime: now + options.windowMs
      };
    } else {
      rateLimitStore[key].count += 1;
    }

    // Check rate limit
    if (rateLimitStore[key].count > options.max) {
      const resetTime = Math.ceil((rateLimitStore[key].resetTime - now) / 1000);
      res.status(429).json({
        success: false,
        error: {
          code: 'RATE_LIMIT_EXCEEDED',
          message: `Too many requests. Try again in ${resetTime} seconds.`,
          details: {
            limit: options.max,
            windowMs: options.windowMs,
            resetTime: rateLimitStore[key].resetTime
          }
        }
      });
      return;
    }

    // Add rate limit headers
    res.setHeader('X-RateLimit-Limit', options.max);
    res.setHeader('X-RateLimit-Remaining', Math.max(0, options.max - rateLimitStore[key].count));
    res.setHeader('X-RateLimit-Reset', rateLimitStore[key].resetTime);

    next();
  };
};

// Error handling middleware
export const errorHandler = (
  error: any,
  req: Request,
  res: Response<ApiResponse>,
  next: NextFunction
): void => {
  console.error('Unhandled error:', error);

  // Don't send error details in production
  const isDevelopment = process.env.NODE_ENV === 'development';
  
  res.status(error.status || 500).json({
    success: false,
    error: {
      code: error.code || 'INTERNAL_SERVER_ERROR',
      message: error.message || 'An unexpected error occurred',
      ...(isDevelopment && { details: error.stack })
    }
  });
};

// CORS options
export const corsOptions = {
  origin: process.env.NODE_ENV === 'production' 
    ? [
        'https://legalease-ai.web.app',
        'https://legalease-ai.firebaseapp.com'
      ]
    : ['http://localhost:3000', 'http://127.0.0.1:3000'],
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  maxAge: 86400 // 24 hours
};

// Async wrapper for route handlers
export const asyncHandler = (fn: Function) => {
  return (req: Request, res: Response, next: NextFunction) => {
    Promise.resolve(fn(req, res, next)).catch(next);
  };
};

// Request logging middleware
export const requestLogger = (req: Request, res: Response, next: NextFunction): void => {
  const start = Date.now();
  
  console.log(`${new Date().toISOString()} - ${req.method} ${req.path}`);
  
  res.on('finish', () => {
    const duration = Date.now() - start;
    console.log(
      `${new Date().toISOString()} - ${req.method} ${req.path} - ${res.statusCode} - ${duration}ms`
    );
  });
  
  next();
};