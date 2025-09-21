// AI service configuration
export const AI_CONFIG = {
  models: {
    GEMINI_PRO: 'gemini-1.5-pro',
    GEMINI_FLASH: 'gemini-1.5-flash',
    DOCUMENT_AI: 'document-ai-processor'
  },
  limits: {
    MAX_TOKENS_PER_REQUEST: 100000,
    MAX_REQUESTS_PER_MINUTE: 60,
    MAX_DOCUMENT_SIZE: 10 * 1024 * 1024 // 10MB
  },
  prompts: {
    DOCUMENT_ANALYSIS: `
      Analyze this legal document and provide:
      1. Document type identification
      2. Key sections and clauses
      3. Risk assessment (low/medium/high/critical)
      4. Simplified explanation in plain English
      5. Hidden or unusual terms
      6. Important dates and deadlines
    `,
    RISK_ASSESSMENT: `
      Assess the risk level of this document focusing on:
      1. Financial obligations and penalties
      2. Liability and indemnification clauses
      3. Termination conditions
      4. Auto-renewal terms
      5. Arbitration requirements
    `,
    QUESTION_ANSWERING: `
      Answer this question about the document:
      - Provide a clear, accurate answer
      - Reference specific clauses when possible
      - Explain legal implications in simple terms
      - Suggest follow-up questions if relevant
    `
  },
  confidence: {
    MIN_CONFIDENCE: 0.7,
    HIGH_CONFIDENCE: 0.9
  }
};

// Translation configuration
export const TRANSLATION_CONFIG = {
  supportedLanguages: [
    'en', 'es', 'fr', 'de', 'pt', 'it', 'ru', 'ar', 'zh', 'ja',
    'hi', 'bn', 'te', 'mr', 'ta', 'gu', 'kn', 'ml', 'pa', 'or'
  ],
  defaultLanguage: 'en',
  autoDetect: true
};