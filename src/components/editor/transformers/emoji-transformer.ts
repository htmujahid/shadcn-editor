import type { TextMatchTransformer } from "@lexical/markdown";

import compactEmojis from "emojibase-data/en/compact.json";

import {
  $createEmojiNode,
  $isEmojiNode,
  EMOJI_CLASS_NAME,
  EmojiNode,
} from "@/components/editor/nodes/emoji-node";

const EMOJI_BY_NAME = new Map<string, string>();
for (const entry of compactEmojis) {
  const name = entry.label
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "_")
    .replace(/^_+|_+$/g, "");
  if (name && !EMOJI_BY_NAME.has(name)) {
    EMOJI_BY_NAME.set(name, entry.unicode);
  }
}

export const EMOJI: TextMatchTransformer = {
  dependencies: [EmojiNode],
  export: (node) => ($isEmojiNode(node) ? node.getTextContent() : null),
  importRegExp: /:([a-z0-9_]+):/,
  regExp: /:([a-z0-9_]+):$/,
  replace: (textNode, [, name]) => {
    const emoji = EMOJI_BY_NAME.get(name);
    if (emoji) {
      textNode.replace($createEmojiNode(EMOJI_CLASS_NAME, emoji));
    }
  },
  trigger: ":",
  type: "text-match",
};
