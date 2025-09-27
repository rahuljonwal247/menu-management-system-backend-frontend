export interface MenuItem {
  id: string;
  name: string;
  depth: number;
  parentId: string | null;
  position: number;
  createdAt: string;
  updatedAt: string;
  children?: MenuItem[];
  parent?: MenuItem | null;
}

export interface CreateMenuRequest {
  name: string;
  parentId?: string;
  position?: number;
}

export interface UpdateMenuRequest {
  id: string;
  name?: string;
  parentId?: string;
  position?: number;
   title?: string
}