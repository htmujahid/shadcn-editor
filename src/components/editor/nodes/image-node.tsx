import { useCallback, useEffect, useRef, useState } from "react"
import type { JSX } from "react"

import {
  $applyNodeReplacement,
  $getDocument,
  $getNodeByKey,
  CLICK_COMMAND,
  COMMAND_PRIORITY_LOW,
  createCommand,
  DecoratorNode,
  type DOMConversionOutput,
  type DOMExportOutput,
  type EditorConfig,
  type LexicalCommand,
  type LexicalNode,
  mergeRegister,
  type NodeKey,
  registerEventListeners,
  type SerializedLexicalNode,
  type Spread,
} from "lexical"

import { useLexicalComposerContext } from "@lexical/react/LexicalComposerContext"
import { useLexicalEditable } from "@lexical/react/useLexicalEditable"
import { useLexicalNodeSelection } from "@lexical/react/useLexicalNodeSelection"

import { ImageOffIcon } from "lucide-react"

import { cn } from "@/lib/utils"

export interface ImagePayload {
  altText: string
  height?: number
  key?: NodeKey
  maxWidth?: number
  src: string
  width?: number
}

export type InsertImagePayload = Readonly<ImagePayload>

export const INSERT_IMAGE_COMMAND: LexicalCommand<InsertImagePayload> =
  createCommand("INSERT_IMAGE_COMMAND")

export type SerializedImageNode = Spread<
  {
    altText: string
    height?: number
    maxWidth: number
    src: string
    width?: number
  },
  SerializedLexicalNode
>

function $convertImageElement(domNode: Node): DOMConversionOutput | null {
  if (!(domNode instanceof HTMLImageElement)) {
    return null
  }
  const { alt, src, width, height } = domNode
  if (!src || src.startsWith("file:///")) {
    return null
  }
  return {
    node: $createImageNode({
      altText: alt,
      height: height || undefined,
      src,
      width: width || undefined,
    }),
  }
}

export class ImageNode extends DecoratorNode<JSX.Element> {
  __src: string
  __altText: string
  __width: "inherit" | number
  __height: "inherit" | number
  __maxWidth: number

  $config() {
    return this.config("image", {
      extends: DecoratorNode,
      importDOM: {
        img: () => ({ conversion: $convertImageElement, priority: 0 }),
      },
    })
  }

  static clone(node: ImageNode): ImageNode {
    return new ImageNode(
      node.__src,
      node.__altText,
      node.__maxWidth,
      node.__width,
      node.__height,
      node.__key
    )
  }

  static importJSON(serializedNode: SerializedImageNode): ImageNode {
    const { altText, height, maxWidth, src, width } = serializedNode
    return $createImageNode({ altText, height, maxWidth, src, width })
  }

  exportJSON(): SerializedImageNode {
    return {
      ...super.exportJSON(),
      altText: this.getAltText(),
      height: this.__height === "inherit" ? undefined : this.__height,
      maxWidth: this.__maxWidth,
      src: this.getSrc(),
      width: this.__width === "inherit" ? undefined : this.__width,
    }
  }

  exportDOM(): DOMExportOutput {
    const element = $getDocument().createElement("img")
    element.setAttribute("src", this.__src)
    element.setAttribute("alt", this.__altText)
    if (this.__width !== "inherit") {
      element.setAttribute("width", String(this.__width))
    }
    if (this.__height !== "inherit") {
      element.setAttribute("height", String(this.__height))
    }
    return { element }
  }

  constructor(
    src: string,
    altText: string,
    maxWidth: number,
    width?: "inherit" | number,
    height?: "inherit" | number,
    key?: NodeKey
  ) {
    super(key)
    this.__src = src
    this.__altText = altText
    this.__maxWidth = maxWidth
    this.__width = width || "inherit"
    this.__height = height || "inherit"
  }

  createDOM(config: EditorConfig): HTMLElement {
    const span = $getDocument().createElement("span")
    const className = config.theme.image
    if (className !== undefined) {
      span.className = className
    }
    return span
  }

  updateDOM(): false {
    return false
  }

  getSrc(): string {
    return this.getLatest().__src
  }

  getAltText(): string {
    return this.getLatest().__altText
  }

  setWidthAndHeight(
    width: "inherit" | number,
    height: "inherit" | number
  ): this {
    const writable = this.getWritable()
    writable.__width = width
    writable.__height = height
    return writable
  }

  decorate(): JSX.Element {
    return (
      <ImageComponent
        src={this.__src}
        altText={this.__altText}
        width={this.__width}
        height={this.__height}
        maxWidth={this.__maxWidth}
        nodeKey={this.getKey()}
      />
    )
  }
}

export function $createImageNode({
  altText,
  height,
  maxWidth = 500,
  src,
  width,
  key,
}: ImagePayload): ImageNode {
  return $applyNodeReplacement(
    new ImageNode(src, altText, maxWidth, width, height, key)
  )
}

export function $isImageNode(
  node: LexicalNode | null | undefined
): node is ImageNode {
  return node instanceof ImageNode
}

const MIN_WIDTH = 100

function clamp(value: number, min: number, max: number) {
  return Math.min(Math.max(value, min), max)
}

function ImageComponent({
  src,
  altText,
  nodeKey,
  width,
  height,
  maxWidth,
}: {
  altText: string
  height: "inherit" | number
  maxWidth: number
  nodeKey: NodeKey
  src: string
  width: "inherit" | number
}) {
  const imageRef = useRef<HTMLImageElement | null>(null)
  const [isSelected, setSelected, clearSelection] =
    useLexicalNodeSelection(nodeKey)
  const [editor] = useLexicalComposerContext()
  const isEditable = useLexicalEditable()
  const [isLoadError, setIsLoadError] = useState(false)
  const [isResizing, setIsResizing] = useState(false)

  const onClick = useCallback(
    (event: MouseEvent) => {
      if (isResizing) {
        return true
      }
      if (event.target === imageRef.current) {
        if (event.shiftKey) {
          setSelected(!isSelected)
        } else {
          clearSelection()
          setSelected(true)
        }
        return true
      }
      return false
    },
    [clearSelection, isResizing, isSelected, setSelected]
  )

  useEffect(
    () =>
      mergeRegister(
        editor.registerCommand(CLICK_COMMAND, onClick, COMMAND_PRIORITY_LOW)
      ),
    [editor, onClick]
  )

  const onResizePointerDown = (event: React.PointerEvent<HTMLSpanElement>) => {
    const image = imageRef.current
    if (!isEditable || !image) {
      return
    }
    event.preventDefault()
    event.stopPropagation()

    const rect = image.getBoundingClientRect()
    const isRTL = getComputedStyle(image).direction === "rtl"
    const startX = event.clientX
    const startWidth = rect.width
    const ratio = rect.width / rect.height
    setIsResizing(true)

    let cleanup = () => {}

    const handlePointerMove = (moveEvent: PointerEvent) => {
      const nextWidth = clamp(
        startWidth +
          (isRTL ? startX - moveEvent.clientX : moveEvent.clientX - startX),
        MIN_WIDTH,
        maxWidth
      )
      image.style.width = `${nextWidth}px`
      image.style.height = `${Math.round(nextWidth / ratio)}px`
    }

    const handlePointerUp = () => {
      cleanup()
      setIsResizing(false)
      const nextWidth = Math.round(image.getBoundingClientRect().width)
      const nextHeight = Math.round(image.getBoundingClientRect().height)
      editor.update(() => {
        const node = $getNodeByKey(nodeKey)
        if ($isImageNode(node)) {
          node.setWidthAndHeight(nextWidth, nextHeight)
        }
      })
    }

    cleanup = registerEventListeners(document, {
      pointermove: handlePointerMove,
      pointerup: handlePointerUp,
    })
  }

  const isFocused = isSelected && isEditable

  return (
    <span
      className={cn(
        "group/image relative inline-block max-w-full align-top leading-none",
        isFocused && "rounded-sm outline-2 outline-offset-2 outline-primary"
      )}
    >
      {isLoadError ? (
        <span className="flex aspect-video w-full max-w-sm flex-col items-center justify-center gap-2 rounded-md border border-dashed bg-muted text-muted-foreground">
          <ImageOffIcon className="size-6" />
          <span className="text-xs">{altText || "Image failed to load"}</span>
        </span>
      ) : (
        <img
          ref={imageRef}
          src={src}
          alt={altText}
          draggable={false}
          onError={() => setIsLoadError(true)}
          style={{
            width: width === "inherit" ? undefined : width,
            height: height === "inherit" ? undefined : height,
            maxWidth,
          }}
          className="block h-auto max-w-full rounded-md select-none"
        />
      )}
      {isFocused && !isLoadError && (
        <span
          role="presentation"
          onPointerDown={onResizePointerDown}
          className="absolute -end-1.5 -bottom-1.5 size-3.5 cursor-nwse-resize rounded-full border-2 border-background bg-primary opacity-0 transition-opacity group-hover/image:opacity-100 rtl:cursor-nesw-resize"
        />
      )}
    </span>
  )
}
