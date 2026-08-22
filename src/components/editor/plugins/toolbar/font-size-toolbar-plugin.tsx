import { useCallback, useState } from "react";

import {
  $getSelectionStyleValueForProperty,
  $patchStyleText,
} from "@lexical/selection";
import { $getSelection, $isRangeSelection, type BaseSelection } from "lexical";

import { Minus, Plus } from "lucide-react";

import { useToolbarContext } from "@/components/editor/context/toolbar-context";
import { useUpdateToolbarHandler } from "@/components/editor/editor-hooks/use-update-toolbar";
import {
  InputGroup,
  InputGroupAddon,
  InputGroupButton,
  InputGroupInput,
} from "@/components/ui/input-group";

const DEFAULT_FONT_SIZE = 16;
const MIN_FONT_SIZE = 1;
const MAX_FONT_SIZE = 72;

export function FontSizeToolbarPlugin() {
  const style = "font-size";
  const [fontSize, setFontSize] = useState(DEFAULT_FONT_SIZE);

  const { activeEditor } = useToolbarContext();

  const $updateToolbar = (selection: BaseSelection) => {
    if ($isRangeSelection(selection)) {
      const value = $getSelectionStyleValueForProperty(
        selection,
        "font-size",
        `${DEFAULT_FONT_SIZE}px`,
      );
      setFontSize(parseInt(value) || DEFAULT_FONT_SIZE);
    }
  };

  useUpdateToolbarHandler($updateToolbar);

  const updateFontSize = useCallback(
    (newSize: number) => {
      const size = Math.min(Math.max(newSize, MIN_FONT_SIZE), MAX_FONT_SIZE);
      activeEditor.update(() => {
        const selection = $getSelection();
        if (selection !== null) {
          $patchStyleText(selection, {
            [style]: `${size}px`,
          });
        }
      });
      setFontSize(size);
    },
    [activeEditor, style],
  );

  return (
    <InputGroup className="h-8 w-fit border-none shadow-none dark:bg-transparent">
      <InputGroupAddon align="inline-start" className="pl-1">
        <InputGroupButton
          variant="ghost"
          size="icon-xs"
          aria-label="Decrease font size"
          onClick={() => updateFontSize(fontSize - 1)}
          disabled={fontSize <= MIN_FONT_SIZE}
        >
          <Minus className="size-3" />
        </InputGroupButton>
      </InputGroupAddon>
      <InputGroupInput
        value={fontSize}
        onChange={(e) =>
          updateFontSize(parseInt(e.target.value) || DEFAULT_FONT_SIZE)
        }
        className="w-10 px-0 text-center"
        min={MIN_FONT_SIZE}
        max={MAX_FONT_SIZE}
      />
      <InputGroupAddon align="inline-end" className="pr-1">
        <InputGroupButton
          variant="ghost"
          size="icon-xs"
          aria-label="Increase font size"
          onClick={() => updateFontSize(fontSize + 1)}
          disabled={fontSize >= MAX_FONT_SIZE}
        >
          <Plus className="size-3" />
        </InputGroupButton>
      </InputGroupAddon>
    </InputGroup>
  );
}
