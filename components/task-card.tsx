'use client'

import { cn } from '@/lib/utils'
import { Check, ChevronDown, ChevronRight, Circle } from 'lucide-react'
import { useState } from 'react'
import type { Task, Week } from '@/lib/learning-data'
import { ProgressBar } from './progress-ring'

interface TaskItemProps {
  task: Task
  isCompleted: boolean
  onToggle: () => void
}

function TaskItem({ task, isCompleted, onToggle }: TaskItemProps) {
  return (
    <div 
      className={cn(
        'group flex items-start gap-3 p-3 rounded-lg transition-all duration-200 cursor-pointer',
        'hover:bg-secondary/50',
        isCompleted && 'bg-accent/10'
      )}
      onClick={onToggle}
    >
      <button
        className={cn(
          'mt-0.5 w-5 h-5 rounded-full border-2 flex items-center justify-center shrink-0 transition-all duration-200',
          isCompleted 
            ? 'bg-accent border-accent text-accent-foreground' 
            : 'border-muted-foreground/30 group-hover:border-primary'
        )}
      >
        {isCompleted && <Check className="w-3 h-3" />}
      </button>
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 mb-1">
          <span className="text-xs px-2 py-0.5 rounded bg-secondary text-muted-foreground font-mono">
            Day {task.day}
          </span>
          <h5 className={cn(
            'font-medium text-sm truncate',
            isCompleted ? 'text-muted-foreground line-through' : 'text-foreground'
          )}>
            {task.title}
          </h5>
        </div>
        <p className="text-xs text-muted-foreground mb-1">{task.practice}</p>
        <div className="flex items-center gap-1 text-xs text-accent">
          <Circle className="w-2 h-2 fill-current" />
          <span>{task.output}</span>
        </div>
      </div>
    </div>
  )
}

interface WeekCardProps {
  week: Week
  completedTasks: Set<string>
  onToggleTask: (taskId: string) => void
  progress: number
  isActive?: boolean
}

export function WeekCard({ 
  week, 
  completedTasks, 
  onToggleTask, 
  progress,
  isActive = false
}: WeekCardProps) {
  const [isExpanded, setIsExpanded] = useState(isActive)

  return (
    <div 
      className={cn(
        'rounded-xl border transition-all duration-300',
        isActive ? 'border-primary/50 bg-card glow-primary' : 'border-border bg-card/50',
        isExpanded && 'shadow-lg'
      )}
    >
      {/* Header */}
      <button
        className="w-full p-4 flex items-center gap-4 text-left"
        onClick={() => setIsExpanded(!isExpanded)}
      >
        <div className={cn(
          'w-12 h-12 rounded-lg flex items-center justify-center font-bold text-lg shrink-0',
          isActive 
            ? 'bg-gradient-to-br from-primary to-accent text-primary-foreground' 
            : progress === 100 
              ? 'bg-accent text-accent-foreground'
              : 'bg-secondary text-muted-foreground'
        )}>
          {week.weekNumber}
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2">
            <h3 className="font-semibold text-foreground">{week.title}</h3>
            {progress === 100 && (
              <span className="text-xs px-2 py-0.5 rounded-full bg-accent/20 text-accent">
                已完成
              </span>
            )}
          </div>
          <p className="text-sm text-muted-foreground truncate">{week.goal}</p>
          <ProgressBar progress={progress} size="sm" className="mt-2 max-w-[300px]" />
        </div>
        <div className="shrink-0 text-muted-foreground">
          {isExpanded ? <ChevronDown className="w-5 h-5" /> : <ChevronRight className="w-5 h-5" />}
        </div>
      </button>

      {/* Tasks */}
      {isExpanded && (
        <div className="px-4 pb-4 border-t border-border/50">
          <div className="pt-4 space-y-1">
            {week.tasks.map(task => (
              <TaskItem
                key={task.id}
                task={task}
                isCompleted={completedTasks.has(task.id)}
                onToggle={() => onToggleTask(task.id)}
              />
            ))}
          </div>
          <div className="mt-4 p-3 rounded-lg bg-secondary/50 border border-border/50">
            <p className="text-xs text-muted-foreground mb-1">本周输出</p>
            <p className="text-sm text-foreground font-medium">{week.weekOutput}</p>
          </div>
        </div>
      )}
    </div>
  )
}
