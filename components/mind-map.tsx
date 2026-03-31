'use client'

import { useState } from 'react'
import { cn } from '@/lib/utils'
import { mindMapData, type MindMapNode } from '@/lib/learning-data'
import { ChevronRight, ChevronDown, Circle, Zap } from 'lucide-react'

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

  const colors = [
    'from-primary to-primary/80',
    'from-blue-500 to-blue-400',
    'from-emerald-500 to-emerald-400',
    'from-amber-500 to-amber-400',
    'from-pink-500 to-pink-400',
    'from-purple-500 to-purple-400',
  ]

  return (
    <div className="relative">
      <button
        onClick={onToggle}
        className={cn(
          'flex items-center gap-2 px-4 py-2 rounded-lg transition-all duration-200',
          'hover:scale-[1.02]',
          isRoot 
            ? 'bg-gradient-to-r from-primary to-accent text-primary-foreground font-bold text-lg px-6 py-3' 
            : level === 1
              ? cn('bg-gradient-to-r text-white font-semibold', colors[parseInt(node.id.slice(-1)) % colors.length] || colors[0])
              : 'bg-secondary/80 text-foreground hover:bg-secondary'
        )}
      >
        {hasChildren && (
          isExpanded 
            ? <ChevronDown className={cn('w-4 h-4', isRoot && 'w-5 h-5')} />
            : <ChevronRight className={cn('w-4 h-4', isRoot && 'w-5 h-5')} />
        )}
        {!hasChildren && <Circle className="w-2 h-2 fill-current" />}
        <span>{node.label}</span>
      </button>

      {hasChildren && isExpanded && (
        <div className={cn(
          'ml-6 mt-2 space-y-2 relative',
          level > 0 && 'before:absolute before:left-0 before:top-0 before:bottom-0 before:w-px before:bg-border'
        )}>
          {node.children!.map((child, index) => {
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

export function MindMap() {
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
    traverse(mindMapData)
    setExpandedNodes(allIds)
  }

  const collapseAll = () => {
    setExpandedNodes(new Set(['root']))
  }

  return (
    <div className="p-6 bg-card rounded-xl border border-border">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-2">
          <Zap className="w-5 h-5 text-primary" />
          <h3 className="font-semibold text-foreground">知识体系</h3>
        </div>
        <div className="flex gap-2">
          <button 
            onClick={expandAll}
            className="text-xs px-3 py-1 rounded-full bg-secondary text-muted-foreground hover:text-foreground transition-colors"
          >
            展开全部
          </button>
          <button 
            onClick={collapseAll}
            className="text-xs px-3 py-1 rounded-full bg-secondary text-muted-foreground hover:text-foreground transition-colors"
          >
            收起全部
          </button>
        </div>
      </div>

      <div className="space-y-3">
        <MindMapNodeItem
          node={mindMapData}
          level={0}
          isExpanded={expandedNodes.has(mindMapData.id)}
          onToggle={() => toggleNode(mindMapData.id)}
          expandedNodes={expandedNodes}
          onToggleNode={toggleNode}
        />
      </div>
    </div>
  )
}
