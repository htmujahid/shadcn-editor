import { REDO_COMMAND, UNDO_COMMAND } from "lexical";

import { HistoryExtension } from "@lexical/history";
import { useLexicalComposerContext } from "@lexical/react/LexicalComposerContext";
import { useExtensionDependency } from "@lexical/react/useExtensionComponent";
import { useSignalValue } from "@lexical/react/useExtensionSignalValue";
import { useLexicalEditable } from "@lexical/react/useLexicalEditable";

import { useTranslation } from "@/components/editor/plugins/i18n-plugin";
import { IconPlaceholder } from "@/components/icon-placeholder";
import { Button } from "@/components/ui/button";
import { ButtonGroup } from "@/components/ui/button-group";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";

export function HistoryToolbarPlugin() {
  const [editor] = useLexicalComposerContext();
  const { t } = useTranslation();
  const { canUndo, canRedo } = useExtensionDependency(HistoryExtension).output;
  const canUndoValue = useSignalValue(canUndo);
  const canRedoValue = useSignalValue(canRedo);
  const isEditable = useLexicalEditable();

  return (
    <ButtonGroup>
      <Tooltip>
        <TooltipTrigger
          render={
            <Button
              variant="outline"
              size="icon-sm"
              aria-label={t.undo}
              disabled={!isEditable || !canUndoValue}
              onClick={() => {
                editor.dispatchCommand(UNDO_COMMAND, undefined);
              }}
            >
              <IconPlaceholder
                lucide="Undo2"
                tabler="IconArrowBackUp"
                hugeicons="Undo02Icon"
                phosphor="ArrowArcLeftIcon"
                remixicon="RiArrowGoBackLine"
                className="rtl:-scale-x-100"
              />
            </Button>
          }
        />
        <TooltipContent>{t.undo}</TooltipContent>
      </Tooltip>
      <Tooltip>
        <TooltipTrigger
          render={
            <Button
              variant="outline"
              size="icon-sm"
              aria-label={t.redo}
              disabled={!isEditable || !canRedoValue}
              onClick={() => {
                editor.dispatchCommand(REDO_COMMAND, undefined);
              }}
            >
              <IconPlaceholder
                lucide="Redo2"
                tabler="IconArrowForwardUp"
                hugeicons="Redo02Icon"
                phosphor="ArrowArcRightIcon"
                remixicon="RiArrowGoForwardLine"
                className="rtl:-scale-x-100"
              />
            </Button>
          }
        />
        <TooltipContent>{t.redo}</TooltipContent>
      </Tooltip>
    </ButtonGroup>
  );
}
