import {
  $applyNodeReplacement,
  $getDocument,
  addClassNamesToElement,
  type DOMConversionOutput,
  type DOMExportOutput,
  type EditorConfig,
  ElementNode,
  type LexicalEditor,
  type LexicalNode,
  type LexicalUpdateJSON,
  type NodeKey,
  type SerializedElementNode,
  type Spread,
} from "lexical";

export type SerializedLayoutContainerNode = Spread<
  { templateColumns: string },
  SerializedElementNode
>;

export type SerializedLayoutItemNode = SerializedElementNode;

function $convertLayoutContainerElement(
  domNode: HTMLElement,
): DOMConversionOutput | null {
  const templateColumns = domNode.style.gridTemplateColumns;
  return templateColumns
    ? { node: $createLayoutContainerNode(templateColumns) }
    : null;
}

export class LayoutContainerNode extends ElementNode {
  __templateColumns: string;

  constructor(templateColumns: string, key?: NodeKey) {
    super(key);
    this.__templateColumns = templateColumns;
  }

  $config() {
    return this.config("layout-container", {
      extends: ElementNode,
      importDOM: {
        div: (domNode) =>
          domNode.style.gridTemplateColumns
            ? { conversion: $convertLayoutContainerElement, priority: 1 }
            : null,
      },
    });
  }

  static clone(node: LayoutContainerNode): LayoutContainerNode {
    return new LayoutContainerNode(node.__templateColumns, node.__key);
  }

  static importJSON(
    serializedNode: SerializedLayoutContainerNode,
  ): LayoutContainerNode {
    return $createLayoutContainerNode(serializedNode.templateColumns);
  }

  updateFromJSON(
    serializedNode: LexicalUpdateJSON<SerializedLayoutContainerNode>,
  ): this {
    return super
      .updateFromJSON(serializedNode)
      .setTemplateColumns(serializedNode.templateColumns);
  }

  exportJSON(): SerializedLayoutContainerNode {
    return {
      ...super.exportJSON(),
      templateColumns: this.getTemplateColumns(),
    };
  }

  createDOM(config: EditorConfig): HTMLElement {
    const dom = $getDocument().createElement("div");
    dom.style.gridTemplateColumns = this.__templateColumns;
    const className = config.theme.layoutContainer;
    if (className) {
      addClassNamesToElement(dom, className);
    }
    return dom;
  }

  updateDOM(prevNode: this, dom: HTMLElement): boolean {
    if (prevNode.__templateColumns !== this.__templateColumns) {
      dom.style.gridTemplateColumns = this.__templateColumns;
    }
    return false;
  }

  exportDOM(editor: LexicalEditor): DOMExportOutput {
    const output = super.exportDOM(editor);
    const element = output.element;
    if (element instanceof HTMLElement) {
      element.style.gridTemplateColumns = this.__templateColumns;
    }
    return output;
  }

  getTemplateColumns(): string {
    return this.getLatest().__templateColumns;
  }

  setTemplateColumns(templateColumns: string): this {
    const writable = this.getWritable();
    writable.__templateColumns = templateColumns;
    return writable;
  }

  canBeEmpty(): boolean {
    return false;
  }

  isShadowRoot(): boolean {
    return true;
  }
}

export function $createLayoutContainerNode(
  templateColumns: string,
): LayoutContainerNode {
  return $applyNodeReplacement(new LayoutContainerNode(templateColumns));
}

export function $isLayoutContainerNode(
  node: LexicalNode | null | undefined,
): node is LayoutContainerNode {
  return node instanceof LayoutContainerNode;
}

function $convertLayoutItemElement(): DOMConversionOutput {
  return { node: $createLayoutItemNode() };
}

export class LayoutItemNode extends ElementNode {
  $config() {
    return this.config("layout-item", {
      extends: ElementNode,
      importDOM: {
        div: (domNode) =>
          domNode.hasAttribute("data-lexical-layout-item")
            ? { conversion: $convertLayoutItemElement, priority: 1 }
            : null,
      },
    });
  }

  static clone(node: LayoutItemNode): LayoutItemNode {
    return new LayoutItemNode(node.__key);
  }

  static importJSON(): LayoutItemNode {
    return $createLayoutItemNode();
  }

  exportJSON(): SerializedLayoutItemNode {
    return { ...super.exportJSON() };
  }

  createDOM(config: EditorConfig): HTMLElement {
    const dom = $getDocument().createElement("div");
    dom.setAttribute("data-lexical-layout-item", "true");
    const className = config.theme.layoutItem;
    if (className) {
      addClassNamesToElement(dom, className);
    }
    return dom;
  }

  updateDOM(): boolean {
    return false;
  }

  exportDOM(editor: LexicalEditor): DOMExportOutput {
    const output = super.exportDOM(editor);
    const element = output.element;
    if (element instanceof HTMLElement) {
      element.setAttribute("data-lexical-layout-item", "true");
    }
    return output;
  }

  isShadowRoot(): boolean {
    return true;
  }
}

export function $createLayoutItemNode(): LayoutItemNode {
  return $applyNodeReplacement(new LayoutItemNode());
}

export function $isLayoutItemNode(
  node: LexicalNode | null | undefined,
): node is LayoutItemNode {
  return node instanceof LayoutItemNode;
}
