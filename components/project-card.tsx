'use client'

import { cn } from '@/lib/utils'
import { ProgressRing } from './progress-ring'
import { Folder, Sparkles, Gamepad2, Brain } from 'lucide-react'
import type { Project } from '@/lib/learning-data'

interface ProjectCardProps {
  project: Project & { progress: number }
  index: number
}

const projectIcons = [
  <Folder key="folder" className="w-6 h-6" />,
  <Brain key="brain" className="w-6 h-6" />,
  <Gamepad2 key="gamepad" className="w-6 h-6" />
]

const projectColors = [
  'from-blue-500/20 to-cyan-500/20',
  'from-purple-500/20 to-pink-500/20',
  'from-amber-500/20 to-orange-500/20'
]

export function ProjectCard({ project, index }: ProjectCardProps) {
  const isCompleted = project.progress === 100

  return (
    <div className={cn(
      'group relative rounded-xl border border-border overflow-hidden transition-all duration-300',
      'hover:border-primary/50 hover:shadow-lg hover:shadow-primary/5',
      isCompleted && 'border-accent/50'
    )}>
      {/* Background gradient */}
      <div className={cn(
        'absolute inset-0 bg-gradient-to-br opacity-50',
        projectColors[index % projectColors.length]
      )} />
      
      <div className="relative p-6">
        {/* Header */}
        <div className="flex items-start justify-between mb-4">
          <div className={cn(
            'w-12 h-12 rounded-lg flex items-center justify-center',
            'bg-gradient-to-br from-primary/20 to-accent/20 text-primary',
            isCompleted && 'from-accent/20 to-accent/20 text-accent'
          )}>
            {projectIcons[index % projectIcons.length]}
          </div>
          <ProgressRing progress={project.progress} size={60} strokeWidth={5} />
        </div>

        {/* Content */}
        <h3 className="font-bold text-lg text-foreground mb-2 flex items-center gap-2">
          {project.name}
          {isCompleted && <Sparkles className="w-4 h-4 text-accent" />}
        </h3>
        
        <div className="space-y-3">
          <div>
            <p className="text-xs text-muted-foreground mb-1">核心能力</p>
            <p className="text-sm text-foreground">{project.coreAbility}</p>
          </div>
          <div>
            <p className="text-xs text-muted-foreground mb-1">简历亮点</p>
            <p className="text-sm text-accent">{project.highlight}</p>
          </div>
        </div>

        {/* Status badge */}
        <div className="mt-4 pt-4 border-t border-border/50">
          <div className={cn(
            'inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium',
            isCompleted 
              ? 'bg-accent/20 text-accent' 
              : project.progress > 0 
                ? 'bg-primary/20 text-primary'
                : 'bg-secondary text-muted-foreground'
          )}>
            <span className={cn(
              'w-1.5 h-1.5 rounded-full',
              isCompleted 
                ? 'bg-accent' 
                : project.progress > 0 
                  ? 'bg-primary animate-pulse'
                  : 'bg-muted-foreground'
            )} />
            {isCompleted ? '已完成' : project.progress > 0 ? '进行中' : '未开始'}
          </div>
        </div>
      </div>
    </div>
  )
}
