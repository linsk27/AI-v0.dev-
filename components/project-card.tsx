'use client'

import { cn } from '@/lib/utils'
import { ProgressRing } from './progress-ring'
import { Folder, Sparkles, Gamepad2, Brain, Edit3, Github, ExternalLink } from 'lucide-react'
import type { Project } from '@/lib/learning-data'

interface ProjectCardProps {
  project: Project & { progress: number }
  index: number
  onEdit?: () => void
}

const projectIcons = [
  <Folder key="folder" className="w-6 h-6" />,
  <Brain key="brain" className="w-6 h-6" />,
  <Gamepad2 key="gamepad" className="w-6 h-6" />
]

export function ProjectCard({ project, index, onEdit }: ProjectCardProps) {
  const isCompleted = project.progress === 100
  const isInProgress = project.progress > 0 && project.progress < 100

  return (
    <div className={cn(
      'group relative rounded-xl border border-border overflow-hidden transition-all duration-300 card-hover',
      'hover:border-foreground/30',
      isCompleted && 'border-foreground/20'
    )}>
      {/* Background pattern */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute inset-0 bg-[linear-gradient(45deg,transparent_25%,rgba(255,255,255,0.1)_50%,transparent_75%)]" />
      </div>
      
      <div className="relative p-6">
        {/* Header */}
        <div className="flex items-start justify-between mb-4">
          <div className={cn(
            'w-12 h-12 rounded-lg flex items-center justify-center',
            'bg-secondary text-foreground',
            isCompleted && 'bg-foreground text-background'
          )}>
            {projectIcons[index % projectIcons.length]}
          </div>
          <div className="flex items-center gap-2">
            <ProgressRing progress={project.progress} size={56} strokeWidth={4} />
            {onEdit && (
              <button
                onClick={onEdit}
                className="opacity-0 group-hover:opacity-100 p-2 rounded-lg hover:bg-secondary transition-all text-muted-foreground hover:text-foreground"
              >
                <Edit3 className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>

        {/* Content */}
        <h3 className="font-bold text-lg text-foreground mb-2 flex items-center gap-2">
          {project.name}
          {isCompleted && <Sparkles className="w-4 h-4 text-foreground/60" />}
        </h3>
        
        <div className="space-y-3">
          <div>
            <p className="text-xs text-muted-foreground mb-1">核心能力</p>
            <p className="text-sm text-foreground">{project.coreAbility}</p>
          </div>
          <div>
            <p className="text-xs text-muted-foreground mb-1">简历亮点</p>
            <p className="text-sm text-foreground/80">{project.highlight}</p>
          </div>
        </div>

        {/* Tech Stack */}
        {project.techStack && project.techStack.length > 0 && (
          <div className="mt-4 pt-4 border-t border-border/50">
            <p className="text-xs text-muted-foreground mb-2">技术栈</p>
            <div className="flex flex-wrap gap-1.5">
              {project.techStack.map(tech => (
                <span
                  key={tech}
                  className="px-2 py-0.5 rounded text-xs bg-secondary text-foreground"
                >
                  {tech}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* Status & Week Range */}
        <div className="mt-4 pt-4 border-t border-border/50 flex items-center justify-between">
          <div className={cn(
            'inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium',
            isCompleted 
              ? 'bg-foreground/10 text-foreground' 
              : isInProgress 
                ? 'bg-foreground/5 text-foreground/80'
                : 'bg-secondary text-muted-foreground'
          )}>
            <span className={cn(
              'w-1.5 h-1.5 rounded-full',
              isCompleted 
                ? 'bg-foreground' 
                : isInProgress 
                  ? 'bg-foreground/60 animate-pulse-subtle'
                  : 'bg-muted-foreground'
            )} />
            {isCompleted ? '已完成' : isInProgress ? '进行中' : '未开始'}
          </div>
          <span className="text-xs text-muted-foreground">
            第 {project.weekRange[0]}-{project.weekRange[1]} 周
          </span>
        </div>
      </div>
    </div>
  )
}

interface ProjectListProps {
  projects: (Project & { progress: number })[]
  onEdit?: (project: Project) => void
  onAdd?: () => void
}

export function ProjectList({ projects, onEdit, onAdd }: ProjectListProps) {
  return (
    <div className="space-y-6">
      <div className="grid md:grid-cols-3 gap-6">
        {projects.map((project, index) => (
          <ProjectCard 
            key={project.id} 
            project={project} 
            index={index} 
            onEdit={onEdit ? () => onEdit(project) : undefined}
          />
        ))}
      </div>
      
      {onAdd && (
        <button
          onClick={onAdd}
          className="w-full p-4 rounded-xl border border-dashed border-border hover:border-foreground/30 text-muted-foreground hover:text-foreground transition-colors flex items-center justify-center gap-2"
        >
          <Folder className="w-5 h-5" />
          添加新项目
        </button>
      )}
    </div>
  )
}
