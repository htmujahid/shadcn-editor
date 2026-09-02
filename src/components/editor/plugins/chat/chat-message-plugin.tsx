import { useEffect, useMemo, useRef, useState } from "react";

import {
  $getEditor,
  type AnyLexicalExtensionArgument,
  defineExtension,
  SKIP_DOM_SELECTION_TAG,
} from "lexical";

import type { Transformer } from "@lexical/markdown";
import { useLexicalComposerContext } from "@lexical/react/LexicalComposerContext";
import { ContentEditable } from "@lexical/react/LexicalContentEditable";
import { LexicalExtensionComposer } from "@lexical/react/LexicalExtensionComposer";

import {
  $setChatMessageContent,
  CHAT_MESSAGE_TRANSFORMERS,
  filterTransformers,
} from "@/components/editor/extensions/chat";
import { useTranslation } from "@/components/editor/plugins/i18n-plugin";
import { cn } from "@/lib/utils";

export interface ChatMessageProps {
  /**
   * The editor extension used to render the message: nodes and theme. Keep
   * it stable (module scope or `useMemo`); every message renders with its own
   * read-only editor built from it.
   */
  extension: AnyLexicalExtensionArgument;
  /** The message as markdown. Re-rendered whenever it changes, so it can be streamed. */
  content: string;
  /** Marks the message as still being generated. Shows a thinking state while empty. */
  isStreaming?: boolean;
  /** Markdown transformers used to render the content. Must be stable. */
  transformers?: Transformer[];
  className?: string;
}

/**
 * Renders a chat message as rich text with a read-only Lexical editor. It
 * accepts markdown, so both what the user typed in {@link ChatInput} and the
 * streamed reply from a model render with the same nodes and theme.
 *
 * ```tsx
 * const extension = useMemo(
 *   () =>
 *     defineExtension({
 *       name: "@shadcn-editor/chat-message",
 *       dependencies: [RichTextExtension, ListExtension, CodeExtension],
 *       theme: chatMessageTheme,
 *     }),
 *   [],
 * );
 *
 * <Bubble variant="ghost">
 *   <BubbleContent>
 *     <ChatMessage
 *       extension={extension}
 *       content={message.markdown}
 *       isStreaming={isLast && isLoading}
 *     />
 *   </BubbleContent>
 * </Bubble>
 * ```
 */
export function ChatMessage({
  extension,
  content,
  isStreaming = false,
  transformers = CHAT_MESSAGE_TRANSFORMERS,
  className,
}: ChatMessageProps) {
  // The document is seeded once; later changes are applied by ChatMessageContent.
  const [initialContent] = useState(content);

  const app = useMemo(
    () =>
      defineExtension({
        name: "@shadcn-editor/chat-message/[root]",
        dependencies: [extension],
        editable: false,
        $initialEditorState: () => {
          $setChatMessageContent(
            initialContent,
            filterTransformers($getEditor(), transformers),
          );
        },
      }),
    [extension, initialContent, transformers],
  );

  return (
    <LexicalExtensionComposer extension={app} contentEditable={null}>
      <ChatMessageContent
        content={content}
        isStreaming={isStreaming}
        transformers={transformers}
        className={className}
      />
    </LexicalExtensionComposer>
  );
}

function ChatMessageContent({
  content,
  isStreaming,
  transformers,
  className,
}: {
  content: string;
  isStreaming: boolean;
  transformers: Transformer[];
  className?: string;
}) {
  const [editor] = useLexicalComposerContext();
  const { t } = useTranslation();
  const appliedContentRef = useRef(content);
  const activeTransformers = useMemo(
    () => filterTransformers(editor, transformers),
    [editor, transformers],
  );

  useEffect(() => {
    if (appliedContentRef.current === content) {
      return;
    }
    appliedContentRef.current = content;
    editor.update(
      () => {
        $setChatMessageContent(content, activeTransformers);
      },
      { tag: SKIP_DOM_SELECTION_TAG },
    );
  }, [editor, content, activeTransformers]);

  if (content === "" && isStreaming) {
    return (
      <span
        data-slot="chat-message-thinking"
        className="shimmer text-muted-foreground"
      >
        {t.chatThinking}
      </span>
    );
  }

  return (
    <ContentEditable
      data-slot="chat-message"
      aria-busy={isStreaming || undefined}
      className={cn("min-w-0 text-sm outline-none", className)}
    />
  );
}
