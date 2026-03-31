'use client'

import { useState, useMemo, useRef } from 'react'
import { useLearningStore } from '@/hooks/use-learning-store'
import { learningResources } from '@/lib/learning-data'
import { StatsPanel, HeroStats } from '@/components/stats-panel'
import { NavTabs } from '@/components/nav-tabs'
import { WeekCard } from '@/components/task-card'
import { TimelineItem, MilestoneTimeline } from '@/components/timeline'
import { ProjectList } from '@/components/project-card'
import { MindMap, LearningResources } from '@/components/mind-map'
import { ProgressRing, ProgressBar } from '@/components/progress-ring'
import { 
  TaskEditModal, 
  WeekEditModal, 
  ProjectEditModal, 
  MilestoneEditModal,
  ConfirmModal 
} from '@/components/edit-modal'
import type { Task, Week, Project } from '@/lib/learning-data'
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
  Code2,
  Settings,
  Download,
  Upload,
  RotateCcw,
  Menu,
  X
} from 'lucide-react'
import { cn } from '@/lib/utils'

export default function LearningPlanPage() {
  const {
    completedTasks,
    currentWeek,
    setCurrentWeek,
    toggleTask,
    learningPlan,
    projects,
    milestones,
    mindMapData,
    isLoaded,
    addTask,
    updateTask,
    deleteTask,
    updateWeek,
    addProject,
    updateProject,
    deleteProject,
    addMilestone,
    updateMilestone,
    deleteMilestone,
    getWeekProgress,
    getMonthProgress,
    getTotalProgress,
    getProjectsWithProgress,
    getMonthsWithProgress,
    getTotalTasks,
    resetAllData,
    exportData,
    importData
  } = useLearningStore()

  const [activeTab, setActiveTab] = useState('timeline')
  const [selectedMonth, setSelectedMonth] = useState(1)
  const [showSettings, setShowSettings] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)

  // Modal states
  const [taskModal, setTaskModal] = useState<{ isOpen: boolean; task: Task | null; weekId: string; isNew: boolean }>({
    isOpen: false, task: null, weekId: '', isNew: false
  })
  const [weekModal, setWeekModal] = useState<{ isOpen: boolean; week: Week | null }>({
    isOpen: false, week: null
  })
  const [projectModal, setProjectModal] = useState<{ isOpen: boolean; project: Project | null; isNew: boolean }>({
    isOpen: false, project: null, isNew: false
  })
  const [milestoneModal, setMilestoneModal] = useState<{ isOpen: boolean; milestone: typeof milestones[0] | null; isNew: boolean }>({
    isOpen: false, milestone: null, isNew: false
  })
  const [confirmModal, setConfirmModal] = useState<{ isOpen: boolean; onConfirm: () => void }>({
    isOpen: false, onConfirm: () => {}
  })

  const totalProgress = getTotalProgress()
  const projectsWithProgress = getProjectsWithProgress()
  const monthsWithProgress = getMonthsWithProgress()
  const totalTasks = getTotalTasks()

  const monthProgress = monthsWithProgress.map(m => ({
    month: m.monthNumber,
    progress: m.progress
  }))

  const tabs = [
    { id: 'timeline', label: '时间线', icon: <Calendar className="w-4 h-4" /> },
    { id: 'projects', label: '项目卡片', icon: <FolderKanban className="w-4 h-4" /> },
    { id: 'mindmap', label: '知识体系', icon: <Brain className="w-4 h-4" /> },
  ]

  const currentMonth = learningPlan.find(m => m.monthNumber === selectedMonth)

  // Handle file import
  const handleImport = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      const reader = new FileReader()
      reader.onload = (event) => {
        const content = event.target?.result as string
        if (importData(content)) {
          setShowSettings(false)
        }
      }
      reader.readAsText(file)
    }
  }

  // Show loading state
  if (!isLoaded) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 border-4 border-foreground border-t-transparent rounded-full animate-spin" />
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
              <div className="w-10 h-10 rounded-xl bg-foreground flex items-center justify-center">
                <Rocket className="w-5 h-5 text-background" />
              </div>
              <div>
                <h1 className="font-bold text-foreground">AI 工程师冲刺计划</h1>
                <p className="text-xs text-muted-foreground">3 个月 / 校招必备</p>
              </div>
            </div>
            
            <div className="flex items-center gap-3">
              <div className="hidden md:flex items-center gap-2 text-sm">
                <span className="text-muted-foreground">总进度</span>
                <ProgressBar progress={totalProgress} className="w-32" size="sm" />
                <span className="font-semibold text-foreground">{totalProgress}%</span>
              </div>
              
              <button 
                onClick={() => setShowSettings(!showSettings)}
                className="p-2 rounded-lg hover:bg-secondary transition-colors text-muted-foreground hover:text-foreground"
              >
                {showSettings ? <X className="w-5 h-5" /> : <Settings className="w-5 h-5" />}
              </button>
            </div>
          </div>
        </div>
        
        {/* Settings Panel */}
        {showSettings && (
          <div className="border-t border-border bg-card animate-fade-in">
            <div className="container mx-auto px-4 py-4">
              <div className="flex flex-wrap items-center gap-3">
                <button
                  onClick={exportData}
                  className="flex items-center gap-2 px-4 py-2 rounded-lg bg-secondary text-foreground hover:bg-muted transition-colors text-sm"
                >
                  <Download className="w-4 h-4" />
                  导出数据
                </button>
                <button
                  onClick={() => fileInputRef.current?.click()}
                  className="flex items-center gap-2 px-4 py-2 rounded-lg bg-secondary text-foreground hover:bg-muted transition-colors text-sm"
                >
                  <Upload className="w-4 h-4" />
                  导入数据
                </button>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept=".json"
                  onChange={handleImport}
                  className="hidden"
                />
                <button
                  onClick={() => setConfirmModal({ 
                    isOpen: true, 
                    onConfirm: () => {
                      resetAllData()
                      setShowSettings(false)
                    }
                  })}
                  className="flex items-center gap-2 px-4 py-2 rounded-lg bg-destructive/10 text-destructive hover:bg-destructive/20 transition-colors text-sm"
                >
                  <RotateCcw className="w-4 h-4" />
                  重置所有数据
                </button>
                <div className="flex-1" />
                <a 
                  href="https://github.com" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 px-4 py-2 rounded-lg bg-secondary text-foreground hover:bg-muted transition-colors text-sm"
                >
                  <Github className="w-4 h-4" />
                  GitHub
                </a>
              </div>
            </div>
          </div>
        )}
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
            totalTasks={totalTasks}
            currentWeek={currentWeek}
            totalWeeks={12}
          />
        </section>

        {/* Milestone Timeline */}
        <section className="mb-8 p-6 rounded-xl bg-card border border-border">
          <h3 className="font-semibold text-foreground mb-6 flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-foreground" />
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
              onEditMilestone={(m) => setMilestoneModal({ isOpen: true, milestone: m, isNew: false })}
              onAddMilestone={() => setMilestoneModal({ isOpen: true, milestone: null, isNew: true })}
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
                  {learningPlan.map(month => (
                    <button
                      key={month.monthNumber}
                      onClick={() => setSelectedMonth(month.monthNumber)}
                      className={cn(
                        'px-4 py-2 rounded-lg font-medium transition-all',
                        selectedMonth === month.monthNumber
                          ? 'bg-foreground text-background'
                          : 'bg-secondary text-muted-foreground hover:text-foreground'
                      )}
                    >
                      第 {month.monthNumber} 月
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
                <div className="hidden md:flex items-center gap-3">
                  <ProgressRing progress={getMonthProgress(currentMonth.id)} size={48} strokeWidth={4} />
                  <div>
                    <p className="text-sm font-medium text-foreground">{currentMonth.title}</p>
                    <p className="text-xs text-muted-foreground">{currentMonth.description}</p>
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
                      onEditTask={(task) => setTaskModal({ isOpen: true, task, weekId: week.id, isNew: false })}
                      onAddTask={() => setTaskModal({ isOpen: true, task: null, weekId: week.id, isNew: true })}
                      onEditWeek={() => setWeekModal({ isOpen: true, week })}
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
            <ProjectList 
              projects={projectsWithProgress}
              onEdit={(project) => setProjectModal({ isOpen: true, project, isNew: false })}
              onAdd={() => setProjectModal({ isOpen: true, project: null, isNew: true })}
            />

            {/* Project Tips */}
            <div className="mt-8 p-6 rounded-xl bg-card border border-border">
              <h3 className="font-semibold text-foreground mb-4 flex items-center gap-2">
                <BookOpen className="w-5 h-5 text-foreground" />
                项目建议
              </h3>
              <ul className="space-y-3">
                <li className="flex items-start gap-3">
                  <Code2 className="w-5 h-5 text-muted-foreground mt-0.5 shrink-0" />
                  <span className="text-sm text-muted-foreground">
                    <strong className="text-foreground">每天 push 代码到 GitHub</strong>，保持绿墙，展示持续学习能力
                  </span>
                </li>
                <li className="flex items-start gap-3">
                  <Code2 className="w-5 h-5 text-muted-foreground mt-0.5 shrink-0" />
                  <span className="text-sm text-muted-foreground">
                    <strong className="text-foreground">每周末录制 1 分钟项目演示</strong>，存下来用于简历和面试
                  </span>
                </li>
                <li className="flex items-start gap-3">
                  <Code2 className="w-5 h-5 text-muted-foreground mt-0.5 shrink-0" />
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
            <MindMap data={mindMapData} />
            <LearningResources resources={learningResources} />
            
            {/* Key Technologies */}
            <div className="mt-6 grid md:grid-cols-2 gap-4">
              <div className="p-6 rounded-xl bg-card border border-border">
                <h4 className="font-semibold text-foreground mb-4">核心技术栈</h4>
                <div className="flex flex-wrap gap-2">
                  {['Python', 'FastAPI', 'LangChain', 'Chroma', 'Docker', 'Git', 'OpenAI API', 'DeepSeek', 'Ollama', 'LangGraph'].map(tech => (
                    <span key={tech} className="px-3 py-1.5 rounded-full bg-secondary text-foreground text-sm">
                      {tech}
                    </span>
                  ))}
                </div>
              </div>
              <div className="p-6 rounded-xl bg-card border border-border">
                <h4 className="font-semibold text-foreground mb-4">目标岗位关键词</h4>
                <div className="flex flex-wrap gap-2">
                  {['AI 应用开发', 'Agent 开发', '大模型后端', 'AI 产品研发', 'RAG 工程师', 'LLM 工程师'].map(keyword => (
                    <span key={keyword} className="px-3 py-1.5 rounded-full bg-secondary text-foreground text-sm">
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
              <div className="w-8 h-8 rounded-lg bg-foreground flex items-center justify-center">
                <Rocket className="w-4 h-4 text-background" />
              </div>
              <span className="text-sm text-muted-foreground">
                AI 工程师 3 个月冲刺计划 / 所有产出均可写进简历 + 开源展示
              </span>
            </div>
            <p className="text-sm text-muted-foreground">
              每天保持 4-6 小时专注 / 代码必须每天 push 到 GitHub
            </p>
          </div>
        </div>
      </footer>

      {/* Modals */}
      <TaskEditModal
        isOpen={taskModal.isOpen}
        onClose={() => setTaskModal({ isOpen: false, task: null, weekId: '', isNew: false })}
        task={taskModal.task}
        isNew={taskModal.isNew}
        onSave={(updates) => {
          if (taskModal.isNew) {
            addTask(taskModal.weekId, { 
              ...updates, 
              completed: false 
            } as Omit<Task, 'id'>)
          } else if (taskModal.task) {
            updateTask(taskModal.task.id, updates)
          }
        }}
        onDelete={taskModal.task ? () => deleteTask(taskModal.task!.id) : undefined}
      />

      <WeekEditModal
        isOpen={weekModal.isOpen}
        onClose={() => setWeekModal({ isOpen: false, week: null })}
        week={weekModal.week}
        onSave={(updates) => {
          if (weekModal.week) {
            updateWeek(weekModal.week.id, updates)
          }
        }}
      />

      <ProjectEditModal
        isOpen={projectModal.isOpen}
        onClose={() => setProjectModal({ isOpen: false, project: null, isNew: false })}
        project={projectModal.project}
        isNew={projectModal.isNew}
        onSave={(updates) => {
          if (projectModal.isNew) {
            addProject(updates as Omit<Project, 'id'>)
          } else if (projectModal.project) {
            updateProject(projectModal.project.id, updates)
          }
        }}
        onDelete={projectModal.project ? () => deleteProject(projectModal.project!.id) : undefined}
      />

      <MilestoneEditModal
        isOpen={milestoneModal.isOpen}
        onClose={() => setMilestoneModal({ isOpen: false, milestone: null, isNew: false })}
        milestone={milestoneModal.milestone}
        isNew={milestoneModal.isNew}
        onSave={(updates) => {
          if (milestoneModal.isNew) {
            addMilestone(updates)
          } else if (milestoneModal.milestone) {
            updateMilestone(milestoneModal.milestone.id, updates)
          }
        }}
        onDelete={milestoneModal.milestone ? () => deleteMilestone(milestoneModal.milestone!.id) : undefined}
      />

      <ConfirmModal
        isOpen={confirmModal.isOpen}
        onClose={() => setConfirmModal({ isOpen: false, onConfirm: () => {} })}
        onConfirm={confirmModal.onConfirm}
        title="确认重置"
        message="此操作将清除所有自定义数据和进度，恢复为默认状态。此操作不可撤销。"
        confirmText="确认重置"
        variant="danger"
      />
    </div>
  )
}
