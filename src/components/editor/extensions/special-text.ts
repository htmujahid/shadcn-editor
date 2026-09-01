import { defineExtension, TextNode } from "lexical";

import {
  $createSpecialTextNode,
  SpecialTextNode,
} from "@/components/editor/nodes/special-text-node";

const BRACKETED_TEXT_REGEX = /\[([^[\]]+)\]/;

function $findAndTransformText(node: TextNode): TextNode | null {
  const match = BRACKETED_TEXT_REGEX.exec(node.getTextContent());
  if (match === null) {
    return null;
  }

  const targetNode =
    match.index === 0
      ? node.splitText(match.index + match[0].length)[0]
      : node.splitText(match.index, match.index + match[0].length)[1];

  const specialTextNode = $createSpecialTextNode(match[1]);
  targetNode.replace(specialTextNode);
  return specialTextNode;
}

function $specialTextNodeTransform(node: TextNode): void {
  let targetNode: TextNode | null = node;

  while (targetNode !== null) {
    if (!targetNode.isSimpleText()) {
      return;
    }

    targetNode = $findAndTransformText(targetNode);
  }
}

export const SpecialTextExtension = defineExtension({
  name: "@shadcn-editor/editor/SpecialText",
  nodes: () => [SpecialTextNode],
  register: (editor) =>
    editor.registerNodeTransform(TextNode, $specialTextNodeTransform),
});
