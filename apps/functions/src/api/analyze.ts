// AI Analysis API Routes
import { Router } from 'express';
import * as admin from 'firebase-admin';
import { z } from 'zod';
import { authenticateUser, validateRequest, requireSubscription } from '../utils/middleware';

export const analyzeRoutes: Router = Router();

// Validation schemas
const analyzeRiskSchema = z.object({
  documentId: z.string().min(1),
  riskTypes: z.array(z.string()).optional().default(['all']),
  severity: z.enum(['low', 'medium', 'high', 'all']).optional().default('all')
});

const compareLegalSchema = z.object({
  documentId: z.string().min(1),
  compareType: z.enum(['template', 'standard', 'custom']),
  referenceId: z.string().optional()
});

const explainTermSchema = z.object({
  term: z.string().min(1),
  context: z.string().optional(),
  documentId: z.string().optional()
});

// GET /analyze/:documentId/risks - Get risk analysis for document
analyzeRoutes.get('/:documentId/risks', authenticateUser, async (req, res) => {
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
    const { severity = 'all', riskTypes = 'all' } = req.query;

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

    // Get latest analysis
    const analysisQuery = admin.firestore()
      .collection('analysis')
      .where('documentId', '==', documentId)
      .orderBy('createdAt', 'desc')
      .limit(1);

    const analysisSnapshot = await analysisQuery.get();
    
    if (analysisSnapshot.empty) {
      return res.status(404).json({
        success: false,
        error: {
          code: 'ANALYSIS_NOT_FOUND',
          message: 'No analysis found for this document. Please process the document first.'
        }
      });
    }

    const analysisDoc = analysisSnapshot.docs[0];
    const analysisData = analysisDoc?.data();
    if (!analysisData) {
      return res.status(500).json({
        success: false,
        error: {
          code: 'ANALYSIS_DATA_ERROR',
          message: 'Analysis data is corrupted'
        }
      });
    }
    let risks = analysisData.result?.risks || [];

    // Filter by severity
    if (severity !== 'all') {
      risks = risks.filter((risk: any) => risk.severity === severity);
    }

    // Filter by risk types
    if (typeof riskTypes === 'string' && riskTypes !== 'all') {
      const typeArray = riskTypes.split(',');
      risks = risks.filter((risk: any) => typeArray.includes(risk.type));
    }

    // Add detailed recommendations for each risk
    const enrichedRisks = risks.map((risk: any) => ({
      ...risk,
      id: `risk_${Math.random().toString(36).substr(2, 9)}`,
      detailedAnalysis: {
        legalImplications: generateLegalImplications(risk),
        mitigation: generateMitigationStrategies(risk),
        precedents: generatePrecedents(risk),
        urgency: calculateUrgency(risk)
      },
      createdAt: admin.firestore.FieldValue.serverTimestamp()
    }));

    return res.status(200).json({
      success: true,
      data: {
        documentId,
        analysisId: analysisSnapshot.docs[0]?.id || 'unknown',
        totalRisks: enrichedRisks.length,
        riskBreakdown: {
          high: enrichedRisks.filter((r: any) => r.severity === 'high').length,
          medium: enrichedRisks.filter((r: any) => r.severity === 'medium').length,
          low: enrichedRisks.filter((r: any) => r.severity === 'low').length
        },
        risks: enrichedRisks,
        analysisTimestamp: analysisData.createdAt
      }
    });

  } catch (error: any) {
    console.error('Risk analysis error:', error);
    return res.status(500).json({
      success: false,
      error: {
        code: 'RISK_ANALYSIS_ERROR',
        message: 'Failed to retrieve risk analysis'
      }
    });
  }
});

// POST /analyze/risk-assessment - Perform detailed risk assessment
analyzeRoutes.post('/risk-assessment',
  authenticateUser,
  requireSubscription(['premium', 'enterprise']),
  validateRequest(analyzeRiskSchema),
  async (req, res) => {
    try {
      const userId = req.user!.uid;
      const { documentId, riskTypes, severity } = req.body;

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
      if (documentData?.userId !== userId) {
        return res.status(403).json({
          success: false,
          error: {
            code: 'ACCESS_DENIED',
            message: 'You do not have access to this document'
          }
        });
      }

      // Perform enhanced risk assessment (mock implementation)
      const detailedRiskAssessment = {
        documentId,
        assessmentType: 'detailed',
        riskProfile: {
          overallScore: 7.2,
          confidence: 0.89,
          categories: {
            liability: { score: 8.1, impact: 'high', probability: 'medium' },
            termination: { score: 6.5, impact: 'medium', probability: 'medium' },
            intellectual_property: { score: 5.2, impact: 'medium', probability: 'low' },
            payment: { score: 7.8, impact: 'high', probability: 'medium' },
            compliance: { score: 4.1, impact: 'low', probability: 'low' }
          }
        },
        detailedRisks: [
          {
            id: 'risk_liability_001',
            type: 'liability',
            severity: 'high',
            title: 'Unlimited Liability Exposure',
            description: 'The agreement contains unlimited liability provisions that could expose your organization to significant financial risk.',
            location: 'Section 5.2, Lines 89-92',
            legalBasis: 'Contract law precedent shows unlimited liability clauses are enforceable unless explicitly limited.',
            financialImpact: {
              min: 50000,
              max: 1000000,
              currency: 'USD'
            },
            mitigationStrategies: [
              'Negotiate liability caps based on contract value',
              'Add mutual liability limitations',
              'Include specific exclusions for consequential damages',
              'Consider insurance coverage for remaining liability'
            ],
            urgency: 'high',
            recommendedAction: 'immediate_negotiation'
          },
          {
            id: 'risk_termination_002',
            type: 'termination',
            severity: 'medium',
            title: 'Asymmetric Termination Rights',
            description: 'Termination clause favors one party with unequal notice periods and termination rights.',
            location: 'Section 8.1, Lines 145-152',
            legalBasis: 'Courts generally enforce termination clauses as written, making negotiation critical.',
            financialImpact: {
              min: 10000,
              max: 100000,
              currency: 'USD'
            },
            mitigationStrategies: [
              'Negotiate equal termination rights for both parties',
              'Add termination for convenience with adequate notice',
              'Include specific termination triggers and procedures',
              'Define post-termination obligations clearly'
            ],
            urgency: 'medium',
            recommendedAction: 'review_and_negotiate'
          }
        ],
        recommendations: {
          immediate: [
            'Address unlimited liability provisions before signing',
            'Review and negotiate termination clauses'
          ],
          shortTerm: [
            'Implement contract monitoring system',
            'Review insurance coverage adequacy'
          ],
          longTerm: [
            'Develop standard contract templates',
            'Establish legal review process'
          ]
        },
        complianceChecklist: {
          regulatory: [
            { requirement: 'GDPR compliance', status: 'needs_review', priority: 'high' },
            { requirement: 'Industry regulations', status: 'compliant', priority: 'medium' }
          ],
          internal: [
            { requirement: 'Company policy alignment', status: 'compliant', priority: 'low' },
            { requirement: 'Approval process', status: 'pending', priority: 'medium' }
          ]
        }
      };

      // Create detailed analysis record
      const assessmentId = admin.firestore().collection('risk_assessments').doc().id;
      await admin.firestore()
        .collection('risk_assessments')
        .doc(assessmentId)
        .set({
          id: assessmentId,
          documentId,
          userId,
          assessment: detailedRiskAssessment,
          parameters: { riskTypes, severity },
          createdAt: admin.firestore.FieldValue.serverTimestamp(),
          updatedAt: admin.firestore.FieldValue.serverTimestamp()
        });

      return res.status(200).json({
        success: true,
        data: {
          assessmentId,
          ...detailedRiskAssessment
        }
      });

    } catch (error: any) {
      console.error('Risk assessment error:', error);
      return res.status(500).json({
        success: false,
        error: {
          code: 'RISK_ASSESSMENT_ERROR',
          message: 'Failed to perform risk assessment'
        }
      });
    }
  }
);

// POST /analyze/compare - Compare document with standards/templates
analyzeRoutes.post('/compare',
  authenticateUser,
  requireSubscription(['premium', 'enterprise']),
  validateRequest(compareLegalSchema),
  async (req, res) => {
    try {
      const userId = req.user!.uid;
      const { documentId, compareType, referenceId } = req.body;

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
      if (documentData?.userId !== userId) {
        return res.status(403).json({
          success: false,
          error: {
            code: 'ACCESS_DENIED',
            message: 'You do not have access to this document'
          }
        });
      }

      // Mock comparison results
      const comparisonResult = {
        documentId,
        compareType,
        referenceId: referenceId || 'standard_template_001',
        overallSimilarity: 0.73,
        comparisonSummary: {
          matchingClauses: 15,
          missingClauses: 8,
          deviatingClauses: 12,
          totalClauses: 35
        },
        detailedComparison: {
          sections: [
            {
              name: 'Liability and Indemnification',
              similarity: 0.65,
              status: 'deviation',
              analysis: 'Your document has more restrictive liability terms than industry standard',
              recommendations: [
                'Consider adopting standard liability limitations',
                'Add mutual indemnification clauses'
              ]
            },
            {
              name: 'Termination and Cancellation',
              similarity: 0.85,
              status: 'good_match',
              analysis: 'Termination clauses align well with industry standards',
              recommendations: []
            },
            {
              name: 'Intellectual Property',
              similarity: 0.45,
              status: 'missing',
              analysis: 'Document lacks comprehensive IP protection clauses',
              recommendations: [
                'Add IP ownership definitions',
                'Include confidentiality provisions',
                'Define derivative work rights'
              ]
            }
          ]
        },
        riskDifferential: {
          additionalRisks: [
            'Non-standard liability terms increase risk exposure',
            'Missing IP clauses create ownership uncertainties'
          ],
          reducedRisks: [
            'Strong termination provisions provide exit flexibility'
          ]
        },
        improvementSuggestions: [
          'Adopt standard liability framework',
          'Add comprehensive IP protection clauses',
          'Include standard force majeure provisions'
        ]
      };

      // Save comparison results
      const comparisonId = admin.firestore().collection('document_comparisons').doc().id;
      await admin.firestore()
        .collection('document_comparisons')
        .doc(comparisonId)
        .set({
          id: comparisonId,
          documentId,
          userId,
          comparison: comparisonResult,
          createdAt: admin.firestore.FieldValue.serverTimestamp(),
          updatedAt: admin.firestore.FieldValue.serverTimestamp()
        });

      return res.status(200).json({
        success: true,
        data: {
          comparisonId,
          ...comparisonResult
        }
      });

    } catch (error: any) {
      console.error('Document comparison error:', error);
      return res.status(500).json({
        success: false,
        error: {
          code: 'COMPARISON_ERROR',
          message: 'Failed to compare document'
        }
      });
    }
  }
);

// POST /analyze/explain-term - Explain legal terms
analyzeRoutes.post('/explain-term',
  authenticateUser,
  validateRequest(explainTermSchema),
  async (req, res) => {
    try {
      const { term, context, documentId } = req.body;

      // Mock term explanation (in real implementation, this would use AI)
      const explanation = {
        term,
        context: context || '',
        documentId: documentId || null,
        definition: {
          simple: getSimpleDefinition(term),
          legal: getLegalDefinition(term),
          examples: getExamples(term)
        },
        implications: {
          risks: getRiskImplications(term),
          benefits: getBenefits(term),
          considerations: getConsiderations(term)
        },
        relatedTerms: getRelatedTerms(term),
        sources: [
          'Black\'s Law Dictionary',
          'Contract Law Principles',
          'Industry Best Practices'
        ],
        confidence: 0.92
      };

      return res.status(200).json({
        success: true,
        data: explanation
      });

    } catch (error: any) {
      console.error('Term explanation error:', error);
      return res.status(500).json({
        success: false,
        error: {
          code: 'EXPLANATION_ERROR',
          message: 'Failed to explain legal term'
        }
      });
    }
  }
);

// Helper functions for mock data generation
function generateLegalImplications(risk: any): string {
  const implications = {
    liability: 'Unlimited liability clauses can result in financial exposure beyond the contract value, potentially including consequential damages, lost profits, and third-party claims.',
    termination: 'Asymmetric termination rights may limit your ability to exit unfavorable agreements and could result in penalties or continued obligations.',
    'intellectual_property': 'Unclear IP rights can lead to disputes over ownership, licensing, and usage rights of created or modified intellectual property.',
    payment: 'Unfavorable payment terms can impact cash flow and increase collection risks.',
    compliance: 'Non-compliance with regulatory requirements can result in fines, legal action, and operational restrictions.'
  };
  return implications[risk.type as keyof typeof implications] || 'Legal implications vary based on specific contract terms and applicable law.';
}

function generateMitigationStrategies(risk: any): string[] {
  const strategies = {
    liability: [
      'Negotiate liability caps equal to contract value',
      'Exclude consequential and punitive damages',
      'Add mutual liability limitations',
      'Require adequate insurance coverage'
    ],
    termination: [
      'Negotiate equal termination rights',
      'Include termination for convenience clauses',
      'Add adequate notice periods',
      'Define post-termination obligations'
    ],
    'intellectual_property': [
      'Define IP ownership clearly',
      'Include work-for-hire provisions',
      'Add confidentiality agreements',
      'Specify derivative work rights'
    ]
  };
  return strategies[risk.type as keyof typeof strategies] || ['Consult with legal counsel for specific mitigation strategies'];
}

function generatePrecedents(risk: any): string[] {
  return [
    'Similar provisions have been enforced in [State] courts',
    'Industry standard practices recommend alternative approaches',
    'Recent case law supports more balanced risk allocation'
  ];
}

function calculateUrgency(risk: any): string {
  const severityMap = {
    high: 'immediate',
    medium: 'within_30_days',
    low: 'review_cycle'
  };
  return severityMap[risk.severity as keyof typeof severityMap] || 'review_cycle';
}

function getSimpleDefinition(term: string): string {
  const definitions = {
    'indemnification': 'A promise to compensate someone for any losses or damages they might suffer.',
    'force majeure': 'Unforeseeable circumstances that prevent a party from fulfilling a contract.',
    'liquidated damages': 'Pre-agreed amount of compensation for specific contract breaches.',
    'assignment': 'Transferring contract rights or obligations to another party.'
  };
  return definitions[term.toLowerCase() as keyof typeof definitions] || `A legal term requiring specific contextual analysis: ${term}`;
}

function getLegalDefinition(term: string): string {
  const legalDefs = {
    'indemnification': 'A contractual obligation by which one party agrees to secure another party against loss or damage arising from the occurrence of a specified event or from the acts of a specified person.',
    'force majeure': 'A superior or irresistible force; an event that is a result of the elements of nature, as opposed to one caused by human behavior, that cannot be anticipated or controlled.',
    'liquidated damages': 'A sum agreed upon by the parties to a contract to be paid as compensation for a breach, especially as a substitute for actual damages that are difficult to determine.',
    'assignment': 'The transfer of rights or benefits from one person (assignor) to another (assignee) under a contract or other legal instrument.'
  };
  return legalDefs[term.toLowerCase() as keyof typeof legalDefs] || `Legal definition requires case-specific analysis for: ${term}`;
}

function getExamples(term: string): string[] {
  const examples = {
    'indemnification': [
      'A contractor agrees to indemnify the client for any third-party injury claims',
      'Software vendor indemnifies against IP infringement claims'
    ],
    'force majeure': [
      'Natural disasters preventing contract performance',
      'Government regulations prohibiting contracted activities'
    ],
    'liquidated damages': [
      '$1000 per day penalty for late project delivery',
      'Fixed penalty amount for early lease termination'
    ]
  };
  return examples[term.toLowerCase() as keyof typeof examples] || [`Context-specific examples needed for: ${term}`];
}

function getRiskImplications(term: string): string[] {
  return [
    'Potential financial liability',
    'Performance obligations may be affected',
    'Enforcement varies by jurisdiction'
  ];
}

function getBenefits(term: string): string[] {
  return [
    'Provides legal clarity and certainty',
    'Establishes enforceable rights and obligations',
    'Reduces potential disputes'
  ];
}

function getConsiderations(term: string): string[] {
  return [
    'Ensure mutual and balanced application',
    'Consider practical enforceability',
    'Review applicable governing law'
  ];
}

function getRelatedTerms(term: string): string[] {
  const related = {
    'indemnification': ['hold harmless', 'liability', 'damages', 'insurance'],
    'force majeure': ['impossibility', 'frustration of purpose', 'excuse of performance'],
    'liquidated damages': ['penalty', 'actual damages', 'mitigation', 'breach']
  };
  return related[term.toLowerCase() as keyof typeof related] || ['Legal counsel consultation recommended'];
}