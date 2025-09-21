'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Zap, 
  MessageCircle, 
  BookOpen, 
  Clock,
  Sparkles,
  Target,
  CheckCircle,
  ArrowRight
} from 'lucide-react';

interface AnalysisModeProps {
  onModeSelect: (mode: string) => void;
  selectedMode: string;
  className?: string;
}

const AnalysisModeSelector: React.FC<AnalysisModeProps> = ({ 
  onModeSelect, 
  selectedMode, 
  className = '' 
}) => {
  const [hoveredMode, setHoveredMode] = useState<string | null>(null);

  const modes = [
    {
      id: '30s',
      name: '30-Second Brief',
      subtitle: 'Quick Executive Summary',
      icon: Zap,
      color: 'from-green-400 to-green-600',
      description: 'Get the essential points in under 30 seconds. Perfect for busy executives who need the key facts fast.',
      features: [
        'Document type identification',
        'Key parties involved',
        'Main obligations overview',
        'Critical risks highlighted'
      ],
      timing: '~30 seconds',
      useCase: 'Initial review, time-sensitive decisions'
    },
    {
      id: 'plain',
      name: 'Plain English',
      subtitle: 'Simple & Clear Explanation',
      icon: MessageCircle,
      color: 'from-blue-400 to-blue-600',
      description: 'Legal jargon translated into everyday language. Understand your document without a law degree.',
      features: [
        'Jargon-free explanations',
        'Practical implications',
        'Real-world examples',
        'Easy-to-understand summaries'
      ],
      timing: '~2 minutes',
      useCase: 'Personal contracts, first-time legal documents'
    },
    {
      id: 'deep',
      name: 'Professional Deep Dive',
      subtitle: 'Comprehensive Legal Analysis',
      icon: BookOpen,
      color: 'from-purple-400 to-purple-600',
      description: 'Complete professional analysis with detailed insights, risk assessments, and actionable recommendations.',
      features: [
        'Detailed clause analysis',
        'Comprehensive risk assessment',
        'Financial breakdown',
        'Compliance requirements',
        'Timeline analysis',
        'Actionable recommendations'
      ],
      timing: '~5 minutes',
      useCase: 'Business contracts, legal reviews, due diligence'
    }
  ];

  return (
    <div className={`space-y-6 ${className}`}>
      {/* Header */}
      <div className="text-center">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Choose Your Analysis Mode</h2>
        <p className="text-gray-600">Select how you'd like to analyze your document</p>
      </div>

      {/* Mode Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {modes.map((mode) => {
          const isSelected = selectedMode === mode.id;
          const isHovered = hoveredMode === mode.id;
          
          return (
            <motion.div
              key={mode.id}
              layoutId={mode.id}
              onClick={() => onModeSelect(mode.id)}
              onMouseEnter={() => setHoveredMode(mode.id)}
              onMouseLeave={() => setHoveredMode(null)}
              className={`relative cursor-pointer rounded-2xl overflow-hidden transition-all duration-300 ${
                isSelected 
                  ? 'ring-2 ring-blue-500 shadow-2xl' 
                  : 'hover:shadow-xl shadow-lg'
              }`}
              whileHover={{ y: -4 }}
              whileTap={{ scale: 0.98 }}
            >
              {/* Background Gradient */}
              <div className={`absolute inset-0 bg-gradient-to-br ${mode.color} opacity-10`} />
              
              {/* Content */}
              <div className="relative bg-white p-6 h-full">
                {/* Header */}
                <div className="flex items-center justify-between mb-4">
                  <div className={`w-12 h-12 rounded-full bg-gradient-to-r ${mode.color} flex items-center justify-center`}>
                    <mode.icon className="w-6 h-6 text-white" />
                  </div>
                  {isSelected && (
                    <motion.div
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      className="w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center"
                    >
                      <CheckCircle className="w-4 h-4 text-white" />
                    </motion.div>
                  )}
                </div>

                <h3 className="text-xl font-bold text-gray-900 mb-1">{mode.name}</h3>
                <p className="text-sm text-gray-600 mb-4">{mode.subtitle}</p>
                
                <p className="text-gray-700 text-sm leading-relaxed mb-4">
                  {mode.description}
                </p>

                {/* Timing */}
                <div className="flex items-center space-x-2 mb-4 text-sm text-gray-600">
                  <Clock className="w-4 h-4" />
                  <span>{mode.timing}</span>
                </div>

                {/* Features */}
                <div className="space-y-2 mb-4">
                  {mode.features.map((feature, index) => (
                    <div key={index} className="flex items-center space-x-2 text-sm">
                      <div className={`w-1.5 h-1.5 rounded-full bg-gradient-to-r ${mode.color}`} />
                      <span className="text-gray-700">{feature}</span>
                    </div>
                  ))}
                </div>

                {/* Use Case */}
                <div className="mt-auto">
                  <div className="bg-gray-50 rounded-lg p-3">
                    <p className="text-xs text-gray-600 font-medium mb-1">Best For:</p>
                    <p className="text-sm text-gray-700">{mode.useCase}</p>
                  </div>
                </div>

                {/* Selection Indicator */}
                {isSelected && (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="absolute bottom-4 right-4"
                  >
                    <div className="flex items-center space-x-1 text-blue-600">
                      <span className="text-sm font-medium">Selected</span>
                      <ArrowRight className="w-4 h-4" />
                    </div>
                  </motion.div>
                )}

                {/* Hover Overlay */}
                <AnimatePresence>
                  {isHovered && !isSelected && (
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      className={`absolute inset-0 bg-gradient-to-br ${mode.color} opacity-5 pointer-events-none`}
                    />
                  )}
                </AnimatePresence>
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* Selected Mode Preview */}
      <AnimatePresence mode="wait">
        {selectedMode && (
          <motion.div
            key={selectedMode}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-xl p-6 border border-blue-200"
          >
            {(() => {
              const selectedModeData = modes.find(m => m.id === selectedMode);
              if (!selectedModeData) return null;

              return (
                <div className="flex items-center space-x-4">
                  <div className={`w-12 h-12 rounded-full bg-gradient-to-r ${selectedModeData.color} flex items-center justify-center`}>
                    <selectedModeData.icon className="w-6 h-6 text-white" />
                  </div>
                  <div className="flex-1">
                    <h4 className="text-lg font-bold text-gray-900 mb-1">
                      Ready for {selectedModeData.name}
                    </h4>
                    <p className="text-gray-700">{selectedModeData.description}</p>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Sparkles className="w-5 h-5 text-blue-600" />
                    <span className="text-sm font-medium text-blue-600">Premium Analysis</span>
                  </div>
                </div>
              );
            })()}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Pro Tips */}
      <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-4">
        <div className="flex items-start space-x-3">
          <Target className="w-5 h-5 text-yellow-600 mt-0.5" />
          <div>
            <h4 className="font-semibold text-yellow-800 mb-1">💡 Pro Tips</h4>
            <ul className="text-sm text-yellow-700 space-y-1">
              <li>• Start with <strong>30-Second Brief</strong> for quick overview, then switch to Deep Dive if needed</li>
              <li>• Use <strong>Plain English</strong> for personal documents or when sharing with non-lawyers</li>
              <li>• Choose <strong>Professional Deep Dive</strong> for business contracts and legal reviews</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AnalysisModeSelector;