import { useCallback, useEffect, useRef, useState } from "react"

import {
  $getNearestNodeFromDOMNode,
  $getNodeByKey,
  $getRoot,
  $getSelection,
  $isDecoratorNode,
  $isNodeSelection,
  COPY_COMMAND,
  CUT_COMMAND,
  PASTE_COMMAND,
  registerEventListener,
} from "lexical"

import { $isAutoLinkNode, $isLinkNode } from "@lexical/link"
import { useLexicalComposerContext } from "@lexical/react/LexicalComposerContext"

import {
  Clipboard,
  ClipboardType,
  Copy,
  Link2Off,
  Scissors,
  Trash2,
} from "lucide-react"

import { useTranslation } from "@/components/editor/plugins/i18n-plugin"
import {
  ContextMenu,
  ContextMenuContent,
  ContextMenuItem,
  ContextMenuSeparator,
  ContextMenuTrigger,
} from "@/components/ui/context-menu"

export function ContextMenuPlugin() {
  const [editor] = useLexicalComposerContext()
  const { t, dir } = useTranslation()
  const triggerRef = useRef<HTMLDivElement>(null)
  const [target, setTarget] = useState<{ key: string; isLink: boolean } | null>(
    null
  )

  useEffect(() => {
    function onContextMenu(event: MouseEvent) {
      const trigger = triggerRef.current
      if (trigger === null || !(event.target instanceof Node)) {
        return
      }
      event.preventDefault()
      editor.read(() => {
        const node =
          $getNearestNodeFromDOMNode(event.target as Node) ?? $getRoot()
        setTarget({
          key: node.getKey(),
          isLink: $isLinkNode(node) || $isLinkNode(node.getParent()),
        })
      })
      trigger.dispatchEvent(
        new MouseEvent("contextmenu", {
          bubbles: true,
          cancelable: true,
          clientX: event.clientX,
          clientY: event.clientY,
        })
      )
    }

    return editor.registerRootListener((rootElement) => {
      if (rootElement !== null) {
        return registerEventListener(rootElement, "contextmenu", onContextMenu)
      }
    })
  }, [editor])

  const removeLink = useCallback(() => {
    if (target === null) {
      return
    }
    editor.update(() => {
      const node = $getNodeByKey(target.key)
      const parent = node?.getParent()
      const link = $isLinkNode(node)
        ? node
        : $isLinkNode(parent)
          ? parent
          : null
      if (link === null) {
        return
      }
      if ($isAutoLinkNode(link)) {
        link.setIsUnlinked(true)
        return
      }
      for (const child of link.getChildren()) {
        link.insertBefore(child)
      }
      link.remove()
    })
  }, [editor, target])

  const pasteFromClipboard = useCallback(
    async (plainText: boolean) => {
      try {
        const data = new DataTransfer()
        if (plainText) {
          data.setData("text/plain", await navigator.clipboard.readText())
        } else {
          const [item] = await navigator.clipboard.read()
          for (const type of item.types) {
            data.setData(type, await (await item.getType(type)).text())
          }
        }
        editor.dispatchCommand(
          PASTE_COMMAND,
          new ClipboardEvent("paste", { clipboardData: data })
        )
      } catch {
        window.alert(t.clipboardNotAllowed)
      }
    },
    [editor, t]
  )

  const deleteNode = useCallback(() => {
    editor.update(() => {
      const selection = $getSelection()
      if ($isNodeSelection(selection)) {
        for (const node of selection.getNodes()) {
          if ($isDecoratorNode(node)) {
            node.remove()
          }
        }
        return
      }
      const node = target === null ? null : $getNodeByKey(target.key)
      if (node === null) {
        return
      }
      if ($isDecoratorNode(node)) {
        node.remove()
      } else {
        node.getTopLevelElement()?.remove()
      }
    })
  }, [editor, target])

  return (
    <ContextMenu>
      <ContextMenuTrigger ref={triggerRef} className="hidden" />
      <ContextMenuContent dir={dir} className="w-52">
        {target?.isLink && (
          <>
            <ContextMenuItem onClick={removeLink}>
              <Link2Off />
              {t.removeLink}
            </ContextMenuItem>
            <ContextMenuSeparator />
          </>
        )}
        <ContextMenuItem
          onClick={() => editor.dispatchCommand(CUT_COMMAND, null)}
        >
          <Scissors />
          {t.cut}
        </ContextMenuItem>
        <ContextMenuItem
          onClick={() => editor.dispatchCommand(COPY_COMMAND, null)}
        >
          <Copy />
          {t.copy}
        </ContextMenuItem>
        <ContextMenuItem onClick={() => pasteFromClipboard(false)}>
          <Clipboard />
          {t.paste}
        </ContextMenuItem>
        <ContextMenuItem onClick={() => pasteFromClipboard(true)}>
          <ClipboardType />
          {t.pasteAsPlainText}
        </ContextMenuItem>
        <ContextMenuSeparator />
        <ContextMenuItem variant="destructive" onClick={deleteNode}>
          <Trash2 />
          {t.deleteNode}
        </ContextMenuItem>
      </ContextMenuContent>
    </ContextMenu>
  )
}
