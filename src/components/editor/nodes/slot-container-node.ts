import {
  $create,
  $getDocument,
  type DOMExportOutput,
  ElementNode,
  type LexicalNode,
} from "lexical"

export class SlotContainerNode extends ElementNode {
  $config() {
    return this.config("slot-container", { extends: ElementNode })
  }

  createDOM(): HTMLElement {
    return $getDocument().createElement("div")
  }

  exportDOM(): DOMExportOutput {
    return { element: $getDocument().createDocumentFragment() }
  }

  updateDOM(): false {
    return false
  }

  isShadowRoot(): boolean {
    return true
  }

  collapseAtStart(): true {
    return true
  }
}

export function $createSlotContainerNode(): SlotContainerNode {
  return $create(SlotContainerNode)
}

export function $isSlotContainerNode(
  node: LexicalNode | null | undefined
): node is SlotContainerNode {
  return node instanceof SlotContainerNode
}
