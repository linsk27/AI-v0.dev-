'use client'

import { cn } from '@/lib/utils'
import { ProgressRing } from './progress-ring'
import { Calendar, CheckCircle, Target, TrendingUp } from 'lucide-react'

interface StatsPanelProps {
  totalProgress: number
  completedTasks: number
  totalTasks: number
  currentWeek: number
  totalWeeks: number
}

export function StatsPanel({ 
  totalProgress, 
  completedTasks, 
  totalTasks,
  currentWeek,
  totalWeeks
}: StatsPanelProps) {
  const stats = [
    {
      label: '总体进度',
      value: `${totalProgress}%`,
      icon: <TrendingUp className="w-5 h-5" />,
      color: 'text-primary',
      bgColor: 'bg-primary/10'
    },
    {
      label: '已完成任务',
      value: `${completedTasks}/${totalTasks}`,
      icon: <CheckCircle className="w-5 h-5" />,
      color: 'text-accent',
      bgColor: 'bg-accent/10'
    },
    {
      label: '当前周次',
      value: `第 ${currentWeek} 周`,
      icon: <Calendar className="w-5 h-5" />,
      color: 'text-blue-400',
      bgColor: 'bg-blue-400/10'
    },
    {
      label: '剩余周次',
      value: `${totalWeeks - currentWeek} 周`,
      icon: <Target className="w-5 h-5" />,
      color: 'text-amber-400',
      bgColor: 'bg-amber-400/10'
    }
  ]

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
      {stats.map((stat, index) => (
        <div 
          key={index}
          className="p-4 rounded-xl bg-card border border-border hover:border-primary/30 transition-colors"
        >
          <div className="flex items-center gap-3">
            <div className={cn('p-2 rounded-lg', stat.bgColor, stat.color)}>
              {stat.icon}
            </div>
            <div>
              <p className="text-xs text-muted-foreground">{stat.label}</p>
              <p className={cn('text-lg font-bold', stat.color)}>{stat.value}</p>
            </div>
          </div>
        </div>
      ))}
    </div>
  )
}

interface HeroStatsProps {
  totalProgress: number
  monthProgress: { month: number; progress: number }[]
}

export function HeroStats({ totalProgress, monthProgress }: HeroStatsProps) {
  return (
    <div className="flex flex-col md:flex-row items-center gap-8 p-8 rounded-2xl bg-gradient-to-br from-card to-secondary/30 border border-border">
      <ProgressRing progress={totalProgress} size={140} strokeWidth={10} />
      
      <div className="flex-1 text-center md:text-left">
        <h2 className="text-2xl font-bold text-foreground mb-2">
          AI 工程师学习之旅
        </h2>
        <p className="text-muted-foreground mb-4">
          3 个月 · 12 周 · 84 天 · 冲刺 AI 应用工程师
        </p>
        
        <div className="flex flex-wrap gap-4 justify-center md:justify-start">
          {monthProgress.map(({ month, progress }) => (
            <div key={month} className="flex items-center gap-2">
              <div className={cn(
                'w-8 h-8 rounded-lg flex items-center justify-center text-sm font-bold',
                progress === 100 
                  ? 'bg-accent text-accent-foreground' 
                  : progress > 0 
                    ? 'bg-primary/20 text-primary' 
                    : 'bg-secondary text-muted-foreground'
              )}>
                {month}
              </div>
              <div className="text-sm">
                <p className="text-muted-foreground">第 {month} 月</p>
                <p className={cn(
                  'font-medium',
                  progress === 100 ? 'text-accent' : progress > 0 ? 'text-primary' : 'text-muted-foreground'
                )}>
                  {progress}%
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
