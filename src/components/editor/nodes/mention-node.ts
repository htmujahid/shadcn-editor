import {
  $applyNodeReplacement,
  $getDocument,
  addClassNamesToElement,
  type DOMConversionMap,
  type DOMConversionOutput,
  type DOMExportOutput,
  type EditorConfig,
  type LexicalNode,
  type LexicalUpdateJSON,
  type NodeKey,
  type SerializedTextNode,
  type Spread,
  TextNode,
} from "lexical"

export const MENTION_CLASS_NAME =
  "editor-mention rounded bg-primary/10 px-1 text-primary"

export type SerializedMentionNode = Spread<
  { mentionName: string },
  SerializedTextNode
>

export class MentionNode extends TextNode {
  __mention: string

  constructor(mentionName: string = "", text?: string, key?: NodeKey) {
    super(text ?? mentionName, key)
    this.__mention = mentionName
  }

  $config() {
    return this.config("mention", { extends: TextNode })
  }

  afterCloneFrom(prevNode: this): void {
    super.afterCloneFrom(prevNode)
    this.__mention = prevNode.__mention
  }

  createDOM(config: EditorConfig): HTMLElement {
    const dom = super.createDOM(config)
    addClassNamesToElement(dom, MENTION_CLASS_NAME)
    dom.spellcheck = false
    return dom
  }

  exportDOM(): DOMExportOutput {
    const element = $getDocument().createElement("span")
    element.setAttribute("data-lexical-mention", "true")
    if (this.__text !== this.__mention) {
      element.setAttribute("data-lexical-mention-name", this.__mention)
    }
    element.textContent = this.__text
    return { element }
  }

  static importDOM(): DOMConversionMap | null {
    return {
      span: (domNode: HTMLElement) => {
        if (!domNode.hasAttribute("data-lexical-mention")) {
          return null
        }
        return {
          conversion: $convertMentionElement,
          priority: 1,
        }
      },
    }
  }

  setMention(mentionName: string): this {
    const self = this.getWritable()
    self.__mention = mentionName
    return self
  }

  getMention(): string {
    return this.getLatest().__mention
  }

  updateFromJSON(
    serializedNode: LexicalUpdateJSON<SerializedMentionNode>
  ): this {
    return super
      .updateFromJSON(serializedNode)
      .setMention(serializedNode.mentionName)
  }

  exportJSON(): SerializedMentionNode {
    return {
      ...super.exportJSON(),
      mentionName: this.__mention,
    }
  }

  isTextEntity(): true {
    return true
  }

  canInsertTextBefore(): boolean {
    return false
  }

  canInsertTextAfter(): boolean {
    return false
  }
}

function $convertMentionElement(domNode: HTMLElement): DOMConversionOutput {
  const textContent = domNode.textContent ?? ""
  const mentionName =
    domNode.getAttribute("data-lexical-mention-name") ?? textContent
  return { node: $createMentionNode(mentionName, textContent) }
}

export function $isMentionNode(
  node: LexicalNode | null | undefined
): node is MentionNode {
  return node instanceof MentionNode
}

export function $createMentionNode(
  mentionName: string,
  textContent?: string
): MentionNode {
  const node = new MentionNode(mentionName, textContent)
  node.setMode("segmented").toggleDirectionless()
  return $applyNodeReplacement(node)
}
