import {
  $createRangeSelection,
  $getRoot,
  createCommand,
  type LexicalCommand,
  type RangeSelection,
} from "lexical";

import {
  $convertSelectionToMarkdownString,
  type Transformer,
  TRANSFORMERS,
} from "@lexical/markdown";

import type { Locale } from "@/components/editor/locales";

export type AiMode = "transform" | "insert";

export type AiCommandId =
  | "improve"
  | "longer"
  | "shorter"
  | "fix"
  | "continue"
  | "summarize"
  | "brainstorm"
  | "custom";

export interface AiContext {
  text: string;
  before: string;
  after: string;
}

export interface AiRequest extends AiContext {
  mode: AiMode;
  command: AiCommandId;
  prompt: string;
}

export interface AiCommandDefinition {
  id: Exclude<AiCommandId, "custom">;
  mode: AiMode;
  labelKey: keyof Locale;
  prompt: string;
}

export const AI_COMMANDS: readonly AiCommandDefinition[] = [
  {
    id: "improve",
    mode: "transform",
    labelKey: "aiImproveWriting",
    prompt:
      "Improve the writing of the following text. Keep its meaning and tone, fix awkward phrasing, and return only the rewritten text.",
  },
  {
    id: "longer",
    mode: "transform",
    labelKey: "aiMakeLonger",
    prompt:
      "Expand the following text with more detail while keeping its meaning and tone. Return only the rewritten text.",
  },
  {
    id: "shorter",
    mode: "transform",
    labelKey: "aiMakeShorter",
    prompt:
      "Shorten the following text while keeping its meaning. Return only the rewritten text.",
  },
  {
    id: "fix",
    mode: "transform",
    labelKey: "aiFixSpelling",
    prompt:
      "Fix spelling and grammar mistakes in the following text without changing its meaning. Return only the corrected text.",
  },
  {
    id: "continue",
    mode: "insert",
    labelKey: "aiContinueWriting",
    prompt:
      "Continue writing from where the following document ends, matching its tone and style. Return only the new text.",
  },
  {
    id: "summarize",
    mode: "insert",
    labelKey: "aiSummarize",
    prompt:
      "Summarize the following document in a few sentences. Return only the summary.",
  },
  {
    id: "brainstorm",
    mode: "insert",
    labelKey: "aiBrainstorm",
    prompt:
      "Brainstorm a short list of ideas related to the following document. Return only the list, one idea per line.",
  },
];

export const OPEN_AI_EDITOR_COMMAND: LexicalCommand<void> = createCommand(
  "OPEN_AI_EDITOR_COMMAND",
);

export function $getAiContext(
  selection: RangeSelection,
  transformers: Transformer[] = TRANSFORMERS,
): AiContext {
  const root = $getRoot();
  const [start, end] = selection.isBackward()
    ? [selection.focus, selection.anchor]
    : [selection.anchor, selection.focus];

  const before = $createRangeSelection();
  before.anchor.set(root.getKey(), 0, "element");
  before.focus.set(start.key, start.offset, start.type);

  const after = $createRangeSelection();
  after.anchor.set(end.key, end.offset, end.type);
  after.focus.set(root.getKey(), root.getChildrenSize(), "element");

  return {
    text: selection.isCollapsed()
      ? ""
      : $convertSelectionToMarkdownString(transformers, selection),
    before: $convertSelectionToMarkdownString(transformers, before),
    after: $convertSelectionToMarkdownString(transformers, after),
  };
}

export function toAiPrompt({ prompt, text, before, after }: AiRequest): string {
  const sections = [prompt];
  if (text !== "") {
    sections.push(`Selected text (markdown):\n${text}`);
  }
  if (before !== "") {
    sections.push(`Document before (markdown):\n${before}`);
  }
  if (after !== "") {
    sections.push(`Document after (markdown):\n${after}`);
  }
  sections.push("Respond in markdown.");
  return sections.join("\n\n");
}
