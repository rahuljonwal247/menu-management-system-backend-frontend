
'use client'

import React, { useEffect, useState } from 'react'
import { useDispatch } from 'react-redux'
import { AppDispatch } from '../lib/store'
import { MenuItem, setSelectedMenu, deleteMenu, fetchHierarchicalMenus } from '../lib/features/menuSlice'
import { ChevronDown, ChevronRight, Plus, Trash2 } from 'lucide-react'

interface MenuTreeItemProps {
  item: MenuItem
  level?: number
  isLast?: boolean
  parentLines?: boolean[]
  onAddChild?: (parentId: string) => void
  onSelect?: (item: MenuItem) => void
  globalExpandState?: 'expand' | 'collapse' | null   // 👈 NEW
}

const MenuTreeItem: React.FC<MenuTreeItemProps> = ({ 
  item, 
  level = 0, 
  isLast = true,
  parentLines = [],
  onAddChild,
  onSelect,
  globalExpandState = null
}) => {
  const dispatch = useDispatch<AppDispatch>()
  const [isExpanded, setIsExpanded] = useState(true)
  const hasChildren = item.children && item.children.length > 0

  // 👇 listen to global expand/collapse state
  useEffect(() => {
    if (globalExpandState === 'expand') setIsExpanded(true)
    if (globalExpandState === 'collapse') setIsExpanded(false)
  }, [globalExpandState])

  const handleSelect = () => {
    dispatch(setSelectedMenu(item))
    onSelect?.(item)
  }

  const handleToggle = (e: React.MouseEvent) => {
    e.stopPropagation()
    setIsExpanded(!isExpanded)
  }

  const handleDelete = async (e: React.MouseEvent) => {
    e.stopPropagation()
    if (confirm(`Are you sure you want to delete "${item.name}"?`)) {
      await dispatch(deleteMenu(item.id))
      dispatch(fetchHierarchicalMenus())
    }
  }

  const handleAddChild = (e: React.MouseEvent) => {
    e.stopPropagation()
    onAddChild?.(item.id)
  }

  return (
    <div className="relative">
      {/* Current Node */}
      <div 
        className="flex items-center hover:bg-gray-50 cursor-pointer group py-0.5"
        onClick={handleSelect}
        style={{ paddingLeft: `${level * 24}px` }}
      >
        {/* Expand/Collapse Button */}
        <div className="w-4 h-4 flex items-center justify-center mr-1 relative z-10">
          {hasChildren && (
            <button
              onClick={handleToggle}
              className="w-4 h-4 flex items-center justify-center hover:bg-gray-200 rounded transition-colors"
            >
              {isExpanded ? (
                <ChevronDown className="w-3 h-3 text-gray-600" />
              ) : (
                <ChevronRight className="w-3 h-3 text-gray-600" />
              )}
            </button>
          )}
        </div>

        {/* Node Content */}
        <div className="flex items-center flex-1 py-1">
          <span className="text-sm text-gray-700 select-none">
            {item.name}
          </span>
        </div>

        {/* Action Buttons */}
        <div className="opacity-0 group-hover:opacity-100 flex items-center gap-1 transition-opacity">
          <button
            onClick={handleAddChild}
            className="w-6 h-6 flex items-center justify-center text-blue-500 hover:bg-blue-50 rounded transition-colors"
            title="Add child menu"
          >
            <Plus className="w-3 h-3" />
          </button>
          <button
            onClick={handleDelete}
            className="w-6 h-6 flex items-center justify-center text-red-500 hover:bg-red-50 rounded transition-colors"
            title="Delete menu"
          >
            <Trash2 className="w-3 h-3" />
          </button>
        </div>
      </div>

      {/* Children */}
      {hasChildren && isExpanded && (
        <div>
          {item.children!.map((child, index) => {
            const isLastChild = index === item.children!.length - 1
            const newParentLines = [...parentLines, !isLast]
            
            return (
              <MenuTreeItem
                key={child.id}
                item={child}
                level={level + 1}
                isLast={isLastChild}
                parentLines={newParentLines}
                onAddChild={onAddChild}
                onSelect={onSelect}
                globalExpandState={globalExpandState}  // 👈 pass down
              />
            )
          })}
        </div>
      )}
    </div>
  )
}

export default MenuTreeItem
