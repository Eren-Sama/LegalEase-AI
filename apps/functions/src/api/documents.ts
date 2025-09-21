// Documents API Routes
import { Router } from 'express';
import * as admin from 'firebase-admin';
import { z } from 'zod';
import { authenticateUser, validateRequest, requireSubscription, rateLimit } from '../utils/middleware';

export const documentsRoutes: Router = Router();

// Validation schemas
const uploadDocumentSchema = z.object({
  fileName: z.string().min(1),
  fileSize: z.number().positive(),
  contentType: z.string().min(1),
  description: z.string().optional(),
  tags: z.array(z.string()).optional().default([])
});

const updateDocumentSchema = z.object({
  title: z.string().min(1).optional(),
  description: z.string().optional(),
  tags: z.array(z.string()).optional(),
  isPublic: z.boolean().optional()
});

// GET /documents - Get user's documents
documentsRoutes.get('/', authenticateUser, async (req, res) => {
  try {
    const userId = req.user!.uid;
    const { 
      limit = 20, 
      offset = 0, 
      sortBy = 'createdAt', 
      sortOrder = 'desc',
      status,
      tags,
      search 
    } = req.query;

    let query = admin.firestore()
      .collection('documents')
      .where('userId', '==', userId);

    // Filter by status
    if (status && typeof status === 'string') {
      query = query.where('status', '==', status);
    }

    // Filter by tags
    if (tags && typeof tags === 'string') {
      const tagArray = tags.split(',');
      query = query.where('tags', 'array-contains-any', tagArray);
    }

    // Add ordering
    query = query.orderBy(sortBy as string, sortOrder as 'asc' | 'desc');

    // Apply pagination
    query = query.limit(Number(limit)).offset(Number(offset));

    const snapshot = await query.get();
    const documents = snapshot.docs.map(doc => {
      const data = doc.data();
      return {
        id: doc.id,
        title: data.title,
        description: data.description,
        fileName: data.fileName,
        ...data
      };
    });

    // Filter by search term if provided
    let filteredDocuments = documents;
    if (search && typeof search === 'string') {
      const searchTerm = search.toLowerCase();
      filteredDocuments = documents.filter(doc => 
        (doc.title as string)?.toLowerCase().includes(searchTerm) ||
        (doc.description as string)?.toLowerCase().includes(searchTerm) ||
        (doc.fileName as string)?.toLowerCase().includes(searchTerm)
      );
    }

    // Get total count for pagination
    const totalQuery = admin.firestore()
      .collection('documents')
      .where('userId', '==', userId);
    
    const totalSnapshot = await totalQuery.count().get();
    const total = totalSnapshot.data().count;

    return res.status(200).json({
      success: true,
      data: {
        documents: filteredDocuments,
        pagination: {
          total,
          limit: Number(limit),
          offset: Number(offset),
          hasMore: Number(offset) + filteredDocuments.length < total
        }
      }
    });

  } catch (error: any) {
    console.error('Get documents error:', error);
    return res.status(500).json({
      success: false,
      error: {
        code: 'GET_DOCUMENTS_ERROR',
        message: 'Failed to retrieve documents'
      }
    });
  }
});

// GET /documents/:id - Get specific document
documentsRoutes.get('/:id', authenticateUser, async (req, res) => {
  try {
    const userId = req.user!.uid;
    const documentId = req.params.id;
    if (!documentId) {
      return res.status(400).json({
        success: false,
        error: {
          code: 'MISSING_DOCUMENT_ID',
          message: 'Document ID is required'
        }
      });
    }

    if (!documentId) {
      return res.status(400).json({
        success: false,
        error: {
          code: 'MISSING_DOCUMENT_ID',
          message: 'Document ID is required'
        }
      });
    }

    const docRef = admin.firestore().collection('documents').doc(documentId);
    const docSnapshot = await docRef.get();

    if (!docSnapshot.exists) {
      return res.status(404).json({
        success: false,
        error: {
          code: 'DOCUMENT_NOT_FOUND',
          message: 'Document not found'
        }
      });
    }

    const documentData = docSnapshot.data();
    
    // Check if user owns the document or if it's public
    if (documentData?.userId !== userId && !documentData?.isPublic) {
      return res.status(403).json({
        success: false,
        error: {
          code: 'ACCESS_DENIED',
          message: 'You do not have access to this document'
        }
      });
    }

    // Update view count
    await docRef.update({
      views: admin.firestore.FieldValue.increment(1),
      lastViewedAt: admin.firestore.FieldValue.serverTimestamp(),
      updatedAt: admin.firestore.FieldValue.serverTimestamp()
    });

    return res.status(200).json({
      success: true,
      data: {
        id: docSnapshot.id,
        ...documentData
      }
    });

  } catch (error: any) {
    console.error('Get document error:', error);
    return res.status(500).json({
      success: false,
      error: {
        code: 'GET_DOCUMENT_ERROR',
        message: 'Failed to retrieve document'
      }
    });
  }
});

// POST /documents/upload - Initialize document upload
documentsRoutes.post('/upload', 
  authenticateUser,
  rateLimit({ windowMs: 15 * 60 * 1000, max: 10 }), // 10 uploads per 15 minutes
  validateRequest(uploadDocumentSchema),
  async (req, res) => {
    try {
      const userId = req.user!.uid;
      const { fileName, fileSize, contentType, description, tags } = req.body;

      // Check file size limits based on subscription
      const userDoc = await admin.firestore().collection('users').doc(userId).get();
      const userData = userDoc.data();
      const subscription = userData?.subscription || 'free';

      const fileSizeLimits = {
        free: 5 * 1024 * 1024, // 5MB
        premium: 50 * 1024 * 1024, // 50MB
        enterprise: 500 * 1024 * 1024 // 500MB
      };

      if (fileSize > fileSizeLimits[subscription as keyof typeof fileSizeLimits]) {
        return res.status(413).json({
          success: false,
          error: {
            code: 'FILE_TOO_LARGE',
            message: `File size exceeds limit for ${subscription} subscription`,
            details: {
              maxSize: fileSizeLimits[subscription as keyof typeof fileSizeLimits],
              currentSize: fileSize
            }
          }
        });
      }

      // Check allowed file types
      const allowedTypes = [
        'application/pdf',
        'application/msword',
        'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
        'text/plain',
        'application/rtf'
      ];

      if (!allowedTypes.includes(contentType)) {
        return res.status(400).json({
          success: false,
          error: {
            code: 'INVALID_FILE_TYPE',
            message: 'File type not supported',
            details: {
              allowedTypes,
              providedType: contentType
            }
          }
        });
      }

      // Create document record
      const documentId = admin.firestore().collection('documents').doc().id;
      const document = {
        id: documentId,
        userId,
        fileName,
        fileSize,
        contentType,
        description: description || '',
        tags: tags || [],
        status: 'uploading',
        uploadProgress: 0,
        createdAt: admin.firestore.FieldValue.serverTimestamp(),
        updatedAt: admin.firestore.FieldValue.serverTimestamp(),
        views: 0,
        isPublic: false,
        processing: {
          status: 'pending',
          startedAt: null,
          completedAt: null,
          error: null
        }
      };

      await admin.firestore()
        .collection('documents')
        .doc(documentId)
        .set(document);

      // Generate signed upload URL
      const bucket = admin.storage().bucket();
      const filePath = `documents/${userId}/${documentId}/${fileName}`;
      const file = bucket.file(filePath);

      const [signedUrl] = await file.getSignedUrl({
        version: 'v4',
        action: 'write',
        expires: Date.now() + 15 * 60 * 1000, // 15 minutes
        contentType: contentType,
      });

      return res.status(201).json({
        success: true,
        data: {
          documentId,
          uploadUrl: signedUrl,
          expiresAt: new Date(Date.now() + 15 * 60 * 1000).toISOString()
        }
      });

    } catch (error: any) {
      console.error('Upload initialization error:', error);
      return res.status(500).json({
        success: false,
        error: {
          code: 'UPLOAD_INIT_ERROR',
          message: 'Failed to initialize upload'
        }
      });
    }
  }
);

// POST /documents/:id/upload-complete - Mark upload as complete
documentsRoutes.post('/:id/upload-complete', authenticateUser, async (req, res) => {
  try {
    const userId = req.user!.uid;
    const documentId = req.params.id;
    if (!documentId) {
      return res.status(400).json({
        success: false,
        error: {
          code: 'MISSING_DOCUMENT_ID',
          message: 'Document ID is required'
        }
      });
    }

    if (!documentId) {
      return res.status(400).json({
        success: false,
        error: {
          code: 'MISSING_DOCUMENT_ID',
          message: 'Document ID is required'
        }
      });
    }

    const docRef = admin.firestore().collection('documents').doc(documentId);
    const docSnapshot = await docRef.get();

    if (!docSnapshot.exists) {
      return res.status(404).json({
        success: false,
        error: {
          code: 'DOCUMENT_NOT_FOUND',
          message: 'Document not found'
        }
      });
    }

    const documentData = docSnapshot.data();
    if (documentData?.userId !== userId) {
      return res.status(403).json({
        success: false,
        error: {
          code: 'ACCESS_DENIED',
          message: 'You do not have access to this document'
        }
      });
    }

    // Update document status
    await docRef.update({
      status: 'uploaded',
      uploadProgress: 100,
      uploadedAt: admin.firestore.FieldValue.serverTimestamp(),
      updatedAt: admin.firestore.FieldValue.serverTimestamp(),
      processing: {
        status: 'queued',
        startedAt: null,
        completedAt: null,
        error: null
      }
    });

    return res.status(200).json({
      success: true,
      data: {
        message: 'Upload completed successfully',
        status: 'uploaded'
      }
    });

  } catch (error: any) {
    console.error('Upload complete error:', error);
    return res.status(500).json({
      success: false,
      error: {
        code: 'UPLOAD_COMPLETE_ERROR',
        message: 'Failed to mark upload as complete'
      }
    });
  }
});

// PUT /documents/:id - Update document
documentsRoutes.put('/:id', 
  authenticateUser, 
  validateRequest(updateDocumentSchema), 
  async (req, res) => {
    try {
      const userId = req.user!.uid;
      const documentId = req.params.id;
      if (!documentId) {
        return res.status(400).json({
          success: false,
          error: {
            code: 'MISSING_DOCUMENT_ID',
            message: 'Document ID is required'
          }
        });
      }

      const docRef = admin.firestore().collection('documents').doc(documentId);
      const docSnapshot = await docRef.get();

      if (!docSnapshot.exists) {
        return res.status(404).json({
          success: false,
          error: {
            code: 'DOCUMENT_NOT_FOUND',
            message: 'Document not found'
          }
        });
      }

      const documentData = docSnapshot.data();
      if (documentData?.userId !== userId) {
        return res.status(403).json({
          success: false,
          error: {
            code: 'ACCESS_DENIED',
            message: 'You do not have access to this document'
          }
        });
      }

      // Update document
      const updateData = {
        ...req.body,
        updatedAt: admin.firestore.FieldValue.serverTimestamp()
      };

      await docRef.update(updateData);

      // Get updated document
      const updatedDoc = await docRef.get();

      return res.status(200).json({
        success: true,
        data: {
          id: updatedDoc.id,
          ...updatedDoc.data()
        }
      });

    } catch (error: any) {
      console.error('Update document error:', error);
      return res.status(500).json({
        success: false,
        error: {
          code: 'UPDATE_DOCUMENT_ERROR',
          message: 'Failed to update document'
        }
      });
    }
  }
);

// DELETE /documents/:id - Delete document
documentsRoutes.delete('/:id', authenticateUser, async (req, res) => {
  try {
    const userId = req.user!.uid;
    const documentId = req.params.id;
    if (!documentId) {
      return res.status(400).json({
        success: false,
        error: {
          code: 'MISSING_DOCUMENT_ID',
          message: 'Document ID is required'
        }
      });
    }

    const docRef = admin.firestore().collection('documents').doc(documentId);
    const docSnapshot = await docRef.get();

    if (!docSnapshot.exists) {
      return res.status(404).json({
        success: false,
        error: {
          code: 'DOCUMENT_NOT_FOUND',
          message: 'Document not found'
        }
      });
    }

    const documentData = docSnapshot.data();
    if (documentData?.userId !== userId) {
      return res.status(403).json({
        success: false,
        error: {
          code: 'ACCESS_DENIED',
          message: 'You do not have access to this document'
        }
      });
    }

    // Delete file from storage
    const bucket = admin.storage().bucket();
    const filePath = `documents/${userId}/${documentId}/${documentData?.fileName}`;
    
    try {
      await bucket.file(filePath).delete();
    } catch (storageError) {
      console.warn('File not found in storage:', filePath);
    }

    // Delete document record
    await docRef.delete();

    return res.status(200).json({
      success: true,
      data: {
        message: 'Document deleted successfully'
      }
    });

  } catch (error: any) {
    console.error('Delete document error:', error);
    return res.status(500).json({
      success: false,
      error: {
        code: 'DELETE_DOCUMENT_ERROR',
        message: 'Failed to delete document'
      }
    });
  }
});

// GET /documents/:id/download - Get download URL
documentsRoutes.get('/:id/download', authenticateUser, async (req, res) => {
  try {
    const userId = req.user!.uid;
    const documentId = req.params.id;
    if (!documentId) {
      return res.status(400).json({
        success: false,
        error: {
          code: 'MISSING_DOCUMENT_ID',
          message: 'Document ID is required'
        }
      });
    }

    const docRef = admin.firestore().collection('documents').doc(documentId);
    const docSnapshot = await docRef.get();

    if (!docSnapshot.exists) {
      return res.status(404).json({
        success: false,
        error: {
          code: 'DOCUMENT_NOT_FOUND',
          message: 'Document not found'
        }
      });
    }

    const documentData = docSnapshot.data();
    
    // Check access permissions
    if (documentData?.userId !== userId && !documentData?.isPublic) {
      return res.status(403).json({
        success: false,
        error: {
          code: 'ACCESS_DENIED',
          message: 'You do not have access to this document'
        }
      });
    }

    // Generate signed download URL
    const bucket = admin.storage().bucket();
    const filePath = `documents/${documentData?.userId}/${documentId}/${documentData?.fileName}`;
    const file = bucket.file(filePath);

    const [signedUrl] = await file.getSignedUrl({
      version: 'v4',
      action: 'read',
      expires: Date.now() + 60 * 60 * 1000, // 1 hour
    });

    return res.status(200).json({
      success: true,
      data: {
        downloadUrl: signedUrl,
        fileName: documentData?.fileName,
        fileSize: documentData?.fileSize,
        contentType: documentData?.contentType,
        expiresAt: new Date(Date.now() + 60 * 60 * 1000).toISOString()
      }
    });

  } catch (error: any) {
    console.error('Download URL error:', error);
    return res.status(500).json({
      success: false,
      error: {
        code: 'DOWNLOAD_URL_ERROR',
        message: 'Failed to generate download URL'
      }
    });
  }
});