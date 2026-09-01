import { useEffect, useState } from "react";

import { $getRoot } from "lexical";

import { CharacterLimitPlugin } from "@lexical/react/LexicalCharacterLimitPlugin";
import { useLexicalComposerContext } from "@lexical/react/LexicalComposerContext";

import { useTranslation } from "@/components/editor/plugins/i18n-plugin";
import { cn } from "@/lib/utils";

const graphemeSegmenter =
  typeof Intl.Segmenter === "undefined"
    ? null
    : new Intl.Segmenter(undefined, { granularity: "grapheme" });

const wordSegmenter =
  typeof Intl.Segmenter === "undefined"
    ? null
    : new Intl.Segmenter(undefined, { granularity: "word" });

function computeCounts(text: string): { words: number; characters: number } {
  let words = 0;
  if (wordSegmenter === null) {
    words = text.split(/\s+/).filter(Boolean).length;
  } else {
    for (const segment of wordSegmenter.segment(text)) {
      if (segment.isWordLike) {
        words++;
      }
    }
  }

  const flattened = text.replace(/\n/g, "");
  let characters = 0;
  if (graphemeSegmenter === null) {
    characters = [...flattened].length;
  } else {
    for (const _ of graphemeSegmenter.segment(flattened)) {
      characters++;
    }
  }

  return { words, characters };
}

export function CountPlugin({ maxLength }: { maxLength?: number }) {
  const [editor] = useLexicalComposerContext();
  const { language, t } = useTranslation();
  const [counts, setCounts] = useState(() =>
    editor
      .getEditorState()
      .read(() => computeCounts($getRoot().getTextContent())),
  );

  useEffect(() => {
    return editor.registerUpdateListener(
      ({ editorState, dirtyElements, dirtyLeaves }) => {
        if (dirtyElements.size === 0 && dirtyLeaves.size === 0) {
          return;
        }
        setCounts(
          editorState.read(() => computeCounts($getRoot().getTextContent())),
        );
      },
    );
  }, [editor]);

  const format = new Intl.NumberFormat(language);

  return (
    <>
      <span>
        {format.format(counts.words)} {t.words}
      </span>
      {maxLength === undefined ? (
        <span>
          {format.format(counts.characters)} {t.characters}
        </span>
      ) : (
        <CharacterLimitPlugin
          charset="UTF-16"
          maxLength={maxLength}
          renderer={({ remainingCharacters }) => (
            <span className={cn(remainingCharacters < 0 && "text-destructive")}>
              {format.format(maxLength - remainingCharacters)} /{" "}
              {format.format(maxLength)} {t.characters}
            </span>
          )}
        />
      )}
    </>
  );
}
