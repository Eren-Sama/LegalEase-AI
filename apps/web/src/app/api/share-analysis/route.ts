import { NextRequest, NextResponse } from 'next/server';
import crypto from 'crypto';

// In a real application, you'd store this in a database
// For now, we'll use in-memory storage (will be lost on server restart)
const sharedAnalyses = new Map<string, {
  data: any;
  createdAt: Date;
  expiresAt: Date;
  accessCount: number;
  maxAccess?: number;
}>();

export async function POST(request: NextRequest) {
  try {
    const { analysisData, expirationHours = 24, maxAccess = 10 } = await request.json();

    if (!analysisData) {
      return NextResponse.json({ error: 'Analysis data is required' }, { status: 400 });
    }

    // Generate a unique share ID
    const shareId = crypto.randomUUID();
    
    // Calculate expiration date
    const expiresAt = new Date();
    expiresAt.setHours(expiresAt.getHours() + expirationHours);

    // Store the shared analysis
    sharedAnalyses.set(shareId, {
      data: analysisData,
      createdAt: new Date(),
      expiresAt,
      accessCount: 0,
      maxAccess
    });

    // Generate the shareable URL
    const baseUrl = process.env.NEXTAUTH_URL || 'http://localhost:3000';
    const shareUrl = `${baseUrl}/shared/${shareId}`;

    return NextResponse.json({
      success: true,
      shareId,
      shareUrl,
      expiresAt: expiresAt.toISOString(),
      maxAccess
    });

  } catch (error) {
    console.error('Error creating shareable link:', error);
    return NextResponse.json(
      { error: 'Failed to create shareable link' },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  try {
    const url = new URL(request.url);
    const shareId = url.searchParams.get('shareId');

    if (!shareId) {
      return NextResponse.json({ error: 'Share ID is required' }, { status: 400 });
    }

    const sharedData = sharedAnalyses.get(shareId);

    if (!sharedData) {
      return NextResponse.json({ error: 'Shared analysis not found' }, { status: 404 });
    }

    // Check if the link has expired
    if (new Date() > sharedData.expiresAt) {
      sharedAnalyses.delete(shareId);
      return NextResponse.json({ error: 'This shared link has expired' }, { status: 410 });
    }

    // Check if access limit has been reached
    if (sharedData.maxAccess && sharedData.accessCount >= sharedData.maxAccess) {
      return NextResponse.json({ error: 'Maximum access limit reached for this link' }, { status: 429 });
    }

    // Increment access count
    sharedData.accessCount++;

    return NextResponse.json({
      success: true,
      data: sharedData.data,
      metadata: {
        createdAt: sharedData.createdAt,
        expiresAt: sharedData.expiresAt,
        accessCount: sharedData.accessCount,
        maxAccess: sharedData.maxAccess
      }
    });

  } catch (error) {
    console.error('Error retrieving shared analysis:', error);
    return NextResponse.json(
      { error: 'Failed to retrieve shared analysis' },
      { status: 500 }
    );
  }
}

// Clean up expired links periodically (this would be better as a cron job)
setInterval(() => {
  const now = new Date();
  for (const [shareId, data] of sharedAnalyses.entries()) {
    if (now > data.expiresAt) {
      sharedAnalyses.delete(shareId);
    }
  }
}, 60 * 60 * 1000); // Run every hour