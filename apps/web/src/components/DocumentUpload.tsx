'use client';

import React, { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Upload, 
  File, 
  FileText,
  Image,
  X,
  CheckCircle,
  AlertCircle,
  Loader2,
  Brain,
  Search,
  MessageSquare,
  Download,
  Trash2
} from 'lucide-react';

interface UploadedFile {
  id: string;
  name: string;
  size: number;
  type: string;
  progress: number;
  status: 'uploading' | 'processing' | 'completed' | 'error';
  url?: string;
  analysis?: {
    textContent: string;
    confidence: number;
    risks: Array<{
      type: string;
      severity: string;
      description: string;
    }>;
    summary: string;
  };
}

export default function DocumentUpload() {
  const [files, setFiles] = useState<UploadedFile[]>([]);
  const [isDragActive, setIsDragActive] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setIsDragActive(true);
    } else if (e.type === 'dragleave') {
      setIsDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragActive(false);

    const droppedFiles = Array.from(e.dataTransfer.files);
    handleFiles(droppedFiles);
  };

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFiles = Array.from(e.target.files || []);
    handleFiles(selectedFiles);
  };

  const handleFiles = async (fileList: File[]) => {
    if (fileList.length === 0) return;

    setIsUploading(true);

    const newFiles: UploadedFile[] = fileList.map(file => ({
      id: Math.random().toString(36).substring(7),
      name: file.name,
      size: file.size,
      type: file.type,
      progress: 0,
      status: 'uploading'
    }));

    setFiles(prev => [...prev, ...newFiles]);

    // Simulate file upload and processing
    for (const newFile of newFiles) {
      // Simulate upload progress
      for (let progress = 0; progress <= 100; progress += 20) {
        await new Promise(resolve => setTimeout(resolve, 200));
        setFiles(prev => prev.map(f => 
          f.id === newFile.id ? { ...f, progress } : f
        ));
      }

      // Mark as processing
      setFiles(prev => prev.map(f => 
        f.id === newFile.id ? { ...f, status: 'processing', progress: 100 } : f
      ));

      // Simulate AI processing
      await new Promise(resolve => setTimeout(resolve, 3000));

      // Mock processing results
      const mockAnalysis = {
        textContent: `Extracted text from ${newFile.name}. This document contains important legal information and clauses that have been analyzed by our AI system.`,
        confidence: 94.5 + Math.random() * 5,
        risks: [
          {
            type: 'liability',
            severity: 'medium',
            description: 'Liability clause detected - review recommended'
          },
          {
            type: 'termination',
            severity: 'low',
            description: 'Standard termination clause present'
          }
        ],
        summary: 'This appears to be a legal document with standard terms and conditions. Key areas include liability, payment terms, and termination clauses.'
      };

      setFiles(prev => prev.map(f => 
        f.id === newFile.id ? { 
          ...f, 
          status: 'completed', 
          analysis: mockAnalysis,
          url: `https://example.com/documents/${newFile.id}`
        } : f
      ));
    }

    setIsUploading(false);
  };

  const removeFile = (id: string) => {
    setFiles(prev => prev.filter(f => f.id !== id));
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const getFileIcon = (type: string) => {
    if (type.includes('pdf')) return <FileText className="w-6 h-6 text-red-500" />;
    if (type.includes('image')) return <Image className="w-6 h-6 text-green-500" />;
    return <File className="w-6 h-6 text-blue-500" />;
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'uploading':
      case 'processing':
        return <Loader2 className="w-5 h-5 animate-spin text-blue-500" />;
      case 'completed':
        return <CheckCircle className="w-5 h-5 text-green-500" />;
      case 'error':
        return <AlertCircle className="w-5 h-5 text-red-500" />;
      default:
        return null;
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6">
      {/* Upload Area */}
      <div
        className={`relative border-2 border-dashed rounded-2xl p-12 text-center transition-all duration-300 ${
          isDragActive
            ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/10'
            : 'border-gray-300 dark:border-gray-600 hover:border-gray-400 dark:hover:border-gray-500'
        }`}
        onDragEnter={handleDrag}
        onDragLeave={handleDrag}
        onDragOver={handleDrag}
        onDrop={handleDrop}
      >
        <input
          ref={fileInputRef}
          type="file"
          multiple
          accept=".pdf,.doc,.docx,.txt,.png,.jpg,.jpeg"
          onChange={handleFileInput}
          className="hidden"
        />

        <div className="space-y-4">
          <div className="flex justify-center">
            <div className="p-4 bg-blue-100 dark:bg-blue-900/30 rounded-full">
              <Upload className="w-8 h-8 text-blue-600 dark:text-blue-400" />
            </div>
          </div>

          <div>
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
              Upload Legal Documents
            </h3>
            <p className="text-gray-600 dark:text-gray-400">
              Drag and drop files here, or{' '}
              <button
                onClick={() => fileInputRef.current?.click()}
                className="text-blue-600 dark:text-blue-400 font-medium hover:text-blue-700 dark:hover:text-blue-300"
              >
                browse to choose files
              </button>
            </p>
          </div>

          <div className="text-sm text-gray-500 dark:text-gray-400">
            Supports PDF, DOC, DOCX, TXT, PNG, JPG (Max 10MB per file)
          </div>
        </div>

        {isDragActive && (
          <div className="absolute inset-0 bg-blue-500/10 rounded-2xl flex items-center justify-center">
            <div className="text-blue-600 dark:text-blue-400 font-medium">
              Drop files here to upload
            </div>
          </div>
        )}
      </div>

      {/* File List */}
      {files.length > 0 && (
        <div className="mt-8 space-y-4">
          <h4 className="text-lg font-semibold text-gray-900 dark:text-white">
            Uploaded Documents ({files.length})
          </h4>

          <AnimatePresence>
            {files.map((file) => (
              <motion.div
                key={file.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="bg-white dark:bg-gray-800 rounded-xl p-4 border border-gray-200 dark:border-gray-700 shadow-sm"
              >
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-3">
                    {getFileIcon(file.type)}
                    <div>
                      <h5 className="font-medium text-gray-900 dark:text-white">
                        {file.name}
                      </h5>
                      <p className="text-sm text-gray-500 dark:text-gray-400">
                        {formatFileSize(file.size)}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    {getStatusIcon(file.status)}
                    <span className="text-sm capitalize text-gray-600 dark:text-gray-400">
                      {file.status}
                    </span>
                    <button
                      onClick={() => removeFile(file.id)}
                      className="p-1 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full transition-colors"
                    >
                      <X className="w-4 h-4 text-gray-400" />
                    </button>
                  </div>
                </div>

                {/* Progress Bar */}
                {(file.status === 'uploading' || file.status === 'processing') && (
                  <div className="mb-3">
                    <div className="flex justify-between text-sm text-gray-600 dark:text-gray-400 mb-1">
                      <span>
                        {file.status === 'uploading' ? 'Uploading...' : 'Processing with AI...'}
                      </span>
                      <span>{file.progress}%</span>
                    </div>
                    <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                      <div
                        className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                        style={{ width: `${file.progress}%` }}
                      />
                    </div>
                  </div>
                )}

                {/* Analysis Results */}
                {file.status === 'completed' && file.analysis && (
                  <div className="border-t border-gray-200 dark:border-gray-600 pt-4 mt-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                      <div className="bg-green-50 dark:bg-green-900/20 p-3 rounded-lg">
                        <div className="flex items-center gap-2 mb-1">
                          <Brain className="w-4 h-4 text-green-600 dark:text-green-400" />
                          <span className="text-sm font-medium text-green-800 dark:text-green-300">
                            AI Confidence
                          </span>
                        </div>
                        <div className="text-lg font-semibold text-green-600 dark:text-green-400">
                          {file.analysis.confidence.toFixed(1)}%
                        </div>
                      </div>

                      <div className="bg-orange-50 dark:bg-orange-900/20 p-3 rounded-lg">
                        <div className="flex items-center gap-2 mb-1">
                          <AlertCircle className="w-4 h-4 text-orange-600 dark:text-orange-400" />
                          <span className="text-sm font-medium text-orange-800 dark:text-orange-300">
                            Risks Detected
                          </span>
                        </div>
                        <div className="text-lg font-semibold text-orange-600 dark:text-orange-400">
                          {file.analysis.risks.length}
                        </div>
                      </div>
                    </div>

                    <div className="mb-4">
                      <h6 className="font-medium text-gray-900 dark:text-white mb-2">Summary</h6>
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        {file.analysis.summary}
                      </p>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex gap-2">
                      <button className="flex items-center gap-2 px-3 py-2 bg-blue-600 text-white text-sm rounded-lg hover:bg-blue-700 transition-colors">
                        <MessageSquare className="w-4 h-4" />
                        Ask Questions
                      </button>
                      <button className="flex items-center gap-2 px-3 py-2 bg-green-600 text-white text-sm rounded-lg hover:bg-green-700 transition-colors">
                        <Search className="w-4 h-4" />
                        Analyze Risks
                      </button>
                      <button className="flex items-center gap-2 px-3 py-2 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 text-sm rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
                        <Download className="w-4 h-4" />
                        Download
                      </button>
                    </div>
                  </div>
                )}
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      )}
    </div>
  );
}