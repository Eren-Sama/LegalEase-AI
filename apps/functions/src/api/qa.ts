// Q&A API Routes for Document Interaction
import { Router } from 'express';
import * as admin from 'firebase-admin';
import { z } from 'zod';
import { authenticateUser, validateRequest, requireSubscription, rateLimit } from '../utils/middleware';

export const qaRoutes: Router = Router();

// Validation schemas
const askQuestionSchema = z.object({
  documentId: z.string().min(1),
  question: z.string().min(1).max(1000),
  context: z.string().optional(),
  language: z.string().default('en')
});

const followUpSchema = z.object({
  conversationId: z.string().min(1),
  question: z.string().min(1).max(1000)
});

const feedbackSchema = z.object({
  questionId: z.string().min(1),
  helpful: z.boolean(),
  comment: z.string().optional()
});

// POST /qa/ask - Ask a question about a document
qaRoutes.post('/ask',
  authenticateUser,
  rateLimit({ windowMs: 5 * 60 * 1000, max: 20 }), // 20 questions per 5 minutes
  validateRequest(askQuestionSchema),
  async (req, res) => {
    try {
      const userId = req.user!.uid;
      const { documentId, question, context, language } = req.body;

      // Verify document access
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
      if (documentData?.userId !== userId && !documentData?.isPublic) {
        return res.status(403).json({
          success: false,
          error: {
            code: 'ACCESS_DENIED',
            message: 'You do not have access to this document'
          }
        });
      }

      if (documentData?.status !== 'processed') {
        return res.status(400).json({
          success: false,
          error: {
            code: 'DOCUMENT_NOT_PROCESSED',
            message: 'Document must be processed before asking questions'
          }
        });
      }

      // Get document analysis for context
      const analysisQuery = admin.firestore()
        .collection('analysis')
        .where('documentId', '==', documentId)
        .orderBy('createdAt', 'desc')
        .limit(1);

      const analysisSnapshot = await analysisQuery.get();
      const analysisData = analysisSnapshot.empty ? null : analysisSnapshot.docs[0]?.data();

      // Generate AI response (mock implementation)
      const aiResponse = await generateAIResponse(question, documentData, analysisData, context);

      // Create conversation if this is the first question
      const conversationId = `conv_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
      
      // Save question and answer
      const questionId = admin.firestore().collection('qa_sessions').doc().id;
      const qaSession = {
        id: questionId,
        conversationId,
        documentId,
        userId,
        question: {
          text: question,
          context: context || null,
          language,
          timestamp: admin.firestore.FieldValue.serverTimestamp()
        },
        answer: {
          text: aiResponse.answer,
          confidence: aiResponse.confidence,
          sources: aiResponse.sources,
          relatedSections: aiResponse.relatedSections,
          followUpSuggestions: aiResponse.followUpSuggestions,
          timestamp: admin.firestore.FieldValue.serverTimestamp()
        },
        feedback: null,
        createdAt: admin.firestore.FieldValue.serverTimestamp(),
        updatedAt: admin.firestore.FieldValue.serverTimestamp()
      };

      await admin.firestore()
        .collection('qa_sessions')
        .doc(questionId)
        .set(qaSession);

      // Update document Q&A stats
      await docRef.update({
        'stats.questionsAsked': admin.firestore.FieldValue.increment(1),
        'stats.lastQuestionAt': admin.firestore.FieldValue.serverTimestamp(),
        updatedAt: admin.firestore.FieldValue.serverTimestamp()
      });

      return res.status(200).json({
        success: true,
        data: {
          questionId,
          conversationId,
          question: question,
          answer: aiResponse.answer,
          confidence: aiResponse.confidence,
          sources: aiResponse.sources,
          relatedSections: aiResponse.relatedSections,
          followUpSuggestions: aiResponse.followUpSuggestions,
          processingTime: aiResponse.processingTime
        }
      });

    } catch (error: any) {
      console.error('Q&A ask error:', error);
      return res.status(500).json({
        success: false,
        error: {
          code: 'QA_ASK_ERROR',
          message: 'Failed to process question'
        }
      });
    }
  }
);

// POST /qa/follow-up - Ask a follow-up question
qaRoutes.post('/follow-up',
  authenticateUser,
  validateRequest(followUpSchema),
  async (req, res) => {
    try {
      const userId = req.user!.uid;
      const { conversationId, question } = req.body;

      // Get conversation context
      const conversationQuery = admin.firestore()
        .collection('qa_sessions')
        .where('conversationId', '==', conversationId)
        .where('userId', '==', userId)
        .orderBy('createdAt', 'asc');

      const conversationSnapshot = await conversationQuery.get();
      
      if (conversationSnapshot.empty) {
        return res.status(404).json({
          success: false,
          error: {
            code: 'CONVERSATION_NOT_FOUND',
            message: 'Conversation not found'
          }
        });
      }

      const conversationHistory = conversationSnapshot.docs.map(doc => doc.data());
      const firstQuestion = conversationHistory[0];
      const documentId = firstQuestion?.documentId;

      // Get document data for context
      const docSnapshot = await admin.firestore()
        .collection('documents')
        .doc(documentId)
        .get();

      const documentData = docSnapshot.data();

      // Generate follow-up response with conversation context
      const aiResponse = await generateFollowUpResponse(question, conversationHistory, documentData);

      // Save follow-up question and answer
      const questionId = admin.firestore().collection('qa_sessions').doc().id;
      const followUpSession = {
        id: questionId,
        conversationId,
        documentId,
        userId,
        question: {
          text: question,
          context: 'follow_up',
          language: 'en',
          timestamp: admin.firestore.FieldValue.serverTimestamp()
        },
        answer: {
          text: aiResponse.answer,
          confidence: aiResponse.confidence,
          sources: aiResponse.sources,
          relatedSections: aiResponse.relatedSections,
          followUpSuggestions: aiResponse.followUpSuggestions,
          timestamp: admin.firestore.FieldValue.serverTimestamp()
        },
        feedback: null,
        isFollowUp: true,
        createdAt: admin.firestore.FieldValue.serverTimestamp(),
        updatedAt: admin.firestore.FieldValue.serverTimestamp()
      };

      await admin.firestore()
        .collection('qa_sessions')
        .doc(questionId)
        .set(followUpSession);

      return res.status(200).json({
        success: true,
        data: {
          questionId,
          conversationId,
          question: question,
          answer: aiResponse.answer,
          confidence: aiResponse.confidence,
          sources: aiResponse.sources,
          relatedSections: aiResponse.relatedSections,
          followUpSuggestions: aiResponse.followUpSuggestions,
          processingTime: aiResponse.processingTime
        }
      });

    } catch (error: any) {
      console.error('Follow-up error:', error);
      return res.status(500).json({
        success: false,
        error: {
          code: 'FOLLOWUP_ERROR',
          message: 'Failed to process follow-up question'
        }
      });
    }
  }
);

// GET /qa/conversation/:conversationId - Get conversation history
qaRoutes.get('/conversation/:conversationId', authenticateUser, async (req, res) => {
  try {
    const userId = req.user!.uid;
    const conversationId = req.params.conversationId;

    const conversationQuery = admin.firestore()
      .collection('qa_sessions')
      .where('conversationId', '==', conversationId)
      .where('userId', '==', userId)
      .orderBy('createdAt', 'asc');

    const conversationSnapshot = await conversationQuery.get();
    
    if (conversationSnapshot.empty) {
      return res.status(404).json({
        success: false,
        error: {
          code: 'CONVERSATION_NOT_FOUND',
          message: 'Conversation not found'
        }
      });
    }

    const conversation = conversationSnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    })) as any[];

    return res.status(200).json({
      success: true,
      data: {
        conversationId,
        documentId: conversation[0]?.documentId,
        totalQuestions: conversation.length,
        conversation: conversation.map((item: any) => ({
          questionId: item.id,
          question: item.question?.text,
          answer: item.answer?.text,
          confidence: item.answer?.confidence,
          timestamp: item.createdAt,
          feedback: item.feedback
        }))
      }
    });

  } catch (error: any) {
    console.error('Get conversation error:', error);
    return res.status(500).json({
      success: false,
      error: {
        code: 'GET_CONVERSATION_ERROR',
        message: 'Failed to retrieve conversation'
      }
    });
  }
});

// GET /qa/document/:documentId/sessions - Get all Q&A sessions for a document
qaRoutes.get('/document/:documentId/sessions', authenticateUser, async (req, res) => {
  try {
    const userId = req.user!.uid;
    const documentId = req.params.documentId;
    const { limit = 20, offset = 0 } = req.query;

    if (!documentId) {
      return res.status(400).json({
        success: false,
        error: {
          code: 'MISSING_DOCUMENT_ID',
          message: 'Document ID is required'
        }
      });
    }

    // Verify document access
    const docSnapshot = await admin.firestore()
      .collection('documents')
      .doc(documentId)
      .get();

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
    if (documentData?.userId !== userId && !documentData?.isPublic) {
      return res.status(403).json({
        success: false,
        error: {
          code: 'ACCESS_DENIED',
          message: 'You do not have access to this document'
        }
      });
    }

    const sessionsQuery = admin.firestore()
      .collection('qa_sessions')
      .where('documentId', '==', documentId)
      .where('userId', '==', userId)
      .orderBy('createdAt', 'desc')
      .limit(Number(limit))
      .offset(Number(offset));

    const sessionsSnapshot = await sessionsQuery.get();
    const sessions = sessionsSnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));

    // Group by conversation
    const conversations = sessions.reduce((acc: any, session: any) => {
      const convId = session.conversationId;
      if (!acc[convId]) {
        acc[convId] = {
          conversationId: convId,
          questions: [],
          startedAt: session.createdAt,
          lastActivity: session.createdAt
        };
      }
      acc[convId].questions.push({
        questionId: session.id,
        question: session.question.text,
        answer: session.answer.text,
        confidence: session.answer.confidence,
        timestamp: session.createdAt
      });
      return acc;
    }, {});

    return res.status(200).json({
      success: true,
      data: {
        documentId,
        totalSessions: sessions.length,
        conversations: Object.values(conversations)
      }
    });

  } catch (error: any) {
    console.error('Get document sessions error:', error);
    return res.status(500).json({
      success: false,
      error: {
        code: 'GET_SESSIONS_ERROR',
        message: 'Failed to retrieve Q&A sessions'
      }
    });
  }
});

// POST /qa/feedback - Submit feedback on an answer
qaRoutes.post('/feedback',
  authenticateUser,
  validateRequest(feedbackSchema),
  async (req, res) => {
    try {
      const userId = req.user!.uid;
      const { questionId, helpful, comment } = req.body;

      const sessionRef = admin.firestore().collection('qa_sessions').doc(questionId);
      const sessionSnapshot = await sessionRef.get();

      if (!sessionSnapshot.exists) {
        return res.status(404).json({
          success: false,
          error: {
            code: 'QUESTION_NOT_FOUND',
            message: 'Question not found'
          }
        });
      }

      const sessionData = sessionSnapshot.data();
      if (sessionData?.userId !== userId) {
        return res.status(403).json({
          success: false,
          error: {
            code: 'ACCESS_DENIED',
            message: 'You can only provide feedback on your own questions'
          }
        });
      }

      // Update feedback
      await sessionRef.update({
        feedback: {
          helpful,
          comment: comment || null,
          submittedAt: admin.firestore.FieldValue.serverTimestamp()
        },
        updatedAt: admin.firestore.FieldValue.serverTimestamp()
      });

      return res.status(200).json({
        success: true,
        data: {
          message: 'Feedback submitted successfully'
        }
      });

    } catch (error: any) {
      console.error('Feedback submission error:', error);
      return res.status(500).json({
        success: false,
        error: {
          code: 'FEEDBACK_ERROR',
          message: 'Failed to submit feedback'
        }
      });
    }
  }
);

// GET /qa/suggestions/:documentId - Get suggested questions for a document
qaRoutes.get('/suggestions/:documentId', authenticateUser, async (req, res) => {
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

    // Verify document access
    const docSnapshot = await admin.firestore()
      .collection('documents')
      .doc(documentId)
      .get();

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
    if (documentData?.userId !== userId && !documentData?.isPublic) {
      return res.status(403).json({
        success: false,
        error: {
          code: 'ACCESS_DENIED',
          message: 'You do not have access to this document'
        }
      });
    }

    // Generate smart question suggestions based on document analysis
    const suggestions = generateQuestionSuggestions(documentData);

    return res.status(200).json({
      success: true,
      data: {
        documentId,
        suggestions
      }
    });

  } catch (error: any) {
    console.error('Get suggestions error:', error);
    return res.status(500).json({
      success: false,
      error: {
        code: 'SUGGESTIONS_ERROR',
        message: 'Failed to generate question suggestions'
      }
    });
  }
});

// Helper functions for AI response generation (mock implementations)
async function generateAIResponse(question: string, documentData: any, analysisData: any, context?: string): Promise<any> {
  // Mock AI response generation
  const processingTime = Math.floor(Math.random() * 2000) + 500; // 500-2500ms
  
  await new Promise(resolve => setTimeout(resolve, processingTime));

  const responses = {
    liability: {
      answer: "Based on my analysis of your document, there are several liability concerns. The contract includes unlimited liability provisions in Section 5.2, which could expose your organization to significant financial risk beyond the contract value. I recommend negotiating liability caps and mutual limitations.",
      confidence: 0.89,
      sources: ["Section 5.2 - Liability and Indemnification", "Section 5.3 - Risk Allocation"],
      relatedSections: ["Liability provisions", "Indemnification clauses", "Risk allocation"]
    },
    termination: {
      answer: "The termination clauses in your document appear to be asymmetric, favoring one party over the other. Section 8.1 allows immediate termination by the service provider but requires 90-day notice from your side. Consider negotiating for equal termination rights.",
      confidence: 0.92,
      sources: ["Section 8.1 - Termination", "Section 8.2 - Post-termination obligations"],
      relatedSections: ["Termination conditions", "Notice requirements", "Post-termination duties"]
    },
    payment: {
      answer: "The payment terms specify net-30 payment with late fees of 1.5% per month. While standard, you may want to negotiate for early payment discounts or extended payment terms based on your cash flow needs.",
      confidence: 0.85,
      sources: ["Section 3.1 - Payment Terms", "Section 3.2 - Late Fees"],
      relatedSections: ["Payment schedule", "Late fee provisions", "Dispute resolution"]
    }
  };

  // Simple keyword matching for mock response
  const questionLower = question.toLowerCase();
  let response = responses.liability; // default
  
  if (questionLower.includes('termination') || questionLower.includes('cancel')) {
    response = responses.termination;
  } else if (questionLower.includes('payment') || questionLower.includes('pay') || questionLower.includes('fee')) {
    response = responses.payment;
  }

  return {
    ...response,
    followUpSuggestions: [
      "What are the specific risks associated with this clause?",
      "How can I negotiate better terms?",
      "Are there industry standard alternatives?",
      "What legal precedents apply here?"
    ],
    processingTime
  };
}

async function generateFollowUpResponse(question: string, conversationHistory: any[], documentData: any): Promise<any> {
  // Mock follow-up response with conversation context
  const processingTime = Math.floor(Math.random() * 1500) + 400;
  
  await new Promise(resolve => setTimeout(resolve, processingTime));

  return {
    answer: `Based on our previous discussion about ${conversationHistory[0].question.text}, ${question.toLowerCase().includes('negotiate') 
      ? 'here are specific negotiation strategies: 1) Propose mutual liability caps, 2) Request indemnification clauses, 3) Add insurance requirements, 4) Include dispute resolution procedures.'
      : 'let me provide additional context and recommendations for your situation. The key considerations include regulatory compliance, industry standards, and risk tolerance levels.'}`,
    confidence: 0.87,
    sources: ["Previous conversation context", "Document analysis", "Legal best practices"],
    relatedSections: ["Referenced clauses from previous questions"],
    followUpSuggestions: [
      "What specific language should I propose?",
      "How do similar companies handle this?",
      "What are the potential consequences?"
    ],
    processingTime
  };
}

function generateQuestionSuggestions(documentData: any): any[] {
  const suggestions = [
    {
      category: "Risk Analysis",
      questions: [
        "What are the main liability risks in this contract?",
        "Are there any unusual or concerning clauses?",
        "How does this compare to industry standards?"
      ]
    },
    {
      category: "Terms & Conditions",
      questions: [
        "Can you explain the termination conditions?",
        "What are my payment obligations?",
        "What happens if I breach this contract?"
      ]
    },
    {
      category: "Legal Implications",
      questions: [
        "What legal remedies are available to me?",
        "Are there any regulatory compliance requirements?",
        "How enforceable are these terms?"
      ]
    },
    {
      category: "Negotiation",
      questions: [
        "Which terms should I try to negotiate?",
        "What alternative language could be proposed?",
        "Where do I have leverage in negotiations?"
      ]
    }
  ];

  return suggestions;
}