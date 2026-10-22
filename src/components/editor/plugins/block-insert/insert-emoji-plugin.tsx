import {
  $getRoot,
  $getSelection,
  $isRangeSelection,
  type LexicalEditor,
} from "lexical";

import { useLexicalComposerContext } from "@lexical/react/LexicalComposerContext";
import { useLexicalEditable } from "@lexical/react/useLexicalEditable";

import { useTranslation } from "@/components/editor/plugins/i18n-plugin";
import { IconPlaceholder } from "@/components/icon-placeholder";
import { Button } from "@/components/ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";

function insertEmojiTrigger(editor: LexicalEditor) {
  editor.update(() => {
    const selection = $getSelection() ?? $getRoot().selectEnd();
    if ($isRangeSelection(selection)) {
      selection.insertText(":");
    }
  });
  editor.focus();
}

export function InsertEmojiPlugin() {
  const [editor] = useLexicalComposerContext();
  const isEditable = useLexicalEditable();
  const { t } = useTranslation();

  return (
    <Tooltip>
      <TooltipTrigger
        render={
          <Button
            variant="outline"
            size="icon-sm"
            aria-label={t.insertEmoji}
            disabled={!isEditable}
            onClick={() => insertEmojiTrigger(editor)}
          >
            <IconPlaceholder
              lucide="Smile"
              tabler="IconMoodSmile"
              hugeicons="SmileIcon"
              phosphor="SmileyIcon"
              remixicon="RiEmotionLine"
            />
          </Button>
        }
      />
      <TooltipContent>{t.insertEmoji}</TooltipContent>
    </Tooltip>
  );
}
