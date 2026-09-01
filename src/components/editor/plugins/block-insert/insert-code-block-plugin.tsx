import { useLexicalComposerContext } from "@lexical/react/LexicalComposerContext"
import { useLexicalEditable } from "@lexical/react/useLexicalEditable"

import { CodeXml } from "lucide-react"

import { insertCodeBlock } from "@/components/editor/extensions/code"
import { useTranslation } from "@/components/editor/plugins/i18n-plugin"
import { Button } from "@/components/ui/button"
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip"

export function InsertCodeBlockPlugin() {
  const [editor] = useLexicalComposerContext()
  const { t } = useTranslation()
  const isEditable = useLexicalEditable()

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
            <CodeXml />
          </Button>
        }
      />
      <TooltipContent>{t.insertCodeBlock}</TooltipContent>
    </Tooltip>
  )
}
