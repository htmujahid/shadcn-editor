"use client"

import { useCallback, useEffect, useState } from "react"
import { $isLinkNode, TOGGLE_LINK_COMMAND } from "@lexical/link"
import {
  $isRangeSelection,
  BaseSelection,
  COMMAND_PRIORITY_NORMAL,
  KEY_MODIFIER_COMMAND,
} from "lexical"
import { LinkIcon } from "lucide-react"

import { useFloatingLinkContext } from "@/registry/new-york-v4/editor/context/floating-link-context"
import { useToolbarContext } from "@/registry/new-york-v4/editor/context/toolbar-context"
import { useUpdateToolbarHandler } from "@/registry/new-york-v4/editor/editor-hooks/use-update-toolbar"
import { getSelectedNode } from "@/registry/new-york-v4/editor/utils/get-selected-node"
import { sanitizeUrl } from "@/registry/new-york-v4/editor/utils/url"
import { Toggle } from "@/registry/new-york-v4/ui/toggle"

export function LinkToolbarPlugin() {
  const { activeEditor } = useToolbarContext()
  const { setIsLinkEditMode } = useFloatingLinkContext()
  const [isLink, setIsLink] = useState(false)

  const $updateToolbar = (selection: BaseSelection) => {
    if ($isRangeSelection(selection)) {
      const node = getSelectedNode(selection)
      const parent = node.getParent()
      if ($isLinkNode(parent) || $isLinkNode(node)) {
        setIsLink(true)
      } else {
        setIsLink(false)
      }
    }
  }

  useUpdateToolbarHandler($updateToolbar)

  useEffect(() => {
    return activeEditor.registerCommand(
      KEY_MODIFIER_COMMAND,
      (payload) => {
        const event: KeyboardEvent = payload
        const { code, ctrlKey, metaKey } = event

        if (code === "KeyK" && (ctrlKey || metaKey)) {
          event.preventDefault()
          let url: string | null
          if (!isLink) {
            setIsLinkEditMode(true)
            url = sanitizeUrl("https://")
          } else {
            setIsLinkEditMode(false)
            url = null
          }
          return activeEditor.dispatchCommand(TOGGLE_LINK_COMMAND, url)
        }
        return false
      },
      COMMAND_PRIORITY_NORMAL
    )
  }, [activeEditor, isLink, setIsLinkEditMode])

  const insertLink = useCallback(() => {
    if (!isLink) {
      setIsLinkEditMode(true)
      activeEditor.dispatchCommand(TOGGLE_LINK_COMMAND, sanitizeUrl("https://"))
    } else {
      setIsLinkEditMode(false)
      activeEditor.dispatchCommand(TOGGLE_LINK_COMMAND, null)
    }
  }, [activeEditor, isLink, setIsLinkEditMode])

  return (
    <Toggle
      variant={"outline"}
      size="sm"
      className="!h-8 !w-8"
      aria-label="Toggle link"
      onClick={insertLink}
    >
      <LinkIcon className="h-4 w-4" />
    </Toggle>
  )
}
