'use client'

import { cn } from '@/lib/utils'

interface ProgressRingProps {
  progress: number
  size?: number
  strokeWidth?: number
  className?: string
  showLabel?: boolean
}

export function ProgressRing({ 
  progress, 
  size = 80, 
  strokeWidth = 6,
  className,
  showLabel = true 
}: ProgressRingProps) {
  // Ensure progress is a valid number between 0 and 100
  const safeProgress = Number.isFinite(progress) ? Math.min(100, Math.max(0, progress)) : 0
  const radius = (size - strokeWidth) / 2
  const circumference = radius * 2 * Math.PI
  const offset = circumference - (safeProgress / 100) * circumference

  return (
    <div className={cn('relative inline-flex items-center justify-center', className)}>
      <svg width={size} height={size} className="transform -rotate-90">
        {/* Background circle */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke="currentColor"
          strokeWidth={strokeWidth}
          className="text-secondary"
        />
        {/* Progress circle */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke="currentColor"
          strokeWidth={strokeWidth}
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          className="text-foreground transition-all duration-500 ease-out"
        />
      </svg>
      {showLabel && (
        <span className="absolute text-sm font-semibold text-foreground">
          {safeProgress}%
        </span>
      )}
    </div>
  )
}

interface ProgressBarProps {
  progress: number
  className?: string
  showLabel?: boolean
  size?: 'sm' | 'md' | 'lg'
}

export function ProgressBar({ 
  progress, 
  className,
  showLabel = false,
  size = 'md'
}: ProgressBarProps) {
  // Ensure progress is a valid number between 0 and 100
  const safeProgress = Number.isFinite(progress) ? Math.min(100, Math.max(0, progress)) : 0
  const heights = {
    sm: 'h-1.5',
    md: 'h-2.5',
    lg: 'h-4'
  }

  return (
    <div className={cn('w-full', className)}>
      <div className={cn('w-full bg-secondary rounded-full overflow-hidden', heights[size])}>
        <div 
          className="h-full rounded-full bg-foreground transition-all duration-500 ease-out"
          style={{ width: `${safeProgress}%` }}
        />
      </div>
      {showLabel && (
        <span className="text-xs text-muted-foreground mt-1 block text-right">
          {safeProgress}%
        </span>
      )}
    </div>
  )
}

interface CircularProgressProps {
  progress: number
  size?: number
  className?: string
}

export function CircularProgress({ progress, size = 24, className }: CircularProgressProps) {
  // Ensure progress is a valid number between 0 and 100
  const safeProgress = Number.isFinite(progress) ? Math.min(100, Math.max(0, progress)) : 0
  const strokeWidth = 3
  const radius = (size - strokeWidth) / 2
  const circumference = radius * 2 * Math.PI
  const offset = circumference - (safeProgress / 100) * circumference

  return (
    <svg className={cn('transform -rotate-90', className)} width={size} height={size}>
      <circle
        className="text-secondary"
        strokeWidth={strokeWidth}
        stroke="currentColor"
        fill="transparent"
        r={radius}
        cx={size / 2}
        cy={size / 2}
      />
      <circle
        className="text-foreground"
        strokeWidth={strokeWidth}
        strokeDasharray={circumference}
        strokeDashoffset={offset}
        strokeLinecap="round"
        stroke="currentColor"
        fill="transparent"
        r={radius}
        cx={size / 2}
        cy={size / 2}
      />
    </svg>
  )
}
