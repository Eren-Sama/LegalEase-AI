import { NextRequest, NextResponse } from 'next/server';

export async function GET(req: NextRequest) {
  try {
    console.log('🔍 Testing Google Cloud Configuration...');
    
    // Check environment variables
    const projectId = process.env.GOOGLE_CLOUD_PROJECT_ID;
    const processorId = process.env.DOCUMENT_AI_PROCESSOR_ID;
    const location = process.env.GOOGLE_CLOUD_LOCATION;
    const credentialsPath = process.env.GOOGLE_APPLICATION_CREDENTIALS;
    
    console.log('📋 Environment Variables:');
    console.log('- GOOGLE_CLOUD_PROJECT_ID:', projectId ? '✅ Set' : '❌ Missing');
    console.log('- DOCUMENT_AI_PROCESSOR_ID:', processorId ? '✅ Set' : '❌ Missing');
    console.log('- GOOGLE_CLOUD_LOCATION:', location ? '✅ Set' : '❌ Missing');
    console.log('- GOOGLE_APPLICATION_CREDENTIALS:', credentialsPath ? '✅ Set' : '❌ Missing');
    
    // Test if Google Cloud is configured (same logic as in analyze-document)
    const isGoogleCloudConfigured = !!(projectId && processorId && location && credentialsPath);
    console.log('🎯 Google Cloud Configured:', isGoogleCloudConfigured ? '✅ YES' : '❌ NO');
    
    if (!isGoogleCloudConfigured) {
      const missingVars = [];
      if (!projectId) missingVars.push('GOOGLE_CLOUD_PROJECT_ID');
      if (!processorId) missingVars.push('DOCUMENT_AI_PROCESSOR_ID');
      if (!location) missingVars.push('GOOGLE_CLOUD_LOCATION');
      if (!credentialsPath) missingVars.push('GOOGLE_APPLICATION_CREDENTIALS');
      
      console.log('❌ Missing variables:', missingVars.join(', '));
    }
    
    return NextResponse.json({
      success: true,
      googleCloudConfigured: isGoogleCloudConfigured,
      configuration: {
        projectId: projectId ? 'Set' : 'Missing',
        processorId: processorId ? 'Set' : 'Missing',
        location: location ? 'Set' : 'Missing',
        credentialsPath: credentialsPath ? 'Set' : 'Missing'
      },
      message: isGoogleCloudConfigured 
        ? 'Google Cloud is properly configured! ✅' 
        : 'Google Cloud configuration incomplete ❌'
    });
    
  } catch (error) {
    console.error('❌ Error testing configuration:', error);
    return NextResponse.json({
      success: false,
      error: 'Failed to test configuration'
    }, { status: 500 });
  }
}