import { useMemo } from "react";

import {
  $getSelection,
  $isElementNode,
  $isLineBreakNode,
  $isRangeSelection,
  COMMAND_PRIORITY_CRITICAL,
  type ElementFormatType,
  type ElementNode,
  type LexicalEditor,
  type RangeSelection,
  SELECTION_CHANGE_COMMAND,
  type TextFormatType,
  type TextNode,
} from "lexical";

import {
  computed,
  defineExtension,
  type ReadonlySignal,
  watchedSignal,
} from "@lexical/extension";
import { $isAutoLinkNode, $isLinkNode, type LinkNode } from "@lexical/link";
import { useExtensionDependency } from "@lexical/react/useExtensionComponent";
import { useSignalValue } from "@lexical/react/useExtensionSignalValue";
import {
  $getSelectionStyleValueForProperty,
  $isAtNodeEnd,
  $patchStyleText,
} from "@lexical/selection";
import { $findMatchingParent, mergeRegister } from "@lexical/utils";

export const TEXT_FORMATS = [
  "bold",
  "italic",
  "underline",
  "strikethrough",
  "code",
  "subscript",
  "superscript",
  "highlight",
  "lowercase",
  "uppercase",
  "capitalize",
] as const satisfies readonly TextFormatType[];

export interface FormatState {
  formats: TextFormatType[];
  elementFormat: Exclude<ElementFormatType, "">;
  fontFamily: string;
  fontSize: string;
  color: string;
  backgroundColor: string;
  indent: number;
  isLink: boolean;
}

export const DEFAULT_FORMAT_STATE: FormatState = {
  formats: [],
  elementFormat: "left",
  fontFamily: "",
  fontSize: "16px",
  color: "",
  backgroundColor: "",
  indent: 0,
  isLink: false,
};

export function clearFormatting(editor: LexicalEditor) {
  editor.update(() => {
    const selection = $getSelection();
    if (!$isRangeSelection(selection)) {
      return;
    }
    TEXT_FORMATS.forEach((format) => selection.formatText(format, 0));
    $patchStyleText(selection, {
      "font-family": null,
      "font-size": null,
      color: null,
      "background-color": null,
    });
  });
}

export function $getSelectedNode(
  selection: RangeSelection,
): TextNode | ElementNode {
  const anchor = selection.anchor;
  const focus = selection.focus;
  const anchorNode = anchor.getNode();
  const focusNode = focus.getNode();
  if (anchorNode === focusNode) {
    return anchorNode;
  }
  if (selection.isBackward()) {
    return $isAtNodeEnd(focus) ? anchorNode : focusNode;
  }
  return $isAtNodeEnd(anchor) ? anchorNode : focusNode;
}

export function $getSelectedLinkNode(
  selection: RangeSelection,
): LinkNode | null {
  const node = $getSelectedNode(selection);
  if ($isLinkNode(node)) {
    return node;
  }
  const linkParent = $findMatchingParent(node, $isLinkNode);
  if ($isLinkNode(linkParent)) {
    return linkParent;
  }
  if (selection.isCollapsed()) {
    const anchor = selection.anchor;
    if (anchor.type === "text") {
      const anchorNode = anchor.getNode();
      if (anchor.offset === anchorNode.getTextContentSize()) {
        const nextSibling = anchorNode.getNextSibling();
        if ($isLinkNode(nextSibling)) {
          return nextSibling;
        }
      }
    }
  }
  return null;
}

function $isSelectionInLink(selection: RangeSelection): boolean {
  const focusLinkNode = $getSelectedLinkNode(selection);
  const focusNode = $getSelectedNode(selection);
  const focusAutoLinkNode = $findMatchingParent(focusNode, $isAutoLinkNode);
  if (!(focusLinkNode || focusAutoLinkNode)) {
    return false;
  }
  const badNode = selection
    .getNodes()
    .filter((node) => !$isLineBreakNode(node))
    .find((node) => {
      const linkNode = $findMatchingParent(node, $isLinkNode);
      const autoLinkNode = $findMatchingParent(node, $isAutoLinkNode);
      return (
        (focusLinkNode && !focusLinkNode.is(linkNode)) ||
        (linkNode && !linkNode.is(focusLinkNode)) ||
        (focusAutoLinkNode && !focusAutoLinkNode.is(autoLinkNode)) ||
        (autoLinkNode &&
          (!autoLinkNode.is(focusAutoLinkNode) || autoLinkNode.getIsUnlinked()))
      );
    });
  return !badNode;
}

function formatsEqual(a: TextFormatType[], b: TextFormatType[]): boolean {
  return (
    a.length === b.length && a.every((format, index) => format === b[index])
  );
}

function shallowEqual(a: FormatState, b: FormatState): boolean {
  for (const key in b) {
    if (a[key as keyof FormatState] !== b[key as keyof FormatState]) {
      return false;
    }
  }
  return true;
}

function $getFormatState(prev: FormatState): FormatState {
  const selection = $getSelection();
  if (!$isRangeSelection(selection)) {
    return prev;
  }
  const formats = TEXT_FORMATS.filter((format) => selection.hasFormat(format));
  const node = $getSelectedNode(selection);
  const element = $findMatchingParent(
    node,
    (parent): parent is ElementNode =>
      $isElementNode(parent) && !parent.isInline(),
  );
  const next: FormatState = {
    formats: formatsEqual(prev.formats, formats) ? prev.formats : formats,
    elementFormat: (element && element.getFormatType()) || "left",
    fontFamily: $getSelectionStyleValueForProperty(
      selection,
      "font-family",
      DEFAULT_FORMAT_STATE.fontFamily,
    ),
    fontSize: $getSelectionStyleValueForProperty(
      selection,
      "font-size",
      DEFAULT_FORMAT_STATE.fontSize,
    ),
    color: $getSelectionStyleValueForProperty(
      selection,
      "color",
      DEFAULT_FORMAT_STATE.color,
    ),
    backgroundColor: $getSelectionStyleValueForProperty(
      selection,
      "background-color",
      DEFAULT_FORMAT_STATE.backgroundColor,
    ),
    indent: element ? element.getIndent() : 0,
    isLink: $isSelectionInLink(selection),
  };
  return shallowEqual(prev, next) ? prev : next;
}

export const FormatStateExtension = defineExtension({
  name: "@shadcn-editor/format-state",
  build(editor) {
    return watchedSignal(
      () =>
        editor
          .getEditorState()
          .read(() => $getFormatState(DEFAULT_FORMAT_STATE)),
      (self) =>
        mergeRegister(
          editor.registerUpdateListener(({ editorState }) => {
            self.value = editorState.read(() => $getFormatState(self.peek()));
          }),
          editor.registerCommand(
            SELECTION_CHANGE_COMMAND,
            () => {
              self.value = $getFormatState(self.peek());
              return false;
            },
            COMMAND_PRIORITY_CRITICAL,
          ),
        ),
    );
  },
});

export function useFormatStateSignal(): ReadonlySignal<FormatState> {
  return useExtensionDependency(FormatStateExtension).output;
}

export function useFormatState(): FormatState {
  return useSignalValue(useFormatStateSignal());
}

export function useFormatStateValue<K extends keyof FormatState>(
  key: K,
): FormatState[K] {
  const state = useFormatStateSignal();
  return useSignalValue(
    useMemo(() => computed(() => state.value[key]), [state, key]),
  );
}

export function useHasFormat(format: TextFormatType): boolean {
  const state = useFormatStateSignal();
  return useSignalValue(
    useMemo(
      () => computed(() => state.value.formats.includes(format)),
      [state, format],
    ),
  );
}
