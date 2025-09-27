import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit'
import axios from 'axios'

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001'

export interface MenuItem {
  id: string
  name: string
  depth: number
  parentId: string | null
  position: number
  createdAt: string
  updatedAt: string
  children?: MenuItem[]
  parent?: MenuItem | null
}

export interface CreateMenuRequest {
  name: string
  parentId?: string
  position?: number
}

export interface UpdateMenuRequest {
  id: string
  name?: string
  parentId?: string
  position?: number
}

interface MenuState {
  menus: MenuItem[]
  hierarchicalMenus: MenuItem[]
  selectedMenu: MenuItem | null
  selectedMenuType: string
  loading: boolean
  error: string | null
}

const initialState: MenuState = {
  menus: [],
  hierarchicalMenus: [],
  selectedMenu: null,
  selectedMenuType: 'system management',
  loading: false,
  error: null,
}

// Async thunks
export const fetchMenus = createAsyncThunk('menu/fetchMenus', async () => {
  const response = await axios.get(`${API_BASE_URL}/api/menus`)
  return response.data
})

export const fetchHierarchicalMenus = createAsyncThunk(
  'menu/fetchHierarchicalMenus',
  async () => {
    const response = await axios.get(`${API_BASE_URL}/api/menus/hierarchy`)
    return response.data
  }
)

export const fetchMenuById = createAsyncThunk(
  'menu/fetchMenuById',
  async ({ id, depth }: { id: string; depth?: number }) => {
    const url = depth 
      ? `${API_BASE_URL}/api/menus/${id}?depth=${depth}`
      : `${API_BASE_URL}/api/menus/${id}`
    const response = await axios.get(url)
    return response.data
  }
)

export const createMenu = createAsyncThunk(
  'menu/createMenu',
  async (menuData: CreateMenuRequest) => {
    const response = await axios.post(`${API_BASE_URL}/api/menus`, menuData)
    return response.data
  }
)

export const updateMenu = createAsyncThunk(
  'menu/updateMenu',
  async ({ id, ...updateData }: UpdateMenuRequest) => {
    const response = await axios.patch(`${API_BASE_URL}/api/menus/${id}`, updateData)
    return response.data
  }
)

export const deleteMenu = createAsyncThunk(
  'menu/deleteMenu',
  async (id: string) => {
    await axios.delete(`${API_BASE_URL}/api/menus/${id}`)
    return id
  }
)

const menuSlice = createSlice({
  name: 'menu',
  initialState,
  reducers: {
    setSelectedMenu: (state, action: PayloadAction<MenuItem | null>) => {
      state.selectedMenu = action.payload
    },
    setSelectedMenuType: (state, action: PayloadAction<string>) => {
      state.selectedMenuType = action.payload
    },
    clearError: (state) => {
      state.error = null
    },
  },
  extraReducers: (builder) => {
    // Fetch menus
    builder
      .addCase(fetchMenus.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(fetchMenus.fulfilled, (state, action) => {
        state.loading = false
        state.menus = action.payload
      })
      .addCase(fetchMenus.rejected, (state, action) => {
        state.loading = false
        state.error = action.error.message || 'Failed to fetch menus'
      })

    // Fetch hierarchical menus
    builder
      .addCase(fetchHierarchicalMenus.fulfilled, (state, action) => {
        state.hierarchicalMenus = action.payload
      })

    // Fetch menu by ID
    builder
      .addCase(fetchMenuById.fulfilled, (state, action) => {
        state.selectedMenu = action.payload
      })

    // Create menu
    builder
      .addCase(createMenu.fulfilled, (state, action) => {
        state.menus.push(action.payload)
      })

    // Update menu
    builder
      .addCase(updateMenu.fulfilled, (state, action) => {
        const index = state.menus.findIndex(menu => menu.id === action.payload.id)
        if (index !== -1) {
          state.menus[index] = action.payload
        }
        if (state.selectedMenu?.id === action.payload.id) {
          state.selectedMenu = action.payload
        }
      })

    // Delete menu
    builder
      .addCase(deleteMenu.fulfilled, (state, action) => {
        state.menus = state.menus.filter(menu => menu.id !== action.payload)
        if (state.selectedMenu?.id === action.payload) {
          state.selectedMenu = null
        }
      })
  },
})

export const { setSelectedMenu, setSelectedMenuType, clearError } = menuSlice.actions
export default menuSlice.reducer