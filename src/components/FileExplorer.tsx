import React from 'react';
import { useAppStore, useEditorStore } from '../lib/store';
import { open, save } from '@tauri-apps/plugin-dialog';
import { readTextFile, writeTextFile } from '@tauri-apps/plugin-fs';
import { v4 as uuidv4 } from 'uuid';

import {X} from "lucide-react"

export const FileExplorer: React.FC<{ isOpen: boolean }> = ({ isOpen }) => {
  const { buffers, addBuffer, updateBuffer, removeBuffer, setExplorerOpen, explorerOpen } = useAppStore();
  const { currentBufferId, setCurrentBufferId } = useEditorStore();

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

  const saveFile = async () => {
    const { buffers } = useAppStore.getState();  
    const { currentBufferId } = useEditorStore.getState(); 
    const currentBuffer = buffers.find(buf => buf.id === currentBufferId);

    if (!currentBuffer || !currentBuffer.path) {
      handleSaveFile()
      console.error('No file selected or file does not have a path.');
      return;
    }

    try {
      await writeTextFile(currentBuffer.path, currentBuffer.text);
      console.log('File saved successfully');
    } catch (error) {
      console.error('Error saving the file:', error);
    }
  };

  const handleSaveFile = async () => {
    const currentBuffer = buffers.find(buf => buf.id === currentBufferId);
    if (!currentBuffer) return;

    if (!currentBuffer.path) {
      const savePath = await save({
        filters: [{ name: 'Markdown', extensions: ['md'] }]
      });
      if (savePath) {
        await writeTextFile(savePath, currentBuffer.text );
        updateBuffer(currentBuffer.id, { path: savePath, fileName: savePath.split('/').pop() || 'Untitled' });
      }
    } else {
      await writeTextFile(savePath, currentBuffer.text );
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

  const cycleBuffer = (direction: number) => {
    console.log("hi")
    const currentIndex = buffers.findIndex(buf => buf.id === currentBufferId);
    if (currentIndex !== -1) {
      const newIndex = (currentIndex + direction + buffers.length) % buffers.length;
      setCurrentBufferId(buffers[newIndex].id);
    }
  };


  const handleKeyDown = (e: KeyboardEvent) => {
    if ((e.ctrlKey || e.metaKey) && e.key === 's') {
      e.preventDefault(); 
      saveFile();
    }else if ((e.ctrlKey || e.metaKey) && e.key === 'n') {
      e.preventDefault(); 
      handleNewFile();
    }else if ((e.ctrlKey || e.metaKey) && e.key === 'o') {
      e.preventDefault(); 
      handleOpenFile();
    } else if (e.ctrlKey && e.shiftKey && e.key === 'S') {
      e.preventDefault(); 
      handleSaveFile();
    } else if (e.ctrlKey && e.shiftKey && e.key === 'H') {
      e.preventDefault(); 
      cycleBuffer(-1);
    } else if (e.ctrlKey && e.shiftKey && e.key === 'L') {
      e.preventDefault(); 
      cycleBuffer(1);
    }
  };

  React.useEffect(() => {
    document.addEventListener('keydown', handleKeyDown);
    return () => {
      document.removeEventListener('keydown', handleKeyDown); // Cleanup the listener when component unmounts
    };
  });

  return (
    <div className={`fixed z-[100] left-0 top-0 h-full w-96 bg-neutral-200 dark:bg-neutral-900 p-4 transform transition-transform duration-300 ease-in-out ${isOpen ? 'translate-x-0' : '-translate-x-full'}`}>
      <h2 className="text-xl font-bold mb-4">File Explorer</h2>
      <div className="space-y-2 mb-4">
        <button onClick={handleNewFile} className="w-full py-2 px-4 bg-neutral-300 text-neutral-900 dark:text-neutral-100 dark:bg-neutral-800 rounded hover:text-white hover:bg-indigo-600 dark:hover:bg-amber-400 transition">New File</button>
        <button onClick={handleOpenFile} className="w-full py-2 px-4 bg-neutral-300 text-neutral-900 dark:text-neutral-100 dark:bg-neutral-800 rounded hover:text-white hover:bg-indigo-600 dark:hover:bg-amber-400 transition">Open existing file</button>
        <button onClick={handleSaveFile} className="w-full py-2 px-4 bg-neutral-300 text-neutral-900 dark:text-neutral-100 dark:bg-neutral-800 rounded hover:text-white hover:bg-indigo-600 dark:hover:bg-amber-400 transition">Save Current File As</button>
        <button onClick={saveFile} className="w-full py-2 px-4 bg-neutral-300 text-neutral-900 dark:text-neutral-100 dark:bg-neutral-800 rounded hover:text-white hover:bg-indigo-600 dark:hover:bg-amber-400 transition">Save File</button>
      </div>
      <div className="space-y-2">
        <h3 className="font-semibold">Open Buffers:</h3>
        {buffers.map(buffer => (
          <div
            key={buffer.id}
            className={`p-2 flex justify-between items-center rounded cursor-pointer ${buffer.id === currentBufferId ? 'bg-indigo-400 dark:bg-amber-700' : 'hover:bg-gray-200 dark:hover:bg-gray-700'}`}
            onClick={() => setCurrentBufferId(buffer.id)}
          >
            <p>{buffer.fileName}</p>
            <button
              className="ml-2 text-red-500 hover:text-red-700"
              onClick={(e) => {
                e.stopPropagation();
                removeBuffer(buffer.id);
                if (currentBufferId === buffer.id) {
                  setCurrentBufferId(buffers[0]?.id || null);
                }
              }}
            >
              <X />
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};
