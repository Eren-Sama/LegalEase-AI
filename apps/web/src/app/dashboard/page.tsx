'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { motion } from 'framer-motion';
import { 
  Upload, 
  FileText, 
  Search, 
  Star, 
  Clock, 
  MoreHorizontal,
  TrendingUp,
  Users,
  Shield,
  Zap,
  Bot,
  FileCheck,
  AlertTriangle,
  Filter,
  Calendar,
  Eye,
  Download,
  Share2,
  MessageCircle,
  Settings,
  User,
  Award,
  Brain,
  CheckCircle,
  Plus,
  Menu,
  X,
  Sun,
  Moon,
  Palette
} from 'lucide-react';
import { useAuth } from '@/contexts/auth-context';
import NewChatbot from '@/components/NewChatbot';
import { UserSettings } from '@/components';
import EnhancedDocumentUpload from '@/components/EnhancedDocumentUpload';
import DocumentAnalysisResults from '@/components/DocumentAnalysisResults';
import PremiumDocumentUpload from '@/components/PremiumDocumentUpload';
import CompactDocumentUpload from '@/components/CompactDocumentUpload';
import EnhancedAnalysisResults from '@/components/EnhancedAnalysisResults';
import DocumentViewer from '@/components/DocumentViewer';

interface Document {
  id: string;
  name: string;
  type: string;
  size: number; // Keep as number for internal use
  uploadedAt: string;
  status: 'processing' | 'completed' | 'error';
  aiSummary?: string;
  riskLevel?: 'low' | 'medium' | 'high';
  tags?: string[];
  lastViewed?: string;
  sharedWith?: string[];
  confidenceScore?: number;
  keyTerms?: string[];
  complianceStatus?: 'compliant' | 'non-compliant' | 'needs-review';
  queries?: number;
  analysis?: any; // Store the full analysis data
}

// Theme types
type ThemeMode = 'light' | 'dark' | 'system';

const languages = [
  { code: 'en', name: 'English', flag: '🇺🇸' },
  { code: 'es', name: 'Español', flag: '🇪🇸' },
  { code: 'fr', name: 'Français', flag: '🇫🇷' },
  { code: 'de', name: 'Deutsch', flag: '🇩🇪' },
  { code: 'zh', name: '中文', flag: '🇨🇳' },
  { code: 'ja', name: '日本語', flag: '🇯🇵' },
  { code: 'hi', name: 'हिंदी', flag: '🇮🇳' },
  { code: 'ar', name: 'العربية', flag: '🇸🇦' }
];

export default function DashboardPage() {
  const { user } = useAuth();
  
  // State management
  const [documents, setDocuments] = useState<Document[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState<'all' | 'processing' | 'completed' | 'error'>('all');
  const [showUpload, setShowUpload] = useState(false);
  const [selectedDocument, setSelectedDocument] = useState<Document | null>(null);
  const [showChatbot, setShowChatbot] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [showProfile, setShowProfile] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [themeMode, setThemeMode] = useState<ThemeMode>('system');
  const [isDark, setIsDark] = useState(false);
  const [activeSection, setActiveSection] = useState<'documents' | 'ai-analysis' | 'compliance' | 'collaboration' | 'templates'>('documents');
  const [language, setLanguage] = useState('en');
  
  // AI Analysis state (moved from render function to fix hooks error)
  const [analysisDocument, setAnalysisDocument] = useState<Document | null>(null);
  const [analysisResults, setAnalysisResults] = useState<any>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  
  // New enhanced analysis workflow state
  const [showAnalysisPage, setShowAnalysisPage] = useState(false);
  const [currentAnalysisData, setCurrentAnalysisData] = useState<any>(null);
  const [documentsAnalyzed, setDocumentsAnalyzed] = useState(0);
  const [showExpertChat, setShowExpertChat] = useState(false);

  // Compliance section state (moved from render function to fix hooks error)
  const [selectedStandard, setSelectedStandard] = useState<string>('gdpr');
  const [complianceResults, setComplianceResults] = useState<any>(null);
  const [isChecking, setIsChecking] = useState(false);

  // Template generation functions
  const generateEmploymentContract = () => `EMPLOYMENT CONTRACT

PARTIES:
Employer: [COMPANY NAME]
Employee: [EMPLOYEE NAME]

1. POSITION AND DUTIES
The Employee agrees to work as [JOB TITLE] and will perform duties including:
- [DUTY 1]
- [DUTY 2] 
- [DUTY 3]

2. COMPENSATION
- Base Salary: $[AMOUNT] per year
- Payment Schedule: [MONTHLY/BIWEEKLY]
- Benefits: [HEALTH INSURANCE/RETIREMENT/PTO]

3. TERM OF EMPLOYMENT
This contract begins on [START DATE] and continues until terminated according to the terms herein.

4. CONFIDENTIALITY
Employee agrees to maintain confidentiality of all proprietary information and trade secrets.

5. TERMINATION
Either party may terminate this agreement with [NOTICE PERIOD] days written notice.

6. GOVERNING LAW
This contract shall be governed by the laws of [STATE/JURISDICTION].

Employer Signature: _________________ Date: _________
Employee Signature: _________________ Date: _________

[This is a template. Please customize with specific terms and consult legal counsel.]`;

  const generateNDAContract = () => `NON-DISCLOSURE AGREEMENT (NDA)

PARTIES:
Disclosing Party: [COMPANY/INDIVIDUAL NAME]
Receiving Party: [COMPANY/INDIVIDUAL NAME]

1. CONFIDENTIAL INFORMATION
For purposes of this Agreement, "Confidential Information" includes:
- Technical data, trade secrets, know-how, research, product plans
- Customer lists, supplier information, financial data
- Any information marked as confidential or proprietary

2. OBLIGATIONS
The Receiving Party agrees to:
- Keep all Confidential Information strictly confidential
- Use information solely for evaluation purposes
- Not disclose to any third parties without written consent
- Return or destroy information upon request

3. EXCEPTIONS
This agreement does not apply to information that:
- Is already publicly known
- Was independently developed
- Is required to be disclosed by law

4. TERM
This Agreement remains in effect for [DURATION] years from the date signed.

5. REMEDIES
Breach of this agreement may result in irreparable harm, entitling the Disclosing Party to injunctive relief.

Disclosing Party: _________________ Date: _________
Receiving Party: _________________ Date: _________

[This is a template. Please customize and consult legal counsel.]`;

  const generateServiceAgreement = () => `SERVICE AGREEMENT

PARTIES:
Service Provider: [PROVIDER NAME]
Client: [CLIENT NAME]

1. SERVICES
The Provider agrees to perform the following services:
- [SERVICE 1]
- [SERVICE 2]
- [SERVICE 3]

2. PAYMENT TERMS
- Total Fee: $[AMOUNT]
- Payment Schedule: [TERMS]
- Late Payment: [PENALTY] after [DAYS] days

3. TIMELINE
- Start Date: [DATE]
- Completion Date: [DATE]
- Milestones: [LIST MILESTONES]

4. DELIVERABLES
Provider will deliver:
- [DELIVERABLE 1]
- [DELIVERABLE 2]
- [DELIVERABLE 3]

5. INTELLECTUAL PROPERTY
Work products created under this agreement shall belong to [CLIENT/PROVIDER].

6. LIABILITY
Provider's liability is limited to the total amount paid under this agreement.

7. TERMINATION
Either party may terminate with [NOTICE PERIOD] days written notice.

Provider Signature: _________________ Date: _________
Client Signature: _________________ Date: _________

[This is a template. Please customize and consult legal counsel.]`;

  const generateLeaseAgreement = () => `LEASE AGREEMENT

LANDLORD: [LANDLORD NAME]
TENANT: [TENANT NAME]
PROPERTY: [PROPERTY ADDRESS]

1. LEASE TERM
- Start Date: [DATE]
- End Date: [DATE]
- Monthly Rent: $[AMOUNT]
- Due Date: [DAY] of each month

2. SECURITY DEPOSIT
Amount: $[AMOUNT]
Conditions for return: [CONDITIONS]

3. USE OF PREMISES
Property to be used as [RESIDENTIAL/COMMERCIAL] only.

4. MAINTENANCE AND REPAIRS
- Tenant responsible for: [LIST TENANT RESPONSIBILITIES]
- Landlord responsible for: [LIST LANDLORD RESPONSIBILITIES]

5. UTILITIES
Tenant responsible for: [UTILITIES LIST]

6. PETS
[ALLOWED/NOT ALLOWED] with additional deposit of $[AMOUNT]

7. EARLY TERMINATION
Penalty for early termination: [TERMS]

8. GOVERNING LAW
This lease is governed by [STATE] law.

Landlord Signature: _________________ Date: _________
Tenant Signature: _________________ Date: _________

[This is a template. Please customize and consult legal counsel.]`;

  const generatePartnershipAgreement = () => `PARTNERSHIP AGREEMENT

PARTNERS:
Partner 1: [NAME] - [OWNERSHIP PERCENTAGE]%
Partner 2: [NAME] - [OWNERSHIP PERCENTAGE]%

1. BUSINESS PURPOSE
The partnership will engage in: [BUSINESS DESCRIPTION]

2. CAPITAL CONTRIBUTIONS
- Partner 1: $[AMOUNT]
- Partner 2: $[AMOUNT]

3. PROFIT AND LOSS DISTRIBUTION
Profits and losses distributed according to ownership percentages.

4. MANAGEMENT
- Decision-making: [CONSENSUS/MAJORITY/OTHER]
- Daily operations managed by: [PARTNER NAME/BOTH]

5. BOOKS AND RECORDS
Partnership will maintain accurate financial records accessible to all partners.

6. WITHDRAWAL OF PARTNER
Process for partner withdrawal: [TERMS AND CONDITIONS]

7. DISSOLUTION
Partnership may be dissolved by: [CONDITIONS]

8. DISPUTE RESOLUTION
Disputes resolved through: [MEDIATION/ARBITRATION]

Partner 1 Signature: _________________ Date: _________
Partner 2 Signature: _________________ Date: _________

[This is a template. Please customize and consult legal counsel.]`;

  const generateTermsOfService = () => `TERMS OF SERVICE

Last Updated: [DATE]

1. ACCEPTANCE OF TERMS
By using [SERVICE/WEBSITE NAME], you agree to these Terms of Service.

2. DESCRIPTION OF SERVICE
[SERVICE/WEBSITE NAME] provides: [SERVICE DESCRIPTION]

3. USER ACCOUNTS
- Users must provide accurate information
- Users responsible for account security
- One account per user

4. ACCEPTABLE USE
Users may NOT:
- Violate any laws or regulations
- Infringe on intellectual property rights
- Upload malicious content
- Attempt to hack or disrupt the service

5. INTELLECTUAL PROPERTY
All content and materials are owned by [COMPANY NAME] or licensed.

6. PRIVACY
Your privacy is governed by our Privacy Policy.

7. DISCLAIMERS
Service provided "as is" without warranties of any kind.

8. LIMITATION OF LIABILITY
Liability limited to amount paid for services in the past 12 months.

9. TERMINATION
We may terminate accounts for violations of these terms.

10. GOVERNING LAW
These terms governed by [STATE/JURISDICTION] law.

For questions, contact: [EMAIL]

[This is a template. Please customize and consult legal counsel.]`;

  // Template download function
  const downloadTemplate = (templateId: string, title: string) => {
    const templates: Record<string, () => string> = {
      'employment-contract': generateEmploymentContract,
      'nda': generateNDAContract,
      'service-agreement': generateServiceAgreement,
      'lease-agreement': generateLeaseAgreement,
      'partnership-agreement': generatePartnershipAgreement,
      'terms-of-service': generateTermsOfService,
    };

    const templateFunction = templates[templateId];
    const content = templateFunction ? templateFunction() : 'Template not found';
    
    // Create blob and download
    const blob = new Blob([content], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${title.replace(/\s+/g, '-').toLowerCase()}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  // Theme management
  useEffect(() => {
    const savedTheme = localStorage.getItem('theme') as ThemeMode || 'system';
    setThemeMode(savedTheme);
    
    const applyTheme = (theme: ThemeMode) => {
      if (theme === 'system') {
        const systemDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
        setIsDark(systemDark);
        if (systemDark) {
          document.documentElement.classList.add('dark');
        } else {
          document.documentElement.classList.remove('dark');
        }
      } else {
        const dark = theme === 'dark';
        setIsDark(dark);
        if (dark) {
          document.documentElement.classList.add('dark');
        } else {
          document.documentElement.classList.remove('dark');
        }
      }
    };

    applyTheme(savedTheme);

    // Listen for theme changes from UserSettings
    const handleThemeChangeEvent = (event: CustomEvent<ThemeMode>) => {
      setThemeMode(event.detail);
      applyTheme(event.detail);
    };
    
    window.addEventListener('theme-change', handleThemeChangeEvent as EventListener);

    // Listen for system theme changes
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    const handleChange = () => {
      if (savedTheme === 'system') {
        applyTheme('system');
      }
    };

    mediaQuery.addEventListener('change', handleChange);
    return () => {
      mediaQuery.removeEventListener('change', handleChange);
      window.removeEventListener('theme-change', handleThemeChangeEvent as EventListener);
    };
  }, []);

  const toggleTheme = (mode: ThemeMode) => {
    setThemeMode(mode);
    localStorage.setItem('theme', mode);
    
    if (mode === 'system') {
      const systemDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
      setIsDark(systemDark);
      if (systemDark) {
        document.documentElement.classList.add('dark');
      } else {
        document.documentElement.classList.remove('dark');
      }
    } else {
      const dark = mode === 'dark';
      setIsDark(dark);
      if (dark) {
        document.documentElement.classList.add('dark');
      } else {
        document.documentElement.classList.remove('dark');
      }
    }
  };

  const handleLanguageChange = (langCode: string) => {
    setLanguage(langCode);
    localStorage.setItem('language', langCode);
    // Here you would implement actual translation logic
    // For now, we'll just store the preference
  };

  // Format file size properly
  const formatFileSize = (bytes: number): string => {
    if (bytes === 0 || !bytes) return '0 B';
    const k = 1024;
    const sizes = ['B', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + ' ' + sizes[i];
  };

  // Handle document addition from upload component
  const handleDocumentAdd = useCallback((newDoc: any) => {
    const documentWithId: Document = {
      id: newDoc.id || Date.now().toString(),
      name: newDoc.name,
      type: newDoc.type,
      size: newDoc.size || 0,
      uploadedAt: new Date().toISOString(),
      status: 'processing',
      aiSummary: '',
      riskLevel: 'low',
      tags: [],
      lastViewed: new Date().toISOString(),
      sharedWith: [],
      confidenceScore: 0,
      keyTerms: [],
      complianceStatus: 'needs-review'
    };
    
    setDocuments(prev => [...prev, documentWithId]);
    setShowUpload(false);
    
    // Simulate processing
    setTimeout(() => {
      setDocuments(prev => prev.map(doc => 
        doc.id === documentWithId.id 
          ? { 
              ...doc, 
              status: 'completed',
              aiSummary: 'AI analysis completed successfully.',
              confidenceScore: Math.floor(Math.random() * 30) + 70,
              keyTerms: ['contract', 'liability', 'terms'],
              complianceStatus: Math.random() > 0.5 ? 'compliant' : 'needs-review'
            }
          : doc
      ));
    }, 3000);
  }, []);

  // Handle analysis completion from CompactDocumentUpload
  const handleAnalysisComplete = useCallback((analysis: any) => {
    console.log('🎯 Dashboard handleAnalysisComplete called with analysis:', analysis);
    console.log('📋 Analysis data structure:', JSON.stringify(analysis, null, 2));
    
    // Set the analysis results to display  
    setCurrentAnalysisData(analysis);
    setShowAnalysisPage(true);
    setDocumentsAnalyzed(prev => prev + 1);
    
    console.log('📊 Setting analysis data and showing premium analysis page');
    console.log('✅ showAnalysisPage set to true, currentAnalysisData:', !!analysis);
    
    // Create document from analysis data
    const newDoc: Document = {
      id: Date.now().toString(),
      name: analysis.documentType || analysis.fileName || 'Analyzed Document',
      type: 'pdf',
      size: 0,
      uploadedAt: new Date().toISOString(),
      status: 'completed',
      aiSummary: analysis.summary?.substring(0, 200) + '...' || 'Analysis completed',
      riskLevel: analysis.riskAssessment?.overallRisk || 'medium',
      tags: [analysis.documentType || 'Legal Document'],
      lastViewed: new Date().toISOString(),
      confidenceScore: analysis.confidence / 100 || 0.95,
      keyTerms: analysis.legalTerms?.slice(0, 5).map((term: any) => term.term) || [],
      complianceStatus: 'compliant',
      analysis: analysis // Store the full analysis data
    };
    
    setDocuments(prev => [newDoc, ...prev]);
    setShowUpload(false);
    
    console.log('✅ Premium dashboard analysis complete handling finished');
  }, []);

  // Handle expert chat from analysis page
  const handleChatWithExpert = useCallback(() => {
    setShowExpertChat(true);
    setShowAnalysisPage(false);
  }, []);

  // Filter documents based on search and status
  const filteredDocuments = documents.filter(doc => {
    const matchesSearch = doc.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = filterStatus === 'all' || doc.status === filterStatus;
    return matchesSearch && matchesFilter;
  });

  // Stats calculation
  const stats = {
    total: documents.length,
    processing: documents.filter(d => d.status === 'processing').length,
    completed: documents.filter(d => d.status === 'completed').length,
    highRisk: documents.filter(d => d.riskLevel === 'high').length
  };

  // Render different sections based on activeSection
  const renderSectionContent = () => {
    switch (activeSection) {
      case 'documents':
        return renderDocumentsSection();
      case 'ai-analysis':
        return renderAIAnalysisSection();
      case 'compliance':
        return renderComplianceSection();
      case 'collaboration':
        return renderCollaborationSection();
      case 'templates':
        return renderTemplatesSection();
      default:
        return renderDocumentsSection();
    }
  };

  const renderDocumentsSection = () => (
    <>
      {/* Action Bar */}
      <div className="flex flex-col sm:flex-row gap-4 mb-6">
        <div className="flex-1">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              placeholder="Search documents..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-3 bg-card border border-border rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all text-gray-900 dark:text-gray-100"
            />
          </div>
        </div>
        
        <div className="flex items-center space-x-2">
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value as any)}
            className="px-4 py-3 bg-card border border-border rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900 dark:text-gray-100"
          >
            <option value="all">All Status</option>
            <option value="processing">Processing</option>
            <option value="completed">Completed</option>
            <option value="error">Error</option>
          </select>
          
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setShowUpload(true)}
            className="px-6 py-3 bg-gradient-to-r from-blue-500 to-purple-600 text-white font-medium rounded-xl hover:shadow-lg transition-all duration-300 flex items-center space-x-2"
          >
            <Plus className="w-5 h-5" />
            <span>Upload</span>
          </motion.button>
        </div>
      </div>

      {/* Documents Grid or Empty State */}
      {filteredDocuments.length === 0 && documents.length === 0 ? (
        <EmptyState />
      ) : filteredDocuments.length === 0 ? (
        <div className="text-center py-12">
          <Search className="w-12 h-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100 mb-2">
            No documents found
          </h3>
          <p className="text-gray-600 dark:text-gray-400">
            Try adjusting your search or filter criteria.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
          {filteredDocuments.map((document) => (
            <DocumentCard
              key={document.id}
              document={document}
              onSelect={setSelectedDocument}
              formatFileSize={formatFileSize}
            />
          ))}
        </div>
      )}
    </>
  );

  const renderAIAnalysisSection = () => {
    const performAnalysis = async (document: Document) => {
      setIsAnalyzing(true);
      setAnalysisDocument(document);
      
      // Simulate AI analysis
      setTimeout(() => {
        const mockAnalysis = {
          overallRisk: Math.random() > 0.5 ? 'medium' : 'low',
          confidenceScore: Math.floor(Math.random() * 20) + 80,
          keyFindings: [
            'Payment terms are clearly defined with reasonable timeframes',
            'Liability clauses may expose you to significant risk',
            'Intellectual property rights need clarification',
            'Termination procedures are well-structured'
          ],
          recommendations: [
            'Consider adding liability caps to limit exposure',
            'Clarify intellectual property ownership terms',
            'Review indemnification clauses for mutual protection',
            'Add force majeure provisions for unexpected events'
          ],
          complianceStatus: Math.random() > 0.3 ? 'compliant' : 'needs-review',
          legalConcerns: [
            { severity: 'high', description: 'Broad liability exposure without caps' },
            { severity: 'medium', description: 'Vague intellectual property assignment' },
            { severity: 'low', description: 'Standard confidentiality terms' }
          ]
        };
        
        setAnalysisResults(mockAnalysis);
        setIsAnalyzing(false);
      }, 2000);
    };

    return (
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-12">
          <div className="w-20 h-20 bg-gradient-to-br from-blue-500/10 to-purple-500/10 rounded-2xl flex items-center justify-center mx-auto mb-6">
            <Brain className="w-10 h-10 text-blue-600 dark:text-blue-400" />
          </div>
          <h2 className="text-3xl font-bold text-gray-900 dark:text-gray-100 mb-4">AI-Powered Legal Analysis</h2>
          <p className="text-lg text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
            Get comprehensive insights, risk assessments, and recommendations for your legal documents using advanced AI technology.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          <FeatureCard
            icon={Brain}
            title="Smart Analysis"
            description="Advanced AI algorithms analyze contract terms, identify risks, and provide actionable insights."
            color="blue"
          />
          <FeatureCard
            icon={Shield}
            title="Risk Assessment"
            description="Comprehensive risk evaluation with severity ratings and mitigation recommendations."
            color="red"
          />
          <FeatureCard
            icon={CheckCircle}
            title="Compliance Check"
            description="Automated compliance verification against industry standards and regulations."
            color="green"
          />
        </div>

        <div className="grid lg:grid-cols-2 gap-6">
          {/* Document Selection */}
          <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-xl rounded-2xl p-6 border border-border">
            <h3 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-6">Select Document for Analysis</h3>
            {documents.length > 0 ? (
              <div className="space-y-4">
                {documents.map((doc) => (
                  <div key={doc.id} className={`p-4 rounded-xl border transition-all cursor-pointer ${
                    analysisDocument?.id === doc.id 
                      ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20' 
                      : 'border-gray-200 dark:border-gray-600 hover:border-blue-300 dark:hover:border-blue-700'
                  }`} onClick={() => performAnalysis(doc)}>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-4">
                        <FileText className="w-8 h-8 text-blue-600 dark:text-blue-400" />
                        <div>
                          <h4 className="font-medium text-gray-900 dark:text-gray-100">{doc.name}</h4>
                          <p className="text-sm text-gray-600 dark:text-gray-400">
                            {doc.type} • {(doc.size / 1024).toFixed(1)}KB
                          </p>
                        </div>
                      </div>
                      <div className="text-right">
                        <span className={`px-2 py-1 text-xs rounded-full ${
                          doc.riskLevel === 'high' ? 'bg-red-100 text-red-600 dark:bg-red-900/20 dark:text-red-400' :
                          doc.riskLevel === 'medium' ? 'bg-yellow-100 text-yellow-600 dark:bg-yellow-900/20 dark:text-yellow-400' :
                          'bg-green-100 text-green-600 dark:bg-green-900/20 dark:text-green-400'
                        }`}>
                          {doc.riskLevel} risk
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-12 text-gray-500 dark:text-gray-400">
                <FileText className="w-16 h-16 mx-auto mb-4 opacity-50" />
                <p>No documents available for analysis</p>
                <p className="text-sm">Upload documents to get started</p>
              </div>
            )}
          </div>

          {/* Analysis Results */}
          <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-xl rounded-2xl p-6 border border-border">
            <h3 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-6">Analysis Results</h3>
            
            {isAnalyzing ? (
              <div className="text-center py-12">
                <div className="w-16 h-16 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin mx-auto mb-4"></div>
                <p className="text-gray-600 dark:text-gray-400">Analyzing document...</p>
                <p className="text-sm text-gray-500 dark:text-gray-500">This may take a few moments</p>
              </div>
            ) : analysisResults ? (
              <div className="space-y-6">
                {/* Overall Assessment */}
                <div>
                  <h4 className="font-medium text-gray-900 dark:text-gray-100 mb-3">Overall Assessment</h4>
                  <div className="flex items-center gap-4 mb-4">
                    <div className={`px-3 py-1 rounded-full text-sm font-medium ${
                      analysisResults.overallRisk === 'high' ? 'bg-red-100 text-red-700 dark:bg-red-900/20 dark:text-red-400' :
                      analysisResults.overallRisk === 'medium' ? 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/20 dark:text-yellow-400' :
                      'bg-green-100 text-green-700 dark:bg-green-900/20 dark:text-green-400'
                    }`}>
                      {analysisResults.overallRisk.toUpperCase()} RISK
                    </div>
                    <div className="text-sm text-gray-600 dark:text-gray-400">
                      {analysisResults.confidenceScore}% confidence
                    </div>
                  </div>
                </div>

                {/* Key Findings */}
                <div>
                  <h4 className="font-medium text-gray-900 dark:text-gray-100 mb-3">Key Findings</h4>
                  <ul className="space-y-2">
                    {analysisResults.keyFindings.map((finding: string, index: number) => (
                      <li key={index} className="flex items-start gap-2 text-sm text-gray-600 dark:text-gray-400">
                        <CheckCircle className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
                        <span>{finding}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Recommendations */}
                <div>
                  <h4 className="font-medium text-gray-900 dark:text-gray-100 mb-3">Recommendations</h4>
                  <ul className="space-y-2">
                    {analysisResults.recommendations.map((rec: string, index: number) => (
                      <li key={index} className="flex items-start gap-2 text-sm text-gray-600 dark:text-gray-400">
                        <AlertTriangle className="w-4 h-4 text-amber-500 mt-0.5 flex-shrink-0" />
                        <span>{rec}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Action Buttons */}
                <div className="flex gap-3 pt-4">
                  <button 
                    onClick={() => setShowChatbot(true)}
                    className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                  >
                    Ask AI Questions
                  </button>
                  <button className="px-4 py-2 border border-border rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
                    Export Report
                  </button>
                </div>
              </div>
            ) : (
              <div className="text-center py-12 text-gray-500 dark:text-gray-400">
                <Brain className="w-16 h-16 mx-auto mb-4 opacity-50" />
                <p>Select a document to start analysis</p>
                <p className="text-sm">Click on any document from the left panel</p>
              </div>
            )}
          </div>
        </div>
      </div>
    );
  };

  const renderComplianceSection = () => {
    const complianceStandards = [
      { id: 'gdpr', name: 'GDPR', description: 'General Data Protection Regulation', icon: Shield },
      { id: 'employment', name: 'Employment Law', description: 'Employment Standards Compliance', icon: Users },
      { id: 'contracts', name: 'Contract Law', description: 'Standard Contract Requirements', icon: FileText },
      { id: 'privacy', name: 'Privacy Laws', description: 'Privacy and Data Protection', icon: Shield }
    ];

    const runComplianceCheck = async (standard: string) => {
      setIsChecking(true);
      setSelectedStandard(standard);
      
      // Simulate compliance check
      setTimeout(() => {
        const mockResults = {
          overallScore: Math.floor(Math.random() * 30) + 70,
          status: Math.random() > 0.4 ? 'compliant' : 'needs-review',
          issues: [
            { severity: 'high', description: 'Data retention period not specified', regulation: 'Article 5(1)(e)' },
            { severity: 'medium', description: 'Consent withdrawal mechanism unclear', regulation: 'Article 7(3)' },
            { severity: 'low', description: 'Data controller contact information complete', regulation: 'Article 13(1)(a)' }
          ],
          recommendations: [
            'Add specific data retention periods for different data types',
            'Include clear instructions for consent withdrawal',
            'Consider adding data breach notification procedures'
          ],
          checkedDocuments: documents.length,
          lastUpdated: new Date().toLocaleDateString()
        };
        
        setComplianceResults(mockResults);
        setIsChecking(false);
      }, 2000);
    };

    return (
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-12">
          <div className="w-20 h-20 bg-gradient-to-br from-green-500/10 to-emerald-500/10 rounded-2xl flex items-center justify-center mx-auto mb-6">
            <Shield className="w-10 h-10 text-green-600 dark:text-green-400" />
          </div>
          <h2 className="text-3xl font-bold text-gray-900 dark:text-gray-100 mb-4">Compliance Management</h2>
          <p className="text-lg text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
            Ensure your documents meet regulatory requirements and industry standards with automated compliance checking.
          </p>
        </div>

        <div className="grid lg:grid-cols-3 gap-6">
          {/* Standards Selection */}
          <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-xl rounded-2xl p-6 border border-border">
            <h3 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-6">Compliance Standards</h3>
            <div className="space-y-3">
              {complianceStandards.map((standard) => {
                const Icon = standard.icon;
                return (
                  <div
                    key={standard.id}
                    className={`p-4 rounded-xl border cursor-pointer transition-all ${
                      selectedStandard === standard.id
                        ? 'border-green-500 bg-green-50 dark:bg-green-900/20'
                        : 'border-gray-200 dark:border-gray-600 hover:border-green-300 dark:hover:border-green-700'
                    }`}
                    onClick={() => runComplianceCheck(standard.id)}
                  >
                    <div className="flex items-center gap-3">
                      <Icon className="w-6 h-6 text-green-600 dark:text-green-400" />
                      <div>
                        <h4 className="font-medium text-gray-900 dark:text-gray-100">{standard.name}</h4>
                        <p className="text-sm text-gray-600 dark:text-gray-400">{standard.description}</p>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            <button
              onClick={() => runComplianceCheck(selectedStandard)}
              disabled={isChecking}
              className="w-full mt-6 px-4 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50 transition-colors"
            >
              {isChecking ? 'Checking...' : 'Run Full Compliance Check'}
            </button>
          </div>

          {/* Compliance Results */}
          <div className="lg:col-span-2 bg-white/80 dark:bg-gray-800/80 backdrop-blur-xl rounded-2xl p-6 border border-border">
            <h3 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-6">
              Compliance Report - {complianceStandards.find(s => s.id === selectedStandard)?.name}
            </h3>

            {isChecking ? (
              <div className="text-center py-12">
                <div className="w-16 h-16 border-4 border-green-200 border-t-green-600 rounded-full animate-spin mx-auto mb-4"></div>
                <p className="text-gray-600 dark:text-gray-400">Running compliance check...</p>
                <p className="text-sm text-gray-500 dark:text-gray-500">Analyzing {documents.length} documents</p>
              </div>
            ) : complianceResults ? (
              <div className="space-y-6">
                {/* Overall Score */}
                <div className="bg-gray-50 dark:bg-gray-700/50 rounded-xl p-6">
                  <div className="flex items-center justify-between mb-4">
                    <h4 className="font-medium text-gray-900 dark:text-gray-100">Overall Compliance Score</h4>
                    <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                      complianceResults.status === 'compliant' 
                        ? 'bg-green-100 text-green-700 dark:bg-green-900/20 dark:text-green-400'
                        : 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/20 dark:text-yellow-400'
                    }`}>
                      {complianceResults.status.replace('-', ' ').toUpperCase()}
                    </span>
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="text-3xl font-bold text-gray-900 dark:text-gray-100">
                      {complianceResults.overallScore}%
                    </div>
                    <div className="flex-1">
                      <div className="w-full bg-gray-200 dark:bg-gray-600 rounded-full h-3">
                        <div 
                          className="bg-green-500 h-3 rounded-full transition-all duration-1000"
                          style={{ width: `${complianceResults.overallScore}%` }}
                        ></div>
                      </div>
                    </div>
                  </div>
                  <p className="text-sm text-gray-600 dark:text-gray-400 mt-2">
                    Based on {complianceResults.checkedDocuments} documents • Last updated {complianceResults.lastUpdated}
                  </p>
                </div>

                {/* Issues Found */}
                <div>
                  <h4 className="font-medium text-gray-900 dark:text-gray-100 mb-4">Issues Found</h4>
                  <div className="space-y-3">
                    {complianceResults.issues.map((issue: any, index: number) => (
                      <div key={index} className={`p-4 rounded-lg border-l-4 ${
                        issue.severity === 'high' ? 'border-red-500 bg-red-50 dark:bg-red-900/10' :
                        issue.severity === 'medium' ? 'border-yellow-500 bg-yellow-50 dark:bg-yellow-900/10' :
                        'border-green-500 bg-green-50 dark:bg-green-900/10'
                      }`}>
                        <div className="flex items-start justify-between">
                          <div>
                            <p className="text-sm font-medium text-gray-900 dark:text-gray-100">
                              {issue.description}
                            </p>
                            <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                              Regulation: {issue.regulation}
                            </p>
                          </div>
                          <span className={`px-2 py-1 text-xs rounded-full ${
                            issue.severity === 'high' ? 'bg-red-100 text-red-700 dark:bg-red-900/20 dark:text-red-400' :
                            issue.severity === 'medium' ? 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/20 dark:text-yellow-400' :
                            'bg-green-100 text-green-700 dark:bg-green-900/20 dark:text-green-400'
                          }`}>
                            {issue.severity}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Recommendations */}
                <div>
                  <h4 className="font-medium text-gray-900 dark:text-gray-100 mb-4">Recommendations</h4>
                  <ul className="space-y-2">
                    {complianceResults.recommendations.map((rec: string, index: number) => (
                      <li key={index} className="flex items-start gap-3 text-sm text-gray-600 dark:text-gray-400">
                        <div className="w-2 h-2 bg-blue-500 rounded-full mt-2 flex-shrink-0"></div>
                        <span>{rec}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Action Buttons */}
                <div className="flex gap-3 pt-4">
                  <button className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
                    Generate Report
                  </button>
                  <button className="px-4 py-2 border border-border rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
                    Schedule Re-check
                  </button>
                </div>
              </div>
            ) : (
              <div className="text-center py-12 text-gray-500 dark:text-gray-400">
                <Shield className="w-16 h-16 mx-auto mb-4 opacity-50" />
                <p>Select a compliance standard to begin</p>
                <p className="text-sm">Click on any standard to run automated checks</p>
              </div>
            )}
          </div>
        </div>

        {/* Quick Stats */}
        <div className="mt-8 grid md:grid-cols-4 gap-4">
          <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-xl rounded-xl p-4 border border-border">
            <div className="text-2xl font-bold text-green-600 dark:text-green-400">
              {documents.filter(d => d.complianceStatus === 'compliant').length}
            </div>
            <p className="text-sm text-gray-600 dark:text-gray-400">Compliant Documents</p>
          </div>
          <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-xl rounded-xl p-4 border border-border">
            <div className="text-2xl font-bold text-yellow-600 dark:text-yellow-400">
              {documents.filter(d => d.complianceStatus === 'needs-review').length}
            </div>
            <p className="text-sm text-gray-600 dark:text-gray-400">Need Review</p>
          </div>
          <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-xl rounded-xl p-4 border border-border">
            <div className="text-2xl font-bold text-red-600 dark:text-red-400">
              {documents.filter(d => d.complianceStatus === 'non-compliant').length}
            </div>
            <p className="text-sm text-gray-600 dark:text-gray-400">Non-Compliant</p>
          </div>
          <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-xl rounded-xl p-4 border border-border">
            <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">
              {Math.floor((documents.filter(d => d.complianceStatus === 'compliant').length / Math.max(documents.length, 1)) * 100)}%
            </div>
            <p className="text-sm text-gray-600 dark:text-gray-400">Overall Rate</p>
          </div>
        </div>
      </div>
    );
  };

  const renderCollaborationSection = () => (
    <div className="max-w-6xl mx-auto">
      <div className="text-center mb-12">
        <div className="w-20 h-20 bg-gradient-to-br from-purple-500/10 to-pink-500/10 rounded-2xl flex items-center justify-center mx-auto mb-6">
          <Users className="w-10 h-10 text-purple-600 dark:text-purple-400" />
        </div>
        <h2 className="text-3xl font-bold text-gray-900 dark:text-gray-100 mb-4">Team Collaboration</h2>
        <p className="text-lg text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
          Work together with your team on document review, analysis, and decision-making processes.
        </p>
      </div>

      <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-xl rounded-2xl p-8 border border-border text-center">
        <Users className="w-16 h-16 text-purple-600 dark:text-purple-400 mx-auto mb-4" />
        <h3 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-2">Coming Soon</h3>
        <p className="text-gray-600 dark:text-gray-400 mb-6">
          Collaboration features are under development. Soon you'll be able to share documents, leave comments, and work together with your team.
        </p>
        <button className="px-6 py-3 bg-purple-600 text-white rounded-xl hover:bg-purple-700 transition-colors">
          Request Early Access
        </button>
      </div>
    </div>
  );

  const renderTemplatesSection = () => (
    <div className="max-w-6xl mx-auto">
      <div className="text-center mb-12">
        <div className="w-20 h-20 bg-gradient-to-br from-amber-500/10 to-orange-500/10 rounded-2xl flex items-center justify-center mx-auto mb-6">
          <Award className="w-10 h-10 text-amber-600 dark:text-amber-400" />
        </div>
        <h2 className="text-3xl font-bold text-gray-900 dark:text-gray-100 mb-4">Legal Templates</h2>
        <p className="text-lg text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
          Access professionally drafted legal document templates for common business needs.
        </p>
      </div>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        <TemplateCard
          title="Employment Contract"
          description="Comprehensive employment agreement template"
          category="HR & Employment"
          downloads={1234}
          templateId="employment-contract"
          downloadTemplate={downloadTemplate}
        />
        <TemplateCard
          title="Non-Disclosure Agreement"
          description="Standard NDA template for confidentiality"
          category="Confidentiality"
          downloads={987}
          templateId="nda"
          downloadTemplate={downloadTemplate}
        />
        <TemplateCard
          title="Service Agreement"
          description="Professional services contract template"
          category="Business Contracts"
          downloads={756}
          templateId="service-agreement"
          downloadTemplate={downloadTemplate}
        />
        <TemplateCard
          title="Lease Agreement"
          description="Residential and commercial lease templates"
          category="Real Estate"
          downloads={543}
          templateId="lease-agreement"
          downloadTemplate={downloadTemplate}
        />
        <TemplateCard
          title="Partnership Agreement"
          description="Business partnership contract template"
          category="Business Formation"
          downloads={432}
          templateId="partnership-agreement"
          downloadTemplate={downloadTemplate}
        />
        <TemplateCard
          title="Terms of Service"
          description="Website and app terms of service template"
          category="Digital Business"
          downloads={321}
          templateId="terms-of-service"
          downloadTemplate={downloadTemplate}
        />
      </div>
    </div>
  );

  // Welcome message for new users
  const EmptyState = () => (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="text-center py-16"
    >
      <div className="mx-auto w-24 h-24 rounded-full bg-gradient-to-br from-blue-500/10 to-purple-500/10 flex items-center justify-center mb-6">
        <FileText className="w-12 h-12 text-blue-500" />
      </div>
      <h3 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-2">
        Welcome to LegalEase AI
      </h3>
      <p className="text-gray-600 dark:text-gray-400 mb-8 max-w-md mx-auto">
        Get started by uploading your first legal document for AI-powered analysis and insights.
      </p>
      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={() => setShowUpload(true)}
        className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-blue-500 to-purple-600 text-white font-medium rounded-xl hover:shadow-lg transition-all duration-300"
      >
        <Plus className="w-5 h-5 mr-2" />
        Upload Document
      </motion.button>
    </motion.div>
  );

  return (
    <div className={`min-h-screen transition-colors duration-300 ${isDark ? 'dark' : ''}`}>
      <div className="flex h-screen bg-background">
        
        {/* Sidebar */}
        <motion.div 
          initial={false}
          animate={{ width: sidebarOpen ? 280 : 80 }}
          className="bg-card border-r border-border flex flex-col"
        >
          <div className="p-4">
            <motion.button
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="w-full flex items-center justify-center lg:justify-start p-3 rounded-xl hover:bg-gray-100 dark:hover:bg-gray-700/50 transition-colors"
            >
              <Menu className="w-6 h-6 text-gray-700 dark:text-gray-300" />
              {sidebarOpen && (
                <motion.span 
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="ml-3 font-semibold text-gray-900 dark:text-gray-100"
                >
                  LegalEase AI
                </motion.span>
              )}
            </motion.button>
          </div>

          <nav className="flex-1 px-4 space-y-2">
            <NavItem 
              icon={FileText} 
              label="Documents" 
              isActive={activeSection === 'documents'} 
              sidebarOpen={sidebarOpen}
              onClick={() => setActiveSection('documents')}
            />
            <NavItem 
              icon={Brain} 
              label="AI Analysis" 
              isActive={activeSection === 'ai-analysis'} 
              sidebarOpen={sidebarOpen}
              onClick={() => setActiveSection('ai-analysis')}
            />
            <NavItem 
              icon={Shield} 
              label="Compliance" 
              isActive={activeSection === 'compliance'} 
              sidebarOpen={sidebarOpen}
              onClick={() => setActiveSection('compliance')}
            />
            <NavItem 
              icon={Users} 
              label="Collaboration" 
              isActive={activeSection === 'collaboration'} 
              sidebarOpen={sidebarOpen}
              onClick={() => setActiveSection('collaboration')}
            />
            <NavItem 
              icon={Award} 
              label="Templates" 
              isActive={activeSection === 'templates'} 
              sidebarOpen={sidebarOpen}
              onClick={() => setActiveSection('templates')}
            />
          </nav>

          <div className="p-4 space-y-2">
            <motion.button
              onClick={() => setShowProfile(true)}
              className="w-full flex items-center justify-center lg:justify-start p-3 rounded-xl hover:bg-gray-100 dark:hover:bg-gray-700/50 transition-colors"
            >
              <User className="w-5 h-5 text-gray-600 dark:text-gray-400" />
              {sidebarOpen && (
                <span className="ml-3 text-gray-700 dark:text-gray-300">Profile</span>
              )}
            </motion.button>

            <motion.button
              onClick={() => setShowSettings(true)}
              className="w-full flex items-center justify-center lg:justify-start p-3 rounded-xl hover:bg-gray-100 dark:hover:bg-gray-700/50 transition-colors"
            >
              <Settings className="w-5 h-5 text-gray-600 dark:text-gray-400" />
              {sidebarOpen && (
                <span className="ml-3 text-gray-700 dark:text-gray-300">Settings</span>
              )}
            </motion.button>
          </div>
        </motion.div>

        {/* Main Content */}
        <div className="flex-1 flex flex-col overflow-hidden">
          
          {/* Header */}
          <header className="bg-card border-b border-border px-6 py-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100">
                  Dashboard
                </h1>
                {user && (
                  <div className="hidden md:flex items-center space-x-2 px-3 py-1 bg-green-50 dark:bg-green-900/20 rounded-full">
                    <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                    <span className="text-sm text-green-700 dark:text-green-400">
                      Welcome, {user.email?.split('@')[0]}
                    </span>
                  </div>
                )}
              </div>

              <div className="flex items-center space-x-2">
                {/* Theme Toggle */}
                <div className="flex items-center bg-muted rounded-lg p-1">
                  <button
                    onClick={() => toggleTheme('light')}
                    className={`p-2 rounded-md transition-all ${themeMode === 'light' ? 'bg-background shadow-sm' : ''}`}
                  >
                    <Sun className={`w-4 h-4 ${themeMode === 'light' ? 'text-yellow-600' : 'text-gray-400'}`} />
                  </button>
                  <button
                    onClick={() => toggleTheme('system')}
                    className={`p-2 rounded-md transition-all ${themeMode === 'system' ? 'bg-background shadow-sm' : ''}`}
                  >
                    <Palette className={`w-4 h-4 ${themeMode === 'system' ? 'text-blue-600' : 'text-gray-400'}`} />
                  </button>
                  <button
                    onClick={() => toggleTheme('dark')}
                    className={`p-2 rounded-md transition-all ${themeMode === 'dark' ? 'bg-background shadow-sm' : ''}`}
                  >
                    <Moon className={`w-4 h-4 ${themeMode === 'dark' ? 'text-blue-600' : 'text-gray-400'}`} />
                  </button>
                </div>
              </div>
            </div>
          </header>

          {/* Dashboard Content */}
          <main className="flex-1 overflow-y-auto bg-gray-50 dark:bg-gray-900 p-6">
            
            {/* Stats Cards - Show only for Documents section */}
            {activeSection === 'documents' && (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6 mb-8">
                <StatsCard
                  title="Total Documents"
                  value={stats.total}
                  icon={FileText}
                  color="blue"
                  change={stats.total > 0 ? "+12%" : ""}
                />
                <StatsCard
                  title="Analyzed"
                  value={documentsAnalyzed}
                  icon={Brain}
                  color="purple"
                  change={documentsAnalyzed > 0 ? "+" + documentsAnalyzed : ""}
                />
                <StatsCard
                  title="Processing"
                  value={stats.processing}
                  icon={Clock}
                  color="yellow"
                  change=""
                />
                <StatsCard
                  title="Completed"
                  value={stats.completed}
                  icon={CheckCircle}
                  color="green"
                  change={stats.completed > 0 ? "+8%" : ""}
                />
                <StatsCard
                  title="High Risk"
                  value={stats.highRisk}
                  icon={AlertTriangle}
                  color="red"
                  change=""
                />
              </div>
            )}

            {/* Section Content */}
            {renderSectionContent()}
          </main>
        </div>

        {/* Floating Action Button - Chatbot */}
        <motion.button
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          onClick={() => setShowChatbot(true)}
          className="fixed bottom-6 right-6 w-14 h-14 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-full shadow-lg hover:shadow-xl transition-all duration-300 flex items-center justify-center z-40"
        >
          <Bot className="w-6 h-6" />
        </motion.button>

        {/* Premium Document Upload - Compact Modal */}
        {showUpload && (
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="bg-white dark:bg-gray-900 rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto"
            >
              <CompactDocumentUpload 
                onAnalysisComplete={handleAnalysisComplete}
                onClose={() => setShowUpload(false)}
              />
            </motion.div>
          </div>
        )}

        {/* Enhanced Analysis Results - Full Screen */}
        {showAnalysisPage && currentAnalysisData ? (
          <Modal onClose={() => setShowAnalysisPage(false)} fullScreen>
            <EnhancedAnalysisResults 
              results={currentAnalysisData}
              onClose={() => setShowAnalysisPage(false)}
              onTalkToExpert={() => {
                console.log('Opening expert chat...');
                // TODO: Implement expert chat functionality
              }}
              onDownload={() => {
                console.log('Downloading analysis...');
                // TODO: Implement PDF download functionality
              }}
              onShare={() => {
                console.log('Sharing analysis...');
                // TODO: Implement sharing functionality
              }}
            />
          </Modal>
        ) : showAnalysisPage ? (
          <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center">
            <div className="bg-white dark:bg-gray-900 rounded-xl p-8">
              <p className="text-center text-gray-600 dark:text-gray-400">
                Loading analysis results...
              </p>
            </div>
          </div>
        ) : null}

        {showChatbot && (
          <Modal onClose={() => setShowChatbot(false)} fullScreen>
            {/* Regular chatbot - General legal LLM without document context */}
            <NewChatbot 
              onClose={() => setShowChatbot(false)} 
            />
          </Modal>
        )}

        {/* Expert Chat Modal */}
        {showExpertChat && (
          <Modal onClose={() => setShowExpertChat(false)} fullScreen>
            <NewChatbot 
              {...(currentAnalysisData?.document?.name ? {
                documentContext: `Document: ${currentAnalysisData.document.name}\n\nSummary: ${currentAnalysisData.analysisResults?.summary || 'No content available'}`
              } : {})}
              title="Expert Legal Analysis"
              expertType="Legal Document Expert"
              onClose={() => setShowExpertChat(false)}
            />
          </Modal>
        )}

        {showSettings && (
          <Modal onClose={() => setShowSettings(false)}>
            <UserSettings onClose={() => setShowSettings(false)} />
          </Modal>
        )}

        {showProfile && (
          <Modal onClose={() => setShowProfile(false)}>
            <UserProfile user={user} documents={documents} onClose={() => setShowProfile(false)} />
          </Modal>
        )}

        {/* Document Viewer Modal - Shows when a document is selected */}
        {selectedDocument && (
          <Modal onClose={() => setSelectedDocument(null)} fullScreen>
            <DocumentViewer 
              document={selectedDocument}
              onClose={() => setSelectedDocument(null)}
              onAnalyze={(analysisData) => {
                setCurrentAnalysisData(analysisData);
                setSelectedDocument(null);
                setShowAnalysisPage(true);
              }}
            />
          </Modal>
        )}
      </div>
    </div>
  );
}

// Components
const NavItem = ({ icon: Icon, label, isActive = false, sidebarOpen, onClick }: {
  icon: any;
  label: string;
  isActive?: boolean;
  sidebarOpen: boolean;
  onClick?: () => void;
}) => (
  <motion.button
    whileHover={{ scale: 1.02 }}
    onClick={onClick}
    className={`w-full flex items-center justify-center lg:justify-start p-3 rounded-xl transition-all duration-200 ${
      isActive 
        ? 'bg-gradient-to-r from-blue-500/10 to-purple-500/10 text-blue-600 dark:text-blue-400 border border-blue-200/50 dark:border-blue-800/50' 
        : 'hover:bg-gray-100 dark:hover:bg-gray-700/50 text-gray-600 dark:text-gray-400'
    }`}
  >
    <Icon className="w-5 h-5" />
    {sidebarOpen && (
      <motion.span 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="ml-3 font-medium"
      >
        {label}
      </motion.span>
    )}
  </motion.button>
);

const StatsCard = ({ title, value, icon: Icon, color, change }: {
  title: string;
  value: number;
  icon: any;
  color: 'blue' | 'green' | 'yellow' | 'red' | 'purple';
  change: string;
}) => {
  const colorClasses = {
    blue: 'from-blue-500/10 to-blue-600/10 text-blue-600 dark:text-blue-400',
    green: 'from-green-500/10 to-green-600/10 text-green-600 dark:text-green-400',
    yellow: 'from-yellow-500/10 to-yellow-600/10 text-yellow-600 dark:text-yellow-400',
    red: 'from-red-500/10 to-red-600/10 text-red-600 dark:text-red-400',
    purple: 'from-purple-500/10 to-purple-600/10 text-purple-600 dark:text-purple-400',
  };

  return (
    <motion.div
      whileHover={{ y: -2 }}
      className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-xl rounded-2xl p-6 border border-border"
    >
      <div className="flex items-center justify-between mb-4">
        <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${colorClasses[color]} flex items-center justify-center`}>
          <Icon className="w-6 h-6" />
        </div>
        {change && (
          <span className="text-sm font-medium text-green-600 dark:text-green-400">
            {change}
          </span>
        )}
      </div>
      <div className="space-y-1">
        <p className="text-2xl font-bold text-gray-900 dark:text-gray-100">
          {value.toLocaleString()}
        </p>
        <p className="text-sm text-gray-600 dark:text-gray-400">{title}</p>
      </div>
    </motion.div>
  );
};

const DocumentCard = ({ document, onSelect, formatFileSize }: {
  document: Document;
  onSelect: (doc: Document) => void;
  formatFileSize: (bytes: number) => string;
}) => {
  const getRiskColor = (level: string) => {
    switch (level) {
      case 'high': return 'text-red-600 bg-red-50 dark:bg-red-900/20 dark:text-red-400';
      case 'medium': return 'text-yellow-600 bg-yellow-50 dark:bg-yellow-900/20 dark:text-yellow-400';
      default: return 'text-green-600 bg-green-50 dark:bg-green-900/20 dark:text-green-400';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return 'text-green-600 bg-green-50 dark:bg-green-900/20 dark:text-green-400';
      case 'processing': return 'text-blue-600 bg-blue-50 dark:bg-blue-900/20 dark:text-blue-400';
      default: return 'text-red-600 bg-red-50 dark:bg-red-900/20 dark:text-red-400';
    }
  };

  return (
    <motion.div
      whileHover={{ y: -4 }}
      onClick={() => onSelect(document)}
      className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-xl rounded-2xl p-6 border border-border cursor-pointer group"
    >
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-blue-500/10 to-purple-500/10 flex items-center justify-center">
            <FileText className="w-5 h-5 text-blue-600 dark:text-blue-400" />
          </div>
          <div>
            <h3 className="font-semibold text-gray-900 dark:text-gray-100 truncate max-w-[200px]">
              {document.name}
            </h3>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              {formatFileSize(document.size)} • {document.type.toUpperCase()}
            </p>
          </div>
        </div>
        <button className="opacity-0 group-hover:opacity-100 transition-opacity">
          <MoreHorizontal className="w-5 h-5 text-gray-400" />
        </button>
      </div>

      <div className="flex items-center justify-between mb-4">
        <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(document.status)}`}>
          {document.status}
        </span>
        {document.riskLevel && (
          <span className={`px-2 py-1 rounded-full text-xs font-medium ${getRiskColor(document.riskLevel)}`}>
            {document.riskLevel} risk
          </span>
        )}
      </div>

      {document.aiSummary && (
        <p className="text-sm text-gray-600 dark:text-gray-400 mb-4 line-clamp-2">
          {document.aiSummary}
        </p>
      )}

      <div className="flex items-center justify-between text-sm text-gray-500 dark:text-gray-500">
        <span>{new Date(document.uploadedAt).toLocaleDateString()}</span>
        {document.confidenceScore && (
          <span className="flex items-center space-x-1">
            <Brain className="w-4 h-4" />
            <span>{document.confidenceScore}%</span>
          </span>
        )}
      </div>
    </motion.div>
  );
};

const FeatureCard = ({ icon: Icon, title, description, color }: {
  icon: any;
  title: string;
  description: string;
  color: 'blue' | 'red' | 'green';
}) => {
  const colorClasses = {
    blue: 'from-blue-500/10 to-blue-600/10 text-blue-600 dark:text-blue-400',
    red: 'from-red-500/10 to-red-600/10 text-red-600 dark:text-red-400',
    green: 'from-green-500/10 to-green-600/10 text-green-600 dark:text-green-400',
  };

  return (
    <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-xl rounded-2xl p-6 border border-border">
      <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${colorClasses[color]} flex items-center justify-center mb-4`}>
        <Icon className="w-6 h-6" />
      </div>
      <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-2">{title}</h3>
      <p className="text-gray-600 dark:text-gray-400">{description}</p>
    </div>
  );
};

const ComplianceCard = ({ title, status, description, documents: docCount }: {
  title: string;
  status: 'compliant' | 'needs-review' | 'non-compliant';
  description: string;
  documents: number;
}) => {
  const statusColors = {
    compliant: 'text-green-600 bg-green-50 dark:bg-green-900/20 dark:text-green-400',
    'needs-review': 'text-yellow-600 bg-yellow-50 dark:bg-yellow-900/20 dark:text-yellow-400',
    'non-compliant': 'text-red-600 bg-red-50 dark:bg-red-900/20 dark:text-red-400',
  };

  return (
    <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-xl rounded-2xl p-6 border border-border">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">{title}</h3>
        <span className={`px-2 py-1 rounded-full text-xs font-medium ${statusColors[status]}`}>
          {status.replace('-', ' ')}
        </span>
      </div>
      <p className="text-gray-600 dark:text-gray-400 mb-4">{description}</p>
      <div className="flex items-center text-sm text-gray-500 dark:text-gray-400">
        <FileText className="w-4 h-4 mr-2" />
        <span>{docCount} documents</span>
      </div>
    </div>
  );
};

const TemplateCard = ({ title, description, category, downloads, templateId, downloadTemplate }: {
  title: string;
  description: string;
  category: string;
  downloads: number;
  templateId: string;
  downloadTemplate: (templateId: string, title: string) => void;
}) => {
  const handleDownload = (e: React.MouseEvent) => {
    e.stopPropagation();
    downloadTemplate(templateId, title);
  };

  const handlePreview = (e: React.MouseEvent) => {
    e.stopPropagation();
    // TODO: Add preview functionality
    console.log('Preview template:', templateId);
  };

  return (
    <motion.div
      whileHover={{ y: -2 }}
      className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-xl rounded-2xl p-6 border border-border cursor-pointer group"
    >
      <div className="flex items-center justify-between mb-4">
        <div className="w-10 h-10 bg-gradient-to-br from-amber-500/10 to-orange-500/10 rounded-lg flex items-center justify-center">
          <FileText className="w-5 h-5 text-amber-600 dark:text-amber-400" />
        </div>
        <span className="text-xs text-gray-500 dark:text-gray-400">{downloads} downloads</span>
      </div>
      <h3 className="font-semibold text-gray-900 dark:text-gray-100 mb-2 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
        {title}
      </h3>
      <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">{description}</p>
      <div className="flex items-center justify-between">
        <span className="inline-block px-2 py-1 text-xs bg-amber-50 dark:bg-amber-900/20 text-amber-600 dark:text-amber-400 rounded-full">
          {category}
        </span>
        <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
          <button
            onClick={handlePreview}
            className="p-1.5 bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 rounded-lg transition-colors"
            title="Preview"
          >
            <Eye className="w-4 h-4 text-gray-600 dark:text-gray-400" />
          </button>
          <button
            onClick={handleDownload}
            className="p-1.5 bg-blue-100 dark:bg-blue-900/20 hover:bg-blue-200 dark:hover:bg-blue-800/30 rounded-lg transition-colors"
            title="Download"
          >
            <Download className="w-4 h-4 text-blue-600 dark:text-blue-400" />
          </button>
        </div>
      </div>
    </motion.div>
  );
};

const UserProfile = ({ user, documents, onClose }: { user: any; documents: Document[]; onClose: () => void }) => (
  <div className="p-8 max-w-2xl mx-auto">
    <div className="flex items-center justify-between mb-6">
      <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100">Profile</h2>
      <button
        onClick={onClose}
        className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
      >
        <X className="w-5 h-5 text-gray-500" />
      </button>
    </div>
    
    <div className="flex items-center space-x-6 mb-8">
      <div className="w-20 h-20 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
        {user?.photoURL ? (
          <img 
            src={user.photoURL} 
            alt="Profile" 
            className="w-full h-full rounded-full object-cover"
          />
        ) : (
          <User className="w-8 h-8 text-white" />
        )}
      </div>
      <div>
        <h3 className="text-xl font-semibold text-gray-900 dark:text-gray-100">
          {user?.displayName || user?.email?.split('@')[0] || 'User'}
        </h3>
        <p className="text-gray-600 dark:text-gray-400">{user?.email}</p>
        <span className="inline-block px-2 py-1 text-xs bg-green-50 dark:bg-green-900/20 text-green-600 dark:text-green-400 rounded-full mt-2">
          Premium Account
        </span>
      </div>
    </div>

    <div className="space-y-6">
      <div className="bg-gray-50 dark:bg-gray-700/50 rounded-xl p-4">
        <h4 className="font-medium text-gray-900 dark:text-gray-100 mb-2">Account Information</h4>
        <div className="space-y-2 text-sm text-gray-600 dark:text-gray-400">
          <p><strong>Email:</strong> {user?.email}</p>
          <p><strong>Account Type:</strong> Premium</p>
          <p><strong>Member Since:</strong> {user?.metadata?.creationTime ? new Date(user.metadata.creationTime).toLocaleDateString() : 'Recently'}</p>
        </div>
      </div>

      <div className="bg-gray-50 dark:bg-gray-700/50 rounded-xl p-4">
        <h4 className="font-medium text-gray-900 dark:text-gray-100 mb-2">Usage Statistics</h4>
        <div className="grid grid-cols-2 gap-4 text-sm">
          <div>
            <p className="text-gray-600 dark:text-gray-400">Documents Analyzed</p>
            <p className="text-2xl font-bold text-blue-600 dark:text-blue-400">{documents.length}</p>
          </div>
          <div>
            <p className="text-gray-600 dark:text-gray-400">AI Queries</p>
            <p className="text-2xl font-bold text-purple-600 dark:text-purple-400">
              {documents.reduce((total: number, doc: Document) => total + (doc.queries || 0), 0)}
            </p>
          </div>
        </div>
      </div>
    </div>
  </div>
);

const Modal = ({ children, onClose, fullScreen = false }: {
  children: React.ReactNode;
  onClose: () => void;
  fullScreen?: boolean;
}) => (
  <motion.div
    initial={{ opacity: 0 }}
    animate={{ opacity: 1 }}
    exit={{ opacity: 0 }}
    onClick={onClose}
    className="fixed inset-0 bg-gradient-to-br from-black/60 via-black/50 to-black/60 backdrop-blur-lg z-50 flex items-center justify-center p-0"
  >
    <motion.div
      initial={{ scale: 0.95, opacity: 0, y: 20 }}
      animate={{ scale: 1, opacity: 1, y: 0 }}
      exit={{ scale: 0.95, opacity: 0, y: 20 }}
      onClick={(e) => e.stopPropagation()}
      className={`bg-gradient-to-br from-white via-gray-50 to-white dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 shadow-2xl border border-gray-200/50 dark:border-gray-700/50 overflow-hidden ${
        fullScreen 
          ? 'w-full h-full rounded-none' 
          : 'w-full max-w-6xl h-[95vh] rounded-2xl'
      }`}
      style={{
        boxShadow: fullScreen 
          ? 'none'
          : '0 25px 60px -12px rgba(0, 0, 0, 0.25), 0 8px 16px -8px rgba(0, 0, 0, 0.1)'
      }}
    >
      <div className={`${fullScreen ? 'h-full' : 'h-full'} overflow-y-auto scrollbar-thin scrollbar-thumb-gray-300 dark:scrollbar-thumb-gray-600 scrollbar-track-transparent`}>
        {children}
      </div>
    </motion.div>
  </motion.div>
);
