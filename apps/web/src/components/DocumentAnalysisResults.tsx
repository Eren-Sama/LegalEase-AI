'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  ArrowLeft,
  FileText,
  AlertTriangle,
  CheckCircle,
  XCircle,
  Eye,
  Brain,
  MessageCircle,
  Scale,
  GraduationCap,
  Download,
  Clock,
  DollarSign,
  ChevronRight,
  Info,
  Lightbulb,
  Target,
  Play,
  ExternalLink,
  TrendingUp,
  Gavel
} from 'lucide-react';
import { EnhancedAnalysis } from '@/services/documentAnalysis';
import NewChatbot from '@/components/NewChatbot';
import { generateAnalysisPDF } from '@/utils/pdfGenerator';

interface DocumentAnalysisResultsProps {
  analysis: EnhancedAnalysis;
  fileName: string;
  onClose: () => void;
}

type ViewMode = 'executive' | 'plain' | 'detailed';
type ActiveSection = 'overview' | 'clauses' | 'risks' | 'qa' | 'negotiation' | 'education';

export default function DocumentAnalysisResults({ analysis, fileName, onClose }: DocumentAnalysisResultsProps) {
  const [viewMode, setViewMode] = useState<ViewMode>('executive');
  const [activeSection, setActiveSection] = useState<ActiveSection>('overview');
  const [expandedClause, setExpandedClause] = useState<string | null>(null);
  const [qaQuery, setQaQuery] = useState('');
  const [qaHistory, setQaHistory] = useState<Array<{question: string, answer: string}>>([]);
  const [showExpertChat, setShowExpertChat] = useState(false);

  // Debug logging
  console.log('🔍 DocumentAnalysisResults received analysis:', {
    hasAnalysis: !!analysis,
    keyClauses: analysis?.keyClauses?.length || 0,
    riskFactors: analysis?.riskAssessment?.riskFactors?.length || 0,
    sections: analysis?.sections?.length || 0,
    analysisKeys: analysis ? Object.keys(analysis) : []
  });

  const getRiskColor = (risk: 'low' | 'medium' | 'high') => {
    switch(risk) {
      case 'low': return 'text-green-700 bg-green-50 border-green-200 dark:text-green-400 dark:bg-green-900/20 dark:border-green-800';
      case 'medium': return 'text-yellow-700 bg-yellow-50 border-yellow-200 dark:text-yellow-400 dark:bg-yellow-900/20 dark:border-yellow-800';
      case 'high': return 'text-red-700 bg-red-50 border-red-200 dark:text-red-400 dark:bg-red-900/20 dark:border-red-800';
      default: return 'text-gray-700 bg-gray-50 border-gray-200 dark:text-gray-400 dark:bg-gray-900/20 dark:border-gray-800';
    }
  };

  const getRiskIcon = (risk: 'low' | 'medium' | 'high') => {
    switch(risk) {
      case 'low': return <CheckCircle className="w-5 h-5" />;
      case 'medium': return <AlertTriangle className="w-5 h-5" />;
      case 'high': return <XCircle className="w-5 h-5" />;
      default: return <Info className="w-5 h-5" />;
    }
  };

  const handleQASubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!qaQuery.trim()) return;

    const mockResponse = `I understand you're asking about "${qaQuery}". Based on my analysis of the document, I can help clarify specific clauses or terms. Could you be more specific about which section you'd like me to explain?`;
    setQaHistory([...qaHistory, { question: qaQuery, answer: mockResponse }]);
    setQaQuery('');
  };

  const handleDownload = async () => {
    try {
      const downloadFileName = `${fileName.replace(/\.[^/.]+$/, "")}-analysis-${new Date().toISOString().split('T')[0]}.pdf`;
      await generateAnalysisPDF(analysis as any, downloadFileName);
      console.log('PDF download completed successfully');
    } catch (error) {
      console.error('PDF generation failed:', error);
    }
  };

  const sections = [
    { id: 'overview', label: 'Overview', icon: Eye },
    { id: 'clauses', label: 'Clauses', icon: FileText },
    { id: 'risks', label: 'Risk Analysis', icon: AlertTriangle },
    { id: 'negotiation', label: 'Negotiation Help', icon: Scale },
    { id: 'education', label: 'Learn More', icon: GraduationCap }
  ];

  return (
    <div className="fixed inset-0 z-50 bg-white dark:bg-gray-900">
      {/* Full-screen container with modern gradient */}
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 dark:from-gray-900 dark:via-blue-950 dark:to-indigo-950">
        
        {/* Premium header with glassmorphism */}
        <div className="bg-white/80 dark:bg-gray-900/80 backdrop-blur-xl border-b border-gray-200/50 dark:border-gray-700/50 sticky top-0 z-40 shadow-lg shadow-black/5">
          <div className="max-w-7xl mx-auto px-6 lg:px-8">
            <div className="flex items-center justify-between h-18 py-4">
              <div className="flex items-center gap-6">
                <button
                  onClick={onClose}
                  className="flex items-center gap-3 text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors group"
                >
                  <div className="p-2 rounded-lg bg-gray-100 dark:bg-gray-800 group-hover:bg-blue-50 dark:group-hover:bg-blue-900/30 transition-colors">
                    <ArrowLeft className="w-5 h-5" />
                  </div>
                  <span className="font-medium">Back to Dashboard</span>
                </button>
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-xl flex items-center justify-center shadow-lg">
                    <FileText className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
                      Premium Document Analysis
                    </h1>
                    <p className="text-sm text-gray-600 dark:text-gray-400 truncate max-w-md">
                      {fileName}
                    </p>
                  </div>
                </div>
              </div>
              
              <div className="flex items-center gap-4">
                {/* Enhanced view mode selector */}
                <div className="flex rounded-xl bg-gray-100/80 dark:bg-gray-800/80 p-1.5 backdrop-blur-sm border border-gray-200/50 dark:border-gray-700/50">
                  {[
                    { mode: 'executive' as ViewMode, label: '30s', icon: Clock, tooltip: 'Executive Summary - Quick Overview' },
                    { mode: 'plain' as ViewMode, label: 'Plain', icon: Eye, tooltip: 'Plain English - Easy to Understand' },
                    { mode: 'detailed' as ViewMode, label: 'Deep', icon: Brain, tooltip: 'Deep Dive - Comprehensive Analysis' }
                  ].map(({ mode, label, icon: Icon, tooltip }) => (
                    <button
                      key={mode}
                      onClick={() => setViewMode(mode)}
                      title={tooltip}
                      className={`flex items-center gap-2 px-4 py-2.5 text-sm font-medium rounded-lg transition-all duration-200 ${
                        viewMode === mode 
                          ? 'bg-white dark:bg-gray-700 text-blue-600 dark:text-blue-400 shadow-lg shadow-blue-500/20 border border-blue-200/50 dark:border-blue-700/50' 
                          : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200 hover:bg-white/50 dark:hover:bg-gray-700/50'
                      }`}
                    >
                      <Icon className="w-4 h-4" />
                      <span>{label}</span>
                    </button>
                  ))}
                </div>
                
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setShowExpertChat(true)}
                    className="flex items-center gap-2 px-4 py-2.5 text-sm font-medium bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-all duration-200 shadow-lg hover:shadow-xl hover:shadow-blue-500/25"
                  >
                    <MessageCircle className="w-4 h-4" />
                    <span>Talk to Expert</span>
                  </button>
                  <button 
                    onClick={handleDownload}
                    className="p-2.5 text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-lg border border-gray-200/50 dark:border-gray-700/50 hover:shadow-lg transition-all"
                  >
                    <Download className="w-5 h-5" />
                  </button>
                  <button className="p-2.5 text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-lg border border-gray-200/50 dark:border-gray-700/50 hover:shadow-lg transition-all">
                    <ExternalLink className="w-5 h-5" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Main content area with improved layout and scrollability */}
        <div className="max-w-7xl mx-auto px-6 lg:px-8 py-8 h-[calc(100vh-136px)] overflow-y-auto">
          <div className="flex gap-8 min-h-full pb-8">
            
            {/* Enhanced sidebar navigation */}
            <div className="w-80 flex-shrink-0">
              <div className="bg-white/70 dark:bg-gray-900/70 backdrop-blur-xl rounded-2xl border border-gray-200/50 dark:border-gray-700/50 p-6 sticky top-28 shadow-xl shadow-black/5">
                <div className="space-y-2">
                  {sections.map(section => {
                    const Icon = section.icon;
                    return (
                      <button
                        key={section.id}
                        onClick={() => setActiveSection(section.id as ActiveSection)}
                        className={`w-full flex items-center gap-4 p-4 rounded-xl text-left transition-all duration-200 group ${
                          activeSection === section.id
                            ? 'bg-gradient-to-r from-blue-500 to-indigo-600 text-white shadow-lg shadow-blue-500/25'
                            : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100/80 dark:hover:bg-gray-800/80 hover:shadow-md'
                        }`}
                      >
                        <div className={`w-10 h-10 rounded-lg flex items-center justify-center transition-all ${
                          activeSection === section.id
                            ? 'bg-white/20'
                            : 'bg-gray-100 dark:bg-gray-800 group-hover:bg-blue-50 dark:group-hover:bg-blue-900/30'
                        }`}>
                          <Icon className="w-5 h-5" />
                        </div>
                        <div>
                          <span className="font-semibold text-sm">{section.label}</span>
                          <p className={`text-xs opacity-80 ${
                            activeSection === section.id ? 'text-white/80' : 'text-gray-500 dark:text-gray-400'
                          }`}>
                            {section.id === 'overview' && 'Document summary'}
                            {section.id === 'clauses' && 'Legal clauses'}
                            {section.id === 'risks' && 'Risk analysis'}
                            {section.id === 'qa' && 'Ask questions'}
                            {section.id === 'negotiation' && 'Negotiation tips'}
                            {section.id === 'education' && 'Learn more'}
                          </p>
                        </div>
                      </button>
                    );
                  })}
                </div>

                {/* Enhanced quick stats */}
                <div className="mt-8 pt-6 border-t border-gray-200/50 dark:border-gray-700/50">
                  <h3 className="text-sm font-bold text-gray-900 dark:text-white mb-6 flex items-center gap-2">
                    <TrendingUp className="w-4 h-4 text-blue-500" />
                    Quick Stats
                  </h3>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between p-3 bg-gray-50/80 dark:bg-gray-800/80 rounded-lg">
                      <div className="flex items-center gap-3">
                        <div className={`w-3 h-3 rounded-full ${getRiskColor(analysis?.riskAssessment?.overallRisk || 'low')}`}></div>
                        <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Overall Risk</span>
                      </div>
                      <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wide ${getRiskColor(analysis?.riskAssessment?.overallRisk || 'low')}`}>
                        {(analysis?.riskAssessment?.overallRisk || 'low')}
                      </span>
                    </div>
                    
                    <div className="grid grid-cols-2 gap-3">
                      <div className="text-center p-3 bg-blue-50/80 dark:bg-blue-900/20 rounded-lg border border-blue-200/50 dark:border-blue-800/50">
                        <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">{analysis?.sections?.length || 0}</div>
                        <div className="text-xs text-blue-600/80 dark:text-blue-400/80 font-medium">Sections</div>
                      </div>
                      <div className="text-center p-3 bg-green-50/80 dark:bg-green-900/20 rounded-lg border border-green-200/50 dark:border-green-800/50">
                        <div className="text-2xl font-bold text-green-600 dark:text-green-400">{analysis?.keyTerms?.length || 0}</div>
                        <div className="text-xs text-green-600/80 dark:text-green-400/80 font-medium">Key Terms</div>
                      </div>
                      <div className="text-center p-3 bg-purple-50/80 dark:bg-purple-900/20 rounded-lg border border-purple-200/50 dark:border-purple-800/50">
                        <div className="text-2xl font-bold text-purple-600 dark:text-purple-400">{analysis?.timeline?.length || 0}</div>
                        <div className="text-xs text-purple-600/80 dark:text-purple-400/80 font-medium">Deadlines</div>
                      </div>
                      <div className="text-center p-3 bg-orange-50/80 dark:bg-orange-900/20 rounded-lg border border-orange-200/50 dark:border-orange-800/50">
                        <div className="text-2xl font-bold text-orange-600 dark:text-orange-400">{(analysis?.confidence || 0).toFixed(0)}%</div>
                        <div className="text-xs text-orange-600/80 dark:text-orange-400/80 font-medium">Accuracy</div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Main content panel */}
            <div className="flex-1 min-w-0">
              <AnimatePresence mode="wait">
                {activeSection === 'overview' && (
                  <OverviewSection analysis={analysis} viewMode={viewMode} />
                )}
                {activeSection === 'clauses' && (
                  <ClausesSection 
                    analysis={analysis} 
                    expandedClause={expandedClause}
                    setExpandedClause={setExpandedClause}
                  />
                )}
                {activeSection === 'risks' && (
                  <RiskAnalysisSection analysis={analysis} />
                )}
                {activeSection === 'negotiation' && (
                  <NegotiationSection analysis={analysis} />
                )}
                {activeSection === 'education' && (
                  <EducationSection analysis={analysis} />
                )}
              </AnimatePresence>
            </div>
          </div>
        </div>
        
        {/* Gradient overlay for depth */}
        <div className="fixed inset-x-0 bottom-0 h-32 bg-gradient-to-t from-white dark:from-gray-900 to-transparent pointer-events-none"></div>
      </div>

      {/* Expert Chat Modal */}
      {showExpertChat && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl w-full max-w-4xl h-[80vh] flex flex-col">
            <div className="p-6 border-b border-gray-200 dark:border-gray-700 flex items-center justify-between">
              <div>
                <h2 className="text-xl font-bold text-gray-900 dark:text-white">Talk to Expert</h2>
                <p className="text-sm text-gray-600 dark:text-gray-400">AI analysis of {fileName}</p>
              </div>
              <button
                onClick={() => setShowExpertChat(false)}
                className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
              >
                <XCircle className="w-5 h-5" />
              </button>
            </div>
            <div className="flex-1 p-6">
              <NewChatbot 
                documentContext={`Document: ${fileName}\n\nDocument Type: ${analysis?.documentType || 'document'}\n\nKey Clauses: ${analysis?.keyClauses?.length || 0} found`}
                title="Legal Document Expert"
                expertType="Document Analysis Expert"
                onClose={() => setShowExpertChat(false)}
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// Overview Section Component with enhanced AI insights
const OverviewSection = ({ analysis, viewMode }: { analysis: EnhancedAnalysis, viewMode: ViewMode }) => {
  const getRiskIcon = (risk: 'low' | 'medium' | 'high') => {
    switch(risk) {
      case 'low': return <CheckCircle className="w-6 h-6 text-green-500" />;
      case 'medium': return <AlertTriangle className="w-6 h-6 text-yellow-500" />;
      case 'high': return <XCircle className="w-6 h-6 text-red-500" />;
      default: return <Info className="w-6 h-6 text-gray-500" />;
    }
  };

  const getViewModeContent = () => {
    const riskLevel = analysis?.riskAssessment?.overallRisk || 'low';
    const docType = analysis?.documentType || 'Legal Document';
    const confidence = analysis?.confidence || 85;
    
    // Get real financial data
    const financialAmounts = analysis?.financialAnalysis?.terms || [];
    const allFinancials = [...financialAmounts];
    
    // Get real date data
    const timelineData = analysis?.timeline || [];
    const allDates = [...timelineData];
    
    // Get key clauses
    const keyClauses = analysis?.keyClauses || [];
    
    // Extract key parties from document content
    const summaryText = analysis?.keyClauses?.map(c => c.content).join(' ') || '';
    const hasParties = summaryText.toLowerCase().includes('between') || summaryText.toLowerCase().includes('parties') || summaryText.toLowerCase().includes('party');
    
    // Primary financial amount
    const primaryAmount = allFinancials.find(f => f.amount && f.currency) || null;
    const formattedAmount = primaryAmount 
      ? `${primaryAmount.currency === 'INR' ? '₹' : primaryAmount.currency === 'USD' ? '$' : primaryAmount.currency === 'EUR' ? '€' : '£'}${primaryAmount.amount} ${primaryAmount.currency}`
      : null;
    
    // Most critical date
    const urgentDate = allDates.find(d => 
      d.type === 'deadline' || d.importance === 'critical' || d.importance === 'important'
    );
    
    // Risk factors count
    const riskFactors = analysis?.riskAssessment?.riskFactors || [];
    const highRiskFactors = riskFactors.filter(r => r.severity === 'high').length;
    
    switch (viewMode) {
      case 'executive':
        return {
          title: '⚡ 30-Second Executive Summary',
          subtitle: `${docType} • ${confidence.toFixed(1)}% AI Confidence`,
          content: `
**Document Type:** ${docType} ${hasParties ? 'between multiple parties' : 'with legal obligations'}

**Financial Impact:** ${formattedAmount ? `Primary amount: ${formattedAmount}` : 'No major financial amounts identified'}

**Risk Assessment:** ${riskLevel.toUpperCase()} risk level ${highRiskFactors > 0 ? `with ${highRiskFactors} high-priority concerns` : 'with standard legal considerations'}

**Key Points:** 
• ${keyClauses.length} critical clauses analyzed
• ${allDates.length} important dates ${urgentDate ? `(nearest deadline: ${urgentDate.date || 'TBD'})` : 'identified'}
• ${riskFactors.length} risk factors evaluated

**Recommendation:** ${riskLevel === 'low' ? '✅ Standard review process adequate' : riskLevel === 'medium' ? '⚠️ Detailed review of highlighted areas recommended' : '🚨 Legal consultation strongly advised before proceeding'}
          `.trim()
        };
        
      case 'plain':
        return {
          title: '📝 Plain English Explanation', 
          subtitle: `Easy-to-understand breakdown of your ${docType.toLowerCase()}`,
          content: `
**What is this document?**
This is a ${docType.toLowerCase()} that ${docType.toLowerCase().includes('agreement') || docType.toLowerCase().includes('contract') ? 'creates legal obligations and defines terms between parties' : docType.toLowerCase().includes('lease') ? 'establishes rental terms and conditions' : docType.toLowerCase().includes('employment') ? 'defines work relationship and compensation' : docType.toLowerCase().includes('service') ? 'outlines services to be provided and payment terms' : 'contains important legal provisions'}.

**Money Matters:**
${formattedAmount ? `The main amount mentioned is ${formattedAmount}. ${primaryAmount?.type === 'salary' ? 'This appears to be salary/compensation.' : primaryAmount?.type === 'fee' ? 'This appears to be a fee or charge.' : primaryAmount?.type === 'deposit' ? 'This appears to be a deposit or advance payment.' : 'This is the primary financial consideration.'}` : 'No specific monetary amounts were clearly identified in the document.'}

**Risk Level:**
This document is considered **${riskLevel.toUpperCase()} RISK**. ${riskLevel === 'low' ? 'This means the terms appear fairly standard and straightforward with minimal concerning clauses.' : riskLevel === 'medium' ? 'This means there are some areas that need your attention and careful review before signing.' : 'This means there are several concerning clauses that could be problematic and you should definitely consult a lawyer.'}

**What You Should Know:**
• We found ${keyClauses.length} important sections that define your rights and responsibilities
• ${allDates.length > 0 ? `There are ${allDates.length} important dates to remember` : 'No specific deadlines were clearly identified'}
• ${riskFactors.length === 0 ? 'No major red flags detected' : `${riskFactors.length} areas need your attention${highRiskFactors > 0 ? ` (${highRiskFactors} are high priority)` : ''}`}
          `.trim()
        };
        
      case 'detailed':
        return {
          title: '🔍 Comprehensive Legal Analysis',
          subtitle: `Professional-grade analysis of your ${docType.toLowerCase()}`,
          content: `
**Document Classification & Confidence**
Document type: ${docType} (${confidence.toFixed(1)}% AI confidence)
Classification based on: Legal terminology patterns, document structure, and content analysis

**Financial Analysis Framework**
${allFinancials.length > 0 ? `
• Primary consideration: ${formattedAmount}
• Total monetary provisions identified: ${allFinancials.length}
• Financial term types: ${[...new Set(allFinancials.map(f => f.type).filter(Boolean))].join(', ') || 'General payments'}
• Currency analysis: ${[...new Set(allFinancials.map(f => f.currency))].join(', ')}
` : 'No specific monetary amounts identified through automated analysis.'}

**Structural & Content Analysis**
• Document sections: ${analysis?.sections?.length || 1} primary sections
• Key clauses requiring attention: ${keyClauses.length}
• Legal provisions complexity: ${keyClauses.length > 10 ? 'High' : keyClauses.length > 5 ? 'Medium' : 'Standard'}
• Clause importance distribution: ${keyClauses.filter(c => c.importance === 'high').length} high, ${keyClauses.filter(c => c.importance === 'medium').length} medium, ${keyClauses.filter(c => c.importance === 'low').length} low

**Risk Assessment Framework**
• Overall risk categorization: **${riskLevel.toUpperCase()}**
• Total risk factors analyzed: ${riskFactors.length}
• Risk severity breakdown: ${riskFactors.filter(r => r.severity === 'high').length} high, ${riskFactors.filter(r => r.severity === 'medium').length} medium, ${riskFactors.filter(r => r.severity === 'low').length} low
• Compliance frameworks: ${analysis?.riskAssessment?.complianceIssues?.length || 0} potential compliance considerations

**Timeline & Obligations Analysis**
${allDates.length > 0 ? `
• Critical dates identified: ${allDates.length}
• Deadline analysis: ${allDates.filter(d => d.type === 'deadline').length} firm deadlines, ${allDates.filter(d => d.type === 'milestone').length} milestone dates
• Most urgent obligation: ${urgentDate ? `${urgentDate.event || 'TBD'} (${urgentDate.date || 'Date TBD'})` : 'None identified'}
` : 'No specific timeline obligations clearly identified.'}

**Actionable Intelligence**
• System-generated recommendations: ${riskFactors.length}
• Areas requiring immediate attention: ${highRiskFactors}
• Suggested next steps: ${riskLevel === 'high' ? 'Legal consultation required' : riskLevel === 'medium' ? 'Detailed review and possible legal consultation' : 'Standard review process'}
          `.trim()
        };
        
      default:
        return { title: '', subtitle: '', content: '' };
    }
  };

  const viewContent = getViewModeContent();

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="space-y-8"
    >
      {/* Main analysis card */}
      <div className="bg-white/70 dark:bg-gray-900/70 backdrop-blur-xl rounded-3xl border border-gray-200/50 dark:border-gray-700/50 p-8 shadow-2xl shadow-black/10">
        <div className="flex items-start gap-6 mb-8">
          <div className="w-16 h-16 bg-gradient-to-r from-blue-500 via-indigo-500 to-purple-500 rounded-2xl flex items-center justify-center shadow-lg shadow-blue-500/25">
            <Brain className="w-8 h-8 text-white" />
          </div>
          <div className="flex-1">
            <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
              {viewContent.title}
            </h2>
            <p className="text-lg text-gray-600 dark:text-gray-400 mb-6">
              {viewContent.subtitle}
            </p>
            <div className="prose prose-lg dark:prose-invert max-w-none">
              <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                {viewContent.content}
              </p>
            </div>
          </div>
        </div>

        {/* Key insights grid */}
        <div className="grid md:grid-cols-3 gap-6 mb-8">
          <div className="bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 rounded-2xl p-6 border border-blue-200/50 dark:border-blue-800/50">
            <div className="flex items-center gap-4 mb-4">
              {getRiskIcon(analysis?.riskAssessment?.overallRisk || 'low')}
              <div>
                <h3 className="font-bold text-gray-900 dark:text-white">Risk Assessment</h3>
                <p className="text-sm text-gray-600 dark:text-gray-400">Overall risk level</p>
              </div>
            </div>
            <div className={`text-2xl font-bold mb-2 ${analysis?.riskAssessment?.overallRisk === 'high' ? 'text-red-600' : analysis?.riskAssessment?.overallRisk === 'medium' ? 'text-yellow-600' : 'text-green-600'}`}>
              {(analysis?.riskAssessment?.overallRisk || 'low').toUpperCase()}
            </div>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              {analysis?.riskAssessment?.riskFactors?.length || 0} risk factors identified
            </p>
          </div>

          <div className="bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20 rounded-2xl p-6 border border-green-200/50 dark:border-green-800/50">
            <div className="flex items-center gap-4 mb-4">
              <DollarSign className="w-6 h-6 text-green-500" />
              <div>
                <h3 className="font-bold text-gray-900 dark:text-white">Financial Value</h3>
                <p className="text-sm text-gray-600 dark:text-gray-400">Primary amount identified</p>
              </div>
            </div>
            <div className="text-2xl font-bold text-green-600 mb-2">
              {(() => {
                const amounts = analysis?.financialAnalysis?.terms || [];
                
                if (amounts.length > 0) {
                  const primaryAmount = amounts[0];
                  if (primaryAmount && primaryAmount.currency && primaryAmount.amount) {
                    return `${primaryAmount.currency === 'INR' ? '₹' : primaryAmount.currency === 'USD' ? '$' : '€'} ${primaryAmount.amount}`;
                  }
                }
                return 'No amount found';
              })()}
            </div>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              {(() => {
                const amounts = analysis?.financialAnalysis?.terms || [];
                const totalTerms = amounts.length;
                
                if (totalTerms === 0) return 'No financial terms identified';
                if (totalTerms === 1) return '1 financial term identified';
                return `${totalTerms} financial terms identified`;
              })()}
            </p>
          </div>

          <div className="bg-gradient-to-br from-purple-50 to-pink-50 dark:from-purple-900/20 dark:to-pink-900/20 rounded-2xl p-6 border border-purple-200/50 dark:border-purple-800/50">
            <div className="flex items-center gap-4 mb-4">
              <Clock className="w-6 h-6 text-purple-500" />
              <div>
                <h3 className="font-bold text-gray-900 dark:text-white">Important Dates</h3>
                <p className="text-sm text-gray-600 dark:text-gray-400">Critical deadlines</p>
              </div>
            </div>
            <div className="text-2xl font-bold text-purple-600 mb-2">
              {(() => {
                const timelineData = analysis?.timeline || [];
                const allDates = [...timelineData];

                if (allDates.length === 0) return 'No dates';                // Find the most important/urgent date
                const urgentDate = allDates.find(d => 
                  d.type === 'deadline' || 
                  d.importance === 'important' ||
                  d.event?.toLowerCase().includes('due') ||
                  d.event?.toLowerCase().includes('deadline')
                );
                
                if (urgentDate) {
                  const dateStr = urgentDate.date;
                  return dateStr || `${allDates.length} dates`;
                }
                
                return `${allDates.length} dates`;
              })()}
            </div>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              {(() => {
                const timelineData = analysis?.timeline || [];
                const allDates = [...timelineData];
                
                if (allDates.length === 0) return 'No important dates identified';
                
                const deadlines = allDates.filter(d => 
                  d.type === 'deadline' || 
                  d.importance === 'important'
                ).length;
                
                if (deadlines > 0) {
                  return deadlines === 1 ? '1 critical deadline found' : `${deadlines} critical deadlines found`;
                }
                
                return allDates.length === 1 ? '1 important date found' : `${allDates.length} important dates found`;
              })()}
            </p>
          </div>
        </div>

        {/* AI confidence and processing info */}
        <div className="bg-gray-50/80 dark:bg-gray-800/80 rounded-2xl p-6 border border-gray-200/50 dark:border-gray-700/50">
          <div className="flex items-center justify-between">
            <div>
              <h4 className="font-semibold text-gray-900 dark:text-white mb-1">AI Analysis Quality</h4>
              <p className="text-sm text-gray-600 dark:text-gray-400">Processing accuracy and confidence metrics</p>
            </div>
            <div className="flex items-center gap-4">
              <div className="text-right">
                <div className="text-2xl font-bold text-blue-600">{(analysis?.confidence || 85).toFixed(1)}%</div>
                <div className="text-xs text-gray-500">Confidence</div>
              </div>
              <div className="text-right">
                <div className="text-2xl font-bold text-green-600">{(analysis?.confidence || 90).toFixed(0)}%</div>
                <div className="text-xs text-gray-500">Quality</div>
              </div>
              <div className="text-right">
                <div className="text-2xl font-bold text-purple-600">{analysis?.textContent?.split(' ').length || 0}</div>
                <div className="text-xs text-gray-500">Words</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

// Enhanced Clauses Section with Advanced Legal Analysis
const ClausesSection = ({ analysis, expandedClause, setExpandedClause }: any) => {
  const [clauseFilter, setClauseFilter] = useState<string>('all');
  
  // Enhanced clause categorization with legal accuracy
  const enhanceClauseData = (clauses: any[]) => {
    return clauses.map((clause, index) => {
      // Determine sophisticated clause category based on content
      let enhancedType = clause.type;
      let riskLevel = 'low';
      let legalImplications: string[] = [];
      let recommendations: string[] = [];
      
      const content = clause.content?.toLowerCase() || '';
      const title = clause.title?.toLowerCase() || '';
      
      // Advanced clause categorization with legal precision
      if (content.includes('payment') || content.includes('consideration') || content.includes('amount') || title.includes('payment') || title.includes('consideration')) {
        enhancedType = 'financial_obligation';
        riskLevel = 'high';
        legalImplications = [
          'Creates binding financial obligation',
          'May include penalty clauses for default',
          'Defines payment schedule and terms'
        ];
        recommendations = [
          'Verify payment amounts and currency',
          'Check for penalty or interest clauses',
          'Ensure payment schedule is manageable'
        ];
      } else if (content.includes('termination') || content.includes('breach') || content.includes('default') || title.includes('termination')) {
        enhancedType = 'termination_clause';
        riskLevel = 'high';
        legalImplications = [
          'Defines circumstances for contract termination',
          'May result in financial penalties',
          'Could affect ongoing business operations'
        ];
        recommendations = [
          'Understand all termination triggers',
          'Review notice period requirements',
          'Assess termination cost implications'
        ];
      } else if (content.includes('liability') || content.includes('indemnit') || content.includes('damages') || title.includes('liability')) {
        enhancedType = 'liability_clause';
        riskLevel = 'high';
        legalImplications = [
          'Allocates risk and responsibility',
          'May limit or exclude certain damages',
          'Could affect insurance requirements'
        ];
        recommendations = [
          'Review liability caps and exclusions',
          'Consider insurance implications',
          'Understand indemnification scope'
        ];
      } else if (content.includes('jurisdiction') || content.includes('governing law') || content.includes('dispute') || title.includes('jurisdiction')) {
        enhancedType = 'dispute_resolution';
        riskLevel = 'medium';
        legalImplications = [
          'Determines applicable legal framework',
          'Defines dispute resolution mechanism',
          'May affect access to legal remedies'
        ];
        recommendations = [
          'Understand chosen jurisdiction implications',
          'Review dispute resolution process',
          'Consider alternative dispute resolution'
        ];
      } else if (content.includes('confidential') || content.includes('non-disclosure') || title.includes('confidential')) {
        enhancedType = 'confidentiality_clause';
        riskLevel = 'medium';
        legalImplications = [
          'Creates ongoing confidentiality obligations',
          'May survive contract termination',
          'Breach could result in significant damages'
        ];
        recommendations = [
          'Define what constitutes confidential information',
          'Understand duration of obligations',
          'Implement appropriate safeguards'
        ];
      } else if (content.includes('intellectual property') || content.includes('copyright') || content.includes('trademark') || title.includes('ip')) {
        enhancedType = 'intellectual_property';
        riskLevel = 'high';
        legalImplications = [
          'Defines ownership of intellectual property',
          'May include licensing terms',
          'Could affect future business operations'
        ];
        recommendations = [
          'Clarify IP ownership and rights',
          'Review licensing scope and limitations',
          'Consider future IP development'
        ];
      } else if (content.includes('performance') || content.includes('delivery') || content.includes('service') || title.includes('performance')) {
        enhancedType = 'performance_obligation';
        riskLevel = 'medium';
        legalImplications = [
          'Defines specific performance standards',
          'May include time-sensitive obligations',
          'Non-performance could trigger penalties'
        ];
        recommendations = [
          'Ensure performance criteria are achievable',
          'Review timeline and milestone requirements',
          'Consider force majeure implications'
        ];
      } else if (content.includes('force majeure') || content.includes('act of god') || title.includes('force majeure')) {
        enhancedType = 'force_majeure';
        riskLevel = 'low';
        legalImplications = [
          'Provides relief for unforeseeable events',
          'May suspend contract obligations',
          'Could affect liability allocation'
        ];
        recommendations = [
          'Understand covered events and exclusions',
          'Review notification requirements',
          'Consider mitigation obligations'
        ];
      }
      
      // Determine enhanced importance based on content analysis and risk
      let enhancedImportance = clause.importance;
      if (riskLevel === 'high' || content.includes('shall') || content.includes('must') || content.includes('required')) {
        enhancedImportance = 'critical';
      } else if (riskLevel === 'medium' || content.includes('should') || content.includes('may')) {
        enhancedImportance = 'important';
      } else {
        enhancedImportance = 'standard';
      }
      
      // Generate sophisticated legal explanation
      const enhancedExplanation = generateEnhancedExplanation(clause, enhancedType, riskLevel);
      
      return {
        ...clause,
        type: enhancedType,
        importance: enhancedImportance,
        riskLevel,
        legalImplications,
        recommendations,
        explanation: enhancedExplanation,
        index
      };
    });
  };
  
  const generateEnhancedExplanation = (clause: any, type: string, riskLevel: string) => {
    const baseExplanation = clause.explanation || 'This clause requires legal review.';
    
    const typeExplanations = {
      financial_obligation: 'This financial clause establishes monetary obligations and payment terms. It is legally binding and creates enforceable payment duties.',
      termination_clause: 'This termination provision defines how and when the contract can be ended. It may include notice periods, conditions precedent, and consequences of termination.',
      liability_clause: 'This liability provision allocates risk between parties and may limit certain types of damages. It directly affects your legal exposure.',
      dispute_resolution: 'This clause determines how legal disputes will be resolved, including jurisdiction, governing law, and dispute resolution mechanisms.',
      confidentiality_clause: 'This confidentiality provision creates ongoing obligations to protect sensitive information, often surviving contract termination.',
      intellectual_property: 'This intellectual property clause defines ownership, licensing, and usage rights for IP assets, which can significantly impact business operations.',
      performance_obligation: 'This performance clause specifies what must be delivered, when, and to what standard. Non-compliance may trigger penalties or termination.',
      force_majeure: 'This force majeure provision provides relief from performance obligations due to extraordinary circumstances beyond parties\' control.'
    };
    
    const typeExplanation = typeExplanations[type as keyof typeof typeExplanations] || 'This clause contains important contractual provisions that require careful consideration.';
    
    const riskExplanation = {
      high: ' **HIGH RISK**: This clause could have significant legal and financial implications. Professional legal review is strongly recommended.',
      medium: ' **MEDIUM RISK**: This clause has moderate implications and should be carefully reviewed and understood.',
      low: ' **LOW RISK**: This clause has minimal risk but should still be understood as part of your overall obligations.'
    };
    
    return `${typeExplanation}${riskExplanation[riskLevel as keyof typeof riskExplanation]} ${baseExplanation}`;
  };
  
  const enhancedClauses = analysis?.keyClauses ? enhanceClauseData(analysis.keyClauses) : [];
  
  // Filter clauses by type
  const filteredClauses = clauseFilter === 'all' ? enhancedClauses : 
    enhancedClauses.filter(clause => 
      clauseFilter === 'high-risk' ? clause.riskLevel === 'high' :
      clauseFilter === 'financial' ? clause.type.includes('financial') :
      clauseFilter === 'critical' ? clause.importance === 'critical' :
      clause.type.includes(clauseFilter)
    );
  
  const clauseTypes = ['all', 'high-risk', 'financial', 'critical', 'termination', 'liability'];
  
  const getClauseIcon = (type: string) => {
    switch (type) {
      case 'financial_obligation': return '💰';
      case 'termination_clause': return '🚫';
      case 'liability_clause': return '⚖️';
      case 'dispute_resolution': return '🏛️';
      case 'confidentiality_clause': return '🔒';
      case 'intellectual_property': return '💡';
      case 'performance_obligation': return '✅';
      case 'force_majeure': return '🌪️';
      default: return '📄';
    }
  };
  
  const getRiskColor = (riskLevel: string) => {
    switch (riskLevel) {
      case 'high': return 'bg-red-500';
      case 'medium': return 'bg-yellow-500';
      default: return 'bg-green-500';
    }
  };
  
  const getImportanceBadge = (importance: string) => {
    switch (importance) {
      case 'critical': return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200';
      case 'important': return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200';
      default: return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200';
    }
  };
  
  // Debug: What's in the analysis?
  console.log('🧩 Enhanced ClausesSection Debug:', {
    hasAnalysis: !!analysis,
    analysisType: typeof analysis,
    keyClauses: analysis?.keyClauses,
    keyClausesLength: analysis?.keyClauses?.length,
    enhancedClausesLength: enhancedClauses.length,
    analysisKeys: analysis ? Object.keys(analysis) : 'No analysis'
  });
  
  return (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    exit={{ opacity: 0, y: -20 }}
    className="space-y-6"
  >
    {/* Enhanced Header with Analytics */}
    <div className="bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-gray-800 dark:to-gray-900 rounded-2xl p-6 border border-blue-200 dark:border-gray-700">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
            <FileText className="w-6 h-6 text-blue-600" />
            Advanced Clause Analysis
          </h2>
          <p className="text-gray-600 dark:text-gray-400 mt-1">
            AI-powered legal clause categorization and risk assessment
          </p>
        </div>
        <div className="text-right">
          <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">{enhancedClauses.length}</div>
          <div className="text-sm text-gray-500">Clauses Analyzed</div>
        </div>
      </div>
      
      {/* Clause Analytics Dashboard */}
      <div className="grid grid-cols-4 gap-4 mb-4">
        <div className="bg-white/50 dark:bg-gray-800/50 rounded-lg p-3 text-center">
          <div className="text-lg font-bold text-red-600">{enhancedClauses.filter(c => c.riskLevel === 'high').length}</div>
          <div className="text-xs text-gray-500">High Risk</div>
        </div>
        <div className="bg-white/50 dark:bg-gray-800/50 rounded-lg p-3 text-center">
          <div className="text-lg font-bold text-red-800">{enhancedClauses.filter(c => c.importance === 'critical').length}</div>
          <div className="text-xs text-gray-500">Critical</div>
        </div>
        <div className="bg-white/50 dark:bg-gray-800/50 rounded-lg p-3 text-center">
          <div className="text-lg font-bold text-green-600">{enhancedClauses.filter(c => c.type.includes('financial')).length}</div>
          <div className="text-xs text-gray-500">Financial</div>
        </div>
        <div className="bg-white/50 dark:bg-gray-800/50 rounded-lg p-3 text-center">
          <div className="text-lg font-bold text-purple-600">{enhancedClauses.filter(c => c.type.includes('liability')).length}</div>
          <div className="text-xs text-gray-500">Liability</div>
        </div>
      </div>
      
      {/* Advanced Clause Filter */}
      <div className="flex flex-wrap gap-2">
        {clauseTypes.map(type => (
          <button
            key={type}
            onClick={() => setClauseFilter(type)}
            className={`px-3 py-1.5 text-xs font-medium rounded-full transition-all ${
              clauseFilter === type 
                ? 'bg-blue-600 text-white shadow-md' 
                : 'bg-white/70 text-gray-600 hover:bg-blue-50 dark:bg-gray-700 dark:text-gray-300'
            }`}
          >
            {type.charAt(0).toUpperCase() + type.slice(1).replace('-', ' ')} ({
              type === 'all' ? enhancedClauses.length :
              type === 'high-risk' ? enhancedClauses.filter(c => c.riskLevel === 'high').length :
              type === 'financial' ? enhancedClauses.filter(c => c.type.includes('financial')).length :
              type === 'critical' ? enhancedClauses.filter(c => c.importance === 'critical').length :
              enhancedClauses.filter(c => c.type.includes(type)).length
            })
          </button>
        ))}
      </div>
    </div>

    {/* Enhanced Clauses List */}
    <div className="bg-white/60 dark:bg-gray-800/60 backdrop-blur-xl rounded-2xl border border-white/20 dark:border-gray-700/20 p-8">
      {filteredClauses.length > 0 ? (
        <div className="space-y-4">
          {filteredClauses.map((clause: any) => (
            <motion.div
              key={clause.id}
              className="border border-gray-200 dark:border-gray-700 rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-all"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: clause.index * 0.05 }}
            >
              <button
                onClick={() => setExpandedClause(expandedClause === clause.id ? null : clause.id)}
                className="w-full p-6 text-left hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className="flex items-center gap-2">
                      <span className="text-2xl">{getClauseIcon(clause.type)}</span>
                      <div className={`w-3 h-3 rounded-full ${getRiskColor(clause.riskLevel)}`} />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <h3 className="text-lg font-semibold text-gray-900 dark:text-white">{clause.title}</h3>
                        <span className={`px-2 py-1 text-xs font-semibold rounded-full ${getImportanceBadge(clause.importance)}`}>
                          {clause.importance.toUpperCase()}
                        </span>
                      </div>
                      <div className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400">
                        <span className="capitalize">{clause.type.replace('_', ' ')}</span>
                        <span>•</span>
                        <span className={`font-medium ${
                          clause.riskLevel === 'high' ? 'text-red-600' :
                          clause.riskLevel === 'medium' ? 'text-yellow-600' : 'text-green-600'
                        }`}>
                          {clause.riskLevel.toUpperCase()} RISK
                        </span>
                      </div>
                    </div>
                  </div>
                  <ChevronRight className={`w-5 h-5 text-gray-400 transition-transform ${expandedClause === clause.id ? 'rotate-90' : ''}`} />
                </div>
              </button>
              
              <AnimatePresence>
                {expandedClause === clause.id && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    className="border-t border-gray-200 dark:border-gray-700"
                  >
                    <div className="p-6 space-y-6">
                      {/* Clause Content */}
                      <div>
                        <h4 className="font-semibold text-gray-900 dark:text-white mb-2 flex items-center gap-2">
                          <FileText className="w-4 h-4" />
                          Clause Content
                        </h4>
                        <p className="text-gray-700 dark:text-gray-300 bg-gray-50 dark:bg-gray-800 p-4 rounded-lg border-l-4 border-blue-500">{clause.content}</p>
                      </div>
                      
                      {/* Enhanced Legal Analysis */}
                      <div>
                        <h4 className="font-semibold text-gray-900 dark:text-white mb-2 flex items-center gap-2">
                          <Scale className="w-4 h-4" />
                          Legal Analysis
                        </h4>
                        <p className="text-gray-600 dark:text-gray-400 leading-relaxed">{clause.explanation}</p>
                      </div>
                      
                      {/* Legal Implications */}
                      {clause.legalImplications && clause.legalImplications.length > 0 && (
                        <div>
                          <h4 className="font-semibold text-gray-900 dark:text-white mb-2 flex items-center gap-2">
                            <Gavel className="w-4 h-4" />
                            Legal Implications
                          </h4>
                          <ul className="space-y-2">
                            {clause.legalImplications.map((implication: string, index: number) => (
                              <li key={index} className="flex items-start gap-2 text-sm text-blue-700 dark:text-blue-300">
                                <ChevronRight className="w-4 h-4 mt-0.5 flex-shrink-0" />
                                <span>{implication}</span>
                              </li>
                            ))}
                          </ul>
                        </div>
                      )}
                      
                      {/* Professional Recommendations */}
                      {clause.recommendations && clause.recommendations.length > 0 && (
                        <div>
                          <h4 className="font-semibold text-gray-900 dark:text-white mb-2 flex items-center gap-2">
                            <Lightbulb className="w-4 h-4" />
                            Professional Recommendations
                          </h4>
                          <ul className="space-y-2">
                            {clause.recommendations.map((rec: string, index: number) => (
                              <li key={index} className="flex items-start gap-2 text-sm text-green-700 dark:text-green-300">
                                <CheckCircle className="w-4 h-4 mt-0.5 flex-shrink-0" />
                                <span>{rec}</span>
                              </li>
                            ))}
                          </ul>
                        </div>
                      )}
                      
                      {/* Potential Issues */}
                      {clause.potentialIssues && clause.potentialIssues.length > 0 && (
                        <div>
                          <h4 className="font-semibold text-gray-900 dark:text-white mb-2 flex items-center gap-2">
                            <AlertTriangle className="w-4 h-4" />
                            Potential Issues & Risks
                          </h4>
                          <ul className="space-y-2">
                            {clause.potentialIssues.map((issue: string, index: number) => (
                              <li key={index} className="flex items-start gap-2 text-sm text-red-600 dark:text-red-400">
                                <AlertTriangle className="w-4 h-4 mt-0.5 flex-shrink-0" />
                                <span>{issue}</span>
                              </li>
                            ))}
                          </ul>
                        </div>
                      )}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          ))}
        </div>
      ) : (
        <div className="text-center py-12">
          <FileText className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">No Clauses Found</h3>
          <p className="text-gray-500 dark:text-gray-400">
            {clauseFilter === 'all' 
              ? 'No key clauses were identified in this document.' 
              : `No clauses match the "${clauseFilter}" filter.`}
          </p>
        </div>
      )}
    </div>
  </motion.div>
  );
};

const RiskAnalysisSection = ({ analysis }: { analysis: EnhancedAnalysis }) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    exit={{ opacity: 0, y: -20 }}
  >
    <div className="bg-white/60 dark:bg-gray-800/60 backdrop-blur-xl rounded-2xl border border-white/20 dark:border-gray-700/20 p-8">
      <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">Risk Assessment</h2>
      <div className="space-y-6">
        <div className={`p-6 rounded-xl border-2 ${(analysis?.riskAssessment?.overallRisk || 'low') === 'high' ? 'border-red-200 bg-red-50 dark:border-red-800 dark:bg-red-900/20' : (analysis?.riskAssessment?.overallRisk || 'low') === 'medium' ? 'border-yellow-200 bg-yellow-50 dark:border-yellow-800 dark:bg-yellow-900/20' : 'border-green-200 bg-green-50 dark:border-green-800 dark:bg-green-900/20'}`}>
          <div className="flex items-center gap-3 mb-4">
            <div className={`w-12 h-12 rounded-full flex items-center justify-center ${(analysis?.riskAssessment?.overallRisk || 'low') === 'high' ? 'bg-red-100 text-red-600 dark:bg-red-800 dark:text-red-300' : (analysis?.riskAssessment?.overallRisk || 'low') === 'medium' ? 'bg-yellow-100 text-yellow-600 dark:bg-yellow-800 dark:text-yellow-300' : 'bg-green-100 text-green-600 dark:bg-green-800 dark:text-green-300'}`}>
              <AlertTriangle className="w-6 h-6" />
            </div>
            <div>
              <h3 className="text-xl font-bold text-gray-900 dark:text-white">Overall Risk: {(analysis?.riskAssessment?.overallRisk || 'low').toUpperCase()}</h3>
              <p className="text-gray-600 dark:text-gray-400">{analysis?.riskAssessment?.riskFactors?.length || 0} risk factors identified</p>
            </div>
          </div>
        </div>
        
        {analysis?.riskAssessment?.riskFactors && analysis.riskAssessment.riskFactors.length > 0 && (
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Risk Factors:</h3>
            {analysis.riskAssessment.riskFactors.map((risk: any) => (
              <div key={risk.id} className="border border-gray-200 dark:border-gray-700 rounded-lg p-4">
                <div className="flex items-start gap-3 mb-2">
                  <div className={`w-3 h-3 rounded-full mt-2 ${risk.severity === 'high' ? 'bg-red-500' : risk.severity === 'medium' ? 'bg-yellow-500' : 'bg-green-500'}`} />
                  <div className="flex-1">
                    <h4 className="font-semibold text-gray-900 dark:text-white">{risk.type}</h4>
                    <p className="text-gray-600 dark:text-gray-400 text-sm mb-2">{risk.description}</p>
                    <div className="space-y-1 text-sm">
                      <p><span className="font-medium text-gray-700 dark:text-gray-300">Location:</span> {risk.location}</p>
                      <p><span className="font-medium text-gray-700 dark:text-gray-300">Recommendation:</span> {risk.recommendation}</p>
                    </div>
                  </div>
                  <span className={`px-2 py-1 rounded text-xs font-medium ${risk.severity === 'high' ? 'bg-red-100 text-red-800 dark:bg-red-900/50 dark:text-red-300' : risk.severity === 'medium' ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/50 dark:text-yellow-300' : 'bg-green-100 text-green-800 dark:bg-green-900/50 dark:text-green-300'}`}>
                    {risk.severity.toUpperCase()}
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  </motion.div>
);

const QASection = ({ qaQuery, setQaQuery, qaHistory, onSubmit }: any) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    exit={{ opacity: 0, y: -20 }}
  >
    <div className="bg-white/60 dark:bg-gray-800/60 backdrop-blur-xl rounded-2xl border border-white/20 dark:border-gray-700/20 p-8">
      <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">Interactive Q&A Assistant</h2>
      
      <form onSubmit={onSubmit} className="flex gap-3">
        <input
          type="text"
          value={qaQuery}
          onChange={(e) => setQaQuery(e.target.value)}
          placeholder="Ask me anything about this document..."
          className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        />
        <button
          type="submit"
          className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
          Ask
        </button>
      </form>
    </div>
  </motion.div>
);

const NegotiationSection = ({ analysis }: { analysis: EnhancedAnalysis }) => {
  const riskFactors = analysis?.riskAssessment?.riskFactors || [];
  const keyClauses = analysis?.keyClauses || [];
  const financialTerms = analysis?.financialAnalysis?.terms || [];
  
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="space-y-6"
    >
      <div className="bg-white/60 dark:bg-gray-800/60 backdrop-blur-xl rounded-2xl border border-white/20 dark:border-gray-700/20 p-8">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6 flex items-center gap-3">
          <Scale className="w-6 h-6 text-blue-600" />
          Negotiation Strategy
        </h2>
        
        {/* Risk-based recommendations */}
        {riskFactors.length > 0 && (
          <div className="mb-8">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">⚠️ Risk Mitigation Points</h3>
            <div className="space-y-3">
              {riskFactors.slice(0, 3).map((risk: any, index: number) => (
                <div key={index} className="bg-red-50 dark:bg-red-900/20 rounded-lg p-4 border border-red-200 dark:border-red-800">
                  <h4 className="font-semibold text-red-800 dark:text-red-400 mb-2">{risk.type}</h4>
                  <p className="text-red-700 dark:text-red-300 text-sm mb-2">{risk.description}</p>
                  <p className="text-red-600 dark:text-red-400 text-sm font-medium">💡 Negotiate: {risk.recommendation}</p>
                </div>
              ))}
            </div>
          </div>
        )}
        
        {/* Financial negotiations */}
        {financialTerms.length > 0 && (
          <div className="mb-8">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">💰 Financial Negotiation Points</h3>
            <div className="space-y-3">
              <div className="bg-green-50 dark:bg-green-900/20 rounded-lg p-4 border border-green-200 dark:border-green-800">
                <h4 className="font-semibold text-green-800 dark:text-green-400 mb-2">Payment Terms</h4>
                <p className="text-green-700 dark:text-green-300 text-sm mb-2">Amount: {financialTerms[0]?.amount} {financialTerms[0]?.currency}</p>
                <ul className="text-green-600 dark:text-green-400 text-sm space-y-1">
                  <li>• Request payment milestones to reduce risk</li>
                  <li>• Negotiate penalty clauses for late payments</li>
                  <li>• Consider escrow for large amounts</li>
                </ul>
              </div>
            </div>
          </div>
        )}
        
        {/* General negotiation tips */}
        <div className="mb-6">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">🎯 Key Negotiation Strategies</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-4 border border-blue-200 dark:border-blue-800">
              <h4 className="font-semibold text-blue-800 dark:text-blue-400 mb-2">🔒 Protect Your Interests</h4>
              <ul className="text-blue-700 dark:text-blue-300 text-sm space-y-1">
                <li>• Add liability caps</li>
                <li>• Include termination rights</li>
                <li>• Require written change orders</li>
              </ul>
            </div>
            <div className="bg-purple-50 dark:bg-purple-900/20 rounded-lg p-4 border border-purple-200 dark:border-purple-800">
              <h4 className="font-semibold text-purple-800 dark:text-purple-400 mb-2">⚡ Gain Leverage</h4>
              <ul className="text-purple-700 dark:text-purple-300 text-sm space-y-1">
                <li>• Request performance guarantees</li>
                <li>• Add penalty clauses</li>
                <li>• Include audit rights</li>
              </ul>
            </div>
          </div>
        </div>
        
        {keyClauses.length === 0 && riskFactors.length === 0 && (
          <div className="text-center py-8 text-gray-500">
            Upload and analyze a document to get personalized negotiation recommendations.
          </div>
        )}
      </div>
    </motion.div>
  );
};

const EducationSection = ({ analysis }: { analysis: EnhancedAnalysis }) => {
  const keyClauses = analysis?.keyClauses || [];
  const documentType = analysis?.documentType || 'Legal Document';
  
  // Use dynamic legal terms from analysis if available, otherwise use static fallback
  const legalTerms = analysis?.keyTerms?.length > 0 ? analysis.keyTerms : [
    { term: 'Consideration', definition: 'Something of value exchanged between parties in a contract', context: 'The mutual exchange of benefits that makes a contract legally binding', importance: 'Essential for contract validity' },
    { term: 'Liability', definition: 'Legal responsibility for damages or losses', context: 'Determines who is responsible for costs when things go wrong', importance: 'Risk allocation and financial protection' },
    { term: 'Indemnification', definition: 'Protection from legal and financial liability', context: 'One party agrees to compensate the other for certain damages or losses', importance: 'Risk mitigation and liability protection' },
    { term: 'Breach', definition: 'Violation of contract terms or conditions', context: 'When one party fails to fulfill their obligations under the agreement', importance: 'Defines consequences for non-compliance' },
    { term: 'Termination', definition: 'How and when the agreement can be ended', context: 'Specifies conditions and procedures for ending the contractual relationship', importance: 'Exit strategy and relationship management' },
    { term: 'Force Majeure', definition: 'Unforeseeable circumstances that prevent contract performance', context: 'Protects parties from liability when extraordinary events occur', importance: 'Risk mitigation for uncontrollable events' }
  ];
  
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="space-y-6"
    >
      <div className="bg-white/60 dark:bg-gray-800/60 backdrop-blur-xl rounded-2xl border border-white/20 dark:border-gray-700/20 p-8">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6 flex items-center gap-3">
          <GraduationCap className="w-6 h-6 text-indigo-600" />
          Legal Education Hub
        </h2>
        
        {/* Document type explanation */}
        <div className="mb-8">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">📋 Understanding Your {documentType}</h3>
          <div className="bg-indigo-50 dark:bg-indigo-900/20 rounded-lg p-6 border border-indigo-200 dark:border-indigo-800">
            {documentType.toLowerCase().includes('purchase') && (
              <div>
                <h4 className="font-semibold text-indigo-800 dark:text-indigo-400 mb-2">Purchase Agreement Basics</h4>
                <p className="text-indigo-700 dark:text-indigo-300 mb-3">A legal contract between buyer and seller outlining terms of sale, including price, delivery, and transfer of ownership.</p>
                <div className="text-indigo-600 dark:text-indigo-400 text-sm">
                  <strong>Key Components:</strong> Purchase price, payment terms, delivery conditions, warranties, and dispute resolution.
                </div>
              </div>
            )}
            {documentType.toLowerCase().includes('service') && (
              <div>
                <h4 className="font-semibold text-indigo-800 dark:text-indigo-400 mb-2">Service Agreement Essentials</h4>
                <p className="text-indigo-700 dark:text-indigo-300 mb-3">Contract defining services to be provided, compensation, timeline, and responsibilities of both parties.</p>
                <div className="text-indigo-600 dark:text-indigo-400 text-sm">
                  <strong>Key Elements:</strong> Scope of work, payment schedule, deliverables, performance standards, and termination clauses.
                </div>
              </div>
            )}
            {!documentType.toLowerCase().includes('purchase') && !documentType.toLowerCase().includes('service') && (
              <div>
                <h4 className="font-semibold text-indigo-800 dark:text-indigo-400 mb-2">Legal Document Overview</h4>
                <p className="text-indigo-700 dark:text-indigo-300 mb-3">This document creates legally binding obligations between the parties involved.</p>
                <div className="text-indigo-600 dark:text-indigo-400 text-sm">
                  <strong>Important:</strong> Review all terms carefully and understand your rights and obligations before signing.
                </div>
              </div>
            )}
          </div>
        </div>
        
        {/* Legal terms dictionary */}
        <div className="mb-8">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">📚 Legal Terms Dictionary</h3>
          <div className="space-y-4">
            {legalTerms.map((item, index) => (
              <div key={index} className="bg-gray-50 dark:bg-gray-800/50 rounded-lg p-4 border border-gray-200 dark:border-gray-700">
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center flex-shrink-0">
                    <span className="text-white font-bold text-sm">{item.term[0]}</span>
                  </div>
                  <div className="flex-1">
                    <h4 className="font-semibold text-gray-900 dark:text-white mb-2">{item.term}</h4>
                    <p className="text-gray-700 dark:text-gray-300 text-sm mb-2">{item.definition}</p>
                    {(item as any).context && (
                      <p className="text-blue-600 dark:text-blue-400 text-xs mb-2">Context: {(item as any).context}</p>
                    )}
                    {(item as any).importance && (
                      <p className="text-purple-600 dark:text-purple-400 text-xs mb-2">Importance: {(item as any).importance}</p>
                    )}
                    {(item as any).example && (
                      <p className="text-gray-600 dark:text-gray-400 text-xs italic">Example: {(item as any).example}</p>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
        
        {/* Document-specific insights */}
        {keyClauses.length > 0 && (
          <div className="mb-6">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">🎯 Terms Found in Your Document</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {keyClauses.slice(0, 4).map((clause: any, index: number) => (
                <div key={index} className="bg-green-50 dark:bg-green-900/20 rounded-lg p-4 border border-green-200 dark:border-green-800">
                  <h4 className="font-semibold text-green-800 dark:text-green-400 mb-2">{clause.title}</h4>
                  <p className="text-green-700 dark:text-green-300 text-sm">
                    {clause.explanation || 'This clause defines important terms and conditions in your document.'}
                  </p>
                </div>
              ))}
            </div>
          </div>
        )}
        
        {/* Learning resources */}
        <div className="bg-yellow-50 dark:bg-yellow-900/20 rounded-lg p-6 border border-yellow-200 dark:border-yellow-800">
          <h3 className="text-lg font-semibold text-yellow-800 dark:text-yellow-400 mb-3">💡 Best Practices</h3>
          <ul className="text-yellow-700 dark:text-yellow-300 text-sm space-y-2">
            <li>• Always read the entire document before signing</li>
            <li>• Ask questions about unclear terms or clauses</li>
            <li>• Consider having a lawyer review important agreements</li>
            <li>• Keep copies of all signed documents</li>
            <li>• Understand your rights and obligations</li>
          </ul>
        </div>
      </div>
    </motion.div>
  );
};
