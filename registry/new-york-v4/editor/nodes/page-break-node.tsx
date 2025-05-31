/**
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */
import { useCallback, useEffect } from "react"
import { useLexicalComposerContext } from "@lexical/react/LexicalComposerContext"
import { useLexicalNodeSelection } from "@lexical/react/useLexicalNodeSelection"
import { mergeRegister } from "@lexical/utils"
import {
  $getSelection,
  $isNodeSelection,
  CLICK_COMMAND,
  COMMAND_PRIORITY_HIGH,
  COMMAND_PRIORITY_LOW,
  DecoratorNode,
  DOMConversionMap,
  DOMConversionOutput,
  KEY_BACKSPACE_COMMAND,
  KEY_DELETE_COMMAND,
  LexicalNode,
  NodeKey,
  SerializedLexicalNode,
} from "lexical"

export type SerializedPageBreakNode = SerializedLexicalNode

function PageBreakComponent({ nodeKey }: { nodeKey: NodeKey }) {
  const [editor] = useLexicalComposerContext()
  const [isSelected, setSelected, clearSelection] =
    useLexicalNodeSelection(nodeKey)

  const $onDelete = useCallback(
    (event: KeyboardEvent) => {
      event.preventDefault()
      const deleteSelection = $getSelection()
      if (isSelected && $isNodeSelection(deleteSelection)) {
        editor.update(() => {
          deleteSelection.getNodes().forEach((node) => {
            if ($isPageBreakNode(node)) {
              node.remove()
            }
          })
        })
      }
      return false
    },
    [editor, isSelected]
  )

  useEffect(() => {
    return mergeRegister(
      editor.registerCommand(
        CLICK_COMMAND,
        (event: MouseEvent) => {
          const pbElem = editor.getElementByKey(nodeKey)

          if (event.target === pbElem) {
            if (!event.shiftKey) {
              clearSelection()
            }
            setSelected(!isSelected)
            return true
          }

          return false
        },
        COMMAND_PRIORITY_LOW
      ),
      editor.registerCommand(
        KEY_DELETE_COMMAND,
        $onDelete,
        COMMAND_PRIORITY_LOW
      ),
      editor.registerCommand(
        KEY_BACKSPACE_COMMAND,
        $onDelete,
        COMMAND_PRIORITY_LOW
      )
    )
  }, [clearSelection, editor, isSelected, nodeKey, $onDelete, setSelected])

  useEffect(() => {
    const pbElem = editor.getElementByKey(nodeKey)
    if (pbElem !== null) {
      if (isSelected) {
        pbElem.classList.add("!border-[var(--editor-color-primary,#4766cb)]")
        pbElem.classList.add(
          "!after:text-[var(--editor-color-primary,#4766cb)]"
        )
        pbElem.classList.add("!before:opacity-100")
      } else {
        pbElem.classList.remove("!border-[var(--editor-color-primary,#4766cb)]")
        pbElem.classList.remove(
          "!after:text-[var(--editor-color-primary,#4766cb)]"
        )
        pbElem.classList.remove("!before:opacity-100")
      }
    }
  }, [editor, isSelected, nodeKey])

  return null
}

export class PageBreakNode extends DecoratorNode<JSX.Element> {
  static getType(): string {
    return "page-break"
  }

  static clone(node: PageBreakNode): PageBreakNode {
    return new PageBreakNode(node.__key)
  }

  static importJSON(serializedNode: SerializedPageBreakNode): PageBreakNode {
    return $createPageBreakNode()
  }

  static importDOM(): DOMConversionMap | null {
    return {
      figure: (domNode: HTMLElement) => {
        const tp = domNode.getAttribute("type")
        if (tp !== this.getType()) {
          return null
        }

        return {
          conversion: $convertPageBreakElement,
          priority: COMMAND_PRIORITY_HIGH,
        }
      },
    }
  }

  exportJSON(): SerializedLexicalNode {
    return {
      type: this.getType(),
      version: 1,
    }
  }

  createDOM(): HTMLElement {
    const el = document.createElement("figure")
    el.setAttribute("type", this.getType())
    el.style.pageBreakAfter = "always"
    el.className = `
      relative block w-[calc(100%+56px)] overflow-visible 
      -ml-[28px] mt-7 mb-7
      border-0 border-t border-b border-dashed border-[var(--editor-color-secondary,#eee)]
      bg-[var(--editor-color-secondary,#eee)]
      before:content-[''] 
      before:absolute before:top-1/2 before:-translate-y-1/2
      before:left-10 before:opacity-50
      before:bg-cover before:w-4 before:h-4
      after:content-['PAGE_BREAK']
      after:absolute after:top-1/2 after:left-1/2 
      after:-translate-x-1/2 after:-translate-y-1/2
      after:block after:py-0.5 after:px-1.5
      after:border after:border-solid after:border-[#ccc]
      after:bg-white after:text-xs after:text-black after:font-semibold
    `
    return el
  }

  getTextContent(): string {
    return "\n"
  }

  isInline(): false {
    return false
  }

  updateDOM(): boolean {
    return false
  }

  decorate(): JSX.Element {
    return <PageBreakComponent nodeKey={this.__key} />
  }
}

function $convertPageBreakElement(): DOMConversionOutput {
  return { node: $createPageBreakNode() }
}

export function $createPageBreakNode(): PageBreakNode {
  return new PageBreakNode()
}

export function $isPageBreakNode(
  node: LexicalNode | null | undefined
): node is PageBreakNode {
  return node instanceof PageBreakNode
}
