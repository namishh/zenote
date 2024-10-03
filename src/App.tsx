import { Navbar } from './components/Navbar';
import { Editor } from './components/Editor';
import { WelcomeScreen } from './components/Welcome';
import { useEditorStore, useAppStore } from './lib/store';
import { useEffect } from 'react';
import { FileExplorer } from './components/FileExplorer';
import './main.css'
function App() {
  const currentBufferId = useEditorStore(state => state.currentBufferId);
  const buffers = useAppStore(state => state.buffers);
  const isFileExplorerOpen = useAppStore(state => state.explorerOpen)
  useEffect(() => {
    if (buffers.length === 0) {
      useEditorStore.getState().setCurrentBufferId(null);
    }
  }, [buffers]);

  return (
    <div className="min-h-screen flex flex-col  px-8 md:px-0 py-8 md:py-16 w-screen bg-neutral-100 dark:bg-neutral-950 text-neutral-900 dark:text-neutral-100 transition">
      <div
        className="absolute inset-0 h-full w-full bg-neutral-100 dark:bg-neutral-950 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px]"
      ></div>
      <Navbar />
      <FileExplorer isOpen={isFileExplorerOpen} />
      <div className="markdown-container z-[10] h-full overflow-y-auto text-lg lg:w-1/2 md:w-2/3 w-full xl:w-2/5 mx-auto">
        {currentBufferId && buffers.length > 0 ? <Editor /> : <WelcomeScreen />}
      </div>
    </div>
  );
}

export default App;
