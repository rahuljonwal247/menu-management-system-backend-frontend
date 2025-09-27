
'use client'

import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { AppDispatch, RootState } from '../lib/store'
import { fetchHierarchicalMenus, setSelectedMenu } from '../lib/features/menuSlice'
import Sidebar from '../components/Sidebar'
import MenuTreeItem from '../components/MenuTreeItem'
import MenuForm from '../components/MenuForm'
import { ChevronDown, Plus, Grid3X3, Menu, X, Folder ,ChevronRight} from 'lucide-react'
import HeaderNavigation from '../components/HeaderNavigation'

export default function Home() {
  const dispatch = useDispatch<AppDispatch>()
  const { hierarchicalMenus, selectedMenu, selectedMenuType, loading } = useSelector(
    (state: RootState) => state.menu
  )
  
  // Sidebar state
  const [isSidebarOpen, setIsSidebarOpen] = useState(true)
  
  // Existing states
  const [globalExpandState, setGlobalExpandState] = useState<'expand' | 'collapse' | null>(null)
  const [selectedMenuSystem, setSelectedMenuSystem] = useState('system management')
  const [showCreateForm, setShowCreateForm] = useState(false)
  const [createParentId, setCreateParentId] = useState<string>('')
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false)
  const [showMobileForm, setShowMobileForm] = useState(false)
  const [currentPath, setCurrentPath] = useState(['Systems', 'Menus'])

  useEffect(() => {
    dispatch(fetchHierarchicalMenus())
  }, [dispatch])

  // Sidebar toggle function
  const toggleSidebar = () => {
    setIsSidebarOpen(prev => !prev)
  }

  const handleAddChild = (parentId: string) => {
    setCreateParentId(parentId)
    setShowCreateForm(true)
    setShowMobileForm(true)
    dispatch(setSelectedMenu(null))
  }

  const handleAddRoot = () => {
    setCreateParentId('')
    setShowCreateForm(true)
    setShowMobileForm(true)
    dispatch(setSelectedMenu(null))
  }

  const handleCloseCreateForm = () => {
    setShowCreateForm(false)
    setShowMobileForm(false)
    setCreateParentId('')
  }

  const handleMenuSelect = (menu: any) => {
    dispatch(setSelectedMenu(menu))
    setShowMobileForm(true)
    setShowCreateForm(false)
  }

  const handlePathChange = (newPath: string[]) => {
    setCurrentPath(newPath)
  }

  const handleExpandAll = () => {
    setGlobalExpandState('expand')
    setTimeout(() => setGlobalExpandState(null), 100)
  }

  const handleCollapseAll = () => {
    setGlobalExpandState('collapse')
    setTimeout(() => setGlobalExpandState(null), 100)
  }

  const handleMenuSystemChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedMenuSystem(e.target.value)
  }

  // Filter menus based on selected menu system
  const getFilteredMenus = () => {
    if (selectedMenuSystem === 'system management') {
      return hierarchicalMenus
    }
    
    const selectedMenu = hierarchicalMenus.find(menu => 
      menu.name  === selectedMenuSystem
    )
    
    return selectedMenu ? [selectedMenu] : hierarchicalMenus
  }

  const filteredMenus = getFilteredMenus()

  return (
    <div className="flex h-screen bg-gray-50 overflow-hidden">
      {/* Desktop Sidebar with toggle functionality */}
      <Sidebar isOpen={isSidebarOpen} onToggle={toggleSidebar} />

      {/* Mobile Sidebar Overlay */}
      {isMobileSidebarOpen && (
        <>
          <div 
            className="fixed inset-0 bg-[#0F172A] bg-opacity-50 z-40 md:hidden"
            onClick={() => setIsMobileSidebarOpen(false)}
          />
          <div className="fixed left-0 top-0 h-full w-64 bg-slate-800 text-white z-50 md:hidden">
            <div className="p-4 border-b border-slate-700 flex items-center justify-between">
              <div className="flex items-center gap-2">
              <div className=" text-slate-800 px-2 py-1 rounded text-sm font-bold flex items-center gap-2">
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
              <button 
                onClick={() => setIsMobileSidebarOpen(false)}
                className="p-1 hover:bg-slate-700 rounded"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <nav className="flex-1 p-4">
              <div className="space-y-2">
                {['Systems', 'System Code', 'Properties', 'Menus', 'API List', 'Users & Group', 'Competition'].map((item, index) => (
                  <button
                    key={item}
                    className={`w-full flex items-center gap-3 px-3 py-3 rounded-lg text-left transition-colors ${
                      item === 'Menus' 
                        ? 'bg-green-500 text-white' 
                        : 'text-slate-300 hover:bg-slate-700'
                    }`}
                    onClick={() => setIsMobileSidebarOpen(false)}
                  >
                    <Grid3X3 className="w-5 h-5" />
                    {item}
                  </button>
                ))}
              </div>
            </nav>
          </div>
        </>
      )}

      {/* Main Content Area - Responsive to sidebar state */}
      <div className={`flex-1 flex flex-col overflow-hidden transition-all duration-300 ease-in-out ${
        isSidebarOpen ? 'md:ml-0' : 'md:ml-0'
      }`}>
        {/* Desktop Header Navigation */}
        <div className="hidden md:block">
          <HeaderNavigation 
            currentPath={currentPath} 
            onPathChange={handlePathChange}
          />
        </div>

        {/* Mobile Header */}
        <div className="md:hidden bg-white border-b border-slate-200 p-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg flex items-center justify-center">
              <Folder className="w-8 h-8 text-gray-400" />
            </div>
            <ChevronRight className="w-3 h-3 text-gray-400" />
            <h1 className="text-xl font-semibold text-slate-800"> Menus</h1>
          </div>
          <button
            onClick={() => setIsMobileSidebarOpen(true)}
            className="p-2 rounded-lg hover:bg-slate-100 transition-colors"
          >
            <Menu className="w-6 h-6 text-slate-600" />
          </button>
        </div>

        {/* Content Panels */}
        <div className="flex-1 flex flex-col md:flex-row overflow-hidden">
          {/* Menu Tree Panel */}
          <div className={`
            ${showMobileForm ? 'hidden md:flex' : 'flex'} 
            w-full md:w-1/2 bg-white border-r border-slate-200 flex-col transition-all duration-300
          `}>
            {/* Header with Controls - Only show when menus exist */}
            {!loading && filteredMenus.length > 0 && (
              <div className="p-4 border-b border-gray-200">
                <div className="flex items-center gap-2 mb-3">
                  <div className="w-8 h-8 bg-blue-500 rounded-lg flex items-center justify-center">
                    <Grid3X3 className="w-4 h-4 text-white" />
                  </div>
                  <h2 className="text-lg font-medium text-gray-900">Menu</h2>
                  
                  {/* Desktop sidebar toggle button in header */}
                  <div className="hidden md:block ml-auto">
                    <button
                      onClick={toggleSidebar}
                      className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
                      title={isSidebarOpen ? 'Hide sidebar' : 'Show sidebar'}
                    >
                      <Menu className="w-4 h-4 text-gray-600" />
                    </button>
                  </div>
                </div>
                
                {/* Dropdown */}
                <div className="mb-4">
                  <select 
                    value={selectedMenuSystem}
                    onChange={handleMenuSystemChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded text-sm bg-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  >
                    <option value="">All</option>
                    {hierarchicalMenus.map((menu) => (
                      <option key={menu.id} value={menu.name }>
                        {menu.name }
                      </option>
                    ))}
                  </select>
                </div>

                {/* Control Buttons */}
                <div className="flex gap-2 flex-wrap">
                  <button
                    onClick={handleExpandAll}
                    className="px-3 py-1.5 bg-gray-800 text-white text-sm rounded hover:bg-gray-700 transition-colors"
                  >
                    Expand All
                  </button>
                  <button
                    onClick={handleCollapseAll}
                    className="px-3 py-1.5 bg-gray-200 text-gray-700 text-sm rounded hover:bg-gray-300 transition-colors"
                  >
                    Collapse All
                  </button>
                  <button
                    onClick={handleAddRoot}
                    className="px-3 py-1.5 bg-blue-500 text-white text-sm rounded hover:bg-blue-600 transition-colors flex items-center gap-1"
                  >
                    <Plus className="w-3 h-3" />
                    Add Root
                  </button>
                </div>
              </div>
            )}

            {/* Hierarchical Tree */}
            <div className="flex-1 overflow-auto">
              {loading ? (
                <div className="p-6 text-center text-gray-500">Loading...</div>
              ) : filteredMenus.length === 0 ? (
                <div className="p-6 text-center text-gray-500">
                  <div className="mb-4">
                    <Grid3X3 className="w-12 h-12 mx-auto text-gray-300 mb-2" />
                    <p className="text-sm">No menus found for "{selectedMenuSystem}"</p>
                  </div>
                  <button
                    onClick={handleAddRoot}
                    className="px-4 py-2 bg-blue-500 text-white text-sm rounded hover:bg-blue-600 transition-colors"
                  >
                    Create your first menu
                  </button>
                </div>
              ) : (
                <div className="p-4">
                  <div className="font-mono text-sm leading-6">
                    {filteredMenus.map((menu, index) => (
                      <MenuTreeItem
                        key={menu.id}
                        item={menu}
                        level={0}
                        isLast={index === filteredMenus.length - 1}
                        parentLines={[]}
                        onAddChild={handleAddChild}
                        onSelect={handleMenuSelect}
                        globalExpandState={globalExpandState}
                      />
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Form Panel */}
          <div className={`
            ${showMobileForm ? 'flex' : 'hidden md:flex'}
            w-full md:w-1/2 flex-col relative
          `}>
            {/* Mobile Form Header */}
            <div className="md:hidden bg-white border-b border-slate-200 p-4 flex items-center justify-between">
              <h2 className="text-lg font-semibold">
                {showCreateForm ? 'Create Menu' : 'Edit Menu'}
              </h2>
              <button
                onClick={() => setShowMobileForm(false)}
                className="p-2 rounded-lg hover:bg-slate-100"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Form Content */}
            <div className="flex-1 p-4 md:p-6 overflow-auto">
              {showCreateForm ? (
                <MenuForm
                  isCreating={true}
                  parentId={createParentId}
                  onClose={handleCloseCreateForm}
                />
              ) : (
                <MenuForm />
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}