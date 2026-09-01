import {
  $create,
  $createParagraphNode,
  $getDocument,
  $getEditor,
  $getSlot,
  $getState,
  $isElementNode,
  $markSlotEditable,
  $setSlot,
  $setState,
  addClassNamesToElement,
  createState,
  type DOMExportOutput,
  type EditorConfig,
  type ElementDOMSlot,
  ElementNode,
  type LexicalEditor,
  type LexicalNode,
  type NodeStateVersion,
  setDOMUnmanaged,
  type StateConfigValue,
  type StateValueOrUpdater,
} from "lexical";

import { $appendNodeToHTML } from "@lexical/html";

const ratingState = createState("rating", {
  parse: (v): number =>
    typeof v === "number" && v >= 0 && v <= 5 ? Math.round(v) : 0,
});

export class ReviewNode extends ElementNode {
  $config() {
    return this.config("review", {
      extends: ElementNode,
      slots: ["author"],
      stateConfigs: [{ flat: true, stateConfig: ratingState }],
    });
  }

  getRating(version?: NodeStateVersion): StateConfigValue<typeof ratingState> {
    return $getState(this, ratingState, version);
  }

  setRating(valueOrUpdater: StateValueOrUpdater<typeof ratingState>): this {
    return $setState(this, ratingState, valueOrUpdater);
  }

  createDOM(config: EditorConfig, editor: LexicalEditor): HTMLElement {
    const dom = $getDocument().createElement("div");
    const className = config.theme.review;
    if (className) {
      addClassNamesToElement(dom, className);
    }
    dom.contentEditable = "false";
    setDOMUnmanaged(dom);
    const children = $getDocument().createElement("div");
    children.className = "editor-review-children";
    children.style.display = "none";
    $markSlotEditable(children, editor);
    dom.appendChild(children);
    return dom;
  }

  updateDOM(_prevNode: this, dom: HTMLElement): boolean {
    const children = dom.querySelector<HTMLElement>(".editor-review-children");
    if (children !== null) {
      $markSlotEditable(children, $getEditor());
    }
    return false;
  }

  getDOMSlot(element: HTMLElement): ElementDOMSlot<HTMLElement> {
    const childrenEl = element.querySelector<HTMLElement>(
      ".editor-review-children",
    );
    const domSlot = super.getDOMSlot(element);
    return childrenEl !== null ? domSlot.withElement(childrenEl) : domSlot;
  }

  isShadowRoot(): true {
    return true;
  }

  exportDOM(editor: LexicalEditor): DOMExportOutput {
    const element = $getDocument().createElement("div");
    element.setAttribute("data-lexical-review", "true");
    element.setAttribute("data-rating", String(this.getRating()));
    const author = $getSlot(this, "author");
    if ($isElementNode(author)) {
      const wrapper = $getDocument().createElement("div");
      wrapper.setAttribute("data-lexical-slot", "author");
      $appendNodeToHTML(editor, author, wrapper);
      element.append(wrapper);
    }
    return { element };
  }
}

export function $createReviewNode(): ReviewNode {
  const node = $create(ReviewNode);
  $setSlot(node, "author", $createParagraphNode());
  node.append($createParagraphNode());
  return node;
}

export function $isReviewNode(
  node: LexicalNode | null | undefined,
): node is ReviewNode {
  return node instanceof ReviewNode;
}
