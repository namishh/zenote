import React, { useEffect, useState } from 'react';
import Markdown from 'react-markdown';
import rehypeHighlight from 'rehype-highlight';
import remarkGfm from "remark-gfm";
import rehypeRaw from "rehype-raw";
import { useEditorStore } from '../lib/store';
import { useAppStore } from '../lib/store';
import TextareaAutosize from 'react-textarea-autosize';

export const Editor = () => {
  const { mode, currentBufferId } = useEditorStore();
  const { buffers, updateBuffer } = useAppStore();
  const currentBuffer = buffers.find(buf => buf.id === currentBufferId);

  const [text, setText] = useState(currentBuffer?.text); // Local state for text
  const [typingTimeout, setTypingTimeout] = useState<NodeJS.Timeout | null>(null);

  useEffect(() => {
    if (currentBuffer) {
      setText(currentBuffer.text); // Update local text state when currentBuffer changes
    }
  }, [currentBuffer]);

  const handleTextChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const newText = e.target.value;
    setText(newText);

    // Clear the previous timeout if it exists
    if (typingTimeout) {
      clearTimeout(typingTimeout);
    }

    // Set a new timeout
    setTypingTimeout(setTimeout(() => {
      updateBuffer(currentBuffer?.id || "", { text: newText }); // Update the buffer after a delay
    }, 300)); // Adjust the delay as necessary (300ms in this example)
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Tab') {
      e.preventDefault();
      const textarea = e.target as HTMLTextAreaElement;
      const start = textarea.selectionStart;
      const end = textarea.selectionEnd;

      setText(
        text?.substring(0, start) + "\t" + text?.substring(end)
      );

      setTimeout(() => {
        textarea.selectionStart = textarea.selectionEnd = start + 1;
      }, 0);
    }
  };

  return mode === 'preview' ? (
    <Markdown remarkPlugins={[remarkGfm]} rehypePlugins={[rehypeRaw, rehypeHighlight]}>
      {currentBuffer?.text}
    </Markdown>
  ) : (
    <TextareaAutosize
      autoFocus
      onKeyDown={handleKeyDown}
      className="w-full p-2 focus:outline-none bg-transparent resize-none"
      value={text} // Use the local text state
      onChange={handleTextChange}
    />
  );
};
