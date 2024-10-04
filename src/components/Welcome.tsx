import { useAppStore, useEditorStore } from '../lib/store';
import { v4 as uuidv4 } from 'uuid';
import { open } from '@tauri-apps/plugin-dialog';
import { readTextFile } from '@tauri-apps/plugin-fs';

export const WelcomeScreen = () => {
  const { addBuffer } = useAppStore();
  const { setCurrentBufferId } = useEditorStore();

  const handleOpenFile = async () => {
    try {
      const selected = await open({
        multiple: false,
        filters: [{ name: 'Markdown', extensions: ['md'] }]
      });
      if (selected && typeof selected === 'string') {
        const content = await readTextFile(selected);
        const newBuffer = {
          id: uuidv4(),
          fileName: selected.split('/').pop() || 'Untitled',
          text: content,
          path: selected
        };
        addBuffer(newBuffer);
        setCurrentBufferId(newBuffer.id);
      }
    } catch (err) {
      console.error('Failed to open file:', err);
    }
  };

  const handleNewFile = () => {
    const newBuffer = {
      id: uuidv4(),
      fileName: 'Untitled.md',
      text: '',
      path: null
    };
    addBuffer(newBuffer);
    setCurrentBufferId(newBuffer.id);
  };


  return (
    <div className="flex mono flex-col font-mono items-center justify-center h-screen fixed top-0 left-0 w-screen">
      <div
        className="absolute inset-0 h-full w-full bg-neutral-100 dark:bg-neutral-950 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px]"
      ></div>
      <h1 className="text-2xl z-[10] mb-4 transition font-mono"> <span className="text-neutral-400 transition dark:text-neutral-600">//</span> <span className="text-indigo-600 transition dark:text-amber-400">Ze</span>::Note</h1>
      <button
        className="px-4 z-[10] py-2" onClick={handleNewFile}
      >
        {'>'} Create a new file
      </button>
      <button
        className="px-4 z-[10] py-2" onClick={handleOpenFile}
      >
        {'>'} Open an existing file
      </button>
    </div>
  );
};
