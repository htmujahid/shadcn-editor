import {
  $createParagraphNode,
  $isRootOrShadowRoot,
  COMMAND_PRIORITY_EDITOR,
  configExtension,
  createCommand,
  defineExtension,
  type LexicalCommand,
} from "lexical"

import {
  CoreImportExtension,
  defineImportRule,
  DOMImportExtension,
  sel,
} from "@lexical/html"
import {
  $insertNodeIntoLeaf,
  $insertNodeToNearestRoot,
  $wrapNodeInElement,
} from "@lexical/utils"

import {
  $createEquationNode,
  decodeEquation,
  EquationNode,
} from "@/components/editor/nodes/equation-node"

export type InsertEquationPayload = {
  equation: string
  inline: boolean
}

export const INSERT_EQUATION_COMMAND: LexicalCommand<InsertEquationPayload> =
  createCommand("INSERT_EQUATION_COMMAND")

function $convertEquationElement(el: HTMLElement) {
  const encoded = el.getAttribute("data-lexical-equation")
  if (!encoded) {
    return null
  }
  const equation = decodeEquation(encoded)
  if (!equation) {
    return null
  }
  const inline = el.getAttribute("data-lexical-inline") === "true"
  return $createEquationNode(equation, inline)
}

const EquationImportRule = defineImportRule({
  $import: (_ctx, el, $next) => {
    const node = $convertEquationElement(el)
    return node ? [node] : $next()
  },
  match: sel.tag("div", "span").attr("data-lexical-equation", true),
  name: "@shadcn-editor/editor/equation",
})

export const EquationExtension = defineExtension({
  name: "@shadcn-editor/editor/Equation",
  nodes: () => [EquationNode],
  dependencies: [
    CoreImportExtension,
    configExtension(DOMImportExtension, {
      rules: [EquationImportRule],
    }),
  ],
  register: (editor) =>
    editor.registerCommand(
      INSERT_EQUATION_COMMAND,
      ({ equation, inline }) => {
        const equationNode = $createEquationNode(equation, inline)
        if (inline) {
          $insertNodeIntoLeaf(equationNode)
          if ($isRootOrShadowRoot(equationNode.getParent())) {
            $wrapNodeInElement(equationNode, $createParagraphNode).selectEnd()
          }
        } else {
          $insertNodeToNearestRoot(equationNode)
        }
        return true
      },
      COMMAND_PRIORITY_EDITOR
    ),
})
