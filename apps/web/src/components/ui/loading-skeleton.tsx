'use client';

import * as React from 'react';
import { cn } from '@/lib/utils';

interface LoadingSkeletonProps extends React.HTMLAttributes<HTMLDivElement> {
  className?: string;
}

export function LoadingSkeleton({ className, ...props }: LoadingSkeletonProps) {
  return (
    <div
      className={cn('skeleton', className)}
      {...props}
    />
  );
}

interface ShimmerProps extends React.HTMLAttributes<HTMLDivElement> {
  className?: string;
}

export function Shimmer({ className, ...props }: ShimmerProps) {
  return (
    <div
      className={cn('shimmer', className)}
      {...props}
    />
  );
}

interface LoadingSpinnerProps extends React.HTMLAttributes<HTMLDivElement> {
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

export function LoadingSpinner({ size = 'md', className, ...props }: LoadingSpinnerProps) {
  const sizeClasses = {
    sm: 'w-4 h-4',
    md: 'w-6 h-6',
    lg: 'w-8 h-8',
  };

  return (
    <div
      className={cn(
        'loading-spinner',
        sizeClasses[size],
        className
      )}
      {...props}
    />
  );
}

interface LoadingDotsProps extends React.HTMLAttributes<HTMLDivElement> {
  className?: string;
}

export function LoadingDots({ className, ...props }: LoadingDotsProps) {
  return (
    <div className={cn('flex space-x-1', className)} {...props}>
      <div className="w-2 h-2 bg-current rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
      <div className="w-2 h-2 bg-current rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
      <div className="w-2 h-2 bg-current rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
    </div>
  );
}

interface ProgressBarProps extends React.HTMLAttributes<HTMLDivElement> {
  value: number;
  max?: number;
  className?: string;
  showPercentage?: boolean;
}

export function ProgressBar({ 
  value, 
  max = 100, 
  className, 
  showPercentage = false,
  ...props 
}: ProgressBarProps) {
  const percentage = Math.min((value / max) * 100, 100);

  return (
    <div className={cn('w-full', className)} {...props}>
      <div className="flex justify-between mb-1">
        {showPercentage && (
          <span className="text-xs font-medium text-muted-foreground">
            {Math.round(percentage)}%
          </span>
        )}
      </div>
      <div className="w-full bg-muted rounded-full h-2">
        <div
          className="bg-primary h-2 rounded-full transition-all duration-300 ease-out"
          style={{ width: `${percentage}%` }}
        />
      </div>
    </div>
  );
}

interface LoadingOverlayProps {
  isLoading: boolean;
  children: React.ReactNode;
  loadingText?: string;
  className?: string;
}

export function LoadingOverlay({ 
  isLoading, 
  children, 
  loadingText = 'Loading...',
  className 
}: LoadingOverlayProps) {
  return (
    <div className={cn('relative', className)}>
      {children}
      
      {isLoading && (
        <div className="absolute inset-0 bg-background/80 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="flex flex-col items-center space-y-4">
            <LoadingSpinner size="lg" />
            {loadingText && (
              <p className="text-sm text-muted-foreground">{loadingText}</p>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

interface SkeletonCardProps extends React.HTMLAttributes<HTMLDivElement> {
  className?: string;
}

export function SkeletonCard({ className, ...props }: SkeletonCardProps) {
  return (
    <div className={cn('card p-6', className)} {...props}>
      <div className="space-y-4">
        <LoadingSkeleton className="h-6 w-3/4" />
        <div className="space-y-2">
          <LoadingSkeleton className="h-4 w-full" />
          <LoadingSkeleton className="h-4 w-full" />
          <LoadingSkeleton className="h-4 w-2/3" />
        </div>
        <div className="flex space-x-2">
          <LoadingSkeleton className="h-8 w-20" />
          <LoadingSkeleton className="h-8 w-20" />
        </div>
      </div>
    </div>
  );
}

interface SkeletonListProps extends React.HTMLAttributes<HTMLDivElement> {
  count?: number;
  className?: string;
}

export function SkeletonList({ count = 3, className, ...props }: SkeletonListProps) {
  return (
    <div className={cn('space-y-4', className)} {...props}>
      {Array.from({ length: count }, (_, i) => (
        <div key={i} className="flex items-center space-x-4">
          <LoadingSkeleton className="h-12 w-12 rounded-full" />
          <div className="flex-1 space-y-2">
            <LoadingSkeleton className="h-4 w-3/4" />
            <LoadingSkeleton className="h-3 w-1/2" />
          </div>
        </div>
      ))}
    </div>
  );
}

interface PulseProps extends React.HTMLAttributes<HTMLDivElement> {
  className?: string;
}

export function Pulse({ className, ...props }: PulseProps) {
  return (
    <div
      className={cn('animate-pulse bg-muted rounded', className)}
      {...props}
    />
  );
}