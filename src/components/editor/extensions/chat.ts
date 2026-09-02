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

export interface ChatInputValue {
  markdown: string;
  text: string;
  editorState: SerializedEditorState;
}

export interface ChatInputConfig {
  submitOnEnter: boolean;
  markdownShortcuts: boolean;
  transformers: Transformer[];
}

export const CHAT_INPUT_TRANSFORMERS: Transformer[] = [
  QUOTE,
  UNORDERED_LIST,
  ORDERED_LIST,
  ...TEXT_FORMAT_TRANSFORMERS,
];

export const CHAT_MESSAGE_TRANSFORMERS: Transformer[] = [
  TABLE,
  HR,
  CHECK_LIST,
  ...TRANSFORMERS,
];

export const SUBMIT_CHAT_INPUT_COMMAND: LexicalCommand<void> = createCommand(
  "SUBMIT_CHAT_INPUT_COMMAND",
);

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

export function $setChatMessageContent(
  markdown: string,
  transformers: Transformer[] = TRANSFORMERS,
): void {
  $convertFromMarkdownString(markdown, transformers);
  $setSelection(null);
}

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

function registerBlockFlattening(
  editor: LexicalEditor,
  klass: Klass<LexicalNode>,
  $flatten: (node: LexicalNode) => void,
): () => void {
  return editor.hasNode(klass)
    ? editor.registerNodeTransform(klass, $flatten)
    : () => {};
}

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
