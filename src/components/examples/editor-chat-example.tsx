import { useMemo, useRef, useState } from "react";

import { defineExtension } from "lexical";

import { HistoryExtension } from "@lexical/history";
import { ListExtension } from "@lexical/list";
import { RichTextExtension } from "@lexical/rich-text";

import { MessageCircleDashed, RotateCw } from "lucide-react";

import type { ChatInputValue } from "@/components/editor/extensions/chat";
import { EmojiExtension } from "@/components/editor/extensions/emoji";
import { LinkExtension } from "@/components/editor/extensions/link";
import { MentionExtension } from "@/components/editor/extensions/mention";
import { CountPlugin } from "@/components/editor/plugins/activitybar/count-plugin";
import {
  ChatInput,
  ChatInputSubmit,
} from "@/components/editor/plugins/chat/chat-input-plugin";
import { ChatMessage } from "@/components/editor/plugins/chat/chat-message-plugin";
import { EmojiPickerPlugin } from "@/components/editor/plugins/emoji-picker-plugin";
import {
  LanguageProvider,
  useLanguage,
} from "@/components/editor/plugins/i18n-plugin";
import { MentionPlugin } from "@/components/editor/plugins/mention-plugin";
import { chatMessageTheme, editorTheme } from "@/components/editor/theme";
import { Bubble, BubbleContent } from "@/components/ui/bubble";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { DirectionProvider } from "@/components/ui/direction";
import {
  Empty,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from "@/components/ui/empty";
import { InputGroupAddon, InputGroupText } from "@/components/ui/input-group";
import { Message, MessageContent } from "@/components/ui/message";
import {
  MessageScroller,
  MessageScrollerButton,
  MessageScrollerContent,
  MessageScrollerItem,
  MessageScrollerProvider,
  MessageScrollerViewport,
} from "@/components/ui/message-scroller";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";

interface ChatMessageItem {
  id: string;
  role: "user" | "assistant";
  content: string;
}

const INITIAL_MESSAGES: ChatMessageItem[] = [
  {
    id: "1",
    role: "user",
    content:
      "Can the composer send **rich text**, or does everything get flattened to plain text?",
  },
  {
    id: "2",
    role: "assistant",
    content: [
      "Both sides of the conversation are Lexical editors, so nothing gets flattened:",
      "",
      "- The composer exports what you type as **markdown**",
      "- Each message renders that markdown back into rich text",
      "- Replies can be *streamed* and re-rendered as tokens arrive",
      "",
      "Format with shortcuts like `Ctrl + B` or markdown such as `**bold**`, `- ` for a list, and `> ` for a quote. `Shift + Enter` adds a line, `@` mentions someone, and `:` picks an emoji.",
    ].join("\n"),
  },
];

function mockReply(value: ChatInputValue, turn: number): string {
  const quoted = value.markdown
    .split("\n")
    .map((line) => `> ${line}`)
    .join("\n");
  const replies = [
    [
      "Here is your message, rendered from the markdown the composer produced:",
      "",
      quoted,
      "",
      "## Everything round-trips",
      "",
      "- **Bold**, *italic*, and ~~strikethrough~~ survive the trip",
      "- Lists and quotes keep their structure",
      "- Links such as [shadcn/ui](https://ui.shadcn.com) stay clickable",
      "",
      "Messages you send keep to paragraphs, quotes, and lists. Replies render with the same nodes, plus headings.",
    ],
    [
      "Got it. Since the message arrives as markdown, wiring it to a model is a single call with `value.markdown` as the text.",
      "",
      "Both the request and the streamed reply render through the same `ChatMessage` component, so the thread stays consistent.",
      "",
      "> Scroll up while this streams and the scroller keeps your place. The jump button brings you back.",
    ],
    [
      "A few things you can do from here:",
      "",
      "1. Add nodes such as mentions or emoji to the composer's `extension`",
      "2. Swap the mock for `useChat` from the Vercel AI SDK or `useChat` from TanStack AI",
      "3. Persist `value.editorState` if you want the exact Lexical document, not only the markdown",
    ],
  ];
  return replies[turn % replies.length].join("\n");
}

function streamReply(
  reply: string,
  signal: AbortSignal,
  onChunk: (chunk: string) => void,
): Promise<void> {
  return new Promise((resolve) => {
    const words = reply.split(/(?=\s)/);
    let index = 0;
    const tick = () => {
      if (signal.aborted || index >= words.length) {
        resolve();
        return;
      }
      onChunk(words[index++]);
      setTimeout(tick, 30);
    };
    tick();
  });
}

export function ChatEditor() {
  const inputExtension = useMemo(
    () =>
      defineExtension({
        name: "@shadcn-editor/chat-input",
        dependencies: [
          RichTextExtension,
          HistoryExtension,
          ListExtension,
          LinkExtension,
          MentionExtension,
          EmojiExtension,
        ],
        theme: editorTheme,
      }),
    [],
  );

  const messageExtension = useMemo(
    () =>
      defineExtension({
        name: "@shadcn-editor/chat-message",
        dependencies: [RichTextExtension, ListExtension, LinkExtension],
        theme: chatMessageTheme,
      }),
    [],
  );

  const [messages, setMessages] = useState<ChatMessageItem[]>(INITIAL_MESSAGES);
  const [isStreaming, setIsStreaming] = useState(false);
  const abortRef = useRef<AbortController | null>(null);
  const turnRef = useRef(0);

  const stop = () => {
    abortRef.current?.abort();
    abortRef.current = null;
    setIsStreaming(false);
  };

  const reset = () => {
    stop();
    turnRef.current = 0;
    setMessages([]);
  };

  const send = async (value: ChatInputValue) => {
    abortRef.current?.abort();
    const controller = new AbortController();
    abortRef.current = controller;
    const userId = crypto.randomUUID();
    const assistantId = crypto.randomUUID();
    setMessages((prev) => [
      ...prev,
      { id: userId, role: "user", content: value.markdown },
      { id: assistantId, role: "assistant", content: "" },
    ]);
    setIsStreaming(true);
    await new Promise((resolve) => setTimeout(resolve, 500));
    await streamReply(
      mockReply(value, turnRef.current++),
      controller.signal,
      (chunk) => {
        setMessages((prev) =>
          prev.map((message) =>
            message.id === assistantId
              ? { ...message, content: message.content + chunk }
              : message,
          ),
        );
      },
    );
    if (abortRef.current === controller) {
      abortRef.current = null;
      setIsStreaming(false);
    }
  };

  const lastMessage = messages[messages.length - 1];

  return (
    <LanguageProvider>
      <ChatWrapper>
        <MessageScrollerProvider autoScroll>
          <Card className="min-h-0 flex-1 gap-0">
            <CardHeader className="gap-1 border-b">
              <CardTitle>New Chat</CardTitle>
              <CardDescription>
                Rich text in, rich text out. Replies stream in as markdown.
              </CardDescription>
              <CardAction>
                <Tooltip>
                  <TooltipTrigger
                    render={
                      <Button
                        variant="outline"
                        size="icon"
                        aria-label="Clear conversation"
                        disabled={messages.length === 0}
                        onClick={reset}
                      >
                        <RotateCw />
                      </Button>
                    }
                  />
                  <TooltipContent>Clear conversation</TooltipContent>
                </Tooltip>
              </CardAction>
            </CardHeader>
            <CardContent className="min-h-0 flex-1 overflow-hidden p-0">
              {messages.length === 0 ? (
                <Empty className="h-full">
                  <EmptyHeader>
                    <EmptyMedia variant="icon">
                      <MessageCircleDashed />
                    </EmptyMedia>
                    <EmptyTitle>Start a conversation</EmptyTitle>
                    <EmptyDescription>
                      Write a message below. Markdown, shortcuts, mentions, and
                      emoji all work in the composer.
                    </EmptyDescription>
                  </EmptyHeader>
                </Empty>
              ) : (
                <MessageScroller>
                  <MessageScrollerViewport>
                    <MessageScrollerContent
                      aria-busy={isStreaming}
                      className="p-(--card-spacing)"
                    >
                      {messages.map((message) => {
                        const isUser = message.role === "user";
                        return (
                          <MessageScrollerItem
                            key={message.id}
                            messageId={message.id}
                            scrollAnchor={isUser}
                          >
                            <Message align={isUser ? "end" : "start"}>
                              <MessageContent>
                                <Bubble variant={isUser ? "muted" : "ghost"}>
                                  <BubbleContent>
                                    <ChatMessage
                                      extension={messageExtension}
                                      content={message.content}
                                      isStreaming={
                                        isStreaming &&
                                        message.id === lastMessage.id
                                      }
                                    />
                                  </BubbleContent>
                                </Bubble>
                              </MessageContent>
                            </Message>
                          </MessageScrollerItem>
                        );
                      })}
                    </MessageScrollerContent>
                  </MessageScrollerViewport>
                  <MessageScrollerButton />
                </MessageScroller>
              )}
            </CardContent>
            <CardFooter className="flex-col gap-2">
              <ChatInput
                extension={inputExtension}
                onSubmit={(value) => void send(value)}
              >
                <MentionPlugin />
                <EmojiPickerPlugin />
                <InputGroupAddon align="block-end" className="pt-1">
                  <InputGroupText className="text-xs">
                    <CountPlugin />
                  </InputGroupText>
                  <ChatInputSubmit
                    isLoading={isStreaming}
                    onStop={stop}
                    className="ms-auto"
                  />
                </InputGroupAddon>
              </ChatInput>
            </CardFooter>
          </Card>
        </MessageScrollerProvider>
      </ChatWrapper>
    </LanguageProvider>
  );
}

function ChatWrapper({ children }: { children: React.ReactNode }) {
  const { language, dir } = useLanguage();
  return (
    <DirectionProvider direction={dir}>
      <div
        dir={dir}
        lang={language}
        className="relative flex min-h-0 w-full flex-1 flex-col"
      >
        {children}
      </div>
    </DirectionProvider>
  );
}
