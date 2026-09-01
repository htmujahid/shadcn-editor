import {
  $createNodeSelection,
  $createParagraphNode,
  $getNearestNodeFromDOMNode,
  $getSelection,
  $getSlot,
  $getSlotHost,
  $getSlotNames,
  $isElementNode,
  $isLineBreakNode,
  $isParagraphNode,
  $isRangeSelection,
  $setSelection,
  CLICK_COMMAND,
  COMMAND_PRIORITY_BEFORE_EDITOR,
  COMMAND_PRIORITY_LOW,
  type ElementNode,
  getActiveElement,
  getDOMSelection,
  isHTMLElement,
  isModifierMatch,
  KEY_ARROW_DOWN_COMMAND,
  KEY_ARROW_UP_COMMAND,
  KEY_BACKSPACE_COMMAND,
  KEY_DELETE_COMMAND,
  type LexicalEditor,
  type LexicalNode,
  mergeRegister,
  type RangeSelection,
} from "lexical"

import {
  $insertNodeToNearestRoot,
  $isAtEndOfNode,
  $isAtStartOfNode,
} from "@lexical/utils"

export function $findSlotHost<T extends LexicalNode>(
  start: LexicalNode,
  $isHost: (node: LexicalNode | null | undefined) => node is T
): T | null {
  let cur: LexicalNode | null = start
  while (cur !== null) {
    if ($isHost(cur)) {
      return cur
    }
    const parent: LexicalNode | null = cur.getParent()
    if (parent === null) {
      const host = $getSlotHost(cur)
      return host !== null && $isHost(host) ? host : null
    }
    cur = parent
  }
  return null
}

interface Region {
  startNode: LexicalNode
  endNode: LexicalNode
  isChildren: boolean
}

function isBefore(a: HTMLElement, b: HTMLElement): boolean {
  return (a.compareDocumentPosition(b) & Node.DOCUMENT_POSITION_FOLLOWING) !== 0
}

function $orderedRegions(editor: LexicalEditor, host: LexicalNode): Region[] {
  const regions: Region[] = []
  if ($isElementNode(host)) {
    const first = host.getFirstChild()
    const last = host.getLastChild()
    if (first !== null && last !== null) {
      regions.push({ endNode: last, isChildren: true, startNode: first })
    }
  }
  for (const name of $getSlotNames(host)) {
    const value = $getSlot(host, name)
    if (value !== null) {
      regions.push({ endNode: value, isChildren: false, startNode: value })
    }
  }
  return regions.sort((a, b) => {
    const aDom = editor.getElementByKey(a.startNode.getKey())
    const bDom = editor.getElementByKey(b.startNode.getKey())
    if (aDom === null || bDom === null) {
      return 0
    }
    return isBefore(aDom, bDom) ? -1 : 1
  })
}

function $regionContains(
  region: Region,
  anchorNode: LexicalNode,
  host: LexicalNode
): boolean {
  if (region.isChildren) {
    for (
      let b: LexicalNode | null = anchorNode;
      b !== null;
      b = b.getParent()
    ) {
      if (b.getParent() === host) {
        return true
      }
    }
    return false
  }
  const value = region.startNode
  return (
    value === anchorNode ||
    ($isElementNode(value) && value.isParentOf(anchorNode))
  )
}

function $editingHost(
  editor: LexicalEditor,
  node: LexicalNode
): Element | null {
  const dom = editor.getElementByKey(node.getKey())
  return dom === null ? null : dom.closest('[contenteditable="true"]')
}

function $handleSlotHostArrow<T extends LexicalNode>(
  editor: LexicalEditor,
  $isHost: (node: LexicalNode | null | undefined) => node is T,
  event: KeyboardEvent | null,
  down: boolean
): boolean {
  if (event !== null && !isModifierMatch(event, {})) {
    return false
  }
  const selection = $getSelection()
  if (!$isRangeSelection(selection) || !selection.isCollapsed()) {
    return false
  }
  const anchor = selection.anchor
  const host = $findSlotHost(anchor.getNode(), $isHost)
  if (host === null) {
    return false
  }
  const regions = $orderedRegions(editor, host)
  const index = regions.findIndex((r) =>
    $regionContains(r, anchor.getNode(), host)
  )
  if (index === -1) {
    return false
  }
  const region = regions[index]
  const edgeNode = down ? region.endNode : region.startNode
  if (!$isElementNode(edgeNode)) {
    return false
  }
  if (
    down
      ? !$isAtEndOfNode(anchor, edgeNode)
      : !$isAtStartOfNode(anchor, edgeNode)
  ) {
    return false
  }
  const adjacent = regions[index + (down ? 1 : -1)]
  if (adjacent !== undefined) {
    const from = $editingHost(editor, edgeNode)
    const to = $editingHost(
      editor,
      down ? adjacent.startNode : adjacent.endNode
    )
    if (from === null || to === null || from === to) {
      return false
    }
    if (down) {
      adjacent.startNode.selectStart()
    } else {
      adjacent.endNode.selectEnd()
    }
    if (event) {
      event.preventDefault()
    }
    return true
  }
  if ((down ? host.getNextSibling() : host.getPreviousSibling()) !== null) {
    return false
  }
  const paragraph = $createParagraphNode()
  if (down) {
    host.insertAfter(paragraph)
  } else {
    host.insertBefore(paragraph)
  }
  paragraph.selectEnd()
  if (event) {
    event.preventDefault()
  }
  return true
}

export function registerSlotHostArrowEscape<T extends LexicalNode>(
  editor: LexicalEditor,
  $isHost: (node: LexicalNode | null | undefined) => node is T
): () => void {
  return mergeRegister(
    editor.registerCommand(
      KEY_ARROW_DOWN_COMMAND,
      (event) => $handleSlotHostArrow(editor, $isHost, event, true),
      COMMAND_PRIORITY_LOW
    ),
    editor.registerCommand(
      KEY_ARROW_UP_COMMAND,
      (event) => $handleSlotHostArrow(editor, $isHost, event, false),
      COMMAND_PRIORITY_LOW
    )
  )
}

export function $isSlotHostTextEmpty(host: LexicalNode): boolean {
  if ($isElementNode(host) && host.getTextContentSize() !== 0) {
    return false
  }
  for (const name of $getSlotNames(host)) {
    const value = $getSlot(host, name)
    if ($isElementNode(value) && value.getTextContentSize() !== 0) {
      return false
    }
  }
  return true
}

function $deleteEmptyHost(host: LexicalNode): void {
  const prev = host.getPreviousSibling()
  if ($isElementNode(prev)) {
    host.remove()
    prev.selectEnd()
    return
  }
  const next = host.getNextSibling()
  if ($isElementNode(next)) {
    host.remove()
    next.selectStart()
    return
  }
  host.replace($createParagraphNode()).selectStart()
}

function $reanchorRangeBeforeHost<T extends LexicalNode>(
  selection: RangeSelection,
  $isHost: (node: LexicalNode | null | undefined) => node is T
): void {
  const backward = selection.isBackward()
  const start = backward ? selection.focus : selection.anchor
  const end = backward ? selection.anchor : selection.focus
  const host = $findSlotHost(start.getNode(), $isHost)
  if (host === null || $findSlotHost(end.getNode(), $isHost) === host) {
    return
  }
  const parent = host.getParent()
  if (
    parent !== null &&
    $isElementNode(host) &&
    $isAtStartOfNode(start, host)
  ) {
    start.set(parent.getKey(), host.getIndexWithinParent(), "element")
  }
}

export function registerSlotHostBackspace<T extends LexicalNode>(
  editor: LexicalEditor,
  $isHost: (node: LexicalNode | null | undefined) => node is T,
  $isEmpty: (host: T) => boolean
): () => void {
  return mergeRegister(
    editor.registerCommand(
      KEY_BACKSPACE_COMMAND,
      (event) => {
        const selection = $getSelection()
        if (!$isRangeSelection(selection)) {
          return false
        }
        if (!selection.isCollapsed()) {
          $reanchorRangeBeforeHost(selection, $isHost)
          return false
        }
        const anchor = selection.anchor
        const inner = $findSlotHost(anchor.getNode(), $isHost)
        if (inner === null) {
          return false
        }
        const first = $orderedRegions(editor, inner)[0]
        if (
          first !== undefined &&
          $isElementNode(first.startNode) &&
          $isAtStartOfNode(anchor, first.startNode) &&
          $isEmpty(inner)
        ) {
          $deleteEmptyHost(inner)
          if (event) {
            event.preventDefault()
          }
          return true
        }
        return false
      },
      COMMAND_PRIORITY_BEFORE_EDITOR
    ),
    editor.registerCommand(
      KEY_DELETE_COMMAND,
      () => {
        const selection = $getSelection()
        if ($isRangeSelection(selection) && !selection.isCollapsed()) {
          $reanchorRangeBeforeHost(selection, $isHost)
        }
        return false
      },
      COMMAND_PRIORITY_BEFORE_EDITOR
    )
  )
}

export function registerHostChromeSelection<T extends LexicalNode>(
  editor: LexicalEditor,
  $isHost: (node: LexicalNode | null | undefined) => node is T
): () => void {
  const $resolveChromeTarget = (target: HTMLElement): T | null => {
    const node = $getNearestNodeFromDOMNode(target)
    if (!$isHost(node)) {
      return null
    }
    const hostElement = editor.getElementByKey(node.getKey())
    if (hostElement === null || !hostElement.contains(target)) {
      return null
    }
    const slotWrapper = target.closest("[data-lexical-slot]")
    if (slotWrapper !== null && hostElement.contains(slotWrapper)) {
      return null
    }
    return node
  }

  const onChromeMouseDown = (event: MouseEvent) => {
    if (!editor.isEditable()) {
      return
    }
    const target = event.target
    if (!isHTMLElement(target)) {
      return
    }
    if (editor.read(() => $resolveChromeTarget(target) !== null)) {
      event.preventDefault()
      const root = editor.getRootElement()
      if (root !== null && root !== getActiveElement(root)) {
        root.focus({ preventScroll: true })
        const domSelection = getDOMSelection(root.ownerDocument.defaultView)
        if (domSelection !== null) {
          domSelection.removeAllRanges()
        }
      }
    }
  }

  return mergeRegister(
    editor.registerCommand(
      CLICK_COMMAND,
      (event) => {
        if (!editor.isEditable()) {
          return false
        }
        const target = event.target
        if (!isHTMLElement(target)) {
          return false
        }
        const node = $resolveChromeTarget(target)
        if (node === null) {
          return false
        }
        event.preventDefault()
        const ns = $createNodeSelection()
        ns.add(node.getKey())
        $setSelection(ns)
        return true
      },
      COMMAND_PRIORITY_BEFORE_EDITOR
    ),
    editor.registerRootListener((rootElement, prevRootElement) => {
      if (prevRootElement !== null) {
        prevRootElement.removeEventListener("mousedown", onChromeMouseDown)
      }
      if (rootElement !== null) {
        rootElement.addEventListener("mousedown", onChromeMouseDown)
      }
    })
  )
}

export function $insertSlotHostAtRoot<T extends LexicalNode>(node: T): T {
  $insertNodeToNearestRoot(node)
  const before = node.getPreviousSibling()
  if ($isParagraphNode(before) && before.getTextContentSize() === 0) {
    before.remove()
  }
  return node.getLatest()
}

function $flattenInlines(
  output: LexicalNode[],
  input: Iterable<LexicalNode>
): void {
  for (const node of input) {
    if ($isLineBreakNode(node)) {
      continue
    } else if (node.isInline()) {
      output.push(node)
    } else if ($isElementNode(node)) {
      $flattenInlines(output, node.getChildren())
    }
  }
}

export function $appendInline<T extends ElementNode>(
  line: T,
  nodes: Iterable<LexicalNode>
): T {
  const children: LexicalNode[] = []
  $flattenInlines(children, nodes)
  return line.splice(line.getChildrenSize(), 0, children)
}
