'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { generateAnalysisPDF } from '@/utils/pdfGenerator';
import RiskAlertSystem from './RiskAlertSystem';
import NegotiationAssistant from './NegotiationAssistant';
import { 
  FileText, 
  Users, 
  DollarSign, 
  AlertTriangle, 
  CheckCircle, 
  Clock, 
  Scale,
  BookOpen,
  TrendingUp,
  Shield,
  X,
  Download,
  Share2,
  MessageCircle,
  ChevronDown,
  ChevronRight,
  ExternalLink,
  Star,
  Award,
  Eye,
  Calendar,
  Target,
  Archive,
  RefreshCw
} from 'lucide-react';

interface EnhancedAnalysisResultsProps {
  results: any;
  onClose?: () => void;
  onTalkToExpert?: () => void;
  onDownload?: () => void;
  onShare?: () => void;
}

const EnhancedAnalysisResults: React.FC<EnhancedAnalysisResultsProps> = ({
  results,
  onClose,
  onTalkToExpert,
  onDownload,
  onShare
}) => {
  const [activeTab, setActiveTab] = useState('overview');
  const [expandedSections, setExpandedSections] = useState<Set<string>>(new Set(['overview']));
  const [showExpertChat, setShowExpertChat] = useState(false);
  const [showRegenerateModal, setShowRegenerateModal] = useState(false);
  const [regenerating, setRegenerating] = useState(false);

  // Clean markdown formatting from text
  const cleanMarkdown = (text: string) => {
    if (!text) return text;
    return text
      .replace(/\*{3}([^*]+)\*{3}/g, '$1') // Remove ***bold***
      .replace(/\*{2}([^*]+)\*{2}/g, '$1') // Remove **bold**  
      .replace(/\*([^*]+)\*/g, '$1') // Remove *italic*
      .replace(/`([^`]+)`/g, '$1') // Remove `code`
      .replace(/#{1,6}\s/g, '') // Remove headers
      .replace(/^\s*[-*+]\s/gm, '• ') // Convert bullet points
      .trim();
  };

  if (!results) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 to-blue-50 dark:from-gray-900 dark:to-gray-800">
        <div className="text-center p-8">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600 mx-auto mb-4"></div>
          <p className="text-gray-600 dark:text-gray-400">Loading analysis results...</p>
        </div>
      </div>
    );
  }

  // Handle both direct analysis object and nested structure  
  const analysis = results.analysis || results;

  const tabs = [
    { id: 'overview', name: 'Overview', icon: FileText, color: 'text-blue-600' },
    { id: 'parties', name: 'Key Parties', icon: Users, color: 'text-green-600' },
    { id: 'financial', name: 'Financial', icon: DollarSign, color: 'text-yellow-600' },
    { id: 'risks', name: 'Risk Assessment', icon: AlertTriangle, color: 'text-red-600' },
    { id: 'negotiation', name: 'Negotiation Assistant', icon: MessageCircle, color: 'text-purple-600' },
    { id: 'education', name: 'Legal Terms', icon: BookOpen, color: 'text-indigo-600' },
    { id: 'clauses', name: 'Key Clauses', icon: Scale, color: 'text-purple-600' },
    { id: 'timeline', name: 'Timeline', icon: Clock, color: 'text-indigo-600' },
    { id: 'insights', name: 'AI Insights', icon: Target, color: 'text-pink-600' }
  ];

  const toggleSection = (sectionId: string) => {
    const newExpanded = new Set(expandedSections);
    if (newExpanded.has(sectionId)) {
      newExpanded.delete(sectionId);
    } else {
      newExpanded.add(sectionId);
    }
    setExpandedSections(newExpanded);
  };

  const getRiskLevelColor = (risk: string) => {
    switch (risk?.toLowerCase()) {
      case 'high': return 'text-red-600 bg-red-50 border-red-200 dark:bg-red-900/20 dark:text-red-400';
      case 'medium': return 'text-yellow-600 bg-yellow-50 border-yellow-200 dark:bg-yellow-900/20 dark:text-yellow-400';
      case 'low': return 'text-green-600 bg-green-50 border-green-200 dark:bg-green-900/20 dark:text-green-400';
      default: return 'text-gray-600 bg-gray-50 border-gray-200 dark:bg-gray-800 dark:text-gray-400';
    }
  };

  const getImportanceBadge = (importance: string) => {
    const colors = {
      high: 'bg-red-100 text-red-800 border-red-200 dark:bg-red-900/30 dark:text-red-400',
      medium: 'bg-yellow-100 text-yellow-800 border-yellow-200 dark:bg-yellow-900/30 dark:text-yellow-400',
      low: 'bg-green-100 text-green-800 border-green-200 dark:bg-green-900/30 dark:text-green-400'
    };
    return colors[importance?.toLowerCase() as keyof typeof colors] || colors.medium;
  };

  const handleTalkToExpert = () => {
    setShowExpertChat(true);
    if (onTalkToExpert) onTalkToExpert();
  };

  const handleDownload = async () => {
    try {
      const fileName = `legal-analysis-${new Date().toISOString().split('T')[0]}.pdf`;
      await generateAnalysisPDF(analysis, fileName);
      console.log('PDF download completed successfully');
    } catch (error) {
      console.error('PDF generation failed:', error);
      // You could show a toast notification here
    }
    
    if (onDownload) onDownload();
  };

  const handleShare = async () => {
    try {
      const response = await fetch('/api/share-analysis', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          analysisData: results,
          expirationHours: 24, // Link expires in 24 hours
          maxAccess: 10 // Maximum 10 views
        })
      });

      if (!response.ok) {
        throw new Error('Failed to create shareable link');
      }

      const result = await response.json();
      
      // Copy the share URL to clipboard
      await navigator.clipboard.writeText(result.shareUrl);
      
      // Show success message (you could implement a toast notification here)
      console.log('Share link copied to clipboard:', result.shareUrl);
      alert(`Share link copied to clipboard!\n\nThe link will expire on ${new Date(result.expiresAt).toLocaleDateString()} and can be accessed up to ${result.maxAccess} times.`);
      
    } catch (error) {
      console.error('Failed to create share link:', error);
      alert('Failed to create share link. Please try again.');
    }
    
    if (onShare) onShare();
  };

  const handleRegenerate = async (mode: 'quick' | 'deep' | 'comprehensive') => {
    setRegenerating(true);
    setShowRegenerateModal(false);
    
    try {
      // In a real implementation, you would call your API to regenerate the analysis
      // For now, we'll simulate it
      console.log(`Regenerating analysis in ${mode} mode...`);
      
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 3000));
      
      // In practice, you would update the results state with new analysis data
      alert(`Analysis regenerated in ${mode} mode! (This is a demo - in production, this would fetch new analysis data)`);
      
    } catch (error) {
      console.error('Failed to regenerate analysis:', error);
      alert('Failed to regenerate analysis. Please try again.');
    } finally {
      setRegenerating(false);
    }
  };

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.3 }}
      className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 dark:from-gray-900 dark:to-gray-800"
    >
      {/* Enhanced Header */}
      <motion.div 
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.1 }}
        className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 px-6 py-6 shadow-lg sticky top-0 z-40"
      >
        <div className="flex items-center justify-between max-w-7xl mx-auto">
          <div className="flex items-center space-x-4">
            <div className="p-3 bg-gradient-to-br from-purple-600 to-pink-600 rounded-xl shadow-lg">
              <FileText className="w-7 h-7 text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
                Analysis Results
              </h1>
              <div className="flex items-center space-x-4 mt-1">
                <span className="text-sm text-gray-600 dark:text-gray-400">
                  {analysis.documentType || 'Legal Document'}
                </span>
                <div className="flex items-center space-x-1">
                  <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                  <span className="text-sm font-medium text-green-600">
                    {analysis.confidence}% Confidence
                  </span>
                </div>
                <div className="flex items-center space-x-1">
                  <Award className="w-4 h-4 text-yellow-500" />
                  <span className="text-sm font-medium text-yellow-600">AI Analyzed</span>
                </div>
              </div>
            </div>
          </div>
          <div className="flex items-center space-x-3">
            <motion.button 
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setShowRegenerateModal(true)}
              disabled={regenerating}
              className="flex items-center space-x-2 px-4 py-2 bg-gradient-to-r from-orange-600 to-red-600 text-white rounded-lg hover:from-orange-700 hover:to-red-700 transition-all shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <RefreshCw className={`w-4 h-4 ${regenerating ? 'animate-spin' : ''}`} />
              <span>{regenerating ? 'Regenerating...' : 'Regenerate'}</span>
            </motion.button>
            <motion.button 
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={handleTalkToExpert}
              className="flex items-center space-x-2 px-4 py-2 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-lg hover:from-blue-700 hover:to-indigo-700 transition-all shadow-lg"
            >
              <MessageCircle className="w-4 h-4" />
              <span>Talk to Expert</span>
            </motion.button>
            <motion.button 
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={handleDownload}
              className="flex items-center space-x-2 px-4 py-2 bg-gradient-to-r from-green-600 to-emerald-600 text-white rounded-lg hover:from-green-700 hover:to-emerald-700 transition-all shadow-lg"
            >
              <Download className="w-4 h-4" />
              <span>Download</span>
            </motion.button>
            <motion.button 
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={handleShare}
              className="flex items-center space-x-2 px-4 py-2 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-lg hover:from-purple-700 hover:to-pink-700 transition-all shadow-lg"
            >
              <Share2 className="w-4 h-4" />
              <span>Share</span>
            </motion.button>
            {onClose && (
              <button
                onClick={onClose}
                className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
              >
                <X className="w-5 h-5 text-gray-500" />
              </button>
            )}
          </div>
        </div>
        
        {/* Enhanced Tabs */}
        <div className="flex space-x-1 mt-4 max-w-7xl mx-auto">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            return (
              <motion.button
                key={tab.id}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center space-x-2 px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                  activeTab === tab.id
                    ? 'bg-gradient-to-r from-purple-600 to-pink-600 text-white shadow-lg'
                    : 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700'
                }`}
              >
                <Icon className={`w-4 h-4 ${activeTab === tab.id ? 'text-white' : tab.color}`} />
                <span>{tab.name}</span>
              </motion.button>
            );
          })}
        </div>
      </motion.div>

      {/* Content */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="max-w-7xl mx-auto p-6"
      >
        <AnimatePresence mode="wait">
          {activeTab === 'overview' && (
            <motion.div
              key="overview"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              className="space-y-6"
            >
              {/* Enhanced Summary Card */}
              <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700 p-6">
                <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4 flex items-center">
                  <BookOpen className="w-6 h-6 mr-3 text-indigo-500" />
                  Executive Summary
                  <div className="ml-auto flex items-center space-x-2">
                    <div className="px-3 py-1 bg-green-100 text-green-800 rounded-full text-xs font-medium">
                      AI Analyzed
                    </div>
                  </div>
                </h2>
                <div className="prose dark:prose-invert max-w-none">
                  <p className="text-gray-700 dark:text-gray-300 leading-relaxed text-base">
                    {cleanMarkdown(analysis.summary) || 'No summary available.'}
                  </p>
                </div>
              </div>

              {/* Enhanced Quick Stats */}
              <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                <motion.div 
                  whileHover={{ scale: 1.02 }}
                  className="bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700 p-6"
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Document Type</p>
                      <p className="text-2xl font-bold text-gray-900 dark:text-white">
                        {analysis.documentType || 'Unknown'}
                      </p>
                    </div>
                    <FileText className="w-8 h-8 text-blue-500" />
                  </div>
                </motion.div>

                <motion.div 
                  whileHover={{ scale: 1.02 }}
                  className="bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700 p-6"
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Confidence Score</p>
                      <div className="flex items-center space-x-2">
                        <p className="text-2xl font-bold text-green-600">{analysis.confidence}%</p>
                        <Star className="w-5 h-5 text-yellow-500 fill-current" />
                      </div>
                    </div>
                    <TrendingUp className="w-8 h-8 text-green-500" />
                  </div>
                </motion.div>

                <motion.div 
                  whileHover={{ scale: 1.02 }}
                  className="bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700 p-6"
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Risk Level</p>
                      <p className={`text-2xl font-bold ${
                        analysis.riskAssessment?.overallRisk === 'high' ? 'text-red-600' :
                        analysis.riskAssessment?.overallRisk === 'medium' ? 'text-yellow-600' :
                        'text-green-600'
                      }`}>
                        {analysis.riskAssessment?.overallRisk?.toUpperCase() || 'LOW'}
                      </p>
                    </div>
                    <Shield className="w-8 h-8 text-red-500" />
                  </div>
                </motion.div>

                <motion.div 
                  whileHover={{ scale: 1.02 }}
                  className="bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700 p-6"
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Key Parties</p>
                      <p className="text-2xl font-bold text-gray-900 dark:text-white">
                        {analysis.keyParties?.length || 0}
                      </p>
                    </div>
                    <Users className="w-8 h-8 text-purple-500" />
                  </div>
                </motion.div>
              </div>
            </motion.div>
          )}

          {activeTab === 'parties' && (
            <motion.div
              key="parties"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              className="space-y-6"
            >
              <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700">
                <div className="p-6 border-b border-gray-200 dark:border-gray-700">
                  <h2 className="text-xl font-semibold text-gray-900 dark:text-white flex items-center">
                    <Users className="w-6 h-6 mr-3 text-green-500" />
                    Key Parties
                  </h2>
                </div>
                <div className="p-6">
                  {analysis.keyParties && analysis.keyParties.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {analysis.keyParties.map((party: any, index: number) => (
                        <motion.div
                          key={index}
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: index * 0.1 }}
                          className="p-4 border border-gray-200 dark:border-gray-600 rounded-lg hover:shadow-md transition-shadow"
                        >
                          <div className="flex items-start space-x-3">
                            <div className={`p-2 rounded-lg ${
                              party.type === 'company' ? 'bg-gradient-to-br from-blue-500 to-blue-600' :
                              party.type === 'government' ? 'bg-gradient-to-br from-purple-500 to-purple-600' :
                              'bg-gradient-to-br from-green-500 to-emerald-600'
                            }`}>
                              <Users className="w-5 h-5 text-white" />
                            </div>
                            <div className="flex-1">
                              <h3 className="font-semibold text-gray-900 dark:text-white">{party.name}</h3>
                              <p className="text-sm text-gray-600 dark:text-gray-400">{party.role}</p>
                              <div className="flex items-center space-x-2 mt-2">
                                <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                                  party.entity === 'Corporation' ? 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300' :
                                  party.entity === 'Government Agency' ? 'bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-300' :
                                  party.entity === 'Financial Institution' ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300' :
                                  'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300'
                                }`}>
                                  {party.entity}
                                </span>
                                <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                                  party.category === 'primary' ? 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300' :
                                  party.category === 'secondary' ? 'bg-orange-100 text-orange-800 dark:bg-orange-900/30 dark:text-orange-300' :
                                  'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300'
                                }`}>
                                  {party.category}
                                </span>
                              </div>
                              {party.responsibilities && party.responsibilities.length > 0 && (
                                <div className="mt-3">
                                  <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">Key Responsibilities:</p>
                                  <ul className="text-xs text-gray-600 dark:text-gray-300 space-y-1">
                                    {party.responsibilities.slice(0, 2).map((resp: string, respIndex: number) => (
                                      <li key={respIndex} className="flex items-start">
                                        <span className="text-blue-500 mr-1">•</span>
                                        {resp}
                                      </li>
                                    ))}
                                  </ul>
                                </div>
                              )}
                            </div>
                          </div>
                        </motion.div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-gray-500 text-center py-8">No key parties identified in this document.</p>
                  )}
                </div>
              </div>
            </motion.div>
          )}

          {activeTab === 'financial' && (
            <motion.div
              key="financial"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              className="space-y-6"
            >
              <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700">
                <div className="p-6 border-b border-gray-200 dark:border-gray-700">
                  <h2 className="text-xl font-semibold text-gray-900 dark:text-white flex items-center">
                    <DollarSign className="w-6 h-6 mr-3 text-yellow-500" />
                    Financial Analysis
                  </h2>
                </div>
                <div className="p-6 space-y-6">
                  
                  {/* Contract Value */}
                  {analysis.financialAnalysis?.totalContractValue && (
                    <div className="bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20 rounded-lg p-4 border border-green-200 dark:border-green-700">
                      <h3 className="text-lg font-semibold text-green-800 dark:text-green-300 mb-2">Total Contract Value</h3>
                      <p className="text-2xl font-bold text-green-900 dark:text-green-100">
                        {analysis.financialAnalysis.totalContractValue}
                      </p>
                    </div>
                  )}

                  {/* Identified Amounts */}
                  {analysis.financialAnalysis?.identifiedAmounts && analysis.financialAnalysis.identifiedAmounts.length > 0 && (
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center">
                        <TrendingUp className="w-5 h-5 mr-2 text-blue-500" />
                        Financial Terms
                      </h3>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {analysis.financialAnalysis.identifiedAmounts.map((amount: any, index: number) => (
                          <motion.div
                            key={index}
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: index * 0.1 }}
                            className="p-4 border border-gray-200 dark:border-gray-600 rounded-lg hover:shadow-md transition-shadow"
                          >
                            <div className="flex items-start justify-between">
                              <div className="flex-1">
                                <p className="font-semibold text-gray-900 dark:text-white text-lg">
                                  {amount.formatted || `${amount.currency || 'USD'} ${amount.value}`}
                                </p>
                                <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                                  {amount.description || amount.context}
                                </p>
                                <div className="flex items-center space-x-2 mt-2">
                                  <span className="px-2 py-1 bg-blue-100 text-blue-800 rounded-full text-xs">
                                    {amount.type || 'Payment'}
                                  </span>
                                  {amount.frequency && (
                                    <span className="px-2 py-1 bg-purple-100 text-purple-800 rounded-full text-xs">
                                      {amount.frequency}
                                    </span>
                                  )}
                                </div>
                                {amount.dueDate && amount.dueDate !== 'Not specified' && (
                                  <p className="text-xs text-gray-500 mt-2">
                                    <Calendar className="w-3 h-3 inline mr-1" />
                                    Due: {amount.dueDate}
                                  </p>
                                )}
                              </div>
                            </div>
                          </motion.div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Payment Schedule */}
                  {analysis.financialAnalysis?.paymentSchedule && analysis.financialAnalysis.paymentSchedule.length > 0 && (
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center">
                        <Clock className="w-5 h-5 mr-2 text-indigo-500" />
                        Payment Schedule
                      </h3>
                      <div className="space-y-3">
                        {analysis.financialAnalysis.paymentSchedule.map((payment: any, index: number) => (
                          <div key={index} className="p-4 bg-indigo-50 dark:bg-indigo-900/20 rounded-lg border border-indigo-200 dark:border-indigo-700">
                            <div className="flex items-center justify-between">
                              <div>
                                <p className="font-medium text-gray-900 dark:text-white">{payment.phase}</p>
                                <p className="text-sm text-gray-600 dark:text-gray-400">Due: {payment.dueDate}</p>
                              </div>
                              <p className="font-semibold text-indigo-600 dark:text-indigo-400">{payment.amount}</p>
                            </div>
                            {payment.triggers && payment.triggers.length > 0 && (
                              <div className="mt-2">
                                <p className="text-xs text-gray-500 dark:text-gray-400">Triggers:</p>
                                <ul className="text-xs text-gray-600 dark:text-gray-300 list-disc list-inside">
                                  {payment.triggers.map((trigger: string, i: number) => (
                                    <li key={i}>{trigger}</li>
                                  ))}
                                </ul>
                              </div>
                            )}
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Penalties and Bonuses */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Penalties */}
                    {analysis.financialAnalysis?.penalties && analysis.financialAnalysis.penalties.length > 0 && (
                      <div>
                        <h3 className="text-lg font-semibold text-red-700 dark:text-red-400 mb-3 flex items-center">
                          <AlertTriangle className="w-5 h-5 mr-2" />
                          Penalties
                        </h3>
                        <div className="space-y-2">
                          {analysis.financialAnalysis.penalties.map((penalty: any, index: number) => (
                            <div key={index} className="p-3 bg-red-50 dark:bg-red-900/20 rounded-lg border border-red-200 dark:border-red-700">
                              <p className="font-medium text-red-800 dark:text-red-300">{penalty.type}</p>
                              <p className="text-sm text-red-600 dark:text-red-400">{penalty.amount}</p>
                              <p className="text-xs text-red-500 dark:text-red-400 mt-1">{penalty.conditions}</p>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Bonuses */}
                    {analysis.financialAnalysis?.bonuses && analysis.financialAnalysis.bonuses.length > 0 && (
                      <div>
                        <h3 className="text-lg font-semibold text-green-700 dark:text-green-400 mb-3 flex items-center">
                          <Award className="w-5 h-5 mr-2" />
                          Bonuses
                        </h3>
                        <div className="space-y-2">
                          {analysis.financialAnalysis.bonuses.map((bonus: any, index: number) => (
                            <div key={index} className="p-3 bg-green-50 dark:bg-green-900/20 rounded-lg border border-green-200 dark:border-green-700">
                              <p className="font-medium text-green-800 dark:text-green-300">{bonus.type}</p>
                              <p className="text-sm text-green-600 dark:text-green-400">{bonus.amount}</p>
                              <p className="text-xs text-green-500 dark:text-green-400 mt-1">{bonus.conditions}</p>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Financial Risks */}
                  {analysis.financialAnalysis?.financialRisks && analysis.financialAnalysis.financialRisks.length > 0 && (
                    <div>
                      <h3 className="text-lg font-semibold text-orange-700 dark:text-orange-400 mb-4 flex items-center">
                        <Shield className="w-5 h-5 mr-2" />
                        Financial Risks
                      </h3>
                      <div className="space-y-3">
                        {analysis.financialAnalysis.financialRisks.map((risk: any, index: number) => (
                          <div key={index} className="p-4 bg-orange-50 dark:bg-orange-900/20 rounded-lg border border-orange-200 dark:border-orange-700">
                            <div className="flex items-start justify-between">
                              <div className="flex-1">
                                <p className="font-medium text-orange-800 dark:text-orange-300">{risk.risk}</p>
                                <p className="text-sm text-orange-600 dark:text-orange-400 mt-1">{risk.impact}</p>
                              </div>
                              <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                                risk.likelihood === 'high' ? 'bg-red-100 text-red-800' :
                                risk.likelihood === 'medium' ? 'bg-yellow-100 text-yellow-800' :
                                'bg-green-100 text-green-800'
                              }`}>
                                {risk.likelihood} risk
                              </span>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                </div>
              </div>
            </motion.div>
          )}

          {activeTab === 'risks' && (
            <motion.div
              key="risks"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              className="space-y-6"
            >
              {/* Risk Alert System Integration */}
              <RiskAlertSystem 
                riskAssessment={analysis.riskAssessment}
                documentName={results.fileName || 'Document'}
                className="w-full"
              />
              
              {/* Traditional Risk Assessment Display (backup) */}
              {(!analysis.riskAssessment || !analysis.riskAssessment.criticalRisks?.length) && (
                <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700">
                  <div className="p-6 border-b border-gray-200 dark:border-gray-700">
                    <h2 className="text-xl font-semibold text-gray-900 dark:text-white flex items-center">
                      <AlertTriangle className="w-6 h-6 mr-3 text-red-500" />
                      Risk Assessment
                    </h2>
                  </div>
                  <div className="p-6">
                    <div className="text-center py-8">
                      <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
                      <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                        No High-Risk Items Detected
                      </h3>
                      <p className="text-gray-600 dark:text-gray-400">
                        This document appears to have standard terms and conditions with minimal risk factors.
                      </p>
                    </div>
                  </div>
                </div>
              )}
            </motion.div>
          )}

          {activeTab === 'negotiation' && (
            <motion.div
              key="negotiation"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              className="space-y-6"
            >
              {/* Negotiation Assistant Integration */}
              <NegotiationAssistant 
                documentContent={results.originalText || analysis.summary}
                contractType={analysis.documentType || 'Contract'}
                industry={analysis.industry || 'General'}
              />
            </motion.div>
          )}

          {activeTab === 'education' && (
            <motion.div
              key="education"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              className="space-y-6"
            >
              {/* Legal Terms Education */}
              <div className="bg-gradient-to-r from-indigo-600 to-purple-700 text-white p-6 rounded-lg mb-6">
                <div className="flex items-center space-x-4">
                  <div className="p-3 bg-white/20 rounded-lg">
                    <BookOpen className="w-8 h-8" />
                  </div>
                  <div>
                    <h2 className="text-2xl font-bold">Legal Terms Education</h2>
                    <p className="text-indigo-100 mt-1">
                      Understanding complex legal terminology from your document
                    </p>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 gap-6">
                {(analysis.keyTerms?.length > 0 ? analysis.keyTerms : 
                  (analysis as any).legalTerms?.length > 0 ? (analysis as any).legalTerms : [
                    { term: 'Liability', definition: 'Legal responsibility for damages or losses', importance: 'High', context: 'Risk allocation and financial protection' },
                    { term: 'Termination', definition: 'Conditions under which the agreement can be ended', importance: 'Medium', context: 'Exit strategy and relationship management' }
                  ]).map((term: any, index: number) => (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.1 }}
                      className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-lg border border-gray-200 dark:border-gray-700"
                    >
                      <div className="flex items-start justify-between mb-4">
                        <div className="flex-1">
                          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                            {term.term}
                          </h3>
                          <div className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${
                            term.importance === 'High' ? 'bg-red-100 text-red-800 border border-red-200' :
                            term.importance === 'Medium' ? 'bg-yellow-100 text-yellow-800 border border-yellow-200' :
                            'bg-green-100 text-green-800 border border-green-200'
                          }`}>
                            {term.importance} Priority
                          </div>
                        </div>
                      </div>
                      
                      <div className="space-y-4">
                        <div className="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-4">
                          <h4 className="font-medium text-blue-800 dark:text-blue-300 mb-2 flex items-center">
                            <BookOpen className="w-4 h-4 mr-2" />
                            Definition
                          </h4>
                          <p className="text-gray-700 dark:text-gray-300 text-sm leading-relaxed">
                            {term.definition}
                          </p>
                        </div>
                        
                        {term.context && (
                          <div className="bg-green-50 dark:bg-green-900/20 rounded-lg p-4">
                            <h4 className="font-medium text-green-800 dark:text-green-300 mb-2 flex items-center">
                              <Eye className="w-4 h-4 mr-2" />
                              Context in Your Document
                            </h4>
                            <p className="text-gray-700 dark:text-gray-300 text-sm leading-relaxed">
                              {term.context}
                            </p>
                          </div>
                        )}
                        
                        <div className="bg-yellow-50 dark:bg-yellow-900/20 rounded-lg p-4">
                          <h4 className="font-medium text-yellow-800 dark:text-yellow-300 mb-2 flex items-center">
                            <Star className="w-4 h-4 mr-2" />
                            Why This Matters
                          </h4>
                          <p className="text-gray-700 dark:text-gray-300 text-sm leading-relaxed">
                            Understanding this term is crucial for making informed decisions about your legal document and protecting your interests.
                          </p>
                        </div>
                      </div>
                    </motion.div>
                  ))}
              </div>
            </motion.div>
          )}

          {activeTab === 'clauses' && (
            <motion.div
              key="clauses"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              className="space-y-6"
            >
              {/* Key Clauses Analysis */}
              <div className="bg-gradient-to-r from-purple-600 to-pink-600 text-white p-6 rounded-lg mb-6">
                <div className="flex items-center space-x-4">
                  <div className="p-3 bg-white/20 rounded-lg">
                    <Scale className="w-8 h-8" />
                  </div>
                  <div>
                    <h2 className="text-2xl font-bold">Key Clauses Analysis</h2>
                    <p className="text-purple-100 mt-1">
                      Important contractual provisions and their implications
                    </p>
                  </div>
                </div>
              </div>

              <div className="space-y-6">
                {analysis.keyClauses && analysis.keyClauses.length > 0 ? (
                  analysis.keyClauses.map((clause: any, index: number) => (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.1 }}
                      className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-lg border border-gray-200 dark:border-gray-700"
                    >
                      <div className="flex items-start justify-between mb-4">
                        <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                          {clause.title}
                        </h3>
                        <div className={`px-3 py-1 rounded-full text-sm font-medium ${getImportanceBadge(clause.importance)}`}>
                          {clause.importance} Impact
                        </div>
                      </div>
                      
                      <div className="space-y-4">
                        <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
                          <h4 className="font-medium text-gray-800 dark:text-gray-200 mb-2">Clause Content</h4>
                          <p className="text-gray-700 dark:text-gray-300 text-sm leading-relaxed">
                            {cleanMarkdown(clause.content)}
                          </p>
                        </div>
                        
                        {clause.explanation && (
                          <div className="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-4">
                            <h4 className="font-medium text-blue-800 dark:text-blue-300 mb-2">Explanation</h4>
                            <p className="text-gray-700 dark:text-gray-300 text-sm leading-relaxed">
                              {cleanMarkdown(clause.explanation)}
                            </p>
                          </div>
                        )}
                        
                        {clause.risks && clause.risks.length > 0 && (
                          <div className="bg-red-50 dark:bg-red-900/20 rounded-lg p-4">
                            <h4 className="font-medium text-red-800 dark:text-red-300 mb-2 flex items-center">
                              <AlertTriangle className="w-4 h-4 mr-2" />
                              Potential Risks
                            </h4>
                            <ul className="space-y-1">
                              {clause.risks.map((risk: string, riskIndex: number) => (
                                <li key={riskIndex} className="text-gray-700 dark:text-gray-300 text-sm flex items-start">
                                  <span className="text-red-500 mr-2">•</span>
                                  {cleanMarkdown(risk)}
                                </li>
                              ))}
                            </ul>
                          </div>
                        )}
                        
                        {clause.recommendations && clause.recommendations.length > 0 && (
                          <div className="bg-green-50 dark:bg-green-900/20 rounded-lg p-4">
                            <h4 className="font-medium text-green-800 dark:text-green-300 mb-2 flex items-center">
                              <CheckCircle className="w-4 h-4 mr-2" />
                              Recommendations
                            </h4>
                            <ul className="space-y-1">
                              {clause.recommendations.map((rec: string, recIndex: number) => (
                                <li key={recIndex} className="text-gray-700 dark:text-gray-300 text-sm flex items-start">
                                  <span className="text-green-500 mr-2">•</span>
                                  {cleanMarkdown(rec)}
                                </li>
                              ))}
                            </ul>
                          </div>
                        )}
                      </div>
                    </motion.div>
                  ))
                ) : (
                  <div className="text-center py-12">
                    <Scale className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                    <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                      No Key Clauses Identified
                    </h3>
                    <p className="text-gray-600 dark:text-gray-400">
                      The analysis did not identify specific key clauses in this document.
                    </p>
                  </div>
                )}
              </div>
            </motion.div>
          )}

          {activeTab === 'timeline' && (
            <motion.div
              key="timeline"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              className="space-y-6"
            >
              {/* Timeline Analysis */}
              <div className="bg-gradient-to-r from-indigo-600 to-blue-600 text-white p-6 rounded-lg mb-6">
                <div className="flex items-center space-x-4">
                  <div className="p-3 bg-white/20 rounded-lg">
                    <Clock className="w-8 h-8" />
                  </div>
                  <div>
                    <h2 className="text-2xl font-bold">Timeline & Important Dates</h2>
                    <p className="text-indigo-100 mt-1">
                      Key dates and chronological events from your document
                    </p>
                  </div>
                </div>
              </div>

              <div className="space-y-6">
                {analysis.timeline && analysis.timeline.length > 0 ? (
                  <div className="relative">
                    <div className="absolute left-8 top-0 bottom-0 w-0.5 bg-gradient-to-b from-blue-400 to-indigo-600"></div>
                    
                    {analysis.timeline.map((event: any, index: number) => (
                      <motion.div
                        key={index}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: index * 0.1 }}
                        className="relative flex items-start space-x-4 pb-8"
                      >
                        <div className={`relative z-10 flex items-center justify-center w-16 h-16 rounded-full border-4 border-white shadow-lg ${
                          event.importance === 'High' ? 'bg-red-500' :
                          event.importance === 'Medium' ? 'bg-yellow-500' :
                          'bg-green-500'
                        }`}>
                          <Calendar className="w-6 h-6 text-white" />
                        </div>
                        
                        <div className="flex-1 bg-white dark:bg-gray-800 rounded-lg p-6 shadow-lg border border-gray-200 dark:border-gray-700">
                          <div className="flex items-start justify-between mb-2">
                            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                              {event.event}
                            </h3>
                            <div className={`px-3 py-1 rounded-full text-sm font-medium ${
                              event.importance === 'High' ? 'bg-red-100 text-red-800 border border-red-200' :
                              event.importance === 'Medium' ? 'bg-yellow-100 text-yellow-800 border border-yellow-200' :
                              'bg-green-100 text-green-800 border border-green-200'
                            }`}>
                              {event.importance}
                            </div>
                          </div>
                          
                          <div className="flex items-center space-x-2 text-gray-600 dark:text-gray-400 mb-3">
                            <Clock className="w-4 h-4" />
                            <span className="font-medium">{event.date}</span>
                          </div>
                          
                          {event.description && (
                            <p className="text-gray-700 dark:text-gray-300 text-sm">
                              {event.description}
                            </p>
                          )}
                        </div>
                      </motion.div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-12">
                    <Clock className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                    <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                      No Timeline Events Found
                    </h3>
                    <p className="text-gray-600 dark:text-gray-400">
                      The analysis did not identify specific dates or timeline events in this document.
                    </p>
                  </div>
                )}
              </div>
            </motion.div>
          )}

          {activeTab === 'insights' && (
            <motion.div
              key="insights"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              className="space-y-6"
            >
              {/* AI Insights */}
              <div className="bg-gradient-to-r from-pink-600 to-purple-600 text-white p-6 rounded-lg mb-6">
                <div className="flex items-center space-x-4">
                  <div className="p-3 bg-white/20 rounded-lg">
                    <Target className="w-8 h-8" />
                  </div>
                  <div>
                    <h2 className="text-2xl font-bold">AI-Powered Insights</h2>
                    <p className="text-pink-100 mt-1">
                      Intelligent analysis and actionable recommendations
                    </p>
                  </div>
                </div>
              </div>

              <div className="space-y-6">
                {analysis.actionableInsights && analysis.actionableInsights.length > 0 ? (
                  analysis.actionableInsights.map((insight: any, index: number) => (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.1 }}
                      className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-lg border border-gray-200 dark:border-gray-700"
                    >
                      <div className="flex items-start space-x-4">
                        <div className={`p-3 rounded-lg ${
                          insight.priority === 'High' ? 'bg-red-100 text-red-600' :
                          insight.priority === 'Medium' ? 'bg-yellow-100 text-yellow-600' :
                          'bg-blue-100 text-blue-600'
                        }`}>
                          <Target className="w-6 h-6" />
                        </div>
                        <div className="flex-1">
                          <div className="flex items-start justify-between mb-3">
                            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                              {insight.title}
                            </h3>
                            <div className={`px-3 py-1 rounded-full text-sm font-medium ${
                              insight.priority === 'High' ? 'bg-red-100 text-red-800 border border-red-200' :
                              insight.priority === 'Medium' ? 'bg-yellow-100 text-yellow-800 border border-yellow-200' :
                              'bg-blue-100 text-blue-800 border border-blue-200'
                            }`}>
                              {insight.priority}
                            </div>
                          </div>
                          <p className="text-gray-700 dark:text-gray-300 mb-4">
                            {cleanMarkdown(insight.description)}
                          </p>
                          {insight.recommendation && (
                            <div className="bg-green-50 dark:bg-green-900/20 rounded-lg p-4">
                              <h4 className="font-medium text-green-800 dark:text-green-300 mb-2 flex items-center">
                                <CheckCircle className="w-4 h-4 mr-2" />
                                Recommended Action
                              </h4>
                              <p className="text-gray-700 dark:text-gray-300 text-sm">
                                {cleanMarkdown(insight.recommendation)}
                              </p>
                            </div>
                          )}
                        </div>
                      </div>
                    </motion.div>
                  ))
                ) : (
                  /* Generate AI Insights from available data */
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Document Summary Insight */}
                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-lg border border-gray-200 dark:border-gray-700"
                    >
                      <div className="flex items-start space-x-4">
                        <div className="p-3 bg-blue-100 text-blue-600 rounded-lg">
                          <FileText className="w-6 h-6" />
                        </div>
                        <div>
                          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                            Document Analysis Summary
                          </h3>
                          <p className="text-gray-700 dark:text-gray-300 text-sm mb-4">
                            This {analysis.documentType?.toLowerCase() || 'document'} has been analyzed with {analysis.confidence || 'high'} confidence level.
                          </p>
                          <div className="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-4">
                            <h4 className="font-medium text-blue-800 dark:text-blue-300 mb-2">Key Takeaway</h4>
                            <p className="text-gray-700 dark:text-gray-300 text-sm">
                              {analysis.summary ? analysis.summary.substring(0, 150) + '...' : 'Document contains important legal provisions that require attention.'}
                            </p>
                          </div>
                        </div>
                      </div>
                    </motion.div>

                    {/* Risk Assessment Insight */}
                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.1 }}
                      className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-lg border border-gray-200 dark:border-gray-700"
                    >
                      <div className="flex items-start space-x-4">
                        <div className={`p-3 rounded-lg ${
                          analysis.riskAssessment?.overallRisk === 'High' ? 'bg-red-100 text-red-600' :
                          analysis.riskAssessment?.overallRisk === 'Medium' ? 'bg-yellow-100 text-yellow-600' :
                          'bg-green-100 text-green-600'
                        }`}>
                          <Shield className="w-6 h-6" />
                        </div>
                        <div>
                          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                            Risk Assessment
                          </h3>
                          <p className="text-gray-700 dark:text-gray-300 text-sm mb-4">
                            Overall risk level: <span className="font-semibold">{analysis.riskAssessment?.overallRisk || 'Low'}</span>
                          </p>
                          <div className="bg-green-50 dark:bg-green-900/20 rounded-lg p-4">
                            <h4 className="font-medium text-green-800 dark:text-green-300 mb-2">Recommendation</h4>
                            <p className="text-gray-700 dark:text-gray-300 text-sm">
                              {analysis.riskAssessment?.overallRisk === 'High' 
                                ? 'Consider legal consultation before proceeding with this document.'
                                : analysis.riskAssessment?.overallRisk === 'Medium'
                                ? 'Review identified risks carefully and consider mitigation strategies.'
                                : 'This document appears to have minimal risk exposure.'}
                            </p>
                          </div>
                        </div>
                      </div>
                    </motion.div>

                    {/* Financial Insight */}
                    {analysis.financialAnalysis && (
                      <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.2 }}
                        className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-lg border border-gray-200 dark:border-gray-700"
                      >
                        <div className="flex items-start space-x-4">
                          <div className="p-3 bg-yellow-100 text-yellow-600 rounded-lg">
                            <DollarSign className="w-6 h-6" />
                          </div>
                          <div>
                            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                              Financial Analysis
                            </h3>
                            <p className="text-gray-700 dark:text-gray-300 text-sm mb-4">
                              {analysis.financialAnalysis.amounts?.length > 0 
                                ? `Found ${analysis.financialAnalysis.amounts.length} financial term(s) in the document.`
                                : 'No specific financial amounts identified in this document.'}
                            </p>
                            <div className="bg-yellow-50 dark:bg-yellow-900/20 rounded-lg p-4">
                              <h4 className="font-medium text-yellow-800 dark:text-yellow-300 mb-2">Key Point</h4>
                              <p className="text-gray-700 dark:text-gray-300 text-sm">
                                {analysis.financialAnalysis.amounts?.length > 0 
                                  ? 'Ensure all financial obligations are clearly understood before signing.'
                                  : 'While no specific amounts are mentioned, consider any implied financial obligations.'}
                              </p>
                            </div>
                          </div>
                        </div>
                      </motion.div>
                    )}

                    {/* Parties Insight */}
                    {analysis.keyParties && analysis.keyParties.length > 0 && (
                      <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.3 }}
                        className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-lg border border-gray-200 dark:border-gray-700"
                      >
                        <div className="flex items-start space-x-4">
                          <div className="p-3 bg-purple-100 text-purple-600 rounded-lg">
                            <Users className="w-6 h-6" />
                          </div>
                          <div>
                            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                              Parties Analysis
                            </h3>
                            <p className="text-gray-700 dark:text-gray-300 text-sm mb-4">
                              Document involves {analysis.keyParties.length} identified part{analysis.keyParties.length > 1 ? 'ies' : 'y'}.
                            </p>
                            <div className="bg-purple-50 dark:bg-purple-900/20 rounded-lg p-4">
                              <h4 className="font-medium text-purple-800 dark:text-purple-300 mb-2">Important Note</h4>
                              <p className="text-gray-700 dark:text-gray-300 text-sm">
                                Verify the identity and authority of all parties before executing any agreements.
                              </p>
                            </div>
                          </div>
                        </div>
                      </motion.div>
                    )}
                  </div>
                )}
              </div>
            </motion.div>
          )}

          {/* Add more tabs content here... */}
        </AnimatePresence>
      </motion.div>

      {/* Regenerate Modal */}
      {showRegenerateModal && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4"
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.9, opacity: 0, y: 20 }}
            className="bg-white dark:bg-gray-800 rounded-xl shadow-2xl w-full max-w-md p-6"
          >
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center space-x-3">
                <div className="p-2 bg-orange-100 text-orange-600 rounded-lg">
                  <RefreshCw className="w-5 h-5" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Regenerate Analysis</h3>
              </div>
              <button
                onClick={() => setShowRegenerateModal(false)}
                className="p-1 hover:bg-gray-100 dark:hover:bg-gray-700 rounded"
              >
                <X className="w-4 h-4 text-gray-500" />
              </button>
            </div>
            
            <p className="text-gray-600 dark:text-gray-400 mb-6">
              Choose the analysis depth for regeneration. Different modes provide varying levels of detail and processing time.
            </p>
            
            <div className="space-y-3 mb-6">
              <button 
                onClick={() => handleRegenerate('quick')}
                className="w-full p-4 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-700 rounded-lg hover:bg-green-100 dark:hover:bg-green-900/40 transition-all text-left"
              >
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="font-medium text-green-800 dark:text-green-300">Quick Analysis</h4>
                    <p className="text-sm text-green-600 dark:text-green-400 mt-1">~30 seconds • Basic insights</p>
                  </div>
                  <div className="text-green-600">
                    <RefreshCw className="w-5 h-5" />
                  </div>
                </div>
              </button>
              
              <button 
                onClick={() => handleRegenerate('deep')}
                className="w-full p-4 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-700 rounded-lg hover:bg-blue-100 dark:hover:bg-blue-900/40 transition-all text-left"
              >
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="font-medium text-blue-800 dark:text-blue-300">Deep Analysis</h4>
                    <p className="text-sm text-blue-600 dark:text-blue-400 mt-1">~90 seconds • Comprehensive insights</p>
                  </div>
                  <div className="text-blue-600">
                    <RefreshCw className="w-5 h-5" />
                  </div>
                </div>
              </button>
              
              <button 
                onClick={() => handleRegenerate('comprehensive')}
                className="w-full p-4 bg-purple-50 dark:bg-purple-900/20 border border-purple-200 dark:border-purple-700 rounded-lg hover:bg-purple-100 dark:hover:bg-purple-900/40 transition-all text-left"
              >
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="font-medium text-purple-800 dark:text-purple-300">Comprehensive Analysis</h4>
                    <p className="text-sm text-purple-600 dark:text-purple-400 mt-1">~150 seconds • Maximum detail</p>
                  </div>
                  <div className="text-purple-600">
                    <RefreshCw className="w-5 h-5" />
                  </div>
                </div>
              </button>
            </div>
            
            <div className="flex space-x-3">
              <button 
                onClick={() => setShowRegenerateModal(false)}
                className="flex-1 px-4 py-2 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-all"
              >
                Cancel
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}

      {/* Expert Chat Modal */}
      {showExpertChat && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4"
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.9, opacity: 0, y: 20 }}
            className="bg-white dark:bg-gray-800 rounded-xl shadow-2xl w-full max-w-2xl h-[600px] flex flex-col"
          >
            {/* Chat Header */}
            <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700">
              <div className="flex items-center space-x-3">
                <div className="relative">
                  <div className="w-10 h-10 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-full flex items-center justify-center">
                    <MessageCircle className="w-5 h-5 text-white" />
                  </div>
                  <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-500 rounded-full border-2 border-white dark:border-gray-800"></div>
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Legal Expert Chat</h3>
                  <p className="text-sm text-green-600 flex items-center">
                    <span className="w-2 h-2 bg-green-500 rounded-full mr-2 animate-pulse"></span>
                    Available now
                  </p>
                </div>
              </div>
              <button
                onClick={() => setShowExpertChat(false)}
                className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
              >
                <X className="w-5 h-5 text-gray-500" />
              </button>
            </div>
            
            {/* Chat Messages */}
            <div className="flex-1 p-6 overflow-y-auto space-y-4">
              {/* Welcome Message */}
              <div className="flex items-start space-x-3">
                <div className="w-8 h-8 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-full flex items-center justify-center flex-shrink-0">
                  <MessageCircle className="w-4 h-4 text-white" />
                </div>
                <div className="bg-gray-100 dark:bg-gray-700 rounded-lg p-4 max-w-md">
                  <p className="text-gray-800 dark:text-gray-200 text-sm">
                    Hello! I'm here to help you understand your legal document analysis. I can explain complex terms, discuss risks, and provide guidance on next steps.
                  </p>
                  <p className="text-xs text-gray-500 dark:text-gray-400 mt-2">
                    Just now
                  </p>
                </div>
              </div>
              
              {/* Document Context */}
              <div className="flex items-start space-x-3">
                <div className="w-8 h-8 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-full flex items-center justify-center flex-shrink-0">
                  <MessageCircle className="w-4 h-4 text-white" />
                </div>
                <div className="bg-gray-100 dark:bg-gray-700 rounded-lg p-4 max-w-md">
                  <p className="text-gray-800 dark:text-gray-200 text-sm">
                    I can see you've analyzed a <strong>{analysis.documentType}</strong> with a {analysis.confidence}% confidence rating. 
                    {analysis.riskAssessment?.overallRisk && (
                      <span> The overall risk level is <strong>{analysis.riskAssessment.overallRisk.toLowerCase()}</strong>.</span>
                    )}
                  </p>
                  <p className="text-gray-800 dark:text-gray-200 text-sm mt-2">
                    What specific questions do you have about this document?
                  </p>
                  <p className="text-xs text-gray-500 dark:text-gray-400 mt-2">
                    Just now
                  </p>
                </div>
              </div>
              
              {/* Suggested Questions */}
              <div className="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-4">
                <h4 className="font-medium text-blue-800 dark:text-blue-300 mb-3 text-sm">Suggested Questions:</h4>
                <div className="space-y-2">
                  <button className="w-full text-left p-3 bg-white dark:bg-gray-700 rounded-lg hover:shadow-sm transition-all text-sm text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400">
                    "Can you explain the key risks I should be concerned about?"
                  </button>
                  <button className="w-full text-left p-3 bg-white dark:bg-gray-700 rounded-lg hover:shadow-sm transition-all text-sm text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400">
                    "What are the most important clauses I should focus on?"
                  </button>
                  <button className="w-full text-left p-3 bg-white dark:bg-gray-700 rounded-lg hover:shadow-sm transition-all text-sm text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400">
                    "Are there any red flags I should be aware of?"
                  </button>
                  {analysis.financialAnalysis?.amounts?.length > 0 && (
                    <button className="w-full text-left p-3 bg-white dark:bg-gray-700 rounded-lg hover:shadow-sm transition-all text-sm text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400">
                      "Can you help me understand the financial implications?"
                    </button>
                  )}
                </div>
              </div>
            </div>
            
            {/* Chat Input */}
            <div className="p-6 border-t border-gray-200 dark:border-gray-700">
              <div className="flex items-center space-x-3">
                <div className="flex-1 relative">
                  <input
                    type="text"
                    placeholder="Ask me anything about your document..."
                    className="w-full pl-4 pr-12 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                  />
                  <button className="absolute right-2 top-1/2 transform -translate-y-1/2 p-2 text-gray-400 hover:text-blue-600 transition-colors">
                    <ExternalLink className="w-4 h-4" />
                  </button>
                </div>
                <button className="px-4 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-lg hover:from-blue-700 hover:to-indigo-700 transition-all shadow-lg">
                  Send
                </button>
              </div>
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-2">
                This is a demo chat. In production, this would connect to a real legal expert.
              </p>
            </div>
          </motion.div>
        </motion.div>
      )}
    </motion.div>
  );
};

export default EnhancedAnalysisResults;