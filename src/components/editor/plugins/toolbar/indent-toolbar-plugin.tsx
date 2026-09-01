import { INDENT_CONTENT_COMMAND, OUTDENT_CONTENT_COMMAND } from "lexical";

import { useLexicalComposerContext } from "@lexical/react/LexicalComposerContext";
import { useLexicalEditable } from "@lexical/react/useLexicalEditable";

import { IndentDecrease, IndentIncrease } from "lucide-react";

import { useFormatStateValue } from "@/components/editor/extensions/format-state";
import { useTranslation } from "@/components/editor/plugins/i18n-plugin";
import { Button } from "@/components/ui/button";
import { ButtonGroup } from "@/components/ui/button-group";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";

export function IndentToolbarPlugin() {
  const [editor] = useLexicalComposerContext();
  const { t } = useTranslation();
  const indent = useFormatStateValue("indent");
  const isEditable = useLexicalEditable();

  return (
    <ButtonGroup>
      <Tooltip>
        <TooltipTrigger
          render={
            <Button
              variant="outline"
              size="icon-sm"
              aria-label={t.outdent}
              disabled={!isEditable || indent === 0}
              onClick={() => {
                editor.dispatchCommand(OUTDENT_CONTENT_COMMAND, undefined);
              }}
            >
              <IndentDecrease className="rtl:-scale-x-100" />
            </Button>
          }
        />
        <TooltipContent>{t.outdent}</TooltipContent>
      </Tooltip>
      <Tooltip>
        <TooltipTrigger
          render={
            <Button
              variant="outline"
              size="icon-sm"
              aria-label={t.indent}
              disabled={!isEditable}
              onClick={() => {
                editor.dispatchCommand(INDENT_CONTENT_COMMAND, undefined);
              }}
            >
              <IndentIncrease className="rtl:-scale-x-100" />
            </Button>
          }
        />
        <TooltipContent>{t.indent}</TooltipContent>
      </Tooltip>
    </ButtonGroup>
  );
}
