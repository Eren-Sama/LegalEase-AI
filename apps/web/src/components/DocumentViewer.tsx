'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  FileText, 
  Download, 
  Share2, 
  Eye,
  Brain,
  X,
  Calendar,
  User,
  Shield,
  AlertTriangle,
  CheckCircle,
  Clock,
  Play,
  RotateCcw
} from 'lucide-react';

interface Document {
  id: string;
  name: string;
  type: string;
  size: number;
  uploadedAt: string;
  status: 'completed' | 'processing' | 'error';
  riskLevel?: 'low' | 'medium' | 'high';
  aiSummary?: string;
  confidenceScore?: number;
  keyParties?: string[];
  analysis?: any; // Stored analysis results
  lastViewed?: string;
  complianceStatus?: 'compliant' | 'non-compliant' | 'needs-review';
}

interface DocumentViewerProps {
  document: Document;
  onClose: () => void;
  onAnalyze: (analysisData: any) => void;
}

const DocumentViewer: React.FC<DocumentViewerProps> = ({ document, onClose, onAnalyze }) => {
  const [isReanalyzing, setIsReanalyzing] = useState(false);
  const [analysisProgress, setAnalysisProgress] = useState(0);

  const formatFileSize = (bytes: number): string => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const getRiskColor = (risk?: string) => {
    switch (risk) {
      case 'high': return 'text-red-600 bg-red-50 border-red-200 dark:bg-red-900/20 dark:text-red-400';
      case 'medium': return 'text-yellow-600 bg-yellow-50 border-yellow-200 dark:bg-yellow-900/20 dark:text-yellow-400';
      case 'low': return 'text-green-600 bg-green-50 border-green-200 dark:bg-green-900/20 dark:text-green-400';
      default: return 'text-gray-600 bg-gray-50 border-gray-200 dark:bg-gray-800 dark:text-gray-400';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return 'text-green-600 bg-green-50 dark:bg-green-900/20 dark:text-green-400';
      case 'processing': return 'text-blue-600 bg-blue-50 dark:bg-blue-900/20 dark:text-blue-400';
      default: return 'text-red-600 bg-red-50 dark:bg-red-900/20 dark:text-red-400';
    }
  };

  const getComplianceColor = (status?: string) => {
    switch (status) {
      case 'compliant': return 'text-green-600 bg-green-50 border-green-200 dark:bg-green-900/20 dark:text-green-400';
      case 'non-compliant': return 'text-red-600 bg-red-50 border-red-200 dark:bg-red-900/20 dark:text-red-400';
      case 'needs-review': return 'text-yellow-600 bg-yellow-50 border-yellow-200 dark:bg-yellow-900/20 dark:text-yellow-400';
      default: return 'text-gray-600 bg-gray-50 border-gray-200 dark:bg-gray-800 dark:text-gray-400';
    }
  };

  const handleViewAnalysis = () => {
    if (document.analysis) {
      // If analysis exists, show it directly
      onAnalyze({
        analysis: document.analysis,
        document: document
      });
    } else {
      // If no analysis exists, show message
      alert('No analysis available for this document. Please run a new analysis.');
    }
  };

  const handleReanalyze = async () => {
    setIsReanalyzing(true);
    setAnalysisProgress(0);

    try {
      // Simulate analysis progress
      const progressInterval = setInterval(() => {
        setAnalysisProgress(prev => {
          const increment = Math.random() * 5 + 2;
          const newProgress = Math.min(prev + increment, 95);
          return newProgress;
        });
      }, 1000);

      // Here you would typically call your analysis API
      // For now, we'll simulate with a timeout
      setTimeout(() => {
        clearInterval(progressInterval);
        setAnalysisProgress(100);
        
        // Create mock analysis data
        const mockAnalysis = {
          documentType: 'Legal Contract',
          confidence: 95,
          summary: 'This document has been reanalyzed with the latest AI models. The analysis shows comprehensive legal terms and conditions with moderate risk factors.',
          keyParties: document.keyParties || ['Party A', 'Party B'],
          financialAnalysis: {
            totalContractValue: 'To be determined',
            identifiedAmounts: [],
            paymentSchedule: [],
            penalties: [],
            bonuses: [],
            financialRisks: []
          },
          keyClauses: [
            {
              title: 'Terms of Service',
              content: 'Standard terms and conditions apply',
              explanation: 'This section outlines the basic terms of the agreement',
              importance: 'medium',
              risks: ['Standard commercial risk'],
              recommendations: ['Review periodically']
            }
          ],
          riskAssessment: {
            overallRisk: document.riskLevel || 'medium',
            criticalRisks: []
          },
          timeline: [],
          actionableInsights: []
        };

        // Update the document with new analysis
        document.analysis = mockAnalysis;
        document.status = 'completed';
        document.confidenceScore = 95;

        setTimeout(() => {
          setIsReanalyzing(false);
          onAnalyze({
            analysis: mockAnalysis,
            document: document
          });
        }, 1000);
      }, 8000);

    } catch (error) {
      console.error('Reanalysis failed:', error);
      setIsReanalyzing(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 dark:from-gray-900 dark:to-gray-800">
      {/* Header */}
      <div className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 px-6 py-6 shadow-lg">
        <div className="flex items-center justify-between max-w-7xl mx-auto">
          <div className="flex items-center space-x-4">
            <div className="p-3 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-xl shadow-lg">
              <FileText className="w-7 h-7 text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
                {document.name}
              </h1>
              <div className="flex items-center space-x-4 mt-1">
                <span className="text-sm text-gray-600 dark:text-gray-400">
                  {formatFileSize(document.size)} • {document.type.toUpperCase()}
                </span>
                <span className={`px-2 py-1 rounded-full text-xs font-medium border ${getStatusColor(document.status)}`}>
                  {document.status}
                </span>
                {document.riskLevel && (
                  <span className={`px-2 py-1 rounded-full text-xs font-medium border ${getRiskColor(document.riskLevel)}`}>
                    {document.riskLevel} risk
                  </span>
                )}
              </div>
            </div>
          </div>
          
          <div className="flex items-center space-x-3">
            <motion.button 
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="flex items-center space-x-2 px-4 py-2 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 transition-all"
            >
              <Download className="w-4 h-4" />
              <span>Download</span>
            </motion.button>
            <motion.button 
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="flex items-center space-x-2 px-4 py-2 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 transition-all"
            >
              <Share2 className="w-4 h-4" />
              <span>Share</span>
            </motion.button>
            <button
              onClick={onClose}
              className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
            >
              <X className="w-5 h-5 text-gray-500" />
            </button>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-7xl mx-auto p-6">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          
          {/* Document Info */}
          <div className="lg:col-span-2 space-y-6">
            {/* Document Details */}
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700 p-6">
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">Document Details</h2>
              
              <div className="grid grid-cols-2 gap-4 mb-6">
                <div className="flex items-center space-x-3">
                  <Calendar className="w-5 h-5 text-blue-500" />
                  <div>
                    <p className="text-sm text-gray-600 dark:text-gray-400">Uploaded</p>
                    <p className="font-medium text-gray-900 dark:text-white">
                      {new Date(document.uploadedAt).toLocaleDateString()}
                    </p>
                  </div>
                </div>
                
                {document.lastViewed && (
                  <div className="flex items-center space-x-3">
                    <Eye className="w-5 h-5 text-green-500" />
                    <div>
                      <p className="text-sm text-gray-600 dark:text-gray-400">Last Viewed</p>
                      <p className="font-medium text-gray-900 dark:text-white">
                        {new Date(document.lastViewed).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                )}

                {document.confidenceScore && (
                  <div className="flex items-center space-x-3">
                    <Brain className="w-5 h-5 text-purple-500" />
                    <div>
                      <p className="text-sm text-gray-600 dark:text-gray-400">AI Confidence</p>
                      <p className="font-medium text-gray-900 dark:text-white">
                        {document.confidenceScore}%
                      </p>
                    </div>
                  </div>
                )}

                {document.complianceStatus && (
                  <div className="flex items-center space-x-3">
                    <Shield className="w-5 h-5 text-orange-500" />
                    <div>
                      <p className="text-sm text-gray-600 dark:text-gray-400">Compliance</p>
                      <span className={`inline-block px-2 py-1 rounded-full text-xs font-medium border ${getComplianceColor(document.complianceStatus)}`}>
                        {document.complianceStatus.replace('-', ' ')}
                      </span>
                    </div>
                  </div>
                )}
              </div>

              {/* AI Summary */}
              {document.aiSummary && (
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">AI Summary</h3>
                  <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                    {document.aiSummary}
                  </p>
                </div>
              )}

              {/* Key Parties */}
              {document.keyParties && document.keyParties.length > 0 && (
                <div className="mt-6">
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">Key Parties</h3>
                  <div className="flex flex-wrap gap-2">
                    {document.keyParties.map((party, index) => (
                      <span key={index} className="px-3 py-1 bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400 rounded-full text-sm">
                        {party}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Analysis Actions */}
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700 p-6">
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">Analysis Actions</h2>
              
              {isReanalyzing ? (
                <div className="space-y-4">
                  <div className="flex items-center space-x-3">
                    <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-purple-600"></div>
                    <span className="text-gray-700 dark:text-gray-300">Reanalyzing document...</span>
                  </div>
                  <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                    <div 
                      className="bg-purple-600 h-2 rounded-full transition-all duration-300"
                      style={{ width: `${analysisProgress}%` }}
                    ></div>
                  </div>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    Progress: {Math.round(analysisProgress)}%
                  </p>
                </div>
              ) : (
                <div className="space-y-4">
                  {document.analysis ? (
                    <motion.button
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={handleViewAnalysis}
                      className="w-full flex items-center justify-center space-x-2 px-6 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-lg hover:from-blue-700 hover:to-indigo-700 transition-all shadow-lg"
                    >
                      <Eye className="w-5 h-5" />
                      <span>View Analysis Results</span>
                    </motion.button>
                  ) : (
                    <div className="text-center py-8">
                      <AlertTriangle className="w-12 h-12 text-yellow-500 mx-auto mb-4" />
                      <p className="text-gray-600 dark:text-gray-400 mb-4">
                        No analysis available for this document.
                      </p>
                    </div>
                  )}

                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={handleReanalyze}
                    className="w-full flex items-center justify-center space-x-2 px-6 py-3 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-lg hover:from-purple-700 hover:to-pink-700 transition-all shadow-lg"
                  >
                    <RotateCcw className="w-5 h-5" />
                    <span>{document.analysis ? 'Reanalyze Document' : 'Analyze Document'}</span>
                  </motion.button>
                </div>
              )}
            </div>
          </div>

          {/* Document Preview */}
          <div className="space-y-6">
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700 p-6">
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">Document Preview</h2>
              
              {/* Document Preview Placeholder */}
              <div className="aspect-[3/4] bg-gray-100 dark:bg-gray-700 rounded-lg flex items-center justify-center">
                <div className="text-center">
                  <FileText className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-500 dark:text-gray-400">Preview not available</p>
                  <p className="text-sm text-gray-400 dark:text-gray-500 mt-1">
                    {document.type.toUpperCase()} file
                  </p>
                </div>
              </div>
            </div>

            {/* Quick Stats */}
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700 p-6">
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">Quick Stats</h2>
              
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-gray-600 dark:text-gray-400">File Size</span>
                  <span className="font-medium text-gray-900 dark:text-white">
                    {formatFileSize(document.size)}
                  </span>
                </div>
                
                <div className="flex items-center justify-between">
                  <span className="text-gray-600 dark:text-gray-400">File Type</span>
                  <span className="font-medium text-gray-900 dark:text-white">
                    {document.type.toUpperCase()}
                  </span>
                </div>
                
                {document.confidenceScore && (
                  <div className="flex items-center justify-between">
                    <span className="text-gray-600 dark:text-gray-400">AI Score</span>
                    <span className="font-medium text-gray-900 dark:text-white">
                      {document.confidenceScore}%
                    </span>
                  </div>
                )}
                
                <div className="flex items-center justify-between">
                  <span className="text-gray-600 dark:text-gray-400">Status</span>
                  <span className={`px-2 py-1 rounded-full text-xs font-medium border ${getStatusColor(document.status)}`}>
                    {document.status}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DocumentViewer;