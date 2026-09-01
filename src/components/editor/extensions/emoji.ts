import {
  $getSelection,
  $isRangeSelection,
  COMMAND_PRIORITY_EDITOR,
  createCommand,
  defineExtension,
  type LexicalCommand,
  TextNode,
} from "lexical";

import compactEmojis from "emojibase-data/en/compact.json";

import {
  $createEmojiNode,
  EMOJI_CLASS_NAME,
  EmojiNode,
} from "@/components/editor/nodes/emoji-node";

export type InsertEmojiPayload = { emoji: string };

export const INSERT_EMOJI_COMMAND: LexicalCommand<InsertEmojiPayload> =
  createCommand("INSERT_EMOJI_COMMAND");

// Two-char emoticons like ":D" or ":/" also appear in ordinary text and URLs
const AMBIGUOUS_EMOTICON = /^:[A-Za-z0-9/\\]$/;

const EMOTICON_TO_EMOJI: Record<string, string> = {};
for (const entry of compactEmojis) {
  if (!entry.emoticon) {
    continue;
  }
  const emoticons = Array.isArray(entry.emoticon)
    ? entry.emoticon
    : [entry.emoticon];
  for (const emoticon of emoticons) {
    if (
      !AMBIGUOUS_EMOTICON.test(emoticon) &&
      !(emoticon in EMOTICON_TO_EMOJI)
    ) {
      EMOTICON_TO_EMOJI[emoticon] = entry.unicode;
    }
  }
}

const EMOTICONS_BY_LENGTH = Object.keys(EMOTICON_TO_EMOJI).sort(
  (a, b) => b.length - a.length,
);
const MAX_EMOTICON_LENGTH =
  EMOTICONS_BY_LENGTH.length > 0 ? EMOTICONS_BY_LENGTH[0].length : 0;

function findEmoticonMatch(
  text: string,
): { start: number; end: number; emoji: string } | null {
  for (let i = 0; i < text.length; i++) {
    const maxLength = Math.min(MAX_EMOTICON_LENGTH, text.length - i);
    for (let length = maxLength; length >= 1; length--) {
      const candidate = text.substring(i, i + length);
      const emoji = EMOTICON_TO_EMOJI[candidate];
      if (emoji) {
        return { start: i, end: i + length, emoji };
      }
    }
  }
  return null;
}

function $emoticonTextNodeTransform(node: TextNode): void {
  if (!node.isSimpleText()) {
    return;
  }

  const text = node.getTextContent();
  const match = findEmoticonMatch(text);
  if (match === null) {
    return;
  }

  const targetNode =
    match.start === 0
      ? node.splitText(match.end)[0]
      : node.splitText(match.start, match.end)[1];

  targetNode.replace($createEmojiNode(EMOJI_CLASS_NAME, match.emoji));
}

export const EmojiExtension = defineExtension({
  name: "@shadcn-editor/editor/Emoji",
  nodes: () => [EmojiNode],
  register: (editor) => {
    const unregisterTransform = editor.registerNodeTransform(
      TextNode,
      $emoticonTextNodeTransform,
    );

    const unregisterInsert = editor.registerCommand(
      INSERT_EMOJI_COMMAND,
      ({ emoji }) => {
        const selection = $getSelection();
        if (!$isRangeSelection(selection)) {
          return false;
        }
        selection.insertNodes([$createEmojiNode(EMOJI_CLASS_NAME, emoji)]);
        return true;
      },
      COMMAND_PRIORITY_EDITOR,
    );

    return () => {
      unregisterTransform();
      unregisterInsert();
    };
  },
});
