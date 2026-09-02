import { useEffect, useMemo, useRef, useState } from "react";

import {
  type AnyLexicalExtensionArgument,
  CLEAR_HISTORY_COMMAND,
  COMMAND_PRIORITY_EDITOR,
  defineExtension,
} from "lexical";

import type { Transformer } from "@lexical/markdown";
import { useLexicalComposerContext } from "@lexical/react/LexicalComposerContext";
import { LexicalExtensionComposer } from "@lexical/react/LexicalExtensionComposer";
import { useLexicalEditable } from "@lexical/react/useLexicalEditable";

import { ArrowUp, Square } from "lucide-react";

import {
  $clearChatInput,
  $getChatInputContent,
  $isChatInputEmpty,
  CHAT_INPUT_TRANSFORMERS,
  ChatInputExtension,
  type ChatInputValue,
  SUBMIT_CHAT_INPUT_COMMAND,
} from "@/components/editor/extensions/chat";
import { ContentEditable } from "@/components/editor/plugins/content-editable";
import {
  type LocalizedText,
  useTranslation,
} from "@/components/editor/plugins/i18n-plugin";
import { InputGroup, InputGroupButton } from "@/components/ui/input-group";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { cn } from "@/lib/utils";

const INTERACTIVE_SELECTOR = "button, a, [contenteditable], [role=menu]";

function preventDefault(event: React.MouseEvent<HTMLElement>): void {
  event.preventDefault();
}

export interface ChatInputProps {
  /**
   * The composer's editor extension: nodes, theme, and any extras such as
   * mentions or emoji. Keep it stable (module scope or `useMemo`) so the
   * editor is not re-created on every render. {@link ChatInputExtension} is
   * added automatically; use `configExtension` on it to change the Enter or
   * markdown shortcut behavior.
   */
  extension: AnyLexicalExtensionArgument;
  /** Called with the message when the user presses Enter or the submit button. */
  onSubmit: (value: ChatInputValue) => void;
  /** Markdown transformers used to export the message. Must be stable. */
  transformers?: Transformer[];
  /** Reset the composer after a successful submit. Defaults to `true`. */
  clearOnSubmit?: boolean;
  disabled?: boolean;
  autoFocus?: boolean;
  placeholder?: LocalizedText;
  className?: string;
  editorClassName?: string;
  /** Plugins and addons rendered inside the input group, e.g. the submit button. */
  children?: React.ReactNode;
}

/**
 * A rich text chat composer built on Lexical. It keeps to what belongs in a
 * chat message: paragraphs, quotes, and lists, plus inline formats applied
 * with keyboard shortcuts or markdown syntax. The message is handed back as
 * markdown so it drops straight into any chat or AI SDK.
 *
 * ```tsx
 * const extension = useMemo(
 *   () =>
 *     defineExtension({
 *       name: "@shadcn-editor/chat-input",
 *       dependencies: [RichTextExtension, HistoryExtension, ListExtension],
 *       theme: editorTheme,
 *     }),
 *   [],
 * );
 *
 * <ChatInput extension={extension} onSubmit={(value) => sendMessage(value.markdown)}>
 *   <InputGroupAddon align="block-end">
 *     <InputGroupText>
 *       <CountPlugin />
 *     </InputGroupText>
 *     <ChatInputSubmit isLoading={isLoading} onStop={stop} className="ms-auto" />
 *   </InputGroupAddon>
 * </ChatInput>
 * ```
 */
export function ChatInput({
  extension,
  onSubmit,
  transformers = CHAT_INPUT_TRANSFORMERS,
  clearOnSubmit = true,
  disabled = false,
  autoFocus = false,
  placeholder,
  className,
  editorClassName,
  children,
}: ChatInputProps) {
  const app = useMemo(
    () =>
      defineExtension({
        name: "@shadcn-editor/chat-input/[root]",
        dependencies: [ChatInputExtension, extension],
      }),
    [extension],
  );

  return (
    <LexicalExtensionComposer extension={app} contentEditable={null}>
      <ChatInputFrame className={className}>
        <ChatInputEditor
          autoFocus={autoFocus}
          disabled={disabled}
          placeholder={placeholder}
          className={editorClassName}
        />
        {children}
      </ChatInputFrame>
      <ChatInputSubmitHandler
        onSubmit={onSubmit}
        clearOnSubmit={clearOnSubmit}
        transformers={transformers}
      />
    </LexicalExtensionComposer>
  );
}

function ChatInputFrame({
  className,
  children,
}: {
  className?: string;
  children: React.ReactNode;
}) {
  const [editor] = useLexicalComposerContext();
  return (
    <InputGroup
      data-slot="chat-input"
      className={cn(
        "h-auto items-end has-aria-disabled:opacity-50 has-[>[data-align=block-end]]:items-stretch",
        className,
      )}
      onClick={(event) => {
        const target = event.target as HTMLElement;
        if (!target.closest(INTERACTIVE_SELECTOR)) {
          editor.focus();
        }
      }}
    >
      {children}
    </InputGroup>
  );
}

function ChatInputEditor({
  autoFocus,
  disabled,
  placeholder,
  className,
}: {
  autoFocus: boolean;
  disabled: boolean;
  placeholder?: LocalizedText;
  className?: string;
}) {
  const [editor] = useLexicalComposerContext();
  const { language, t } = useTranslation();

  useEffect(() => {
    editor.setEditable(!disabled);
  }, [editor, disabled]);

  useEffect(() => {
    if (autoFocus) {
      editor.focus();
    }
  }, [editor, autoFocus]);

  return (
    <div
      data-slot="chat-input-editor"
      className={cn(
        "relative max-h-48 w-full min-w-0 flex-1 overflow-y-auto",
        className,
      )}
    >
      <ContentEditable
        data-slot="input-group-control"
        aria-label={t.chatMessage}
        aria-disabled={disabled || undefined}
        placeholder={{
          [language]: placeholder?.[language] ?? t.chatPlaceholder,
        }}
      />
    </div>
  );
}

function ChatInputSubmitHandler({
  onSubmit,
  clearOnSubmit,
  transformers,
}: {
  onSubmit: (value: ChatInputValue) => void;
  clearOnSubmit: boolean;
  transformers: Transformer[];
}) {
  const [editor] = useLexicalComposerContext();
  const onSubmitRef = useRef(onSubmit);

  useEffect(() => {
    onSubmitRef.current = onSubmit;
  }, [onSubmit]);

  useEffect(
    () =>
      editor.registerCommand(
        SUBMIT_CHAT_INPUT_COMMAND,
        () => {
          if (!editor.isEditable() || $isChatInputEmpty()) {
            return true;
          }
          const value: ChatInputValue = {
            ...$getChatInputContent(transformers),
            editorState: editor.getEditorState().toJSON(),
          };
          if (clearOnSubmit) {
            $clearChatInput();
            // The clear above commits as part of this update, so the history
            // stack is reset once it has landed.
            queueMicrotask(() => {
              editor.dispatchCommand(CLEAR_HISTORY_COMMAND, undefined);
            });
          }
          onSubmitRef.current(value);
          return true;
        },
        COMMAND_PRIORITY_EDITOR,
      ),
    [editor, clearOnSubmit, transformers],
  );

  return null;
}

/**
 * Submit button for {@link ChatInput}. Disabled while the composer is empty,
 * and turns into a stop button while `isLoading` is true and `onStop` is set.
 */
export function ChatInputSubmit({
  isLoading = false,
  onStop,
  className,
  ...props
}: Omit<
  React.ComponentProps<typeof InputGroupButton>,
  "children" | "onClick" | "type"
> & {
  isLoading?: boolean;
  onStop?: () => void;
}) {
  const [editor] = useLexicalComposerContext();
  const { t } = useTranslation();
  const isEditable = useLexicalEditable();
  const [isEmpty, setIsEmpty] = useState(() =>
    editor.getEditorState().read($isChatInputEmpty),
  );

  useEffect(
    () =>
      editor.registerUpdateListener(({ editorState }) => {
        setIsEmpty(editorState.read($isChatInputEmpty));
      }),
    [editor],
  );

  const showStop = isLoading && onStop !== undefined;
  const label = showStop ? t.chatStop : t.chatSend;

  return (
    <Tooltip>
      <TooltipTrigger
        render={
          <InputGroupButton
            type="button"
            variant={showStop ? "outline" : "default"}
            size="icon-sm"
            aria-label={label}
            disabled={showStop ? false : isEmpty || !isEditable || isLoading}
            className={cn("rounded-full", className)}
            onMouseDown={preventDefault}
            onClick={() => {
              if (showStop) {
                onStop();
              } else {
                editor.dispatchCommand(SUBMIT_CHAT_INPUT_COMMAND, undefined);
              }
            }}
            {...props}
          >
            {showStop ? <Square className="fill-current" /> : <ArrowUp />}
          </InputGroupButton>
        }
      />
      <TooltipContent>{label}</TooltipContent>
    </Tooltip>
  );
}
