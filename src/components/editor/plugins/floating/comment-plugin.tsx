import { useCallback, useEffect, useMemo, useRef, useState } from "react";

import {
  $getNodeByKey,
  $getSelection,
  $isRangeSelection,
  type LexicalEditor,
  type RangeSelection,
  registerEventListener,
} from "lexical";

import { $isMarkNode, $wrapSelectionInMarkNode } from "@lexical/mark";
import { useLexicalComposerContext } from "@lexical/react/LexicalComposerContext";
import { useExtensionDependency } from "@lexical/react/useExtensionComponent";
import { useExtensionSignalValue } from "@lexical/react/useExtensionSignalValue";
import { createDOMRange, createRectsFromDOMRange } from "@lexical/selection";
import { mergeRegister } from "@lexical/utils";

import { Popover as PopoverPrimitive } from "@base-ui/react/popover";
import { MessageSquarePlus, SendHorizontal, Trash2 } from "lucide-react";

import {
  addComment,
  CLOSE_COMMENT_INPUT_COMMAND,
  type Comment,
  CommentExtension,
  type CommentState,
  createComment,
  createThread,
  deleteCommentOrThread,
  INSERT_INLINE_COMMAND,
  removeThreadMarks,
  type Thread,
} from "@/components/editor/extensions/comment";
import {
  hideFloatingAnchor,
  setFloatingAnchorRect,
} from "@/components/editor/plugins/floating/floating-utils";
import { useTranslation } from "@/components/editor/plugins/i18n-plugin";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import {
  InputGroup,
  InputGroupAddon,
  InputGroupButton,
  InputGroupInput,
} from "@/components/ui/input-group";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
} from "@/components/ui/sidebar";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";

function getScrollParent(element: HTMLElement | null): HTMLElement | null {
  let current = element?.parentElement ?? null;
  while (current) {
    const { overflowY } = getComputedStyle(current);
    if (overflowY === "auto" || overflowY === "scroll") {
      return current;
    }
    current = current.parentElement;
  }
  return null;
}

function AddCommentButton({
  editor,
  anchorKey,
}: {
  editor: LexicalEditor;
  anchorKey: string;
}) {
  const { t, dir } = useTranslation();
  const triggerRef = useRef<HTMLButtonElement | null>(null);

  const updatePosition = useCallback(() => {
    const triggerElem = triggerRef.current;
    const rootElement = editor.getRootElement();
    const anchorElem = editor.getElementByKey(anchorKey);
    if (triggerElem === null) {
      return;
    }
    if (rootElement === null || anchorElem === null) {
      hideFloatingAnchor(triggerElem);
      return;
    }
    const rootRect = rootElement.getBoundingClientRect();
    const anchorRect = anchorElem.getBoundingClientRect();
    const x = dir === "rtl" ? rootRect.left + 12 : rootRect.right - 12;
    setFloatingAnchorRect(
      triggerElem,
      new DOMRect(x, anchorRect.top, 0, anchorRect.height),
    );
  }, [editor, anchorKey, dir]);

  useEffect(() => {
    updatePosition();
    return mergeRegister(
      registerEventListener(window, "resize", updatePosition),
      registerEventListener(document, "scroll", updatePosition, true),
      editor.registerUpdateListener(() => {
        updatePosition();
      }),
    );
  }, [editor, updatePosition]);

  return (
    <Popover open>
      <PopoverTrigger
        ref={triggerRef}
        aria-hidden="true"
        tabIndex={-1}
        className="pointer-events-none fixed top-0 left-0 opacity-0"
        style={{ transform: "translate(-10000px, -10000px)" }}
      />
      <PopoverPrimitive.Portal dir={dir}>
        <PopoverContent
          dir={dir}
          side="top"
          align="end"
          sideOffset={4}
          initialFocus={false}
          finalFocus={false}
          className="w-auto min-w-0 rounded-full p-0.5"
        >
          <Button
            variant="ghost"
            size="icon-sm"
            aria-label={t.addComment}
            className="rounded-full"
            onMouseDown={(event) => event.preventDefault()}
            onClick={() => {
              editor.dispatchCommand(INSERT_INLINE_COMMAND, undefined);
            }}
          >
            <MessageSquarePlus />
          </Button>
        </PopoverContent>
      </PopoverPrimitive.Portal>
    </Popover>
  );
}

function CommentInputBox({
  editor,
  state,
}: {
  editor: LexicalEditor;
  state: CommentState;
}) {
  const { t, dir } = useTranslation();
  const [content, setContent] = useState("");
  const triggerRef = useRef<HTMLButtonElement | null>(null);
  const selectionRef = useRef<RangeSelection | null>(null);
  const highlightsRef = useRef<HTMLDivElement | null>(null);

  const updateLocation = useCallback(() => {
    editor.read("latest", () => {
      const selection = $getSelection();
      if (!$isRangeSelection(selection)) {
        return;
      }
      selectionRef.current = selection.clone();
      const range = createDOMRange(
        editor,
        selection.anchor.getNode(),
        selection.anchor.offset,
        selection.focus.getNode(),
        selection.focus.offset,
      );
      const triggerElem = triggerRef.current;
      const rootElement = editor.getRootElement();
      const parent = rootElement?.parentElement;
      if (range === null || triggerElem === null || !rootElement || !parent) {
        return;
      }
      setFloatingAnchorRect(triggerElem, range.getBoundingClientRect());

      let container = highlightsRef.current;
      if (container === null) {
        container = rootElement.ownerDocument.createElement("div");
        container.style.position = "absolute";
        container.style.top = "0";
        container.style.left = "0";
        container.style.pointerEvents = "none";
        parent.appendChild(container);
        highlightsRef.current = container;
      }
      container.innerHTML = "";
      const containerRect = container.getBoundingClientRect();
      for (const rect of createRectsFromDOMRange(editor, range)) {
        const span = rootElement.ownerDocument.createElement("span");
        span.className = "editor-comment-highlight";
        span.style.top = `${rect.top - containerRect.top}px`;
        span.style.left = `${rect.left - containerRect.left}px`;
        span.style.width = `${rect.width}px`;
        span.style.height = `${rect.height}px`;
        container.appendChild(span);
      }
    });
  }, [editor]);

  useEffect(() => {
    updateLocation();
    return mergeRegister(
      registerEventListener(window, "resize", updateLocation),
      () => {
        highlightsRef.current?.remove();
        highlightsRef.current = null;
      },
    );
  }, [updateLocation]);

  const cancel = useCallback(() => {
    editor.update(() => {
      const selection = $getSelection();
      if (selection !== null) {
        selection.dirty = true;
      }
    });
    editor.dispatchCommand(CLOSE_COMMENT_INPUT_COMMAND, undefined);
  }, [editor]);

  const submit = useCallback(() => {
    const text = content.trim();
    if (text === "") {
      return;
    }
    let quote = editor.read(
      "latest",
      () => selectionRef.current?.getTextContent() ?? "",
    );
    if (quote.length > 100) {
      quote = quote.slice(0, 99) + "…";
    }
    const thread = createThread(quote, [createComment(text, t.you)]);
    addComment(state, thread);
    editor.update(() => {
      const selection = selectionRef.current;
      if ($isRangeSelection(selection)) {
        $wrapSelectionInMarkNode(selection, selection.isBackward(), thread.id);
      }
    });
    selectionRef.current = null;
    editor.dispatchCommand(CLOSE_COMMENT_INPUT_COMMAND, undefined);
  }, [content, editor, state, t]);

  return (
    <Popover open>
      <PopoverTrigger
        ref={triggerRef}
        aria-hidden="true"
        tabIndex={-1}
        className="pointer-events-none fixed top-0 left-0 opacity-0"
        style={{ transform: "translate(-10000px, -10000px)" }}
      />
      <PopoverPrimitive.Portal dir={dir}>
        <PopoverContent
          dir={dir}
          side="bottom"
          align="center"
          sideOffset={12}
          finalFocus={false}
          className="w-72 gap-2 p-3"
        >
          <Textarea
            autoFocus
            rows={3}
            placeholder={t.typeComment}
            value={content}
            className="resize-none"
            onChange={(event) => setContent(event.target.value)}
            onKeyDown={(event) => {
              if (event.key === "Escape") {
                event.preventDefault();
                cancel();
              } else if (event.key === "Enter" && !event.shiftKey) {
                event.preventDefault();
                submit();
              }
            }}
          />
          <div className="flex justify-end gap-2">
            <Button variant="ghost" size="sm" onClick={cancel}>
              {t.cancel}
            </Button>
            <Button size="sm" disabled={content.trim() === ""} onClick={submit}>
              {t.comment}
            </Button>
          </div>
        </PopoverContent>
      </PopoverPrimitive.Portal>
    </Popover>
  );
}

export function CommentPlugin() {
  const [editor] = useLexicalComposerContext();
  const state = useExtensionDependency(CommentExtension).output;
  const showCommentInput = useExtensionSignalValue(
    CommentExtension,
    "showCommentInput",
  );
  const activeAnchorKey = useExtensionSignalValue(
    CommentExtension,
    "activeAnchorKey",
  );

  if (showCommentInput) {
    return <CommentInputBox editor={editor} state={state} />;
  }
  if (activeAnchorKey != null) {
    return <AddCommentButton editor={editor} anchorKey={activeAnchorKey} />;
  }
  return null;
}

function DeleteButton({
  title,
  onDelete,
  className,
}: {
  title: string;
  onDelete: () => void;
  className?: string;
}) {
  const { t, dir } = useTranslation();
  return (
    <AlertDialog>
      <AlertDialogTrigger
        render={
          <Button
            variant="ghost"
            size="icon-xs"
            aria-label={t.delete}
            className={cn("text-muted-foreground", className)}
            onClick={(event) => event.stopPropagation()}
          >
            <Trash2 />
          </Button>
        }
      />
      <AlertDialogContent
        dir={dir}
        onClick={(event) => event.stopPropagation()}
      >
        <AlertDialogHeader>
          <AlertDialogTitle>{title}</AlertDialogTitle>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>{t.cancel}</AlertDialogCancel>
          <AlertDialogAction onClick={onDelete}>{t.delete}</AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}

function CommentRow({
  comment,
  thread,
  state,
  rtf,
  now,
}: {
  comment: Comment;
  thread: Thread;
  state: CommentState;
  rtf: Intl.RelativeTimeFormat;
  now: number;
}) {
  const { t } = useTranslation();
  const minutes = Math.round((comment.timeStamp - now) / 60000);

  return (
    <div className="group/comment">
      <div className="flex items-center gap-1 text-xs">
        <span className="font-medium">{comment.author}</span>
        <span className="text-muted-foreground">
          {minutes > -1 ? t.justNow : rtf.format(minutes, "minute")}
        </span>
        {!comment.deleted && (
          <DeleteButton
            title={t.deleteCommentConfirm}
            className="ms-auto opacity-0 group-hover/comment:opacity-100"
            onDelete={() => {
              const info = deleteCommentOrThread(state, comment, thread);
              if (info !== null) {
                addComment(state, info.markedComment, thread, info.index);
              }
            }}
          />
        )}
      </div>
      {comment.deleted ? (
        <p className="text-xs text-muted-foreground italic">
          {t.deletedComment}
        </p>
      ) : (
        <p className="text-sm break-words">{comment.content}</p>
      )}
    </div>
  );
}

function ReplyComposer({
  thread,
  state,
}: {
  thread: Thread;
  state: CommentState;
}) {
  const { t } = useTranslation();
  const [content, setContent] = useState("");

  const submit = () => {
    const text = content.trim();
    if (text === "") {
      return;
    }
    addComment(state, createComment(text, t.you), thread);
    setContent("");
  };

  return (
    <InputGroup
      className="mt-2 h-8 rounded-md"
      onClick={(event) => event.stopPropagation()}
    >
      <InputGroupInput
        value={content}
        placeholder={t.replyToComment}
        className="text-xs"
        onChange={(event) => setContent(event.target.value)}
        onKeyDown={(event) => {
          if (event.key === "Enter") {
            event.preventDefault();
            submit();
          }
        }}
      />
      <InputGroupAddon align="inline-end">
        <InputGroupButton
          size="icon-xs"
          aria-label={t.comment}
          disabled={content.trim() === ""}
          onClick={submit}
        >
          <SendHorizontal className="rtl:rotate-180" />
        </InputGroupButton>
      </InputGroupAddon>
    </InputGroup>
  );
}

function ThreadCard({
  editor,
  thread,
  state,
  active,
  rtf,
  now,
}: {
  editor: LexicalEditor;
  thread: Thread;
  state: CommentState;
  active: boolean;
  rtf: Intl.RelativeTimeFormat;
  now: number;
}) {
  const { t } = useTranslation();

  const handleClickThread = () => {
    const markNodeKeys = state.markNodeMap.get(thread.id);
    if (markNodeKeys === undefined || active) {
      return;
    }
    const activeElement = document.activeElement;
    const markNodeKey = Array.from(markNodeKeys)[0];
    editor.update(
      () => {
        const markNode = $getNodeByKey(markNodeKey);
        if ($isMarkNode(markNode)) {
          markNode.selectStart();
        }
      },
      {
        onUpdate() {
          const markElem = editor.getElementByKey(markNodeKey);
          const scroller = getScrollParent(editor.getRootElement());
          if (markElem !== null && scroller !== null) {
            const markRect = markElem.getBoundingClientRect();
            const scrollerRect = scroller.getBoundingClientRect();
            if (
              markRect.top < scrollerRect.top ||
              markRect.bottom > scrollerRect.bottom
            ) {
              scroller.scrollTo({
                behavior: "smooth",
                top:
                  markRect.top -
                  scrollerRect.top +
                  scroller.scrollTop -
                  scroller.clientHeight / 2,
              });
            }
          }
          if (activeElement !== null) {
            (activeElement as HTMLElement).focus();
          }
        },
      },
    );
  };

  return (
    <div
      onClick={handleClickThread}
      className={cn(
        "rounded-md border bg-background p-2 text-start",
        state.markNodeMap.has(thread.id) && "cursor-pointer",
        active && "border-ring ring-1 ring-ring",
      )}
    >
      <div className="flex items-start justify-between gap-1">
        <blockquote className="line-clamp-2 border-s-2 ps-2 text-xs text-muted-foreground italic">
          {thread.quote}
        </blockquote>
        <DeleteButton
          title={t.deleteThreadConfirm}
          className="-mt-0.5 shrink-0"
          onDelete={() => {
            deleteCommentOrThread(state, thread);
            removeThreadMarks(editor, state, thread.id);
          }}
        />
      </div>
      <div className="mt-2 flex flex-col gap-2">
        {thread.comments.map((comment) => (
          <CommentRow
            key={comment.id}
            comment={comment}
            thread={thread}
            state={state}
            rtf={rtf}
            now={now}
          />
        ))}
      </div>
      <ReplyComposer thread={thread} state={state} />
    </div>
  );
}

export function CommentsPanel() {
  const [editor] = useLexicalComposerContext();
  const { t, language } = useTranslation();
  const state = useExtensionDependency(CommentExtension).output;
  const comments = useExtensionSignalValue(CommentExtension, "comments");
  const activeIDs = useExtensionSignalValue(CommentExtension, "activeIDs");
  const [now, setNow] = useState(() => Date.now());

  const rtf = useMemo(
    () =>
      new Intl.RelativeTimeFormat(language, {
        numeric: "auto",
        style: "short",
      }),
    [language],
  );

  useEffect(() => {
    const id = setInterval(() => {
      setNow(Date.now());
    }, 10000);
    return () => clearInterval(id);
  }, []);

  return (
    <SidebarGroup>
      <SidebarGroupLabel>{t.comments}</SidebarGroupLabel>
      <SidebarGroupContent className="px-2">
        {comments.length === 0 ? (
          <p className="py-4 text-center text-xs text-muted-foreground">
            {t.noComments}
          </p>
        ) : (
          <div className="flex flex-col gap-2">
            {comments.map((commentOrThread) =>
              commentOrThread.type === "thread" ? (
                <ThreadCard
                  key={commentOrThread.id}
                  editor={editor}
                  thread={commentOrThread}
                  state={state}
                  active={activeIDs.includes(commentOrThread.id)}
                  rtf={rtf}
                  now={now}
                />
              ) : null,
            )}
          </div>
        )}
      </SidebarGroupContent>
    </SidebarGroup>
  );
}
