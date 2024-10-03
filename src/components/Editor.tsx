import React, { useEffect, useRef } from 'react';
import Markdown from 'react-markdown';
import rehypeHighlight from 'rehype-highlight';
import remarkGfm from 'remark-gfm';
import rehypeRaw from 'rehype-raw';
import { useEditorStore } from '../lib/store';
import { useAppStore } from '../lib/store';
import TextareaAutosize from 'react-textarea-autosize';

export const Editor = () => {
  const { mode, currentBufferId } = useEditorStore();
  const { buffers, updateBuffer } = useAppStore();
  const currentBuffer = buffers.find(buf => buf.id === currentBufferId);
  const textareaRef = useRef<HTMLTextAreaElement | null>(null);
  useEffect(() => {
    if (mode === 'editing' && textareaRef.current) {
      textareaRef.current.focus();  // Focus the textarea
      textareaRef.current.selectionStart = textareaRef.current.selectionEnd = textareaRef.current.value.length;
    }
  }, [mode]);
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
    <TextareaAutosize
      autoFocus
      ref={textareaRef}  // Attach the ref to TextareaAutosize
      className="w-full bg-transparent p-2 focus:outline-none rounded-md resize-none"
      value={currentBuffer.text}
      onChange={handleTextChange}
    />
  );
};
