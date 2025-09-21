'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  ArrowLeft, 
  FileText, 
  Shield, 
  AlertTriangle, 
  CheckCircle, 
  Brain, 
  Clock, 
  DollarSign, 
  Users, 
  Scale, 
  Lightbulb, 
  MessageCircle, 
  Download, 
  Share2,
  ChevronDown,
  ChevronRight,
  ExternalLink,
  Star,
  BookOpen,
  Video,
  Gavel,
  TrendingUp
} from 'lucide-react';
import RiskAlertSystem from './RiskAlertSystem';
import NegotiationAssistant from './NegotiationAssistant';
import LegalLiteracyModule from './LegalLiteracyModule';

interface DocumentAnalysisPageProps {
  document: {
    id: string;
    name: string;
    type: string;
    uploadedAt: string;
  };
  analysisResults: any;
  onBack: () => void;
  onChatWithExpert: () => void;
}

const DocumentAnalysisPage: React.FC<DocumentAnalysisPageProps> = ({
  document,
  analysisResults,
  onBack,
  onChatWithExpert
}) => {
  const [activeTab, setActiveTab] = useState<'executive' | 'detailed' | 'deep-dive' | 'risk-alerts' | 'negotiation' | 'education'>('executive');
  const [expandedSections, setExpandedSections] = useState<Set<string>>(new Set());

  const toggleSection = (sectionId: string) => {
    const newExpanded = new Set(expandedSections);
    if (newExpanded.has(sectionId)) {
      newExpanded.delete(sectionId);
    } else {
      newExpanded.add(sectionId);
    }
    setExpandedSections(newExpanded);
  };

  const getRiskColor = (level: 'low' | 'medium' | 'high') => {
    switch (level) {
      case 'low': return 'text-green-700 dark:text-green-400 bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-800';
      case 'medium': return 'text-yellow-700 dark:text-yellow-400 bg-yellow-50 dark:bg-yellow-900/20 border-yellow-200 dark:border-yellow-800';
      case 'high': return 'text-red-700 dark:text-red-400 bg-red-50 dark:bg-red-900/20 border-red-200 dark:border-red-800';
    }
  };

  const getRiskIcon = (level: 'low' | 'medium' | 'high') => {
    switch (level) {
      case 'low': return CheckCircle;
      case 'medium': return AlertTriangle;
      case 'high': return AlertTriangle;
    }
  };

  // Mock enhanced analysis data
  const enhancedAnalysis = {
    executiveSummary: {
      overallRisk: 'medium' as const,
      confidenceScore: 89,
      keyTakeaways: [
        'Contract contains favorable payment terms with 30-day cycles',
        'Liability clauses may expose you to significant financial risk',
        'Intellectual property rights need immediate clarification',
        'Termination procedures are well-structured and fair'
      ],
      recommendedActions: [
        'Negotiate liability caps before signing',
        'Clarify IP ownership in Section 7',
        'Review indemnification terms with legal counsel'
      ]
    },
    clauseAnalysis: [
      {
        id: 'payment',
        title: 'Payment Terms',
        section: 'Section 3',
        riskLevel: 'low' as const,
        content: 'Payment shall be made within thirty (30) days of invoice receipt...',
        plainEnglish: 'You have 30 days to pay after receiving an invoice. This is standard and fair.',
        risks: [],
        recommendations: ['Consider negotiating early payment discounts']
      },
      {
        id: 'liability',
        title: 'Liability & Indemnification',
        section: 'Section 8',
        riskLevel: 'high' as const,
        content: 'Party A shall indemnify and hold harmless Party B from all claims...',
        plainEnglish: 'You must pay for any legal problems that arise, even if they\'re not your fault.',
        risks: [
          'Unlimited liability exposure',
          'No mutual indemnification',
          'Broad scope of covered claims'
        ],
        recommendations: [
          'Add liability caps (e.g., contract value limit)',
          'Negotiate mutual indemnification',
          'Exclude gross negligence and willful misconduct'
        ]
      },
      {
        id: 'ip',
        title: 'Intellectual Property',
        section: 'Section 7',
        riskLevel: 'medium' as const,
        content: 'All work product shall be deemed work for hire...',
        plainEnglish: 'Any work you create becomes their property, not yours.',
        risks: [
          'Complete IP assignment',
          'No retained rights for derivative works'
        ],
        recommendations: [
          'Retain rights to pre-existing IP',
          'Negotiate shared ownership for improvements'
        ]
      }
    ],
    riskAlerts: [
      {
        type: 'hidden-fee',
        severity: 'high',
        title: 'Hidden Termination Fee',
        description: 'Section 12 contains a $5,000 early termination penalty that\'s not mentioned in the summary.',
        location: 'Section 12, Paragraph 3'
      },
      {
        type: 'auto-renewal',
        severity: 'medium',
        title: 'Automatic Renewal Clause',
        description: 'Contract automatically renews for 1-year terms unless cancelled 90 days in advance.',
        location: 'Section 2, Paragraph 5'
      }
    ],
    negotiationPoints: [
      {
        clause: 'Liability Cap',
        current: 'Unlimited liability',
        suggested: 'Limit to 2x annual contract value',
        priority: 'high',
        businessImpact: 'Could save millions in potential damages'
      },
      {
        clause: 'Payment Terms',
        current: '30 days net',
        suggested: '30 days with 2% early payment discount',
        priority: 'low',
        businessImpact: 'Potential 2% cost savings'
      }
    ],
    industryComparison: {
      overallFairness: 65,
      comparedTo: 'Standard SaaS agreements',
      betterThan: 45,
      worseThan: 35,
      benchmarkData: [
        { metric: 'Payment Terms', yourContract: 'Good', industry: 'Standard' },
        { metric: 'Liability Limits', yourContract: 'Poor', industry: 'Fair' },
        { metric: 'Termination Rights', yourContract: 'Good', industry: 'Standard' }
      ]
    },
    importantDates: [
      { date: '2024-01-15', event: 'Contract Effective Date', type: 'start' },
      { date: '2024-10-15', event: 'Notice Required for Non-Renewal', type: 'deadline' },
      { date: '2025-01-15', event: 'Automatic Renewal Date', type: 'renewal' }
    ]
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Header */}
      <div className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <button
                onClick={onBack}
                className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
              >
                <ArrowLeft className="w-5 h-5 text-gray-600 dark:text-gray-400" />
              </button>
              <div>
                <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
                  Document Analysis
                </h1>
                <p className="text-gray-600 dark:text-gray-400">{document.name}</p>
              </div>
            </div>
            <div className="flex items-center space-x-3">
              <button className="flex items-center px-4 py-2 text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors">
                <Download className="w-4 h-4 mr-2" />
                Export
              </button>
              <button className="flex items-center px-4 py-2 text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors">
                <Share2 className="w-4 h-4 mr-2" />
                Share
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto p-6">
        {/* Three-Tier Tab Navigation */}
        <div className="mb-8">
          <div className="border-b border-gray-200 dark:border-gray-700">
            <nav className="flex space-x-8">
              {[
                { id: 'executive', label: 'Executive Summary', desc: '30-second overview' },
                { id: 'detailed', label: 'Plain English', desc: 'Section-by-section breakdown' },
                { id: 'deep-dive', label: 'Deep Dive', desc: 'Detailed analysis with examples' },
                { id: 'risk-alerts', label: 'Risk Alerts', desc: 'Automated risk detection' },
                { id: 'negotiation', label: 'Negotiation', desc: 'Strategic assistance' },
                { id: 'education', label: 'Learn More', desc: 'Educational resources' }
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as any)}
                  className={`py-4 px-1 border-b-2 font-medium text-sm transition-colors ${
                    activeTab === tab.id
                      ? 'border-blue-500 text-blue-600 dark:text-blue-400'
                      : 'border-transparent text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300'
                  }`}
                >
                  <div className="text-left">
                    <div>{tab.label}</div>
                    <div className="text-xs text-gray-400">{tab.desc}</div>
                  </div>
                </button>
              ))}
            </nav>
          </div>
        </div>

        {/* Content based on active tab */}
        {activeTab === 'executive' && (
          <div className="space-y-6">
            {/* Risk Score Card */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm border border-gray-200 dark:border-gray-700"
            >
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
                  Overall Risk Assessment
                </h2>
                <div className={`px-4 py-2 rounded-full border ${getRiskColor(enhancedAnalysis.executiveSummary.overallRisk)}`}>
                  <div className="flex items-center space-x-2">
                    {React.createElement(getRiskIcon(enhancedAnalysis.executiveSummary.overallRisk), {
                      className: "w-4 h-4"
                    })}
                    <span className="font-medium capitalize">
                      {enhancedAnalysis.executiveSummary.overallRisk} Risk
                    </span>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="text-center">
                  <div className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
                    {enhancedAnalysis.executiveSummary.confidenceScore}%
                  </div>
                  <div className="text-gray-600 dark:text-gray-400">Confidence Score</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-red-600 dark:text-red-400 mb-2">
                    {enhancedAnalysis.riskAlerts.length}
                  </div>
                  <div className="text-gray-600 dark:text-gray-400">Risk Alerts</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-blue-600 dark:text-blue-400 mb-2">
                    {enhancedAnalysis.clauseAnalysis.length}
                  </div>
                  <div className="text-gray-600 dark:text-gray-400">Clauses Analyzed</div>
                </div>
              </div>
            </motion.div>

            {/* Key Takeaways */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm border border-gray-200 dark:border-gray-700"
            >
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                Key Takeaways
              </h3>
              <div className="space-y-3">
                {enhancedAnalysis.executiveSummary.keyTakeaways.map((takeaway, index) => (
                  <div key={index} className="flex items-start space-x-3">
                    <div className="w-2 h-2 bg-blue-500 rounded-full mt-2 flex-shrink-0" />
                    <p className="text-gray-700 dark:text-gray-300">{takeaway}</p>
                  </div>
                ))}
              </div>
            </motion.div>

            {/* Risk Alerts */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm border border-gray-200 dark:border-gray-700"
            >
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center">
                <AlertTriangle className="w-5 h-5 text-red-500 mr-2" />
                Risk Alerts
              </h3>
              <div className="space-y-4">
                {enhancedAnalysis.riskAlerts.map((alert, index) => (
                  <div key={index} className={`p-4 rounded-lg border ${getRiskColor(alert.severity as any)}`}>
                    <div className="flex justify-between items-start">
                      <div className="flex-1">
                        <h4 className="font-medium mb-1">{alert.title}</h4>
                        <p className="text-sm opacity-90 mb-2">{alert.description}</p>
                        <p className="text-xs opacity-75">Found in: {alert.location}</p>
                      </div>
                      <span className={`px-2 py-1 rounded text-xs font-medium ${
                        alert.severity === 'high' ? 'bg-red-100 text-red-800' : 'bg-yellow-100 text-yellow-800'
                      }`}>
                        {alert.severity}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>
          </div>
        )}

        {activeTab === 'detailed' && (
          <div className="space-y-6">
            {enhancedAnalysis.clauseAnalysis.map((clause, index) => (
              <motion.div
                key={clause.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700"
              >
                <div
                  className="p-6 cursor-pointer"
                  onClick={() => toggleSection(clause.id)}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                      <div className={`p-2 rounded-lg ${getRiskColor(clause.riskLevel)}`}>
                        {React.createElement(getRiskIcon(clause.riskLevel), {
                          className: "w-4 h-4"
                        })}
                      </div>
                      <div>
                        <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                          {clause.title}
                        </h3>
                        <p className="text-gray-600 dark:text-gray-400">{clause.section}</p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <span className={`px-3 py-1 rounded-full text-xs font-medium ${getRiskColor(clause.riskLevel)}`}>
                        {clause.riskLevel} risk
                      </span>
                      {expandedSections.has(clause.id) ? (
                        <ChevronDown className="w-5 h-5 text-gray-400" />
                      ) : (
                        <ChevronRight className="w-5 h-5 text-gray-400" />
                      )}
                    </div>
                  </div>
                </div>

                {expandedSections.has(clause.id) && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    className="border-t border-gray-200 dark:border-gray-700 p-6 space-y-6"
                  >
                    {/* Plain English Translation */}
                    <div>
                      <h4 className="font-medium text-gray-900 dark:text-white mb-2 flex items-center">
                        <Lightbulb className="w-4 h-4 text-yellow-500 mr-2" />
                        Plain English
                      </h4>
                      <p className="text-gray-700 dark:text-gray-300 bg-blue-50 dark:bg-blue-900/20 p-3 rounded-lg">
                        {clause.plainEnglish}
                      </p>
                    </div>

                    {/* Original Text */}
                    <div>
                      <h4 className="font-medium text-gray-900 dark:text-white mb-2">Original Text</h4>
                      <p className="text-gray-600 dark:text-gray-400 bg-gray-50 dark:bg-gray-700/50 p-3 rounded-lg text-sm">
                        {clause.content}
                      </p>
                    </div>

                    {/* Risks */}
                    {clause.risks.length > 0 && (
                      <div>
                        <h4 className="font-medium text-gray-900 dark:text-white mb-2 flex items-center">
                          <AlertTriangle className="w-4 h-4 text-red-500 mr-2" />
                          Identified Risks
                        </h4>
                        <ul className="space-y-1">
                          {clause.risks.map((risk, riskIndex) => (
                            <li key={riskIndex} className="text-red-700 dark:text-red-400 text-sm flex items-start">
                              <span className="w-1.5 h-1.5 bg-red-500 rounded-full mt-2 mr-2 flex-shrink-0" />
                              {risk}
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}

                    {/* Recommendations */}
                    <div>
                      <h4 className="font-medium text-gray-900 dark:text-white mb-2 flex items-center">
                        <CheckCircle className="w-4 h-4 text-green-500 mr-2" />
                        Recommendations
                      </h4>
                      <ul className="space-y-1">
                        {clause.recommendations.map((rec, recIndex) => (
                          <li key={recIndex} className="text-green-700 dark:text-green-400 text-sm flex items-start">
                            <span className="w-1.5 h-1.5 bg-green-500 rounded-full mt-2 mr-2 flex-shrink-0" />
                            {rec}
                          </li>
                        ))}
                      </ul>
                    </div>
                  </motion.div>
                )}
              </motion.div>
            ))}
          </div>
        )}

        {activeTab === 'deep-dive' && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Negotiation Assistant */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm border border-gray-200 dark:border-gray-700"
            >
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center">
                <Scale className="w-5 h-5 text-blue-500 mr-2" />
                Negotiation Points
              </h3>
              <div className="space-y-4">
                {enhancedAnalysis.negotiationPoints.map((point, index) => (
                  <div key={index} className="border border-gray-200 dark:border-gray-600 rounded-lg p-4">
                    <div className="flex justify-between items-start mb-2">
                      <h4 className="font-medium text-gray-900 dark:text-white">{point.clause}</h4>
                      <span className={`px-2 py-1 rounded text-xs font-medium ${
                        point.priority === 'high' 
                          ? 'bg-red-100 text-red-800' 
                          : 'bg-yellow-100 text-yellow-800'
                      }`}>
                        {point.priority}
                      </span>
                    </div>
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div>
                        <span className="text-gray-500">Current:</span>
                        <p className="text-red-600 dark:text-red-400">{point.current}</p>
                      </div>
                      <div>
                        <span className="text-gray-500">Suggested:</span>
                        <p className="text-green-600 dark:text-green-400">{point.suggested}</p>
                      </div>
                    </div>
                    <p className="text-gray-600 dark:text-gray-400 text-xs mt-2">
                      {point.businessImpact}
                    </p>
                  </div>
                ))}
              </div>
            </motion.div>

            {/* Industry Comparison */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm border border-gray-200 dark:border-gray-700"
            >
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center">
                <TrendingUp className="w-5 h-5 text-green-500 mr-2" />
                Industry Benchmark
              </h3>
              
              <div className="text-center mb-6">
                <div className="text-3xl font-bold text-gray-900 dark:text-white mb-1">
                  {enhancedAnalysis.industryComparison.overallFairness}%
                </div>
                <p className="text-gray-600 dark:text-gray-400 text-sm">
                  Fairness Score vs {enhancedAnalysis.industryComparison.comparedTo}
                </p>
              </div>

              <div className="space-y-4">
                {enhancedAnalysis.industryComparison.benchmarkData.map((item, index) => (
                  <div key={index} className="flex justify-between items-center py-2">
                    <span className="text-gray-700 dark:text-gray-300">{item.metric}</span>
                    <div className="flex space-x-2">
                      <span className={`px-2 py-1 rounded text-xs ${
                        item.yourContract === 'Good' 
                          ? 'bg-green-100 text-green-800' 
                          : item.yourContract === 'Fair'
                          ? 'bg-yellow-100 text-yellow-800'
                          : 'bg-red-100 text-red-800'
                      }`}>
                        You: {item.yourContract}
                      </span>
                      <span className="px-2 py-1 rounded text-xs bg-gray-100 text-gray-800">
                        Industry: {item.industry}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>

            {/* Important Dates */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm border border-gray-200 dark:border-gray-700"
            >
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center">
                <Clock className="w-5 h-5 text-purple-500 mr-2" />
                Important Dates
              </h3>
              <div className="space-y-3">
                {enhancedAnalysis.importantDates.map((date, index) => (
                  <div key={index} className="flex items-center space-x-3 p-3 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
                    <div className={`w-3 h-3 rounded-full ${
                      date.type === 'deadline' ? 'bg-red-500' : 
                      date.type === 'renewal' ? 'bg-yellow-500' : 'bg-green-500'
                    }`} />
                    <div className="flex-1">
                      <p className="font-medium text-gray-900 dark:text-white">{date.event}</p>
                      <p className="text-gray-600 dark:text-gray-400 text-sm">{date.date}</p>
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>

            {/* Educational Resources */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm border border-gray-200 dark:border-gray-700"
            >
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center">
                <BookOpen className="w-5 h-5 text-indigo-500 mr-2" />
                Learn More
              </h3>
              <div className="space-y-3">
                <a href="#" className="flex items-center justify-between p-3 hover:bg-gray-50 dark:hover:bg-gray-700/50 rounded-lg transition-colors">
                  <div className="flex items-center space-x-3">
                    <Video className="w-4 h-4 text-red-500" />
                    <span className="text-gray-700 dark:text-gray-300">Understanding Liability Clauses</span>
                  </div>
                  <ExternalLink className="w-4 h-4 text-gray-400" />
                </a>
                <a href="#" className="flex items-center justify-between p-3 hover:bg-gray-50 dark:hover:bg-gray-700/50 rounded-lg transition-colors">
                  <div className="flex items-center space-x-3">
                    <Gavel className="w-4 h-4 text-blue-500" />
                    <span className="text-gray-700 dark:text-gray-300">Case Study: Similar Contracts</span>
                  </div>
                  <ExternalLink className="w-4 h-4 text-gray-400" />
                </a>
                <a href="#" className="flex items-center justify-between p-3 hover:bg-gray-50 dark:hover:bg-gray-700/50 rounded-lg transition-colors">
                  <div className="flex items-center space-x-3">
                    <BookOpen className="w-4 h-4 text-green-500" />
                    <span className="text-gray-700 dark:text-gray-300">Legal Terms Glossary</span>
                  </div>
                  <ExternalLink className="w-4 h-4 text-gray-400" />
                </a>
              </div>
            </motion.div>
          </div>
        )}

        {/* Risk Alerts Tab */}
        {activeTab === 'risk-alerts' && (
          <div className="mt-6">
            <RiskAlertSystem 
              riskAssessment={{
                overallRisk: 'medium',
                riskScore: 65,
                criticalRisks: [],
                riskCategories: {
                  financial: { score: 60, risks: [] },
                  legal: { score: 70, risks: [] },
                  operational: { score: 50, risks: [] },
                  compliance: { score: 55, risks: [] },
                  reputational: { score: 45, risks: [] }
                },
                redFlags: [],
                recommendedActions: []
              }}
              documentName={document.name}
              onDismissAlert={(alertId) => {
                console.log(`Alert ${alertId} dismissed`);
              }}
            />
          </div>
        )}

        {/* Negotiation Assistant Tab */}
        {activeTab === 'negotiation' && (
          <div className="mt-6">
            <NegotiationAssistant 
              documentContent={`Sample legal document content for ${document.name}`}
              contractType={document.type}
              industry="Technology"
            />
          </div>
        )}

        {/* Education Tab */}
        {activeTab === 'education' && (
          <div className="mt-6">
            <LegalLiteracyModule />
          </div>
        )}

        {/* Chat with Expert CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl p-8 text-white text-center mt-8"
        >
          <Brain className="w-12 h-12 mx-auto mb-4 opacity-90" />
          <h3 className="text-2xl font-bold mb-2">Have More Questions?</h3>
          <p className="text-blue-100 mb-6 max-w-2xl mx-auto">
            Chat with our most expert AI model that has full knowledge of your document and analysis results. 
            Get personalized recommendations and answers to your specific questions.
          </p>
          <button
            onClick={onChatWithExpert}
            className="bg-white text-blue-600 px-8 py-3 rounded-xl font-semibold hover:bg-blue-50 transition-colors inline-flex items-center"
          >
            <MessageCircle className="w-5 h-5 mr-2" />
            Chat with Expert Assistant
          </button>
        </motion.div>
      </div>
    </div>
  );
};

export default DocumentAnalysisPage;