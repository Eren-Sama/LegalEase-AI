'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  FolderOpen,
  FileText,
  Lock,
  Unlock,
  Eye,
  Download,
  Share2,
  Trash2,
  Star,
  BookOpen,
  HelpCircle,
  Info,
  Lightbulb,
  GraduationCap,
  Search,
  Filter,
  Plus,
  Archive,
  Calendar,
  User,
  Shield,
  Award,
  Zap,
  Globe,
  Settings,
  MoreVertical,
  Tag,
  Clock,
  X
} from 'lucide-react';

interface DocumentVaultItem {
  id: string;
  name: string;
  type: 'contract' | 'agreement' | 'nda' | 'lease' | 'employment' | 'other';
  uploadDate: Date;
  lastAccessed: Date;
  size: number;
  isStarred: boolean;
  isSecure: boolean;
  analysisScore?: number;
  riskLevel: 'low' | 'medium' | 'high';
  tags: string[];
  description?: string;
  analysisResults?: any;
  educationalMode?: boolean;
}

interface LegalTerm {
  term: string;
  definition: string;
  category: 'general' | 'contract' | 'liability' | 'financial' | 'timeline';
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  examples?: string[];
  relatedTerms?: string[];
}

interface EducationalTooltip {
  id: string;
  text: string;
  explanation: string;
  category: string;
  position: { x: number; y: number };
}

interface DocumentVaultProps {
  documents?: DocumentVaultItem[];
  onDocumentSelect?: (document: DocumentVaultItem) => void;
  onDocumentDelete?: (documentId: string) => void;
  onDocumentShare?: (documentId: string) => void;
  educationalMode?: boolean;
  className?: string;
}

const DocumentVault: React.FC<DocumentVaultProps> = ({
  documents: propDocuments,
  onDocumentSelect,
  onDocumentDelete,
  onDocumentShare,
  educationalMode: globalEducationalMode = false,
  className = ''
}) => {
  const [documents, setDocuments] = useState<DocumentVaultItem[]>([]);
  const [filteredDocuments, setFilteredDocuments] = useState<DocumentVaultItem[]>([]);
  const [selectedDocument, setSelectedDocument] = useState<DocumentVaultItem | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState<'all' | string>('all');
  const [sortBy, setSortBy] = useState<'name' | 'date' | 'type' | 'risk'>('date');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [educationalMode, setEducationalMode] = useState(globalEducationalMode);
  const [activeTooltip, setActiveTooltip] = useState<EducationalTooltip | null>(null);
  const [showEducationalPanel, setShowEducationalPanel] = useState(false);

  // Mock legal terms database
  const legalTerms: LegalTerm[] = [
    {
      term: 'Force Majeure',
      definition: 'A contractual clause that frees parties from liability or obligation when extraordinary circumstances beyond their control prevent fulfillment of contract terms.',
      category: 'contract',
      difficulty: 'intermediate',
      examples: [
        'Natural disasters (earthquakes, floods)',
        'Acts of war or terrorism',
        'Government regulations or sanctions',
        'Global pandemics'
      ],
      relatedTerms: ['Act of God', 'Unforeseeable circumstances', 'Contract frustration']
    },
    {
      term: 'Liquidated Damages',
      definition: 'A predetermined amount of money that parties agree will be paid as compensation if one party breaches the contract.',
      category: 'liability',
      difficulty: 'intermediate',
      examples: [
        'Late delivery penalties in construction contracts',
        'Early termination fees in service agreements',
        'Non-compete violation penalties'
      ],
      relatedTerms: ['Penalty clause', 'Damages', 'Breach of contract']
    },
    {
      term: 'Indemnification',
      definition: 'A contractual agreement where one party agrees to compensate another party for certain damages, losses, or liabilities.',
      category: 'liability',
      difficulty: 'advanced',
      examples: [
        'Vendor indemnifying client against third-party lawsuits',
        'Contractor covering liability for work performed',
        'Software provider indemnifying against IP violations'
      ],
      relatedTerms: ['Hold harmless', 'Liability protection', 'Insurance']
    },
    {
      term: 'Consideration',
      definition: 'Something of value exchanged between parties to make a contract legally binding. Without consideration, a contract is generally unenforceable.',
      category: 'general',
      difficulty: 'beginner',
      examples: [
        'Money payment for services',
        'Exchange of goods',
        'Promise to perform specific actions',
        'Mutual promises between parties'
      ],
      relatedTerms: ['Contract formation', 'Legal obligation', 'Quid pro quo']
    }
  ];

  // Initialize with mock documents if none provided
  useEffect(() => {
    if (propDocuments) {
      setDocuments(propDocuments);
    } else {
      // Mock documents for demonstration
      const mockDocuments: DocumentVaultItem[] = [
        {
          id: 'doc-1',
          name: 'Service Agreement - TechCorp',
          type: 'agreement',
          uploadDate: new Date('2024-01-15'),
          lastAccessed: new Date('2024-02-01'),
          size: 245760, // bytes
          isStarred: true,
          isSecure: true,
          analysisScore: 87,
          riskLevel: 'low',
          tags: ['technology', 'services', 'annual'],
          description: 'Annual service agreement with TechCorp for software development services',
          educationalMode: true
        },
        {
          id: 'doc-2',
          name: 'Employment Contract - Jane Smith',
          type: 'employment',
          uploadDate: new Date('2024-02-10'),
          lastAccessed: new Date('2024-02-10'),
          size: 156420,
          isStarred: false,
          isSecure: true,
          analysisScore: 92,
          riskLevel: 'low',
          tags: ['hr', 'full-time', 'senior'],
          description: 'Senior developer employment contract with competitive package'
        },
        {
          id: 'doc-3',
          name: 'NDA - Client Confidential',
          type: 'nda',
          uploadDate: new Date('2024-01-20'),
          lastAccessed: new Date('2024-01-25'),
          size: 89340,
          isStarred: false,
          isSecure: true,
          analysisScore: 78,
          riskLevel: 'medium',
          tags: ['confidentiality', 'client'],
          description: 'Non-disclosure agreement for sensitive client project'
        },
        {
          id: 'doc-4',
          name: 'Office Lease Agreement',
          type: 'lease',
          uploadDate: new Date('2024-01-05'),
          lastAccessed: new Date('2024-01-30'),
          size: 334560,
          isStarred: true,
          isSecure: false,
          analysisScore: 65,
          riskLevel: 'high',
          tags: ['real-estate', '5-year', 'commercial'],
          description: 'Commercial office lease with renewal options'
        }
      ];
      setDocuments(mockDocuments);
    }
  }, [propDocuments]);

  // Filter and search documents
  useEffect(() => {
    let filtered = documents;

    // Apply search filter
    if (searchTerm) {
      filtered = filtered.filter(doc =>
        doc.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        doc.description?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        doc.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()))
      );
    }

    // Apply type filter
    if (filterType !== 'all') {
      filtered = filtered.filter(doc => doc.type === filterType);
    }

    // Apply sorting
    filtered.sort((a, b) => {
      switch (sortBy) {
        case 'name':
          return a.name.localeCompare(b.name);
        case 'date':
          return b.uploadDate.getTime() - a.uploadDate.getTime();
        case 'type':
          return a.type.localeCompare(b.type);
        case 'risk':
          const riskOrder = { low: 1, medium: 2, high: 3 };
          return riskOrder[b.riskLevel] - riskOrder[a.riskLevel];
        default:
          return 0;
      }
    });

    setFilteredDocuments(filtered);
  }, [documents, searchTerm, filterType, sortBy]);

  const getDocumentTypeIcon = (type: string) => {
    switch (type) {
      case 'contract': return FileText;
      case 'agreement': return FileText;
      case 'nda': return Lock;
      case 'lease': return FolderOpen;
      case 'employment': return User;
      default: return FileText;
    }
  };

  const getDocumentTypeColor = (type: string) => {
    switch (type) {
      case 'contract': return 'text-blue-600 bg-blue-50 border-blue-200';
      case 'agreement': return 'text-green-600 bg-green-50 border-green-200';
      case 'nda': return 'text-red-600 bg-red-50 border-red-200';
      case 'lease': return 'text-purple-600 bg-purple-50 border-purple-200';
      case 'employment': return 'text-orange-600 bg-orange-50 border-orange-200';
      default: return 'text-gray-600 bg-gray-50 border-gray-200';
    }
  };

  const getRiskColor = (risk: string) => {
    switch (risk) {
      case 'high': return 'text-red-600 bg-red-100';
      case 'medium': return 'text-yellow-600 bg-yellow-100';
      case 'low': return 'text-green-600 bg-green-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  const formatFileSize = (bytes: number) => {
    if (bytes < 1024) return bytes + ' B';
    if (bytes < 1024 * 1024) return Math.round(bytes / 1024) + ' KB';
    return Math.round(bytes / (1024 * 1024)) + ' MB';
  };

  const formatDate = (date: Date) => {
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const handleDocumentClick = (document: DocumentVaultItem) => {
    setSelectedDocument(document);
    if (onDocumentSelect) onDocumentSelect(document);
  };

  const toggleStar = (documentId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setDocuments(prev => prev.map(doc =>
      doc.id === documentId ? { ...doc, isStarred: !doc.isStarred } : doc
    ));
  };

  const showEducationalTooltip = (term: string, event: React.MouseEvent) => {
    const legalTerm = legalTerms.find(t => 
      term.toLowerCase().includes(t.term.toLowerCase())
    );
    
    if (legalTerm && educationalMode) {
      const rect = event.currentTarget.getBoundingClientRect();
      setActiveTooltip({
        id: `tooltip-${Date.now()}`,
        text: legalTerm.term,
        explanation: legalTerm.definition,
        category: legalTerm.category,
        position: { x: rect.left, y: rect.bottom + 10 }
      });
    }
  };

  const documentTypes = ['all', 'contract', 'agreement', 'nda', 'lease', 'employment', 'other'];

  return (
    <div className={`${className} relative`}>
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-gradient-to-r from-indigo-600 to-purple-700 text-white p-6 rounded-lg mb-6 shadow-lg"
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <div className="p-3 bg-white/20 rounded-lg">
              <Archive className="w-8 h-8" />
            </div>
            <div>
              <h1 className="text-2xl font-bold">Document Vault</h1>
              <p className="text-indigo-100 mt-1">
                Secure storage with intelligent organization and learning features
              </p>
            </div>
          </div>
          
          <div className="flex items-center space-x-3">
            <button
              onClick={() => setEducationalMode(!educationalMode)}
              className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-colors ${
                educationalMode 
                  ? 'bg-white/20 text-white' 
                  : 'bg-white/10 text-indigo-100 hover:bg-white/20'
              }`}
            >
              <GraduationCap className="w-4 h-4" />
              <span className="text-sm font-medium">
                {educationalMode ? 'Learning ON' : 'Learning OFF'}
              </span>
            </button>
            
            <button
              onClick={() => setShowEducationalPanel(!showEducationalPanel)}
              className="p-2 bg-white/10 hover:bg-white/20 rounded-lg transition-colors"
            >
              <BookOpen className="w-5 h-5" />
            </button>
          </div>
        </div>
      </motion.div>

      {/* Search and Filters */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-4 mb-6">
        <div className="flex flex-col lg:flex-row lg:items-center space-y-4 lg:space-y-0 lg:space-x-4">
          {/* Search */}
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search documents, tags, or descriptions..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
            />
          </div>
          
          {/* Filters */}
          <div className="flex items-center space-x-4">
            <select
              value={filterType}
              onChange={(e) => setFilterType(e.target.value)}
              className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-indigo-500 dark:bg-gray-700 dark:text-white"
            >
              {documentTypes.map(type => (
                <option key={type} value={type}>
                  {type.charAt(0).toUpperCase() + type.slice(1)}
                </option>
              ))}
            </select>
            
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as any)}
              className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-indigo-500 dark:bg-gray-700 dark:text-white"
            >
              <option value="date">Sort by Date</option>
              <option value="name">Sort by Name</option>
              <option value="type">Sort by Type</option>
              <option value="risk">Sort by Risk</option>
            </select>
            
            <div className="flex border border-gray-300 dark:border-gray-600 rounded-lg">
              <button
                onClick={() => setViewMode('grid')}
                className={`p-2 ${viewMode === 'grid' ? 'bg-indigo-100 text-indigo-600' : 'text-gray-500 hover:text-gray-700'}`}
              >
                <Archive className="w-4 h-4" />
              </button>
              <button
                onClick={() => setViewMode('list')}
                className={`p-2 ${viewMode === 'list' ? 'bg-indigo-100 text-indigo-600' : 'text-gray-500 hover:text-gray-700'}`}
              >
                <FileText className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
        
        {/* Stats */}
        <div className="flex items-center space-x-6 mt-4 text-sm text-gray-600 dark:text-gray-400">
          <span>{filteredDocuments.length} of {documents.length} documents</span>
          <span>{documents.filter(d => d.isStarred).length} starred</span>
          <span>{documents.filter(d => d.isSecure).length} secure</span>
        </div>
      </div>

      {/* Documents Grid/List */}
      <div className={`${viewMode === 'grid' ? 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6' : 'space-y-4'}`}>
        <AnimatePresence>
          {filteredDocuments.map((document, index) => {
            const IconComponent = getDocumentTypeIcon(document.type);
            
            return (
              <motion.div
                key={document.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ delay: index * 0.1 }}
                className="bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700 hover:shadow-xl transition-all cursor-pointer overflow-hidden"
                onClick={() => handleDocumentClick(document)}
              >
                <div className="p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div className={`p-3 rounded-lg border ${getDocumentTypeColor(document.type)}`}>
                      <IconComponent className="w-6 h-6" />
                    </div>
                    
                    <div className="flex items-center space-x-2">
                      {document.isSecure && (
                        <div className="p-1 bg-red-100 text-red-600 rounded">
                          <Lock className="w-4 h-4" />
                        </div>
                      )}
                      <button
                        onClick={(e) => toggleStar(document.id, e)}
                        className={`p-1 rounded transition-colors ${
                          document.isStarred 
                            ? 'text-yellow-500 hover:text-yellow-600' 
                            : 'text-gray-400 hover:text-yellow-500'
                        }`}
                      >
                        <Star className={`w-4 h-4 ${document.isStarred ? 'fill-current' : ''}`} />
                      </button>
                    </div>
                  </div>
                  
                  <h3 className="font-semibold text-gray-900 dark:text-white mb-2 line-clamp-2">
                    {document.name}
                  </h3>
                  
                  {document.description && (
                    <p className="text-sm text-gray-600 dark:text-gray-400 mb-3 line-clamp-2">
                      {document.description}
                    </p>
                  )}
                  
                  <div className="flex items-center justify-between mb-3">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium border ${getRiskColor(document.riskLevel)}`}>
                      {document.riskLevel.toUpperCase()} RISK
                    </span>
                    
                    {document.analysisScore && (
                      <div className="flex items-center space-x-1">
                        <Award className="w-4 h-4 text-indigo-500" />
                        <span className="text-sm font-medium text-indigo-600">
                          {document.analysisScore}%
                        </span>
                      </div>
                    )}
                  </div>
                  
                  <div className="flex items-center text-xs text-gray-500 dark:text-gray-400 mb-3">
                    <Calendar className="w-3 h-3 mr-1" />
                    <span>{formatDate(document.uploadDate)}</span>
                    <span className="mx-2">•</span>
                    <span>{formatFileSize(document.size)}</span>
                  </div>
                  
                  {/* Tags */}
                  <div className="flex flex-wrap gap-1 mb-4">
                    {document.tags.slice(0, 3).map((tag, idx) => (
                      <span
                        key={idx}
                        className="px-2 py-1 bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 rounded text-xs"
                        onMouseEnter={(e) => educationalMode && showEducationalTooltip(tag, e)}
                        onMouseLeave={() => setActiveTooltip(null)}
                      >
                        {tag}
                      </span>
                    ))}
                    {document.tags.length > 3 && (
                      <span className="px-2 py-1 bg-gray-100 dark:bg-gray-700 text-gray-500 rounded text-xs">
                        +{document.tags.length - 3}
                      </span>
                    )}
                  </div>
                  
                  {/* Actions */}
                  <div className="flex items-center space-x-2">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleDocumentClick(document);
                      }}
                      className="flex items-center space-x-1 px-3 py-1 bg-indigo-100 text-indigo-600 rounded hover:bg-indigo-200 transition-colors text-sm"
                    >
                      <Eye className="w-3 h-3" />
                      <span>View</span>
                    </button>
                    
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        if (onDocumentShare) onDocumentShare(document.id);
                      }}
                      className="p-1 text-gray-400 hover:text-gray-600 transition-colors"
                    >
                      <Share2 className="w-4 h-4" />
                    </button>
                    
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        // Download functionality
                      }}
                      className="p-1 text-gray-400 hover:text-gray-600 transition-colors"
                    >
                      <Download className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </AnimatePresence>
      </div>

      {/* Empty State */}
      {filteredDocuments.length === 0 && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-center py-12"
        >
          <Archive className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
            {searchTerm || filterType !== 'all' ? 'No documents match your filters' : 'No documents yet'}
          </h3>
          <p className="text-gray-600 dark:text-gray-400">
            {searchTerm || filterType !== 'all' 
              ? 'Try adjusting your search or filters to find what you\'re looking for.'
              : 'Upload your first document to get started with AI-powered analysis.'
            }
          </p>
        </motion.div>
      )}

      {/* Educational Tooltip */}
      {activeTooltip && educationalMode && (
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.9 }}
          className="fixed z-50 bg-white dark:bg-gray-800 rounded-lg shadow-xl border border-gray-200 dark:border-gray-700 p-4 max-w-xs"
          style={{
            left: activeTooltip.position.x,
            top: activeTooltip.position.y
          }}
        >
          <div className="flex items-start space-x-2">
            <Lightbulb className="w-4 h-4 text-yellow-500 flex-shrink-0 mt-0.5" />
            <div>
              <h4 className="font-semibold text-gray-900 dark:text-white text-sm">
                {activeTooltip.text}
              </h4>
              <p className="text-xs text-gray-600 dark:text-gray-400 mt-1">
                {activeTooltip.explanation}
              </p>
            </div>
          </div>
        </motion.div>
      )}

      {/* Educational Panel */}
      <AnimatePresence>
        {showEducationalPanel && (
          <motion.div
            initial={{ opacity: 0, x: 300 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 300 }}
            className="fixed right-0 top-0 h-full w-80 bg-white dark:bg-gray-800 shadow-xl border-l border-gray-200 dark:border-gray-700 z-40 overflow-y-auto"
          >
            <div className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white flex items-center">
                  <BookOpen className="w-5 h-5 mr-2 text-indigo-500" />
                  Legal Terms Guide
                </h3>
                <button
                  onClick={() => setShowEducationalPanel(false)}
                  className="p-1 hover:bg-gray-100 dark:hover:bg-gray-700 rounded"
                >
                  <X className="w-4 h-4 text-gray-500" />
                </button>
              </div>
              
              <div className="space-y-4">
                {legalTerms.map((term, index) => (
                  <div key={index} className="p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
                    <div className="flex items-center justify-between mb-2">
                      <h4 className="font-medium text-gray-900 dark:text-white">
                        {term.term}
                      </h4>
                      <span className={`px-2 py-1 rounded text-xs ${
                        term.difficulty === 'beginner' ? 'bg-green-100 text-green-800' :
                        term.difficulty === 'intermediate' ? 'bg-yellow-100 text-yellow-800' :
                        'bg-red-100 text-red-800'
                      }`}>
                        {term.difficulty}
                      </span>
                    </div>
                    <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">
                      {term.definition}
                    </p>
                    {term.examples && (
                      <div className="mb-2">
                        <p className="text-xs font-medium text-gray-700 dark:text-gray-300 mb-1">Examples:</p>
                        <ul className="text-xs text-gray-600 dark:text-gray-400 space-y-1">
                          {term.examples.slice(0, 2).map((example, idx) => (
                            <li key={idx} className="flex items-start">
                              <span className="mr-1">•</span>
                              <span>{example}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default DocumentVault;