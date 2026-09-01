import { useState } from "react"

import { $getRoot, $getSelection } from "lexical"

import { useLexicalComposerContext } from "@lexical/react/LexicalComposerContext"
import { useLexicalEditable } from "@lexical/react/useLexicalEditable"

import { Frame } from "lucide-react"

import { INSERT_FIGMA_COMMAND } from "@/components/editor/extensions/figma"
import { useTranslation } from "@/components/editor/plugins/i18n-plugin"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip"

export function parseFigmaDocumentID(url: string): string | null {
  const trimmed = url.trim()
  if (/^[0-9a-zA-Z]{22,128}$/.test(trimmed)) {
    return trimmed
  }
  const match =
    /^https:\/\/([\w.-]+\.)?figma\.com\/(file|proto|design|board)\/([0-9a-zA-Z]{22,128})(?:\/.*)?$/.exec(
      trimmed
    )
  return match?.[3] ?? null
}

export function InsertFigmaPlugin() {
  const [editor] = useLexicalComposerContext()
  const isEditable = useLexicalEditable()
  const { t, dir } = useTranslation()
  const [open, setOpen] = useState(false)
  const [url, setUrl] = useState("")
  const documentID = parseFigmaDocumentID(url)

  const onOpenChange = (nextOpen: boolean) => {
    setOpen(nextOpen)
    if (!nextOpen) {
      setUrl("")
    }
  }

  const onSubmit = () => {
    if (!documentID) {
      return
    }
    editor.update(() => {
      if (!$getSelection()) {
        $getRoot().selectEnd()
      }
    })
    editor.dispatchCommand(INSERT_FIGMA_COMMAND, documentID)
    onOpenChange(false)
  }

  return (
    <Popover open={open} onOpenChange={onOpenChange}>
      <Tooltip>
        <TooltipTrigger
          render={
            <PopoverTrigger
              render={
                <Button
                  variant="outline"
                  size="icon-sm"
                  aria-label={t.insertFigma}
                  disabled={!isEditable}
                >
                  <Frame />
                </Button>
              }
            />
          }
        />
        <TooltipContent>{t.insertFigma}</TooltipContent>
      </Tooltip>
      <PopoverContent dir={dir} align="start" className="w-72">
        <div className="flex flex-col gap-2">
          <Input
            dir="ltr"
            placeholder={t.figmaUrlPlaceholder}
            value={url}
            onChange={(event) => setUrl(event.target.value)}
            onKeyDown={(event) => {
              if (event.key === "Enter") {
                event.preventDefault()
                onSubmit()
              }
            }}
          />
          <Button size="sm" disabled={!documentID} onClick={onSubmit}>
            {t.embedFigma}
          </Button>
        </div>
      </PopoverContent>
    </Popover>
  )
}
