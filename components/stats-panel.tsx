'use client'

import { cn } from '@/lib/utils'
import { ProgressRing } from './progress-ring'
import { Calendar, CheckCircle, Target, TrendingUp, Clock, Flame } from 'lucide-react'

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
  const remainingTasks = totalTasks - completedTasks
  const daysRemaining = (totalWeeks - currentWeek + 1) * 7

  const stats = [
    {
      label: '总体进度',
      value: `${totalProgress}%`,
      icon: <TrendingUp className="w-5 h-5" />,
      highlight: totalProgress >= 50
    },
    {
      label: '已完成任务',
      value: `${completedTasks}/${totalTasks}`,
      icon: <CheckCircle className="w-5 h-5" />,
      highlight: completedTasks > 0
    },
    {
      label: '当前周次',
      value: `第 ${currentWeek} 周`,
      icon: <Calendar className="w-5 h-5" />,
      highlight: true
    },
    {
      label: '剩余任务',
      value: `${remainingTasks} 个`,
      icon: <Target className="w-5 h-5" />,
      highlight: remainingTasks < 30
    }
  ]

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
      {stats.map((stat, index) => (
        <div 
          key={index}
          className={cn(
            'p-4 rounded-xl bg-card border border-border hover:border-foreground/20 transition-all card-hover',
            stat.highlight && 'border-foreground/10'
          )}
        >
          <div className="flex items-center gap-3">
            <div className={cn(
              'p-2 rounded-lg',
              stat.highlight ? 'bg-foreground/10 text-foreground' : 'bg-secondary text-muted-foreground'
            )}>
              {stat.icon}
            </div>
            <div>
              <p className="text-xs text-muted-foreground">{stat.label}</p>
              <p className={cn(
                'text-lg font-bold',
                stat.highlight ? 'text-foreground' : 'text-muted-foreground'
              )}>{stat.value}</p>
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
    <div className="flex flex-col md:flex-row items-center gap-8 p-8 rounded-2xl bg-card border border-border">
      <ProgressRing progress={totalProgress} size={140} strokeWidth={10} />
      
      <div className="flex-1 text-center md:text-left">
        <h2 className="text-2xl md:text-3xl font-bold text-foreground mb-2 gradient-text">
          AI 工程师学习之旅
        </h2>
        <p className="text-muted-foreground mb-4">
          3 个月 / 12 周 / 84 天 / 冲刺 AI 应用工程师
        </p>
        
        <div className="flex flex-wrap gap-4 justify-center md:justify-start">
          {monthProgress.map(({ month, progress }) => (
            <div key={month} className="flex items-center gap-2">
              <div className={cn(
                'w-10 h-10 rounded-lg flex items-center justify-center text-sm font-bold transition-all',
                progress === 100 
                  ? 'bg-foreground text-background' 
                  : progress > 0 
                    ? 'bg-foreground/20 text-foreground' 
                    : 'bg-secondary text-muted-foreground'
              )}>
                {month}
              </div>
              <div className="text-sm">
                <p className="text-muted-foreground">第 {month} 月</p>
                <p className={cn(
                  'font-medium',
                  progress === 100 ? 'text-foreground' : progress > 0 ? 'text-foreground/80' : 'text-muted-foreground'
                )}>
                  {progress}%
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
      
      {/* Motivation */}
      <div className="hidden lg:flex flex-col items-center gap-2 p-4 rounded-xl bg-secondary/50 border border-border">
        <Flame className="w-8 h-8 text-foreground" />
        <p className="text-sm font-medium text-foreground">保持专注</p>
        <p className="text-xs text-muted-foreground text-center">每天 4-6 小时</p>
      </div>
    </div>
  )
}

// Quick Stats for mobile
interface QuickStatsProps {
  completedToday: number
  streak: number
}

export function QuickStats({ completedToday, streak }: QuickStatsProps) {
  return (
    <div className="flex gap-4 p-4 rounded-xl bg-card border border-border">
      <div className="flex items-center gap-2">
        <div className="p-2 rounded-lg bg-secondary">
          <CheckCircle className="w-4 h-4 text-foreground" />
        </div>
        <div>
          <p className="text-xs text-muted-foreground">今日完成</p>
          <p className="font-bold text-foreground">{completedToday} 个任务</p>
        </div>
      </div>
      <div className="flex items-center gap-2">
        <div className="p-2 rounded-lg bg-secondary">
          <Flame className="w-4 h-4 text-foreground" />
        </div>
        <div>
          <p className="text-xs text-muted-foreground">连续学习</p>
          <p className="font-bold text-foreground">{streak} 天</p>
        </div>
      </div>
    </div>
  )
}
