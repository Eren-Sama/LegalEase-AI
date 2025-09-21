import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  try {
    // Mock user profile data for now
    // In a real app, you'd get this from your authentication system
    const userProfile = {
      id: 'user_123',
      name: 'Demo User',
      email: 'demo@legalease-ai.com',
      avatar: null,
      subscription: 'free',
      documentsAnalyzed: 5,
      memberSince: new Date('2025-01-01').toISOString(),
      settings: {
        notifications: true,
        theme: 'light',
        language: 'en'
      }
    };

    return NextResponse.json({
      success: true,
      data: userProfile
    });

  } catch (error) {
    console.error('Profile fetch error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch user profile' },
      { status: 500 }
    );
  }
}

export async function PUT(request: NextRequest) {
  try {
    const updates = await request.json();
    
    // Mock profile update
    // In a real app, you'd update the user profile in your database
    console.log('Updating profile with:', updates);
    
    const updatedProfile = {
      id: 'user_123',
      name: updates.name || 'Demo User',
      email: updates.email || 'demo@legalease-ai.com',
      avatar: updates.avatar || null,
      subscription: 'free',
      documentsAnalyzed: 5,
      memberSince: new Date('2025-01-01').toISOString(),
      settings: {
        notifications: updates.settings?.notifications ?? true,
        theme: updates.settings?.theme || 'light',
        language: updates.settings?.language || 'en'
      }
    };

    return NextResponse.json({
      success: true,
      message: 'Profile updated successfully',
      data: updatedProfile
    });

  } catch (error) {
    console.error('Profile update error:', error);
    return NextResponse.json(
      { error: 'Failed to update user profile' },
      { status: 500 }
    );
  }
}