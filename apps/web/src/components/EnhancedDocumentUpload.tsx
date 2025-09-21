'use client';

import React, { useState, useRef, useCallback, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Upload, 
  File, 
  FileText,
  X,
  CheckCircle,
  AlertCircle,
  Loader2,
  Brain,
  Shield,
  TrendingUp,
  Clock,
  Eye,
  Download,
  Trash2,
  Plus,
  Zap,
  AlertTriangle,
  CheckSquare,
  Globe,
  Star
} from 'lucide-react';
import { useAuth } from '@/contexts/auth-context';
import AnalysisLoadingScreen from './AnalysisLoadingScreen';

interface DocumentAnalysis {
  textContent: string;
  confidence: number;
  language: string;
  documentType: string;
  risks: Array<{
    id: string;
    type: string;
    severity: 'low' | 'medium' | 'high';
    description: string;
    recommendation: string;
    location: string;
  }>;
  summary: string;
  keyTerms: Array<{
    term: string;
    definition: string;
    importance: 'high' | 'medium' | 'low';
  }>;
  keyClauses: Array<{
    id: string;
    title: string;
    content: string;
    type: string;
    importance: 'high' | 'medium' | 'low';
    explanation: string;
    potentialIssues: string[];
  }>;
  sections: Array<{
    title: string;
    content: string;
    type: string;
    riskLevel: 'low' | 'medium' | 'high';
  }>;
  compliance: Array<{
    framework: string;
    status: 'compliant' | 'non-compliant' | 'unclear';
    details: string;
  }>;
  financialTerms: Array<{
    type: string;
    value: string;
    currency?: string;
    description: string;
  }>;
  timeline: Array<{
    event: string;
    date: string;
    type: 'deadline' | 'milestone' | 'recurring';
    importance: 'critical' | 'important' | 'minor';
  }>;
}

interface UploadedFile {
  id: string;
  name: string;
  size: number;
  type: string;
  progress: number;
  status: 'uploading' | 'processing' | 'completed' | 'error';
  url?: string;
  analysis?: DocumentAnalysis;
  userId: string;
  uploadedAt?: string;
}

// Real AI-powered analysis function
const analyzeDocument = async (file: File): Promise<DocumentAnalysis> => {
  try {
    // Use the new Gemini AI API endpoint for analysis
    const formData = new FormData();
    formData.append('file', file);
    formData.append('userId', 'user-id-placeholder');
    formData.append('analysisMode', 'comprehensive');

    const response = await fetch('/api/analyze-document', {
      method: 'POST',
      body: formData,
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const result = await response.json();
    
    if (!result.success) {
      throw new Error(result.error || 'Analysis failed');
    }

    const analysis = result.analysis;
    console.log('📋 Received analysis from API:', analysis);
    
    // Transform the Gemini analysis to match our DocumentAnalysis interface
    return {
      textContent: analysis.summary || 'Document content processed',
      confidence: analysis.confidence / 100 || 0.95,
      language: analysis.language || 'English',
      documentType: analysis.documentType || 'Document',
      
      risks: analysis.riskAssessment?.criticalRisks?.map((risk: any, index: number) => ({
        id: `risk-${index}`,
        type: risk.type || 'General Risk',
        severity: risk.impact?.toLowerCase().includes('high') ? 'high' as const : 
                 risk.impact?.toLowerCase().includes('medium') ? 'medium' as const : 'low' as const,
        description: risk.description,
        recommendation: risk.mitigation,
        location: 'Document',
      })) || [],
      
      summary: analysis.summary || 'Document analysis completed successfully.',
      
      keyTerms: analysis.legalTerms?.map((term: any) => ({
        term: term.term,
        definition: term.definition,
        importance: term.importance === 'high' ? 'high' as const : 
                   term.importance === 'medium' ? 'medium' as const : 'low' as const
      })) || [],
      
      keyClauses: analysis.keyClauses?.map((clause: any, index: number) => ({
        id: `clause-${index}`,
        title: clause.title,
        content: clause.content,
        type: 'legal',
        importance: clause.importance,
        explanation: clause.explanation,
        potentialIssues: clause.risks || []
      })) || [],
      
      sections: [{
        title: 'Document Summary',
        content: analysis.summary,
        type: 'summary',
        riskLevel: analysis.riskAssessment?.overallRisk || 'low'
      }],
      
      compliance: analysis.riskAssessment?.complianceRequirements?.map((req: string, index: number) => ({
        framework: 'Legal Compliance',
        status: 'requires-review',
        details: req
      })) || [],
      
      financialTerms: analysis.financialAnalysis?.amounts?.map((amount: any) => ({
        type: amount.type || 'payment',
        value: amount.value?.toString() || '0',
        currency: amount.currency || 'INR',
        description: amount.context || 'Financial amount identified in document'
      })) || [],
      
      timeline: analysis.timeline?.map((item: any) => ({
        event: item.event || 'Important date',
        date: item.date,
        type: item.importance === 'high' ? 'deadline' as const : 'milestone' as const,
        importance: 'important' as const
      })) || []
    };
    
  } catch (error) {
    console.error('Document analysis failed:', error);
    throw error;
  }
};

interface EnhancedDocumentUploadProps {
  onDocumentAdd?: (document: {
    id: string;
    name: string;
    type: string;
    size: number;
    uploadedAt: string;
    status: 'processing' | 'completed' | 'error';
    aiSummary?: string;
    riskLevel?: 'low' | 'medium' | 'high';
    userId: string;
    confidence?: number;
    progress?: number;
  }) => void;
  onAnalysisComplete?: (document: UploadedFile, analysis: DocumentAnalysis) => void;
  showLoadingScreen?: boolean;
}

export default function EnhancedDocumentUpload({ 
  onDocumentAdd, 
  onAnalysisComplete,
  showLoadingScreen = true 
}: EnhancedDocumentUploadProps) {
  const { user } = useAuth();
  const [files, setFiles] = useState<UploadedFile[]>([]);
  const [isDragActive, setIsDragActive] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [selectedFile, setSelectedFile] = useState<UploadedFile | null>(null);
  const [currentAnalysisFile, setCurrentAnalysisFile] = useState<string>('');
  const [analysisStep, setAnalysisStep] = useState<'uploading' | 'processing' | 'analyzing' | 'finalizing' | 'complete'>('uploading');
  const [analysisProgress, setAnalysisProgress] = useState(0);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleDrag = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setIsDragActive(true);
    } else if (e.type === 'dragleave') {
      setIsDragActive(false);
    }
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragActive(false);
    
    const droppedFiles = Array.from(e.dataTransfer.files);
    handleFiles(droppedFiles);
  }, []);

  const handleFiles = async (fileList: File[]) => {
    if (!user) return;
    
    setIsUploading(true);
    
    for (const file of fileList) {
      // Validate file type
      const allowedTypes = [
        'application/pdf',
        'application/msword',
        'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
        'text/plain'
      ];
      
      if (!allowedTypes.includes(file.type)) {
        alert(`File type ${file.type} is not supported. Please upload PDF, DOC, DOCX, or TXT files.`);
        continue;
      }
      
      // Validate file size (10MB max)
      if (file.size > 10 * 1024 * 1024) {
        alert(`File ${file.name} is too large. Maximum size is 10MB.`);
        continue;
      }
      
      const fileId = `file_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
      const newFile: UploadedFile = {
        id: fileId,
        name: file.name,
        size: file.size,
        type: file.type,
        progress: 0,
        status: 'uploading',
        userId: user.id || user.email || 'unknown'
      };
      
      setFiles(prev => [...prev, newFile]);
      
      if (showLoadingScreen) {
        setCurrentAnalysisFile(fileId);
        
        // Step 1: Upload simulation
        setAnalysisStep('uploading');
        for (let progress = 0; progress <= 30; progress += 10) {
          await new Promise(resolve => setTimeout(resolve, 300));
          setAnalysisProgress(progress);
        }
        
        setFiles(prev => prev.map(f => 
          f.id === fileId ? { ...f, status: 'processing', progress: 30 } : f
        ));

        // Step 2: Processing stage
        setAnalysisStep('processing');
        for (let progress = 30; progress <= 50; progress += 10) {
          await new Promise(resolve => setTimeout(resolve, 400));
          setAnalysisProgress(progress);
        }
        
        // Step 3: AI Analysis
        setAnalysisStep('analyzing');
        
        try {
          console.log('🚀 Starting actual document analysis...');
          const analysis = await analyzeDocument(file);
          console.log('📋 Analysis completed successfully:', analysis);
          
          for (let progress = 50; progress <= 70; progress += 10) {
            await new Promise(resolve => setTimeout(resolve, 300));
            setAnalysisProgress(progress);
          }
          
          // Finalizing stage
          setAnalysisStep('finalizing');
          for (let progress = 70; progress <= 100; progress += 10) {
            await new Promise(resolve => setTimeout(resolve, 200));
            setAnalysisProgress(progress);
          }

          setAnalysisStep('complete');
          
          const updatedFile: UploadedFile = {
            ...newFile,
            status: 'completed',
            analysis,
            url: URL.createObjectURL(file)
          };

          setFiles(prev => prev.map(f => 
            f.id === fileId ? updatedFile : f
          ));

          // Wait a moment before transitioning
          await new Promise(resolve => setTimeout(resolve, 1000));

          // Call the analysis complete callback to show the analysis page
          console.log('🔄 Calling onAnalysisComplete with:', { updatedFile, analysis });
          if (onAnalysisComplete) {
            onAnalysisComplete(updatedFile, analysis);
            console.log('✅ onAnalysisComplete callback executed');
          } else {
            console.log('❌ onAnalysisComplete callback not provided');
          }

          // Notify parent component
          if (onDocumentAdd) {
            const currentDate = new Date().toISOString();
            const dashboardDoc = {
              id: fileId,
              name: file.name,
              type: analysis.documentType,
              size: file.size,
              uploadedAt: currentDate,
              status: 'completed' as const,
              aiSummary: analysis.summary,
              riskLevel: analysis.risks.length > 0 ? 
                (analysis.risks.some(r => r.severity === 'high') ? 'high' as const : 
                 analysis.risks.some(r => r.severity === 'medium') ? 'medium' as const : 'low' as const) : 'low' as const,
              userId: user.id || user.email || 'unknown',
              confidence: analysis.confidence,
              progress: 100
            };
            onDocumentAdd(dashboardDoc);
          }

        } catch (error) {
          console.error('❌ Document analysis failed in loading screen path:', error);
          setFiles(prev => prev.map(f => 
            f.id === fileId ? { ...f, status: 'error' } : f
          ));
          setCurrentAnalysisFile('');
          setIsUploading(false);
        }
      } else {
        // Original workflow without loading screen
        for (let progress = 0; progress <= 100; progress += 10) {
          await new Promise(resolve => setTimeout(resolve, 100));
          setFiles(prev => prev.map(f => 
            f.id === fileId ? { ...f, progress } : f
          ));
        }

        setFiles(prev => prev.map(f => 
          f.id === fileId ? { ...f, status: 'processing', progress: 100 } : f
        ));

        try {
          const analysis = await analyzeDocument(file);
          
          setFiles(prev => prev.map(f => 
            f.id === fileId ? { 
              ...f, 
              status: 'completed', 
              analysis,
              url: URL.createObjectURL(file)
            } : f
          ));

          if (onDocumentAdd) {
            const currentDate = new Date().toISOString();
            const dashboardDoc = {
              id: fileId,
              name: file.name,
              type: analysis.documentType,
              size: file.size,
              uploadedAt: currentDate,
              status: 'completed' as const,
              aiSummary: analysis.summary,
              riskLevel: analysis.risks.length > 0 ? 
                (analysis.risks.some(r => r.severity === 'high') ? 'high' as const : 
                 analysis.risks.some(r => r.severity === 'medium') ? 'medium' as const : 'low' as const) : 'low' as const,
              userId: user.id || user.email || 'unknown',
              confidence: analysis.confidence,
              progress: 100
            };
            onDocumentAdd(dashboardDoc);
          }
        } catch (error) {
          setFiles(prev => prev.map(f => 
            f.id === fileId ? { ...f, status: 'error' } : f
          ));
        }
      }
    }
    
    setIsUploading(false);
    setCurrentAnalysisFile('');
  };

  const handleClick = () => {
    fileInputRef.current?.click();
  };

  const removeFile = (fileId: string) => {
    setFiles(prev => prev.filter(f => f.id !== fileId));
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed':
        return <CheckCircle className="w-5 h-5 text-green-500" />;
      case 'error':
        return <AlertCircle className="w-5 h-5 text-red-500" />;
      case 'uploading':
      case 'processing':
        return <Loader2 className="w-5 h-5 text-blue-500 animate-spin" />;
      default:
        return <File className="w-5 h-5 text-gray-500" />;
    }
  };

  const getRiskColor = (risk: 'low' | 'medium' | 'high') => {
    switch(risk) {
      case 'low': return 'text-green-600 bg-green-100';
      case 'medium': return 'text-yellow-600 bg-yellow-100';
      case 'high': return 'text-red-600 bg-red-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  // If currently analyzing and loading screen is enabled
  if (showLoadingScreen && currentAnalysisFile) {
    const currentFile = files.find(f => f.id === currentAnalysisFile);
    if (currentFile) {
      return (
        <AnalysisLoadingScreen
          fileName={currentFile.name}
          progress={analysisProgress}
          isVisible={true}
          currentStep={analysisStep}
        />
      );
    }
  }

  return (
    <div className="w-full max-w-4xl mx-auto p-6">
      {/* Upload Area */}
      <motion.div
        className={`relative border-2 border-dashed rounded-2xl p-8 text-center transition-all duration-300 cursor-pointer ${
          isDragActive 
            ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20' 
            : 'border-gray-300 dark:border-gray-600 hover:border-gray-400 dark:hover:border-gray-500'
        }`}
        onDragEnter={handleDrag}
        onDragLeave={handleDrag}
        onDragOver={handleDrag}
        onDrop={handleDrop}
        onClick={handleClick}
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
      >
        <input
          ref={fileInputRef}
          type="file"
          multiple
          accept=".pdf,.doc,.docx,.txt"
          onChange={(e) => e.target.files && handleFiles(Array.from(e.target.files))}
          className="hidden"
        />
        
        <div className="flex flex-col items-center gap-4">
          <div className={`w-16 h-16 rounded-full flex items-center justify-center transition-colors ${
            isDragActive ? 'bg-blue-100 dark:bg-blue-800' : 'bg-gray-100 dark:bg-gray-800'
          }`}>
            <Upload className={`w-8 h-8 ${isDragActive ? 'text-blue-500' : 'text-gray-500'}`} />
          </div>
          
          <div>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
              Drop your legal documents here
            </h3>
            <p className="text-gray-600 dark:text-gray-400 mb-4">
              or <span className="text-blue-500 font-medium">browse</span> to choose files
            </p>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              Supports PDF, DOC, DOCX, TXT • Max 10MB per file
            </p>
          </div>
        </div>
      </motion.div>

      {/* File List */}
      <AnimatePresence>
        {files.length > 0 && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="mt-6 space-y-3"
          >
            {files.map((file, index) => (
              <motion.div
                key={file.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
                className="bg-white dark:bg-gray-800 rounded-xl p-4 shadow-md border border-gray-200 dark:border-gray-700"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3 flex-1">
                    {getStatusIcon(file.status)}
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-gray-900 dark:text-white truncate">
                        {file.name}
                      </p>
                      <p className="text-xs text-gray-500 dark:text-gray-400">
                        {formatFileSize(file.size)}
                      </p>
                    </div>
                    
                    {file.analysis && (
                      <div className="flex items-center gap-2">
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                          getRiskColor(file.analysis.risks.some(r => r.severity === 'high') ? 'high' : 
                                     file.analysis.risks.some(r => r.severity === 'medium') ? 'medium' : 'low')
                        }`}>
                          {file.analysis.risks.some(r => r.severity === 'high') ? 'HIGH RISK' : 
                           file.analysis.risks.some(r => r.severity === 'medium') ? 'MEDIUM RISK' : 'LOW RISK'}
                        </span>
                        <span className="text-xs text-gray-500">
                          {file.analysis.confidence.toFixed(1)}% confidence
                        </span>
                      </div>
                    )}
                  </div>
                  
                  <div className="flex items-center gap-2 ml-4">
                    {file.analysis && (
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          setSelectedFile(file);
                        }}
                        className="px-3 py-1 bg-blue-500 text-white rounded-lg text-xs hover:bg-blue-600 transition-colors"
                      >
                        View Analysis
                      </button>
                    )}
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        removeFile(file.id);
                      }}
                      className="p-1 text-gray-400 hover:text-red-500 transition-colors"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                </div>
                
                {file.status === 'uploading' && (
                  <div className="mt-2">
                    <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                      <div
                        className="bg-blue-500 h-2 rounded-full transition-all duration-300"
                        style={{ width: `${file.progress}%` }}
                      />
                    </div>
                  </div>
                )}
              </motion.div>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}