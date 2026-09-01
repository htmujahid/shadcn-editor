import { useCallback, useEffect, useRef, useState } from "react"

import {
  $getNearestNodeFromDOMNode,
  $getNodeByKey,
  $getSelection,
  $isRangeSelection,
  CLICK_COMMAND,
  COMMAND_PRIORITY_HIGH,
  COMMAND_PRIORITY_LOW,
  getDOMSelection,
  isHTMLElement,
  KEY_ESCAPE_COMMAND,
  type NodeKey,
  registerEventListener,
  SELECTION_CHANGE_COMMAND,
} from "lexical"

import { useLexicalComposerContext } from "@lexical/react/LexicalComposerContext"
import { mergeRegister } from "@lexical/utils"

import { Popover as PopoverPrimitive } from "@base-ui/react/popover"
import { Check, Trash2 } from "lucide-react"

import { OPEN_RUBY_EDITOR_COMMAND } from "@/components/editor/extensions/ruby"
import {
  $isRubyNode,
  $toggleRuby,
  $unwrapRubyNode,
  type RubyNode,
} from "@/components/editor/nodes/ruby-node"
import {
  getDOMRangeRect,
  hideFloatingAnchor,
  setFloatingAnchorRect,
} from "@/components/editor/plugins/floating/floating-utils"
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

function preventDefault(
  event: React.KeyboardEvent<HTMLElement> | React.MouseEvent<HTMLElement>
): void {
  event.preventDefault()
}

export function RubyEditorPlugin() {
  const [editor] = useLexicalComposerContext()
  const { t, dir } = useTranslation()
  const triggerRef = useRef<HTMLButtonElement | null>(null)
  const contentRef = useRef<HTMLDivElement | null>(null)
  const [isOpen, setIsOpen] = useState(false)
  const [baseText, setBaseText] = useState("")
  const [annotation, setAnnotation] = useState("")
  const [rubyNodeKey, setRubyNodeKey] = useState<NodeKey | null>(null)

  const positionToRect = useCallback((rect: DOMRect | null) => {
    const triggerElem = triggerRef.current
    if (triggerElem === null) {
      return
    }
    if (rect === null) {
      hideFloatingAnchor(triggerElem)
    } else {
      setFloatingAnchorRect(triggerElem, rect)
    }
  }, [])

  const positionToRubyNode = useCallback(
    (node: RubyNode) => {
      setBaseText(node.getTextContent())
      setAnnotation(node.getAnnotation())
      setRubyNodeKey(node.getKey())
      const element = editor.getElementByKey(node.getKey())
      positionToRect(element ? element.getBoundingClientRect() : null)
    },
    [editor, positionToRect]
  )

  const $positionToSelection = useCallback(() => {
    const selection = $getSelection()
    if (!$isRangeSelection(selection) || selection.isCollapsed()) {
      return false
    }
    const nativeSelection = getDOMSelection(editor._window)
    const rootElement = editor.getRootElement()
    if (nativeSelection === null || rootElement === null) {
      return false
    }
    setBaseText(selection.getTextContent())
    setAnnotation("")
    setRubyNodeKey(null)
    positionToRect(getDOMRangeRect(nativeSelection, rootElement))
    return true
  }, [editor, positionToRect])

  const close = useCallback(() => {
    setIsOpen(false)
    positionToRect(null)
  }, [positionToRect])

  useEffect(() => {
    return mergeRegister(
      editor.registerCommand(
        OPEN_RUBY_EDITOR_COMMAND,
        () => {
          const opened = $positionToSelection()
          if (opened) {
            setIsOpen(true)
          }
          return opened
        },
        COMMAND_PRIORITY_HIGH
      ),
      editor.registerCommand(
        CLICK_COMMAND,
        (event) => {
          if (contentRef.current?.contains(event.target as Node)) {
            return false
          }
          const selection = $getSelection()
          if ($isRangeSelection(selection) && !selection.isCollapsed()) {
            close()
            return false
          }
          const target = event.target
          const node = isHTMLElement(target)
            ? $getNearestNodeFromDOMNode(target)
            : null
          if ($isRubyNode(node)) {
            positionToRubyNode(node)
            setIsOpen(true)
          } else {
            close()
          }
          return false
        },
        COMMAND_PRIORITY_HIGH
      ),
      editor.registerCommand(
        KEY_ESCAPE_COMMAND,
        () => {
          if (isOpen) {
            close()
            return true
          }
          return false
        },
        COMMAND_PRIORITY_HIGH
      ),
      editor.registerCommand(
        SELECTION_CHANGE_COMMAND,
        () => {
          if (isOpen && rubyNodeKey === null) {
            $positionToSelection()
          }
          return false
        },
        COMMAND_PRIORITY_LOW
      )
    )
  }, [
    editor,
    isOpen,
    rubyNodeKey,
    $positionToSelection,
    positionToRubyNode,
    close,
  ])

  useEffect(() => {
    if (!isOpen) {
      return
    }
    const update = () => {
      if (rubyNodeKey !== null) {
        const element = editor.getElementByKey(rubyNodeKey)
        positionToRect(element ? element.getBoundingClientRect() : null)
      }
    }
    return mergeRegister(
      registerEventListener(window, "resize", update),
      registerEventListener(document, "scroll", update, true)
    )
  }, [editor, isOpen, rubyNodeKey, positionToRect])

  const handleSubmit = (
    event: React.KeyboardEvent<HTMLElement> | React.MouseEvent<HTMLElement>
  ) => {
    event.preventDefault()
    const value = annotation.trim()
    if (!value) {
      return
    }
    editor.update(() => {
      if (rubyNodeKey) {
        const node = $getNodeByKey(rubyNodeKey)
        if ($isRubyNode(node)) {
          node.setAnnotation(value)
        }
      } else {
        $toggleRuby(value)
      }
    })
    close()
    requestAnimationFrame(() => editor.focus())
  }

  const handleDelete = () => {
    editor.update(() => {
      if (rubyNodeKey) {
        const node = $getNodeByKey(rubyNodeKey)
        if ($isRubyNode(node)) {
          $unwrapRubyNode(node)
        }
      } else {
        $toggleRuby(null)
      }
    })
    close()
    requestAnimationFrame(() => editor.focus())
  }

  const handleKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.nativeEvent.isComposing) {
      return
    }
    if (event.key === "Enter") {
      handleSubmit(event)
    } else if (event.key === "Escape") {
      event.preventDefault()
      close()
    }
  }

  return (
    <Popover open={isOpen}>
      <PopoverTrigger
        ref={triggerRef}
        aria-hidden="true"
        tabIndex={-1}
        className="pointer-events-none fixed top-0 left-0 opacity-0"
        style={{ transform: "translate(-10000px, -10000px)" }}
      />
      <PopoverPrimitive.Portal dir={dir}>
        <PopoverContent
          dir={dir}
          ref={contentRef}
          side="bottom"
          align="start"
          sideOffset={8}
          initialFocus={false}
          finalFocus={false}
          aria-label={t.insertRuby}
          className="w-auto min-w-0 flex-row items-center gap-1.5 p-1.5"
          onBlur={(event) => {
            if (!event.currentTarget.contains(event.relatedTarget as Node)) {
              close()
            }
          }}
        >
          <span
            className="max-w-30 shrink-0 truncate text-sm text-muted-foreground"
            title={baseText}
          >
            {baseText}
          </span>
          <Input
            ref={(elem) => {
              if (elem && isOpen) {
                elem.focus()
              }
            }}
            value={annotation}
            placeholder={t.rubyAnnotationPlaceholder}
            aria-label={t.rubyAnnotationPlaceholder}
            className="h-7 min-w-24 flex-1 md:text-[0.8rem]"
            onChange={(event) => {
              setAnnotation(event.target.value)
            }}
            onKeyDown={handleKeyDown}
          />
          <Tooltip>
            <TooltipTrigger
              render={
                <Button
                  variant="ghost"
                  size="icon-sm"
                  aria-label={t.insertRuby}
                  onMouseDown={preventDefault}
                  onClick={handleSubmit}
                >
                  <Check />
                </Button>
              }
            />
            <TooltipContent>{t.insertRuby}</TooltipContent>
          </Tooltip>
          {rubyNodeKey !== null && (
            <Tooltip>
              <TooltipTrigger
                render={
                  <Button
                    variant="ghost"
                    size="icon-sm"
                    aria-label={t.removeRuby}
                    onMouseDown={preventDefault}
                    onClick={handleDelete}
                  >
                    <Trash2 />
                  </Button>
                }
              />
              <TooltipContent>{t.removeRuby}</TooltipContent>
            </Tooltip>
          )}
        </PopoverContent>
      </PopoverPrimitive.Portal>
    </Popover>
  )
}
