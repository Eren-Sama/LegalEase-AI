'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { Brain, FileText, Shield, CheckCircle, TrendingUp, Zap } from 'lucide-react';

interface AnalysisLoadingScreenProps {
  isVisible: boolean;
  fileName: string;
  currentStep: 'uploading' | 'processing' | 'analyzing' | 'finalizing' | 'complete';
  progress: number;
}

const AnalysisLoadingScreen: React.FC<AnalysisLoadingScreenProps> = ({
  isVisible,
  fileName,
  currentStep,
  progress
}) => {
  const steps = [
    { key: 'uploading', label: 'Uploading Document', icon: FileText },
    { key: 'processing', label: 'Processing Content', icon: Brain },
    { key: 'analyzing', label: 'AI Analysis', icon: Zap },
    { key: 'finalizing', label: 'Finalizing Results', icon: CheckCircle }
  ];

  if (!isVisible) return null;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center"
    >
      <motion.div
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.8, opacity: 0 }}
        className="bg-white dark:bg-gray-800 rounded-3xl shadow-2xl p-8 max-w-md w-full mx-4"
      >
        {/* Header */}
        <div className="text-center mb-8">
          <div className="w-20 h-20 bg-gradient-to-br from-blue-500/10 to-purple-500/10 rounded-2xl flex items-center justify-center mx-auto mb-4">
            <Brain className="w-10 h-10 text-blue-600 dark:text-blue-400 animate-pulse" />
          </div>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
            Analyzing Document
          </h2>
          <p className="text-gray-600 dark:text-gray-400 text-sm">
            {fileName}
          </p>
        </div>

        {/* Progress Bar */}
        <div className="mb-8">
          <div className="flex justify-between items-center mb-2">
            <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
              Progress
            </span>
            <span className="text-sm font-medium text-blue-600 dark:text-blue-400">
              {progress}%
            </span>
          </div>
          <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-3">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${progress}%` }}
              transition={{ duration: 0.5, ease: "easeInOut" }}
              className="bg-gradient-to-r from-blue-500 to-purple-600 h-3 rounded-full"
            />
          </div>
        </div>

        {/* Steps */}
        <div className="space-y-4">
          {steps.map((step, index) => {
            const isActive = currentStep === step.key;
            const isCompleted = steps.findIndex(s => s.key === currentStep) > index;
            const Icon = step.icon;

            return (
              <motion.div
                key={step.key}
                className={`flex items-center space-x-3 p-3 rounded-lg transition-all ${
                  isActive 
                    ? 'bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800' 
                    : isCompleted
                    ? 'bg-green-50 dark:bg-green-900/20'
                    : 'bg-gray-50 dark:bg-gray-700/50'
                }`}
                initial={{ opacity: 0.5 }}
                animate={{ 
                  opacity: isActive || isCompleted ? 1 : 0.5,
                  scale: isActive ? 1.02 : 1
                }}
              >
                <div className={`p-2 rounded-full ${
                  isCompleted 
                    ? 'bg-green-500' 
                    : isActive 
                    ? 'bg-blue-500' 
                    : 'bg-gray-300 dark:bg-gray-600'
                }`}>
                  {isCompleted ? (
                    <CheckCircle className="w-4 h-4 text-white" />
                  ) : (
                    <Icon className={`w-4 h-4 ${
                      isActive ? 'text-white animate-pulse' : 'text-gray-400'
                    }`} />
                  )}
                </div>
                <span className={`font-medium ${
                  isActive 
                    ? 'text-blue-700 dark:text-blue-300' 
                    : isCompleted
                    ? 'text-green-700 dark:text-green-300'
                    : 'text-gray-500 dark:text-gray-400'
                }`}>
                  {step.label}
                </span>
                {isActive && (
                  <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                    className="ml-auto"
                  >
                    <div className="w-4 h-4 border-2 border-blue-500 border-t-transparent rounded-full" />
                  </motion.div>
                )}
              </motion.div>
            );
          })}
        </div>

        {/* Fun Facts or Tips */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1 }}
          className="mt-8 p-4 bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-900/10 dark:to-purple-900/10 rounded-lg"
        >
          <div className="flex items-start space-x-3">
            <Shield className="w-5 h-5 text-blue-600 dark:text-blue-400 mt-0.5" />
            <div>
              <h4 className="font-medium text-gray-900 dark:text-white text-sm">
                AI-Powered Analysis
              </h4>
              <p className="text-gray-600 dark:text-gray-400 text-xs mt-1">
                Our advanced AI reviews every clause, identifies risks, and provides recommendations based on legal best practices.
              </p>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </motion.div>
  );
};

export default AnalysisLoadingScreen;