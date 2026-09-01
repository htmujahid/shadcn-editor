import {
  $create,
  $createParagraphNode,
  $getDocument,
  $getSlot,
  $getSlotNames,
  $setSlot,
  addClassNamesToElement,
  type DOMExportOutput,
  type EditorConfig,
  ElementNode,
  type LexicalEditor,
  type LexicalNode,
} from "lexical"

import { $appendNodeToHTML } from "@lexical/html"

export class CardNode extends ElementNode {
  $config() {
    return this.config("card", { extends: ElementNode, slots: ["title"] })
  }

  createDOM(config: EditorConfig): HTMLElement {
    const dom = $getDocument().createElement("div")
    const className = config.theme.card
    if (className) {
      addClassNamesToElement(dom, className)
    }
    return dom
  }

  updateDOM(): false {
    return false
  }

  isShadowRoot(): true {
    return true
  }

  exportDOM(editor: LexicalEditor): DOMExportOutput {
    const element = $getDocument().createElement("div")
    element.setAttribute("data-lexical-card", "true")
    for (const name of $getSlotNames(this)) {
      const slot = $getSlot(this, name)
      if (slot) {
        const wrapper = $getDocument().createElement("div")
        wrapper.setAttribute("data-lexical-slot", name)
        $appendNodeToHTML(editor, slot, wrapper)
        element.append(wrapper)
      }
    }
    return { element }
  }
}

export function $createCardNode(): CardNode {
  const node = $create(CardNode)
  $setSlot(node, "title", $createParagraphNode())
  node.append($createParagraphNode())
  return node
}

export function $isCardNode(
  node: LexicalNode | null | undefined
): node is CardNode {
  return node instanceof CardNode
}
