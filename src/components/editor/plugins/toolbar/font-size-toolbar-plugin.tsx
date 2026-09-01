import { useEffect, useState } from "react";

import { $getRoot, $getSelection } from "lexical";

import { useLexicalComposerContext } from "@lexical/react/LexicalComposerContext";
import { useLexicalEditable } from "@lexical/react/useLexicalEditable";
import { $patchStyleText } from "@lexical/selection";

import { Minus, Plus } from "lucide-react";

import { useFormatStateValue } from "@/components/editor/extensions/format-state";
import { useTranslation } from "@/components/editor/plugins/i18n-plugin";
import { Button } from "@/components/ui/button";
import { ButtonGroup } from "@/components/ui/button-group";
import { Input } from "@/components/ui/input";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";

const MIN_FONT_SIZE = 8;
const MAX_FONT_SIZE = 72;
const DEFAULT_FONT_SIZE = 16;

export function FontSizeToolbarPlugin() {
  const [editor] = useLexicalComposerContext();
  const { t } = useTranslation();
  const fontSize = useFormatStateValue("fontSize");
  const isEditable = useLexicalEditable();
  const currentSize = Number.parseInt(fontSize, 10) || DEFAULT_FONT_SIZE;
  const [inputValue, setInputValue] = useState(String(currentSize));

  useEffect(() => {
    setInputValue(String(currentSize));
  }, [currentSize]);

  const updateFontSize = (size: number) => {
    const next = Math.min(MAX_FONT_SIZE, Math.max(MIN_FONT_SIZE, size));
    editor.update(() => {
      const selection = $getSelection() ?? $getRoot().selectEnd();
      $patchStyleText(selection, { "font-size": `${next}px` });
    });
  };

  const commitInput = () => {
    const parsed = Number.parseInt(inputValue, 10);
    if (Number.isNaN(parsed)) {
      setInputValue(String(currentSize));
    } else {
      updateFontSize(parsed);
    }
  };

  return (
    <ButtonGroup>
      <Tooltip>
        <TooltipTrigger
          render={
            <Button
              variant="outline"
              size="icon-sm"
              aria-label={t.decreaseFontSize}
              disabled={!isEditable || currentSize <= MIN_FONT_SIZE}
              onClick={() => {
                updateFontSize(currentSize - 2);
              }}
            >
              <Minus />
            </Button>
          }
        />
        <TooltipContent>{t.decreaseFontSize}</TooltipContent>
      </Tooltip>
      <Input
        inputMode="numeric"
        aria-label={t.fontSizeTitle}
        disabled={!isEditable}
        value={inputValue}
        className="h-7 w-11 px-1 text-center md:text-[0.8rem]"
        onChange={(event) => {
          setInputValue(event.target.value);
        }}
        onBlur={commitInput}
        onKeyDown={(event) => {
          if (event.key === "Enter") {
            event.preventDefault();
            commitInput();
          } else if (event.key === "Escape") {
            setInputValue(String(currentSize));
          }
        }}
      />
      <Tooltip>
        <TooltipTrigger
          render={
            <Button
              variant="outline"
              size="icon-sm"
              aria-label={t.increaseFontSize}
              disabled={!isEditable || currentSize >= MAX_FONT_SIZE}
              onClick={() => {
                updateFontSize(currentSize + 2);
              }}
            >
              <Plus />
            </Button>
          }
        />
        <TooltipContent>{t.increaseFontSize}</TooltipContent>
      </Tooltip>
    </ButtonGroup>
  );
}
