import { TOGGLE_LINK_COMMAND } from "@lexical/link";
import { useLexicalComposerContext } from "@lexical/react/LexicalComposerContext";
import { useLexicalEditable } from "@lexical/react/useLexicalEditable";

import { Link as LinkIcon } from "lucide-react";

import { useFormatStateValue } from "@/components/editor/extensions/format-state";
import { OPEN_LINK_EDITOR_COMMAND } from "@/components/editor/extensions/link";
import { useTranslation } from "@/components/editor/plugins/i18n-plugin";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";

export function LinkToolbarPlugin() {
  const [editor] = useLexicalComposerContext();
  const isEditable = useLexicalEditable();
  const { t } = useTranslation();
  const isLink = useFormatStateValue("isLink");

  return (
    <ToggleGroup
      multiple
      variant="outline"
      size="sm"
      spacing={0}
      disabled={!isEditable}
      value={isLink ? ["link"] : []}
      onValueChange={() => {
        if (isLink) {
          editor.dispatchCommand(TOGGLE_LINK_COMMAND, null);
        } else {
          editor.dispatchCommand(OPEN_LINK_EDITOR_COMMAND, undefined);
        }
      }}
    >
      <Tooltip>
        <TooltipTrigger
          render={
            <ToggleGroupItem value="link" aria-label={t.insertLink}>
              <LinkIcon />
            </ToggleGroupItem>
          }
        />
        <TooltipContent>{t.insertLink}</TooltipContent>
      </Tooltip>
    </ToggleGroup>
  );
}
