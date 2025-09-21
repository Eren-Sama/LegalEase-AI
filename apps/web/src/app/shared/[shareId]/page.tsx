'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import EnhancedAnalysisResults from '@/components/EnhancedAnalysisResults';
import { Shield, Clock, Eye, AlertTriangle, CheckCircle } from 'lucide-react';

export default function SharedAnalysisPage() {
  const params = useParams();
  const shareId = params?.shareId as string;
  const [analysisData, setAnalysisData] = useState<any>(null);
  const [metadata, setMetadata] = useState<{
    createdAt: string;
    expiresAt: string;
    accessCount: number;
    maxAccess?: number;
  } | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!shareId) {
      setError('Invalid share link');
      setLoading(false);
      return;
    }

    const fetchSharedAnalysis = async () => {
      try {
        const response = await fetch(`/api/share-analysis?shareId=${shareId}`);
        const result = await response.json();

        if (!response.ok) {
          throw new Error(result.error || 'Failed to load shared analysis');
        }

        setAnalysisData(result.data);
        setMetadata(result.metadata);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load analysis');
      } finally {
        setLoading(false);
      }
    };

    fetchSharedAnalysis();
  }, [shareId]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 to-blue-50 dark:from-gray-900 dark:to-gray-800">
        <div className="text-center p-8">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600 mx-auto mb-4"></div>
          <p className="text-gray-600 dark:text-gray-400">Loading shared analysis...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 to-red-50 dark:from-gray-900 dark:to-red-900">
        <div className="text-center p-8 max-w-md">
          <div className="mb-4">
            <AlertTriangle className="w-16 h-16 text-red-500 mx-auto" />
          </div>
          <h1 className="text-2xl font-bold text-red-700 dark:text-red-300 mb-4">
            Access Denied
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mb-6">
            {error}
          </p>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            This could happen if the link has expired, reached its access limit, or was never valid.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 dark:from-gray-900 dark:to-gray-800">
      {/* Shared Analysis Info Banner */}
      <div className="bg-blue-600 text-white px-6 py-4 shadow-lg">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <Shield className="w-6 h-6" />
            <div>
              <h1 className="text-lg font-semibold">Shared Legal Analysis</h1>
              <p className="text-sm text-blue-100">
                This analysis was shared with you by someone using LegalEase AI
              </p>
            </div>
          </div>
          
          {metadata && (
            <div className="flex items-center space-x-6 text-sm">
              <div className="flex items-center space-x-2">
                <Clock className="w-4 h-4" />
                <span>
                  Expires: {new Date(metadata.expiresAt).toLocaleDateString()}
                </span>
              </div>
              <div className="flex items-center space-x-2">
                <Eye className="w-4 h-4" />
                <span>
                  Views: {metadata.accessCount}{metadata.maxAccess ? `/${metadata.maxAccess}` : ''}
                </span>
              </div>
              <div className="flex items-center space-x-2">
                <CheckCircle className="w-4 h-4 text-green-300" />
                <span>Verified</span>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Analysis Content */}
      {analysisData && (
        <EnhancedAnalysisResults
          results={analysisData}
          onDownload={async () => {
            // Import and use PDF generator
            const { generateAnalysisPDF } = await import('@/utils/pdfGenerator');
            try {
              const fileName = `shared-legal-analysis-${new Date().toISOString().split('T')[0]}.pdf`;
              await generateAnalysisPDF(analysisData, fileName);
            } catch (error) {
              console.error('PDF download failed:', error);
            }
          }}
        />
      )}

      {/* Footer */}
      <div className="bg-gray-100 dark:bg-gray-800 px-6 py-8 mt-8">
        <div className="max-w-7xl mx-auto text-center">
          <p className="text-gray-600 dark:text-gray-400 text-sm mb-2">
            Want to analyze your own legal documents?
          </p>
          <a
            href="/"
            className="inline-block px-6 py-2 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-lg hover:from-purple-700 hover:to-pink-700 transition-all shadow-lg"
          >
            Try LegalEase AI
          </a>
        </div>
      </div>
    </div>
  );
}