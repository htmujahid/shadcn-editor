import { useLexicalComposerContext } from "@lexical/react/LexicalComposerContext"
import { useExtensionSignalValue } from "@lexical/react/useExtensionSignalValue"

import { TextSearch } from "lucide-react"

import {
  FindReplaceExtension,
  TOGGLE_FIND_REPLACE_COMMAND,
} from "@/components/editor/extensions/find-replace"
import { useTranslation } from "@/components/editor/plugins/i18n-plugin"
import { Button } from "@/components/ui/button"
import { ButtonGroup } from "@/components/ui/button-group"
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip"

export function FindReplaceToolbarPlugin() {
  const [editor] = useLexicalComposerContext()
  const { t } = useTranslation()
  const isOpen = useExtensionSignalValue(FindReplaceExtension, "isOpen")

  return (
    <ButtonGroup>
      <Tooltip>
        <TooltipTrigger
          render={
            <Button
              variant="outline"
              size="icon-sm"
              aria-label={t.findAndReplace}
              aria-haspopup="dialog"
              aria-expanded={isOpen}
              onClick={() => {
                editor.dispatchCommand(TOGGLE_FIND_REPLACE_COMMAND, undefined)
              }}
            >
              <TextSearch />
            </Button>
          }
        />
        <TooltipContent>{t.findAndReplace}</TooltipContent>
      </Tooltip>
    </ButtonGroup>
  )
}
