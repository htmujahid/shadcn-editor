import {
  $createParagraphNode,
  $getSlot,
  $isParagraphNode,
  $setSlot,
  COMMAND_PRIORITY_EDITOR,
  configExtension,
  createCommand,
  defineExtension,
  type LexicalCommand,
  mergeRegister,
} from "lexical"

import {
  CoreImportExtension,
  defineImportRule,
  DOMImportExtension,
  sel,
} from "@lexical/html"

import {
  $appendInline,
  $insertSlotHostAtRoot,
  $isSlotHostTextEmpty,
  registerSlotHostArrowEscape,
  registerSlotHostBackspace,
} from "@/components/editor/extensions/slot-host"
import {
  $createReviewNode,
  $isReviewNode,
  ReviewNode,
} from "@/components/editor/nodes/review-node"

export const INSERT_REVIEW_COMMAND: LexicalCommand<void> = createCommand(
  "INSERT_REVIEW_COMMAND"
)

const ReviewImportRule = defineImportRule({
  $import: (ctx, el) => {
    const review = $createReviewNode().clear()
    const prevAuthor = $getSlot(review, "author")
    const author = $isParagraphNode(prevAuthor)
      ? prevAuthor.clear()
      : $createParagraphNode()
    $setSlot(review, "author", author)
    const rating = Number(el.getAttribute("data-rating"))
    if (Number.isFinite(rating)) {
      review.setRating(Math.max(0, Math.min(5, Math.round(rating))))
    }
    for (const domChild of Array.from(el.children)) {
      const slotName = domChild.getAttribute("data-lexical-slot")
      if (slotName === "author") {
        $appendInline(author, ctx.$importChildren(domChild))
      } else {
        review.splice(review.getChildrenSize(), 0, ctx.$importOne(domChild))
      }
    }
    return [review]
  },
  match: sel.tag("div").attr("data-lexical-review", true),
  name: "@shadcn-editor/editor/review",
})

export const ReviewExtension = defineExtension({
  name: "@shadcn-editor/editor/Review",
  nodes: () => [ReviewNode],
  dependencies: [
    CoreImportExtension,
    configExtension(DOMImportExtension, {
      rules: [ReviewImportRule],
    }),
  ],
  register: (editor) =>
    mergeRegister(
      editor.registerCommand(
        INSERT_REVIEW_COMMAND,
        () => {
          $insertSlotHostAtRoot($createReviewNode())
          return true
        },
        COMMAND_PRIORITY_EDITOR
      ),
      registerSlotHostArrowEscape(editor, $isReviewNode),
      registerSlotHostBackspace(editor, $isReviewNode, $isSlotHostTextEmpty)
    ),
})
