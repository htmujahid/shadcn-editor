import {
  $createParagraphNode,
  $getSelection,
  $isElementNode,
  $isRangeSelection,
  COMMAND_PRIORITY_EDITOR,
  configExtension,
  CONTROL_OR_META,
  createCommand,
  defineExtension,
  type ElementNode,
  FORMAT_ELEMENT_COMMAND,
  FORMAT_TEXT_COMMAND,
  INDENT_CONTENT_COMMAND,
  IS_APPLE,
  type KeyboardShortcutMatch,
  type LexicalCommand,
  type LexicalEditor,
  OUTDENT_CONTENT_COMMAND,
} from "lexical";

import {
  formatKeyboardShortcut,
  KeyboardShortcutsExtension,
  type NamedKeyboardShortcuts,
} from "@lexical/extension";
import {
  $isListNode,
  INSERT_CHECK_LIST_COMMAND,
  INSERT_ORDERED_LIST_COMMAND,
  INSERT_UNORDERED_LIST_COMMAND,
} from "@lexical/list";
import {
  $createHeadingNode,
  $createQuoteNode,
  $isHeadingNode,
  $isQuoteNode,
  type HeadingTagType,
} from "@lexical/rich-text";
import { $setBlocksType } from "@lexical/selection";
import { $findMatchingParent, mergeRegister } from "@lexical/utils";

import { insertCodeBlock } from "@/components/editor/extensions/code";
import {
  $getSelectedNode,
  clearFormatting,
} from "@/components/editor/extensions/format-state";

const CONTROL_OR_META_ALT = { ...CONTROL_OR_META, altKey: true };
const CONTROL_OR_META_SHIFT = { ...CONTROL_OR_META, shiftKey: true };
const CONTROL_SHIFT = { ctrlKey: true, shiftKey: true };

export const SHORTCUT_BINDINGS = Object.freeze({
  NORMAL: { key: "0", modifiers: CONTROL_OR_META_ALT },
  HEADING1: { key: "1", modifiers: CONTROL_OR_META_ALT },
  HEADING2: { key: "2", modifiers: CONTROL_OR_META_ALT },
  HEADING3: { key: "3", modifiers: CONTROL_OR_META_ALT },
  NUMBERED_LIST: { key: "7", modifiers: CONTROL_OR_META_SHIFT },
  BULLET_LIST: { key: "8", modifiers: CONTROL_OR_META_SHIFT },
  CHECK_LIST: { key: "9", modifiers: CONTROL_OR_META_SHIFT },
  CODE_BLOCK: { key: "c", modifiers: CONTROL_OR_META_ALT },
  QUOTE: { key: "q", modifiers: CONTROL_SHIFT },
  INSERT_CODE_BLOCK: { key: "c", modifiers: CONTROL_OR_META_SHIFT },
  STRIKETHROUGH: { key: "x", modifiers: CONTROL_OR_META_SHIFT },
  LOWERCASE: { key: "1", modifiers: CONTROL_SHIFT },
  UPPERCASE: { key: "2", modifiers: CONTROL_SHIFT },
  CAPITALIZE: { key: "3", modifiers: CONTROL_SHIFT },
  CENTER_ALIGN: { key: "e", modifiers: CONTROL_OR_META_SHIFT },
  JUSTIFY_ALIGN: { key: "j", modifiers: CONTROL_OR_META_SHIFT },
  LEFT_ALIGN: { key: "l", modifiers: CONTROL_OR_META_SHIFT },
  RIGHT_ALIGN: { key: "r", modifiers: CONTROL_OR_META_SHIFT },
  SUBSCRIPT: { key: ",", modifiers: CONTROL_OR_META },
  SUPERSCRIPT: { key: ".", modifiers: CONTROL_OR_META },
  INDENT: { key: "]", modifiers: CONTROL_OR_META },
  OUTDENT: { key: "[", modifiers: CONTROL_OR_META },
  CLEAR_FORMATTING: { key: "\\", modifiers: CONTROL_OR_META },
}) satisfies Record<string, KeyboardShortcutMatch>;

export const BUILTIN_SHORTCUT_BINDINGS = Object.freeze({
  BOLD: { key: "b", modifiers: CONTROL_OR_META },
  ITALIC: { key: "i", modifiers: CONTROL_OR_META },
  UNDERLINE: { key: "u", modifiers: CONTROL_OR_META },
  UNDO: { key: "z", modifiers: CONTROL_OR_META },
  REDO: IS_APPLE
    ? { key: "z", modifiers: { ...CONTROL_OR_META, shiftKey: true } }
    : { key: "y", modifiers: { ctrlKey: true } },
}) satisfies Record<string, KeyboardShortcutMatch>;

export type ShortcutName = keyof typeof SHORTCUT_BINDINGS;

export type BuiltinShortcutName = keyof typeof BUILTIN_SHORTCUT_BINDINGS;

const SHORTCUT_NAMES = Object.keys(SHORTCUT_BINDINGS) as ShortcutName[];

export const SHORTCUT_COMMANDS: Record<
  ShortcutName,
  LexicalCommand<KeyboardEvent>
> = Object.fromEntries(
  SHORTCUT_NAMES.map((name) => [
    name,
    createCommand<KeyboardEvent>(`@shadcn-editor/editor/Shortcuts/${name}`),
  ]),
) as Record<ShortcutName, LexicalCommand<KeyboardEvent>>;

export function formatShortcut(
  name: ShortcutName | BuiltinShortcutName,
): string[] {
  const binding =
    name in SHORTCUT_BINDINGS
      ? SHORTCUT_BINDINGS[name as ShortcutName]
      : BUILTIN_SHORTCUT_BINDINGS[name as BuiltinShortcutName];
  return formatKeyboardShortcut(binding);
}

function buildShortcuts(): NamedKeyboardShortcuts {
  return Object.fromEntries(
    SHORTCUT_NAMES.map((name) => [
      name,
      { ...SHORTCUT_BINDINGS[name], command: SHORTCUT_COMMANDS[name] },
    ]),
  );
}

type BlockType =
  "paragraph" | HeadingTagType | "number" | "bullet" | "check" | "quote";

function $getBlockType(): BlockType | null {
  const selection = $getSelection();
  if (!$isRangeSelection(selection)) {
    return null;
  }
  const node = $getSelectedNode(selection);
  const list = $findMatchingParent(node, $isListNode);
  if (list) {
    return list.getListType();
  }
  const element = $findMatchingParent(
    node,
    (parent): parent is ElementNode =>
      $isElementNode(parent) && !parent.isInline(),
  );
  if ($isHeadingNode(element)) {
    return element.getTag();
  }
  return $isQuoteNode(element) ? "quote" : "paragraph";
}

function $formatParagraph() {
  const selection = $getSelection();
  if ($isRangeSelection(selection)) {
    $setBlocksType(selection, () => $createParagraphNode());
  }
}

function $formatHeading(tag: HeadingTagType) {
  if ($getBlockType() === tag) {
    return;
  }
  const selection = $getSelection();
  if ($isRangeSelection(selection)) {
    $setBlocksType(selection, () => $createHeadingNode(tag));
  }
}

function $formatQuote() {
  if ($getBlockType() === "quote") {
    return;
  }
  const selection = $getSelection();
  if ($isRangeSelection(selection)) {
    $setBlocksType(selection, () => $createQuoteNode());
  }
}

function $formatList(
  editor: LexicalEditor,
  listType: "number" | "bullet" | "check",
  command: LexicalCommand<void>,
) {
  if ($getBlockType() === listType) {
    $formatParagraph();
  } else {
    editor.dispatchCommand(command, undefined);
  }
}

export const ShortcutsExtension = defineExtension({
  name: "@shadcn-editor/editor/Shortcuts",
  dependencies: [
    configExtension(KeyboardShortcutsExtension, {
      shortcuts: buildShortcuts(),
    }),
  ],
  register(editor) {
    const listen = (
      name: ShortcutName,
      $onShortcut: (fromEditor: LexicalEditor) => void,
    ) =>
      editor.registerCommand(
        SHORTCUT_COMMANDS[name],
        (event, fromEditor) => {
          $onShortcut(fromEditor);
          event.preventDefault();
          return true;
        },
        COMMAND_PRIORITY_EDITOR,
      );
    return mergeRegister(
      listen("NORMAL", () => $formatParagraph()),
      listen("HEADING1", () => $formatHeading("h1")),
      listen("HEADING2", () => $formatHeading("h2")),
      listen("HEADING3", () => $formatHeading("h3")),
      listen("NUMBERED_LIST", (e) =>
        $formatList(e, "number", INSERT_ORDERED_LIST_COMMAND),
      ),
      listen("BULLET_LIST", (e) =>
        $formatList(e, "bullet", INSERT_UNORDERED_LIST_COMMAND),
      ),
      listen("CHECK_LIST", (e) =>
        $formatList(e, "check", INSERT_CHECK_LIST_COMMAND),
      ),
      listen("CODE_BLOCK", (e) => insertCodeBlock(e)),
      listen("QUOTE", () => $formatQuote()),
      listen("INSERT_CODE_BLOCK", (e) =>
        e.dispatchCommand(FORMAT_TEXT_COMMAND, "code"),
      ),
      listen("STRIKETHROUGH", (e) =>
        e.dispatchCommand(FORMAT_TEXT_COMMAND, "strikethrough"),
      ),
      listen("LOWERCASE", (e) =>
        e.dispatchCommand(FORMAT_TEXT_COMMAND, "lowercase"),
      ),
      listen("UPPERCASE", (e) =>
        e.dispatchCommand(FORMAT_TEXT_COMMAND, "uppercase"),
      ),
      listen("CAPITALIZE", (e) =>
        e.dispatchCommand(FORMAT_TEXT_COMMAND, "capitalize"),
      ),
      listen("CENTER_ALIGN", (e) =>
        e.dispatchCommand(FORMAT_ELEMENT_COMMAND, "center"),
      ),
      listen("JUSTIFY_ALIGN", (e) =>
        e.dispatchCommand(FORMAT_ELEMENT_COMMAND, "justify"),
      ),
      listen("LEFT_ALIGN", (e) =>
        e.dispatchCommand(FORMAT_ELEMENT_COMMAND, "left"),
      ),
      listen("RIGHT_ALIGN", (e) =>
        e.dispatchCommand(FORMAT_ELEMENT_COMMAND, "right"),
      ),
      listen("SUBSCRIPT", (e) =>
        e.dispatchCommand(FORMAT_TEXT_COMMAND, "subscript"),
      ),
      listen("SUPERSCRIPT", (e) =>
        e.dispatchCommand(FORMAT_TEXT_COMMAND, "superscript"),
      ),
      listen("INDENT", (e) =>
        e.dispatchCommand(INDENT_CONTENT_COMMAND, undefined),
      ),
      listen("OUTDENT", (e) =>
        e.dispatchCommand(OUTDENT_CONTENT_COMMAND, undefined),
      ),
      listen("CLEAR_FORMATTING", (e) => clearFormatting(e)),
    );
  },
});
