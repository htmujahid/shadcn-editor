import {
  $caretFromPoint,
  $createTextNode,
  $getSelection,
  $getSiblingCaret,
  $isExtendableTextPointCaret,
  $isRangeSelection,
  $isTextNode,
  $isTextPointCaret,
  $setPointFromCaret,
  type CaretDirection,
  COMMAND_PRIORITY_HIGH,
  configExtension,
  CONTROLLED_TEXT_INSERTION_COMMAND,
  createCommand,
  defineExtension,
  getDOMSelection,
  KEY_ARROW_LEFT_COMMAND,
  KEY_ARROW_RIGHT_COMMAND,
  KEY_BACKSPACE_COMMAND,
  type LexicalCommand,
  type LexicalEditor,
  registerEventListener,
  registerEventListeners,
  SELECTION_CHANGE_COMMAND,
  type SiblingCaret,
} from "lexical";

import {
  CoreImportExtension,
  defineImportRule,
  DOMImportExtension,
  sel,
} from "@lexical/html";
import { mergeRegister } from "@lexical/utils";

import {
  $createRubyNode,
  $isRubyNode,
  $toggleRuby,
  $unwrapRubyNode,
  RubyNode,
} from "@/components/editor/nodes/ruby-node";

export const OPEN_RUBY_EDITOR_COMMAND: LexicalCommand<void> = createCommand(
  "OPEN_RUBY_EDITOR_COMMAND",
);

export function toggleRubyEditor(editor: LexicalEditor): void {
  const hasRuby = editor.read(() => {
    const selection = $getSelection();
    return (
      $isRangeSelection(selection) && selection.getNodes().some($isRubyNode)
    );
  });
  if (hasRuby) {
    editor.update(() => {
      $toggleRuby(null);
    });
  } else {
    editor.dispatchCommand(OPEN_RUBY_EDITOR_COMMAND, undefined);
  }
}

const RubyImportRule = defineImportRule({
  $import: (_ctx, el) => {
    const children = el.childNodes;
    const results = [];
    let pendingText = "";
    for (let i = 0; i < children.length; i++) {
      const child = children[i];
      if (child.nodeName === "RT") {
        const annotation = child.textContent || "";
        if (pendingText) {
          results.push($createRubyNode(pendingText, annotation));
          pendingText = "";
        }
      } else if (child.nodeName === "RP") {
        continue;
      } else {
        pendingText += child.textContent || "";
      }
    }
    if (pendingText) {
      results.push($createTextNode(pendingText));
    }
    return results;
  },
  match: sel.tag("ruby"),
  name: "@shadcn-editor/editor/ruby",
});

function $unwrapRubiesInSelection(): void {
  const selection = $getSelection();
  if (!$isRangeSelection(selection) || selection.isCollapsed()) {
    return;
  }
  for (const node of selection.getNodes()) {
    if ($isRubyNode(node)) {
      $unwrapRubyNode(node);
    }
  }
}

function $caretPastRubyChain<D extends CaretDirection>(
  ruby: RubyNode,
  direction: D,
): SiblingCaret<RubyNode, D> {
  let caret = $getSiblingCaret(ruby, direction);
  for (
    let node = caret.getNodeAtCaret();
    $isRubyNode(node);
    node = caret.getNodeAtCaret()
  ) {
    caret = $getSiblingCaret(node, direction);
  }
  return caret;
}

function $skipRubyOnArrow(
  direction: CaretDirection,
  isShift: boolean,
): boolean {
  const selection = $getSelection();
  if (!$isRangeSelection(selection)) {
    return false;
  }
  if (!isShift && !selection.isCollapsed()) {
    return false;
  }
  const point = isShift ? selection.focus : selection.anchor;
  const caret = $caretFromPoint(point, direction);

  let ruby: RubyNode | null = null;
  let fromRuby = false;
  if ($isTextPointCaret(caret) && $isRubyNode(caret.origin)) {
    if (caret.origin.isComposing()) {
      return false;
    }
    ruby = caret.origin;
    fromRuby = true;
  } else if (!$isExtendableTextPointCaret(caret)) {
    const adjacent = caret.getNodeAtCaret();
    if ($isRubyNode(adjacent)) {
      ruby = adjacent;
    }
  }
  if (ruby === null) {
    return false;
  }

  const edgeCaret = $caretPastRubyChain(ruby, direction);
  const beyond = edgeCaret.getNodeAtCaret();
  if (beyond !== null && !$isTextNode(beyond)) {
    return false;
  }
  if ($isTextNode(beyond) && fromRuby && isShift && direction === "next") {
    point.set(
      beyond.getKey(),
      Math.min(1, beyond.getTextContentSize()),
      "text",
    );
  } else {
    $setPointFromCaret(point, edgeCaret.getFlipped());
  }
  if (!isShift) {
    const { anchor, focus } = selection;
    focus.set(anchor.key, anchor.offset, anchor.type);
  }
  return true;
}

function $nudgeOffRuby(): boolean {
  const selection = $getSelection();
  if (!$isRangeSelection(selection) || !selection.isCollapsed()) {
    return false;
  }
  const { anchor } = selection;
  if (anchor.type !== "text") {
    return false;
  }
  const node = anchor.getNode();
  if (!$isRubyNode(node)) {
    return false;
  }
  if (node.isComposing()) {
    return false;
  }
  const len = node.getTextContentSize();
  if (anchor.offset === len || anchor.offset === 0) {
    const isEnd = anchor.offset === len;
    const sibling = isEnd ? node.getNextSibling() : node.getPreviousSibling();
    if ($isTextNode(sibling) && !$isRubyNode(sibling)) {
      const offset = isEnd ? 0 : sibling.getTextContentSize();
      selection.anchor.set(sibling.getKey(), offset, "text");
      selection.focus.set(sibling.getKey(), offset, "text");
      return false;
    }
  }
  return false;
}

export const RubyExtension = defineExtension({
  name: "@shadcn-editor/editor/Ruby",
  nodes: () => [RubyNode],
  dependencies: [
    CoreImportExtension,
    configExtension(DOMImportExtension, {
      rules: [RubyImportRule],
    }),
  ],
  register: (editor) => {
    let composingRubyInner: HTMLElement | null = null;
    let isMouseDown = false;

    function checkCompositionInRuby() {
      if (composingRubyInner) {
        return;
      }
      const domSelection = getDOMSelection(editor._window);
      if (!domSelection || !domSelection.anchorNode) {
        return;
      }
      let el: HTMLElement | null = domSelection.anchorNode.parentElement;
      while (el && !el.dataset.rubyAnnotation) {
        if (el.hasAttribute("data-lexical-key")) {
          break;
        }
        el = el.parentElement;
      }
      if (el && el.dataset.rubyAnnotation) {
        el.classList.add("editor-ruby-composing");
        composingRubyInner = el;
      }
    }

    function onCompositionEnd() {
      if (composingRubyInner) {
        composingRubyInner.classList.remove("editor-ruby-composing");
        composingRubyInner = null;
      }
    }

    return mergeRegister(
      editor.registerRootListener((rootElement) => {
        if (rootElement) {
          return mergeRegister(
            registerEventListeners(
              rootElement,
              {
                compositionend: onCompositionEnd,
                compositionstart: checkCompositionInRuby,
                compositionupdate: checkCompositionInRuby,
              },
              true,
            ),
            registerEventListener(rootElement, "mousedown", () => {
              isMouseDown = true;
            }),
            registerEventListener(rootElement.ownerDocument, "mouseup", () => {
              isMouseDown = false;
            }),
          );
        }
      }),
      editor.registerCommand(
        KEY_BACKSPACE_COMMAND,
        (event) => {
          if (editor.isComposing()) {
            return false;
          }
          const selection = $getSelection();
          if (!$isRangeSelection(selection) || !selection.isCollapsed()) {
            return false;
          }
          const caret = $caretFromPoint(selection.anchor, "previous");
          if (!$isExtendableTextPointCaret(caret)) {
            const prev = caret.getNodeAtCaret();
            if ($isRubyNode(prev)) {
              prev.remove();
              event.preventDefault();
              return true;
            }
          }
          return false;
        },
        COMMAND_PRIORITY_HIGH,
      ),
      ...(
        [
          [KEY_ARROW_LEFT_COMMAND, "previous"],
          [KEY_ARROW_RIGHT_COMMAND, "next"],
        ] as const
      ).map(([command, direction]) =>
        editor.registerCommand(
          command,
          (event) => {
            if (event.metaKey || event.ctrlKey || event.altKey) {
              return false;
            }
            if (editor.isComposing()) {
              return false;
            }
            const handled = $skipRubyOnArrow(direction, event.shiftKey);
            if (handled) {
              event.preventDefault();
            }
            return handled;
          },
          COMMAND_PRIORITY_HIGH,
        ),
      ),
      editor.registerCommand(
        SELECTION_CHANGE_COMMAND,
        () => {
          if (isMouseDown) {
            return false;
          }
          return $nudgeOffRuby();
        },
        COMMAND_PRIORITY_HIGH,
      ),
      editor.registerCommand(
        CONTROLLED_TEXT_INSERTION_COMMAND,
        (text) => {
          if (typeof text === "string") {
            $unwrapRubiesInSelection();
          }
          return false;
        },
        COMMAND_PRIORITY_HIGH,
      ),
    );
  },
});
