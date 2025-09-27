
'use client'

import React, { useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { RootState } from '../lib/store'
import { setSelectedMenuType } from '../lib/features/menuSlice'
import { 
  Menu, 
  Code, 
  Settings, 
  List, 
  Folder,
  FolderOpen,
  ChevronLeft,
  ChevronRight
} from 'lucide-react'

interface MenuItem {
  id: string
  name: string
  icon: React.ElementType
  active?: boolean
  children?: MenuItem[]
  isExpanded?: boolean
}

interface SidebarProps {
  isOpen: boolean
  onToggle: () => void
}

const Sidebar: React.FC<SidebarProps> = ({ isOpen, onToggle }) => {
  const dispatch = useDispatch()
  const { selectedMenuType } = useSelector((state: RootState) => state.menu)
  
  const [menuState, setMenuState] = useState<MenuItem[]>([
    {
      id: 'systems',
      name: 'Systems',
      icon: Folder,
      isExpanded: true,
      children: [
        { id: 'system-code', name: 'System Code', icon: Code },
        { id: 'properties', name: 'Properties', icon: Settings },
        { id: 'menus', name: 'Menus', icon: Menu, active: true },
        { id: 'api-list', name: 'API List', icon: List }
      ]
    },
    { id: 'users-group', name: 'Users & Group', icon: Folder },
    { id: 'competition', name: 'Competition', icon: Folder }
  ])

  const toggleExpand = (itemId: string) => {
    setMenuState(prev =>
      prev.map(item =>
        item.id === itemId ? { ...item, isExpanded: !item.isExpanded } : item
      )
    )
  }

  const handleMenuClick = (item: MenuItem, isChild = false) => {
    if (item.children && !isChild) {
      toggleExpand(item.id)
    } else {
      dispatch(setSelectedMenuType(item.name.toLowerCase()))
      setMenuState(prev =>
        prev.map(mainItem => ({
          ...mainItem,
          children: mainItem.children?.map(child => ({
            ...child,
            active: child.id === item.id
          }))
        }))
      )
    }
  }

  const renderMenuItem = (item: MenuItem, isChild = false) => {
    const Icon = item.icon
    const hasChildren = item.children && item.children.length > 0
    const isExpanded = item.isExpanded || false

    return (
      <div key={item.id}>
        <button
          onClick={() => handleMenuClick(item, isChild)}
          className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg text-left transition-colors ${
            isChild && item.active
              ? 'bg-[#7CFF4F] text-black font-semibold'
              : 'text-slate-400 hover:bg-slate-700'
          } ${isChild ? 'ml-6 py-1.5' : ''}`}
          title={!isOpen ? item.name : undefined}
        >
          {/* Icon */}
          {hasChildren ? (
            isExpanded ? <FolderOpen className="w-4 h-4 flex-shrink-0" /> : <Folder className="w-4 h-4 flex-shrink-0" />
          ) : (
            <Icon className="w-4 h-4 flex-shrink-0" />
          )}
          {isOpen && <span className="flex-1 truncate">{item.name}</span>}
        </button>

        {/* Children in rounded group container */}
        {hasChildren && isExpanded && isOpen && (
          <ul className="mt-1 space-y-1 bg-slate-900 rounded-lg p-2">
            {item.children!.map(child => (
              <li key={child.id}>{renderMenuItem(child, true)}</li>
            ))}
          </ul>
        )}
      </div>
    )
  }

  return (
    <aside className={`hidden md:flex bg-[#0F172A] text-white h-screen flex-col transition-all duration-300 ease-in-out ${
      isOpen ? 'w-60' : 'w-16'
    }`}>
      {/* Header */}
      <div className="p-4 border-b border-slate-700 flex items-center justify-between">
        <div className={`flex items-center gap-2 transition-opacity duration-300 ${isOpen ? 'opacity-100' : 'opacity-0'}`}>
          <div className="bg-[#0F172A] text-slate-800 px-2 py-1 rounded text-sm font-bold flex items-center gap-2">
            {/* Optimized logo with responsive sizing and better loading */}
            <img 
              src="/svg-gobbler 1.svg" 
              alt="Logo" 
              className="w-[70px] h-[21px] object-contain"
              loading="eager"
              onError={(e) => {
                // Fallback if image fails to load
                e.currentTarget.style.display = 'none'
              }}
            />
          </div>
        </div>
        
        {/* Toggle Button with improved accessibility */}
        <button
          onClick={onToggle}
          className="p-1.5 rounded-lg hover:bg-slate-700 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500"
          title={isOpen ? 'Collapse sidebar' : 'Expand sidebar'}
          aria-label={isOpen ? 'Collapse sidebar' : 'Expand sidebar'}
        >
          {isOpen ? (
            /* Optimized menu icon with consistent sizing */
            <img 
              src="/menu_open_.svg" 
              alt="Close Menu" 
              className="w-6 h-6 object-contain"
              loading="eager"
              onError={(e) => {
                // Fallback to lucide icon if image fails
                e.currentTarget.style.display = 'none'
                e.currentTarget.insertAdjacentHTML('afterend', '<svg class="w-6 h-6"><use href="#chevron-left"></use></svg>')
              }}
            />
          ) : (
            <Menu className="w-6 h-6" />
          )}
        </button>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-4 overflow-hidden">
        <ul className="space-y-3">
          {menuState.map(item => (
            <li key={item.id}>{renderMenuItem(item)}</li>
          ))}
        </ul>
      </nav>

      {/* Collapse/Expand hint when closed */}
      {!isOpen && (
        <div className="p-4 border-t border-slate-700">
          <button
            onClick={onToggle}
            className="w-full p-2 rounded-lg hover:bg-slate-700 transition-colors flex items-center justify-center focus:outline-none focus:ring-2 focus:ring-blue-500"
            title="Expand sidebar"
            aria-label="Expand sidebar"
          >
            <Menu className="w-6 h-6" />
          </button>
        </div>
      )}
    </aside>
  )
}

export default Sidebar