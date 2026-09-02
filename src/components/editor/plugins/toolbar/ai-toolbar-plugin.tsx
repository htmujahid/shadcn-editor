import { useLexicalComposerContext } from "@lexical/react/LexicalComposerContext";
import { useLexicalEditable } from "@lexical/react/useLexicalEditable";

import { Sparkles } from "lucide-react";

import { OPEN_AI_EDITOR_COMMAND } from "@/components/editor/extensions/ai";
import { useTranslation } from "@/components/editor/plugins/i18n-plugin";
import { Button } from "@/components/ui/button";
import { ButtonGroup } from "@/components/ui/button-group";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";

export function AiToolbarPlugin() {
  const [editor] = useLexicalComposerContext();
  const isEditable = useLexicalEditable();
  const { t } = useTranslation();

  return (
    <ButtonGroup>
      <Tooltip>
        <TooltipTrigger
          render={
            <Button
              variant="outline"
              size="icon-sm"
              aria-label={t.askAi}
              disabled={!isEditable}
              onClick={() => {
                editor.dispatchCommand(OPEN_AI_EDITOR_COMMAND, undefined);
              }}
            >
              <Sparkles />
            </Button>
          }
        />
        <TooltipContent>{t.askAi}</TooltipContent>
      </Tooltip>
    </ButtonGroup>
  );
}
