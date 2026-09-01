import {
  $createParagraphNode,
  $findMatchingParent,
  $getSelection,
  $isRangeSelection,
  COMMAND_PRIORITY_LOW,
  configExtension,
  createCommand,
  defineExtension,
  INSERT_PARAGRAPH_COMMAND,
  KEY_ARROW_DOWN_COMMAND,
  KEY_ARROW_LEFT_COMMAND,
  KEY_ARROW_RIGHT_COMMAND,
  KEY_ARROW_UP_COMMAND,
  type LexicalCommand,
  type LexicalNode,
  mergeRegister,
} from "lexical";

import {
  BlockSchema,
  defineImportRule,
  DOMImportExtension,
  sel,
} from "@lexical/html";
import { $insertNodeToNearestRoot } from "@lexical/utils";

import {
  $createCollapsibleContainerNode,
  $createCollapsibleContentNode,
  $createCollapsibleTitleNode,
  $isCollapsibleContainerNode,
  $isCollapsibleContentNode,
  $isCollapsibleTitleNode,
  CollapsibleContainerNode,
  CollapsibleContentNode,
  CollapsibleTitleNode,
} from "@/components/editor/nodes/collapsible-node";

export const INSERT_COLLAPSIBLE_COMMAND: LexicalCommand<void> = createCommand(
  "INSERT_COLLAPSIBLE_COMMAND",
);

const SummaryRule = defineImportRule({
  $import: (ctx, el) => [
    $createCollapsibleTitleNode().splice(0, 0, ctx.$importChildren(el)),
  ],
  match: sel.tag("summary"),
  name: "@shadcn-editor/editor/summary",
});

const CollapsibleContentRule = defineImportRule({
  $import: (ctx, el) => [
    $createCollapsibleContentNode().splice(
      0,
      0,
      ctx.$importChildren(el, { schema: BlockSchema }),
    ),
  ],
  match: sel.tag("div").attr("data-lexical-collapsible-content", true),
  name: "@shadcn-editor/editor/collapsible-content",
});

const DetailsRule = defineImportRule({
  $import: (ctx, el) => {
    let titleNode: CollapsibleTitleNode | null = null;
    const bodyNodes = ctx.$importChildren(el, {
      $onChild: (child) => {
        if (titleNode === null && $isCollapsibleTitleNode(child)) {
          titleNode = child;
          return null;
        }
        return child;
      },
      schema: BlockSchema,
    });
    let contentNode: CollapsibleContentNode | null = null;
    const restBody: LexicalNode[] = [];
    for (const child of bodyNodes) {
      if ($isCollapsibleContentNode(child)) {
        if (contentNode === null) {
          contentNode = child;
        } else {
          for (const grand of child.getChildren()) {
            restBody.push(grand);
          }
        }
      } else {
        restBody.push(child);
      }
    }
    if (titleNode === null) {
      titleNode = $createCollapsibleTitleNode();
    }
    if (contentNode === null) {
      contentNode = $createCollapsibleContentNode();
    }
    for (const node of restBody) {
      contentNode.append(node);
    }
    return [
      $createCollapsibleContainerNode(el.open).append(titleNode, contentNode),
    ];
  },
  match: sel.tag("details"),
  name: "@shadcn-editor/editor/details",
});

function $onEscapeUp(): boolean {
  const selection = $getSelection();
  if (
    $isRangeSelection(selection) &&
    selection.isCollapsed() &&
    selection.anchor.offset === 0
  ) {
    const container = $findMatchingParent(
      selection.anchor.getNode(),
      $isCollapsibleContainerNode,
    );
    if ($isCollapsibleContainerNode(container)) {
      const parent = container.getParent();
      if (
        parent !== null &&
        parent.getFirstChild() === container &&
        selection.anchor.key === container.getFirstDescendant()?.getKey()
      ) {
        container.insertBefore($createParagraphNode());
      }
    }
  }
  return false;
}

function $onEscapeDown(): boolean {
  const selection = $getSelection();
  if ($isRangeSelection(selection) && selection.isCollapsed()) {
    const container = $findMatchingParent(
      selection.anchor.getNode(),
      $isCollapsibleContainerNode,
    );
    if ($isCollapsibleContainerNode(container)) {
      const parent = container.getParent();
      if (parent !== null && parent.getLastChild() === container) {
        const titleParagraph = container.getFirstDescendant();
        const contentParagraph = container.getLastDescendant();
        if (
          (contentParagraph !== null &&
            selection.anchor.key === contentParagraph.getKey() &&
            selection.anchor.offset ===
              contentParagraph.getTextContentSize()) ||
          (titleParagraph !== null &&
            selection.anchor.key === titleParagraph.getKey() &&
            selection.anchor.offset === titleParagraph.getTextContentSize() &&
            !container.getOpen())
        ) {
          container.insertAfter($createParagraphNode());
        }
      }
    }
  }
  return false;
}

export const CollapsibleExtension = defineExtension({
  name: "@shadcn-editor/editor/Collapsible",
  nodes: () => [
    CollapsibleContainerNode,
    CollapsibleTitleNode,
    CollapsibleContentNode,
  ],
  dependencies: [
    configExtension(DOMImportExtension, {
      rules: [DetailsRule, SummaryRule, CollapsibleContentRule],
    }),
  ],
  register: (editor) =>
    mergeRegister(
      editor.registerNodeTransform(CollapsibleContentNode, (node) => {
        const parent = node.getParent();
        if (!$isCollapsibleContainerNode(parent)) {
          const children = node.getChildren();
          for (const child of children) {
            node.insertBefore(child);
          }
          node.remove();
        } else if (node.isEmpty()) {
          node.append($createParagraphNode());
        }
      }),
      editor.registerNodeTransform(CollapsibleTitleNode, (node) => {
        const parent = node.getParent();
        if (!$isCollapsibleContainerNode(parent)) {
          node.replace($createParagraphNode().append(...node.getChildren()));
        }
      }),
      editor.registerNodeTransform(CollapsibleContainerNode, (node) => {
        const children = node.getChildren();
        if (
          children.length !== 2 ||
          !$isCollapsibleTitleNode(children[0]) ||
          !$isCollapsibleContentNode(children[1])
        ) {
          for (const child of children) {
            node.insertBefore(child);
          }
          node.remove();
        }
      }),
      editor.registerCommand(
        KEY_ARROW_DOWN_COMMAND,
        $onEscapeDown,
        COMMAND_PRIORITY_LOW,
      ),
      editor.registerCommand(
        KEY_ARROW_RIGHT_COMMAND,
        $onEscapeDown,
        COMMAND_PRIORITY_LOW,
      ),
      editor.registerCommand(
        KEY_ARROW_UP_COMMAND,
        $onEscapeUp,
        COMMAND_PRIORITY_LOW,
      ),
      editor.registerCommand(
        KEY_ARROW_LEFT_COMMAND,
        $onEscapeUp,
        COMMAND_PRIORITY_LOW,
      ),
      editor.registerCommand(
        INSERT_PARAGRAPH_COMMAND,
        () => {
          const selection = $getSelection();
          if ($isRangeSelection(selection)) {
            const titleNode = $findMatchingParent(
              selection.anchor.getNode(),
              $isCollapsibleTitleNode,
            );
            if ($isCollapsibleTitleNode(titleNode)) {
              const container = titleNode.getParent();
              if (container && $isCollapsibleContainerNode(container)) {
                if (!container.getOpen()) {
                  container.toggleOpen();
                }
                titleNode.getNextSibling()?.selectEnd();
                return true;
              }
            }
          }
          return false;
        },
        COMMAND_PRIORITY_LOW,
      ),
      editor.registerCommand(
        INSERT_COLLAPSIBLE_COMMAND,
        () => {
          const title = $createCollapsibleTitleNode();
          const paragraph = $createParagraphNode();
          $insertNodeToNearestRoot(
            $createCollapsibleContainerNode(true).append(
              title.append(paragraph),
              $createCollapsibleContentNode().append($createParagraphNode()),
            ),
          );
          paragraph.select();
          return true;
        },
        COMMAND_PRIORITY_LOW,
      ),
    ),
});
