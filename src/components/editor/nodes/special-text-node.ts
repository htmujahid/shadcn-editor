import {
  $applyNodeReplacement,
  $getDocument,
  addClassNamesToElement,
  type EditorConfig,
  type LexicalNode,
  TextNode,
} from "lexical"

export class SpecialTextNode extends TextNode {
  $config() {
    return this.config("specialText", { extends: TextNode })
  }

  createDOM(config: EditorConfig): HTMLElement {
    const dom = $getDocument().createElement("span")
    addClassNamesToElement(dom, config.theme.specialText)
    dom.textContent = this.getTextContent()
    return dom
  }

  updateDOM(prevNode: this, dom: HTMLElement, config: EditorConfig): boolean {
    if (prevNode.__text !== this.__text) {
      dom.textContent = this.getTextContent()
    }
    addClassNamesToElement(dom, config.theme.specialText)
    return false
  }

  isTextEntity(): true {
    return true
  }

  canInsertTextAfter(): boolean {
    return false
  }
}

export function $createSpecialTextNode(text = ""): SpecialTextNode {
  return $applyNodeReplacement(new SpecialTextNode(text))
}

export function $isSpecialTextNode(
  node: LexicalNode | null | undefined
): node is SpecialTextNode {
  return node instanceof SpecialTextNode
}
