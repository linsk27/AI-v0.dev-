'use client'

import { cn } from '@/lib/utils'
import { Check, Circle, Clock, Zap } from 'lucide-react'
import { ProgressBar } from './progress-ring'

interface TimelineItemProps {
  title: string
  subtitle?: string
  description?: string
  progress?: number
  isActive?: boolean
  isCompleted?: boolean
  isLast?: boolean
  onClick?: () => void
  children?: React.ReactNode
  icon?: React.ReactNode
}

export function TimelineItem({
  title,
  subtitle,
  description,
  progress = 0,
  isActive = false,
  isCompleted = false,
  isLast = false,
  onClick,
  children,
  icon
}: TimelineItemProps) {
  return (
    <div className="relative flex gap-4 pb-8">
      {/* Connector line */}
      {!isLast && (
        <div className="absolute left-[19px] top-10 w-0.5 h-[calc(100%-40px)] bg-gradient-to-b from-border to-border/30" />
      )}
      
      {/* Icon */}
      <div 
        className={cn(
          'relative z-10 flex items-center justify-center w-10 h-10 rounded-full border-2 shrink-0 transition-all duration-300',
          isCompleted && 'bg-accent border-accent text-accent-foreground',
          isActive && !isCompleted && 'bg-primary border-primary text-primary-foreground glow-primary',
          !isActive && !isCompleted && 'bg-secondary border-border text-muted-foreground'
        )}
      >
        {icon ? icon : isCompleted ? (
          <Check className="w-5 h-5" />
        ) : isActive ? (
          <Zap className="w-5 h-5" />
        ) : (
          <Circle className="w-4 h-4" />
        )}
      </div>

      {/* Content */}
      <div 
        className={cn(
          'flex-1 group cursor-pointer',
          onClick && 'hover:translate-x-1 transition-transform'
        )}
        onClick={onClick}
      >
        <div className="flex items-center gap-2 mb-1">
          <h4 className={cn(
            'font-semibold transition-colors',
            isActive ? 'text-foreground' : 'text-muted-foreground group-hover:text-foreground'
          )}>
            {title}
          </h4>
          {subtitle && (
            <span className="text-xs px-2 py-0.5 rounded-full bg-secondary text-muted-foreground">
              {subtitle}
            </span>
          )}
        </div>
        {description && (
          <p className="text-sm text-muted-foreground mb-2">{description}</p>
        )}
        {progress !== undefined && progress > 0 && (
          <div className="flex items-center gap-3 mb-2">
            <ProgressBar progress={progress} size="sm" className="max-w-[200px]" />
            <span className="text-xs text-muted-foreground">{progress}%</span>
          </div>
        )}
        {children}
      </div>
    </div>
  )
}

interface MilestoneTimelineProps {
  milestones: {
    id: string
    week: number
    title: string
    description: string
  }[]
  currentWeek: number
  getWeekProgress: (weekNumber: number) => number
}

export function MilestoneTimeline({ milestones, currentWeek, getWeekProgress }: MilestoneTimelineProps) {
  return (
    <div className="relative">
      {/* Background line */}
      <div className="absolute left-0 top-4 w-full h-1 bg-secondary rounded-full" />
      
      {/* Progress line */}
      <div 
        className="absolute left-0 top-4 h-1 bg-gradient-to-r from-primary to-accent rounded-full transition-all duration-500"
        style={{ width: `${Math.min((currentWeek / 12) * 100, 100)}%` }}
      />

      {/* Milestones */}
      <div className="relative flex justify-between">
        {milestones.map((milestone, index) => {
          const isPast = currentWeek > milestone.week
          const isCurrent = currentWeek === milestone.week
          const progress = getWeekProgress(milestone.week)
          
          return (
            <div 
              key={milestone.id}
              className="flex flex-col items-center"
              style={{ 
                position: 'absolute', 
                left: `${(milestone.week / 12) * 100}%`,
                transform: 'translateX(-50%)'
              }}
            >
              <div 
                className={cn(
                  'w-8 h-8 rounded-full flex items-center justify-center border-2 transition-all duration-300',
                  isPast && 'bg-accent border-accent text-accent-foreground',
                  isCurrent && 'bg-primary border-primary text-primary-foreground glow-primary animate-pulse',
                  !isPast && !isCurrent && 'bg-card border-border text-muted-foreground'
                )}
              >
                {isPast ? (
                  <Check className="w-4 h-4" />
                ) : (
                  <span className="text-xs font-bold">{milestone.week}</span>
                )}
              </div>
              <div className="mt-3 text-center max-w-[100px]">
                <p className={cn(
                  'text-xs font-medium',
                  isPast || isCurrent ? 'text-foreground' : 'text-muted-foreground'
                )}>
                  {milestone.title}
                </p>
                <p className="text-[10px] text-muted-foreground mt-0.5 hidden md:block">
                  {milestone.description}
                </p>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
