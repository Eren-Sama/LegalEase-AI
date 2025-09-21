'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  BookOpen,
  Play,
  Pause,
  Volume2,
  VolumeX,
  ChevronRight,
  ChevronLeft,
  Award,
  Clock,
  Users,
  Star,
  CheckCircle,
  Lock,
  Unlock,
  FileText,
  Video,
  Headphones,
  HelpCircle,
  Trophy,
  Target,
  Lightbulb,
  Search,
  Filter,
  BarChart3,
  Book,
  GraduationCap,
  Bookmark,
  Download,
  Share2,
  MessageCircle
} from 'lucide-react';

interface LessonModule {
  id: string;
  title: string;
  description: string;
  duration: string;
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  category: 'contracts' | 'negotiation' | 'legal-terms' | 'compliance' | 'risk-management';
  type: 'video' | 'interactive' | 'reading' | 'quiz';
  isLocked: boolean;
  progress: number;
  rating: number;
  enrolledUsers: number;
  content: {
    videoUrl?: string;
    transcript?: string;
    keyPoints: string[];
    practicalExamples: string[];
    quiz?: {
      question: string;
      options: string[];
      correct: number;
      explanation: string;
    }[];
  };
}

interface CaseStudy {
  id: string;
  title: string;
  industry: string;
  scenario: string;
  challenge: string;
  solution: string;
  outcome: string;
  lessons: string[];
  difficulty: 'beginner' | 'intermediate' | 'advanced';
}

interface LegalGlossaryTerm {
  term: string;
  definition: string;
  example: string;
  relatedTerms: string[];
  category: string;
}

export default function LegalLiteracyModule() {
  const [activeTab, setActiveTab] = useState<'modules' | 'cases' | 'glossary' | 'progress'>('modules');
  const [selectedModule, setSelectedModule] = useState<LessonModule | null>(null);
  const [selectedCase, setSelectedCase] = useState<CaseStudy | null>(null);
  const [currentQuiz, setCurrentQuiz] = useState(0);
  const [quizAnswers, setQuizAnswers] = useState<{[key: number]: number}>({});
  const [searchTerm, setSearchTerm] = useState('');
  const [filterCategory, setFilterCategory] = useState<string>('all');
  const [filterDifficulty, setFilterDifficulty] = useState<string>('all');
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [userProgress, setUserProgress] = useState({
    completedModules: 5,
    totalModules: 12,
    certificationsEarned: 2,
    hoursStudied: 25
  });

  const lessonModules: LessonModule[] = [
    {
      id: 'module-1',
      title: 'Contract Fundamentals',
      description: 'Learn the basic elements of any contract and how to identify key components',
      duration: '15 min',
      difficulty: 'beginner',
      category: 'contracts',
      type: 'video',
      isLocked: false,
      progress: 100,
      rating: 4.8,
      enrolledUsers: 1250,
      content: {
        videoUrl: '/videos/contract-fundamentals.mp4',
        keyPoints: [
          'Essential elements of a valid contract',
          'Offer, acceptance, and consideration',
          'Legal capacity and lawful purpose',
          'Common contract types and structures'
        ],
        practicalExamples: [
          'Employment contract breakdown',
          'Service agreement analysis',
          'Sales contract components'
        ],
        quiz: [
          {
            question: 'What are the four essential elements of a valid contract?',
            options: [
              'Offer, acceptance, consideration, legal capacity',
              'Price, duration, parties, signatures',
              'Terms, conditions, penalties, rewards',
              'Introduction, body, conclusion, appendix'
            ],
            correct: 0,
            explanation: 'A valid contract requires: 1) Offer, 2) Acceptance, 3) Consideration (something of value exchanged), and 4) Legal capacity (parties able to enter contracts).'
          }
        ]
      }
    },
    {
      id: 'module-2',
      title: 'Understanding Risk in Contracts',
      description: 'Identify and assess different types of risks in contractual agreements',
      duration: '20 min',
      difficulty: 'intermediate',
      category: 'risk-management',
      type: 'interactive',
      isLocked: false,
      progress: 75,
      rating: 4.6,
      enrolledUsers: 980,
      content: {
        keyPoints: [
          'Financial risks and liability exposure',
          'Operational risks and performance issues',
          'Legal and compliance risks',
          'Reputational and relationship risks'
        ],
        practicalExamples: [
          'Liability cap negotiations',
          'Insurance requirement analysis',
          'Indemnification clause review'
        ],
        quiz: [
          {
            question: 'What is the primary purpose of a liability limitation clause?',
            options: [
              'To increase contract value',
              'To reduce financial exposure in case of damages',
              'To extend contract duration',
              'To add more parties to the contract'
            ],
            correct: 1,
            explanation: 'Liability limitation clauses are designed to cap the amount of financial exposure a party faces if they are found responsible for damages or losses.'
          }
        ]
      }
    },
    {
      id: 'module-3',
      title: 'Negotiation Strategies & Tactics',
      description: 'Master the art of contract negotiation with proven techniques',
      duration: '25 min',
      difficulty: 'advanced',
      category: 'negotiation',
      type: 'video',
      isLocked: false,
      progress: 0,
      rating: 4.9,
      enrolledUsers: 750,
      content: {
        keyPoints: [
          'Preparation and research strategies',
          'Win-win negotiation techniques',
          'Handling difficult clauses and terms',
          'Closing and finalizing agreements'
        ],
        practicalExamples: [
          'Payment terms negotiation',
          'Scope change discussions',
          'Penalty clause modifications'
        ],
        quiz: [
          {
            question: 'What is BATNA in negotiation?',
            options: [
              'Best Alternative To a Negotiated Agreement',
              'Basic Agreement Terms and Negotiations Arrangement',
              'Bilateral Agreement for Trading and Commercial Activities',
              'Business Analytics for Trading and Network Agreements'
            ],
            correct: 0,
            explanation: 'BATNA stands for Best Alternative To a Negotiated Agreement - it\'s your backup plan if negotiations fail.'
          }
        ]
      }
    },
    {
      id: 'module-4',
      title: 'Legal Terminology Mastery',
      description: 'Decode complex legal language and understand key terms',
      duration: '18 min',
      difficulty: 'beginner',
      category: 'legal-terms',
      type: 'reading',
      isLocked: true,
      progress: 0,
      rating: 4.7,
      enrolledUsers: 1100,
      content: {
        keyPoints: [
          'Common legal terms and phrases',
          'Latin phrases in legal documents',
          'Industry-specific terminology',
          'How to research unfamiliar terms'
        ],
        practicalExamples: [
          'Force majeure clause explanation',
          'Indemnification vs. hold harmless',
          'Liquidated damages interpretation'
        ]
      }
    }
  ];

  const caseStudies: CaseStudy[] = [
    {
      id: 'case-1',
      title: 'The Million-Dollar Penalty Clause',
      industry: 'Technology',
      scenario: 'A startup signed a cloud services contract with automatic renewal and high penalty fees.',
      challenge: 'The company faced $1M in penalties when trying to switch providers after rapid growth.',
      solution: 'Negotiated a graduated penalty structure and obtained legal counsel for contract review.',
      outcome: 'Reduced penalties by 80% and implemented better contract review processes.',
      lessons: [
        'Always review auto-renewal clauses carefully',
        'Negotiate penalty caps as percentage of contract value',
        'Include growth provisions in technology contracts',
        'Establish legal review process for all contracts over $100K'
      ],
      difficulty: 'intermediate'
    },
    {
      id: 'case-2',
      title: 'Data Breach Liability Nightmare',
      industry: 'Healthcare',
      scenario: 'A healthcare provider\'s IT vendor experienced a data breach affecting patient records.',
      challenge: 'Unlimited liability clause made the healthcare provider responsible for all damages.',
      solution: 'Renegotiated existing contracts and implemented better security requirements.',
      outcome: 'Limited liability exposure and improved data security standards.',
      lessons: [
        'Cap liability for third-party vendors',
        'Include specific security requirements',
        'Require cyber insurance coverage',
        'Define incident response procedures'
      ],
      difficulty: 'advanced'
    },
    {
      id: 'case-3',
      title: 'The Scope Creep Disaster',
      industry: 'Manufacturing',
      scenario: 'A manufacturing company\'s ERP implementation project spiraled out of control.',
      challenge: 'Vague scope definitions led to unlimited additional costs and delays.',
      solution: 'Implemented strict change control processes and scope definitions.',
      outcome: 'Completed project 20% under revised budget with clear deliverables.',
      lessons: [
        'Define project scope in detail',
        'Establish change control procedures',
        'Set caps on additional work',
        'Include milestone-based payments'
      ],
      difficulty: 'beginner'
    }
  ];

  const glossaryTerms: LegalGlossaryTerm[] = [
    {
      term: 'Force Majeure',
      definition: 'A clause that releases parties from liability when extraordinary circumstances prevent contract fulfillment',
      example: 'During COVID-19, many contracts invoked force majeure clauses to excuse performance delays.',
      relatedTerms: ['Act of God', 'Impossibility', 'Frustration of Purpose'],
      category: 'Contract Terms'
    },
    {
      term: 'Indemnification',
      definition: 'A contractual obligation to compensate for harm, loss, or damage incurred by another party',
      example: 'The vendor agreed to indemnify the client against any third-party patent infringement claims.',
      relatedTerms: ['Hold Harmless', 'Liability', 'Insurance'],
      category: 'Risk Management'
    },
    {
      term: 'Liquidated Damages',
      definition: 'A predetermined amount of money specified in a contract as compensation for breach',
      example: 'The construction contract specified $1,000 per day in liquidated damages for delays.',
      relatedTerms: ['Penalty', 'Damages', 'Breach'],
      category: 'Remedies'
    }
  ];

  const filteredModules = lessonModules.filter(module => {
    const matchesSearch = module.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         module.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = filterCategory === 'all' || module.category === filterCategory;
    const matchesDifficulty = filterDifficulty === 'all' || module.difficulty === filterDifficulty;
    
    return matchesSearch && matchesCategory && matchesDifficulty;
  });

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'beginner': return 'text-green-600 bg-green-50';
      case 'intermediate': return 'text-yellow-600 bg-yellow-50';
      case 'advanced': return 'text-red-600 bg-red-50';
      default: return 'text-gray-600 bg-gray-50';
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'video': return Video;
      case 'interactive': return Target;
      case 'reading': return Book;
      case 'quiz': return HelpCircle;
      default: return BookOpen;
    }
  };

  return (
    <div className="w-full bg-white dark:bg-gray-800 rounded-xl shadow-lg">
      {/* Header */}
      <div className="p-6 border-b border-gray-200 dark:border-gray-700">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-purple-100 dark:bg-purple-900/20 rounded-full flex items-center justify-center">
              <GraduationCap className="w-5 h-5 text-purple-600" />
            </div>
            <div>
              <h3 className="text-xl font-bold text-gray-900 dark:text-white">Legal Literacy Academy</h3>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Interactive learning modules and case studies
              </p>
            </div>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="flex gap-4 border-b border-gray-200 dark:border-gray-700">
          {[
            { key: 'modules', label: 'Learning Modules', icon: BookOpen },
            { key: 'cases', label: 'Case Studies', icon: FileText },
            { key: 'glossary', label: 'Legal Glossary', icon: Book },
            { key: 'progress', label: 'My Progress', icon: BarChart3 }
          ].map(({ key, label, icon: Icon }) => (
            <button
              key={key}
              onClick={() => setActiveTab(key as any)}
              className={`flex items-center gap-2 px-4 py-2 border-b-2 transition-colors ${
                activeTab === key
                  ? 'border-purple-600 text-purple-600'
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
        {/* Learning Modules Tab */}
        {activeTab === 'modules' && (
          <div className="space-y-6">
            {/* Search and Filters */}
            <div className="flex gap-4 items-center">
              <div className="relative flex-1">
                <Search className="w-4 h-4 absolute left-3 top-3 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search modules..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                />
              </div>
              
              <select
                value={filterCategory}
                onChange={(e) => setFilterCategory(e.target.value)}
                className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg dark:bg-gray-700 dark:text-white"
              >
                <option value="all">All Categories</option>
                <option value="contracts">Contracts</option>
                <option value="negotiation">Negotiation</option>
                <option value="legal-terms">Legal Terms</option>
                <option value="compliance">Compliance</option>
                <option value="risk-management">Risk Management</option>
              </select>
              
              <select
                value={filterDifficulty}
                onChange={(e) => setFilterDifficulty(e.target.value)}
                className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg dark:bg-gray-700 dark:text-white"
              >
                <option value="all">All Levels</option>
                <option value="beginner">Beginner</option>
                <option value="intermediate">Intermediate</option>
                <option value="advanced">Advanced</option>
              </select>
            </div>

            {/* Module Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredModules.map((module) => {
                const TypeIcon = getTypeIcon(module.type);
                
                return (
                  <motion.div
                    key={module.id}
                    whileHover={{ scale: 1.02 }}
                    className="border border-gray-200 dark:border-gray-700 rounded-lg p-6 hover:shadow-lg transition-shadow relative"
                  >
                    {module.isLocked && (
                      <div className="absolute top-4 right-4">
                        <Lock className="w-5 h-5 text-gray-400" />
                      </div>
                    )}
                    
                    <div className="flex items-center gap-3 mb-4">
                      <div className="w-10 h-10 bg-purple-100 dark:bg-purple-900/20 rounded-full flex items-center justify-center">
                        <TypeIcon className="w-5 h-5 text-purple-600" />
                      </div>
                      <div className="flex-1">
                        <h4 className="font-semibold text-gray-900 dark:text-white">{module.title}</h4>
                        <div className="flex items-center gap-2 text-xs text-gray-500 dark:text-gray-400">
                          <Clock className="w-3 h-3" />
                          {module.duration}
                          <span>•</span>
                          <Users className="w-3 h-3" />
                          {module.enrolledUsers.toLocaleString()}
                        </div>
                      </div>
                    </div>
                    
                    <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
                      {module.description}
                    </p>
                    
                    <div className="flex items-center justify-between mb-4">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${getDifficultyColor(module.difficulty)}`}>
                        {module.difficulty.charAt(0).toUpperCase() + module.difficulty.slice(1)}
                      </span>
                      <div className="flex items-center gap-1">
                        <Star className="w-4 h-4 text-yellow-400 fill-current" />
                        <span className="text-sm text-gray-600 dark:text-gray-400">{module.rating}</span>
                      </div>
                    </div>
                    
                    {module.progress > 0 && (
                      <div className="mb-4">
                        <div className="flex justify-between text-xs text-gray-500 dark:text-gray-400 mb-1">
                          <span>Progress</span>
                          <span>{module.progress}%</span>
                        </div>
                        <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                          <div 
                            className="bg-purple-600 h-2 rounded-full transition-all duration-300"
                            style={{ width: `${module.progress}%` }}
                          ></div>
                        </div>
                      </div>
                    )}
                    
                    <button
                      onClick={() => setSelectedModule(module)}
                      disabled={module.isLocked}
                      className={`w-full py-2 px-4 rounded-lg text-sm font-medium transition-colors ${
                        module.isLocked
                          ? 'bg-gray-100 dark:bg-gray-700 text-gray-400 cursor-not-allowed'
                          : 'bg-purple-600 hover:bg-purple-700 text-white'
                      }`}
                    >
                      {module.isLocked ? 'Unlock with Premium' : 
                       module.progress > 0 ? 'Continue Learning' : 'Start Module'}
                    </button>
                  </motion.div>
                );
              })}
            </div>
          </div>
        )}

        {/* Case Studies Tab */}
        {activeTab === 'cases' && (
          <div className="space-y-6">
            <h4 className="text-lg font-semibold text-gray-900 dark:text-white">
              Real-World Case Studies
            </h4>
            
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {caseStudies.map((caseStudy) => (
                <motion.div
                  key={caseStudy.id}
                  whileHover={{ scale: 1.02 }}
                  className="border border-gray-200 dark:border-gray-700 rounded-lg p-6 hover:shadow-lg transition-shadow"
                >
                  <div className="flex items-start justify-between mb-4">
                    <h5 className="font-semibold text-gray-900 dark:text-white">{caseStudy.title}</h5>
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${getDifficultyColor(caseStudy.difficulty)}`}>
                      {caseStudy.difficulty}
                    </span>
                  </div>
                  
                  <div className="text-sm text-purple-600 dark:text-purple-400 mb-3">
                    Industry: {caseStudy.industry}
                  </div>
                  
                  <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
                    {caseStudy.scenario}
                  </p>
                  
                  <div className="space-y-3 text-sm">
                    <div>
                      <span className="font-medium text-red-600">Challenge:</span>
                      <p className="text-gray-600 dark:text-gray-400 mt-1">{caseStudy.challenge}</p>
                    </div>
                    
                    <div>
                      <span className="font-medium text-blue-600">Solution:</span>
                      <p className="text-gray-600 dark:text-gray-400 mt-1">{caseStudy.solution}</p>
                    </div>
                    
                    <div>
                      <span className="font-medium text-green-600">Outcome:</span>
                      <p className="text-gray-600 dark:text-gray-400 mt-1">{caseStudy.outcome}</p>
                    </div>
                  </div>
                  
                  <button
                    onClick={() => setSelectedCase(caseStudy)}
                    className="w-full mt-4 py-2 px-4 bg-purple-600 hover:bg-purple-700 text-white rounded-lg text-sm font-medium transition-colors"
                  >
                    Read Full Case Study
                  </button>
                </motion.div>
              ))}
            </div>
          </div>
        )}

        {/* Glossary Tab */}
        {activeTab === 'glossary' && (
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <h4 className="text-lg font-semibold text-gray-900 dark:text-white">
                Legal Terms Glossary
              </h4>
              <div className="relative">
                <Search className="w-4 h-4 absolute left-3 top-3 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search terms..."
                  className="pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                />
              </div>
            </div>
            
            <div className="grid grid-cols-1 gap-4">
              {glossaryTerms.map((term, index) => (
                <div
                  key={index}
                  className="border border-gray-200 dark:border-gray-700 rounded-lg p-6"
                >
                  <div className="flex justify-between items-start mb-3">
                    <h5 className="font-semibold text-purple-600 dark:text-purple-400 text-lg">
                      {term.term}
                    </h5>
                    <span className="px-2 py-1 bg-gray-100 dark:bg-gray-700 rounded-full text-xs text-gray-600 dark:text-gray-400">
                      {term.category}
                    </span>
                  </div>
                  
                  <p className="text-gray-700 dark:text-gray-300 mb-3">
                    {term.definition}
                  </p>
                  
                  <div className="mb-3">
                    <span className="font-medium text-sm text-gray-900 dark:text-white">Example:</span>
                    <p className="text-sm text-gray-600 dark:text-gray-400 italic mt-1">
                      {term.example}
                    </p>
                  </div>
                  
                  <div>
                    <span className="font-medium text-sm text-gray-900 dark:text-white">Related Terms:</span>
                    <div className="flex flex-wrap gap-2 mt-1">
                      {term.relatedTerms.map((relatedTerm, idx) => (
                        <span
                          key={idx}
                          className="px-2 py-1 bg-purple-50 dark:bg-purple-900/20 text-purple-700 dark:text-purple-300 rounded-full text-xs"
                        >
                          {relatedTerm}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Progress Tab */}
        {activeTab === 'progress' && (
          <div className="space-y-6">
            <h4 className="text-lg font-semibold text-gray-900 dark:text-white">
              Your Learning Progress
            </h4>
            
            {/* Progress Stats */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              <div className="text-center p-6 bg-gradient-to-r from-purple-50 to-pink-50 dark:from-purple-900/20 dark:to-pink-900/20 rounded-lg">
                <div className="w-12 h-12 bg-purple-600 rounded-full flex items-center justify-center mx-auto mb-3">
                  <BookOpen className="w-6 h-6 text-white" />
                </div>
                <div className="text-2xl font-bold text-purple-600 mb-1">
                  {userProgress.completedModules}/{userProgress.totalModules}
                </div>
                <div className="text-sm text-gray-600 dark:text-gray-400">Modules Completed</div>
              </div>
              
              <div className="text-center p-6 bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 rounded-lg">
                <div className="w-12 h-12 bg-blue-600 rounded-full flex items-center justify-center mx-auto mb-3">
                  <Clock className="w-6 h-6 text-white" />
                </div>
                <div className="text-2xl font-bold text-blue-600 mb-1">{userProgress.hoursStudied}</div>
                <div className="text-sm text-gray-600 dark:text-gray-400">Hours Studied</div>
              </div>
              
              <div className="text-center p-6 bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20 rounded-lg">
                <div className="w-12 h-12 bg-green-600 rounded-full flex items-center justify-center mx-auto mb-3">
                  <Trophy className="w-6 h-6 text-white" />
                </div>
                <div className="text-2xl font-bold text-green-600 mb-1">{userProgress.certificationsEarned}</div>
                <div className="text-sm text-gray-600 dark:text-gray-400">Certifications Earned</div>
              </div>
              
              <div className="text-center p-6 bg-gradient-to-r from-orange-50 to-red-50 dark:from-orange-900/20 dark:to-red-900/20 rounded-lg">
                <div className="w-12 h-12 bg-orange-600 rounded-full flex items-center justify-center mx-auto mb-3">
                  <Target className="w-6 h-6 text-white" />
                </div>
                <div className="text-2xl font-bold text-orange-600 mb-1">
                  {Math.round((userProgress.completedModules / userProgress.totalModules) * 100)}%
                </div>
                <div className="text-sm text-gray-600 dark:text-gray-400">Overall Progress</div>
              </div>
            </div>
            
            {/* Achievement Badges */}
            <div>
              <h5 className="font-semibold text-gray-900 dark:text-white mb-4">Your Achievements</h5>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {[
                  { title: 'Contract Expert', description: 'Completed all contract modules', earned: true },
                  { title: 'Risk Master', description: 'Mastered risk management', earned: true },
                  { title: 'Negotiation Pro', description: 'Advanced negotiation skills', earned: false },
                  { title: 'Legal Scholar', description: 'Completed 50+ hours of study', earned: false }
                ].map((badge, index) => (
                  <div
                    key={index}
                    className={`p-4 rounded-lg border-2 text-center ${
                      badge.earned
                        ? 'border-gold-300 bg-yellow-50 dark:bg-yellow-900/20'
                        : 'border-gray-200 bg-gray-50 dark:bg-gray-700/50 opacity-60'
                    }`}
                  >
                    <Award className={`w-8 h-8 mx-auto mb-2 ${
                      badge.earned ? 'text-yellow-500' : 'text-gray-400'
                    }`} />
                    <div className="font-medium text-sm text-gray-900 dark:text-white mb-1">
                      {badge.title}
                    </div>
                    <div className="text-xs text-gray-600 dark:text-gray-400">
                      {badge.description}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}