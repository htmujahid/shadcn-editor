import {
  $createParagraphNode,
  $findMatchingParent,
  $getSelection,
  $isRangeSelection,
  COMMAND_PRIORITY_EDITOR,
  COMMAND_PRIORITY_LOW,
  createCommand,
  defineExtension,
  KEY_ARROW_DOWN_COMMAND,
  KEY_ARROW_LEFT_COMMAND,
  KEY_ARROW_RIGHT_COMMAND,
  KEY_ARROW_UP_COMMAND,
  type LexicalCommand,
  mergeRegister,
} from "lexical"

import { $insertNodeToNearestRoot } from "@lexical/utils"

import {
  $createLayoutContainerNode,
  $createLayoutItemNode,
  $isLayoutContainerNode,
  $isLayoutItemNode,
  LayoutContainerNode,
  LayoutItemNode,
} from "@/components/editor/nodes/layout-node"

export const INSERT_LAYOUT_COMMAND: LexicalCommand<string> = createCommand(
  "INSERT_LAYOUT_COMMAND"
)

function getItemsCountFromTemplate(templateColumns: string): number {
  return templateColumns.trim().split(/\s+/).filter(Boolean).length
}

function $onEscape(before: boolean): boolean {
  const selection = $getSelection()
  if (
    $isRangeSelection(selection) &&
    selection.isCollapsed() &&
    selection.anchor.offset === 0
  ) {
    const container = $findMatchingParent(
      selection.anchor.getNode(),
      $isLayoutContainerNode
    )
    if ($isLayoutContainerNode(container)) {
      const parent = container.getParent()
      const child =
        parent && (before ? parent.getFirstChild() : parent.getLastChild())
      const descendant = before
        ? container.getFirstDescendant()?.getKey()
        : container.getLastDescendant()?.getKey()
      if (
        parent !== null &&
        child === container &&
        descendant === selection.anchor.key
      ) {
        if (before) {
          container.insertBefore($createParagraphNode())
        } else {
          container.insertAfter($createParagraphNode())
        }
      }
    }
  }
  return false
}

export const LayoutExtension = defineExtension({
  name: "@shadcn-editor/editor/Layout",
  nodes: () => [LayoutContainerNode, LayoutItemNode],
  register: (editor) => {
    return mergeRegister(
      editor.registerCommand(
        INSERT_LAYOUT_COMMAND,
        (templateColumns) => {
          const container = $createLayoutContainerNode(templateColumns)
          const itemsCount = getItemsCountFromTemplate(templateColumns)
          for (let i = 0; i < itemsCount; i++) {
            container.append(
              $createLayoutItemNode().append($createParagraphNode())
            )
          }
          $insertNodeToNearestRoot(container)
          container.selectStart()
          return true
        },
        COMMAND_PRIORITY_EDITOR
      ),
      editor.registerNodeTransform(LayoutItemNode, (node) => {
        const parent = node.getParent()
        if (!$isLayoutContainerNode(parent)) {
          for (const child of node.getChildren()) {
            node.insertBefore(child)
          }
          node.remove()
        }
      }),
      editor.registerNodeTransform(LayoutContainerNode, (node) => {
        const children = node.getChildren()
        if (!children.every($isLayoutItemNode)) {
          for (const child of children) {
            if (!$isLayoutItemNode(child)) {
              node.insertBefore(child)
            }
          }
          node.remove()
        }
      }),
      editor.registerCommand(
        KEY_ARROW_DOWN_COMMAND,
        () => $onEscape(false),
        COMMAND_PRIORITY_LOW
      ),
      editor.registerCommand(
        KEY_ARROW_RIGHT_COMMAND,
        () => $onEscape(false),
        COMMAND_PRIORITY_LOW
      ),
      editor.registerCommand(
        KEY_ARROW_UP_COMMAND,
        () => $onEscape(true),
        COMMAND_PRIORITY_LOW
      ),
      editor.registerCommand(
        KEY_ARROW_LEFT_COMMAND,
        () => $onEscape(true),
        COMMAND_PRIORITY_LOW
      )
    )
  },
})
