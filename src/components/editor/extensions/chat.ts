import {
  $createParagraphNode,
  $createTextNode,
  $getRoot,
  $isDecoratorNode,
  $setSelection,
  COMMAND_PRIORITY_BEFORE_EDITOR,
  createCommand,
  defineExtension,
  KEY_ENTER_COMMAND,
  type Klass,
  type LexicalCommand,
  type LexicalEditor,
  type LexicalNode,
  safeCast,
  type SerializedEditorState,
} from "lexical";

import { CodeNode } from "@lexical/code-core";
import { HorizontalRuleNode } from "@lexical/extension";
import {
  $convertFromMarkdownString,
  $convertToMarkdownString,
  CHECK_LIST,
  ORDERED_LIST,
  QUOTE,
  registerMarkdownShortcuts,
  TEXT_FORMAT_TRANSFORMERS,
  type Transformer,
  TRANSFORMERS,
  UNORDERED_LIST,
} from "@lexical/markdown";
import { HeadingNode } from "@lexical/rich-text";
import { TableNode } from "@lexical/table";
import { $dfs, mergeRegister } from "@lexical/utils";

import { HR } from "@/components/editor/transformers/horizontal-rule-transformer";
import { TABLE } from "@/components/editor/transformers/table-transformer";

/**
 * What a chat composer hands back when the user submits: the message as
 * markdown (ready for an AI SDK or a chat API), the plain text, and the raw
 * editor state for consumers that want to keep the exact Lexical document.
 */
export interface ChatInputValue {
  markdown: string;
  text: string;
  editorState: SerializedEditorState;
}

export interface ChatInputConfig {
  /** Submit on Enter and insert a line break on Shift+Enter. */
  submitOnEnter: boolean;
  /** Convert markdown syntax (`**bold**`, `- list`, ...) while typing. */
  markdownShortcuts: boolean;
  /** Transformers used for markdown shortcuts and for `$getChatInputContent`. */
  transformers: Transformer[];
}

/**
 * Markdown the chat composer understands: quotes, bullet and numbered lists,
 * and inline formats. Headings, code blocks, tables, and other block nodes
 * stay out of a chat message on purpose.
 */
export const CHAT_INPUT_TRANSFORMERS: Transformer[] = [
  QUOTE,
  UNORDERED_LIST,
  ORDERED_LIST,
  ...TEXT_FORMAT_TRANSFORMERS,
];

/**
 * Markdown a chat message renders by default: tables, horizontal rules, check
 * lists, and the Lexical defaults (headings, quotes, lists, code, links, and
 * inline formats).
 */
export const CHAT_MESSAGE_TRANSFORMERS: Transformer[] = [
  TABLE,
  HR,
  CHECK_LIST,
  ...TRANSFORMERS,
];

export const SUBMIT_CHAT_INPUT_COMMAND: LexicalCommand<void> = createCommand(
  "SUBMIT_CHAT_INPUT_COMMAND",
);

/**
 * Keeps only the transformers whose node dependencies are registered in the
 * editor so markdown import and shortcuts never reference unknown nodes.
 */
export function filterTransformers(
  editor: LexicalEditor,
  transformers: Transformer[],
): Transformer[] {
  return transformers.filter(
    (transformer) =>
      !("dependencies" in transformer) ||
      editor.hasNodes(transformer.dependencies),
  );
}

export function $isChatInputEmpty(): boolean {
  if ($getRoot().getTextContent().trim() !== "") {
    return false;
  }
  return !$dfs().some(({ node }) => $isDecoratorNode(node));
}

export function $getChatInputContent(
  transformers: Transformer[] = CHAT_INPUT_TRANSFORMERS,
): Pick<ChatInputValue, "markdown" | "text"> {
  return {
    markdown: $convertToMarkdownString(transformers).trim(),
    text: $getRoot().getTextContent().trim(),
  };
}

export function $clearChatInput(): void {
  const root = $getRoot();
  root.clear();
  root.append($createParagraphNode()).select();
}

/**
 * Replaces the document with the rendered markdown. Used by read-only chat
 * messages, so it never leaves a selection behind that could steal focus from
 * the composer while a reply streams in.
 */
export function $setChatMessageContent(
  markdown: string,
  transformers: Transformer[] = TRANSFORMERS,
): void {
  $convertFromMarkdownString(markdown, transformers);
  $setSelection(null);
}

/** Replaces a block with one paragraph per line of its text content. */
function $replaceWithParagraphs(node: LexicalNode): void {
  let target: LexicalNode = node;
  for (const line of node.getTextContent().split("\n")) {
    const paragraph = $createParagraphNode();
    if (line !== "") {
      paragraph.append($createTextNode(line));
    }
    target.insertAfter(paragraph);
    target = paragraph;
  }
  node.remove();
}

/**
 * Registers a transform that keeps `klass` out of the composer, but only when
 * the editor knows that node, so the composer can share an extension with the
 * message renderer without failing on nodes it does not have.
 */
function registerBlockFlattening(
  editor: LexicalEditor,
  klass: Klass<LexicalNode>,
  $flatten: (node: LexicalNode) => void,
): () => void {
  return editor.hasNode(klass)
    ? editor.registerNodeTransform(klass, $flatten)
    : () => {};
}

/**
 * True while a typeahead menu (mentions, emoji, slash commands) has an active
 * option, in which case Enter belongs to the menu instead of the submit
 * action. Lexical's typeahead advertises the active option on the editor root
 * through `aria-activedescendant`.
 */
function hasActiveTypeaheadOption(editor: LexicalEditor): boolean {
  return (
    editor
      .getRootElement()
      ?.getAttribute("aria-activedescendant")
      ?.startsWith("typeahead-item-") ?? false
  );
}

export const ChatInputExtension = defineExtension({
  name: "@shadcn-editor/editor/ChatInput",
  config: safeCast<ChatInputConfig>({
    markdownShortcuts: true,
    submitOnEnter: true,
    transformers: CHAT_INPUT_TRANSFORMERS,
  }),
  register(editor, config) {
    return mergeRegister(
      // A chat message is paragraphs, quotes, and lists. Anything richer that
      // arrives through paste or a shared extension is flattened to text.
      registerBlockFlattening(editor, HeadingNode, (node) => {
        node.replace($createParagraphNode(), true);
      }),
      registerBlockFlattening(editor, CodeNode, $replaceWithParagraphs),
      registerBlockFlattening(editor, TableNode, $replaceWithParagraphs),
      registerBlockFlattening(editor, HorizontalRuleNode, (node) => {
        node.remove();
      }),
      config.submitOnEnter
        ? editor.registerCommand(
            KEY_ENTER_COMMAND,
            (event) => {
              if (
                event === null ||
                event.shiftKey ||
                event.isComposing ||
                !editor.isEditable()
              ) {
                return false;
              }
              if (hasActiveTypeaheadOption(editor)) {
                // The typeahead normally consumes Enter before this handler
                // runs. It marks the active option a commit before it wires
                // up that handler, so in that window swallow the key rather
                // than let rich text insert a paragraph under the menu.
                event.preventDefault();
                return true;
              }
              if (
                !editor.dispatchCommand(SUBMIT_CHAT_INPUT_COMMAND, undefined)
              ) {
                return false;
              }
              event.preventDefault();
              return true;
            },
            COMMAND_PRIORITY_BEFORE_EDITOR,
          )
        : () => {},
      config.markdownShortcuts
        ? registerMarkdownShortcuts(
            editor,
            filterTransformers(editor, config.transformers),
          )
        : () => {},
    );
  },
});
