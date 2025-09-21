'use client';

import * as React from 'react';

export interface TooltipProviderProps {
  children: React.ReactNode;
  delayDuration?: number;
}

// Simple tooltip provider for now
export function TooltipProvider({ children, delayDuration }: TooltipProviderProps) {
  return <>{children}</>;
}