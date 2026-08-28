import { useEffect, useState } from "react";

import { CharacterLimitPlugin } from "@lexical/react/LexicalCharacterLimitPlugin";
import { useLexicalComposerContext } from "@lexical/react/LexicalComposerContext";
import { $rootTextContent } from "@lexical/text";

import { cn } from "@/lib/utils";

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
  charset?: "UTF-8" | "UTF-16";
  maxLength?: number;
}

const strlen = (text: string, charset: "UTF-8" | "UTF-16") => {
  if (charset === "UTF-8") {
    return utf8Length(text);
  } else if (charset === "UTF-16") {
    return text.length;
  }
};

const countWords = (text: string) => {
  return text.split(/\s+/).filter((word) => word.length > 0).length;
};

export function CounterCharacterPlugin({
  charset = "UTF-16",
  maxLength,
}: CounterCharacterPluginProps) {
  const [editor] = useLexicalComposerContext();
  const [stats, setStats] = useState(() => {
    const initialText = editor.getEditorState().read($rootTextContent);
    return {
      characters: strlen(initialText, charset),
      words: countWords(initialText),
    };
  });

  useEffect(() => {
    return editor.registerTextContentListener((currentText: string) => {
      setStats({
        characters: strlen(currentText, charset),
        words: countWords(currentText),
      });
    });
  }, [editor, charset]);

  if (maxLength !== undefined) {
    return (
      <CharacterLimitPlugin
        charset={charset}
        maxLength={maxLength}
        renderer={({ remainingCharacters }) => (
          <div className="flex gap-2 text-xs whitespace-nowrap text-gray-500">
            <p>
              <span
                className={cn(remainingCharacters < 0 && "text-destructive")}
              >
                {stats.characters}
              </span>
              {` / ${maxLength} characters`}
            </p>
            |<p>{stats.words} words</p>
          </div>
        )}
      />
    );
  }

  return (
    <div className="flex gap-2 text-xs whitespace-nowrap text-gray-500">
      <p>{stats.characters} characters</p>|<p>{stats.words} words</p>
    </div>
  );
}
