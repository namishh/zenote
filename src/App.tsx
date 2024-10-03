import { Navbar } from './components/Navbar';
import { Editor } from './components/Editor';
import { WelcomeScreen } from './components/Welcome';
import { useEditorStore, useAppStore } from './lib/store';
import { useEffect, useState } from 'react';
import { FileExplorer } from './components/FileExplorer';
import './main.css'
function App() {
  const currentBufferId = useEditorStore(state => state.currentBufferId);
  const buffers = useAppStore(state => state.buffers);
  const isFileExplorerOpen = useAppStore(state => state.explorerOpen)
  const currentBuffer = buffers.find(buf => buf.id === currentBufferId);
  const [text, setText] = useState(currentBuffer?.path); // Local state for text
  useEffect(() => {
    if (buffers.length === 0) {
      useEditorStore.getState().setCurrentBufferId(null);
    }
  }, [buffers]);

  useEffect(() => {
    if (currentBuffer) {
      setText(currentBuffer.path); // Update local text state when currentBuffer changes
    }
  }, [currentBuffer]);

  return (
    <div className="min-h-screen flex flex-col  px-8 md:px-0 py-8 md:py-16 w-screen bg-neutral-100 dark:bg-neutral-950 text-neutral-900 dark:text-neutral-100 transition">
      <Navbar />
      <div className="fixed bottom-4 font-mono left-4 p-2 text-sm z-[10]">
        {text || "Unsaved File"}

      </div>
      <FileExplorer isOpen={isFileExplorerOpen} />
      <div className="markdown-container z-[10] h-full overflow-y-auto text-lg lg:w-1/2 md:w-2/3 w-full xl:w-2/5 mx-auto">
        {currentBufferId && buffers.length > 0 ? <Editor /> : <WelcomeScreen />}
      </div>
    </div>
  );
}

export default App;
