// Document Processing API Routes
import { Router } from 'express';
import * as admin from 'firebase-admin';
import { z } from 'zod';
import { authenticateUser, validateRequest, requireSubscription } from '../utils/middleware';
import { DocumentProcessorServiceClient } from '@google-cloud/documentai';

export const processRoutes: Router = Router();

// Initialize Document AI client
const documentAIClient = new DocumentProcessorServiceClient();

// Get processor configuration from environment
const PROJECT_ID = process.env.GOOGLE_CLOUD_PROJECT_ID || 'legalease-ai-1e9e8';
const PROCESSOR_ID = process.env.DOCUMENT_AI_PROCESSOR_ID || '4a9b2b153b00c738';
const LOCATION = process.env.DOCUMENT_AI_LOCATION || 'us';
const PROCESSOR_NAME = `projects/${PROJECT_ID}/locations/${LOCATION}/processors/${PROCESSOR_ID}`;

// Validation schemas
const processDocumentSchema = z.object({
  documentId: z.string().min(1),
  options: z.object({
    extractText: z.boolean().default(true),
    identifyRisks: z.boolean().default(true),
    generateSummary: z.boolean().default(true),
    detectLanguage: z.boolean().default(true),
    extractEntities: z.boolean().default(false),
    analyzeSentiment: z.boolean().default(false)
  }).optional().default({})
});

// POST /process/document - Process a document
processRoutes.post('/document', 
  authenticateUser,
  validateRequest(processDocumentSchema),
  async (req, res) => {
    try {
      const userId = req.user!.uid;
      const { documentId, options } = req.body;

      // Get document from Firestore
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

      if (documentData?.status !== 'uploaded') {
        return res.status(400).json({
          success: false,
          error: {
            code: 'INVALID_DOCUMENT_STATUS',
            message: 'Document must be uploaded before processing'
          }
        });
      }

      // Update document status to processing
      await docRef.update({
        status: 'processing',
        processing: {
          status: 'started',
          startedAt: admin.firestore.FieldValue.serverTimestamp(),
          completedAt: null,
          error: null,
          options
        },
        updatedAt: admin.firestore.FieldValue.serverTimestamp()
      });

      // Get the document file from Firebase Storage
      const bucket = admin.storage().bucket();
      const file = bucket.file(`documents/${userId}/${documentData.fileName}`);
      
      // Download the file content
      const [fileContent] = await file.download();
      
      // Process document with Document AI
      const request = {
        name: PROCESSOR_NAME,
        rawDocument: {
          content: fileContent.toString('base64'),
          mimeType: documentData.mimeType || 'application/pdf',
        },
      };

      console.log('Processing document with Document AI...', {
        processorName: PROCESSOR_NAME,
        documentId,
        mimeType: documentData.mimeType
      });

      const [result] = await documentAIClient.processDocument(request);
      const document = result.document;

      if (!document) {
        throw new Error('No document returned from Document AI');
      }

      // Extract text content
      const textContent = document.text || '';
      
      // Extract entities
      const entities = document.entities?.map(entity => ({
        type: entity.type || 'UNKNOWN',
        name: entity.textAnchor?.content || entity.mentionText || '',
        confidence: entity.confidence || 0,
        normalizedValue: entity.normalizedValue?.text || undefined
      })) || [];

      // Calculate basic stats
      const wordCount = textContent.split(/\s+/).filter(word => word.length > 0).length;
      const pageCount = document.pages?.length || 1;

      // Mock risk analysis (in a real implementation, this would use AI to analyze content)
      const risks = [];
      if (textContent.toLowerCase().includes('liability')) {
        risks.push({
          type: 'liability',
          severity: 'medium',
          description: 'Liability clauses detected - review recommended',
          location: 'Document content',
          recommendation: 'Consider legal review of liability terms'
        });
      }

      // Generate summary (simplified - in production, use Vertex AI for better summaries)
      const summary = textContent.length > 500 
        ? `Document contains ${wordCount} words across ${pageCount} pages. Key content areas identified.`
        : 'Short document processed successfully.';

      const processingResult = {
        textContent,
        language: 'en', // Document AI can detect language
        wordCount,
        pageCount,
        summary,
        risks,
        entities: options.extractEntities ? entities : [],
        sentiment: options.analyzeSentiment ? {
          score: 0.0,
          magnitude: 0.0,
          label: 'NEUTRAL'
        } : undefined,
        confidence: document.pages?.[0]?.transforms?.[0]?.data?.[0] || 0.95
      };

      // Create analysis record
      const analysisId = admin.firestore().collection('analysis').doc().id;
      const analysisData = {
        id: analysisId,
        documentId,
        userId,
        type: 'full_analysis',
        status: 'completed',
        result: processingResult,
        options,
        createdAt: admin.firestore.FieldValue.serverTimestamp(),
        updatedAt: admin.firestore.FieldValue.serverTimestamp()
      };

      await admin.firestore()
        .collection('analysis')
        .doc(analysisId)
        .set(analysisData);

      // Update document with processing results
      await docRef.update({
        status: 'processed',
        processing: {
          status: 'completed',
          startedAt: documentData.processing?.startedAt,
          completedAt: admin.firestore.FieldValue.serverTimestamp(),
          error: null,
          options
        },
        analysis: {
          id: analysisId,
          textContent: processingResult.textContent,
          language: processingResult.language,
          wordCount: processingResult.wordCount,
          pageCount: processingResult.pageCount,
          summary: processingResult.summary,
          risksCount: processingResult.risks.length,
          confidence: processingResult.confidence
        },
        updatedAt: admin.firestore.FieldValue.serverTimestamp()
      });

      return res.status(200).json({
        success: true,
        data: {
          analysisId,
          status: 'completed',
          result: processingResult
        }
      });

    } catch (error: any) {
      console.error('Document processing error:', error);

      // Update document status to error
      if (req.body.documentId) {
        try {
          await admin.firestore()
            .collection('documents')
            .doc(req.body.documentId)
            .update({
              status: 'error',
              processing: {
                status: 'error',
                startedAt: admin.firestore.FieldValue.serverTimestamp(),
                completedAt: admin.firestore.FieldValue.serverTimestamp(),
                error: error.message || 'Processing failed',
                options: req.body.options
              },
              updatedAt: admin.firestore.FieldValue.serverTimestamp()
            });
        } catch (updateError) {
          console.error('Failed to update document status:', updateError);
        }
      }

      return res.status(500).json({
        success: false,
        error: {
          code: 'PROCESSING_ERROR',
          message: 'Failed to process document'
        }
      });
    }
  }
);

// GET /process/status/:documentId - Get processing status
processRoutes.get('/status/:documentId', authenticateUser, async (req, res) => {
  try {
    const userId = req.user!.uid;
    const documentId = req.params.documentId;
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

    return res.status(200).json({
      success: true,
      data: {
        documentId,
        status: documentData?.status,
        processing: documentData?.processing || null,
        analysis: documentData?.analysis || null
      }
    });

  } catch (error: any) {
    console.error('Get processing status error:', error);
    return res.status(500).json({
      success: false,
      error: {
        code: 'STATUS_CHECK_ERROR',
        message: 'Failed to get processing status'
      }
    });
  }
});

// POST /process/reanalyze - Re-analyze document with different options
processRoutes.post('/reanalyze',
  authenticateUser,
  requireSubscription(['premium', 'enterprise']),
  validateRequest(processDocumentSchema),
  async (req, res) => {
    try {
      const userId = req.user!.uid;
      const { documentId, options } = req.body;

      // Get document from Firestore
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

      if (!['processed', 'error'].includes(documentData?.status)) {
        return res.status(400).json({
          success: false,
          error: {
            code: 'INVALID_DOCUMENT_STATUS',
            message: 'Document must be processed before re-analysis'
          }
        });
      }

      // Start re-analysis (similar to initial processing)
      await docRef.update({
        status: 'processing',
        processing: {
          status: 'started',
          startedAt: admin.firestore.FieldValue.serverTimestamp(),
          completedAt: null,
          error: null,
          options
        },
        updatedAt: admin.firestore.FieldValue.serverTimestamp()
      });

      // Mock re-analysis results
      const reanalysisResult = {
        textContent: documentData.analysis?.textContent || 'Text content from previous analysis',
        language: documentData.analysis?.language || 'en',
        wordCount: documentData.analysis?.wordCount || 250,
        pageCount: documentData.analysis?.pageCount || 1,
        summary: 'Updated analysis with enhanced risk detection and entity extraction.',
        risks: [
          {
            type: 'liability',
            severity: 'high',
            description: 'Unlimited liability clause with additional risk factors',
            location: 'Section 5, paragraph 2',
            recommendation: 'Strongly recommend negotiating liability caps and indemnification clauses'
          },
          {
            type: 'termination',
            severity: 'medium',
            description: 'Termination clause may be one-sided',
            location: 'Section 8',
            recommendation: 'Review termination conditions for fairness'
          }
        ],
        entities: options.extractEntities ? [
          { type: 'PERSON', name: 'John Doe', confidence: 0.95 },
          { type: 'PERSON', name: 'Jane Smith', confidence: 0.88 },
          { type: 'ORGANIZATION', name: 'Acme Corp', confidence: 0.92 },
          { type: 'LOCATION', name: 'New York', confidence: 0.91 }
        ] : [],
        sentiment: options.analyzeSentiment ? {
          score: 0.2,
          magnitude: 0.5,
          overall: 'slightly_positive'
        } : null,
        confidence: 0.91
      };

      // Create new analysis record
      const analysisId = admin.firestore().collection('analysis').doc().id;
      const analysisData = {
        id: analysisId,
        documentId,
        userId,
        type: 'reanalysis',
        status: 'completed',
        result: reanalysisResult,
        options,
        previousAnalysisId: documentData.analysis?.id,
        createdAt: admin.firestore.FieldValue.serverTimestamp(),
        updatedAt: admin.firestore.FieldValue.serverTimestamp()
      };

      await admin.firestore()
        .collection('analysis')
        .doc(analysisId)
        .set(analysisData);

      // Update document with new analysis results
      await docRef.update({
        status: 'processed',
        processing: {
          status: 'completed',
          startedAt: documentData.processing?.startedAt,
          completedAt: admin.firestore.FieldValue.serverTimestamp(),
          error: null,
          options
        },
        analysis: {
          id: analysisId,
          textContent: reanalysisResult.textContent,
          language: reanalysisResult.language,
          wordCount: reanalysisResult.wordCount,
          pageCount: reanalysisResult.pageCount,
          summary: reanalysisResult.summary,
          risksCount: reanalysisResult.risks.length,
          confidence: reanalysisResult.confidence
        },
        updatedAt: admin.firestore.FieldValue.serverTimestamp()
      });

      return res.status(200).json({
        success: true,
        data: {
          analysisId,
          status: 'completed',
          result: reanalysisResult,
          message: 'Document re-analyzed successfully'
        }
      });

    } catch (error: any) {
      console.error('Document re-analysis error:', error);
      return res.status(500).json({
        success: false,
        error: {
          code: 'REANALYSIS_ERROR',
          message: 'Failed to re-analyze document'
        }
      });
    }
  }
);

// POST /process/batch - Batch process multiple documents
processRoutes.post('/batch',
  authenticateUser,
  requireSubscription(['enterprise']),
  async (req, res) => {
    try {
      const userId = req.user!.uid;
      const { documentIds, options } = req.body;

      if (!Array.isArray(documentIds) || documentIds.length === 0) {
        return res.status(400).json({
          success: false,
          error: {
            code: 'INVALID_DOCUMENT_IDS',
            message: 'Document IDs must be a non-empty array'
          }
        });
      }

      if (documentIds.length > 50) {
        return res.status(400).json({
          success: false,
          error: {
            code: 'TOO_MANY_DOCUMENTS',
            message: 'Maximum 50 documents can be processed in a batch'
          }
        });
      }

      // Validate all documents belong to user and are ready for processing
      const batchDoc = admin.firestore().collection('documents')
        .where(admin.firestore.FieldPath.documentId(), 'in', documentIds);
      
      const snapshot = await batchDoc.get();
      const documents = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));

      const invalidDocs = documents.filter((doc: any) => 
        doc.userId !== userId || doc.status !== 'uploaded'
      );

      if (invalidDocs.length > 0) {
        return res.status(400).json({
          success: false,
          error: {
            code: 'INVALID_DOCUMENTS',
            message: 'Some documents are not valid for processing',
            details: {
              invalidDocumentIds: invalidDocs.map(doc => doc.id)
            }
          }
        });
      }

      // Create batch processing job
      const batchId = admin.firestore().collection('batch_jobs').doc().id;
      const batchJob = {
        id: batchId,
        userId,
        type: 'document_processing',
        status: 'queued',
        documentIds,
        options: options || {},
        progress: {
          total: documentIds.length,
          completed: 0,
          failed: 0,
          results: []
        },
        createdAt: admin.firestore.FieldValue.serverTimestamp(),
        updatedAt: admin.firestore.FieldValue.serverTimestamp()
      };

      await admin.firestore()
        .collection('batch_jobs')
        .doc(batchId)
        .set(batchJob);

      // Update all documents to processing status
      const batch = admin.firestore().batch();
      documentIds.forEach(docId => {
        const docRef = admin.firestore().collection('documents').doc(docId);
        batch.update(docRef, {
          status: 'processing',
          processing: {
            status: 'queued',
            batchId,
            startedAt: admin.firestore.FieldValue.serverTimestamp(),
            completedAt: null,
            error: null,
            options: options || {}
          },
          updatedAt: admin.firestore.FieldValue.serverTimestamp()
        });
      });

      await batch.commit();

      return res.status(202).json({
        success: true,
        data: {
          batchId,
          status: 'queued',
          documentCount: documentIds.length,
          message: 'Batch processing job created successfully'
        }
      });

    } catch (error: any) {
      console.error('Batch processing error:', error);
      return res.status(500).json({
        success: false,
        error: {
          code: 'BATCH_PROCESSING_ERROR',
          message: 'Failed to create batch processing job'
        }
      });
    }
  }
);

// GET /process/batch/:batchId - Get batch processing status
processRoutes.get('/batch/:batchId', authenticateUser, async (req, res) => {
  try {
    const userId = req.user!.uid;
    const batchId = req.params.batchId;

    if (!batchId) {
      return res.status(400).json({
        success: false,
        error: {
          code: 'MISSING_BATCH_ID',
          message: 'Batch ID is required'
        }
      });
    }

    const batchRef = admin.firestore().collection('batch_jobs').doc(batchId);
    const batchSnapshot = await batchRef.get();

    if (!batchSnapshot.exists) {
      return res.status(404).json({
        success: false,
        error: {
          code: 'BATCH_NOT_FOUND',
          message: 'Batch job not found'
        }
      });
    }

    const batchData = batchSnapshot.data();
    if (batchData?.userId !== userId) {
      return res.status(403).json({
        success: false,
        error: {
          code: 'ACCESS_DENIED',
          message: 'You do not have access to this batch job'
        }
      });
    }

    return res.status(200).json({
      success: true,
      data: {
        id: batchSnapshot.id,
        ...batchData
      }
    });

  } catch (error: any) {
    console.error('Get batch status error:', error);
    return res.status(500).json({
      success: false,
      error: {
        code: 'BATCH_STATUS_ERROR',
        message: 'Failed to get batch processing status'
      }
    });
  }
});