'use client';

import React, { useState, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Upload, 
  FileText, 
  X, 
  CheckCircle, 
  AlertCircle, 
  Loader2,
  Zap,
  Search,
  Brain,
  Sparkles,
  Eye
} from 'lucide-react';
import { useAuth } from '@/contexts/auth-context';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { cn } from '@/lib/utils';

interface PremiumDocumentUploadProps {
  onAnalysisComplete?: (results: any) => void;
  onClose?: () => void;
}

type AnalysisMode = 'quick' | 'deep' | 'comprehensive';

export default function PremiumDocumentUpload({ onAnalysisComplete, onClose }: PremiumDocumentUploadProps) {
  const { user } = useAuth();
  const [selectedMode, setSelectedMode] = useState<AnalysisMode>('comprehensive');
  const [file, setFile] = useState<File | null>(null);
  const [isDragActive, setIsDragActive] = useState(false);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisProgress, setAnalysisProgress] = useState(0);
  const [pdfPreviewUrl, setPdfPreviewUrl] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const analysisModes = [
    {
      id: 'quick' as AnalysisMode,
      name: 'Quick Analysis',
      description: 'Fast overview and key points identification',
      icon: Zap,
      gradient: 'from-emerald-500 to-teal-600',
      time: '~30 seconds',
      features: ['Document type', 'Key parties', 'Basic summary']
    },
    {
      id: 'deep' as AnalysisMode,
      name: 'Deep Analysis',
      description: 'Comprehensive legal review with risk assessment',
      icon: Search,
      gradient: 'from-blue-500 to-indigo-600',
      time: '~2 minutes',
      features: ['All quick features', 'Risk analysis', 'Legal terms', 'Recommendations']
    },
    {
      id: 'comprehensive' as AnalysisMode,
      name: 'AI Expert Analysis',
      description: 'Complete professional analysis with actionable insights',
      icon: Brain,
      gradient: 'from-purple-500 to-pink-600',
      time: '~3 minutes',
      features: ['All features', 'Timeline analysis', 'Compliance check', 'Action items'],
      popular: true
    }
  ];

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragActive(false);
    
    const droppedFiles = Array.from(e.dataTransfer.files);
    if (droppedFiles.length > 0 && droppedFiles[0]) {
      const selectedFile = droppedFiles[0];
      setFile(selectedFile);
      
      // Create preview URL for PDF
      if (selectedFile.type === 'application/pdf') {
        const previewUrl = URL.createObjectURL(selectedFile);
        setPdfPreviewUrl(previewUrl);
      } else {
        setPdfPreviewUrl(null);
      }
    }
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const selectedFile = e.target.files[0];
      setFile(selectedFile);
      
      // Create preview URL for PDF
      if (selectedFile.type === 'application/pdf') {
        const previewUrl = URL.createObjectURL(selectedFile);
        setPdfPreviewUrl(previewUrl);
      } else {
        setPdfPreviewUrl(null);
      }
    }
  };

  // Cleanup preview URL when component unmounts
  React.useEffect(() => {
    return () => {
      if (pdfPreviewUrl) {
        URL.revokeObjectURL(pdfPreviewUrl);
      }
    };
  }, [pdfPreviewUrl]);

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

      // Progress simulation
      const progressInterval = setInterval(() => {
        setAnalysisProgress(prev => {
          const newProgress = Math.min(prev + 3, 85);
          return newProgress;
        });
      }, 1000);

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

  const removeFile = () => {
    setFile(null);
    if (pdfPreviewUrl) {
      URL.revokeObjectURL(pdfPreviewUrl);
      setPdfPreviewUrl(null);
    }
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
    <div className="w-full max-w-4xl mx-auto p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <div className="p-3 bg-gradient-to-br from-purple-600 to-pink-600 rounded-xl shadow-lg">
            <Sparkles className="w-7 h-7 text-white" />
          </div>
          <div>
            <h2 className="text-3xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
              Premium AI Document Analysis
            </h2>
            <p className="text-muted-foreground mt-1">
              Upload your legal document for professional AI analysis
            </p>
          </div>
        </div>
        {onClose && (
          <Button variant="ghost" size="icon" onClick={onClose}>
            <X className="w-5 h-5" />
          </Button>
        )}
      </div>

      {/* Analysis Mode Selection */}
      <Card className="shadow-lg">
        <CardHeader>
          <CardTitle className="text-xl flex items-center gap-2">
            <Brain className="w-5 h-5" />
            Choose Analysis Mode
          </CardTitle>
          <CardDescription>
            Select the depth and type of analysis for your document
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
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
                      "cursor-pointer transition-all relative overflow-hidden border-2 hover:shadow-md",
                      selectedMode === mode.id 
                        ? "ring-2 ring-purple-500 border-purple-200 shadow-lg bg-purple-50/50 dark:bg-purple-950/20" 
                        : "border-gray-200 hover:border-gray-300 dark:border-gray-700"
                    )}
                    onClick={() => setSelectedMode(mode.id)}
                  >
                    {mode.popular && (
                      <Badge className="absolute top-3 right-3 bg-gradient-to-r from-purple-500 to-pink-500 text-xs">
                        <Sparkles className="w-3 h-3 mr-1" />
                        Popular
                      </Badge>
                    )}
                    <CardContent className="p-5">
                      <div className="flex items-center space-x-3 mb-3">
                        <div className={cn("w-10 h-10 rounded-lg bg-gradient-to-br flex items-center justify-center", mode.gradient)}>
                          <Icon className="w-5 h-5 text-white" />
                        </div>
                        {selectedMode === mode.id && (
                          <CheckCircle className="w-5 h-5 text-purple-500 ml-auto" />
                        )}
                      </div>
                      <h3 className="font-semibold text-base mb-1">{mode.name}</h3>
                      <p className="text-sm text-muted-foreground mb-2">{mode.description}</p>
                      <Badge variant="secondary" className="text-xs mb-3">
                        {mode.time}
                      </Badge>
                      <ul className="space-y-1">
                        {mode.features.map((feature, index) => (
                          <li key={index} className="flex items-center text-xs text-muted-foreground">
                            <CheckCircle className="w-3 h-3 mr-2 text-emerald-500 flex-shrink-0" />
                            {feature}
                          </li>
                        ))}
                      </ul>
                    </CardContent>
                  </Card>
                </motion.div>
              );
            })}
          </div>
        </CardContent>
      </Card>

      {/* File Upload */}
      <Card className="shadow-lg">
        <CardContent className="p-6">
          <AnimatePresence mode="wait">
            {!file ? (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className={cn(
                  "border-2 border-dashed rounded-xl p-8 text-center transition-all cursor-pointer",
                  isDragActive
                    ? 'border-purple-500 bg-purple-50 dark:bg-purple-950/20'
                    : 'border-gray-300 dark:border-gray-600 hover:border-purple-400 hover:bg-purple-50/30 dark:hover:bg-purple-950/10'
                )}
                onDrop={handleDrop}
                onDragOver={(e) => {
                  e.preventDefault();
                  setIsDragActive(true);
                }}
                onDragLeave={() => setIsDragActive(false)}
                onClick={() => fileInputRef.current?.click()}
              >
                <motion.div
                  animate={{ scale: isDragActive ? 1.05 : 1 }}
                  transition={{ duration: 0.2 }}
                >
                  <Upload className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                    Drop your document here
                  </h3>
                  <p className="text-muted-foreground mb-6">
                    or click to browse and select files
                  </p>
                  <Button className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700">
                    <Upload className="w-4 h-4 mr-2" />
                    Choose File
                  </Button>
                  <div className="text-xs text-muted-foreground mt-4">
                    Supports PDF, DOC, DOCX files • Maximum 10MB
                  </div>
                </motion.div>
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
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className="space-y-6"
              >
                {/* Selected File Display */}
                <Card className="bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-950/20 dark:to-indigo-950/20 border-blue-200 dark:border-blue-800">
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <FileText className="w-10 h-10 text-blue-600" />
                        <div>
                          <div className="font-semibold text-gray-900 dark:text-white">
                            {file.name}
                          </div>
                          <div className="text-sm text-muted-foreground">
                            {formatFileSize(file.size)} • Ready for analysis
                          </div>
                        </div>
                      </div>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={removeFile}
                        disabled={isAnalyzing}
                      >
                        <X className="w-4 h-4" />
                      </Button>
                    </div>
                  </CardContent>
                </Card>

                {/* PDF Preview */}
                {pdfPreviewUrl && (
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3 }}
                  >
                    <Card className="bg-gray-50 dark:bg-gray-900 border-gray-200 dark:border-gray-700">
                      <CardContent className="p-4">
                        <div className="flex items-center justify-between mb-3">
                          <h3 className="font-medium text-gray-900 dark:text-white flex items-center">
                            <Eye className="w-4 h-4 mr-2" />
                            Document Preview
                          </h3>
                        </div>
                        <div className="rounded-lg overflow-hidden border border-gray-300 dark:border-gray-600">
                          <iframe
                            src={pdfPreviewUrl}
                            className="w-full h-96"
                            title="PDF Preview"
                            style={{ border: 'none' }}
                          />
                        </div>
                      </CardContent>
                    </Card>
                  </motion.div>
                )}

                {/* Analysis Progress */}
                {isAnalyzing && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                  >
                    <Card className="bg-gradient-to-r from-purple-50 to-pink-50 dark:from-purple-950/20 dark:to-pink-950/20 border-purple-200 dark:border-purple-800">
                      <CardContent className="p-4">
                        <div className="flex items-center space-x-3 mb-4">
                          <Loader2 className="w-5 h-5 text-purple-600 animate-spin" />
                          <span className="font-medium text-purple-700 dark:text-purple-300">
                            Analyzing your document with AI...
                          </span>
                        </div>
                        <Progress value={analysisProgress} className="h-2 mb-2" />
                        <div className="flex justify-between items-center text-xs text-muted-foreground">
                          <span>Analysis in progress</span>
                          <span>{analysisProgress}% complete</span>
                        </div>
                      </CardContent>
                    </Card>
                  </motion.div>
                )}

                {/* Action Buttons */}
                <div className="flex space-x-3">
                  <Button
                    onClick={startAnalysis}
                    disabled={isAnalyzing}
                    className="flex-1 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white h-12 text-base font-medium"
                  >
                    {isAnalyzing ? (
                      <>
                        <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                        Analyzing...
                      </>
                    ) : (
                      <>
                        <Sparkles className="w-4 h-4 mr-2" />
                        Start {analysisModes.find(m => m.id === selectedMode)?.name}
                      </>
                    )}
                  </Button>
                  <Button
                    variant="outline"
                    onClick={() => fileInputRef.current?.click()}
                    disabled={isAnalyzing}
                    className="px-6 h-12"
                  >
                    <Upload className="w-4 h-4 mr-2" />
                    Change File
                  </Button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </CardContent>
      </Card>
    </div>
  );
};