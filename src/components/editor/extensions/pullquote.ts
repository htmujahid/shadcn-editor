import {
  $createNodeSelection,
  $createParagraphNode,
  $getSelection,
  $getSlot,
  $isElementNode,
  $isNodeSelection,
  $isRangeSelection,
  $setSelection,
  COMMAND_PRIORITY_BEFORE_EDITOR,
  COMMAND_PRIORITY_EDITOR,
  COMMAND_PRIORITY_LOW,
  configExtension,
  createCommand,
  defineExtension,
  KEY_ENTER_COMMAND,
  KEY_ESCAPE_COMMAND,
  type LexicalCommand,
  mergeRegister,
} from "lexical"

import { NodeSelectionDataSelectedExtension } from "@lexical/extension"
import {
  CoreImportExtension,
  defineImportRule,
  DOMImportExtension,
  sel,
} from "@lexical/html"

import {
  $appendInline,
  $findSlotHost,
  $insertSlotHostAtRoot,
  $isSlotHostTextEmpty,
  registerHostChromeSelection,
  registerSlotHostArrowEscape,
  registerSlotHostBackspace,
} from "@/components/editor/extensions/slot-host"
import {
  $createPullQuoteNode,
  $isPullQuoteNode,
  PullQuoteNode,
} from "@/components/editor/nodes/pullquote-node"
import {
  $createSlotContainerNode,
  SlotContainerNode,
} from "@/components/editor/nodes/slot-container-node"

export const INSERT_PULLQUOTE_COMMAND: LexicalCommand<void> = createCommand(
  "INSERT_PULLQUOTE_COMMAND"
)

function $handlePullQuoteEnter(event: KeyboardEvent | null): boolean {
  const selection = $getSelection()
  if (!$isNodeSelection(selection)) {
    return false
  }
  const nodes = selection.getNodes()
  if (nodes.length !== 1 || !$isPullQuoteNode(nodes[0])) {
    return false
  }
  const quote = $getSlot(nodes[0], "quote")
  if (!$isElementNode(quote)) {
    return false
  }
  event?.preventDefault()
  quote.selectStart()
  return true
}

function $handlePullQuoteEscape(): boolean {
  const selection = $getSelection()
  if (!$isRangeSelection(selection)) {
    return false
  }
  const host = $findSlotHost(selection.anchor.getNode(), $isPullQuoteNode)
  if (host === null) {
    return false
  }
  const nodeSelection = $createNodeSelection()
  nodeSelection.add(host.getKey())
  $setSelection(nodeSelection)
  return true
}

const PullQuoteImportRule = defineImportRule({
  $import: (ctx, el) => {
    const quote = $createSlotContainerNode()
    const attribution = $createParagraphNode()
    const pullquote = $createPullQuoteNode(quote, attribution)
    for (const domChild of Array.from(el.children)) {
      const slotName = domChild.getAttribute("data-lexical-slot")
      if (slotName === "quote") {
        quote.splice(quote.getChildrenSize(), 0, ctx.$importChildren(domChild))
      } else if (slotName === "attribution") {
        $appendInline(attribution, ctx.$importChildren(domChild))
      } else {
        quote.splice(quote.getChildrenSize(), 0, ctx.$importOne(domChild))
      }
    }
    return [pullquote]
  },
  match: sel.tag("div").attr("data-lexical-pullquote", true),
  name: "@shadcn-editor/editor/pullquote",
})

export const PullQuoteExtension = defineExtension({
  name: "@shadcn-editor/editor/PullQuote",
  nodes: () => [PullQuoteNode, SlotContainerNode],
  dependencies: [
    configExtension(NodeSelectionDataSelectedExtension, {
      nodes: [PullQuoteNode],
    }),
    CoreImportExtension,
    configExtension(DOMImportExtension, {
      rules: [PullQuoteImportRule],
    }),
  ],
  register: (editor) => {
    return mergeRegister(
      editor.registerCommand(
        INSERT_PULLQUOTE_COMMAND,
        () => {
          $insertSlotHostAtRoot($createPullQuoteNode())
          return true
        },
        COMMAND_PRIORITY_EDITOR
      ),
      registerHostChromeSelection(editor, $isPullQuoteNode),
      registerSlotHostArrowEscape(editor, $isPullQuoteNode),
      registerSlotHostBackspace(editor, $isPullQuoteNode, $isSlotHostTextEmpty),
      editor.registerCommand(
        KEY_ENTER_COMMAND,
        $handlePullQuoteEnter,
        COMMAND_PRIORITY_BEFORE_EDITOR
      ),
      editor.registerCommand(
        KEY_ESCAPE_COMMAND,
        $handlePullQuoteEscape,
        COMMAND_PRIORITY_LOW
      )
    )
  },
})
