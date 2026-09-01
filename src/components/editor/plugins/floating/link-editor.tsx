import { type Dispatch, useCallback, useEffect, useRef, useState } from "react"

import {
  $getSelection,
  $isRangeSelection,
  type BaseSelection,
  COMMAND_PRIORITY_LOW,
  type LexicalEditor,
  SELECTION_CHANGE_COMMAND,
} from "lexical"

import {
  $createLinkNode,
  $isAutoLinkNode,
  TOGGLE_LINK_COMMAND,
} from "@lexical/link"
import { mergeRegister } from "@lexical/utils"

import { Check, Pencil, Trash2, X } from "lucide-react"

import {
  $getSelectedLinkNode,
  $getSelectedNode,
} from "@/components/editor/extensions/format-state"
import { sanitizeUrl } from "@/components/editor/extensions/link"
import { useTranslation } from "@/components/editor/plugins/i18n-plugin"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip"

function preventDefault(
  event: React.KeyboardEvent<HTMLInputElement> | React.MouseEvent<HTMLElement>
): void {
  event.preventDefault()
}

export function LinkEditor({
  editor,
  isLinkEditMode,
  setIsLinkEditMode,
  onDismiss,
}: {
  editor: LexicalEditor
  isLinkEditMode: boolean
  setIsLinkEditMode: Dispatch<boolean>
  onDismiss: () => void
}) {
  const inputRef = useRef<HTMLInputElement | null>(null)
  const { t } = useTranslation()
  const [linkUrl, setLinkUrl] = useState("")
  const [editedLinkUrl, setEditedLinkUrl] = useState("https://")
  const [lastSelection, setLastSelection] = useState<BaseSelection | null>(null)

  const $updateLinkState = useCallback(() => {
    const selection = $getSelection()
    if ($isRangeSelection(selection)) {
      const linkNode = $getSelectedLinkNode(selection)
      setLinkUrl(linkNode ? linkNode.getURL() : "")
      setLastSelection(selection)
    } else {
      setLastSelection(null)
    }
  }, [])

  useEffect(() => {
    editor.read("latest", () => {
      $updateLinkState()
    })
    return mergeRegister(
      editor.registerUpdateListener(({ editorState }) => {
        editorState.read(() => {
          $updateLinkState()
        })
      }),
      editor.registerCommand(
        SELECTION_CHANGE_COMMAND,
        () => {
          $updateLinkState()
          return false
        },
        COMMAND_PRIORITY_LOW
      )
    )
  }, [editor, $updateLinkState])

  const focusInput = useCallback((elem: HTMLInputElement | null) => {
    inputRef.current = elem
    if (elem) {
      elem.focus()
    }
  }, [])

  const handleLinkSubmission = (
    event: React.KeyboardEvent<HTMLInputElement> | React.MouseEvent<HTMLElement>
  ) => {
    event.preventDefault()
    if (lastSelection !== null) {
      if (linkUrl !== "") {
        editor.update(() => {
          editor.dispatchCommand(
            TOGGLE_LINK_COMMAND,
            sanitizeUrl(editedLinkUrl)
          )
          const selection = $getSelection()
          if ($isRangeSelection(selection)) {
            const parent = $getSelectedNode(selection).getParent()
            if ($isAutoLinkNode(parent)) {
              const linkNode = $createLinkNode(parent.getURL(), {
                rel: parent.__rel,
                target: parent.__target,
                title: parent.__title,
              })
              parent.replace(linkNode, true)
            }
          }
        })
      }
      setEditedLinkUrl("https://")
      setIsLinkEditMode(false)
    }
  }

  const monitorInputInteraction = (
    event: React.KeyboardEvent<HTMLInputElement>
  ) => {
    if (event.key === "Enter") {
      handleLinkSubmission(event)
    } else if (event.key === "Escape") {
      event.preventDefault()
      setIsLinkEditMode(false)
    }
  }

  return (
    <div
      className="flex items-center gap-1"
      onBlur={(event) => {
        if (!event.currentTarget.contains(event.relatedTarget as Node)) {
          setIsLinkEditMode(false)
          onDismiss()
        }
      }}
    >
      {isLinkEditMode ? (
        <>
          <Input
            ref={focusInput}
            value={editedLinkUrl}
            placeholder={t.linkUrlPlaceholder}
            className="h-7 w-56 md:text-[0.8rem]"
            onChange={(event) => {
              setEditedLinkUrl(event.target.value)
            }}
            onKeyDown={monitorInputInteraction}
          />
          <Tooltip>
            <TooltipTrigger
              render={
                <Button
                  variant="ghost"
                  size="icon-sm"
                  aria-label={t.cancel}
                  onMouseDown={preventDefault}
                  onClick={() => {
                    setIsLinkEditMode(false)
                  }}
                >
                  <X />
                </Button>
              }
            />
            <TooltipContent>{t.cancel}</TooltipContent>
          </Tooltip>
          <Tooltip>
            <TooltipTrigger
              render={
                <Button
                  variant="ghost"
                  size="icon-sm"
                  aria-label={t.saveLink}
                  onMouseDown={preventDefault}
                  onClick={handleLinkSubmission}
                >
                  <Check />
                </Button>
              }
            />
            <TooltipContent>{t.saveLink}</TooltipContent>
          </Tooltip>
        </>
      ) : (
        <>
          <a
            href={sanitizeUrl(linkUrl)}
            target="_blank"
            rel="noopener noreferrer"
            title={t.openLink}
            className="max-w-56 truncate ps-2 text-[0.8rem] text-primary underline underline-offset-2"
          >
            {linkUrl}
          </a>
          <Tooltip>
            <TooltipTrigger
              render={
                <Button
                  variant="ghost"
                  size="icon-sm"
                  aria-label={t.editLink}
                  onMouseDown={preventDefault}
                  onClick={(event) => {
                    event.preventDefault()
                    setEditedLinkUrl(linkUrl)
                    setIsLinkEditMode(true)
                  }}
                >
                  <Pencil />
                </Button>
              }
            />
            <TooltipContent>{t.editLink}</TooltipContent>
          </Tooltip>
          <Tooltip>
            <TooltipTrigger
              render={
                <Button
                  variant="ghost"
                  size="icon-sm"
                  aria-label={t.removeLink}
                  onMouseDown={preventDefault}
                  onClick={() => {
                    editor.dispatchCommand(TOGGLE_LINK_COMMAND, null)
                  }}
                >
                  <Trash2 />
                </Button>
              }
            />
            <TooltipContent>{t.removeLink}</TooltipContent>
          </Tooltip>
        </>
      )}
    </div>
  )
}
