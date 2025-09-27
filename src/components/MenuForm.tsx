'use client'

import React, { useState, useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { AppDispatch, RootState } from '../lib/store'
import { updateMenu, createMenu, fetchHierarchicalMenus } from '../lib/features/menuSlice'

interface MenuFormProps {
  isCreating?: boolean
  parentId?: string
  onClose?: () => void
}

const MenuForm: React.FC<MenuFormProps> = ({ 
  isCreating = false, 
  parentId,
  onClose 
}) => {
  const dispatch = useDispatch<AppDispatch>()
  const { selectedMenu, loading } = useSelector((state: RootState) => state.menu)
  
  const [formData, setFormData] = useState({
    name: '',
    parentId: parentId || '',
  })

  useEffect(() => {
    if (selectedMenu && !isCreating) {
      setFormData({
        name: selectedMenu.name,
        parentId: selectedMenu.parentId || '',
      })
    } else if (isCreating) {
      setFormData({
        name: '',
        parentId: parentId || '',
      })
    }
  }, [selectedMenu, isCreating, parentId])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    try {
      if (isCreating) {
        await dispatch(createMenu({
          name: formData.name,
          parentId: formData.parentId || undefined,
        }))
      } else if (selectedMenu) {
        await dispatch(updateMenu({
          id: selectedMenu.id,
          name: formData.name,
          parentId: formData.parentId || undefined,
        }))
      }
      
      // Refresh the hierarchical menus
      dispatch(fetchHierarchicalMenus())
      
      if (onClose) {
        onClose()
      }
    } catch (error) {
      console.error('Error saving menu:', error)
    }
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    })
  }

  if (!isCreating && !selectedMenu) {
    return (
      <div className="bg-white rounded-lg p-4 md:p-6 text-center text-slate-500">
        <div className="mb-4">
          <div className="w-16 h-16 md:w-20 md:h-20 mx-auto bg-slate-100 rounded-full flex items-center justify-center mb-3">
            <span className="text-2xl md:text-3xl">📝</span>
          </div>
          <h3 className="text-lg font-medium mb-2">Select a menu item</h3>
          <p className="text-sm text-slate-400">
            Click on any menu item from the tree to edit its details
          </p>
        </div>
      </div>
    )
  }

  return (
    <div className="bg-white rounded-lg">
      <div className="p-4 md:p-6">
        <h3 className="text-lg md:text-xl font-semibold mb-6">
          {isCreating ? 'Create New Menu' : 'Edit Menu'}
        </h3>
        
        <form onSubmit={handleSubmit} className="space-y-4 md:space-y-5">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">
              Menu ID
            </label>
            <input
              type="text"
              value={isCreating ? 'Auto-generated' : (selectedMenu?.id || '')}
              disabled
              className="w-full px-3 py-3 md:py-2 border border-slate-300 rounded-lg bg-slate-50 text-slate-500 text-sm"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">
              Depth
            </label>
            <input
              type="text"
              value={isCreating ? (parentId ? '1+' : '0') : (selectedMenu?.depth || 0)}
              disabled
              className="w-full px-3 py-3 md:py-2 border border-slate-300 rounded-lg bg-slate-50 text-slate-500 text-sm"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">
              Parent Data
            </label>
            <input
              type="text"
              value={formData.parentId || 'Root'}
              disabled
              className="w-full px-3 py-3 md:py-2 border border-slate-300 rounded-lg bg-slate-50 text-slate-500 text-sm"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">
              Name *
            </label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              required
              className="w-full px-3 py-3 md:py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
              placeholder="Enter menu name"
            />
          </div>

          <div className="flex flex-col md:flex-row gap-3 pt-4">
            <button
              type="submit"
              disabled={loading}
              className="flex-1 bg-blue-500 text-white py-3 md:py-2 px-4 rounded-lg hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors text-sm font-medium"
            >
              {loading ? 'Saving...' : 'Save'}
            </button>
            {onClose && (
              <button
                type="button"
                onClick={onClose}
                className="md:flex-none px-4 py-3 md:py-2 border border-slate-300 rounded-lg hover:bg-slate-50 transition-colors text-sm font-medium"
              >
                Cancel
              </button>
            )}
          </div>
        </form>
      </div>
    </div>
  )
}

export default MenuForm