import Markdown from 'react-markdown'
import rehypeHighlight from 'rehype-highlight'
import remarkGfm from "remark-gfm";
import rehypeRaw from "rehype-raw";

import { Navbar } from './components/Navbar';
import './main.css'

function App() {
  const markdown = `# hi
  ## h2 
  ### h3 
  #### h4 
  ##### h5 
  ###### h6

  horizontal line

  ---

  > block quote

  [this is a link](/)
  \`\`\`py
  var x = 10;
  if (i > 10) {
    i += 1;
    x.filed = qwe;
  }
  console.log("hi")
  \`\`\`

  _italics_ 
  **bold**

  \`Inline code\` with backticks

  <div align="center">

  ![image](/tauri.svg)

  </div>
  `
  return (
    <div className="min-h-screen flex justify-center px-8 md:px-0 py-8 md:py-16 w-screen bg-neutral-100 dark:bg-neutral-950 text-neutral-900 dark:text-neutral-100 transition">

      <Navbar />
      <div className="markdown-container text-lg lg:w-1/2 md:w-2/3 w-full xl:w-2/5">
        <Markdown remarkPlugins={[remarkGfm]} rehypePlugins={[rehypeRaw, rehypeHighlight]}>{markdown}</Markdown>
      </div>
    </div>
  );
}

export default App;
