'use client'

import { useState, useMemo } from 'react'
import { useLearningProgress } from '@/hooks/use-learning-progress'
import { learningPlan, milestones } from '@/lib/learning-data'
import { StatsPanel, HeroStats } from '@/components/stats-panel'
import { NavTabs } from '@/components/nav-tabs'
import { WeekCard } from '@/components/task-card'
import { TimelineItem, MilestoneTimeline } from '@/components/timeline'
import { ProjectCard } from '@/components/project-card'
import { MindMap } from '@/components/mind-map'
import { ProgressRing, ProgressBar } from '@/components/progress-ring'
import { 
  Rocket, 
  Calendar, 
  FolderKanban, 
  Brain, 
  ChevronLeft, 
  ChevronRight,
  Sparkles,
  Github,
  BookOpen,
  Code2
} from 'lucide-react'
import { cn } from '@/lib/utils'

export default function LearningPlanPage() {
  const {
    completedTasks,
    currentWeek,
    setCurrentWeek,
    toggleTask,
    getWeekProgress,
    getMonthProgress,
    getTotalProgress,
    getProjectsWithProgress,
    getMonthsWithProgress,
    isLoaded
  } = useLearningProgress()

  const [activeTab, setActiveTab] = useState('timeline')
  const [selectedMonth, setSelectedMonth] = useState(1)

  const totalProgress = getTotalProgress()
  const projectsWithProgress = getProjectsWithProgress()
  const monthsWithProgress = getMonthsWithProgress()
  
  const allTasks = useMemo(() => 
    learningPlan.flatMap(m => m.weeks.flatMap(w => w.tasks)),
    []
  )

  const monthProgress = monthsWithProgress.map(m => ({
    month: m.monthNumber,
    progress: m.progress
  }))

  const tabs = [
    { id: 'timeline', label: '时间线', icon: <Calendar className="w-4 h-4" /> },
    { id: 'projects', label: '项目卡片', icon: <FolderKanban className="w-4 h-4" /> },
    { id: 'mindmap', label: '思维导图', icon: <Brain className="w-4 h-4" /> },
  ]

  const currentMonth = learningPlan.find(m => m.monthNumber === selectedMonth)

  // Show loading state
  if (!isLoaded) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin" />
          <p className="text-muted-foreground">加载中...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="sticky top-0 z-50 border-b border-border bg-background/80 backdrop-blur-lg">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary to-accent flex items-center justify-center">
                <Rocket className="w-5 h-5 text-primary-foreground" />
              </div>
              <div>
                <h1 className="font-bold text-foreground">AI 工程师冲刺计划</h1>
                <p className="text-xs text-muted-foreground">3 个月 · 校招必备</p>
              </div>
            </div>
            
            <div className="flex items-center gap-4">
              <div className="hidden md:flex items-center gap-2 text-sm">
                <span className="text-muted-foreground">当前进度</span>
                <ProgressBar progress={totalProgress} className="w-32" size="sm" />
                <span className="font-semibold text-primary">{totalProgress}%</span>
              </div>
              <a 
                href="https://github.com" 
                target="_blank" 
                rel="noopener noreferrer"
                className="p-2 rounded-lg hover:bg-secondary transition-colors"
              >
                <Github className="w-5 h-5 text-muted-foreground" />
              </a>
            </div>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        {/* Hero Section */}
        <section className="mb-8">
          <HeroStats totalProgress={totalProgress} monthProgress={monthProgress} />
        </section>

        {/* Stats Panel */}
        <section className="mb-8">
          <StatsPanel
            totalProgress={totalProgress}
            completedTasks={completedTasks.size}
            totalTasks={allTasks.length}
            currentWeek={currentWeek}
            totalWeeks={12}
          />
        </section>

        {/* Milestone Timeline */}
        <section className="mb-8 p-6 rounded-xl bg-card border border-border">
          <h3 className="font-semibold text-foreground mb-6 flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-primary" />
            里程碑进度
          </h3>
          <div className="relative h-32 px-4">
            <MilestoneTimeline 
              milestones={milestones} 
              currentWeek={currentWeek}
              getWeekProgress={(week) => {
                const w = learningPlan.flatMap(m => m.weeks).find(w => w.weekNumber === week)
                return w ? getWeekProgress(w.id) : 0
              }}
            />
          </div>
        </section>

        {/* Navigation Tabs */}
        <section className="mb-6">
          <NavTabs tabs={tabs} activeTab={activeTab} onChange={setActiveTab} />
        </section>

        {/* Timeline View */}
        {activeTab === 'timeline' && (
          <section>
            {/* Month Selector */}
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setSelectedMonth(Math.max(1, selectedMonth - 1))}
                  disabled={selectedMonth === 1}
                  className="p-2 rounded-lg hover:bg-secondary disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  <ChevronLeft className="w-5 h-5" />
                </button>
                
                <div className="flex gap-2">
                  {[1, 2, 3].map(month => (
                    <button
                      key={month}
                      onClick={() => setSelectedMonth(month)}
                      className={cn(
                        'px-4 py-2 rounded-lg font-medium transition-all',
                        selectedMonth === month
                          ? 'bg-primary text-primary-foreground'
                          : 'bg-secondary text-muted-foreground hover:text-foreground'
                      )}
                    >
                      第 {month} 月
                    </button>
                  ))}
                </div>
                
                <button
                  onClick={() => setSelectedMonth(Math.min(3, selectedMonth + 1))}
                  disabled={selectedMonth === 3}
                  className="p-2 rounded-lg hover:bg-secondary disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  <ChevronRight className="w-5 h-5" />
                </button>
              </div>

              {currentMonth && (
                <div className="flex items-center gap-3">
                  <ProgressRing progress={currentMonth.progress} size={48} strokeWidth={4} />
                  <div>
                    <p className="text-sm font-medium text-foreground">{currentMonth.title}</p>
                    <p className="text-xs text-muted-foreground">
                      {currentMonth.weeks.length} 周学习内容
                    </p>
                  </div>
                </div>
              )}
            </div>

            {/* Week Cards */}
            {currentMonth && (
              <div className="space-y-4">
                {currentMonth.weeks.map((week, index) => (
                  <TimelineItem
                    key={week.id}
                    title={`第 ${week.weekNumber} 周`}
                    subtitle={week.title}
                    description={week.goal}
                    progress={getWeekProgress(week.id)}
                    isActive={currentWeek === week.weekNumber}
                    isCompleted={getWeekProgress(week.id) === 100}
                    isLast={index === currentMonth.weeks.length - 1}
                    onClick={() => setCurrentWeek(week.weekNumber)}
                  >
                    <WeekCard
                      week={week}
                      completedTasks={completedTasks}
                      onToggleTask={toggleTask}
                      progress={getWeekProgress(week.id)}
                      isActive={currentWeek === week.weekNumber}
                    />
                  </TimelineItem>
                ))}
              </div>
            )}
          </section>
        )}

        {/* Projects View */}
        {activeTab === 'projects' && (
          <section>
            <div className="grid md:grid-cols-3 gap-6">
              {projectsWithProgress.map((project, index) => (
                <ProjectCard key={project.id} project={project} index={index} />
              ))}
            </div>

            {/* Project Tips */}
            <div className="mt-8 p-6 rounded-xl bg-gradient-to-br from-primary/10 to-accent/10 border border-primary/20">
              <h3 className="font-semibold text-foreground mb-4 flex items-center gap-2">
                <BookOpen className="w-5 h-5 text-primary" />
                项目建议
              </h3>
              <ul className="space-y-3">
                <li className="flex items-start gap-3">
                  <Code2 className="w-5 h-5 text-accent mt-0.5 shrink-0" />
                  <span className="text-sm text-muted-foreground">
                    <strong className="text-foreground">每天 push 代码到 GitHub</strong>，保持绿墙，展示持续学习能力
                  </span>
                </li>
                <li className="flex items-start gap-3">
                  <Code2 className="w-5 h-5 text-accent mt-0.5 shrink-0" />
                  <span className="text-sm text-muted-foreground">
                    <strong className="text-foreground">每周末录制 1 分钟项目演示</strong>，存下来用于简历和面试
                  </span>
                </li>
                <li className="flex items-start gap-3">
                  <Code2 className="w-5 h-5 text-accent mt-0.5 shrink-0" />
                  <span className="text-sm text-muted-foreground">
                    <strong className="text-foreground">遇到 bug 优先自己调试</strong>（断点、日志），卡住 30 分钟再查资料
                  </span>
                </li>
              </ul>
            </div>
          </section>
        )}

        {/* Mind Map View */}
        {activeTab === 'mindmap' && (
          <section>
            <MindMap />
            
            {/* Key Technologies */}
            <div className="mt-6 grid md:grid-cols-2 gap-4">
              <div className="p-6 rounded-xl bg-card border border-border">
                <h4 className="font-semibold text-foreground mb-4">核心技术栈</h4>
                <div className="flex flex-wrap gap-2">
                  {['Python', 'FastAPI', 'LangChain', 'Chroma', 'Docker', 'Git', 'OpenAI API', 'DeepSeek'].map(tech => (
                    <span key={tech} className="px-3 py-1 rounded-full bg-primary/10 text-primary text-sm">
                      {tech}
                    </span>
                  ))}
                </div>
              </div>
              <div className="p-6 rounded-xl bg-card border border-border">
                <h4 className="font-semibold text-foreground mb-4">目标岗位关键词</h4>
                <div className="flex flex-wrap gap-2">
                  {['AI 应用开发', 'Agent 开发', '大模型后端', 'AI 产品研发', 'RAG 工程师'].map(keyword => (
                    <span key={keyword} className="px-3 py-1 rounded-full bg-accent/10 text-accent text-sm">
                      {keyword}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </section>
        )}
      </main>

      {/* Footer */}
      <footer className="border-t border-border mt-16">
        <div className="container mx-auto px-4 py-8">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-primary to-accent flex items-center justify-center">
                <Rocket className="w-4 h-4 text-primary-foreground" />
              </div>
              <span className="text-sm text-muted-foreground">
                AI 工程师 3 个月冲刺计划 · 所有产出均可写进简历 + 开源展示
              </span>
            </div>
            <p className="text-sm text-muted-foreground">
              每天保持 4~6 小时专注 · 代码必须每天 push 到 GitHub
            </p>
          </div>
        </div>
      </footer>
    </div>
  )
}
