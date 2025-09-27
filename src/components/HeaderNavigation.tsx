'use client'

import React, { useState } from 'react'
import { 
  Folder, 
  FolderOpen, 
  ChevronRight, 
  ChevronDown, 
  Menu,
  Home,
  Settings,
  Code
} from 'lucide-react'

interface HeaderNavigationProps {
  currentPath?: string[]
  onPathChange?: (path: string[]) => void
}

const HeaderNavigation: React.FC<HeaderNavigationProps> = ({ 
  currentPath = ['Systems', 'Menus'],
  onPathChange 
}) => {




  const handlePathClick = (newPath: string[]) => {
    onPathChange?.(newPath)
  }

  return (
    <div className="border-b border-gray-200 bg-white">
      {/* Breadcrumb Navigation */}
      <div className="px-4 py-3 border-b border-gray-100">
        <div className="flex items-center gap-2 text-sm">
          <Folder className="w-4 h-4 text-gray-400" />
          {currentPath.map((item, index) => (
            <React.Fragment key={index}>
              <ChevronRight className="w-3 h-3 text-gray-400" />
              <button 
                className={`hover:text-blue-600 transition-colors ${
                  index === currentPath.length - 1 
                    ? 'text-gray-900 font-medium' 
                    : 'text-gray-500'
                }`}
                onClick={() => handlePathClick(currentPath.slice(0, index + 1))}
              >
                {item}
              </button>
            </React.Fragment>
          ))}
        </div>
      </div>
    </div>
  )
}

export default HeaderNavigation