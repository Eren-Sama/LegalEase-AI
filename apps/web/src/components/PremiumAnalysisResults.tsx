'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
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
  Target
} from 'lucide-react';

interface PremiumAnalysisResultsProps {
  results: any;
  onClose?: () => void;
}

const PremiumAnalysisResults: React.FC<PremiumAnalysisResultsProps> = ({
  results,
  onClose
}) => {
  if (!results) {
    return (
      <div className="p-8 text-center text-gray-600 dark:text-gray-400">
        No analysis results available
      </div>
    );
  }

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.3 }}
      className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 dark:from-gray-900 dark:to-gray-800"
    >
      <div className="p-8">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
            Premium Analysis Results
          </h1>
          {onClose && (
            <button
              onClick={onClose}
              className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
            >
              <X className="w-5 h-5 text-gray-500" />
            </button>
          )}
        </div>
        
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6">
          <p className="text-gray-600 dark:text-gray-400">
            Premium analysis features are being enhanced. Please use the Enhanced Analysis Results for now.
          </p>
        </div>
      </div>
    </motion.div>
  );
};

export default PremiumAnalysisResults;