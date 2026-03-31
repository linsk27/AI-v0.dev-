'use client'

import { useState, useEffect } from 'react'
import { cn } from '@/lib/utils'
import { X, Save, Trash2 } from 'lucide-react'
import type { Task, Week, Project } from '@/lib/learning-data'

interface ModalProps {
  isOpen: boolean
  onClose: () => void
  title: string
  children: React.ReactNode
}

export function Modal({ isOpen, onClose, title, children }: ModalProps) {
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = ''
    }
    return () => {
      document.body.style.overflow = ''
    }
  }, [isOpen])

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="modal-backdrop absolute inset-0" onClick={onClose} />
      <div className="relative w-full max-w-lg bg-card border border-border rounded-xl shadow-2xl animate-fade-in max-h-[90vh] overflow-hidden flex flex-col">
        <div className="flex items-center justify-between p-4 border-b border-border">
          <h3 className="font-semibold text-foreground">{title}</h3>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg hover:bg-secondary transition-colors text-muted-foreground hover:text-foreground"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
        <div className="p-4 overflow-y-auto">{children}</div>
      </div>
    </div>
  )
}

interface TaskEditModalProps {
  isOpen: boolean
  onClose: () => void
  task: Task | null
  onSave: (task: Partial<Task>) => void
  onDelete?: () => void
  isNew?: boolean
}

export function TaskEditModal({ isOpen, onClose, task, onSave, onDelete, isNew }: TaskEditModalProps) {
  const [formData, setFormData] = useState({
    day: 1,
    title: '',
    practice: '',
    output: ''
  })

  useEffect(() => {
    if (task) {
      setFormData({
        day: task.day,
        title: task.title,
        practice: task.practice,
        output: task.output
      })
    } else {
      setFormData({ day: 1, title: '', practice: '', output: '' })
    }
  }, [task])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onSave(formData)
    onClose()
  }

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={isNew ? '添加新任务' : '编辑任务'}>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm text-muted-foreground mb-1.5">天数</label>
          <input
            type="number"
            min={1}
            max={7}
            value={formData.day}
            onChange={e => setFormData({ ...formData, day: Number(e.target.value) })}
            className="w-full px-3 py-2 rounded-lg bg-secondary border border-border text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50"
          />
        </div>
        <div>
          <label className="block text-sm text-muted-foreground mb-1.5">任务标题</label>
          <input
            type="text"
            value={formData.title}
            onChange={e => setFormData({ ...formData, title: e.target.value })}
            placeholder="例如：Python 文件操作"
            className="w-full px-3 py-2 rounded-lg bg-secondary border border-border text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50"
            required
          />
        </div>
        <div>
          <label className="block text-sm text-muted-foreground mb-1.5">练习内容</label>
          <textarea
            value={formData.practice}
            onChange={e => setFormData({ ...formData, practice: e.target.value })}
            placeholder="具体要做什么练习..."
            rows={2}
            className="w-full px-3 py-2 rounded-lg bg-secondary border border-border text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 resize-none"
          />
        </div>
        <div>
          <label className="block text-sm text-muted-foreground mb-1.5">预期产出</label>
          <input
            type="text"
            value={formData.output}
            onChange={e => setFormData({ ...formData, output: e.target.value })}
            placeholder="例如：可运行的脚本"
            className="w-full px-3 py-2 rounded-lg bg-secondary border border-border text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50"
          />
        </div>
        <div className="flex gap-2 pt-2">
          <button
            type="submit"
            className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg bg-primary text-primary-foreground font-medium hover:bg-primary/90 transition-colors"
          >
            <Save className="w-4 h-4" />
            保存
          </button>
          {!isNew && onDelete && (
            <button
              type="button"
              onClick={() => {
                onDelete()
                onClose()
              }}
              className="flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg bg-destructive text-destructive-foreground font-medium hover:bg-destructive/90 transition-colors"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          )}
        </div>
      </form>
    </Modal>
  )
}

interface WeekEditModalProps {
  isOpen: boolean
  onClose: () => void
  week: Week | null
  onSave: (updates: Partial<Week>) => void
}

export function WeekEditModal({ isOpen, onClose, week, onSave }: WeekEditModalProps) {
  const [formData, setFormData] = useState({
    title: '',
    goal: '',
    weekOutput: ''
  })

  useEffect(() => {
    if (week) {
      setFormData({
        title: week.title,
        goal: week.goal,
        weekOutput: week.weekOutput
      })
    }
  }, [week])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onSave(formData)
    onClose()
  }

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="编辑周计划">
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm text-muted-foreground mb-1.5">周标题</label>
          <input
            type="text"
            value={formData.title}
            onChange={e => setFormData({ ...formData, title: e.target.value })}
            className="w-full px-3 py-2 rounded-lg bg-secondary border border-border text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50"
            required
          />
        </div>
        <div>
          <label className="block text-sm text-muted-foreground mb-1.5">学习目标</label>
          <textarea
            value={formData.goal}
            onChange={e => setFormData({ ...formData, goal: e.target.value })}
            rows={2}
            className="w-full px-3 py-2 rounded-lg bg-secondary border border-border text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 resize-none"
          />
        </div>
        <div>
          <label className="block text-sm text-muted-foreground mb-1.5">周产出</label>
          <textarea
            value={formData.weekOutput}
            onChange={e => setFormData({ ...formData, weekOutput: e.target.value })}
            rows={2}
            className="w-full px-3 py-2 rounded-lg bg-secondary border border-border text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 resize-none"
          />
        </div>
        <button
          type="submit"
          className="w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg bg-primary text-primary-foreground font-medium hover:bg-primary/90 transition-colors"
        >
          <Save className="w-4 h-4" />
          保存
        </button>
      </form>
    </Modal>
  )
}

interface ProjectEditModalProps {
  isOpen: boolean
  onClose: () => void
  project: Project | null
  onSave: (project: Partial<Project>) => void
  onDelete?: () => void
  isNew?: boolean
}

export function ProjectEditModal({ isOpen, onClose, project, onSave, onDelete, isNew }: ProjectEditModalProps) {
  const [formData, setFormData] = useState({
    name: '',
    coreAbility: '',
    highlight: '',
    techStack: [] as string[],
    weekRange: [1, 4] as [number, number]
  })
  const [techInput, setTechInput] = useState('')

  useEffect(() => {
    if (project) {
      setFormData({
        name: project.name,
        coreAbility: project.coreAbility,
        highlight: project.highlight,
        techStack: project.techStack || [],
        weekRange: project.weekRange || [1, 4]
      })
    } else {
      setFormData({
        name: '',
        coreAbility: '',
        highlight: '',
        techStack: [],
        weekRange: [1, 4]
      })
    }
  }, [project])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onSave({ ...formData, progress: 0 })
    onClose()
  }

  const addTech = () => {
    if (techInput.trim() && !formData.techStack.includes(techInput.trim())) {
      setFormData({ ...formData, techStack: [...formData.techStack, techInput.trim()] })
      setTechInput('')
    }
  }

  const removeTech = (tech: string) => {
    setFormData({ ...formData, techStack: formData.techStack.filter(t => t !== tech) })
  }

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={isNew ? '添加新项目' : '编辑项目'}>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm text-muted-foreground mb-1.5">项目名称</label>
          <input
            type="text"
            value={formData.name}
            onChange={e => setFormData({ ...formData, name: e.target.value })}
            placeholder="例如：私有文档 RAG 知识库"
            className="w-full px-3 py-2 rounded-lg bg-secondary border border-border text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50"
            required
          />
        </div>
        <div>
          <label className="block text-sm text-muted-foreground mb-1.5">核心能力</label>
          <input
            type="text"
            value={formData.coreAbility}
            onChange={e => setFormData({ ...formData, coreAbility: e.target.value })}
            placeholder="例如：文档切片、向量检索、LLM 生成"
            className="w-full px-3 py-2 rounded-lg bg-secondary border border-border text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50"
          />
        </div>
        <div>
          <label className="block text-sm text-muted-foreground mb-1.5">简历亮点</label>
          <textarea
            value={formData.highlight}
            onChange={e => setFormData({ ...formData, highlight: e.target.value })}
            rows={2}
            className="w-full px-3 py-2 rounded-lg bg-secondary border border-border text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 resize-none"
          />
        </div>
        <div>
          <label className="block text-sm text-muted-foreground mb-1.5">技术栈</label>
          <div className="flex gap-2 mb-2">
            <input
              type="text"
              value={techInput}
              onChange={e => setTechInput(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && (e.preventDefault(), addTech())}
              placeholder="输入技术名称"
              className="flex-1 px-3 py-2 rounded-lg bg-secondary border border-border text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50"
            />
            <button
              type="button"
              onClick={addTech}
              className="px-4 py-2 rounded-lg bg-secondary text-foreground hover:bg-muted transition-colors"
            >
              添加
            </button>
          </div>
          <div className="flex flex-wrap gap-2">
            {formData.techStack.map(tech => (
              <span
                key={tech}
                className="inline-flex items-center gap-1 px-2 py-1 rounded-full bg-secondary text-sm"
              >
                {tech}
                <button
                  type="button"
                  onClick={() => removeTech(tech)}
                  className="hover:text-destructive"
                >
                  <X className="w-3 h-3" />
                </button>
              </span>
            ))}
          </div>
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm text-muted-foreground mb-1.5">开始周</label>
            <input
              type="number"
              min={1}
              max={12}
              value={formData.weekRange[0]}
              onChange={e => setFormData({ ...formData, weekRange: [Number(e.target.value), formData.weekRange[1]] })}
              className="w-full px-3 py-2 rounded-lg bg-secondary border border-border text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50"
            />
          </div>
          <div>
            <label className="block text-sm text-muted-foreground mb-1.5">结束周</label>
            <input
              type="number"
              min={1}
              max={12}
              value={formData.weekRange[1]}
              onChange={e => setFormData({ ...formData, weekRange: [formData.weekRange[0], Number(e.target.value)] })}
              className="w-full px-3 py-2 rounded-lg bg-secondary border border-border text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50"
            />
          </div>
        </div>
        <div className="flex gap-2 pt-2">
          <button
            type="submit"
            className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg bg-primary text-primary-foreground font-medium hover:bg-primary/90 transition-colors"
          >
            <Save className="w-4 h-4" />
            保存
          </button>
          {!isNew && onDelete && (
            <button
              type="button"
              onClick={() => {
                onDelete()
                onClose()
              }}
              className="flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg bg-destructive text-destructive-foreground font-medium hover:bg-destructive/90 transition-colors"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          )}
        </div>
      </form>
    </Modal>
  )
}

interface MilestoneEditModalProps {
  isOpen: boolean
  onClose: () => void
  milestone: { id: string; week: number; title: string; description: string } | null
  onSave: (milestone: { week: number; title: string; description: string }) => void
  onDelete?: () => void
  isNew?: boolean
}

export function MilestoneEditModal({ isOpen, onClose, milestone, onSave, onDelete, isNew }: MilestoneEditModalProps) {
  const [formData, setFormData] = useState({
    week: 1,
    title: '',
    description: ''
  })

  useEffect(() => {
    if (milestone) {
      setFormData({
        week: milestone.week,
        title: milestone.title,
        description: milestone.description
      })
    } else {
      setFormData({ week: 1, title: '', description: '' })
    }
  }, [milestone])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onSave(formData)
    onClose()
  }

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={isNew ? '添加里程碑' : '编辑里程碑'}>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm text-muted-foreground mb-1.5">周数</label>
          <input
            type="number"
            min={1}
            max={12}
            value={formData.week}
            onChange={e => setFormData({ ...formData, week: Number(e.target.value) })}
            className="w-full px-3 py-2 rounded-lg bg-secondary border border-border text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50"
          />
        </div>
        <div>
          <label className="block text-sm text-muted-foreground mb-1.5">里程碑标题</label>
          <input
            type="text"
            value={formData.title}
            onChange={e => setFormData({ ...formData, title: e.target.value })}
            placeholder="例如：完成 RAG 项目"
            className="w-full px-3 py-2 rounded-lg bg-secondary border border-border text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50"
            required
          />
        </div>
        <div>
          <label className="block text-sm text-muted-foreground mb-1.5">描述</label>
          <input
            type="text"
            value={formData.description}
            onChange={e => setFormData({ ...formData, description: e.target.value })}
            placeholder="里程碑描述..."
            className="w-full px-3 py-2 rounded-lg bg-secondary border border-border text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50"
          />
        </div>
        <div className="flex gap-2 pt-2">
          <button
            type="submit"
            className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg bg-primary text-primary-foreground font-medium hover:bg-primary/90 transition-colors"
          >
            <Save className="w-4 h-4" />
            保存
          </button>
          {!isNew && onDelete && (
            <button
              type="button"
              onClick={() => {
                onDelete()
                onClose()
              }}
              className="flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg bg-destructive text-destructive-foreground font-medium hover:bg-destructive/90 transition-colors"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          )}
        </div>
      </form>
    </Modal>
  )
}

interface ConfirmModalProps {
  isOpen: boolean
  onClose: () => void
  onConfirm: () => void
  title: string
  message: string
  confirmText?: string
  cancelText?: string
  variant?: 'danger' | 'warning' | 'default'
}

export function ConfirmModal({ 
  isOpen, 
  onClose, 
  onConfirm, 
  title, 
  message, 
  confirmText = '确认',
  cancelText = '取消',
  variant = 'default'
}: ConfirmModalProps) {
  return (
    <Modal isOpen={isOpen} onClose={onClose} title={title}>
      <p className="text-muted-foreground mb-6">{message}</p>
      <div className="flex gap-2">
        <button
          onClick={onClose}
          className="flex-1 px-4 py-2.5 rounded-lg bg-secondary text-foreground font-medium hover:bg-muted transition-colors"
        >
          {cancelText}
        </button>
        <button
          onClick={() => {
            onConfirm()
            onClose()
          }}
          className={cn(
            'flex-1 px-4 py-2.5 rounded-lg font-medium transition-colors',
            variant === 'danger' && 'bg-destructive text-destructive-foreground hover:bg-destructive/90',
            variant === 'warning' && 'bg-warning text-background hover:bg-warning/90',
            variant === 'default' && 'bg-primary text-primary-foreground hover:bg-primary/90'
          )}
        >
          {confirmText}
        </button>
      </div>
    </Modal>
  )
}
