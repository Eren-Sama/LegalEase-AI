'use client';

import React, { useState, useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Upload,
  FileText,
  Image,
  CheckCircle,
  AlertCircle,
  X,
  FileIcon,
  Sparkles,
  Shield,
  Zap,
  Clock
} from 'lucide-react';
import AnalysisModeSelector from './AnalysisModeSelector';

interface DocumentUploadProps {
  onFileSelect: (file: File, mode: string) => void;
  isUploading?: boolean;
  className?: string;
}

interface UploadedFile extends File {
  preview?: string;
}

const DocumentUpload: React.FC<DocumentUploadProps> = ({
  onFileSelect,
  isUploading = false,
  className = ''
}) => {
  const [selectedFile, setSelectedFile] = useState<UploadedFile | null>(null);
  const [analysisMode, setAnalysisMode] = useState<string>('deep');
  const [uploadError, setUploadError] = useState<string | null>(null);

  const maxSize = 15 * 1024 * 1024; // 15MB
  const acceptedFileTypes = {
    'application/pdf': ['.pdf'],
    'application/msword': ['.doc'],
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document': ['.docx'],
    'text/plain': ['.txt'],
    'image/jpeg': ['.jpg', '.jpeg'],
    'image/png': ['.png'],
    'image/webp': ['.webp'],
    'image/tiff': ['.tiff', '.tif']
  };

  const onDrop = useCallback((acceptedFiles: File[], rejectedFiles: any[]) => {
    setUploadError(null);
    
    if (rejectedFiles.length > 0) {
      const rejection = rejectedFiles[0];
      if (rejection.errors[0]?.code === 'file-too-large') {
        setUploadError('File is too large. Maximum size is 15MB.');
      } else if (rejection.errors[0]?.code === 'file-invalid-type') {
        setUploadError('File type not supported. Please upload PDF, DOC, DOCX, TXT, or image files.');
      } else {
        setUploadError('Unable to upload file. Please try again.');
      }
      return;
    }

    if (acceptedFiles.length > 0) {
      const file = acceptedFiles[0] as UploadedFile;
      
      // Create preview for images
      if (file.type.startsWith('image/')) {
        file.preview = URL.createObjectURL(file);
      }
      
      setSelectedFile(file);
    }
  }, []);

  const { getRootProps, getInputProps, isDragActive, isDragReject } = useDropzone({
    onDrop,
    accept: acceptedFileTypes,
    maxSize,
    multiple: false,
    disabled: isUploading
  });

  const removeFile = () => {
    if (selectedFile?.preview) {
      URL.revokeObjectURL(selectedFile.preview);
    }
    setSelectedFile(null);
    setUploadError(null);
  };

  const handleAnalyze = () => {
    if (selectedFile) {
      onFileSelect(selectedFile, analysisMode);
    }
  };

  const getFileIcon = (fileType: string) => {
    if (fileType.includes('pdf')) return FileText;
    if (fileType.includes('word') || fileType.includes('document')) return FileText;
    if (fileType.includes('text')) return FileText;
    if (fileType.includes('image')) return Image;
    return FileIcon;
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  return (
    <div className={`space-y-6 ${className}`}>
      {/* Premium Header */}
      <div className="text-center">
        <div className="inline-flex items-center space-x-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white px-4 py-2 rounded-full text-sm font-medium mb-4">
          <Sparkles className="w-4 h-4" />
          <span>Premium AI Document Analysis</span>
        </div>
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          Analyze Your Legal Document
        </h1>
        <p className="text-gray-600 max-w-2xl mx-auto">
          Upload your contract, agreement, or legal document for professional AI analysis 
          with 100% accuracy guarantee powered by Google Gemini AI.
        </p>
      </div>

      {/* Upload Area */}
      <div className="bg-white rounded-2xl shadow-xl border border-gray-200 overflow-hidden">
        {!selectedFile ? (
          <div
            {...getRootProps()}
            className={`relative p-12 text-center cursor-pointer transition-all duration-300 transform hover:scale-[1.01] active:scale-[0.99] ${
              isDragActive && !isDragReject
                ? 'bg-blue-50 border-blue-300'
                : isDragReject
                ? 'bg-red-50 border-red-300'
                : 'bg-gray-50 hover:bg-gray-100'
            }`}
          >
            <input {...getInputProps()} />
            
            {/* Background Pattern */}
            <div className="absolute inset-0 opacity-5">
              <div className="absolute inset-0" style={{
                backgroundImage: 'radial-gradient(circle at 25% 25%, #3B82F6 2px, transparent 2px)',
                backgroundSize: '24px 24px'
              }} />
            </div>

            <div className="relative z-10">
              <motion.div
                animate={{
                  y: isDragActive ? -5 : 0,
                  scale: isDragActive ? 1.05 : 1
                }}
                transition={{ type: 'spring', stiffness: 300, damping: 20 }}
              >
                <div className={`w-20 h-20 mx-auto mb-6 rounded-full flex items-center justify-center ${
                  isDragActive && !isDragReject
                    ? 'bg-blue-100 text-blue-600'
                    : isDragReject
                    ? 'bg-red-100 text-red-600'
                    : 'bg-gray-100 text-gray-400'
                }`}>
                  <Upload className="w-10 h-10" />
                </div>
              </motion.div>

              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                {isDragActive
                  ? (isDragReject ? 'File type not supported' : 'Drop your document here')
                  : 'Drop your document here, or click to browse'
                }
              </h3>
              
              <p className="text-gray-600 mb-6">
                Maximum file size: 15MB
              </p>

              {/* Supported Formats */}
              <div className="flex flex-wrap justify-center gap-3 mb-6">
                {[
                  { type: 'PDF', color: 'bg-red-100 text-red-700' },
                  { type: 'DOC', color: 'bg-blue-100 text-blue-700' },
                  { type: 'DOCX', color: 'bg-blue-100 text-blue-700' },
                  { type: 'TXT', color: 'bg-gray-100 text-gray-700' },
                  { type: 'JPG', color: 'bg-green-100 text-green-700' },
                  { type: 'PNG', color: 'bg-green-100 text-green-700' }
                ].map((format) => (
                  <span
                    key={format.type}
                    className={`px-3 py-1 rounded-full text-xs font-medium ${format.color}`}
                  >
                    {format.type}
                  </span>
                ))}
              </div>

              {/* Trust Indicators */}
              <div className="flex justify-center space-x-6 text-sm text-gray-600">
                <div className="flex items-center space-x-2">
                  <Shield className="w-4 h-4 text-green-600" />
                  <span>Secure & Private</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Zap className="w-4 h-4 text-blue-600" />
                  <span>AI-Powered</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Clock className="w-4 h-4 text-purple-600" />
                  <span>Fast Analysis</span>
                </div>
              </div>
            </div>
          </div>
        ) : (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="p-6"
          >
            {/* File Preview */}
            <div className="flex items-start space-x-4 p-4 bg-gray-50 rounded-xl mb-6">
              <div className="flex-shrink-0">
                {selectedFile.preview ? (
                  <img
                    src={selectedFile.preview}
                    alt="Preview"
                    className="w-16 h-16 object-cover rounded-lg"
                  />
                ) : (
                  <div className="w-16 h-16 bg-blue-100 rounded-lg flex items-center justify-center">
                    {React.createElement(getFileIcon(selectedFile.type), {
                      className: 'w-8 h-8 text-blue-600'
                    })}
                  </div>
                )}
              </div>
              
              <div className="flex-1 min-w-0">
                <h4 className="text-lg font-semibold text-gray-900 truncate">
                  {selectedFile.name}
                </h4>
                <p className="text-sm text-gray-600 mb-2">
                  {formatFileSize(selectedFile.size)} • {selectedFile.type?.split('/')[1]?.toUpperCase() || 'FILE'}
                </p>
                
                <div className="flex items-center space-x-2">
                  <CheckCircle className="w-4 h-4 text-green-600" />
                  <span className="text-sm text-green-600 font-medium">
                    Ready for analysis
                  </span>
                </div>
              </div>
              
              <button
                onClick={removeFile}
                className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Analysis Mode Selection */}
            <AnalysisModeSelector
              selectedMode={analysisMode}
              onModeSelect={setAnalysisMode}
              className="mb-6"
            />

            {/* Analyze Button */}
            <motion.button
              onClick={handleAnalyze}
              disabled={isUploading}
              className="w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white px-8 py-4 rounded-xl font-semibold text-lg shadow-lg hover:shadow-xl transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              {isUploading ? (
                <div className="flex items-center justify-center space-x-2">
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  <span>Analyzing Document...</span>
                </div>
              ) : (
                <div className="flex items-center justify-center space-x-2">
                  <Sparkles className="w-5 h-5" />
                  <span>Start Premium Analysis</span>
                </div>
              )}
            </motion.button>
          </motion.div>
        )}
      </div>

      {/* Error Message */}
      <AnimatePresence>
        {uploadError && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="bg-red-50 border border-red-200 rounded-xl p-4 flex items-start space-x-3"
          >
            <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
            <div>
              <h4 className="font-semibold text-red-800">Upload Error</h4>
              <p className="text-red-700">{uploadError}</p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Features Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">
        <div className="text-center p-6 bg-white rounded-xl shadow-lg border border-gray-100">
          <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <Sparkles className="w-6 h-6 text-blue-600" />
          </div>
          <h3 className="font-semibold text-gray-900 mb-2">100% AI Accuracy</h3>
          <p className="text-gray-600 text-sm">
            Powered by Google Gemini AI for maximum precision and reliability in document analysis.
          </p>
        </div>

        <div className="text-center p-6 bg-white rounded-xl shadow-lg border border-gray-100">
          <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <Shield className="w-6 h-6 text-green-600" />
          </div>
          <h3 className="font-semibold text-gray-900 mb-2">Secure & Private</h3>
          <p className="text-gray-600 text-sm">
            Your documents are processed securely and never stored permanently on our servers.
          </p>
        </div>

        <div className="text-center p-6 bg-white rounded-xl shadow-lg border border-gray-100">
          <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <Clock className="w-6 h-6 text-purple-600" />
          </div>
          <h3 className="font-semibold text-gray-900 mb-2">Lightning Fast</h3>
          <p className="text-gray-600 text-sm">
            Get comprehensive analysis in seconds, not hours. Perfect for time-sensitive decisions.
          </p>
        </div>
      </div>
    </div>
  );
};

export default DocumentUpload;