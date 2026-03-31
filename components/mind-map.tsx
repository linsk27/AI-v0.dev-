'use client'

import { useState } from 'react'
import { cn } from '@/lib/utils'
import { type MindMapNode } from '@/lib/learning-data'
import { ChevronRight, ChevronDown, Circle, Zap, BookOpen } from 'lucide-react'

interface MindMapNodeProps {
  node: MindMapNode
  level: number
  isExpanded: boolean
  onToggle: () => void
  expandedNodes: Set<string>
  onToggleNode: (id: string) => void
}

function MindMapNodeItem({ 
  node, 
  level, 
  isExpanded, 
  onToggle,
  expandedNodes,
  onToggleNode
}: MindMapNodeProps) {
  const hasChildren = node.children && node.children.length > 0
  const isRoot = level === 0

  return (
    <div className="relative">
      <button
        onClick={onToggle}
        className={cn(
          'flex items-center gap-2 px-4 py-2.5 rounded-lg transition-all duration-200 text-left w-full',
          'hover:scale-[1.01]',
          isRoot 
            ? 'bg-foreground text-background font-bold text-lg px-6 py-3' 
            : level === 1
              ? 'bg-secondary text-foreground font-semibold border border-border hover:border-foreground/30'
              : 'bg-card text-foreground hover:bg-secondary border border-transparent hover:border-border'
        )}
      >
        {hasChildren && (
          isExpanded 
            ? <ChevronDown className={cn('w-4 h-4 shrink-0', isRoot && 'w-5 h-5')} />
            : <ChevronRight className={cn('w-4 h-4 shrink-0', isRoot && 'w-5 h-5')} />
        )}
        {!hasChildren && <Circle className="w-2 h-2 fill-current shrink-0" />}
        <div className="flex-1 min-w-0">
          <span className="block truncate">{node.label}</span>
          {node.description && (
            <span className={cn(
              'block text-xs mt-0.5',
              isRoot ? 'text-background/70' : 'text-muted-foreground'
            )}>
              {node.description}
            </span>
          )}
        </div>
      </button>

      {hasChildren && isExpanded && (
        <div className={cn(
          'ml-6 mt-2 space-y-2 relative',
          level > 0 && 'before:absolute before:left-0 before:top-0 before:bottom-0 before:w-px before:bg-border'
        )}>
          {node.children!.map((child) => {
            const childExpanded = expandedNodes.has(child.id)
            return (
              <div key={child.id} className="relative pl-4">
                {/* Connector */}
                <div className="absolute left-0 top-4 w-4 h-px bg-border" />
                <MindMapNodeItem
                  node={child}
                  level={level + 1}
                  isExpanded={childExpanded}
                  onToggle={() => onToggleNode(child.id)}
                  expandedNodes={expandedNodes}
                  onToggleNode={onToggleNode}
                />
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}

interface MindMapProps {
  data: MindMapNode
}

export function MindMap({ data }: MindMapProps) {
  const [expandedNodes, setExpandedNodes] = useState<Set<string>>(new Set(['root']))

  const toggleNode = (id: string) => {
    setExpandedNodes(prev => {
      const next = new Set(prev)
      if (next.has(id)) {
        next.delete(id)
      } else {
        next.add(id)
      }
      return next
    })
  }

  const expandAll = () => {
    const allIds = new Set<string>()
    const traverse = (node: MindMapNode) => {
      allIds.add(node.id)
      node.children?.forEach(traverse)
    }
    traverse(data)
    setExpandedNodes(allIds)
  }

  const collapseAll = () => {
    setExpandedNodes(new Set(['root']))
  }

  return (
    <div className="p-6 bg-card rounded-xl border border-border">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-2">
          <Zap className="w-5 h-5 text-foreground" />
          <h3 className="font-semibold text-foreground">知识体系</h3>
        </div>
        <div className="flex gap-2">
          <button 
            onClick={expandAll}
            className="text-xs px-3 py-1.5 rounded-full bg-secondary text-muted-foreground hover:text-foreground transition-colors"
          >
            展开全部
          </button>
          <button 
            onClick={collapseAll}
            className="text-xs px-3 py-1.5 rounded-full bg-secondary text-muted-foreground hover:text-foreground transition-colors"
          >
            收起全部
          </button>
        </div>
      </div>

      <div className="space-y-3">
        <MindMapNodeItem
          node={data}
          level={0}
          isExpanded={expandedNodes.has(data.id)}
          onToggle={() => toggleNode(data.id)}
          expandedNodes={expandedNodes}
          onToggleNode={toggleNode}
        />
      </div>
    </div>
  )
}

// Learning Resources Section
interface LearningResourcesProps {
  resources: { category: string; items: string[] }[]
}

export function LearningResources({ resources }: LearningResourcesProps) {
  return (
    <div className="mt-6 p-6 bg-card rounded-xl border border-border">
      <div className="flex items-center gap-2 mb-4">
        <BookOpen className="w-5 h-5 text-foreground" />
        <h3 className="font-semibold text-foreground">学习资源推荐</h3>
      </div>
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
        {resources.map((category) => (
          <div key={category.category} className="p-4 rounded-lg bg-secondary/50 border border-border">
            <h4 className="font-medium text-foreground mb-2">{category.category}</h4>
            <ul className="space-y-1.5">
              {category.items.map((item, i) => (
                <li key={i} className="text-sm text-muted-foreground flex items-start gap-2">
                  <Circle className="w-1.5 h-1.5 mt-2 fill-current shrink-0" />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </div>
  )
}
