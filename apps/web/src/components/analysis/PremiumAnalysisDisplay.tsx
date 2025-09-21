'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  FileText, 
  Shield, 
  TrendingUp, 
  Clock, 
  AlertTriangle, 
  CheckCircle,
  DollarSign,
  Calendar,
  BookOpen,
  Target,
  Briefcase,
  Award,
  Sparkles,
  ChevronDown,
  ChevronRight,
  ExternalLink,
  Download,
  Share2,
  Bookmark
} from 'lucide-react';

interface AnalysisResult {
  success: boolean;
  timestamp: string;
  file: {
    name: string;
    size: string;
    type: string;
    analysisMode: string;
  };
  analysis: {
    summary: string;
    confidence: number;
    documentType: string;
    language: string;
    keyParties: string[];
    financialAnalysis: {
      totalContractValue: string;
      identifiedAmounts: Array<{
        value: string;
        currency: string;
        description: string;
        type: string;
        formatted: string;
      }>;
      paymentStructure: string[];
      financialRisks: any[];
    };
    keyClauses: Array<{
      id: number;
      title: string;
      content: string;
      importance: string;
      explanation: string;
      risks: string[];
      recommendations: string[];
      complianceImpact: string;
    }>;
    legalTerms: Array<{
      term: string;
      definition: string;
      context: string;
      importance: string;
      educationalNote: string;
    }>;
    riskAssessment: {
      overallRisk: string;
      riskFactors: Array<{
        type: string;
        description: string;
        impact: string;
        mitigation: string;
        urgencyLevel: string;
      }>;
      complianceIssues: Array<{
        framework: string;
        status: string;
        details: string;
      }>;
    };
    timeline: Array<{
      date: string;
      event: string;
      importance: string;
      category: string;
    }>;
    actionableInsights: Array<{
      priority: string;
      action: string;
      deadline: string;
      reason: string;
      category: string;
    }>;
    processingDetails: {
      analysisMode: string;
      processingTime: string;
      aiProvider: string;
      accuracyGuarantee: string;
      processedBy: string;
      userId: string;
      documentPages: string;
      extractionQuality: string;
    };
  };
}

const PremiumAnalysisDisplay: React.FC<{ result: AnalysisResult }> = ({ result }) => {
  const [expandedSections, setExpandedSections] = useState<Set<string>>(new Set(['summary']));
  const [selectedTab, setSelectedTab] = useState('overview');

  const toggleSection = (section: string) => {
    const newExpanded = new Set(expandedSections);
    if (newExpanded.has(section)) {
      newExpanded.delete(section);
    } else {
      newExpanded.add(section);
    }
    setExpandedSections(newExpanded);
  };

  const getRiskColor = (risk: string) => {
    switch (risk.toLowerCase()) {
      case 'high': return 'text-red-600 bg-red-50 border-red-200';
      case 'medium': return 'text-yellow-600 bg-yellow-50 border-yellow-200';
      case 'low': return 'text-green-600 bg-green-50 border-green-200';
      default: return 'text-gray-600 bg-gray-50 border-gray-200';
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority.toLowerCase()) {
      case 'high': return 'bg-red-100 text-red-800 border-red-300';
      case 'medium': return 'bg-yellow-100 text-yellow-800 border-yellow-300';
      case 'low': return 'bg-green-100 text-green-800 border-green-300';
      default: return 'bg-gray-100 text-gray-800 border-gray-300';
    }
  };

  return (
    <div className="max-w-6xl mx-auto p-6 bg-gradient-to-br from-slate-50 to-white min-h-screen">
      {/* Premium Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white rounded-2xl shadow-xl border border-slate-200 p-8 mb-8"
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <div className="relative">
              <div className="w-16 h-16 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full flex items-center justify-center">
                <Sparkles className="w-8 h-8 text-white" />
              </div>
              <div className="absolute -top-1 -right-1 w-6 h-6 bg-green-500 rounded-full flex items-center justify-center">
                <CheckCircle className="w-4 h-4 text-white" />
              </div>
            </div>
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">
                Premium Legal Analysis Complete
              </h1>
              <p className="text-lg text-gray-600">
                <span className="font-semibold text-blue-600">{result.analysis.confidence}%</span> accuracy • 
                Powered by <span className="font-semibold">{result.analysis.processingDetails.aiProvider}</span>
              </p>
            </div>
          </div>
          <div className="flex space-x-3">
            <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center space-x-2">
              <Download className="w-4 h-4" />
              <span>Download Report</span>
            </button>
            <button className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors flex items-center space-x-2">
              <Share2 className="w-4 h-4" />
              <span>Share</span>
            </button>
          </div>
        </div>

        {/* File Info */}
        <div className="mt-6 grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="bg-slate-50 rounded-lg p-4">
            <div className="flex items-center space-x-2 text-sm text-gray-600 mb-1">
              <FileText className="w-4 h-4" />
              <span>Document</span>
            </div>
            <p className="font-semibold text-gray-900">{result.file.name}</p>
          </div>
          <div className="bg-slate-50 rounded-lg p-4">
            <div className="flex items-center space-x-2 text-sm text-gray-600 mb-1">
              <Briefcase className="w-4 h-4" />
              <span>Type</span>
            </div>
            <p className="font-semibold text-gray-900">{result.analysis.documentType}</p>
          </div>
          <div className="bg-slate-50 rounded-lg p-4">
            <div className="flex items-center space-x-2 text-sm text-gray-600 mb-1">
              <Clock className="w-4 h-4" />
              <span>Processing Time</span>
            </div>
            <p className="font-semibold text-gray-900">{result.analysis.processingDetails.processingTime}</p>
          </div>
          <div className="bg-slate-50 rounded-lg p-4">
            <div className="flex items-center space-x-2 text-sm text-gray-600 mb-1">
              <Award className="w-4 h-4" />
              <span>Quality</span>
            </div>
            <p className="font-semibold text-gray-900">{result.analysis.processingDetails.extractionQuality}</p>
          </div>
        </div>
      </motion.div>

      {/* Navigation Tabs */}
      <div className="bg-white rounded-xl shadow-lg border border-slate-200 mb-6">
        <div className="flex overflow-x-auto">
          {[
            { id: 'overview', name: 'Executive Overview', icon: FileText },
            { id: 'financial', name: 'Financial Analysis', icon: DollarSign },
            { id: 'clauses', name: 'Key Clauses', icon: BookOpen },
            { id: 'risks', name: 'Risk Assessment', icon: AlertTriangle },
            { id: 'timeline', name: 'Timeline', icon: Calendar },
            { id: 'insights', name: 'Action Items', icon: Target }
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setSelectedTab(tab.id)}
              className={`flex items-center space-x-2 px-6 py-4 font-medium border-b-2 transition-colors whitespace-nowrap ${
                selectedTab === tab.id
                  ? 'border-blue-600 text-blue-600 bg-blue-50'
                  : 'border-transparent text-gray-600 hover:text-gray-900 hover:bg-gray-50'
              }`}
            >
              <tab.icon className="w-5 h-5" />
              <span>{tab.name}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Tab Content */}
      <AnimatePresence mode="wait">
        <motion.div
          key={selectedTab}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          transition={{ duration: 0.3 }}
        >
          {selectedTab === 'overview' && (
            <div className="space-y-6">
              {/* Executive Summary */}
              <div className="bg-white rounded-xl shadow-lg border border-slate-200 p-6">
                <h3 className="text-xl font-bold text-gray-900 mb-4 flex items-center space-x-2">
                  <FileText className="w-6 h-6 text-blue-600" />
                  <span>Executive Summary</span>
                </h3>
                <div className="prose prose-lg max-w-none">
                  <div className="bg-blue-50 border-l-4 border-blue-600 p-4 rounded-r-lg">
                    <p className="text-gray-800 leading-relaxed whitespace-pre-line">
                      {result.analysis.summary}
                    </p>
                  </div>
                </div>
              </div>

              {/* Key Parties */}
              <div className="bg-white rounded-xl shadow-lg border border-slate-200 p-6">
                <h3 className="text-xl font-bold text-gray-900 mb-4">Key Stakeholders</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {result.analysis.keyParties.map((party, index) => (
                    <div key={index} className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
                      <div className="w-3 h-3 bg-blue-600 rounded-full"></div>
                      <span className="font-medium text-gray-900">{party}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Quick Stats */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-white rounded-xl shadow-lg border border-slate-200 p-6">
                  <div className="flex items-center space-x-3">
                    <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
                      <TrendingUp className="w-6 h-6 text-green-600" />
                    </div>
                    <div>
                      <p className="text-2xl font-bold text-gray-900">{result.analysis.keyClauses.length}</p>
                      <p className="text-sm text-gray-600">Key Clauses Identified</p>
                    </div>
                  </div>
                </div>

                <div className="bg-white rounded-xl shadow-lg border border-slate-200 p-6">
                  <div className="flex items-center space-x-3">
                    <div className="w-12 h-12 bg-yellow-100 rounded-full flex items-center justify-center">
                      <AlertTriangle className="w-6 h-6 text-yellow-600" />
                    </div>
                    <div>
                      <p className="text-2xl font-bold text-gray-900">{result.analysis.riskAssessment.riskFactors.length}</p>
                      <p className="text-sm text-gray-600">Risk Factors Found</p>
                    </div>
                  </div>
                </div>

                <div className="bg-white rounded-xl shadow-lg border border-slate-200 p-6">
                  <div className="flex items-center space-x-3">
                    <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                      <Target className="w-6 h-6 text-blue-600" />
                    </div>
                    <div>
                      <p className="text-2xl font-bold text-gray-900">{result.analysis.actionableInsights.length}</p>
                      <p className="text-sm text-gray-600">Action Items</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {selectedTab === 'financial' && (
            <div className="bg-white rounded-xl shadow-lg border border-slate-200 p-6">
              <h3 className="text-xl font-bold text-gray-900 mb-6 flex items-center space-x-2">
                <DollarSign className="w-6 h-6 text-green-600" />
                <span>Complete Financial Analysis</span>
              </h3>

              {/* Total Contract Value */}
              <div className="bg-green-50 border border-green-200 rounded-lg p-6 mb-6">
                <div className="text-center">
                  <p className="text-sm text-green-600 font-medium mb-2">Total Contract Value</p>
                  <p className="text-3xl font-bold text-green-700">
                    {result.analysis.financialAnalysis.totalContractValue}
                  </p>
                </div>
              </div>

              {/* Financial Breakdown */}
              <div className="space-y-4">
                <h4 className="text-lg font-semibold text-gray-900">Identified Amounts</h4>
                {result.analysis.financialAnalysis.identifiedAmounts.length > 0 ? (
                  <div className="grid gap-4">
                    {result.analysis.financialAnalysis.identifiedAmounts.map((amount, index) => (
                      <div key={index} className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
                        <div className="flex justify-between items-start">
                          <div>
                            <p className="text-xl font-bold text-gray-900">{amount.formatted}</p>
                            <p className="text-sm text-gray-600 capitalize">{amount.type}</p>
                          </div>
                          <span className="px-3 py-1 bg-blue-100 text-blue-800 text-sm font-medium rounded-full">
                            {amount.currency}
                          </span>
                        </div>
                        <p className="text-gray-700 mt-2">{amount.description}</p>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8 text-gray-500">
                    <DollarSign className="w-16 h-16 mx-auto mb-4 opacity-50" />
                    <p>No specific financial amounts identified in this document.</p>
                  </div>
                )}

                {/* Payment Terms */}
                {result.analysis.financialAnalysis.paymentStructure.length > 0 && (
                  <div className="mt-8">
                    <h4 className="text-lg font-semibold text-gray-900 mb-4">Payment Structure</h4>
                    <div className="space-y-3">
                      {result.analysis.financialAnalysis.paymentStructure.map((term, index) => (
                        <div key={index} className="flex items-start space-x-3 p-3 bg-gray-50 rounded-lg">
                          <CheckCircle className="w-5 h-5 text-green-600 mt-0.5" />
                          <span className="text-gray-700">{term}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}

          {selectedTab === 'clauses' && (
            <div className="space-y-6">
              {result.analysis.keyClauses.map((clause, index) => (
                <div key={clause.id} className="bg-white rounded-xl shadow-lg border border-slate-200">
                  <div
                    onClick={() => toggleSection(`clause-${clause.id}`)}
                    className="flex items-center justify-between p-6 cursor-pointer hover:bg-gray-50 transition-colors"
                  >
                    <div className="flex items-center space-x-4">
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold ${
                        clause.importance === 'high' ? 'bg-red-100 text-red-700' :
                        clause.importance === 'medium' ? 'bg-yellow-100 text-yellow-700' :
                        'bg-green-100 text-green-700'
                      }`}>
                        {index + 1}
                      </div>
                      <div>
                        <h3 className="text-lg font-semibold text-gray-900">{clause.title}</h3>
                        <p className="text-sm text-gray-600">
                          <span className="capitalize">{clause.importance}</span> importance • {clause.complianceImpact}
                        </p>
                      </div>
                    </div>
                    {expandedSections.has(`clause-${clause.id}`) ? 
                      <ChevronDown className="w-5 h-5 text-gray-400" /> : 
                      <ChevronRight className="w-5 h-5 text-gray-400" />
                    }
                  </div>

                  <AnimatePresence>
                    {expandedSections.has(`clause-${clause.id}`) && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        className="border-t border-gray-200"
                      >
                        <div className="p-6 space-y-4">
                          {/* Clause Content */}
                          <div className="bg-gray-50 rounded-lg p-4">
                            <h4 className="font-semibold text-gray-900 mb-2">Clause Text</h4>
                            <p className="text-gray-700 leading-relaxed">{clause.content}</p>
                          </div>

                          {/* Professional Explanation */}
                          <div className="bg-blue-50 rounded-lg p-4">
                            <h4 className="font-semibold text-blue-900 mb-2">Professional Explanation</h4>
                            <p className="text-blue-800">{clause.explanation}</p>
                          </div>

                          {/* Risks & Recommendations */}
                          {clause.risks.length > 0 && (
                            <div className="grid md:grid-cols-2 gap-4">
                              <div className="bg-red-50 rounded-lg p-4">
                                <h4 className="font-semibold text-red-900 mb-2 flex items-center space-x-2">
                                  <AlertTriangle className="w-4 h-4" />
                                  <span>Potential Risks</span>
                                </h4>
                                <ul className="space-y-1">
                                  {clause.risks.map((risk, riskIndex) => (
                                    <li key={riskIndex} className="text-red-800 text-sm">• {risk}</li>
                                  ))}
                                </ul>
                              </div>

                              {clause.recommendations.length > 0 && (
                                <div className="bg-green-50 rounded-lg p-4">
                                  <h4 className="font-semibold text-green-900 mb-2 flex items-center space-x-2">
                                    <CheckCircle className="w-4 h-4" />
                                    <span>Recommendations</span>
                                  </h4>
                                  <ul className="space-y-1">
                                    {clause.recommendations.map((rec, recIndex) => (
                                      <li key={recIndex} className="text-green-800 text-sm">• {rec}</li>
                                    ))}
                                  </ul>
                                </div>
                              )}
                            </div>
                          )}
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              ))}
            </div>
          )}

          {selectedTab === 'risks' && (
            <div className="space-y-6">
              {/* Overall Risk Level */}
              <div className="bg-white rounded-xl shadow-lg border border-slate-200 p-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-xl font-bold text-gray-900">Overall Risk Assessment</h3>
                  <div className={`px-4 py-2 rounded-full text-sm font-bold border-2 ${getRiskColor(result.analysis.riskAssessment.overallRisk)}`}>
                    {result.analysis.riskAssessment.overallRisk.toUpperCase()} RISK
                  </div>
                </div>
              </div>

              {/* Risk Factors */}
              <div className="space-y-4">
                {result.analysis.riskAssessment.riskFactors.map((risk, index) => (
                  <div key={index} className="bg-white rounded-xl shadow-lg border border-slate-200 p-6">
                    <div className="flex items-start space-x-4">
                      <div className={`w-12 h-12 rounded-full flex items-center justify-center ${
                        risk.urgencyLevel === 'High' ? 'bg-red-100' : 'bg-yellow-100'
                      }`}>
                        <AlertTriangle className={`w-6 h-6 ${
                          risk.urgencyLevel === 'High' ? 'text-red-600' : 'text-yellow-600'
                        }`} />
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center justify-between mb-2">
                          <h4 className="text-lg font-semibold text-gray-900">{risk.type}</h4>
                          <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                            risk.urgencyLevel === 'High' ? 'bg-red-100 text-red-800' : 'bg-yellow-100 text-yellow-800'
                          }`}>
                            {risk.urgencyLevel} Priority
                          </span>
                        </div>
                        <p className="text-gray-700 mb-3">{risk.description}</p>
                        
                        <div className="grid md:grid-cols-2 gap-4">
                          <div className="bg-red-50 border border-red-200 rounded-lg p-3">
                            <h5 className="font-semibold text-red-900 mb-1">Potential Impact</h5>
                            <p className="text-red-800 text-sm">{risk.impact}</p>
                          </div>
                          <div className="bg-green-50 border border-green-200 rounded-lg p-3">
                            <h5 className="font-semibold text-green-900 mb-1">Mitigation Strategy</h5>
                            <p className="text-green-800 text-sm">{risk.mitigation}</p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Compliance Issues */}
              {result.analysis.riskAssessment.complianceIssues.length > 0 && (
                <div className="bg-white rounded-xl shadow-lg border border-slate-200 p-6">
                  <h3 className="text-xl font-bold text-gray-900 mb-4 flex items-center space-x-2">
                    <Shield className="w-6 h-6 text-blue-600" />
                    <span>Compliance Requirements</span>
                  </h3>
                  <div className="space-y-3">
                    {result.analysis.riskAssessment.complianceIssues.map((issue, index) => (
                      <div key={index} className="flex items-center space-x-3 p-4 bg-blue-50 rounded-lg">
                        <CheckCircle className="w-5 h-5 text-blue-600" />
                        <div>
                          <p className="font-semibold text-blue-900">{issue.framework}</p>
                          <p className="text-blue-800 text-sm">{issue.details}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}

          {selectedTab === 'timeline' && (
            <div className="bg-white rounded-xl shadow-lg border border-slate-200 p-6">
              <h3 className="text-xl font-bold text-gray-900 mb-6 flex items-center space-x-2">
                <Calendar className="w-6 h-6 text-blue-600" />
                <span>Document Timeline & Key Dates</span>
              </h3>

              {result.analysis.timeline.length > 0 ? (
                <div className="space-y-6">
                  {result.analysis.timeline.map((item, index) => (
                    <div key={index} className="flex items-start space-x-4">
                      <div className={`w-12 h-12 rounded-full flex items-center justify-center ${
                        item.importance === 'high' ? 'bg-red-100 text-red-600' :
                        item.importance === 'medium' ? 'bg-yellow-100 text-yellow-600' :
                        'bg-green-100 text-green-600'
                      }`}>
                        <Calendar className="w-6 h-6" />
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center justify-between">
                          <h4 className="text-lg font-semibold text-gray-900">{item.date}</h4>
                          <div className="flex space-x-2">
                            <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                              item.importance === 'high' ? 'bg-red-100 text-red-800' :
                              item.importance === 'medium' ? 'bg-yellow-100 text-yellow-800' :
                              'bg-green-100 text-green-800'
                            }`}>
                              {item.importance}
                            </span>
                            <span className="px-2 py-1 bg-gray-100 text-gray-800 rounded-full text-xs font-medium">
                              {item.category}
                            </span>
                          </div>
                        </div>
                        <p className="text-gray-700 mt-1">{item.event}</p>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-12 text-gray-500">
                  <Calendar className="w-16 h-16 mx-auto mb-4 opacity-50" />
                  <p>No specific dates or deadlines identified in this document.</p>
                </div>
              )}
            </div>
          )}

          {selectedTab === 'insights' && (
            <div className="space-y-4">
              {result.analysis.actionableInsights.map((insight, index) => (
                <div key={index} className="bg-white rounded-xl shadow-lg border border-slate-200 p-6">
                  <div className="flex items-start space-x-4">
                    <div className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold ${getPriorityColor(insight.priority)}`}>
                      {index + 1}
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center justify-between mb-2">
                        <span className={`px-3 py-1 rounded-full text-sm font-medium border ${getPriorityColor(insight.priority)}`}>
                          {insight.priority.toUpperCase()} PRIORITY
                        </span>
                        <span className="px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-sm">
                          {insight.category}
                        </span>
                      </div>
                      <h4 className="text-lg font-semibold text-gray-900 mb-2">{insight.action}</h4>
                      <p className="text-gray-700 mb-3">{insight.reason}</p>
                      {insight.deadline && (
                        <div className="flex items-center space-x-2 text-sm text-gray-600">
                          <Clock className="w-4 h-4" />
                          <span>Deadline: {insight.deadline}</span>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </motion.div>
      </AnimatePresence>

      {/* Legal Education Hub */}
      {result.analysis.legalTerms.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mt-8 bg-white rounded-xl shadow-lg border border-slate-200 p-6"
        >
          <h3 className="text-xl font-bold text-gray-900 mb-6 flex items-center space-x-2">
            <BookOpen className="w-6 h-6 text-purple-600" />
            <span>Legal Education Hub</span>
            <span className="text-sm bg-purple-100 text-purple-800 px-2 py-1 rounded-full">
              Learn & Understand
            </span>
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {result.analysis.legalTerms.map((term, index) => (
              <div key={index} className="bg-gradient-to-r from-purple-50 to-blue-50 rounded-lg p-4 border border-purple-200">
                <div className="flex items-center justify-between mb-2">
                  <h4 className="text-lg font-semibold text-purple-900">{term.term}</h4>
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                    term.importance === 'high' ? 'bg-red-100 text-red-800' : 'bg-blue-100 text-blue-800'
                  }`}>
                    {term.importance}
                  </span>
                </div>
                <p className="text-purple-800 mb-2">{term.definition}</p>
                <div className="text-sm text-purple-700 bg-white bg-opacity-50 rounded p-2">
                  <p className="mb-1"><strong>In this document:</strong> {term.context}</p>
                  <p><strong>💡 {term.educationalNote}</strong></p>
                </div>
              </div>
            ))}
          </div>
        </motion.div>
      )}

      {/* Footer */}
      <div className="mt-8 text-center text-gray-500 text-sm">
        <p>Analysis completed on {new Date(result.timestamp).toLocaleString()}</p>
        <p>Powered by {result.analysis.processingDetails.aiProvider} • {result.analysis.processingDetails.accuracyGuarantee} Accuracy</p>
      </div>
    </div>
  );
};

export default PremiumAnalysisDisplay;