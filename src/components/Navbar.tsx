import { Sun, MoonStar, EyeIcon, Folder } from "lucide-react"

import { useState } from "react";
export const Navbar = () => {
  const [dark, setDark] = useState(false);

  const darkModeHandler = () => {
    setDark(!dark);
    document.body.classList.toggle("dark");
  }
  return <div className="fixed flex gap-4 justify-center transition items-center top-4 p-2 rounded-md right-4 bg-neutral-200 text-neutral-950 dark:text-white dark:bg-neutral-900">
    <button className="dark:bg-neutral-800 bg-neutral-300 p-2 rounded-md">

      <EyeIcon size={18} />
    </button>
    <button className="dark:bg-neutral-800 bg-neutral-300 p-2 rounded-md">

      <Folder size={18} />
    </button>
    <button className={`${dark ? 'bg-yellow-600 text-white' : 'bg-indigo-400 text-white'} p-2 transition rounded-md`} onClick={() => darkModeHandler()}>
      {
        dark ? <Sun size={20} /> : <MoonStar size={20} />
      }
    </button>
  </div>
}
