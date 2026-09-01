import {
  COMMAND_PRIORITY_EDITOR,
  configExtension,
  createCommand,
  defineExtension,
  type LexicalCommand,
} from "lexical";

import { defineImportRule, DOMImportExtension, sel } from "@lexical/html";
import { $insertNodeToNearestRoot } from "@lexical/utils";

import {
  $createFigmaNode,
  FigmaNode,
} from "@/components/editor/nodes/figma-node";

export const INSERT_FIGMA_COMMAND: LexicalCommand<string> = createCommand(
  "INSERT_FIGMA_COMMAND",
);

const FigmaImportRule = defineImportRule({
  $import: (ctx) => [$createFigmaNode(ctx.captures.id[0])],
  match: sel
    .tag("iframe")
    .attr("data-lexical-figma", /^.+$/, { capture: "id" }),
  name: "@shadcn-editor/editor/figma",
});

export const FigmaExtension = defineExtension({
  name: "@shadcn-editor/editor/Figma",
  dependencies: [
    configExtension(DOMImportExtension, {
      rules: [FigmaImportRule],
    }),
  ],
  nodes: () => [FigmaNode],
  register: (editor) =>
    editor.registerCommand(
      INSERT_FIGMA_COMMAND,
      (documentID) => {
        const figmaNode = $createFigmaNode(documentID);
        $insertNodeToNearestRoot(figmaNode);
        return true;
      },
      COMMAND_PRIORITY_EDITOR,
    ),
});
