'use client';

import * as React from 'react';

// Simple toast hook for now - will be replaced with proper toast implementation
export function useToast() {
  const toast = React.useCallback(({ title, description, variant }: {
    title?: string;
    description?: string;
    variant?: 'default' | 'destructive';
  }) => {
    // Simple console.log for now - will implement proper toast later
    console.log('Toast:', { title, description, variant });
  }, []);

  return { toast };
}

export const toast = ({ title, description, variant }: {
  title?: string;
  description?: string;
  variant?: 'default' | 'destructive';
}) => {
  console.log('Toast:', { title, description, variant });
};

export function Toaster() {
  return null; // Will implement proper toaster later
}