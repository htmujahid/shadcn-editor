import * as React from "react"
import { type JSX, useCallback, useEffect, useRef, useState } from "react"

import {
  $applyNodeReplacement,
  $createParagraphNode,
  $getDocument,
  $getNodeByKey,
  $getSelection,
  $isElementNode,
  $isNodeSelection,
  $isTextNode,
  $setSelection,
  CLICK_COMMAND,
  COMMAND_PRIORITY_HIGH,
  COMMAND_PRIORITY_LOW,
  DecoratorNode,
  type DOMExportOutput,
  getActiveElement,
  KEY_ENTER_COMMAND,
  KEY_ESCAPE_COMMAND,
  type LexicalNode,
  mergeRegister,
  type NodeKey,
  SELECTION_CHANGE_COMMAND,
  type SerializedLexicalNode,
  type Spread,
} from "lexical"

import { useLexicalComposerContext } from "@lexical/react/LexicalComposerContext"
import { LexicalErrorBoundary } from "@lexical/react/LexicalErrorBoundary"
import { useLexicalEditable } from "@lexical/react/useLexicalEditable"
import { useLexicalNodeSelection } from "@lexical/react/useLexicalNodeSelection"

import katex from "katex"
import "katex/dist/katex.min.css"

export type SerializedEquationNode = Spread<
  {
    equation: string
    inline: boolean
  },
  SerializedLexicalNode
>

export function encodeEquation(equation: string): string {
  const bytes = new TextEncoder().encode(equation)
  let binary = ""
  for (let i = 0; i < bytes.length; i++) {
    binary += String.fromCharCode(bytes[i])
  }
  return btoa(binary)
}

export function decodeEquation(encoded: string): string {
  const binary = atob(encoded)
  const bytes = new Uint8Array(binary.length)
  for (let i = 0; i < binary.length; i++) {
    bytes[i] = binary.charCodeAt(i)
  }
  return new TextDecoder().decode(bytes)
}

export class EquationNode extends DecoratorNode<JSX.Element> {
  __equation: string
  __inline: boolean

  $config() {
    return this.config("equation", { extends: DecoratorNode })
  }

  constructor(equation: string = "", inline?: boolean, key?: NodeKey) {
    super(key)
    this.__equation = equation
    this.__inline = inline ?? false
  }

  afterCloneFrom(prevNode: this): void {
    super.afterCloneFrom(prevNode)
    this.__equation = prevNode.__equation
    this.__inline = prevNode.__inline
  }

  static importJSON(serializedNode: SerializedEquationNode): EquationNode {
    return $createEquationNode(
      serializedNode.equation,
      serializedNode.inline
    ).updateFromJSON(serializedNode)
  }

  exportJSON(): SerializedEquationNode {
    return {
      ...super.exportJSON(),
      equation: this.getEquation(),
      inline: this.isInline(),
    }
  }

  createDOM(): HTMLElement {
    const element = $getDocument().createElement(this.__inline ? "span" : "div")
    element.className = "editor-equation"
    element.setAttribute("role", "math")
    element.setAttribute("aria-label", `Equation: ${this.getEquation()}`)
    return element
  }

  exportDOM(): DOMExportOutput {
    const element = $getDocument().createElement(this.__inline ? "span" : "div")
    element.style.direction = "ltr"
    const equation = encodeEquation(this.__equation)
    element.setAttribute("data-lexical-equation", equation)
    element.setAttribute("data-lexical-inline", `${this.__inline}`)
    katex.render(this.__equation, element, {
      displayMode: !this.__inline,
      errorColor: "#cc0000",
      output: "html",
      strict: "warn",
      throwOnError: false,
      trust: false,
    })
    element.setAttribute("role", "math")
    element.setAttribute("aria-label", `Equation: ${this.__equation}`)
    return { element }
  }

  updateDOM(prevNode: this, dom: HTMLElement): boolean {
    if (this.__inline !== prevNode.__inline) {
      return true
    }
    if (this.__equation !== prevNode.__equation) {
      dom.setAttribute("aria-label", `Equation: ${this.getEquation()}`)
    }
    return false
  }

  getTextContent(): string {
    return this.getEquation()
  }

  isInline(): boolean {
    return this.getLatest().__inline
  }

  getEquation(): string {
    return this.getLatest().__equation
  }

  setEquation(equation: string): this {
    const writable = this.getWritable()
    writable.__equation = equation
    return writable
  }

  decorate(): JSX.Element {
    return (
      <EquationComponent
        equation={this.__equation}
        inline={this.__inline}
        nodeKey={this.__key}
      />
    )
  }
}

export function $createEquationNode(
  equation = "",
  inline = false
): EquationNode {
  return $applyNodeReplacement(new EquationNode(equation, inline))
}

export function $isEquationNode(
  node: LexicalNode | null | undefined
): node is EquationNode {
  return node instanceof EquationNode
}

export function KatexRenderer({
  equation,
  inline,
  onDoubleClick,
}: Readonly<{
  equation: string
  inline: boolean
  onDoubleClick?: () => void
}>): JSX.Element {
  const katexElementRef = useRef(null)

  useEffect(() => {
    const katexElement = katexElementRef.current
    if (katexElement !== null) {
      katex.render(equation, katexElement, {
        displayMode: !inline,
        errorColor: "#cc0000",
        output: "html",
        strict: "warn",
        throwOnError: false,
        trust: false,
      })
    }
  }, [equation, inline])

  return (
    <>
      <img
        src="data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7"
        width="0"
        height="0"
        alt=""
      />
      <span onDoubleClick={onDoubleClick} ref={katexElementRef} />
      <img
        src="data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7"
        width="0"
        height="0"
        alt=""
      />
    </>
  )
}

function EquationEditor({
  equation,
  inline,
  setEquation,
  onDeleteEmpty,
  ref,
}: {
  equation: string
  inline: boolean
  setEquation: (equation: string) => void
  onDeleteEmpty: () => void
  ref: React.Ref<HTMLInputElement | HTMLTextAreaElement>
}): JSX.Element {
  const onChange = (
    event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setEquation(event.target.value)
  }

  const onKeyDown = (
    event: React.KeyboardEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    if (event.key === "Backspace" && equation === "") {
      event.preventDefault()
      onDeleteEmpty()
    }
  }

  return inline ? (
    <span className="inline-flex items-center gap-0.5 rounded-md bg-muted px-1.5 py-0.5 font-mono text-sm">
      <span className="text-muted-foreground select-none">$</span>
      <input
        className="bg-transparent outline-none"
        size={Math.max(equation.length, 4)}
        value={equation}
        onChange={onChange}
        onKeyDown={onKeyDown}
        autoFocus
        ref={ref as React.Ref<HTMLInputElement>}
      />
      <span className="text-muted-foreground select-none">$</span>
    </span>
  ) : (
    <div className="my-1 flex flex-col rounded-md bg-muted px-3 py-2 text-start font-mono text-sm">
      <span className="text-muted-foreground select-none">{"$$"}</span>
      <textarea
        className="resize-none bg-transparent outline-none"
        rows={Math.max(equation.split("\n").length, 1)}
        value={equation}
        onChange={onChange}
        onKeyDown={onKeyDown}
        autoFocus
        ref={ref as React.Ref<HTMLTextAreaElement>}
      />
      <span className="text-muted-foreground select-none">{"$$"}</span>
    </div>
  )
}

function EquationComponent({
  equation,
  inline,
  nodeKey,
}: {
  equation: string
  inline: boolean
  nodeKey: NodeKey
}): JSX.Element {
  const [editor] = useLexicalComposerContext()
  const isEditable = useLexicalEditable()
  const [isSelected, setSelected, clearSelection] =
    useLexicalNodeSelection(nodeKey)
  const [equationValue, setEquationValue] = useState(equation)
  const [showEquationEditor, setShowEquationEditor] = useState(false)
  const inputRef = useRef<HTMLTextAreaElement | HTMLInputElement>(null)

  const onClick = useCallback(
    (event: MouseEvent) => {
      const dom = editor.getElementByKey(nodeKey)
      if (dom === null || !dom.contains(event.target as Node)) {
        return false
      }
      if (event.shiftKey) {
        setSelected(!isSelected)
      } else {
        clearSelection()
        setSelected(true)
      }
      return true
    },
    [clearSelection, editor, isSelected, nodeKey, setSelected]
  )

  useEffect(() => {
    return editor.registerCommand(CLICK_COMMAND, onClick, COMMAND_PRIORITY_LOW)
  }, [editor, onClick])

  const $onEnter = useCallback(
    (event: null | KeyboardEvent) => {
      const latestSelection = $getSelection()
      if (!(
        $isNodeSelection(latestSelection) &&
        latestSelection.has(nodeKey) &&
        latestSelection.getNodes().length === 1
      )) {
        return false
      }
      const node = $getNodeByKey(nodeKey)
      if (!$isEquationNode(node)) {
        return false
      }
      if (node.isInline()) {
        const parent = node.getParent()
        if (!$isElementNode(parent)) {
          return false
        }
        const paragraph = $createParagraphNode()
        parent.insertAfter(paragraph)
        paragraph.select()
      } else {
        const paragraph = $createParagraphNode()
        node.insertAfter(paragraph)
        paragraph.select()
      }
      event?.preventDefault()
      return true
    },
    [nodeKey]
  )

  useEffect(() => {
    if (!isEditable) {
      return undefined
    }
    return editor.registerCommand(
      KEY_ENTER_COMMAND,
      $onEnter,
      COMMAND_PRIORITY_LOW
    )
  }, [editor, isEditable, $onEnter])

  const onDeleteEmpty = useCallback(() => {
    editor.update(() => {
      const node = $getNodeByKey(nodeKey)
      if (!$isEquationNode(node)) {
        return
      }
      if (node.isInline()) {
        $setSelection(null)
        node.remove(true)
        return
      }
      const prevSibling = node.getPreviousSibling()
      if ($isElementNode(prevSibling) || $isTextNode(prevSibling)) {
        node.remove()
        prevSibling.selectEnd()
        return
      }
      const paragraph = $createParagraphNode()
      node.replace(paragraph)
      paragraph.select()
    })
  }, [editor, nodeKey])

  useEffect(() => {
    const dom = editor.getElementByKey(nodeKey)
    if (dom === null) {
      return
    }
    if (isSelected && isEditable) {
      dom.classList.add("focused")
    } else {
      dom.classList.remove("focused")
    }
  }, [editor, nodeKey, isSelected, isEditable])

  const onHide = useCallback(
    (restoreSelection?: boolean) => {
      setShowEquationEditor(false)
      editor.update(() => {
        const node = $getNodeByKey(nodeKey)
        if ($isEquationNode(node)) {
          node.setEquation(equationValue)
          if (restoreSelection) {
            node.selectNext(0, 0)
          }
        }
      })
    },
    [editor, equationValue, nodeKey]
  )

  useEffect(() => {
    if (!showEquationEditor && equationValue !== equation) {
      setEquationValue(equation)
    }
  }, [showEquationEditor, equation, equationValue])

  useEffect(() => {
    if (!isEditable) {
      return
    }
    if (showEquationEditor) {
      return mergeRegister(
        editor.registerCommand(
          SELECTION_CHANGE_COMMAND,
          () => {
            const inputElem = inputRef.current
            const activeElement = inputElem ? getActiveElement(inputElem) : null
            if (inputElem !== activeElement) {
              onHide()
            }
            return false
          },
          COMMAND_PRIORITY_HIGH
        ),
        editor.registerCommand(
          KEY_ESCAPE_COMMAND,
          () => {
            const inputElem = inputRef.current
            const activeElement = inputElem ? getActiveElement(inputElem) : null
            if (inputElem === activeElement) {
              onHide(true)
              return true
            }
            return false
          },
          COMMAND_PRIORITY_HIGH
        )
      )
    }
    return undefined
  }, [editor, nodeKey, onHide, showEquationEditor, isEditable])

  return (
    <>
      {showEquationEditor && isEditable ? (
        <EquationEditor
          equation={equationValue}
          setEquation={setEquationValue}
          inline={inline}
          onDeleteEmpty={onDeleteEmpty}
          ref={inputRef}
        />
      ) : (
        <LexicalErrorBoundary
          onError={(e) => editor._onError(e)}
          fallback={null}
        >
          <KatexRenderer
            equation={equationValue}
            inline={inline}
            onDoubleClick={() => {
              if (isEditable) {
                setShowEquationEditor(true)
              }
            }}
          />
        </LexicalErrorBoundary>
      )}
    </>
  )
}
