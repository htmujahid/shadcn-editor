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
  extension: AnyLexicalExtensionArgument;
  content: string;
  isStreaming?: boolean;
  transformers?: Transformer[];
  className?: string;
}

export function ChatMessage({
  extension,
  content,
  isStreaming = false,
  transformers = CHAT_MESSAGE_TRANSFORMERS,
  className,
}: ChatMessageProps) {
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
