import type { JSX } from "react"

import {
  $create,
  $createParagraphNode,
  $createTextNode,
  $getDocument,
  $getSlot,
  $getSlotNames,
  $setSlot,
  addClassNamesToElement,
  DecoratorNode,
  type DOMExportOutput,
  type EditorConfig,
  type LexicalEditor,
  type LexicalNode,
  type NodeKey,
  type SlotChildNode,
} from "lexical"

import { $appendNodeToHTML } from "@lexical/html"
import { useLexicalComposerContext } from "@lexical/react/LexicalComposerContext"
import { useLexicalSlotRef } from "@lexical/react/useLexicalSlotRef"

import { $createSlotContainerNode } from "@/components/editor/nodes/slot-container-node"

function PullQuoteComponent({ nodeKey }: { nodeKey: NodeKey }): JSX.Element {
  const [editor] = useLexicalComposerContext()
  const quoteRef = useLexicalSlotRef<HTMLDivElement>(editor, nodeKey, "quote")
  const attributionRef = useLexicalSlotRef<HTMLDivElement>(
    editor,
    nodeKey,
    "attribution"
  )
  return (
    <div className="flex flex-col gap-2">
      <div
        ref={quoteRef}
        className="text-lg leading-relaxed italic outline-none [&_[data-lexical-slot]]:outline-none"
      />
      <div className="flex items-baseline justify-end gap-1.5 text-sm text-muted-foreground">
        <span className="select-none">-</span>
        <div
          ref={attributionRef}
          className="min-w-0 outline-none [&_[data-lexical-slot]]:outline-none"
        />
      </div>
    </div>
  )
}

export class PullQuoteNode extends DecoratorNode<JSX.Element> {
  $config() {
    return this.config("pullquote", {
      extends: DecoratorNode,
      slots: ["quote", "attribution"],
    })
  }

  createDOM(config: EditorConfig): HTMLElement {
    const dom = $getDocument().createElement("div")
    const className = config.theme.pullQuote
    if (className) {
      addClassNamesToElement(dom, className)
    }
    return dom
  }

  updateDOM(): false {
    return false
  }

  isInline(): false {
    return false
  }

  decorate(): JSX.Element {
    return <PullQuoteComponent nodeKey={this.__key} />
  }

  exportDOM(editor: LexicalEditor): DOMExportOutput {
    const host = $getDocument().createElement("div")
    host.setAttribute("data-lexical-pullquote", "true")
    for (const name of $getSlotNames(this)) {
      const slot = $getSlot(this, name)
      if (slot) {
        const wrapper = $getDocument().createElement("div")
        wrapper.setAttribute("data-lexical-slot", name)
        $appendNodeToHTML(editor, slot, wrapper)
        host.append(wrapper)
      }
    }
    return { element: host }
  }
}

export function $createPullQuoteNode(
  quote?: LexicalNode & SlotChildNode,
  attribution?: LexicalNode & SlotChildNode
): PullQuoteNode {
  const node = $create(PullQuoteNode)
  $setSlot(
    node,
    "quote",
    quote ||
      $createSlotContainerNode().append(
        $createParagraphNode().append(
          $createTextNode(
            "The only way to discover the limits of the possible is to go beyond them into the impossible."
          )
        )
      )
  )
  $setSlot(
    node,
    "attribution",
    attribution ||
      $createParagraphNode().append($createTextNode("Arthur C. Clarke"))
  )
  return node
}

export function $isPullQuoteNode(
  node: LexicalNode | null | undefined
): node is PullQuoteNode {
  return node instanceof PullQuoteNode
}
