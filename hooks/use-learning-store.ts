'use client'

import { useState, useCallback, useEffect } from 'react'
import { 
  defaultLearningPlan, 
  defaultProjects, 
  defaultMilestones,
  defaultMindMapData,
  type Month, 
  type Week,
  type Task,
  type Project,
  type MindMapNode
} from '@/lib/learning-data'

const STORAGE_KEYS = {
  progress: 'ai-learning-progress',
  plan: 'ai-learning-plan',
  projects: 'ai-learning-projects',
  milestones: 'ai-learning-milestones',
  mindmap: 'ai-learning-mindmap',
  customTasks: 'ai-learning-custom-tasks'
}

interface ProgressState {
  completedTasks: string[]
  currentWeek: number
}

export function useLearningStore() {
  const [completedTasks, setCompletedTasks] = useState<Set<string>>(new Set())
  const [currentWeek, setCurrentWeek] = useState(1)
  const [learningPlan, setLearningPlan] = useState<Month[]>(defaultLearningPlan)
  const [projects, setProjects] = useState<Project[]>(defaultProjects)
  const [milestones, setMilestones] = useState(defaultMilestones)
  const [mindMapData, setMindMapData] = useState<MindMapNode>(defaultMindMapData)
  const [isLoaded, setIsLoaded] = useState(false)

  // Load from localStorage on mount
  useEffect(() => {
    try {
      // Load progress
      const savedProgress = localStorage.getItem(STORAGE_KEYS.progress)
      if (savedProgress) {
        const parsed: ProgressState = JSON.parse(savedProgress)
        setCompletedTasks(new Set(parsed.completedTasks || []))
        setCurrentWeek(parsed.currentWeek || 1)
      }

      // Load custom plan
      const savedPlan = localStorage.getItem(STORAGE_KEYS.plan)
      if (savedPlan) {
        setLearningPlan(JSON.parse(savedPlan))
      }

      // Load custom projects
      const savedProjects = localStorage.getItem(STORAGE_KEYS.projects)
      if (savedProjects) {
        setProjects(JSON.parse(savedProjects))
      }

      // Load custom milestones
      const savedMilestones = localStorage.getItem(STORAGE_KEYS.milestones)
      if (savedMilestones) {
        setMilestones(JSON.parse(savedMilestones))
      }

      // Load custom mindmap
      const savedMindmap = localStorage.getItem(STORAGE_KEYS.mindmap)
      if (savedMindmap) {
        setMindMapData(JSON.parse(savedMindmap))
      }
    } catch {
      // Ignore errors
    }
    setIsLoaded(true)
  }, [])

  // Save progress to localStorage
  useEffect(() => {
    if (!isLoaded) return
    try {
      localStorage.setItem(STORAGE_KEYS.progress, JSON.stringify({
        completedTasks: Array.from(completedTasks),
        currentWeek
      }))
    } catch {
      // Ignore errors
    }
  }, [completedTasks, currentWeek, isLoaded])

  // Save plan to localStorage
  const savePlan = useCallback((plan: Month[]) => {
    setLearningPlan(plan)
    try {
      localStorage.setItem(STORAGE_KEYS.plan, JSON.stringify(plan))
    } catch {
      // Ignore errors
    }
  }, [])

  // Save projects to localStorage
  const saveProjects = useCallback((newProjects: Project[]) => {
    setProjects(newProjects)
    try {
      localStorage.setItem(STORAGE_KEYS.projects, JSON.stringify(newProjects))
    } catch {
      // Ignore errors
    }
  }, [])

  // Save milestones to localStorage
  const saveMilestones = useCallback((newMilestones: typeof defaultMilestones) => {
    setMilestones(newMilestones)
    try {
      localStorage.setItem(STORAGE_KEYS.milestones, JSON.stringify(newMilestones))
    } catch {
      // Ignore errors
    }
  }, [])

  // Toggle task completion
  const toggleTask = useCallback((taskId: string) => {
    setCompletedTasks(prev => {
      const next = new Set(prev)
      if (next.has(taskId)) {
        next.delete(taskId)
      } else {
        next.add(taskId)
      }
      return next
    })
  }, [])

  // Add new task to a week
  const addTask = useCallback((weekId: string, task: Omit<Task, 'id'>) => {
    const newPlan = learningPlan.map(month => ({
      ...month,
      weeks: month.weeks.map(week => {
        if (week.id === weekId) {
          const newTaskId = `custom-${Date.now()}`
          return {
            ...week,
            tasks: [...week.tasks, { ...task, id: newTaskId }]
          }
        }
        return week
      })
    }))
    savePlan(newPlan)
  }, [learningPlan, savePlan])

  // Update task
  const updateTask = useCallback((taskId: string, updates: Partial<Task>) => {
    const newPlan = learningPlan.map(month => ({
      ...month,
      weeks: month.weeks.map(week => ({
        ...week,
        tasks: week.tasks.map(task => 
          task.id === taskId ? { ...task, ...updates } : task
        )
      }))
    }))
    savePlan(newPlan)
  }, [learningPlan, savePlan])

  // Delete task
  const deleteTask = useCallback((taskId: string) => {
    const newPlan = learningPlan.map(month => ({
      ...month,
      weeks: month.weeks.map(week => ({
        ...week,
        tasks: week.tasks.filter(task => task.id !== taskId)
      }))
    }))
    savePlan(newPlan)
    // Also remove from completed tasks
    setCompletedTasks(prev => {
      const next = new Set(prev)
      next.delete(taskId)
      return next
    })
  }, [learningPlan, savePlan])

  // Update week
  const updateWeek = useCallback((weekId: string, updates: Partial<Week>) => {
    const newPlan = learningPlan.map(month => ({
      ...month,
      weeks: month.weeks.map(week => 
        week.id === weekId ? { ...week, ...updates } : week
      )
    }))
    savePlan(newPlan)
  }, [learningPlan, savePlan])

  // Add project
  const addProject = useCallback((project: Omit<Project, 'id'>) => {
    const newProject = { ...project, id: `project-${Date.now()}` }
    saveProjects([...projects, newProject])
  }, [projects, saveProjects])

  // Update project
  const updateProject = useCallback((projectId: string, updates: Partial<Project>) => {
    const newProjects = projects.map(p => 
      p.id === projectId ? { ...p, ...updates } : p
    )
    saveProjects(newProjects)
  }, [projects, saveProjects])

  // Delete project
  const deleteProject = useCallback((projectId: string) => {
    saveProjects(projects.filter(p => p.id !== projectId))
  }, [projects, saveProjects])

  // Add milestone
  const addMilestone = useCallback((milestone: Omit<typeof defaultMilestones[0], 'id'>) => {
    const newMilestone = { ...milestone, id: `m-${Date.now()}` }
    saveMilestones([...milestones, newMilestone].sort((a, b) => a.week - b.week))
  }, [milestones, saveMilestones])

  // Update milestone
  const updateMilestone = useCallback((milestoneId: string, updates: Partial<typeof defaultMilestones[0]>) => {
    const newMilestones = milestones.map(m => 
      m.id === milestoneId ? { ...m, ...updates } : m
    ).sort((a, b) => a.week - b.week)
    saveMilestones(newMilestones)
  }, [milestones, saveMilestones])

  // Delete milestone
  const deleteMilestone = useCallback((milestoneId: string) => {
    saveMilestones(milestones.filter(m => m.id !== milestoneId))
  }, [milestones, saveMilestones])

  // Reset all data
  const resetAllData = useCallback(() => {
    setCompletedTasks(new Set())
    setCurrentWeek(1)
    setLearningPlan(defaultLearningPlan)
    setProjects(defaultProjects)
    setMilestones(defaultMilestones)
    setMindMapData(defaultMindMapData)
    Object.values(STORAGE_KEYS).forEach(key => {
      try {
        localStorage.removeItem(key)
      } catch {
        // Ignore errors
      }
    })
  }, [])

  // Export data
  const exportData = useCallback(() => {
    const data = {
      progress: {
        completedTasks: Array.from(completedTasks),
        currentWeek
      },
      plan: learningPlan,
      projects,
      milestones,
      mindmap: mindMapData
    }
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `ai-learning-plan-${new Date().toISOString().split('T')[0]}.json`
    a.click()
    URL.revokeObjectURL(url)
  }, [completedTasks, currentWeek, learningPlan, projects, milestones, mindMapData])

  // Import data
  const importData = useCallback((jsonString: string) => {
    try {
      const data = JSON.parse(jsonString)
      if (data.progress) {
        setCompletedTasks(new Set(data.progress.completedTasks || []))
        setCurrentWeek(data.progress.currentWeek || 1)
      }
      if (data.plan) savePlan(data.plan)
      if (data.projects) saveProjects(data.projects)
      if (data.milestones) saveMilestones(data.milestones)
      if (data.mindmap) setMindMapData(data.mindmap)
      return true
    } catch {
      return false
    }
  }, [savePlan, saveProjects, saveMilestones])

  // Calculate progress
  const getWeekProgress = useCallback((weekId: string): number => {
    const week = learningPlan.flatMap(m => m.weeks).find(w => w.id === weekId)
    if (!week || week.tasks.length === 0) return 0
    const completed = week.tasks.filter(t => completedTasks.has(t.id)).length
    return Math.round((completed / week.tasks.length) * 100)
  }, [completedTasks, learningPlan])

  const getMonthProgress = useCallback((monthId: string): number => {
    const month = learningPlan.find(m => m.id === monthId)
    if (!month) return 0
    const allTasks = month.weeks.flatMap(w => w.tasks)
    if (allTasks.length === 0) return 0
    const completed = allTasks.filter(t => completedTasks.has(t.id)).length
    return Math.round((completed / allTasks.length) * 100)
  }, [completedTasks, learningPlan])

  const getTotalProgress = useCallback((): number => {
    const allTasks = learningPlan.flatMap(m => m.weeks.flatMap(w => w.tasks))
    if (allTasks.length === 0) return 0
    const completed = allTasks.filter(t => completedTasks.has(t.id)).length
    return Math.round((completed / allTasks.length) * 100)
  }, [completedTasks, learningPlan])

  const getProjectProgress = useCallback((projectId: string): number => {
    const project = projects.find(p => p.id === projectId)
    if (!project) return 0
    
    const [startWeek, endWeek] = project.weekRange
    const relevantWeeks = learningPlan.flatMap(m => m.weeks)
      .filter(w => w.weekNumber >= startWeek && w.weekNumber <= endWeek)
    const allTasks = relevantWeeks.flatMap(w => w.tasks)
    if (allTasks.length === 0) return 0
    const completed = allTasks.filter(t => completedTasks.has(t.id)).length
    return Math.round((completed / allTasks.length) * 100)
  }, [completedTasks, learningPlan, projects])

  const getProjectsWithProgress = useCallback((): (Project & { progress: number })[] => {
    return projects.map(p => ({
      ...p,
      progress: getProjectProgress(p.id)
    }))
  }, [projects, getProjectProgress])

  const getMonthsWithProgress = useCallback((): (Month & { progress: number })[] => {
    return learningPlan.map(m => ({
      ...m,
      progress: getMonthProgress(m.id)
    }))
  }, [learningPlan, getMonthProgress])

  const getTotalTasks = useCallback((): number => {
    return learningPlan.flatMap(m => m.weeks.flatMap(w => w.tasks)).length
  }, [learningPlan])

  return {
    // State
    completedTasks,
    currentWeek,
    learningPlan,
    projects,
    milestones,
    mindMapData,
    isLoaded,

    // Setters
    setCurrentWeek,
    toggleTask,

    // Task CRUD
    addTask,
    updateTask,
    deleteTask,

    // Week update
    updateWeek,

    // Project CRUD
    addProject,
    updateProject,
    deleteProject,

    // Milestone CRUD
    addMilestone,
    updateMilestone,
    deleteMilestone,

    // Progress calculations
    getWeekProgress,
    getMonthProgress,
    getTotalProgress,
    getProjectProgress,
    getProjectsWithProgress,
    getMonthsWithProgress,
    getTotalTasks,

    // Data management
    resetAllData,
    exportData,
    importData
  }
}
