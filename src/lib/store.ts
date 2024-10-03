import { create } from 'zustand'

interface Buffer {
  id: string;
  fileName: string;
  text: string;
  path: string | null;
}

interface EditorStore {
  mode: 'editing' | 'preview';
  currentBufferId: string | null;
  setMode: (mode: 'editing' | 'preview') => void;
  setCurrentBufferId: (id: string | null) => void;
}

interface AppStore {
  buffers: Buffer[];
  explorerOpen: boolean;
  addBuffer: (buffer: Buffer) => void;
  updateBuffer: (id: string, updates: Partial<Buffer>) => void;
  removeBuffer: (id: string) => void;
  setExplorerOpen: (explorerOpen: boolean) => void;
}

export const useEditorStore = create<EditorStore>((set) => ({
  mode: 'editing',
  currentBufferId: null,
  setMode: (mode) => set({ mode }),
  setCurrentBufferId: (id) => set({ currentBufferId: id }),
}));

export const useAppStore = create<AppStore>((set) => ({
  buffers: [],
  explorerOpen: false,
  setExplorerOpen: (explorerOpen: boolean) => set({explorerOpen}),
  addBuffer: (buffer) => set((state) => ({ buffers: [...state.buffers, buffer] })),
  updateBuffer: (id, updates) => set((state) => ({
    buffers: state.buffers.map(buf => buf.id === id ? { ...buf, ...updates } : buf)
  })),
  removeBuffer: (id) => set((state) => ({
    buffers: state.buffers.filter(buf => buf.id !== id)
  })),
}));
