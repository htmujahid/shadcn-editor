import { useLexicalComposerContext } from "@lexical/react/LexicalComposerContext";
import { useLexicalEditable } from "@lexical/react/useLexicalEditable";

import { insertCodeBlock } from "@/components/editor/extensions/code";
import { useTranslation } from "@/components/editor/plugins/i18n-plugin";
import { IconPlaceholder } from "@/components/icon-placeholder";
import { Button } from "@/components/ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";

export function InsertCodeBlockPlugin() {
  const [editor] = useLexicalComposerContext();
  const { t } = useTranslation();
  const isEditable = useLexicalEditable();

  return (
    <Tooltip>
      <TooltipTrigger
        render={
          <Button
            variant="outline"
            size="icon-sm"
            aria-label={t.insertCodeBlock}
            disabled={!isEditable}
            onClick={() => insertCodeBlock(editor)}
          >
            <IconPlaceholder
              lucide="CodeXml"
              tabler="IconCodeDots"
              hugeicons="CodeSquareIcon"
              phosphor="CodeBlockIcon"
              remixicon="RiCodeSSlashLine"
            />
          </Button>
        }
      />
      <TooltipContent>{t.insertCodeBlock}</TooltipContent>
    </Tooltip>
  );
}
