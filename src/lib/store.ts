import { create } from 'zustand';

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

const loadBuffersFromLocalStorage = () => {
  const savedBuffers = localStorage.getItem('buffers');
  return savedBuffers ? JSON.parse(savedBuffers) : [];
};

const saveBuffersToLocalStorage = (buffers: Buffer[]) => {
  localStorage.setItem('buffers', JSON.stringify(buffers));
};

export const useEditorStore = create<EditorStore>((set) => ({
  mode: 'editing',
  currentBufferId: null,
  setMode: (mode) => set({ mode }),
  setCurrentBufferId: (id) => set({ currentBufferId: id }),
}));

export const useAppStore = create<AppStore>((set) => ({
  buffers: loadBuffersFromLocalStorage(), // Load buffers on store initialization
  explorerOpen: false,
  setExplorerOpen: (explorerOpen: boolean) => set({ explorerOpen }),
  addBuffer: (buffer) => {
    set((state) => {
      const newBuffers = [...state.buffers, buffer];
      saveBuffersToLocalStorage(newBuffers); // Save to local storage
      return { buffers: newBuffers };
    });
  },
  updateBuffer: (id, updates) => {
    set((state) => {
      const updatedBuffers = state.buffers.map(buf => 
        buf.id === id ? { ...buf, ...updates } : buf
      );
      saveBuffersToLocalStorage(updatedBuffers); // Save to local storage
      return { buffers: updatedBuffers };
    });
  },
  removeBuffer: (id) => {
    set((state) => {
      const filteredBuffers = state.buffers.filter(buf => buf.id !== id);
      saveBuffersToLocalStorage(filteredBuffers); // Save to local storage
      return { buffers: filteredBuffers };
    });
  },
}));
