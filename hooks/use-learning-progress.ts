'use client'

import { useState, useCallback, useEffect } from 'react'
import { learningPlan, projects, type Month, type Project } from '@/lib/learning-data'

const STORAGE_KEY = 'ai-learning-progress'

interface ProgressState {
  completedTasks: Set<string>
  currentWeek: number
}

export function useLearningProgress() {
  const [completedTasks, setCompletedTasks] = useState<Set<string>>(new Set())
  const [currentWeek, setCurrentWeek] = useState(1)
  const [isLoaded, setIsLoaded] = useState(false)

  // Load from localStorage on mount
  useEffect(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY)
      if (saved) {
        const parsed = JSON.parse(saved)
        setCompletedTasks(new Set(parsed.completedTasks || []))
        setCurrentWeek(parsed.currentWeek || 1)
      }
    } catch {
      // Ignore errors
    }
    setIsLoaded(true)
  }, [])

  // Save to localStorage on change
  useEffect(() => {
    if (!isLoaded) return
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify({
        completedTasks: Array.from(completedTasks),
        currentWeek
      }))
    } catch {
      // Ignore errors
    }
  }, [completedTasks, currentWeek, isLoaded])

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

  const getWeekProgress = useCallback((weekId: string): number => {
    const week = learningPlan.flatMap(m => m.weeks).find(w => w.id === weekId)
    if (!week) return 0
    const completed = week.tasks.filter(t => completedTasks.has(t.id)).length
    return Math.round((completed / week.tasks.length) * 100)
  }, [completedTasks])

  const getMonthProgress = useCallback((monthId: string): number => {
    const month = learningPlan.find(m => m.id === monthId)
    if (!month) return 0
    const allTasks = month.weeks.flatMap(w => w.tasks)
    const completed = allTasks.filter(t => completedTasks.has(t.id)).length
    return Math.round((completed / allTasks.length) * 100)
  }, [completedTasks])

  const getTotalProgress = useCallback((): number => {
    const allTasks = learningPlan.flatMap(m => m.weeks.flatMap(w => w.tasks))
    const completed = allTasks.filter(t => completedTasks.has(t.id)).length
    return Math.round((completed / allTasks.length) * 100)
  }, [completedTasks])

  const getProjectProgress = useCallback((projectId: string): number => {
    // Project 1: Weeks 1-4 (RAG)
    // Project 2: Weeks 5-7 (Agent)
    // Project 3: Week 8 (Unity)
    const projectWeekMap: Record<string, number[]> = {
      'project-1': [1, 2, 3, 4],
      'project-2': [5, 6, 7],
      'project-3': [8]
    }
    
    const weeks = projectWeekMap[projectId] || []
    const relevantWeeks = learningPlan.flatMap(m => m.weeks).filter(w => weeks.includes(w.weekNumber))
    const allTasks = relevantWeeks.flatMap(w => w.tasks)
    if (allTasks.length === 0) return 0
    const completed = allTasks.filter(t => completedTasks.has(t.id)).length
    return Math.round((completed / allTasks.length) * 100)
  }, [completedTasks])

  const getProjectsWithProgress = useCallback((): (Project & { progress: number })[] => {
    return projects.map(p => ({
      ...p,
      progress: getProjectProgress(p.id)
    }))
  }, [getProjectProgress])

  const getMonthsWithProgress = useCallback((): (Month & { progress: number })[] => {
    return learningPlan.map(m => ({
      ...m,
      progress: getMonthProgress(m.id)
    }))
  }, [getMonthProgress])

  return {
    completedTasks,
    currentWeek,
    setCurrentWeek,
    toggleTask,
    getWeekProgress,
    getMonthProgress,
    getTotalProgress,
    getProjectProgress,
    getProjectsWithProgress,
    getMonthsWithProgress,
    isLoaded
  }
}
