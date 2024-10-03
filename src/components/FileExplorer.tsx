import React from 'react';
import { useAppStore, useEditorStore } from '../lib/store';
import { open, save } from '@tauri-apps/api/dialog';
import { readTextFile, writeFile } from '@tauri-apps/api/fs';
import { v4 as uuidv4 } from 'uuid';

export const FileExplorer: React.FC<{ isOpen: boolean }> = ({ isOpen }) => {
  const { buffers, addBuffer, updateBuffer, removeBuffer } = useAppStore();
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

  const handleSaveFile = async () => {
    const currentBuffer = buffers.find(buf => buf.id === currentBufferId);
    if (!currentBuffer) return;

    if (!currentBuffer.path) {
      const savePath = await save({
        filters: [{ name: 'Markdown', extensions: ['md'] }]
      });
      if (savePath) {
        await writeFile({ path: savePath, contents: currentBuffer.text });
        updateBuffer(currentBuffer.id, { path: savePath, fileName: savePath.split('/').pop() || 'Untitled' });
      }
    } else {
      await writeFile({ path: currentBuffer.path, contents: currentBuffer.text });
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
    <div className={`fixed left-0 top-0 h-full w-64 bg-neutral-100 dark:bg-neutral-800 p-4 transform transition-transform duration-300 ease-in-out ${isOpen ? 'translate-x-0' : '-translate-x-full'}`}>
      <h2 className="text-xl font-bold mb-4">File Explorer</h2>
      <div className="space-y-2 mb-4">
        <button onClick={handleNewFile} className="w-full py-2 px-4 bg-blue-500 text-white rounded hover:bg-blue-600">New File</button>
        <button onClick={handleOpenFile} className="w-full py-2 px-4 bg-green-500 text-white rounded hover:bg-green-600">Open File</button>
        <button onClick={handleSaveFile} className="w-full py-2 px-4 bg-yellow-500 text-white rounded hover:bg-yellow-600">Save File</button>
      </div>
      <div className="space-y-2">
        <h3 className="font-semibold">Open Buffers:</h3>
        {buffers.map(buffer => (
          <div
            key={buffer.id}
            className={`p-2 rounded cursor-pointer ${buffer.id === currentBufferId ? 'bg-blue-200 dark:bg-blue-700' : 'hover:bg-gray-200 dark:hover:bg-gray-700'}`}
            onClick={() => setCurrentBufferId(buffer.id)}
          >
            {buffer.fileName}
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
              ×
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};
