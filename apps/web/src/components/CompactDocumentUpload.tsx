'use client';

import React, { useState, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Upload, 
  FileText, 
  X, 
  CheckCircle, 
  Loader2,
  Zap,
  Search,
  Brain,
  Sparkles
} from 'lucide-react';
import { useAuth } from '@/contexts/auth-context';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { cn } from '@/lib/utils';

type AnalysisMode = 'quick' | 'deep' | 'comprehensive';

interface CompactDocumentUploadProps {
  onAnalysisComplete?: (analysis: any) => void;
  onClose?: () => void;
}

const analysisModes = [
  {
    id: 'quick' as AnalysisMode,
    name: 'Quick',
    description: 'Fast overview',
    icon: Zap,
    gradient: 'from-emerald-500 to-teal-600',
    time: '~30s'
  },
  {
    id: 'deep' as AnalysisMode,
    name: 'Deep',
    description: 'Comprehensive review',
    icon: Search,
    gradient: 'from-blue-500 to-indigo-600',
    time: '~2min'
  },
  {
    id: 'comprehensive' as AnalysisMode,
    name: 'Expert',
    description: 'Complete analysis',
    icon: Brain,
    gradient: 'from-purple-500 to-pink-600',
    time: '~3min',
    popular: true
  }
];

export default function CompactDocumentUpload({ onAnalysisComplete, onClose }: CompactDocumentUploadProps) {
  const { user } = useAuth();
  const [selectedMode, setSelectedMode] = useState<AnalysisMode>('comprehensive');
  const [file, setFile] = useState<File | null>(null);
  const [isDragActive, setIsDragActive] = useState(false);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisProgress, setAnalysisProgress] = useState(0);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const startAnalysis = useCallback(async () => {
    if (!file) {
      console.warn('⚠️ No file selected for analysis');
      return;
    }

    console.log('🚀 Starting analysis with mode:', selectedMode);
    console.log('📁 File details:', { name: file.name, size: file.size, type: file.type });
    
    setIsAnalyzing(true);
    setAnalysisProgress(0);

    try {
      // Create form data
      const formData = new FormData();
      formData.append('file', file);
      formData.append('userId', user?.id || 'anonymous');
      formData.append('analysisMode', selectedMode);

      console.log('📤 Sending request to /api/analyze-document');

      // Realistic progress simulation based on analysis mode
      const getExpectedDuration = (mode: AnalysisMode) => {
        switch(mode) {
          case 'quick': return 30000;    // 30 seconds
          case 'deep': return 120000;    // 2 minutes
          case 'comprehensive': return 180000; // 3 minutes
          default: return 120000;
        }
      };

      const expectedDuration = getExpectedDuration(selectedMode);
      const updateInterval = expectedDuration / 85; // 85% progress by completion
      
      console.log(`⏱️ Expected analysis duration: ${expectedDuration / 1000}s for ${selectedMode} mode`);

      // Realistic progress tracking
      const progressInterval = setInterval(() => {
        setAnalysisProgress(prev => {
          const increment = Math.random() * 2 + 0.5; // 0.5-2.5% increments
          const newProgress = Math.min(prev + increment, 85);
          return newProgress;
        });
      }, updateInterval);

      // Call API
      const response = await fetch('/api/analyze-document', {
        method: 'POST',
        body: formData,
      });

      clearInterval(progressInterval);
      
      console.log('📥 Received API response:', response.status, response.statusText);

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const result = await response.json();
      console.log('✅ API result:', result);
      
      if (result.success) {
        setAnalysisProgress(100);
        
        // Brief completion animation
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        console.log('🎯 Calling onAnalysisComplete callback with:', result.analysis);
        
        // Call completion callback with the analysis data
        if (onAnalysisComplete) {
          onAnalysisComplete(result.analysis);
        } else {
          console.warn('⚠️ No onAnalysisComplete callback provided');
        }
      } else {
        throw new Error(result.error || 'Analysis failed');
      }
    } catch (error) {
      console.error('❌ Analysis failed:', error);
      setAnalysisProgress(0);
      
      // Show user-friendly error
      const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
      alert(`Analysis failed: ${errorMessage}. Please try again.`);
    } finally {
      setIsAnalyzing(false);
    }
  }, [file, selectedMode, user, onAnalysisComplete]);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragActive(false);
    
    const droppedFiles = Array.from(e.dataTransfer.files);
    if (droppedFiles.length > 0 && droppedFiles[0]) {
      setFile(droppedFiles[0]);
    }
  }, []);

  const handleFileSelect = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
    }
  }, []);

  const removeFile = () => {
    setFile(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  return (
    <div className="w-full max-w-2xl mx-auto">
      {/* Compact Header */}
      <div className="flex items-center justify-between p-6 pb-4">
        <div className="flex items-center space-x-3">
          <div className="p-2 bg-gradient-to-br from-purple-600 to-pink-600 rounded-lg shadow-lg">
            <Sparkles className="w-5 h-5 text-white" />
          </div>
          <div>
            <h2 className="text-xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
              AI Document Analysis
            </h2>
            <p className="text-sm text-muted-foreground">
              Professional legal document analysis
            </p>
          </div>
        </div>
        {onClose && (
          <Button variant="ghost" size="icon" onClick={onClose} className="h-8 w-8">
            <X className="w-4 h-4" />
          </Button>
        )}
      </div>

      <div className="px-6 space-y-4">
        {/* Compact Analysis Mode Selection */}
        <div>
          <h3 className="text-sm font-semibold text-gray-900 dark:text-white mb-3">
            Analysis Type
          </h3>
          <div className="grid grid-cols-3 gap-2">
            {analysisModes.map((mode) => {
              const Icon = mode.icon;
              return (
                <motion.div
                  key={mode.id}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <Card 
                    className={cn(
                      "cursor-pointer transition-all relative p-3 text-center",
                      selectedMode === mode.id 
                        ? "ring-2 ring-purple-500 bg-purple-50 dark:bg-purple-950/30" 
                        : "hover:shadow-md hover:bg-gray-50 dark:hover:bg-gray-800"
                    )}
                    onClick={() => setSelectedMode(mode.id)}
                  >
                    {mode.popular && (
                      <Badge className="absolute -top-2 -right-2 bg-gradient-to-r from-purple-500 to-pink-500 text-xs px-1.5 py-0.5">
                        ✨
                      </Badge>
                    )}
                    <div className={cn("w-8 h-8 rounded-lg bg-gradient-to-br mx-auto mb-2 flex items-center justify-center", mode.gradient)}>
                      <Icon className="w-4 h-4 text-white" />
                    </div>
                    <h4 className="font-medium text-xs mb-1">{mode.name}</h4>
                    <p className="text-xs text-muted-foreground mb-1">{mode.time}</p>
                    {selectedMode === mode.id && (
                      <CheckCircle className="w-4 h-4 text-purple-500 mx-auto" />
                    )}
                  </Card>
                </motion.div>
              );
            })}
          </div>
        </div>

        {/* Compact File Upload */}
        <div className="pb-6">
          <AnimatePresence mode="wait">
            {!file ? (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className={cn(
                  "border-2 border-dashed rounded-xl p-6 text-center transition-all cursor-pointer",
                  isDragActive
                    ? 'border-purple-500 bg-purple-50 dark:bg-purple-950/20'
                    : 'border-gray-300 dark:border-gray-600 hover:border-purple-400 hover:bg-purple-50/30'
                )}
                onDrop={handleDrop}
                onDragOver={(e) => {
                  e.preventDefault();
                  setIsDragActive(true);
                }}
                onDragLeave={() => setIsDragActive(false)}
                onClick={() => fileInputRef.current?.click()}
              >
                <Upload className="w-10 h-10 text-gray-400 mx-auto mb-3" />
                <h3 className="font-medium text-gray-900 dark:text-white mb-1">
                  Drop document or click to browse
                </h3>
                <p className="text-xs text-muted-foreground mb-3">
                  PDF, DOC, DOCX • Max 10MB
                </p>
                <Button size="sm" className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700">
                  <Upload className="w-3 h-3 mr-1" />
                  Choose File
                </Button>
                <input
                  ref={fileInputRef}
                  type="file"
                  className="hidden"
                  accept=".pdf,.doc,.docx,.txt"
                  onChange={handleFileSelect}
                />
              </motion.div>
            ) : (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="space-y-4"
              >
                {/* Selected File - Compact */}
                <Card className="p-3 bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-950/20 dark:to-indigo-950/20">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <FileText className="w-6 h-6 text-blue-600" />
                      <div>
                        <div className="font-medium text-sm">{file.name}</div>
                        <div className="text-xs text-muted-foreground">{formatFileSize(file.size)}</div>
                      </div>
                    </div>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={removeFile}
                      disabled={isAnalyzing}
                      className="h-6 w-6"
                    >
                      <X className="w-3 h-3" />
                    </Button>
                  </div>
                </Card>

                {/* Analysis Progress - Compact */}
                {isAnalyzing && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                  >
                    <Card className="p-3 bg-gradient-to-r from-purple-50 to-pink-50 dark:from-purple-950/20 dark:to-pink-950/20">
                      <div className="flex items-center space-x-2 mb-2">
                        <Loader2 className="w-4 h-4 text-purple-600 animate-spin" />
                        <span className="text-sm font-medium text-purple-700 dark:text-purple-300">
                          AI analyzing...
                        </span>
                      </div>
                      <Progress value={analysisProgress} className="h-1.5" />
                      <div className="text-xs text-muted-foreground mt-1">
                        {analysisProgress}% complete
                      </div>
                    </Card>
                  </motion.div>
                )}

                {/* Compact Action Buttons */}
                <div className="flex space-x-2">
                  <Button
                    onClick={startAnalysis}
                    disabled={isAnalyzing}
                    className="flex-1 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white h-10"
                  >
                    {isAnalyzing ? (
                      <>
                        <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                        Analyzing...
                      </>
                    ) : (
                      <>
                        <Sparkles className="w-4 h-4 mr-2" />
                        Start Analysis
                      </>
                    )}
                  </Button>
                  <Button
                    variant="outline"
                    onClick={() => fileInputRef.current?.click()}
                    disabled={isAnalyzing}
                    size="icon"
                    className="h-10 w-10"
                  >
                    <Upload className="w-4 h-4" />
                  </Button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}