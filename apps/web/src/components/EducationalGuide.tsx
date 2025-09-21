'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  BookOpen,
  GraduationCap,
  Lightbulb,
  HelpCircle,
  ChevronRight,
  ChevronDown,
  Search,
  Star,
  Award,
  Clock,
  Users,
  Shield,
  DollarSign,
  Scale,
  FileText,
  AlertTriangle,
  Info,
  Zap,
  Target,
  Brain,
  Eye,
  CheckCircle
} from 'lucide-react';

interface LegalConcept {
  id: string;
  title: string;
  category: 'contracts' | 'liability' | 'financial' | 'compliance' | 'negotiations';
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  description: string;
  keyPoints: string[];
  examples: string[];
  relatedConcepts: string[];
  practicalTips: string[];
  commonMistakes: string[];
  estimatedReadTime: number;
  isCompleted?: boolean;
}

interface EducationalGuideProps {
  className?: string;
  onConceptComplete?: (conceptId: string) => void;
  completedConcepts?: string[];
}

const EducationalGuide: React.FC<EducationalGuideProps> = ({
  className = '',
  onConceptComplete,
  completedConcepts = []
}) => {
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [expandedConcept, setExpandedConcept] = useState<string | null>(null);
  const [currentView, setCurrentView] = useState<'overview' | 'concept'>('overview');

  // Comprehensive legal concepts database
  const legalConcepts: LegalConcept[] = [
    {
      id: 'force-majeure',
      title: 'Force Majeure Clauses',
      category: 'contracts',
      difficulty: 'intermediate',
      description: 'Understanding how extraordinary circumstances can affect contractual obligations and protect parties from liability.',
      keyPoints: [
        'Protects parties from liability due to unforeseeable events',
        'Must be specifically defined in the contract',
        'Often includes natural disasters, war, government actions',
        'May suspend or terminate contractual obligations'
      ],
      examples: [
        'COVID-19 pandemic affecting business operations',
        'Natural disasters preventing delivery of goods',
        'Government sanctions blocking international trade',
        'Cyber attacks on critical infrastructure'
      ],
      relatedConcepts: ['contract-frustration', 'impossibility', 'commercial-impracticability'],
      practicalTips: [
        'Define force majeure events clearly and comprehensively',
        'Include notice requirements and mitigation efforts',
        'Consider pandemic clauses in post-COVID contracts',
        'Review insurance coverage for force majeure events'
      ],
      commonMistakes: [
        'Using vague or overly broad definitions',
        'Failing to include notice requirements',
        'Not considering partial performance scenarios',
        'Overlooking mitigation obligations'
      ],
      estimatedReadTime: 8
    },
    {
      id: 'indemnification',
      title: 'Indemnification & Hold Harmless',
      category: 'liability',
      difficulty: 'advanced',
      description: 'Learn how parties can shift risk and protect themselves from third-party claims and losses.',
      keyPoints: [
        'One party agrees to compensate another for losses',
        'Can be mutual or one-way indemnification',
        'Often includes defense obligations',
        'May have caps or exclusions for certain damages'
      ],
      examples: [
        'Software vendor indemnifying against IP infringement claims',
        'Contractor indemnifying property owner for work-related accidents',
        'Service provider covering data breach liabilities',
        'Manufacturer indemnifying retailer for product defects'
      ],
      relatedConcepts: ['insurance', 'limitation-of-liability', 'damages'],
      practicalTips: [
        'Clearly define what losses are covered',
        'Include reasonable caps on indemnity obligations',
        'Consider insurance requirements to back indemnity',
        'Negotiate control over defense of claims'
      ],
      commonMistakes: [
        'Unlimited indemnity exposure',
        'Failing to exclude certain types of damages',
        'Not coordinating with insurance coverage',
        'Unclear trigger events for indemnification'
      ],
      estimatedReadTime: 12
    },
    {
      id: 'liquidated-damages',
      title: 'Liquidated Damages vs. Penalties',
      category: 'financial',
      difficulty: 'intermediate',
      description: 'Understanding predetermined damages clauses and ensuring they are enforceable rather than punitive.',
      keyPoints: [
        'Pre-agreed compensation for specific breaches',
        'Must represent reasonable estimate of actual damages',
        'Cannot be punitive in nature',
        'Provides certainty and avoids litigation costs'
      ],
      examples: [
        'Late delivery penalties in construction contracts',
        'Early termination fees for service agreements',
        'Non-compete violation damages in employment',
        'Data breach notification delay penalties'
      ],
      relatedConcepts: ['actual-damages', 'penalties', 'contract-remedies'],
      practicalTips: [
        'Base amounts on reasonable damage estimates',
        'Document the calculation methodology',
        'Consider graduated scales for different delays',
        'Review enforceability in relevant jurisdictions'
      ],
      commonMistakes: [
        'Setting amounts that are clearly punitive',
        'Using one-size-fits-all damage amounts',
        'Failing to consider actual harm calculation',
        'Not updating amounts over contract life'
      ],
      estimatedReadTime: 10
    },
    {
      id: 'confidentiality',
      title: 'Confidentiality & Trade Secrets',
      category: 'compliance',
      difficulty: 'beginner',
      description: 'Protecting sensitive business information through proper confidentiality agreements and practices.',
      keyPoints: [
        'Defines what information is confidential',
        'Establishes obligations for handling confidential data',
        'Sets duration of confidentiality obligations',
        'Includes exceptions for publicly known information'
      ],
      examples: [
        'Customer lists and pricing information',
        'Proprietary software algorithms',
        'Manufacturing processes and formulas',
        'Strategic business plans and forecasts'
      ],
      relatedConcepts: ['trade-secrets', 'intellectual-property', 'data-protection'],
      practicalTips: [
        'Clearly mark confidential documents',
        'Limit access to need-to-know basis',
        'Include return or destruction obligations',
        'Consider jurisdiction-specific requirements'
      ],
      commonMistakes: [
        'Overly broad confidentiality definitions',
        'Perpetual confidentiality terms',
        'Failing to mark documents as confidential',
        'Not considering employee mobility'
      ],
      estimatedReadTime: 6
    },
    {
      id: 'negotiation-tactics',
      title: 'Contract Negotiation Strategies',
      category: 'negotiations',
      difficulty: 'intermediate',
      description: 'Effective approaches to negotiate better contract terms and create win-win agreements.',
      keyPoints: [
        'Preparation and research are crucial',
        'Understand counterparty\'s priorities',
        'Focus on interests, not positions',
        'Create value before claiming value'
      ],
      examples: [
        'Trading payment terms for volume commitments',
        'Offering warranties in exchange for higher prices',
        'Providing exclusivity for guaranteed minimums',
        'Accepting liability caps for service level commitments'
      ],
      relatedConcepts: ['batna', 'value-creation', 'risk-allocation'],
      practicalTips: [
        'Prepare multiple scenarios and alternatives',
        'Listen actively to understand underlying needs',
        'Use objective criteria for disputed issues',
        'Document agreements and next steps clearly'
      ],
      commonMistakes: [
        'Focusing only on price negotiations',
        'Making unnecessary concessions early',
        'Failing to prepare for common objections',
        'Not building rapport with counterparty'
      ],
      estimatedReadTime: 14
    }
  ];

  const categories = [
    { id: 'all', name: 'All Topics', icon: BookOpen, color: 'text-blue-600' },
    { id: 'contracts', name: 'Contracts', icon: FileText, color: 'text-green-600' },
    { id: 'liability', name: 'Liability', icon: Shield, color: 'text-red-600' },
    { id: 'financial', name: 'Financial', icon: DollarSign, color: 'text-yellow-600' },
    { id: 'compliance', name: 'Compliance', icon: Scale, color: 'text-purple-600' },
    { id: 'negotiations', name: 'Negotiations', icon: Users, color: 'text-indigo-600' }
  ];

  const difficultyColors = {
    beginner: 'bg-green-100 text-green-800 border-green-200',
    intermediate: 'bg-yellow-100 text-yellow-800 border-yellow-200',
    advanced: 'bg-red-100 text-red-800 border-red-200'
  };

  const filteredConcepts = legalConcepts.filter(concept => {
    const matchesCategory = selectedCategory === 'all' || concept.category === selectedCategory;
    const matchesSearch = searchTerm === '' || 
      concept.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      concept.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      concept.keyPoints.some(point => point.toLowerCase().includes(searchTerm.toLowerCase()));
    
    return matchesCategory && matchesSearch;
  });

  const getProgressStats = () => {
    const completed = legalConcepts.filter(c => completedConcepts.includes(c.id)).length;
    const total = legalConcepts.length;
    const percentage = total > 0 ? Math.round((completed / total) * 100) : 0;
    
    return { completed, total, percentage };
  };

  const handleConceptSelect = (concept: LegalConcept) => {
    setExpandedConcept(concept.id);
    setCurrentView('concept');
  };

  const handleMarkComplete = (conceptId: string) => {
    if (onConceptComplete) onConceptComplete(conceptId);
  };

  const stats = getProgressStats();

  return (
    <div className={`${className} bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700`}>
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-gradient-to-r from-blue-600 to-indigo-700 text-white p-6 rounded-t-xl"
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <div className="p-3 bg-white/20 rounded-lg">
              <GraduationCap className="w-8 h-8" />
            </div>
            <div>
              <h2 className="text-2xl font-bold">Legal Education Center</h2>
              <p className="text-blue-100 mt-1">
                Master essential legal concepts for better contract understanding
              </p>
            </div>
          </div>
          
          {currentView === 'concept' && (
            <button
              onClick={() => setCurrentView('overview')}
              className="flex items-center space-x-2 px-4 py-2 bg-white/20 rounded-lg hover:bg-white/30 transition-colors"
            >
              <ChevronRight className="w-4 h-4 rotate-180" />
              <span>Back to Overview</span>
            </button>
          )}
        </div>
        
        {/* Progress Bar */}
        <div className="mt-4">
          <div className="flex items-center justify-between text-sm text-blue-100 mb-2">
            <span>Learning Progress</span>
            <span>{stats.completed} of {stats.total} completed ({stats.percentage}%)</span>
          </div>
          <div className="w-full bg-white/20 rounded-full h-2">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${stats.percentage}%` }}
              className="bg-white rounded-full h-2 transition-all duration-500"
            />
          </div>
        </div>
      </motion.div>

      <div className="p-6">
        <AnimatePresence mode="wait">
          {currentView === 'overview' && (
            <motion.div
              key="overview"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              className="space-y-6"
            >
              {/* Search and Filters */}
              <div className="flex flex-col lg:flex-row lg:items-center space-y-4 lg:space-y-0 lg:space-x-4">
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Search legal concepts..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                  />
                </div>
              </div>

              {/* Category Filters */}
              <div className="flex flex-wrap gap-2">
                {categories.map(category => (
                  <button
                    key={category.id}
                    onClick={() => setSelectedCategory(category.id)}
                    className={`flex items-center space-x-2 px-4 py-2 rounded-full border transition-colors ${
                      selectedCategory === category.id
                        ? 'bg-blue-100 border-blue-300 text-blue-800'
                        : 'bg-gray-50 border-gray-200 text-gray-600 hover:bg-gray-100'
                    }`}
                  >
                    <category.icon className={`w-4 h-4 ${category.color}`} />
                    <span className="text-sm font-medium">{category.name}</span>
                  </button>
                ))}
              </div>

              {/* Concepts Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {filteredConcepts.map((concept, index) => {
                  const isCompleted = completedConcepts.includes(concept.id);
                  
                  return (
                    <motion.div
                      key={concept.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.1 }}
                      className="bg-gray-50 dark:bg-gray-700 rounded-lg p-6 hover:shadow-md transition-shadow cursor-pointer"
                      onClick={() => handleConceptSelect(concept)}
                    >
                      <div className="flex items-start justify-between mb-4">
                        <div className="flex-1">
                          <div className="flex items-center space-x-3 mb-2">
                            <h3 className="font-semibold text-gray-900 dark:text-white">
                              {concept.title}
                            </h3>
                            {isCompleted && (
                              <CheckCircle className="w-5 h-5 text-green-600" />
                            )}
                          </div>
                          <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">
                            {concept.description}
                          </p>
                        </div>
                      </div>
                      
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-3">
                          <span className={`px-2 py-1 rounded-full text-xs font-medium border ${difficultyColors[concept.difficulty]}`}>
                            {concept.difficulty}
                          </span>
                          <div className="flex items-center space-x-1 text-sm text-gray-500">
                            <Clock className="w-3 h-3" />
                            <span>{concept.estimatedReadTime}min</span>
                          </div>
                        </div>
                        
                        <ChevronRight className="w-4 h-4 text-gray-400" />
                      </div>
                    </motion.div>
                  );
                })}
              </div>

              {filteredConcepts.length === 0 && (
                <div className="text-center py-12">
                  <BookOpen className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                    No concepts match your search
                  </h3>
                  <p className="text-gray-600 dark:text-gray-400">
                    Try adjusting your search terms or category filter.
                  </p>
                </div>
              )}
            </motion.div>
          )}

          {currentView === 'concept' && expandedConcept && (
            <motion.div
              key="concept"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="space-y-8"
            >
              {(() => {
                const concept = legalConcepts.find(c => c.id === expandedConcept);
                if (!concept) return null;
                
                const isCompleted = completedConcepts.includes(concept.id);

                return (
                  <>
                    {/* Concept Header */}
                    <div className="border-b border-gray-200 dark:border-gray-600 pb-6">
                      <div className="flex items-center justify-between">
                        <div>
                          <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
                            {concept.title}
                          </h3>
                          <p className="text-gray-600 dark:text-gray-400 mb-4">
                            {concept.description}
                          </p>
                          <div className="flex items-center space-x-4">
                            <span className={`px-3 py-1 rounded-full text-sm font-medium border ${difficultyColors[concept.difficulty]}`}>
                              {concept.difficulty}
                            </span>
                            <div className="flex items-center space-x-1 text-sm text-gray-500">
                              <Clock className="w-4 h-4" />
                              <span>{concept.estimatedReadTime} min read</span>
                            </div>
                          </div>
                        </div>
                        
                        <button
                          onClick={() => handleMarkComplete(concept.id)}
                          className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                            isCompleted
                              ? 'bg-green-100 text-green-800 border border-green-300'
                              : 'bg-blue-600 text-white hover:bg-blue-700'
                          }`}
                        >
                          {isCompleted ? (
                            <div className="flex items-center space-x-2">
                              <CheckCircle className="w-4 h-4" />
                              <span>Completed</span>
                            </div>
                          ) : (
                            'Mark Complete'
                          )}
                        </button>
                      </div>
                    </div>

                    {/* Key Points */}
                    <div className="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-6">
                      <h4 className="font-semibold text-gray-900 dark:text-white mb-4 flex items-center">
                        <Lightbulb className="w-5 h-5 mr-2 text-blue-600" />
                        Key Points to Remember
                      </h4>
                      <ul className="space-y-2">
                        {concept.keyPoints.map((point, idx) => (
                          <li key={idx} className="flex items-start">
                            <CheckCircle className="w-4 h-4 text-green-600 mr-2 mt-0.5 flex-shrink-0" />
                            <span className="text-gray-700 dark:text-gray-300">{point}</span>
                          </li>
                        ))}
                      </ul>
                    </div>

                    {/* Examples */}
                    <div className="bg-green-50 dark:bg-green-900/20 rounded-lg p-6">
                      <h4 className="font-semibold text-gray-900 dark:text-white mb-4 flex items-center">
                        <Eye className="w-5 h-5 mr-2 text-green-600" />
                        Real-World Examples
                      </h4>
                      <div className="space-y-3">
                        {concept.examples.map((example, idx) => (
                          <div key={idx} className="flex items-start">
                            <div className="w-6 h-6 bg-green-200 text-green-800 rounded-full flex items-center justify-center text-sm font-medium mr-3 mt-0.5 flex-shrink-0">
                              {idx + 1}
                            </div>
                            <span className="text-gray-700 dark:text-gray-300">{example}</span>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Practical Tips */}
                    <div className="bg-yellow-50 dark:bg-yellow-900/20 rounded-lg p-6">
                      <h4 className="font-semibold text-gray-900 dark:text-white mb-4 flex items-center">
                        <Target className="w-5 h-5 mr-2 text-yellow-600" />
                        Practical Tips
                      </h4>
                      <ul className="space-y-2">
                        {concept.practicalTips.map((tip, idx) => (
                          <li key={idx} className="flex items-start">
                            <Zap className="w-4 h-4 text-yellow-600 mr-2 mt-0.5 flex-shrink-0" />
                            <span className="text-gray-700 dark:text-gray-300">{tip}</span>
                          </li>
                        ))}
                      </ul>
                    </div>

                    {/* Common Mistakes */}
                    <div className="bg-red-50 dark:bg-red-900/20 rounded-lg p-6">
                      <h4 className="font-semibold text-gray-900 dark:text-white mb-4 flex items-center">
                        <AlertTriangle className="w-5 h-5 mr-2 text-red-600" />
                        Common Mistakes to Avoid
                      </h4>
                      <ul className="space-y-2">
                        {concept.commonMistakes.map((mistake, idx) => (
                          <li key={idx} className="flex items-start">
                            <AlertTriangle className="w-4 h-4 text-red-600 mr-2 mt-0.5 flex-shrink-0" />
                            <span className="text-gray-700 dark:text-gray-300">{mistake}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </>
                );
              })()}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default EducationalGuide;