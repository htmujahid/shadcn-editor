import { type JSX, type RefCallback, useCallback, useState } from "react";

import { createPortal } from "react-dom";

import {
  $getNodeByKey,
  configExtension,
  defineExtension,
  type LexicalEditor,
  NODE_STATE_DIRECT,
  type NodeKey,
} from "lexical";

import { namedSignals } from "@lexical/extension";
import { ReactExtension } from "@lexical/react/ReactExtension";
import type { DecoratorComponentProps } from "@lexical/react/ReactPluginHostExtension";
import { useExtensionSignalValue } from "@lexical/react/useExtensionSignalValue";
import { useLexicalEditable } from "@lexical/react/useLexicalEditable";
import { useLexicalSlotRef } from "@lexical/react/useLexicalSlotRef";

import { Star } from "lucide-react";

import { ReviewExtension } from "@/components/editor/extensions/review";
import {
  $isReviewNode,
  ReviewNode,
} from "@/components/editor/nodes/review-node";
import { cn } from "@/lib/utils";

const STARS = [1, 2, 3, 4, 5];

function useReviewChildren<T extends HTMLElement = HTMLElement>(
  editor: LexicalEditor,
  nodeKey: NodeKey,
): RefCallback<T | null> {
  return useCallback<RefCallback<T | null>>(
    (target) => {
      const hostDom = editor.getElementByKey(nodeKey);
      if (target === null || hostDom === null) {
        return;
      }
      const childrenEl = hostDom.querySelector<HTMLElement>(
        ".editor-review-children",
      );
      if (childrenEl === null) {
        return;
      }
      if (childrenEl.parentElement !== target) {
        target.appendChild(childrenEl);
      }
      childrenEl.style.display = "";
      return () => {
        childrenEl.style.display = "none";
        if (childrenEl.parentElement !== hostDom) {
          hostDom.appendChild(childrenEl);
        }
      };
    },
    [editor, nodeKey],
  );
}

function ReviewStars({
  editor,
  node,
}: {
  editor: LexicalEditor;
  node: ReviewNode;
}): JSX.Element {
  const rating = node.getRating(NODE_STATE_DIRECT);
  const isEditable = useLexicalEditable();
  const [hover, setHover] = useState(0);
  const setStars = (value: number) =>
    editor.update(() => {
      node.setRating(value === rating ? 0 : value);
    });
  const shown = (isEditable && hover) || rating;
  return (
    <div
      className="flex gap-0.5"
      aria-label={`Rating: ${rating} of 5`}
      onMouseLeave={() => setHover(0)}
    >
      {STARS.map((value) => (
        <button
          key={value}
          type="button"
          className="cursor-pointer p-0 disabled:cursor-default"
          aria-pressed={value <= rating}
          aria-label={`${value} star${value === 1 ? "" : "s"}`}
          disabled={!isEditable}
          onMouseEnter={() => setHover(value)}
          onClick={() => {
            if (isEditable) {
              setStars(value);
            }
          }}
        >
          <Star
            className={cn(
              "size-4 transition-colors",
              value <= shown
                ? "fill-amber-400 text-amber-400"
                : "text-muted-foreground/40",
            )}
          />
        </button>
      ))}
    </div>
  );
}

function ReviewChrome({
  editor,
  node,
}: {
  editor: LexicalEditor;
  node: ReviewNode;
}): JSX.Element {
  const nodeKey = node.getKey();
  const authorRef = useLexicalSlotRef<HTMLDivElement>(
    editor,
    nodeKey,
    "author",
  );
  const childrenRef = useReviewChildren<HTMLDivElement>(editor, nodeKey);
  return (
    <div className="flex flex-col gap-2">
      <ReviewStars editor={editor} node={node} />
      <div
        className="text-sm leading-relaxed italic outline-none [&_.editor-review-children]:outline-none [&_[data-lexical-slot]]:outline-none"
        ref={childrenRef}
      />
      <div className="editor-review-author flex items-baseline gap-1.5 text-sm text-muted-foreground">
        <span className="select-none">-</span>
        <div
          ref={authorRef}
          className="min-w-0 flex-1 font-medium outline-none [&_[data-lexical-slot]]:outline-none"
        />
      </div>
    </div>
  );
}

export function ReviewPlugin({
  context,
}: DecoratorComponentProps): JSX.Element {
  const [editor] = context;
  const nodeMap = useExtensionSignalValue(ReactReviewExtension, "nodeMap");
  return (
    <>
      {Array.from(nodeMap.entries(), ([key, node]) => {
        const dom = editor.getElementByKey(key);
        return dom === null
          ? null
          : createPortal(
              <ReviewChrome editor={editor} node={node} />,
              dom,
              key,
            );
      })}
    </>
  );
}

export const ReactReviewExtension = defineExtension({
  build: () => namedSignals({ nodeMap: new Map<NodeKey, ReviewNode>() }),
  dependencies: [
    configExtension(ReactExtension, {
      decorators: [ReviewPlugin],
    }),
    ReviewExtension,
  ],
  name: "@shadcn-editor/editor/ReactReview",
  register: (editor, _config, state) => {
    const nodeMapSignal = state.getOutput().nodeMap;
    return editor.registerMutationListener(ReviewNode, (nodes) => {
      nodeMapSignal.value = editor.read("latest", () => {
        const nodeMap = new Map(nodeMapSignal.peek());
        for (const k of nodes.keys()) {
          const node = $getNodeByKey(k);
          if ($isReviewNode(node)) {
            nodeMap.set(k, node);
          } else {
            nodeMap.delete(k);
          }
        }
        return nodeMap;
      });
    });
  },
});
