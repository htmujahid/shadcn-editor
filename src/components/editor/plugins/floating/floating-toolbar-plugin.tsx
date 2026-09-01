import {
  type Dispatch,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react"

import {
  $getSelection,
  $isParagraphNode,
  $isRangeSelection,
  $isTextNode,
  CLICK_COMMAND,
  COMMAND_PRIORITY_HIGH,
  COMMAND_PRIORITY_LOW,
  getDOMSelection,
  getDOMSelectionPoints,
  isDOMDocumentNode,
  isDOMShadowRoot,
  KEY_ESCAPE_COMMAND,
  type LexicalEditor,
  registerEventListener,
  registerEventListeners,
  SELECTION_CHANGE_COMMAND,
} from "lexical"

import { $isLinkNode, LinkNode, TOGGLE_LINK_COMMAND } from "@lexical/link"
import { useLexicalComposerContext } from "@lexical/react/LexicalComposerContext"
import { useLexicalEditable } from "@lexical/react/useLexicalEditable"
import { $findMatchingParent, mergeRegister } from "@lexical/utils"

import { Popover as PopoverPrimitive } from "@base-ui/react/popover"

import {
  $getSelectedLinkNode,
  $getSelectedNode,
  useFormatStateValue,
} from "@/components/editor/extensions/format-state"
import { OPEN_LINK_EDITOR_COMMAND } from "@/components/editor/extensions/link"
import {
  getDOMRangeRect,
  hideFloatingAnchor,
  setFloatingAnchorRect,
} from "@/components/editor/plugins/floating/floating-utils"
import { LinkEditor } from "@/components/editor/plugins/floating/link-editor"
import { TextFormatToolbar } from "@/components/editor/plugins/floating/text-format-toolbar"
import { useTranslation } from "@/components/editor/plugins/i18n-plugin"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"

function FloatingToolbar({
  editor,
  mode,
  linksEnabled,
  isLinkEditMode,
  setIsLinkEditMode,
  onDismissLink,
  ref,
}: {
  editor: LexicalEditor
  mode: "text" | "link"
  linksEnabled: boolean
  isLinkEditMode: boolean
  setIsLinkEditMode: Dispatch<boolean>
  onDismissLink: () => void
  ref?: React.Ref<HTMLDivElement | null>
}) {
  const triggerRef = useRef<HTMLButtonElement | null>(null)
  const popupRef = useRef<HTMLDivElement | null>(null)
  const { t, dir } = useTranslation()

  const setPopupRefs = useCallback(
    (elem: HTMLDivElement | null) => {
      popupRef.current = elem
      if (typeof ref === "function") {
        ref(elem)
      } else if (ref) {
        ref.current = elem
      }
    },
    [ref]
  )

  useEffect(() => {
    function mouseMoveListener(e: MouseEvent) {
      const popupElem = popupRef.current
      if (popupElem && (e.buttons === 1 || e.buttons === 3)) {
        if (popupElem.style.pointerEvents !== "none") {
          const popupRoot = popupElem.getRootNode()
          const elementUnderMouse =
            isDOMDocumentNode(popupRoot) || isDOMShadowRoot(popupRoot)
              ? popupRoot.elementFromPoint(e.clientX, e.clientY)
              : null
          if (!popupElem.contains(elementUnderMouse)) {
            popupElem.style.pointerEvents = "none"
          }
        }
      }
    }
    function mouseUpListener() {
      const popupElem = popupRef.current
      if (popupElem && popupElem.style.pointerEvents !== "auto") {
        popupElem.style.pointerEvents = "auto"
      }
    }
    return registerEventListeners(document, {
      mousemove: mouseMoveListener,
      mouseup: mouseUpListener,
    })
  }, [])

  const $updateAnchorPosition = useCallback(() => {
    const triggerElem = triggerRef.current
    if (triggerElem === null) {
      return
    }

    const selection = $getSelection()
    const nativeSelection = getDOMSelection(editor._window)
    const rootElement = editor.getRootElement()
    let targetRect: DOMRect | null = null

    if (
      $isRangeSelection(selection) &&
      nativeSelection !== null &&
      rootElement !== null
    ) {
      if (mode === "link") {
        const linkNode = $getSelectedLinkNode(selection)
        if (linkNode) {
          targetRect =
            editor
              .getElementByKey(linkNode.getKey())
              ?.getBoundingClientRect() ?? null
        }
      }
      if (targetRect === null) {
        const points = getDOMSelectionPoints(nativeSelection, rootElement)
        const pointsCollapsed =
          points.anchorNode === points.focusNode &&
          points.anchorOffset === points.focusOffset
        if (!pointsCollapsed && rootElement.contains(points.anchorNode)) {
          targetRect = getDOMRangeRect(nativeSelection, rootElement)
        }
      }
    }

    if (targetRect !== null) {
      setFloatingAnchorRect(triggerElem, targetRect)
    } else {
      hideFloatingAnchor(triggerElem)
    }
  }, [editor, mode])

  useEffect(() => {
    const update = () => {
      editor.read("latest", () => {
        $updateAnchorPosition()
      })
    }

    return mergeRegister(
      registerEventListener(window, "resize", update),
      registerEventListener(document, "scroll", update, true),
      registerEventListener(document, "selectionchange", update)
    )
  }, [editor, $updateAnchorPosition])

  useEffect(() => {
    editor.read("latest", () => {
      $updateAnchorPosition()
    })
    return mergeRegister(
      editor.registerUpdateListener(({ editorState }) => {
        editorState.read(() => {
          $updateAnchorPosition()
        })
      }),
      editor.registerCommand(
        SELECTION_CHANGE_COMMAND,
        () => {
          $updateAnchorPosition()
          return false
        },
        COMMAND_PRIORITY_LOW
      )
    )
  }, [editor, $updateAnchorPosition])

  return (
    <Popover open>
      <PopoverTrigger
        ref={triggerRef}
        aria-hidden="true"
        tabIndex={-1}
        className="pointer-events-none fixed top-0 left-0 opacity-0"
        style={{ transform: "translate(-10000px, -10000px)" }}
      />
      <PopoverPrimitive.Portal dir={dir}>
        <PopoverContent
          dir={mode === "link" ? "ltr" : dir}
          ref={setPopupRefs}
          side="top"
          align="start"
          sideOffset={8}
          initialFocus={false}
          finalFocus={false}
          role={mode === "text" ? "toolbar" : undefined}
          aria-label={mode === "text" ? t.textFormatToolbar : t.link}
          className="w-auto min-w-0 flex-row items-center gap-1 p-1"
        >
          {mode === "link" ? (
            <LinkEditor
              editor={editor}
              isLinkEditMode={isLinkEditMode}
              setIsLinkEditMode={setIsLinkEditMode}
              onDismiss={onDismissLink}
            />
          ) : (
            <TextFormatToolbar
              editor={editor}
              linksEnabled={linksEnabled}
              setIsLinkEditMode={setIsLinkEditMode}
            />
          )}
        </PopoverContent>
      </PopoverPrimitive.Portal>
    </Popover>
  )
}

function useFloatingToolbar(editor: LexicalEditor) {
  const [isText, setIsText] = useState(false)
  const [isLinkEditMode, setIsLinkEditMode] = useState(false)
  const [linkDismissed, setLinkDismissed] = useState(false)
  const isEditable = useLexicalEditable()
  const isLink = useFormatStateValue("isLink")
  const linksEnabled = useMemo(() => editor.hasNodes([LinkNode]), [editor])

  const updatePopup = useCallback(() => {
    editor.read("latest", () => {
      if (editor.isComposing()) {
        return
      }
      const selection = $getSelection()
      const nativeSelection = getDOMSelection(editor._window)
      const rootElement = editor.getRootElement()

      if (
        nativeSelection !== null &&
        (!$isRangeSelection(selection) ||
          rootElement === null ||
          !rootElement.contains(
            getDOMSelectionPoints(nativeSelection, rootElement).anchorNode
          ))
      ) {
        setIsText(false)
        return
      }

      if (!$isRangeSelection(selection)) {
        return
      }

      const rawTextContent = selection.getTextContent().replace(/\n/g, "")
      if (selection.isCollapsed() || rawTextContent === "") {
        setIsText(false)
        return
      }

      const node = $getSelectedNode(selection)
      setIsText($isTextNode(node) || $isParagraphNode(node))
    })
  }, [editor])

  useEffect(() => {
    return registerEventListener(document, "selectionchange", updatePopup)
  }, [updatePopup])

  const toolbarRef = useRef<HTMLDivElement | null>(null)
  useEffect(() => {
    const onDragStart = () => {
      if (toolbarRef.current) {
        toolbarRef.current.style.display = "none"
      }
    }
    const onDragEnd = () => {
      if (toolbarRef.current && toolbarRef.current.style.display === "none") {
        toolbarRef.current.style.display = ""
      }
    }
    return registerEventListeners(
      document,
      { dragend: onDragEnd, dragstart: onDragStart, drop: onDragEnd },
      true
    )
  }, [])

  useEffect(() => {
    return mergeRegister(
      editor.registerUpdateListener(() => {
        updatePopup()
      }),
      editor.registerRootListener(() => {
        if (editor.getRootElement() === null) {
          setIsText(false)
        }
      })
    )
  }, [editor, updatePopup])

  useEffect(() => {
    if (!linksEnabled) {
      return
    }
    return mergeRegister(
      editor.registerCommand(
        SELECTION_CHANGE_COMMAND,
        () => {
          setLinkDismissed(false)
          const selection = $getSelection()
          if (!(
            $isRangeSelection(selection) && $getSelectedLinkNode(selection)
          )) {
            setIsLinkEditMode(false)
          }
          return false
        },
        COMMAND_PRIORITY_LOW
      ),
      editor.registerCommand(
        CLICK_COMMAND,
        (payload) => {
          const selection = $getSelection()
          if ($isRangeSelection(selection)) {
            const node = $getSelectedNode(selection)
            const linkNode = $findMatchingParent(node, $isLinkNode)
            if ($isLinkNode(linkNode) && (payload.metaKey || payload.ctrlKey)) {
              window.open(linkNode.getURL(), "_blank")
              return true
            }
          }
          return false
        },
        COMMAND_PRIORITY_LOW
      ),
      editor.registerCommand(
        OPEN_LINK_EDITOR_COMMAND,
        () => {
          const selection = $getSelection()
          if (!$isRangeSelection(selection)) {
            return false
          }
          const linkNode = $getSelectedLinkNode(selection)
          if (!linkNode && selection.isCollapsed()) {
            return false
          }
          setLinkDismissed(false)
          setIsLinkEditMode(true)
          if (!linkNode) {
            editor.dispatchCommand(TOGGLE_LINK_COMMAND, "https://")
          }
          return true
        },
        COMMAND_PRIORITY_LOW
      )
    )
  }, [editor, linksEnabled])

  const showLink = linksEnabled && isLink && !linkDismissed

  useEffect(() => {
    if (!linksEnabled) {
      return
    }
    return editor.registerCommand(
      KEY_ESCAPE_COMMAND,
      () => {
        if (showLink) {
          setLinkDismissed(true)
          setIsLinkEditMode(false)
          return true
        }
        return false
      },
      COMMAND_PRIORITY_HIGH
    )
  }, [editor, linksEnabled, showLink])

  const onDismissLink = useCallback(() => {
    setLinkDismissed(true)
    setIsLinkEditMode(false)
  }, [])

  if (!isEditable || (!showLink && !isText)) {
    return null
  }

  return (
    <FloatingToolbar
      editor={editor}
      mode={showLink ? "link" : "text"}
      linksEnabled={linksEnabled}
      isLinkEditMode={isLinkEditMode}
      setIsLinkEditMode={setIsLinkEditMode}
      onDismissLink={onDismissLink}
      ref={toolbarRef}
    />
  )
}

export function FloatingToolbarPlugin() {
  const [editor] = useLexicalComposerContext()
  return useFloatingToolbar(editor)
}
