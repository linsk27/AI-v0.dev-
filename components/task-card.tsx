'use client'

import { cn } from '@/lib/utils'
import { Check, ChevronDown, ChevronRight, Circle, Plus, Edit3, ExternalLink, BookOpen } from 'lucide-react'
import { useState } from 'react'
import type { Task, Week } from '@/lib/learning-data'
import { ProgressBar } from './progress-ring'

interface TaskItemProps {
  task: Task
  isCompleted: boolean
  onToggle: () => void
  onEdit?: () => void
}

function TaskItem({ task, isCompleted, onToggle, onEdit }: TaskItemProps) {
  return (
    <div 
      className={cn(
        'group flex items-start gap-3 p-3 rounded-lg transition-all duration-200',
        'hover:bg-secondary/50',
        isCompleted && 'bg-muted/30'
      )}
    >
      <button
        onClick={onToggle}
        className={cn(
          'mt-0.5 w-5 h-5 rounded-full border-2 flex items-center justify-center shrink-0 transition-all duration-200',
          isCompleted 
            ? 'bg-foreground border-foreground text-background' 
            : 'border-muted-foreground/40 group-hover:border-foreground'
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
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-1 text-xs text-muted-foreground">
            <Circle className="w-2 h-2 fill-current" />
            <span>{task.output}</span>
          </div>
          {task.resources && task.resources.length > 0 && (
            <div className="flex items-center gap-1">
              {task.resources.map(resource => (
                <a
                  key={resource.id}
                  href={resource.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-1 rounded hover:bg-muted transition-colors text-muted-foreground hover:text-foreground"
                  title={resource.title}
                >
                  {resource.type === 'doc' && <BookOpen className="w-3.5 h-3.5" />}
                  {resource.type === 'article' && <ExternalLink className="w-3.5 h-3.5" />}
                </a>
              ))}
            </div>
          )}
        </div>
      </div>
      {onEdit && (
        <button
          onClick={(e) => {
            e.stopPropagation()
            onEdit()
          }}
          className="opacity-0 group-hover:opacity-100 p-1.5 rounded-lg hover:bg-muted transition-all text-muted-foreground hover:text-foreground"
        >
          <Edit3 className="w-4 h-4" />
        </button>
      )}
    </div>
  )
}

interface WeekCardProps {
  week: Week
  completedTasks: Set<string>
  onToggleTask: (taskId: string) => void
  onEditTask?: (task: Task) => void
  onAddTask?: () => void
  onEditWeek?: () => void
  progress: number
  isActive?: boolean
}

export function WeekCard({ 
  week, 
  completedTasks, 
  onToggleTask, 
  onEditTask,
  onAddTask,
  onEditWeek,
  progress,
  isActive = false
}: WeekCardProps) {
  const [isExpanded, setIsExpanded] = useState(isActive)

  return (
    <div 
      className={cn(
        'rounded-xl border transition-all duration-300',
        isActive ? 'border-foreground/30 bg-card glow-white' : 'border-border bg-card/50',
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
            ? 'bg-foreground text-background' 
            : progress === 100 
              ? 'bg-foreground/80 text-background'
              : 'bg-secondary text-muted-foreground'
        )}>
          {week.weekNumber}
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2">
            <h3 className="font-semibold text-foreground">{week.title}</h3>
            {progress === 100 && (
              <span className="text-xs px-2 py-0.5 rounded-full bg-foreground/10 text-foreground">
                已完成
              </span>
            )}
            {onEditWeek && (
              <button
                onClick={(e) => {
                  e.stopPropagation()
                  onEditWeek()
                }}
                className="opacity-0 group-hover:opacity-100 p-1 rounded hover:bg-muted transition-all text-muted-foreground hover:text-foreground"
              >
                <Edit3 className="w-3.5 h-3.5" />
              </button>
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
          {/* Key Knowledge */}
          {week.keyKnowledge && week.keyKnowledge.length > 0 && (
            <div className="pt-4 pb-2">
              <p className="text-xs text-muted-foreground mb-2">核心知识点</p>
              <div className="flex flex-wrap gap-2">
                {week.keyKnowledge.map((k, i) => (
                  <span key={i} className="text-xs px-2 py-1 rounded-full bg-secondary text-foreground">
                    {k}
                  </span>
                ))}
              </div>
            </div>
          )}
          
          <div className="pt-4 space-y-1">
            {week.tasks.map(task => (
              <TaskItem
                key={task.id}
                task={task}
                isCompleted={completedTasks.has(task.id)}
                onToggle={() => onToggleTask(task.id)}
                onEdit={onEditTask ? () => onEditTask(task) : undefined}
              />
            ))}
          </div>
          
          {/* Add Task Button */}
          {onAddTask && (
            <button
              onClick={onAddTask}
              className="w-full mt-3 p-2 rounded-lg border border-dashed border-border hover:border-foreground/30 text-muted-foreground hover:text-foreground transition-colors flex items-center justify-center gap-2 text-sm"
            >
              <Plus className="w-4 h-4" />
              添加任务
            </button>
          )}
          
          <div className="mt-4 p-3 rounded-lg bg-secondary/50 border border-border/50">
            <p className="text-xs text-muted-foreground mb-1">本周输出</p>
            <p className="text-sm text-foreground font-medium">{week.weekOutput}</p>
          </div>
        </div>
      )}
    </div>
  )
}
