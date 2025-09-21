import { NextResponse } from 'next/server';

export async function GET() {
  const envCheck = {
    projectId: process.env.GOOGLE_CLOUD_PROJECT_ID ? '✅ Set' : '❌ Missing',
    processorId: process.env.DOCUMENT_AI_PROCESSOR_ID ? '✅ Set' : '❌ Missing', 
    location: process.env.GOOGLE_CLOUD_LOCATION || 'us-central1 (default)',
    credentialsPath: process.env.GOOGLE_APPLICATION_CREDENTIALS ? '✅ Set' : '❌ Missing',
    actualValues: {
      projectId: process.env.GOOGLE_CLOUD_PROJECT_ID,
      processorId: process.env.DOCUMENT_AI_PROCESSOR_ID,
      location: process.env.GOOGLE_CLOUD_LOCATION,
      credentialsPath: process.env.GOOGLE_APPLICATION_CREDENTIALS
    }
  };

  return NextResponse.json({
    message: 'Google Cloud Environment Check',
    status: envCheck,
    timestamp: new Date().toISOString()
  });
}