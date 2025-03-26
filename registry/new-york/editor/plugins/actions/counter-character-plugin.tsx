'use client'

import { useEffect, useState } from "react";
import { $rootTextContent } from '@lexical/text';
import { useLexicalComposerContext } from "@lexical/react/LexicalComposerContext";

let textEncoderInstance: null | TextEncoder = null;

function textEncoder(): null | TextEncoder {
  if (window.TextEncoder === undefined) {
    return null;
  }

  if (textEncoderInstance === null) {
    textEncoderInstance = new window.TextEncoder();
  }

  return textEncoderInstance;
}

function utf8Length(text: string) {
  const currentTextEncoder = textEncoder();

  if (currentTextEncoder === null) {
    // http://stackoverflow.com/a/5515960/210370
    const m = encodeURIComponent(text).match(/%[89ABab]/g);
    return text.length + (m ? m.length : 0);
  }

  return currentTextEncoder.encode(text).length;
}

interface CounterCharacterPluginProps {
  charset?: 'UTF-8' | 'UTF-16'
}

const strlen = (text: string, charset: 'UTF-8' | 'UTF-16') => {
  if (charset === 'UTF-8') {
    return utf8Length(text);
  } else if (charset === 'UTF-16') {
    return text.length;
  }
}

const countWords = (text: string) => {
  return text.split(/\s+/).filter(word => word.length > 0).length;
}

export function CounterCharacterPlugin({ charset = "UTF-16" }: CounterCharacterPluginProps) {
  const [editor] = useLexicalComposerContext();
  const [stats, setStats] = useState(() => {
    const initialText = editor.getEditorState().read($rootTextContent);
    return {
      characters: strlen(initialText, charset),
      words: countWords(initialText)
    };
  });

  useEffect(() => {
    return editor.registerTextContentListener((currentText: string) => {
      setStats({
        characters: strlen(currentText, charset),
        words: countWords(currentText)
      });
    });
  }, [editor, charset]);

  return (
    <div className="text-xs flex gap-2 text-gray-500 whitespace-nowrap">
      <p>{stats.characters} characters</p>
      |
      <p>{stats.words} words</p>
    </div>
  );
}