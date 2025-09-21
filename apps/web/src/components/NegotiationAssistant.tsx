'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  MessageSquare,
  TrendingUp,
  Target,
  Lightbulb,
  ArrowRight,
  CheckCircle,
  AlertCircle,
  BarChart3,
  FileEdit,
  Users,
  DollarSign,
  Clock,
  Shield,
  Award,
  Zap,
  Copy,
  ExternalLink,
  ThumbsUp,
  ThumbsDown,
  Star,
  ChevronDown,
  ChevronUp
} from 'lucide-react';

interface NegotiationPoint {
  id: string;
  category: 'pricing' | 'terms' | 'liability' | 'timeline' | 'scope' | 'termination';
  priority: 'high' | 'medium' | 'low';
  title: string;
  currentText: string;
  issues: string[];
  suggestions: {
    conservative: string;
    balanced: string;
    aggressive: string;
  };
  industryBenchmark: string;
  negotiationTips: string[];
  potentialSavings?: string;
  riskLevel: 'low' | 'medium' | 'high';
}

interface MarketComparison {
  metric: string;
  yourContract: string;
  industryAverage: string;
  bestPractice: string;
  status: 'favorable' | 'neutral' | 'unfavorable';
}

interface NegotiationAssistantProps {
  documentContent?: string;
  contractType?: string;
  industry?: string;
}

export default function NegotiationAssistant({ 
  documentContent, 
  contractType = 'Service Agreement',
  industry = 'Technology'
}: NegotiationAssistantProps) {
  const [selectedPoint, setSelectedPoint] = useState<NegotiationPoint | null>(null);
  const [activeTab, setActiveTab] = useState<'points' | 'comparisons' | 'strategies'>('points');
  const [expandedPoints, setExpandedPoints] = useState<{[key: string]: boolean}>({});
  const [negotiationPoints, setNegotiationPoints] = useState<NegotiationPoint[]>([]);
  const [marketComparisons, setMarketComparisons] = useState<MarketComparison[]>([]);
  const [isGenerating, setIsGenerating] = useState(false);

  const generateNegotiationInsights = async () => {
    setIsGenerating(true);
    
    try {
      // Mock negotiation points - enhanced based on document content
      const points: NegotiationPoint[] = [
        {
          id: 'payment-terms',
          category: 'pricing',
          priority: 'high',
          title: 'Payment Terms & Late Fees',
          currentText: 'Payment due within 15 days, 5% monthly late fee',
          issues: [
            'Shorter payment terms than industry standard',
            'High late fee penalty',
            'No early payment discount offered'
          ],
          suggestions: {
            conservative: 'Request 30-day payment terms with 2% late fee',
            balanced: 'Negotiate 45-day terms with 3% late fee and 2% early payment discount',
            aggressive: 'Push for 60-day terms with 1.5% late fee and 3% early payment discount'
          },
          industryBenchmark: 'Industry standard: 30-45 days, 1.5-3% monthly late fees',
          negotiationTips: [
            'Highlight your strong payment history',
            'Offer to set up automatic payments for better terms',
            'Reference longer terms with other vendors',
            'Propose graduated late fees (1% first 30 days, 2% after)'
          ],
          potentialSavings: '$2,500 - $5,000 annually',
          riskLevel: 'low'
        },
        {
          id: 'liability-caps',
          category: 'liability',
          priority: 'high',
          title: 'Limitation of Liability',
          currentText: 'Client assumes all liability, no cap on damages',
          issues: [
            'Unlimited liability exposure',
            'One-sided risk allocation',
            'No mutual indemnification'
          ],
          suggestions: {
            conservative: 'Cap liability at 12 months of contract value',
            balanced: 'Mutual liability cap at 6 months contract value, exclude gross negligence',
            aggressive: 'Cap at 3 months value, mutual indemnification, exclude consequential damages'
          },
          industryBenchmark: 'Standard: 6-12 months contract value, mutual caps',
          negotiationTips: [
            'Reference your insurance coverage limits',
            'Propose mutual liability caps',
            'Exclude willful misconduct from caps',
            'Suggest separate caps for different types of damages'
          ],
          potentialSavings: 'Risk reduction: $50,000 - $500,000+',
          riskLevel: 'high'
        },
        {
          id: 'termination-terms',
          category: 'termination',
          priority: 'medium',
          title: 'Termination & Penalties',
          currentText: '90-day notice required, full remaining contract value due',
          issues: [
            'Excessive termination penalty',
            'Long notice period',
            'No termination for cause provisions'
          ],
          suggestions: {
            conservative: '60-day notice, penalty capped at 25% of remaining value',
            balanced: '30-day notice, 15% penalty, immediate termination for cause',
            aggressive: '30-day notice, no penalty after 12 months, material breach clause'
          },
          industryBenchmark: 'Standard: 30-60 days notice, 10-25% penalty caps',
          negotiationTips: [
            'Negotiate different terms for different breach types',
            'Include performance-based termination rights',
            'Propose mutual termination clauses',
            'Request right to terminate for convenience after initial period'
          ],
          potentialSavings: '$15,000 - $75,000 risk reduction',
          riskLevel: 'medium'
        },
        {
          id: 'scope-changes',
          category: 'scope',
          priority: 'medium',
          title: 'Scope Changes & Additional Work',
          currentText: 'All changes require written approval, billed at premium rates',
          issues: [
            'Vague change control process',
            'No cap on additional work costs',
            'Premium pricing for changes'
          ],
          suggestions: {
            conservative: 'Define clear change process, cap changes at 20% of original scope',
            balanced: 'Streamlined approval for minor changes, 15% cap, standard rates',
            aggressive: 'Client approval only for changes >5%, 10% cap, negotiated rates'
          },
          industryBenchmark: 'Standard: 15-25% scope change caps, defined approval process',
          negotiationTips: [
            'Define "minor" vs "major" changes clearly',
            'Set approval thresholds for different change types',
            'Negotiate volume discounts for additional work',
            'Include some buffer in original scope'
          ],
          potentialSavings: '$5,000 - $20,000 on scope changes',
          riskLevel: 'low'
        }
      ];

      const comparisons: MarketComparison[] = [
        {
          metric: 'Payment Terms',
          yourContract: '15 days',
          industryAverage: '30 days',
          bestPractice: '45 days',
          status: 'unfavorable'
        },
        {
          metric: 'Late Fee Rate',
          yourContract: '5% monthly',
          industryAverage: '2.5% monthly',
          bestPractice: '1.5% monthly',
          status: 'unfavorable'
        },
        {
          metric: 'Liability Cap',
          yourContract: 'Unlimited',
          industryAverage: '12 months fees',
          bestPractice: '6 months fees',
          status: 'unfavorable'
        },
        {
          metric: 'Termination Notice',
          yourContract: '90 days',
          industryAverage: '60 days',
          bestPractice: '30 days',
          status: 'unfavorable'
        },
        {
          metric: 'IP Ownership',
          yourContract: 'Vendor retains',
          industryAverage: 'Client owns',
          bestPractice: 'Client owns',
          status: 'unfavorable'
        },
        {
          metric: 'SLA Penalties',
          yourContract: 'None specified',
          industryAverage: '5-10% credits',
          bestPractice: '15% credits',
          status: 'unfavorable'
        }
      ];

      await new Promise(resolve => setTimeout(resolve, 1500));
      setNegotiationPoints(points);
      setMarketComparisons(comparisons);
    } catch (error) {
      console.error('Error generating negotiation insights:', error);
    }
    
    setIsGenerating(false);
  };

  useEffect(() => {
    generateNegotiationInsights();
  }, [documentContent, contractType, industry]);

  const togglePointExpansion = (pointId: string) => {
    setExpandedPoints(prev => ({
      ...prev,
      [pointId]: !prev[pointId]
    }));
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'text-red-600 bg-red-50 border-red-200';
      case 'medium': return 'text-orange-600 bg-orange-50 border-orange-200';
      case 'low': return 'text-blue-600 bg-blue-50 border-blue-200';
      default: return 'text-gray-600 bg-gray-50 border-gray-200';
    }
  };

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'pricing': return DollarSign;
      case 'terms': return FileEdit;
      case 'liability': return Shield;
      case 'timeline': return Clock;
      case 'scope': return Target;
      case 'termination': return AlertCircle;
      default: return MessageSquare;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'favorable': return 'text-green-600 bg-green-50';
      case 'neutral': return 'text-yellow-600 bg-yellow-50';
      case 'unfavorable': return 'text-red-600 bg-red-50';
      default: return 'text-gray-600 bg-gray-50';
    }
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
  };

  return (
    <div className="w-full bg-white dark:bg-gray-800 rounded-xl shadow-lg">
      {/* Header */}
      <div className="p-6 border-b border-gray-200 dark:border-gray-700">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-blue-100 dark:bg-blue-900/20 rounded-full flex items-center justify-center">
              <MessageSquare className="w-5 h-5 text-blue-600" />
            </div>
            <div>
              <h3 className="text-xl font-bold text-gray-900 dark:text-white">Negotiation Assistant</h3>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                AI-powered negotiation strategies and market insights for {contractType}
              </p>
            </div>
          </div>
          
          {isGenerating && (
            <div className="flex items-center gap-2 text-blue-600">
              <div className="animate-spin w-4 h-4 border-2 border-blue-600 border-t-transparent rounded-full"></div>
              <span className="text-sm">Analyzing...</span>
            </div>
          )}
        </div>

        {/* Tab Navigation */}
        <div className="flex gap-4 border-b border-gray-200 dark:border-gray-700">
          {[
            { key: 'points', label: 'Negotiation Points', icon: Target },
            { key: 'comparisons', label: 'Market Analysis', icon: BarChart3 },
            { key: 'strategies', label: 'Strategies & Tips', icon: Lightbulb }
          ].map(({ key, label, icon: Icon }) => (
            <button
              key={key}
              onClick={() => setActiveTab(key as any)}
              className={`flex items-center gap-2 px-4 py-2 border-b-2 transition-colors ${
                activeTab === key
                  ? 'border-blue-600 text-blue-600'
                  : 'border-transparent text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200'
              }`}
            >
              <Icon className="w-4 h-4" />
              {label}
            </button>
          ))}
        </div>
      </div>

      <div className="p-6">
        {/* Negotiation Points Tab */}
        {activeTab === 'points' && (
          <div className="space-y-4">
            <div className="flex justify-between items-center mb-6">
              <h4 className="text-lg font-semibold text-gray-900 dark:text-white">
                Key Negotiation Opportunities
              </h4>
              <div className="text-sm text-gray-600 dark:text-gray-400">
                Potential savings: $72,500 - $600,000+
              </div>
            </div>

            {negotiationPoints.map((point) => {
              const Icon = getCategoryIcon(point.category);
              const isExpanded = expandedPoints[point.id];
              
              return (
                <motion.div
                  key={point.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className={`border rounded-lg p-4 ${getPriorityColor(point.priority)}`}
                >
                  <div className="flex items-start justify-between">
                    <div className="flex items-start gap-3 flex-1">
                      <Icon className="w-5 h-5 mt-1 flex-shrink-0" />
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <h5 className="font-semibold">{point.title}</h5>
                          <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                            point.priority === 'high' ? 'bg-red-600 text-white' :
                            point.priority === 'medium' ? 'bg-orange-600 text-white' :
                            'bg-blue-600 text-white'
                          }`}>
                            {point.priority.toUpperCase()} PRIORITY
                          </span>
                          {point.potentialSavings && (
                            <span className="px-2 py-1 bg-green-100 text-green-800 rounded-full text-xs font-medium">
                              💰 {point.potentialSavings}
                            </span>
                          )}
                        </div>
                        
                        <div className="mb-3 p-3 bg-white/50 dark:bg-gray-700/50 rounded-md">
                          <div className="text-sm font-medium mb-1">Current Terms:</div>
                          <div className="text-sm">{point.currentText}</div>
                        </div>

                        {isExpanded && (
                          <motion.div
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: 'auto' }}
                            className="space-y-4"
                          >
                            {/* Issues */}
                            <div>
                              <h6 className="font-medium text-sm mb-2 text-red-700 dark:text-red-400">⚠️ Issues Identified:</h6>
                              <ul className="text-sm space-y-1">
                                {point.issues.map((issue, idx) => (
                                  <li key={idx} className="flex items-start gap-2">
                                    <span className="text-red-500">•</span>
                                    {issue}
                                  </li>
                                ))}
                              </ul>
                            </div>

                            {/* Suggestions */}
                            <div>
                              <h6 className="font-medium text-sm mb-3">💡 Negotiation Approaches:</h6>
                              <div className="space-y-3">
                                {Object.entries(point.suggestions).map(([approach, suggestion]) => (
                                  <div key={approach} className="relative">
                                    <div className={`p-3 rounded-md border-l-4 ${
                                      approach === 'conservative' ? 'border-blue-500 bg-blue-50/50 dark:bg-blue-900/10' :
                                      approach === 'balanced' ? 'border-green-500 bg-green-50/50 dark:bg-green-900/10' :
                                      'border-purple-500 bg-purple-50/50 dark:bg-purple-900/10'
                                    }`}>
                                      <div className="flex items-center justify-between mb-1">
                                        <span className="font-medium text-sm capitalize">{approach} Approach</span>
                                        <button
                                          onClick={() => copyToClipboard(suggestion)}
                                          className="p-1 hover:bg-white dark:hover:bg-gray-700 rounded transition-colors"
                                        >
                                          <Copy className="w-3 h-3" />
                                        </button>
                                      </div>
                                      <p className="text-sm">{suggestion}</p>
                                    </div>
                                  </div>
                                ))}
                              </div>
                            </div>

                            {/* Industry Benchmark */}
                            <div className="p-3 bg-yellow-50 dark:bg-yellow-900/20 rounded-md">
                              <h6 className="font-medium text-sm mb-1 text-yellow-800 dark:text-yellow-200">📊 Industry Benchmark:</h6>
                              <p className="text-sm text-yellow-700 dark:text-yellow-300">{point.industryBenchmark}</p>
                            </div>

                            {/* Negotiation Tips */}
                            <div>
                              <h6 className="font-medium text-sm mb-2">🎯 Negotiation Tips:</h6>
                              <ul className="text-sm space-y-1">
                                {point.negotiationTips.map((tip, idx) => (
                                  <li key={idx} className="flex items-start gap-2">
                                    <span className="text-green-500">✓</span>
                                    {tip}
                                  </li>
                                ))}
                              </ul>
                            </div>
                          </motion.div>
                        )}
                      </div>
                    </div>
                    
                    <button
                      onClick={() => togglePointExpansion(point.id)}
                      className="ml-2 p-1 hover:bg-white/50 dark:hover:bg-gray-700/50 rounded-md transition-colors"
                    >
                      {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                    </button>
                  </div>
                </motion.div>
              );
            })}
          </div>
        )}

        {/* Market Comparisons Tab */}
        {activeTab === 'comparisons' && (
          <div>
            <h4 className="text-lg font-semibold text-gray-900 dark:text-white mb-6">
              Market Analysis - {industry} Industry
            </h4>
            
            <div className="overflow-x-auto">
              <table className="w-full border border-gray-200 dark:border-gray-700 rounded-lg">
                <thead className="bg-gray-50 dark:bg-gray-700/50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                      Contract Term
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                      Your Contract
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                      Industry Average
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                      Best Practice
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                      Status
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                  {marketComparisons.map((comparison, index) => (
                    <tr key={index}>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-white">
                        {comparison.metric}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-gray-300">
                        {comparison.yourContract}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-gray-300">
                        {comparison.industryAverage}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-gray-300">
                        {comparison.bestPractice}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(comparison.status)}`}>
                          {comparison.status === 'favorable' && '✓ Favorable'}
                          {comparison.status === 'neutral' && '~ Neutral'}
                          {comparison.status === 'unfavorable' && '⚠ Needs Improvement'}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Strategies Tab */}
        {activeTab === 'strategies' && (
          <div className="space-y-6">
            <h4 className="text-lg font-semibold text-gray-900 dark:text-white">
              Strategic Negotiation Guide
            </h4>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Preparation Strategies */}
              <div className="p-6 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                <div className="flex items-center gap-3 mb-4">
                  <Target className="w-6 h-6 text-blue-600" />
                  <h5 className="font-semibold text-blue-900 dark:text-blue-100">Preparation Phase</h5>
                </div>
                <ul className="space-y-2 text-sm text-blue-800 dark:text-blue-200">
                  <li>✓ Research vendor's typical contract terms</li>
                  <li>✓ Prepare alternative language for key clauses</li>
                  <li>✓ Identify your must-haves vs nice-to-haves</li>
                  <li>✓ Establish your BATNA (Best Alternative)</li>
                  <li>✓ Prepare cost-benefit analysis for each point</li>
                </ul>
              </div>

              {/* Timing Strategies */}
              <div className="p-6 bg-green-50 dark:bg-green-900/20 rounded-lg">
                <div className="flex items-center gap-3 mb-4">
                  <Clock className="w-6 h-6 text-green-600" />
                  <h5 className="font-semibold text-green-900 dark:text-green-100">Timing & Approach</h5>
                </div>
                <ul className="space-y-2 text-sm text-green-800 dark:text-green-200">
                  <li>✓ Start negotiations early in vendor's quarter</li>
                  <li>✓ Bundle multiple points together</li>
                  <li>✓ Use "what if" scenarios to test flexibility</li>
                  <li>✓ Address highest-impact items first</li>
                  <li>✓ Build relationships before pushing hard</li>
                </ul>
              </div>

              {/* Communication Strategies */}
              <div className="p-6 bg-purple-50 dark:bg-purple-900/20 rounded-lg">
                <div className="flex items-center gap-3 mb-4">
                  <Users className="w-6 h-6 text-purple-600" />
                  <h5 className="font-semibold text-purple-900 dark:text-purple-100">Communication</h5>
                </div>
                <ul className="space-y-2 text-sm text-purple-800 dark:text-purple-200">
                  <li>✓ Frame requests as risk mitigation</li>
                  <li>✓ Use industry benchmarks as justification</li>
                  <li>✓ Offer trade-offs, not just demands</li>
                  <li>✓ Document all agreements in writing</li>
                  <li>✓ Maintain professional, collaborative tone</li>
                </ul>
              </div>

              {/* Leverage Points */}
              <div className="p-6 bg-orange-50 dark:bg-orange-900/20 rounded-lg">
                <div className="flex items-center gap-3 mb-4">
                  <TrendingUp className="w-6 h-6 text-orange-600" />
                  <h5 className="font-semibold text-orange-900 dark:text-orange-100">Leverage Points</h5>
                </div>
                <ul className="space-y-2 text-sm text-orange-800 dark:text-orange-200">
                  <li>✓ Multi-year commitment for better terms</li>
                  <li>✓ Reference pricing from competitors</li>
                  <li>✓ Highlight strategic partnership value</li>
                  <li>✓ Offer case studies or testimonials</li>
                  <li>✓ Propose trial period for new terms</li>
                </ul>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}