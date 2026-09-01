import {
  $createParagraphNode,
  $getDocument,
  $getSiblingCaret,
  $isElementNode,
  $rewindSiblingCaret,
  addClassNamesToElement,
  type DOMExportOutput,
  type EditorConfig,
  ElementNode,
  IS_CHROME,
  IS_FIREFOX,
  isHTMLElement,
  type LexicalEditor,
  type LexicalNode,
  type LexicalUpdateJSON,
  type NodeKey,
  type RangeSelection,
  type SerializedElementNode,
  type Spread,
} from "lexical"

export type SerializedCollapsibleContainerNode = Spread<
  { open: boolean },
  SerializedElementNode
>

function setDomHiddenUntilFound(dom: HTMLElement): void {
  ;(dom as { hidden: boolean | string }).hidden = "until-found"
}

function domOnBeforeMatch(dom: HTMLElement, callback: () => void): void {
  dom.onbeforematch = callback
}

export class CollapsibleContainerNode extends ElementNode {
  __open: boolean

  constructor(open: boolean, key?: NodeKey) {
    super(key)
    this.__open = open
  }

  $config() {
    return this.config("collapsible-container", { extends: ElementNode })
  }

  static clone(node: CollapsibleContainerNode): CollapsibleContainerNode {
    return new CollapsibleContainerNode(node.__open, node.__key)
  }

  isShadowRoot(): boolean {
    return true
  }

  collapseAtStart(): boolean {
    const nodesToInsert: LexicalNode[] = []
    for (const child of this.getChildren()) {
      if ($isElementNode(child)) {
        nodesToInsert.push(...child.getChildren())
      }
    }
    const caret = $rewindSiblingCaret($getSiblingCaret(this, "previous"))
    caret.splice(1, nodesToInsert)
    const [firstChild] = nodesToInsert
    if (firstChild) {
      firstChild.selectStart().deleteCharacter(true)
    }
    return true
  }

  createDOM(config: EditorConfig, editor: LexicalEditor): HTMLElement {
    let dom: HTMLElement
    if (IS_CHROME || IS_FIREFOX) {
      dom = $getDocument().createElement("div")
      if (this.__open) {
        dom.setAttribute("open", "")
      }
    } else {
      const detailsDom = $getDocument().createElement("details")
      detailsDom.open = this.__open
      detailsDom.addEventListener("toggle", () => {
        const open = editor.read("latest", () => this.getOpen())
        if (open !== detailsDom.open) {
          editor.update(() => this.toggleOpen())
        }
      })
      dom = detailsDom
    }
    const className = config.theme.collapsibleContainer
    if (className) {
      addClassNamesToElement(dom, className)
    }
    return dom
  }

  updateDOM(prevNode: this, dom: HTMLDetailsElement): boolean {
    const currentOpen = this.__open
    if (prevNode.__open !== currentOpen) {
      if (IS_CHROME || IS_FIREFOX) {
        const contentDom = dom.querySelector(
          ":scope > .editor-collapsible-content"
        )
        if (!isHTMLElement(contentDom)) {
          throw new Error("Expected contentDom to be an HTMLElement")
        }
        if (currentOpen) {
          dom.setAttribute("open", "")
          contentDom.hidden = false
        } else {
          dom.removeAttribute("open")
          setDomHiddenUntilFound(contentDom)
        }
      } else {
        dom.open = this.__open
      }
    }
    return false
  }

  static importJSON(
    serializedNode: SerializedCollapsibleContainerNode
  ): CollapsibleContainerNode {
    return $createCollapsibleContainerNode(serializedNode.open).updateFromJSON(
      serializedNode
    )
  }

  updateFromJSON(
    serializedNode: LexicalUpdateJSON<SerializedCollapsibleContainerNode>
  ): this {
    return super.updateFromJSON(serializedNode).setOpen(serializedNode.open)
  }

  exportJSON(): SerializedCollapsibleContainerNode {
    return {
      ...super.exportJSON(),
      open: this.__open,
    }
  }

  exportDOM(): DOMExportOutput {
    const element = $getDocument().createElement("details")
    if (this.__open) {
      element.setAttribute("open", "")
    }
    return { element }
  }

  setOpen(open: boolean): this {
    const writable = this.getWritable()
    writable.__open = open
    return writable
  }

  getOpen(): boolean {
    return this.getLatest().__open
  }

  toggleOpen(): this {
    return this.setOpen(!this.getOpen())
  }
}

export function $createCollapsibleContainerNode(
  isOpen: boolean
): CollapsibleContainerNode {
  return new CollapsibleContainerNode(isOpen)
}

export function $isCollapsibleContainerNode(
  node: LexicalNode | null | undefined
): node is CollapsibleContainerNode {
  return node instanceof CollapsibleContainerNode
}

export class CollapsibleTitleNode extends ElementNode {
  $config() {
    return this.config("collapsible-title", {
      $transform(node: CollapsibleTitleNode) {
        if (node.isEmpty()) {
          node.remove()
        }
      },
      extends: ElementNode,
    })
  }

  createDOM(config: EditorConfig, editor: LexicalEditor): HTMLElement {
    const dom = $getDocument().createElement("summary")
    const className = config.theme.collapsibleTitle
    if (className) {
      addClassNamesToElement(dom, className)
    }
    if (IS_CHROME || IS_FIREFOX) {
      dom.addEventListener("click", () => {
        editor.update(() => {
          const collapsibleContainer = this.getLatest().getParentOrThrow()
          if (!$isCollapsibleContainerNode(collapsibleContainer)) {
            throw new Error(
              "Expected parent node to be a CollapsibleContainerNode"
            )
          }
          collapsibleContainer.toggleOpen()
        })
      })
    }
    return dom
  }

  updateDOM(): boolean {
    return false
  }

  insertNewAfter(_: RangeSelection, restoreSelection = true): ElementNode {
    const containerNode = this.getParentOrThrow()
    if (!$isCollapsibleContainerNode(containerNode)) {
      throw new Error(
        "CollapsibleTitleNode expects to be child of CollapsibleContainerNode"
      )
    }
    if (containerNode.getOpen()) {
      const contentNode = this.getNextSibling()
      if (!$isCollapsibleContentNode(contentNode)) {
        throw new Error(
          "CollapsibleTitleNode expects to have CollapsibleContentNode sibling"
        )
      }
      const firstChild = contentNode.getFirstChild()
      if ($isElementNode(firstChild)) {
        return firstChild
      } else {
        const paragraph = $createParagraphNode()
        contentNode.append(paragraph)
        return paragraph
      }
    } else {
      const paragraph = $createParagraphNode()
      containerNode.insertAfter(paragraph, restoreSelection)
      return paragraph
    }
  }
}

export function $createCollapsibleTitleNode(): CollapsibleTitleNode {
  return new CollapsibleTitleNode()
}

export function $isCollapsibleTitleNode(
  node: LexicalNode | null | undefined
): node is CollapsibleTitleNode {
  return node instanceof CollapsibleTitleNode
}

export class CollapsibleContentNode extends ElementNode {
  $config() {
    return this.config("collapsible-content", { extends: ElementNode })
  }

  createDOM(config: EditorConfig, editor: LexicalEditor): HTMLElement {
    const dom = $getDocument().createElement("div")
    const className = config.theme.collapsibleContent
    if (className) {
      addClassNamesToElement(dom, className)
    }
    dom.classList.add("editor-collapsible-content")
    if (IS_CHROME || IS_FIREFOX) {
      editor.read("latest", () => {
        const containerNode = this.getParentOrThrow()
        if (!$isCollapsibleContainerNode(containerNode)) {
          throw new Error(
            "Expected parent node to be a CollapsibleContainerNode"
          )
        }
        if (!containerNode.getOpen()) {
          setDomHiddenUntilFound(dom)
        }
      })
      domOnBeforeMatch(dom, () => {
        editor.update(() => {
          const containerNode = this.getParentOrThrow().getLatest()
          if (!$isCollapsibleContainerNode(containerNode)) {
            throw new Error(
              "Expected parent node to be a CollapsibleContainerNode"
            )
          }
          if (!containerNode.getOpen()) {
            containerNode.toggleOpen()
          }
        })
      })
    }
    return dom
  }

  updateDOM(): boolean {
    return false
  }

  exportDOM(): DOMExportOutput {
    const element = $getDocument().createElement("div")
    element.setAttribute("data-lexical-collapsible-content", "true")
    return { element }
  }

  isShadowRoot(): boolean {
    return true
  }
}

export function $createCollapsibleContentNode(): CollapsibleContentNode {
  return new CollapsibleContentNode()
}

export function $isCollapsibleContentNode(
  node: LexicalNode | null | undefined
): node is CollapsibleContentNode {
  return node instanceof CollapsibleContentNode
}
