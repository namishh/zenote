import { Sun, MoonStar, EyeIcon, Folder } from "lucide-react"
import { useState } from "react";
import { useEditorStore, useAppStore } from '../lib/store';

export const Navbar = ({ onToggleFileExplorer }: { onToggleFileExplorer: () => void }) => {
  const [dark, setDark] = useState(false);
  const { setMode, mode } = useEditorStore();
  const {explorerOpen, setExplorerOpen} = useAppStore();
  const darkModeHandler = () => {
    setDark(!dark);
    document.body.classList.toggle("dark");
  }
  return (
    <div className="fixed flex gap-4 justify-center transition items-center top-4 p-2 rounded-md right-4 bg-neutral-200 text-neutral-950 dark:text-white dark:bg-neutral-900">
      <button className={`${mode == "editing" ? 'dark:bg-neutral-800 bg-neutral-300/50' : 'dark:bg-neutral-700 bg-neutral-300'} p-2 rounded-md`} onClick={() => setMode(mode === 'editing' ? 'preview' : 'editing')}>
        <EyeIcon size={18} />
      </button>
      <button className={`${!explorerOpen ? 'dark:bg-neutral-800 bg-neutral-300/50' : 'dark:bg-neutral-700 bg-neutral-300'} p-2 rounded-md`} onClick={() => setExplorerOpen(!explorerOpen)}>
        <Folder size={18} />
      </button>
      <button className={`${dark ? 'bg-yellow-600 text-white' : 'bg-indigo-400 text-white'} p-2 transition rounded-md`} onClick={() => darkModeHandler()}>
        {dark ? <Sun size={20} /> : <MoonStar size={20} />}
      </button>
    </div>
  );
}
