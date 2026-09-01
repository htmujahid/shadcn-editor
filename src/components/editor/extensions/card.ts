import {
  $createNodeSelection,
  $createParagraphNode,
  $getAdjacentNode,
  $getSelection,
  $getSlot,
  $getSlotHost,
  $getSlotNameWithinHost,
  $isElementNode,
  $isParagraphNode,
  $isRangeSelection,
  $isTextNode,
  $setSelection,
  $setSlot,
  COMMAND_PRIORITY_BEFORE_EDITOR,
  COMMAND_PRIORITY_EDITOR,
  configExtension,
  createCommand,
  defineExtension,
  isModifierMatch,
  KEY_ARROW_LEFT_COMMAND,
  KEY_ARROW_RIGHT_COMMAND,
  KEY_TAB_COMMAND,
  type LexicalCommand,
  type LexicalNode,
  mergeRegister,
  type NodeKey,
  type PointType,
} from "lexical"

import { NodeSelectionDataSelectedExtension } from "@lexical/extension"
import {
  CoreImportExtension,
  defineImportRule,
  DOMImportExtension,
  domOverride,
  DOMRenderExtension,
  sel,
} from "@lexical/html"

import {
  $appendInline,
  $insertSlotHostAtRoot,
  $isSlotHostTextEmpty,
  registerHostChromeSelection,
  registerSlotHostArrowEscape,
  registerSlotHostBackspace,
} from "@/components/editor/extensions/slot-host"
import {
  $createCardNode,
  $isCardNode,
  CardNode,
} from "@/components/editor/nodes/card-node"

export const INSERT_CARD_COMMAND: LexicalCommand<void> = createCommand(
  "INSERT_CARD_COMMAND"
)

function $handleCardArrow(
  event: KeyboardEvent | null,
  isBackward: boolean
): boolean {
  const selection = $getSelection()
  if (
    !$isRangeSelection(selection) ||
    (event !== null && !isModifierMatch(event, {}))
  ) {
    return false
  }
  const adjacent = $getAdjacentNode(selection.focus, isBackward)
  if (!$isCardNode(adjacent)) {
    return false
  }
  event?.preventDefault()
  const ns = $createNodeSelection()
  ns.add(adjacent.getKey())
  $setSelection(ns)
  return true
}

function $findCardSlotContext(
  start: LexicalNode
):
  | { card: CardNode; in: "title"; slotValue: LexicalNode }
  | { card: CardNode; in: "body" }
  | null {
  let cursor: LexicalNode | null = start
  while (cursor !== null) {
    const slotName = $getSlotNameWithinHost(cursor)
    if (slotName === "title") {
      const host = $getSlotHost(cursor)
      if ($isCardNode(host)) {
        return { card: host, in: "title", slotValue: cursor }
      }
    }
    const parent: LexicalNode | null = cursor.getParent()
    if ($isCardNode(parent)) {
      return { card: parent, in: "body" }
    }
    cursor = parent ?? $getSlotHost(cursor)
  }
  return null
}

function $isAtBlockEnd(point: PointType, block: LexicalNode): boolean {
  if (!$isElementNode(block)) {
    return false
  }
  const last = block.getLastDescendant()
  if (last === null) {
    return point.key === block.getKey() && point.offset === 0
  }
  if ($isTextNode(last)) {
    return (
      point.key === last.getKey() && point.offset === last.getTextContentSize()
    )
  }
  return false
}

function $isAtBlockStart(point: PointType, block: LexicalNode): boolean {
  if (!$isElementNode(block)) {
    return false
  }
  const first = block.getFirstDescendant()
  if (first === null) {
    return point.key === block.getKey() && point.offset === 0
  }
  if ($isTextNode(first)) {
    return point.key === first.getKey() && point.offset === 0
  }
  return false
}

function $handleCardTab(
  event: KeyboardEvent | null,
  isBackward: boolean
): boolean {
  const selection = $getSelection()
  if (!$isRangeSelection(selection) || !selection.isCollapsed()) {
    return false
  }
  const context = $findCardSlotContext(selection.anchor.getNode())
  if (context === null) {
    return false
  }
  if (!isBackward && context.in === "title") {
    const titleBlock = context.slotValue
    if (
      !$isElementNode(titleBlock) ||
      !$isAtBlockEnd(selection.anchor, titleBlock)
    ) {
      return false
    }
    const bodyFirst = context.card.getFirstChild()
    if ($isElementNode(bodyFirst)) {
      event?.preventDefault()
      bodyFirst.selectStart()
      return true
    }
    event?.preventDefault()
    const bodyParagraph = $createParagraphNode()
    if (bodyFirst === null) {
      context.card.append(bodyParagraph)
    } else {
      bodyFirst.insertBefore(bodyParagraph)
    }
    bodyParagraph.select()
    return true
  } else if (isBackward && context.in === "body") {
    const bodyFirst = context.card.getFirstChild()
    if (bodyFirst === null || !$isAtBlockStart(selection.anchor, bodyFirst)) {
      return false
    }
    const titleSlot = $getSlot(context.card, "title")
    if ($isElementNode(titleSlot)) {
      event?.preventDefault()
      titleSlot.selectEnd()
      return true
    }
  }
  return false
}

const CardImportRule = defineImportRule({
  $import: (ctx, el) => {
    const card = $createCardNode().clear()
    const prevTitle = $getSlot(card, "title")
    const title = $isParagraphNode(prevTitle)
      ? prevTitle.clear()
      : $createParagraphNode()
    $setSlot(card, "title", title)
    for (const domChild of Array.from(el.children)) {
      const slotName = domChild.getAttribute("data-lexical-slot")
      if (slotName === "title") {
        $appendInline(title, ctx.$importChildren(domChild))
      } else {
        card.splice(card.getChildrenSize(), 0, ctx.$importOne(domChild))
      }
    }
    return [card]
  },
  match: sel.tag("div").attr("data-lexical-card", true),
  name: "@shadcn-editor/editor/card",
})

export const CardExtension = defineExtension({
  name: "@shadcn-editor/editor/Card",
  nodes: () => [CardNode],
  dependencies: [
    configExtension(NodeSelectionDataSelectedExtension, {
      nodes: [CardNode],
    }),
    configExtension(DOMRenderExtension, {
      overrides: [
        domOverride([CardNode], {
          $getSlotTargetElement: (_node, _slotName, hostDom) => hostDom,
        }),
      ],
    }),
    CoreImportExtension,
    configExtension(DOMImportExtension, {
      rules: [CardImportRule],
    }),
  ],
  register: (editor) => {
    return mergeRegister(
      editor.registerCommand(
        INSERT_CARD_COMMAND,
        () => {
          $insertSlotHostAtRoot($createCardNode())
          return true
        },
        COMMAND_PRIORITY_EDITOR
      ),
      editor.registerCommand(
        KEY_ARROW_RIGHT_COMMAND,
        (event) => $handleCardArrow(event, false),
        COMMAND_PRIORITY_BEFORE_EDITOR
      ),
      editor.registerCommand(
        KEY_ARROW_LEFT_COMMAND,
        (event) => $handleCardArrow(event, true),
        COMMAND_PRIORITY_BEFORE_EDITOR
      ),
      editor.registerCommand(
        KEY_TAB_COMMAND,
        (event) => $handleCardTab(event, event.shiftKey),
        COMMAND_PRIORITY_BEFORE_EDITOR
      ),
      registerHostChromeSelection(editor, $isCardNode),
      registerSlotHostArrowEscape(editor, $isCardNode),
      registerSlotHostBackspace(editor, $isCardNode, $isSlotHostTextEmpty),
      (() => {
        let prevCardKey: NodeKey | null = null
        let prevSlot: "title" | "body" | null = null
        return editor.registerUpdateListener(({ editorState }) => {
          let activeCardKey: NodeKey | null = null
          let activeSlot: "title" | "body" | null = null
          editorState.read(() => {
            const selection = $getSelection()
            if ($isRangeSelection(selection)) {
              const context = $findCardSlotContext(selection.anchor.getNode())
              if (context !== null) {
                activeCardKey = context.card.getKey()
                activeSlot = context.in
              }
            }
          })
          if (prevCardKey === activeCardKey && prevSlot === activeSlot) {
            return
          }
          if (prevCardKey !== null && prevCardKey !== activeCardKey) {
            const dom = editor.getElementByKey(prevCardKey)
            if (dom !== null) {
              dom.removeAttribute("data-current-slot")
            }
          }
          if (activeCardKey !== null && activeSlot !== null) {
            const dom = editor.getElementByKey(activeCardKey)
            if (dom !== null) {
              dom.setAttribute("data-current-slot", activeSlot)
            }
          }
          prevCardKey = activeCardKey
          prevSlot = activeSlot
        })
      })()
    )
  },
})
