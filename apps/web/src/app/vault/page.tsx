'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import DocumentVault from '@/components/DocumentVault';
import EducationalGuide from '@/components/EducationalGuide';
import { 
  Archive,
  GraduationCap,
  FileText,
  TrendingUp,
  Users,
  BookOpen,
  Award,
  Clock,
  Star,
  Shield,
  Brain,
  Zap,
  Target,
  Calendar
} from 'lucide-react';

const VaultDashboard: React.FC = () => {
  const [activeView, setActiveView] = useState<'vault' | 'education' | 'both'>('both');
  const [completedConcepts, setCompletedConcepts] = useState<string[]>([]);

  const handleConceptComplete = (conceptId: string) => {
    if (!completedConcepts.includes(conceptId)) {
      setCompletedConcepts(prev => [...prev, conceptId]);
    }
  };

  const stats = {
    totalDocuments: 4,
    secureDocuments: 3,
    recentAnalyses: 12,
    completedConcepts: completedConcepts.length,
    totalConcepts: 5,
    learningProgress: Math.round((completedConcepts.length / 5) * 100)
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 p-6">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-8"
      >
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
              Document & Learning Center
            </h1>
            <p className="text-gray-600 dark:text-gray-400">
              Secure document management with intelligent legal education
            </p>
          </div>
          
          <div className="flex items-center space-x-2 bg-white dark:bg-gray-800 rounded-lg p-1 shadow-sm border border-gray-200 dark:border-gray-700">
            <button
              onClick={() => setActiveView('vault')}
              className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-colors ${
                activeView === 'vault' 
                  ? 'bg-blue-100 text-blue-700 shadow-sm' 
                  : 'text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white'
              }`}
            >
              <Archive className="w-4 h-4" />
              <span className="font-medium">Vault</span>
            </button>
            <button
              onClick={() => setActiveView('education')}
              className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-colors ${
                activeView === 'education' 
                  ? 'bg-green-100 text-green-700 shadow-sm' 
                  : 'text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white'
              }`}
            >
              <GraduationCap className="w-4 h-4" />
              <span className="font-medium">Learn</span>
            </button>
            <button
              onClick={() => setActiveView('both')}
              className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-colors ${
                activeView === 'both' 
                  ? 'bg-purple-100 text-purple-700 shadow-sm' 
                  : 'text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white'
              }`}
            >
              <Brain className="w-4 h-4" />
              <span className="font-medium">Both</span>
            </button>
          </div>
        </div>
      </motion.div>

      {/* Stats Overview */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8"
      >
        <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg border border-gray-200 dark:border-gray-700">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Total Documents</p>
              <p className="text-3xl font-bold text-gray-900 dark:text-white mt-1">{stats.totalDocuments}</p>
            </div>
            <div className="p-3 bg-blue-100 rounded-lg">
              <FileText className="w-6 h-6 text-blue-600" />
            </div>
          </div>
          <div className="mt-4 flex items-center">
            <Shield className="w-4 h-4 text-green-600 mr-2" />
            <span className="text-sm text-gray-600 dark:text-gray-400">
              {stats.secureDocuments} secure documents
            </span>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg border border-gray-200 dark:border-gray-700">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Learning Progress</p>
              <p className="text-3xl font-bold text-gray-900 dark:text-white mt-1">{stats.learningProgress}%</p>
            </div>
            <div className="p-3 bg-green-100 rounded-lg">
              <TrendingUp className="w-6 h-6 text-green-600" />
            </div>
          </div>
          <div className="mt-4 flex items-center">
            <Award className="w-4 h-4 text-yellow-600 mr-2" />
            <span className="text-sm text-gray-600 dark:text-gray-400">
              {stats.completedConcepts} of {stats.totalConcepts} concepts
            </span>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg border border-gray-200 dark:border-gray-700">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Recent Analyses</p>
              <p className="text-3xl font-bold text-gray-900 dark:text-white mt-1">{stats.recentAnalyses}</p>
            </div>
            <div className="p-3 bg-purple-100 rounded-lg">
              <Brain className="w-6 h-6 text-purple-600" />
            </div>
          </div>
          <div className="mt-4 flex items-center">
            <Clock className="w-4 h-4 text-blue-600 mr-2" />
            <span className="text-sm text-gray-600 dark:text-gray-400">
              Last 30 days
            </span>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg border border-gray-200 dark:border-gray-700">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Smart Features</p>
              <p className="text-3xl font-bold text-gray-900 dark:text-white mt-1">9</p>
            </div>
            <div className="p-3 bg-yellow-100 rounded-lg">
              <Zap className="w-6 h-6 text-yellow-600" />
            </div>
          </div>
          <div className="mt-4 flex items-center">
            <Target className="w-4 h-4 text-green-600 mr-2" />
            <span className="text-sm text-gray-600 dark:text-gray-400">
              AI-powered analysis
            </span>
          </div>
        </div>
      </motion.div>

      {/* Main Content Area */}
      <div className={`${activeView === 'both' ? 'grid grid-cols-1 xl:grid-cols-2 gap-8' : ''}`}>
        {(activeView === 'vault' || activeView === 'both') && (
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="space-y-6"
          >
            <DocumentVault 
              educationalMode={true}
              onDocumentSelect={(doc) => {
                console.log('Selected document:', doc);
              }}
              onDocumentShare={(docId) => {
                console.log('Share document:', docId);
              }}
              onDocumentDelete={(docId) => {
                console.log('Delete document:', docId);
              }}
            />
          </motion.div>
        )}

        {(activeView === 'education' || activeView === 'both') && (
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="space-y-6"
          >
            <EducationalGuide 
              onConceptComplete={handleConceptComplete}
              completedConcepts={completedConcepts}
            />
          </motion.div>
        )}
      </div>

      {/* Quick Actions */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mt-8 bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg border border-gray-200 dark:border-gray-700"
      >
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center">
          <Star className="w-5 h-5 mr-2 text-yellow-600" />
          Quick Actions
        </h3>
        
        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-6 gap-4">
          <button className="flex flex-col items-center p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg hover:bg-blue-100 dark:hover:bg-blue-900/40 transition-colors">
            <FileText className="w-8 h-8 text-blue-600 mb-2" />
            <span className="text-sm font-medium text-gray-900 dark:text-white">Upload Document</span>
          </button>
          
          <button className="flex flex-col items-center p-4 bg-green-50 dark:bg-green-900/20 rounded-lg hover:bg-green-100 dark:hover:bg-green-900/40 transition-colors">
            <Brain className="w-8 h-8 text-green-600 mb-2" />
            <span className="text-sm font-medium text-gray-900 dark:text-white">AI Analysis</span>
          </button>
          
          <button className="flex flex-col items-center p-4 bg-purple-50 dark:bg-purple-900/20 rounded-lg hover:bg-purple-100 dark:hover:bg-purple-900/40 transition-colors">
            <BookOpen className="w-8 h-8 text-purple-600 mb-2" />
            <span className="text-sm font-medium text-gray-900 dark:text-white">Learn Concepts</span>
          </button>
          
          <button className="flex flex-col items-center p-4 bg-yellow-50 dark:bg-yellow-900/20 rounded-lg hover:bg-yellow-100 dark:hover:bg-yellow-900/40 transition-colors">
            <Users className="w-8 h-8 text-yellow-600 mb-2" />
            <span className="text-sm font-medium text-gray-900 dark:text-white">Negotiate</span>
          </button>
          
          <button className="flex flex-col items-center p-4 bg-red-50 dark:bg-red-900/20 rounded-lg hover:bg-red-100 dark:hover:bg-red-900/40 transition-colors">
            <Shield className="w-8 h-8 text-red-600 mb-2" />
            <span className="text-sm font-medium text-gray-900 dark:text-white">Risk Assessment</span>
          </button>
          
          <button className="flex flex-col items-center p-4 bg-indigo-50 dark:bg-indigo-900/20 rounded-lg hover:bg-indigo-100 dark:hover:bg-indigo-900/40 transition-colors">
            <Archive className="w-8 h-8 text-indigo-600 mb-2" />
            <span className="text-sm font-medium text-gray-900 dark:text-white">Manage Vault</span>
          </button>
        </div>
      </motion.div>
    </div>
  );
};

export default VaultDashboard;