// Authentication API Routes
import { Router } from 'express';
import * as admin from 'firebase-admin';
import { z } from 'zod';
import { authenticateUser, validateRequest } from '../utils/middleware';

export const authRoutes: Router = Router();

// Validation schemas
const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8)
});

const registerSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8),
  displayName: z.string().min(2),
  acceptTerms: z.boolean().refine(val => val === true)
});

const resetPasswordSchema = z.object({
  email: z.string().email()
});

// POST /auth/register
authRoutes.post('/register', validateRequest(registerSchema), async (req, res) => {
  try {
    const { email, password, displayName, acceptTerms } = req.body;

    // Create user in Firebase Auth
    const userRecord = await admin.auth().createUser({
      email,
      password,
      displayName,
      emailVerified: false
    });

    // Create user profile in Firestore
    const userProfile = {
      id: userRecord.uid,
      email: userRecord.email!,
      displayName: userRecord.displayName!,
      role: 'user',
      subscription: 'free',
      preferences: {
        theme: 'light',
        language: 'en',
        notifications: {
          email: true,
          push: true,
          documentProcessed: true,
          riskAlerts: true
        }
      },
      profile: {
        firstName: '',
        lastName: '',
        company: '',
        timezone: 'America/New_York'
      },
      createdAt: admin.firestore.FieldValue.serverTimestamp(),
      updatedAt: admin.firestore.FieldValue.serverTimestamp(),
      isActive: true,
      acceptedTerms: acceptTerms,
      acceptedTermsAt: admin.firestore.FieldValue.serverTimestamp()
    };

    await admin.firestore()
      .collection('users')
      .doc(userRecord.uid)
      .set(userProfile);

    // Generate custom token
    const customToken = await admin.auth().createCustomToken(userRecord.uid);

    res.status(201).json({
      success: true,
      data: {
        user: {
          id: userRecord.uid,
          email: userRecord.email,
          displayName: userRecord.displayName,
          emailVerified: userRecord.emailVerified
        },
        customToken,
        message: 'User registered successfully. Please verify your email.'
      }
    });

  } catch (error: any) {
    console.error('Registration error:', error);
    
    let errorMessage = 'Registration failed';
    let statusCode = 500;

    if (error.code === 'auth/email-already-exists') {
      errorMessage = 'Email address is already in use';
      statusCode = 409;
    } else if (error.code === 'auth/invalid-email') {
      errorMessage = 'Invalid email address';
      statusCode = 400;
    } else if (error.code === 'auth/weak-password') {
      errorMessage = 'Password is too weak';
      statusCode = 400;
    }

    res.status(statusCode).json({
      success: false,
      error: {
        code: error.code || 'REGISTRATION_ERROR',
        message: errorMessage
      }
    });
  }
});

// POST /auth/login
authRoutes.post('/login', validateRequest(loginSchema), async (req, res) => {
  try {
    const { email, password } = req.body;

    // Note: Firebase Admin SDK doesn't support email/password authentication
    // This would typically be handled on the client side with Firebase Auth
    // Here we're creating a placeholder for the API structure

    res.status(400).json({
      success: false,
      error: {
        code: 'INVALID_ENDPOINT',
        message: 'Login should be handled on the client side with Firebase Auth'
      }
    });

  } catch (error: any) {
    console.error('Login error:', error);
    res.status(500).json({
      success: false,
      error: {
        code: 'LOGIN_ERROR',
        message: 'Login failed'
      }
    });
  }
});

// POST /auth/reset-password
authRoutes.post('/reset-password', validateRequest(resetPasswordSchema), async (req, res) => {
  try {
    const { email } = req.body;

    // Generate password reset link
    const resetLink = await admin.auth().generatePasswordResetLink(email);

    // TODO: Send email with reset link using notification service
    console.log('Password reset link:', resetLink);

    res.status(200).json({
      success: true,
      data: {
        message: 'Password reset email sent successfully'
      }
    });

  } catch (error: any) {
    console.error('Password reset error:', error);
    
    let errorMessage = 'Password reset failed';
    if (error.code === 'auth/user-not-found') {
      errorMessage = 'No user found with this email address';
    }

    res.status(400).json({
      success: false,
      error: {
        code: error.code || 'PASSWORD_RESET_ERROR',
        message: errorMessage
      }
    });
  }
});

// POST /auth/verify-token
authRoutes.post('/verify-token', async (req, res) => {
  try {
    const { idToken } = req.body;

    if (!idToken) {
      return res.status(400).json({
        success: false,
        error: {
          code: 'MISSING_TOKEN',
          message: 'ID token is required'
        }
      });
    }

    // Verify the ID token
    const decodedToken = await admin.auth().verifyIdToken(idToken);
    
    // Get user profile from Firestore
    const userDoc = await admin.firestore()
      .collection('users')
      .doc(decodedToken.uid)
      .get();

    if (!userDoc.exists) {
      return res.status(404).json({
        success: false,
        error: {
          code: 'USER_NOT_FOUND',
          message: 'User profile not found'
        }
      });
    }

    const userProfile = userDoc.data();

    return res.status(200).json({
      success: true,
      data: {
        user: {
          id: decodedToken.uid,
          email: decodedToken.email,
          emailVerified: decodedToken.email_verified,
          ...userProfile
        },
        tokenValid: true
      }
    });

  } catch (error: any) {
    console.error('Token verification error:', error);
    
    let errorMessage = 'Token verification failed';
    if (error.code === 'auth/id-token-expired') {
      errorMessage = 'Token has expired';
    } else if (error.code === 'auth/id-token-revoked') {
      errorMessage = 'Token has been revoked';
    }

    return res.status(401).json({
      success: false,
      error: {
        code: error.code || 'TOKEN_VERIFICATION_ERROR',
        message: errorMessage
      }
    });
  }
});

// POST /auth/refresh-token
authRoutes.post('/refresh-token', authenticateUser, async (req, res) => {
  try {
    const userId = req.user?.uid;

    // Generate new custom token
    const customToken = await admin.auth().createCustomToken(userId!);

    res.status(200).json({
      success: true,
      data: {
        customToken,
        expiresIn: 3600 // 1 hour
      }
    });

  } catch (error: any) {
    console.error('Token refresh error:', error);
    res.status(500).json({
      success: false,
      error: {
        code: 'TOKEN_REFRESH_ERROR',
        message: 'Failed to refresh token'
      }
    });
  }
});

// DELETE /auth/logout
authRoutes.delete('/logout', authenticateUser, async (req, res) => {
  try {
    const userId = req.user?.uid;

    // Revoke refresh tokens for the user
    await admin.auth().revokeRefreshTokens(userId!);

    // Update last logout time in user profile
    await admin.firestore()
      .collection('users')
      .doc(userId!)
      .update({
        lastLogoutAt: admin.firestore.FieldValue.serverTimestamp(),
        updatedAt: admin.firestore.FieldValue.serverTimestamp()
      });

    res.status(200).json({
      success: true,
      data: {
        message: 'Logged out successfully'
      }
    });

  } catch (error: any) {
    console.error('Logout error:', error);
    res.status(500).json({
      success: false,
      error: {
        code: 'LOGOUT_ERROR',
        message: 'Logout failed'
      }
    });
  }
});