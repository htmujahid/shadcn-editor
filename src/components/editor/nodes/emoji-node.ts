import {
  $applyNodeReplacement,
  addClassNamesToElement,
  type EditorConfig,
  type LexicalNode,
  type LexicalUpdateJSON,
  type NodeKey,
  removeClassNamesFromElement,
  type SerializedTextNode,
  type Spread,
  TextNode,
} from "lexical"

export const EMOJI_CLASS_NAME = "editor-emoji"

export type SerializedEmojiNode = Spread<
  { className: string },
  SerializedTextNode
>

export class EmojiNode extends TextNode {
  __className: string

  constructor(
    className: string = EMOJI_CLASS_NAME,
    text: string = "",
    key?: NodeKey
  ) {
    super(text, key)
    this.__className = className
  }

  $config() {
    return this.config("emoji", { extends: TextNode })
  }

  afterCloneFrom(prevNode: this): void {
    super.afterCloneFrom(prevNode)
    this.__className = prevNode.__className
  }

  canHaveFormat(): boolean {
    return false
  }

  createDOM(config: EditorConfig): HTMLElement {
    const dom = super.createDOM(config)
    addClassNamesToElement(dom, this.__className)
    return dom
  }

  updateDOM(prevNode: this, dom: HTMLElement, config: EditorConfig): boolean {
    const isUpdated = super.updateDOM(prevNode, dom, config)
    if (prevNode.__className !== this.__className) {
      removeClassNamesFromElement(dom, prevNode.__className)
      addClassNamesToElement(dom, this.__className)
    }
    return isUpdated
  }

  setClassName(className: string): this {
    const self = this.getWritable()
    self.__className = className
    return self
  }

  getClassName(): string {
    return this.getLatest().__className
  }

  updateFromJSON(serializedNode: LexicalUpdateJSON<SerializedEmojiNode>): this {
    return super
      .updateFromJSON(serializedNode)
      .setClassName(serializedNode.className)
  }

  exportJSON(): SerializedEmojiNode {
    return {
      ...super.exportJSON(),
      className: this.__className,
    }
  }
}

export function $isEmojiNode(
  node: LexicalNode | null | undefined
): node is EmojiNode {
  return node instanceof EmojiNode
}

export function $createEmojiNode(
  className: string,
  emojiText: string
): EmojiNode {
  const node = new EmojiNode(className, emojiText).setMode("token")
  return $applyNodeReplacement(node)
}
