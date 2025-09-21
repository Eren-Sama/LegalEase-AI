import { NextRequest, NextResponse } from 'next/server';

export async function GET() {
  try {
    // Check if Google Cloud is properly configured
    const projectId = process.env.GOOGLE_CLOUD_PROJECT;
    const processorId = process.env.GOOGLE_DOCUMENT_AI_PROCESSOR_ID;
    const location = process.env.GOOGLE_DOCUMENT_AI_LOCATION || 'us';

    const status = {
      googleCloudConfigured: !!(projectId && processorId),
      projectId: projectId ? projectId.substring(0, 10) + '...' : 'Not configured',
      location,
      processorConfigured: !!processorId,
      timestamp: new Date().toISOString()
    };

    // Try to initialize Google Cloud client (without making API call)
    let clientStatus = 'Not tested';
    try {
      const { DocumentProcessorServiceClient } = await import('@google-cloud/documentai');
      const client = new DocumentProcessorServiceClient();
      clientStatus = 'Initialized successfully';
    } catch (error) {
      clientStatus = `Initialization failed: ${error instanceof Error ? error.message : 'Unknown error'}`;
    }

    return NextResponse.json({
      status: 'LegalEase AI Backend Operational',
      aiIntegration: status,
      googleCloudClient: clientStatus,
      recommendations: {
        realAI: status.googleCloudConfigured ? 
          '✅ Google Document AI is configured and ready' :
          '⚠️ Configure Google Cloud credentials for real AI analysis',
        fallback: '✅ Enhanced mock analysis available as fallback'
      }
    });

  } catch (error) {
    return NextResponse.json({
      status: 'Error',
      error: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
}