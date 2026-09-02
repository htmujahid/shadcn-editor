import { useCallback, useEffect, useRef, useState } from "react";

import {
  $getSelection,
  $isParagraphNode,
  $isRangeSelection,
  $isTextNode,
  COMMAND_PRIORITY_LOW,
  getDOMSelection,
  getDOMSelectionPoints,
  isDOMDocumentNode,
  isDOMShadowRoot,
  type LexicalEditor,
  registerEventListener,
  registerEventListeners,
  SELECTION_CHANGE_COMMAND,
} from "lexical";

import { useLexicalComposerContext } from "@lexical/react/LexicalComposerContext";
import { useLexicalEditable } from "@lexical/react/useLexicalEditable";
import { mergeRegister } from "@lexical/utils";

import { Popover as PopoverPrimitive } from "@base-ui/react/popover";

import { $getSelectedNode } from "@/components/editor/extensions/format-state";
import {
  getDOMRangeRect,
  hideFloatingAnchor,
  setFloatingAnchorRect,
} from "@/components/editor/plugins/floating/floating-utils";
import { useTranslation } from "@/components/editor/plugins/i18n-plugin";
import { TextFormatToolbarPlugin } from "@/components/editor/plugins/toolbar/text-format-toolbar-plugin";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

function FloatingToolbar({
  editor,
  children,
  ref,
}: {
  editor: LexicalEditor;
  children: React.ReactNode;
  ref?: React.Ref<HTMLDivElement | null>;
}) {
  const triggerRef = useRef<HTMLButtonElement | null>(null);
  const popupRef = useRef<HTMLDivElement | null>(null);
  const { t, dir } = useTranslation();

  const setPopupRefs = useCallback(
    (elem: HTMLDivElement | null) => {
      popupRef.current = elem;
      if (typeof ref === "function") {
        ref(elem);
      } else if (ref) {
        ref.current = elem;
      }
    },
    [ref],
  );

  useEffect(() => {
    function mouseMoveListener(e: MouseEvent) {
      const popupElem = popupRef.current;
      if (popupElem && (e.buttons === 1 || e.buttons === 3)) {
        if (popupElem.style.pointerEvents !== "none") {
          const popupRoot = popupElem.getRootNode();
          const elementUnderMouse =
            isDOMDocumentNode(popupRoot) || isDOMShadowRoot(popupRoot)
              ? popupRoot.elementFromPoint(e.clientX, e.clientY)
              : null;
          if (!popupElem.contains(elementUnderMouse)) {
            popupElem.style.pointerEvents = "none";
          }
        }
      }
    }
    function mouseUpListener() {
      const popupElem = popupRef.current;
      if (popupElem && popupElem.style.pointerEvents !== "auto") {
        popupElem.style.pointerEvents = "auto";
      }
    }
    return registerEventListeners(document, {
      mousemove: mouseMoveListener,
      mouseup: mouseUpListener,
    });
  }, []);

  const $updateAnchorPosition = useCallback(() => {
    const triggerElem = triggerRef.current;
    if (triggerElem === null) {
      return;
    }

    const selection = $getSelection();
    const nativeSelection = getDOMSelection(editor._window);
    const rootElement = editor.getRootElement();
    let targetRect: DOMRect | null = null;

    if (
      $isRangeSelection(selection) &&
      nativeSelection !== null &&
      rootElement !== null
    ) {
      const points = getDOMSelectionPoints(nativeSelection, rootElement);
      const pointsCollapsed =
        points.anchorNode === points.focusNode &&
        points.anchorOffset === points.focusOffset;
      if (!pointsCollapsed && rootElement.contains(points.anchorNode)) {
        targetRect = getDOMRangeRect(nativeSelection, rootElement);
      }
    }

    if (targetRect !== null) {
      setFloatingAnchorRect(triggerElem, targetRect);
    } else {
      hideFloatingAnchor(triggerElem);
    }
  }, [editor]);

  useEffect(() => {
    const update = () => {
      editor.read("latest", () => {
        $updateAnchorPosition();
      });
    };

    return mergeRegister(
      registerEventListener(window, "resize", update),
      registerEventListener(document, "scroll", update, true),
      registerEventListener(document, "selectionchange", update),
    );
  }, [editor, $updateAnchorPosition]);

  useEffect(() => {
    editor.read("latest", () => {
      $updateAnchorPosition();
    });
    return mergeRegister(
      editor.registerUpdateListener(({ editorState }) => {
        editorState.read(() => {
          $updateAnchorPosition();
        });
      }),
      editor.registerCommand(
        SELECTION_CHANGE_COMMAND,
        () => {
          $updateAnchorPosition();
          return false;
        },
        COMMAND_PRIORITY_LOW,
      ),
    );
  }, [editor, $updateAnchorPosition]);

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
          dir={dir}
          ref={setPopupRefs}
          side="top"
          align="start"
          sideOffset={8}
          initialFocus={false}
          finalFocus={false}
          role="toolbar"
          aria-label={t.textFormatToolbar}
          className="w-auto min-w-0 flex-row items-center gap-1 p-1"
        >
          {children}
        </PopoverContent>
      </PopoverPrimitive.Portal>
    </Popover>
  );
}

function useIsTextSelected(editor: LexicalEditor): boolean {
  const [isText, setIsText] = useState(false);

  const updatePopup = useCallback(() => {
    editor.read("latest", () => {
      if (editor.isComposing()) {
        return;
      }
      const selection = $getSelection();
      const nativeSelection = getDOMSelection(editor._window);
      const rootElement = editor.getRootElement();

      if (
        nativeSelection !== null &&
        (!$isRangeSelection(selection) ||
          rootElement === null ||
          !rootElement.contains(
            getDOMSelectionPoints(nativeSelection, rootElement).anchorNode,
          ))
      ) {
        setIsText(false);
        return;
      }

      if (!$isRangeSelection(selection)) {
        return;
      }

      const rawTextContent = selection.getTextContent().replace(/\n/g, "");
      if (selection.isCollapsed() || rawTextContent === "") {
        setIsText(false);
        return;
      }

      const node = $getSelectedNode(selection);
      setIsText($isTextNode(node) || $isParagraphNode(node));
    });
  }, [editor]);

  useEffect(() => {
    return registerEventListener(document, "selectionchange", updatePopup);
  }, [updatePopup]);

  useEffect(() => {
    return mergeRegister(
      editor.registerUpdateListener(() => {
        updatePopup();
      }),
      editor.registerRootListener(() => {
        if (editor.getRootElement() === null) {
          setIsText(false);
        }
      }),
    );
  }, [editor, updatePopup]);

  return isText;
}

/**
 * Floating toolbar shown above a non-collapsed text selection.
 *
 * Text formatting toggles are rendered by default. Compose additional
 * controls by passing them as children, for example:
 *
 * ```tsx
 * <FloatingToolbarPlugin>
 *   <LinkToolbarPlugin />
 *   <RubyToolbarPlugin />
 * </FloatingToolbarPlugin>
 * ```
 */
export function FloatingToolbarPlugin({
  formats = "all",
  children,
}: {
  formats?: "basic" | "all";
  children?: React.ReactNode;
}) {
  const [editor] = useLexicalComposerContext();
  const isEditable = useLexicalEditable();
  const isText = useIsTextSelected(editor);

  const toolbarRef = useRef<HTMLDivElement | null>(null);
  useEffect(() => {
    const onDragStart = () => {
      if (toolbarRef.current) {
        toolbarRef.current.style.display = "none";
      }
    };
    const onDragEnd = () => {
      if (toolbarRef.current && toolbarRef.current.style.display === "none") {
        toolbarRef.current.style.display = "";
      }
    };
    return registerEventListeners(
      document,
      { dragend: onDragEnd, dragstart: onDragStart, drop: onDragEnd },
      true,
    );
  }, []);

  if (!isEditable || !isText) {
    return null;
  }

  return (
    <FloatingToolbar editor={editor} ref={toolbarRef}>
      <TextFormatToolbarPlugin formats={formats} />
      {children}
    </FloatingToolbar>
  );
}
