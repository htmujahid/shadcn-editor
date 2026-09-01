import {
  $getNodeByKey,
  $getSelection,
  $isRangeSelection,
  $isTextNode,
  COMMAND_PRIORITY_EDITOR,
  createCommand,
  defineExtension,
  getDOMSelection,
  type LexicalCommand,
  type LexicalEditor,
  type NodeKey,
} from "lexical";

import { effect, namedSignals } from "@lexical/extension";
import {
  $createMarkNode,
  $getMarkIDs,
  $isMarkNode,
  $unwrapMarkNode,
  MarkExtension,
  MarkNode,
} from "@lexical/mark";
import { mergeRegister, registerNestedElementResolver } from "@lexical/utils";

export type Comment = {
  author: string;
  content: string;
  deleted: boolean;
  id: string;
  timeStamp: number;
  type: "comment";
};

export type Thread = {
  comments: Comment[];
  id: string;
  quote: string;
  type: "thread";
};

export type Comments = (Thread | Comment)[];

function createUID(): string {
  return Math.random()
    .toString(36)
    .replace(/[^a-z]+/g, "")
    .substring(0, 5);
}

export function createComment(
  content: string,
  author: string,
  id?: string,
  timeStamp?: number,
  deleted?: boolean,
): Comment {
  return {
    author,
    content,
    deleted: deleted ?? false,
    id: id ?? createUID(),
    timeStamp: timeStamp ?? performance.timeOrigin + performance.now(),
    type: "comment",
  };
}

export function createThread(
  quote: string,
  comments: Comment[],
  id?: string,
): Thread {
  return {
    comments,
    id: id ?? createUID(),
    quote,
    type: "thread",
  };
}

function cloneThread(thread: Thread): Thread {
  return {
    comments: Array.from(thread.comments),
    id: thread.id,
    quote: thread.quote,
    type: "thread",
  };
}

function markDeleted(comment: Comment): Comment {
  return {
    author: comment.author,
    content: "",
    deleted: true,
    id: comment.id,
    timeStamp: comment.timeStamp,
    type: "comment",
  };
}

function createCommentState() {
  return {
    ...namedSignals({
      activeAnchorKey: null as NodeKey | null,
      activeIDs: [] as string[],
      comments: [] as Comments,
      showCommentInput: false,
    }),
    markNodeMap: new Map<string, Set<NodeKey>>(),
  };
}

export type CommentState = ReturnType<typeof createCommentState>;

export function addComment(
  state: CommentState,
  commentOrThread: Comment | Thread,
  thread?: Thread,
  offset?: number,
): void {
  const nextComments = Array.from(state.comments.peek());

  if (thread !== undefined && commentOrThread.type === "comment") {
    for (let i = 0; i < nextComments.length; i++) {
      const comment = nextComments[i];
      if (comment.type === "thread" && comment.id === thread.id) {
        const newThread = cloneThread(comment);
        nextComments.splice(i, 1, newThread);
        const insertOffset = offset ?? newThread.comments.length;
        newThread.comments.splice(insertOffset, 0, commentOrThread);
        break;
      }
    }
  } else {
    nextComments.splice(offset ?? nextComments.length, 0, commentOrThread);
  }
  state.comments.value = nextComments;
}

export function deleteCommentOrThread(
  state: CommentState,
  commentOrThread: Comment | Thread,
  thread?: Thread,
): { markedComment: Comment; index: number } | null {
  const nextComments = Array.from(state.comments.peek());
  let commentIndex = 0;

  if (thread !== undefined) {
    for (let i = 0; i < nextComments.length; i++) {
      const nextComment = nextComments[i];
      if (nextComment.type === "thread" && nextComment.id === thread.id) {
        const newThread = cloneThread(nextComment);
        nextComments.splice(i, 1, newThread);
        commentIndex = newThread.comments.indexOf(commentOrThread as Comment);
        newThread.comments.splice(commentIndex, 1);
        break;
      }
    }
  } else {
    commentIndex = nextComments.indexOf(commentOrThread);
    nextComments.splice(commentIndex, 1);
  }
  state.comments.value = nextComments;

  if (commentOrThread.type === "comment") {
    return {
      index: commentIndex,
      markedComment: markDeleted(commentOrThread),
    };
  }

  return null;
}

export function removeThreadMarks(
  editor: LexicalEditor,
  state: CommentState,
  id: string,
): void {
  const markNodeKeys = state.markNodeMap.get(id);
  if (markNodeKeys === undefined) {
    return;
  }
  setTimeout(() => {
    editor.update(() => {
      for (const key of markNodeKeys) {
        const node = $getNodeByKey(key);
        if ($isMarkNode(node)) {
          node.deleteID(id);
          if (node.getIDs().length === 0) {
            $unwrapMarkNode(node);
          }
        }
      }
    });
  });
}

export const INSERT_INLINE_COMMAND: LexicalCommand<void> = createCommand(
  "INSERT_INLINE_COMMAND",
);

export const CLOSE_COMMENT_INPUT_COMMAND: LexicalCommand<void> = createCommand(
  "CLOSE_COMMENT_INPUT_COMMAND",
);

export const CommentExtension = defineExtension({
  name: "@shadcn-editor/editor/Comment",
  dependencies: [MarkExtension],
  build: createCommentState,
  register: (editor, _config, state) => {
    const output = state.getOutput();
    const { markNodeMap } = output;
    const markNodeKeysToIDs = new Map<NodeKey, string[]>();

    return mergeRegister(
      registerNestedElementResolver<MarkNode>(
        editor,
        MarkNode,
        (from) => $createMarkNode(from.getIDs()),
        (from, to) => {
          for (const id of from.getIDs()) {
            to.addID(id);
          }
        },
      ),

      editor.registerMutationListener(
        MarkNode,
        (mutations) => {
          editor.read("latest", () => {
            for (const [key, mutation] of mutations) {
              const node = $getNodeByKey(key);
              let ids: string[] = [];

              if (mutation === "destroyed") {
                ids = markNodeKeysToIDs.get(key) ?? [];
              } else if ($isMarkNode(node)) {
                ids = node.getIDs();
              }

              for (const id of ids) {
                let markNodeKeys = markNodeMap.get(id);
                markNodeKeysToIDs.set(key, ids);

                if (mutation === "destroyed") {
                  if (markNodeKeys !== undefined) {
                    markNodeKeys.delete(key);
                    if (markNodeKeys.size === 0) {
                      markNodeMap.delete(id);
                    }
                  }
                } else {
                  if (markNodeKeys === undefined) {
                    markNodeKeys = new Set();
                    markNodeMap.set(id, markNodeKeys);
                  }
                  markNodeKeys.add(key);
                }
              }
            }
          });
        },
        { skipInitialization: false },
      ),

      editor.registerUpdateListener(({ editorState }) => {
        editorState.read(() => {
          const selection = $getSelection();
          let hasActiveIds = false;
          let hasAnchorKey = false;

          if ($isRangeSelection(selection)) {
            const anchorNode = selection.anchor.getNode();

            if ($isTextNode(anchorNode)) {
              const commentIDs = $getMarkIDs(
                anchorNode,
                selection.anchor.offset,
              );
              if (commentIDs !== null) {
                output.activeIDs.value = commentIDs;
                hasActiveIds = true;
              }
              if (!selection.isCollapsed()) {
                output.activeAnchorKey.value = anchorNode.getKey();
                hasAnchorKey = true;
              }
            }
          }
          if (!hasActiveIds && output.activeIDs.peek().length > 0) {
            output.activeIDs.value = [];
          }
          if (!hasAnchorKey) {
            output.activeAnchorKey.value = null;
          }
          if ($isRangeSelection(selection)) {
            output.showCommentInput.value = false;
          }
        });
      }),

      editor.registerCommand(
        INSERT_INLINE_COMMAND,
        () => {
          const domSelection = getDOMSelection(editor._window);
          if (domSelection !== null) {
            domSelection.removeAllRanges();
          }
          output.showCommentInput.value = true;
          return true;
        },
        COMMAND_PRIORITY_EDITOR,
      ),

      editor.registerCommand(
        CLOSE_COMMENT_INPUT_COMMAND,
        () => {
          output.showCommentInput.value = false;
          return true;
        },
        COMMAND_PRIORITY_EDITOR,
      ),

      effect(() => {
        const activeIDs = output.activeIDs.value;
        const changedElems: HTMLElement[] = [];
        for (const id of activeIDs) {
          const keys = markNodeMap.get(id);
          if (keys !== undefined) {
            for (const key of keys) {
              const elem = editor.getElementByKey(key);
              if (elem !== null) {
                elem.classList.add("selected");
                changedElems.push(elem);
              }
            }
          }
        }
        return () => {
          for (const elem of changedElems) {
            elem.classList.remove("selected");
          }
        };
      }),
    );
  },
});
