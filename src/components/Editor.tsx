import Markdown from 'react-markdown'
import rehypeHighlight from 'rehype-highlight'
import remarkGfm from "remark-gfm";
import rehypeRaw from "rehype-raw"
import { useEditorStore } from '../lib/store';
import { useAppStore } from '../lib/store';

export const Editor = () => {
  const { mode, currentBufferId } = useEditorStore();
  const { buffers, updateBuffer } = useAppStore();
  const currentBuffer = buffers.find(buf => buf.id === currentBufferId);

  if (!currentBuffer) {
    return <div>No buffer selected</div>;
  }

  const handleTextChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    updateBuffer(currentBuffer.id, { text: e.target.value });
  };

  return mode === 'preview' ? (
    <Markdown remarkPlugins={[remarkGfm]} rehypePlugins={[rehypeRaw, rehypeHighlight]}>
      {currentBuffer.text}
    </Markdown>
  ) : (
    <textarea
      className="w-full h-full dark:bg-neutral-950 transition bg-neutral-100 border-neutral-400 p-2 focus:outline-none dark:border-neutral-600 border-[1px] rounded-md resize-none"
      value={currentBuffer.text}
      onChange={handleTextChange}
    />
  );
}
