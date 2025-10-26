import { create } from 'zustand';


interface DashboardState {
  filters: Record<string, unknown>;
  sort: string;
  search: string;
  page: number;
  limit: number;
  selectedItems: string[];
}

interface DashboardActions {
  setFilter: (key: string, value: unknown) => void;
  setFilters: (filters: Record<string, unknown>) => void;
  setSort: (sort: string) => void;
  setSearch: (search: string) => void;
  setPage: (page: number) => void;
  setLimit: (limit: number) => void;
  setSelectedItems: (items: string[]) => void;
  toggleSelectedItem: (id: string) => void;
  reset: () => void;
}

const initialState: DashboardState = {
  filters: {},
  sort: '-createdAt',
  search: '',
  page: 1,
  limit: 10,
  selectedItems: [],
};

/**
 * Dashboard store - manages global UI state for filters, pagination, and selections
 * Changes trigger React Query refetch through stable query keys
 */
export const useDashboardStore = create<DashboardState & DashboardActions>((set) => ({
  ...initialState,

  setFilter: (key: string, value: unknown) => {
    set((state) => ({
      filters: { ...state.filters, [key]: value },
      page: 1,
    }));
  },

  setFilters: (filters: Record<string, unknown>) => {
    set({ filters, page: 1 });
  },

  setSort: (sort: string) => {
    set({ sort, page: 1 });
  },

  setSearch: (search: string) => {
    set({ search, page: 1 });
  },

  setPage: (page: number) => {
    set({ page });
  },

  setLimit: (limit: number) => {
    set({ limit, page: 1 });
  },

  setSelectedItems: (selectedItems: string[]) => {
    set({ selectedItems });
  },

  toggleSelectedItem: (id: string) => {
    set((state) => ({
      selectedItems: state.selectedItems.includes(id)
        ? state.selectedItems.filter(item => item !== id)
        : [...state.selectedItems, id],
    }));
  },

  reset: () => {
    set(initialState);
  },
}));