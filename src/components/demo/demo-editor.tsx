import { useMemo, useRef, useState } from "react";

import {
  $getRoot,
  configExtension,
  defineExtension,
  HISTORY_MERGE_TAG,
} from "lexical";

import { ClipboardDOMImportExtension } from "@lexical/clipboard";
import {
  AutoFocusExtension,
  ClearEditorExtension,
  getExtensionDependencyFromEditor,
  HorizontalRuleExtension,
  TabIndentationExtension,
} from "@lexical/extension";
import { HashtagExtension } from "@lexical/hashtag";
import { HistoryExtension } from "@lexical/history";
import { CheckListExtension, ListExtension } from "@lexical/list";
import {
  CHECK_LIST,
  ELEMENT_TRANSFORMERS,
  MULTILINE_ELEMENT_TRANSFORMERS,
  registerMarkdownShortcuts,
  TEXT_FORMAT_TRANSFORMERS,
  TEXT_MATCH_TRANSFORMERS,
  type Transformer,
} from "@lexical/markdown";
import { LexicalExtensionComposer } from "@lexical/react/LexicalExtensionComposer";
import { RichTextExtension } from "@lexical/rich-text";
import { TableExtension } from "@lexical/table";

import { MessageSquareText, TableOfContents } from "lucide-react";

import {
  $seedDocument,
  createSeedThreads,
} from "@/components/demo/demo-content";
import { mockAiResponse } from "@/components/demo/mock-ai";
import type { AiRequest } from "@/components/editor/extensions/ai";
import { AutoLinkExtension } from "@/components/editor/extensions/auto-link";
import { AutocompleteExtension } from "@/components/editor/extensions/autocomplete";
import { CardExtension } from "@/components/editor/extensions/card";
import { CodeExtension } from "@/components/editor/extensions/code";
import { CollapsibleExtension } from "@/components/editor/extensions/collapsible";
import {
  addComment,
  CommentExtension,
} from "@/components/editor/extensions/comment";
import { DateTimeExtension } from "@/components/editor/extensions/datetime";
import { DragDropPasteExtension } from "@/components/editor/extensions/drag-drop-paste";
import { EmojiExtension } from "@/components/editor/extensions/emoji";
import { EquationExtension } from "@/components/editor/extensions/equation";
import { FigmaExtension } from "@/components/editor/extensions/figma";
import { FormatStateExtension } from "@/components/editor/extensions/format-state";
import { ImageExtension } from "@/components/editor/extensions/image";
import { LayoutExtension } from "@/components/editor/extensions/layout";
import { LinkExtension } from "@/components/editor/extensions/link";
import { MentionExtension } from "@/components/editor/extensions/mention";
import { PollExtension } from "@/components/editor/extensions/poll";
import { PullQuoteExtension } from "@/components/editor/extensions/pullquote";
import { RubyExtension } from "@/components/editor/extensions/ruby";
import { ShortcutsExtension } from "@/components/editor/extensions/shortcuts";
import { SpecialTextExtension } from "@/components/editor/extensions/special-text";
import { SpeechToTextExtension } from "@/components/editor/extensions/speech-to-text";
import { TabFocusExtension } from "@/components/editor/extensions/tab-focus";
import { TwitterExtension } from "@/components/editor/extensions/twitter";
import { YouTubeExtension } from "@/components/editor/extensions/youtube";
import { ActivityBar } from "@/components/editor/plugins/activitybar/activitybar-plugin";
import { CountPlugin } from "@/components/editor/plugins/activitybar/count-plugin";
import { ReadOnlyTogglePlugin } from "@/components/editor/plugins/activitybar/read-only-toggle-plugin";
import { ShortcutPlugin } from "@/components/editor/plugins/activitybar/shortcut-plugin";
import { SpeechToTextPlugin } from "@/components/editor/plugins/activitybar/speech-to-text-plugin";
import { AutoEmbedPlugin } from "@/components/editor/plugins/auto-embed-plugin";
import { BlockInsert } from "@/components/editor/plugins/block-insert/block-insert-plugin";
import { InsertCodeBlockPlugin } from "@/components/editor/plugins/block-insert/insert-code-block-plugin";
import { InsertColumnsPlugin } from "@/components/editor/plugins/block-insert/insert-columns-plugin";
import { InsertEmojiPlugin } from "@/components/editor/plugins/block-insert/insert-emoji-plugin";
import { InsertEquationPlugin } from "@/components/editor/plugins/block-insert/insert-equation-plugin";
import { InsertHorizontalRulePlugin } from "@/components/editor/plugins/block-insert/insert-horizontal-rule-plugin";
import { InsertImagePlugin } from "@/components/editor/plugins/block-insert/insert-image-plugin";
import { InsertTablePlugin } from "@/components/editor/plugins/block-insert/insert-table-plugin";
import { AiPickerPlugin } from "@/components/editor/plugins/component-picker/ai-picker-plugin";
import { BulletedListPickerPlugin } from "@/components/editor/plugins/component-picker/bulleted-list-picker-plugin";
import { CardPickerPlugin } from "@/components/editor/plugins/component-picker/card-picker-plugin";
import { CheckListPickerPlugin } from "@/components/editor/plugins/component-picker/check-list-picker-plugin";
import { CodePickerPlugin } from "@/components/editor/plugins/component-picker/code-picker-plugin";
import { CollapsiblePickerPlugin } from "@/components/editor/plugins/component-picker/collapsible-picker-plugin";
import { ColumnsPickerPlugin } from "@/components/editor/plugins/component-picker/columns-picker-plugin";
import { ComponentPicker } from "@/components/editor/plugins/component-picker/component-picker-plugin";
import { DateTimePickerPlugin } from "@/components/editor/plugins/component-picker/datetime-picker-plugin";
import { DividerPickerPlugin } from "@/components/editor/plugins/component-picker/divider-picker-plugin";
import { HeadingPickerPlugin } from "@/components/editor/plugins/component-picker/heading-picker-plugin";
import { ImagePickerPlugin } from "@/components/editor/plugins/component-picker/image-picker-plugin";
import { NumberedListPickerPlugin } from "@/components/editor/plugins/component-picker/numbered-list-picker-plugin";
import { ParagraphPickerPlugin } from "@/components/editor/plugins/component-picker/paragraph-picker-plugin";
import { PollPickerPlugin } from "@/components/editor/plugins/component-picker/poll-picker-plugin";
import { PullQuotePickerPlugin } from "@/components/editor/plugins/component-picker/pullquote-picker-plugin";
import { QuotePickerPlugin } from "@/components/editor/plugins/component-picker/quote-picker-plugin";
import { ReviewPickerPlugin } from "@/components/editor/plugins/component-picker/review-picker-plugin";
import { TablePickerPlugin } from "@/components/editor/plugins/component-picker/table-picker-plugin";
import { ContentEditable } from "@/components/editor/plugins/content-editable";
import { ContextMenuPlugin } from "@/components/editor/plugins/context-menu-plugin";
import { ReactFindReplaceExtension } from "@/components/editor/plugins/decorator/find-replace-panel";
import { ReactReviewExtension } from "@/components/editor/plugins/decorator/review-plugin";
import { DraggableBlockPlugin } from "@/components/editor/plugins/draggable-block-plugin";
import { EmojiPickerPlugin } from "@/components/editor/plugins/emoji-picker-plugin";
import { AiEditorPlugin } from "@/components/editor/plugins/floating/ai-editor-plugin";
import {
  CommentPlugin,
  CommentsPanel,
} from "@/components/editor/plugins/floating/comment-plugin";
import { FloatingToolbarPlugin } from "@/components/editor/plugins/floating/floating-toolbar-plugin";
import { LinkEditorPlugin } from "@/components/editor/plugins/floating/link-editor-plugin";
import { RubyEditorPlugin } from "@/components/editor/plugins/floating/ruby-editor-plugin";
import { TableHoverActionsPlugin } from "@/components/editor/plugins/floating/table-hover-actions-plugin";
import {
  LanguageProvider,
  LanguageSelectorPlugin,
  useLanguage,
  useTranslation,
} from "@/components/editor/plugins/i18n-plugin";
import { MentionPlugin } from "@/components/editor/plugins/mention-plugin";
import { TableOfContentsPlugin } from "@/components/editor/plugins/table-of-contents-plugin";
import { AiToolbarPlugin } from "@/components/editor/plugins/toolbar/ai-toolbar-plugin";
import { BlockFormatToolbarPlugin } from "@/components/editor/plugins/toolbar/block-format-toolbar-plugin";
import { ClearToolbarPlugin } from "@/components/editor/plugins/toolbar/clear-toolbar-plugin";
import { ColorToolbarPlugin } from "@/components/editor/plugins/toolbar/color-toolbar-plugin";
import { ElementFormatToolbarPlugin } from "@/components/editor/plugins/toolbar/element-format-toolbar-plugin";
import { FindReplaceToolbarPlugin } from "@/components/editor/plugins/toolbar/find-replace-toolbar-plugin";
import { FontFamilyToolbarPlugin } from "@/components/editor/plugins/toolbar/font-family-toolbar-plugin";
import { FontSizeToolbarPlugin } from "@/components/editor/plugins/toolbar/font-size-toolbar-plugin";
import { HistoryToolbarPlugin } from "@/components/editor/plugins/toolbar/history-toolbar-plugin";
import { ImportExportToolbarPlugin } from "@/components/editor/plugins/toolbar/import-export-toolbar-plugin";
import { IndentToolbarPlugin } from "@/components/editor/plugins/toolbar/indent-toolbar-plugin";
import { LinkToolbarPlugin } from "@/components/editor/plugins/toolbar/link-toolbar-plugin";
import { RubyToolbarPlugin } from "@/components/editor/plugins/toolbar/ruby-toolbar-plugin";
import { TextFormatToolbarPlugin } from "@/components/editor/plugins/toolbar/text-format-toolbar-plugin";
import { Toolbar } from "@/components/editor/plugins/toolbar/toolbar-plugin";
import { editorTheme } from "@/components/editor/theme";
import { EMOJI } from "@/components/editor/transformers/emoji-transformer";
import { HR } from "@/components/editor/transformers/horizontal-rule-transformer";
import { IMAGE } from "@/components/editor/transformers/image-transformer";
import { TABLE } from "@/components/editor/transformers/table-transformer";
import { Button } from "@/components/ui/button";
import { ButtonGroup } from "@/components/ui/button-group";
import { DirectionProvider } from "@/components/ui/direction";
import {
  Sidebar,
  SidebarContent,
  SidebarProvider,
} from "@/components/ui/sidebar";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { cn } from "@/lib/utils";

const EDITOR_TRANSFORMERS: Transformer[] = [
  TABLE,
  HR,
  IMAGE,
  EMOJI,
  CHECK_LIST,
  ...ELEMENT_TRANSFORMERS,
  ...MULTILINE_ELEMENT_TRANSFORMERS,
  ...TEXT_FORMAT_TRANSFORMERS,
  ...TEXT_MATCH_TRANSFORMERS,
];

function useMockAi() {
  const [output, setOutput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  const abortRef = useRef<AbortController | null>(null);

  const stop = () => {
    abortRef.current?.abort();
    abortRef.current = null;
    setIsLoading(false);
  };

  const onGenerate = async (request: AiRequest) => {
    abortRef.current?.abort();
    const controller = new AbortController();
    abortRef.current = controller;
    setOutput("");
    setError(null);
    setIsLoading(true);
    try {
      const response = mockAiResponse(request, controller.signal);
      if (!response.ok || response.body === null) {
        throw new Error(`AI request failed with status ${response.status}`);
      }
      const reader = response.body
        .pipeThrough(new TextDecoderStream())
        .getReader();
      while (true) {
        const { value, done } = await reader.read();
        if (done) {
          break;
        }
        setOutput((prev) => prev + value);
      }
    } catch (err) {
      if (!controller.signal.aborted) {
        setError(err instanceof Error ? err : new Error(String(err)));
      }
    } finally {
      if (abortRef.current === controller) {
        abortRef.current = null;
        setIsLoading(false);
      }
    }
  };

  return { output, isLoading, error, onGenerate, stop };
}

export function DemoEditor() {
  const [tocOpen, setTocOpen] = useState(true);
  const [commentsOpen, setCommentsOpen] = useState(true);
  const ai = useMockAi();

  const app = useMemo(
    () =>
      defineExtension({
        name: "@shadcn-editor/demo",
        namespace: "shadcn-editor",
        dependencies: [
          RichTextExtension,
          HistoryExtension,
          TabIndentationExtension,
          ListExtension,
          CheckListExtension,
          HashtagExtension,
          LinkExtension,
          AutoLinkExtension,
          CodeExtension,
          LayoutExtension,
          EmojiExtension,
          EquationExtension,
          TableExtension,
          HorizontalRuleExtension,
          ImageExtension,
          MentionExtension,
          SpecialTextExtension,
          AutocompleteExtension,
          DragDropPasteExtension,
          TabFocusExtension,
          SpeechToTextExtension,
          ShortcutsExtension,
          CardExtension,
          CollapsibleExtension,
          DateTimeExtension,
          PullQuoteExtension,
          ReactReviewExtension,
          PollExtension,
          RubyExtension,
          YouTubeExtension,
          TwitterExtension,
          FigmaExtension,
          FormatStateExtension,
          ReactFindReplaceExtension,
          CommentExtension,
          ClearEditorExtension,
          ClipboardDOMImportExtension,
          configExtension(AutoFocusExtension, {
            defaultSelection: "rootStart",
          }),
        ],
        register: (editor) => {
          const comments = getExtensionDependencyFromEditor(
            editor,
            CommentExtension,
          ).output;
          editor.update(
            () => {
              const root = $getRoot();
              if (!root.isEmpty()) {
                return;
              }
              const threads = createSeedThreads();
              for (const thread of Object.values(threads)) {
                addComment(comments, thread);
              }
              $seedDocument(threads);
            },
            { tag: HISTORY_MERGE_TAG },
          );
          return registerMarkdownShortcuts(editor, EDITOR_TRANSFORMERS);
        },
        theme: editorTheme,
      }),
    [],
  );

  return (
    <TooltipProvider>
      <LanguageProvider>
        <LexicalExtensionComposer extension={app} contentEditable={null}>
          <EditorWrapper>
            <SidebarProvider className="h-full min-h-0 gap-3">
              <Sidebar
                collapsible="none"
                className={cn(
                  "shrink-0 overflow-hidden transition-[width,margin] duration-200 ease-linear",
                  tocOpen
                    ? "w-56 rounded-lg shadow-sm ring-1 ring-sidebar-border"
                    : "-me-3 w-0",
                )}
              >
                <SidebarContent className="w-56">
                  <TableOfContentsPlugin />
                </SidebarContent>
              </Sidebar>
              <div className="flex min-h-0 min-w-0 flex-1 flex-col overflow-hidden rounded-lg border border-input dark:bg-input/30">
                <Toolbar>
                  <PanelToggle
                    labelKey="tableOfContents"
                    icon={<TableOfContents />}
                    open={tocOpen}
                    onClick={() => setTocOpen((open) => !open)}
                  />
                  <AiToolbarPlugin />
                  <HistoryToolbarPlugin />
                  <BlockFormatToolbarPlugin />
                  <FontFamilyToolbarPlugin />
                  <FontSizeToolbarPlugin />
                  <ColorToolbarPlugin />
                  <TextFormatToolbarPlugin />
                  <LinkToolbarPlugin />
                  <RubyToolbarPlugin />
                  <ElementFormatToolbarPlugin />
                  <IndentToolbarPlugin />
                  <BlockInsert>
                    <InsertCodeBlockPlugin />
                    <InsertColumnsPlugin />
                    <InsertEmojiPlugin />
                    <InsertEquationPlugin />
                    <InsertHorizontalRulePlugin />
                    <InsertImagePlugin />
                    <InsertTablePlugin />
                  </BlockInsert>
                  <FindReplaceToolbarPlugin />
                  <ClearToolbarPlugin />
                  <ImportExportToolbarPlugin
                    transformers={EDITOR_TRANSFORMERS}
                  />
                  <PanelToggle
                    className="ms-auto"
                    labelKey="comments"
                    icon={<MessageSquareText />}
                    open={commentsOpen}
                    onClick={() => setCommentsOpen((open) => !open)}
                  />
                </Toolbar>
                <div className="relative min-w-0 flex-1 overflow-y-auto">
                  <ContentEditable variant="draggable" />
                  <DraggableBlockPlugin />
                  <FloatingToolbarPlugin>
                    <AiToolbarPlugin />
                    <TextFormatToolbarPlugin formats="basic" />
                    <LinkToolbarPlugin />
                    <RubyToolbarPlugin />
                  </FloatingToolbarPlugin>
                  <LinkEditorPlugin />
                  <RubyEditorPlugin />
                  <AiEditorPlugin
                    output={ai.output}
                    isLoading={ai.isLoading}
                    error={ai.error}
                    onGenerate={ai.onGenerate}
                    onStop={ai.stop}
                    transformers={EDITOR_TRANSFORMERS}
                  />
                  <TableHoverActionsPlugin />
                  <EmojiPickerPlugin />
                  <MentionPlugin />
                  <AutoEmbedPlugin />
                  <ContextMenuPlugin />
                  <ComponentPicker>
                    <AiPickerPlugin />
                    <ParagraphPickerPlugin />
                    <HeadingPickerPlugin />
                    <TablePickerPlugin />
                    <NumberedListPickerPlugin />
                    <BulletedListPickerPlugin />
                    <CheckListPickerPlugin />
                    <QuotePickerPlugin />
                    <CodePickerPlugin />
                    <DividerPickerPlugin />
                    <ColumnsPickerPlugin />
                    <ImagePickerPlugin />
                    <CardPickerPlugin />
                    <CollapsiblePickerPlugin />
                    <DateTimePickerPlugin />
                    <PullQuotePickerPlugin />
                    <ReviewPickerPlugin />
                    <PollPickerPlugin />
                  </ComponentPicker>
                </div>
                <ActivityBar>
                  <div className="flex items-center gap-3">
                    <CountPlugin />
                  </div>
                  <div className="ms-auto flex items-center gap-3">
                    <SpeechToTextPlugin />
                    <ReadOnlyTogglePlugin />
                    <ShortcutPlugin />
                    <LanguageSelectorPlugin />
                  </div>
                </ActivityBar>
              </div>
              <Sidebar
                collapsible="none"
                className={cn(
                  "shrink-0 overflow-hidden transition-[width,margin] duration-200 ease-linear",
                  commentsOpen
                    ? "w-64 rounded-lg shadow-sm ring-1 ring-sidebar-border"
                    : "-ms-3 w-0",
                )}
              >
                <SidebarContent className="w-64">
                  <CommentsPanel />
                </SidebarContent>
              </Sidebar>
              <CommentPlugin />
            </SidebarProvider>
          </EditorWrapper>
        </LexicalExtensionComposer>
      </LanguageProvider>
    </TooltipProvider>
  );
}

function PanelToggle({
  labelKey,
  icon,
  open,
  onClick,
  className,
}: {
  labelKey: "tableOfContents" | "comments";
  icon: React.ReactNode;
  open: boolean;
  onClick: () => void;
  className?: string;
}) {
  const { t } = useTranslation();
  const title = t[labelKey];
  return (
    <ButtonGroup className={className}>
      <Tooltip>
        <TooltipTrigger
          render={
            <Button
              variant="outline"
              size="icon-sm"
              aria-label={title}
              aria-pressed={open}
              data-state={open ? "on" : "off"}
              className="data-[state=on]:bg-accent"
              onClick={onClick}
            >
              {icon}
            </Button>
          }
        />
        <TooltipContent>{title}</TooltipContent>
      </Tooltip>
    </ButtonGroup>
  );
}

function EditorWrapper({ children }: { children: React.ReactNode }) {
  const { language, dir } = useLanguage();
  return (
    <DirectionProvider direction={dir}>
      <div
        dir={dir}
        lang={language}
        className="flex h-svh w-full flex-col bg-background p-3"
      >
        {children}
      </div>
    </DirectionProvider>
  );
}
