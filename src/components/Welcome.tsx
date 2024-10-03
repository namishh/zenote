import { useAppStore, useEditorStore } from '../lib/store';
import { v4 as uuidv4 } from 'uuid';

export const WelcomeScreen = () => {
  const { addBuffer } = useAppStore();
  const { setCurrentBufferId } = useEditorStore();

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
    <div className="flex flex-col items-center justify-center h-full">
      <h1 className="text-3xl mb-4">Welcome to Markdown Editor</h1>
      <button
        className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
        onClick={handleNewFile}
      >
        New file
      </button>
    </div>
  );
};
