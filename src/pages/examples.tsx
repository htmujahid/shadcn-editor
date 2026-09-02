import { useEffect } from "react";

import { CodeDialog } from "@/components/code-dialog";
import { AiEditor } from "@/components/examples/editor-ai-example";
import { AiSdkEditor } from "@/components/examples/editor-ai-sdk-example";
import { AiTanstackEditor } from "@/components/examples/editor-ai-tanstack-example";
import { AlignmentBasicEditor } from "@/components/examples/editor-alignment-basic-example";
import { AlignmentEditor } from "@/components/examples/editor-alignment-example";
import { AutoEmbedEditor } from "@/components/examples/editor-auto-embed-example";
import { AutoLinkEditor } from "@/components/examples/editor-auto-link-example";
import { AutocompleteEditor } from "@/components/examples/editor-autocomplete-example";
import { BlockFormatEditor } from "@/components/examples/editor-block-format-example";
import { BlockInsertEditor } from "@/components/examples/editor-block-insert-example";
import { CardEditor } from "@/components/examples/editor-card-example";
import { CheckListEditor } from "@/components/examples/editor-check-list-example";
import { ClearEditor } from "@/components/examples/editor-clear-example";
import { CodeEditor } from "@/components/examples/editor-code-example";
import { CollapsibleEditor } from "@/components/examples/editor-collapsible-example";
import { ColorEditor } from "@/components/examples/editor-color-example";
import { ColumnsEditor } from "@/components/examples/editor-columns-example";
import { CommentsEditor } from "@/components/examples/editor-comments-example";
import { ComponentPickerEditor } from "@/components/examples/editor-component-picker-example";
import { ContextMenuEditor } from "@/components/examples/editor-context-menu-example";
import { DateTimeEditor } from "@/components/examples/editor-datetime-example";
import { DragDropPasteEditor } from "@/components/examples/editor-drag-drop-paste-example";
import { DraggableBlockEditor } from "@/components/examples/editor-draggable-block-example";
import { EmojiEditor } from "@/components/examples/editor-emoji-example";
import { EquationEditor } from "@/components/examples/editor-equation-example";
import { FigmaEditor } from "@/components/examples/editor-figma-example";
import { FindReplaceEditor } from "@/components/examples/editor-find-replace-example";
import { FloatingToolbarEditor } from "@/components/examples/editor-floating-toolbar-example";
import { FontEditor } from "@/components/examples/editor-font-example";
import { HashtagEditor } from "@/components/examples/editor-hashtag-example";
import { HistoryEditor } from "@/components/examples/editor-history-example";
import { HorizontalRuleEditor } from "@/components/examples/editor-horizontal-rule-example";
import { I18nEditor } from "@/components/examples/editor-i18n-example";
import { ImageEditor } from "@/components/examples/editor-image-example";
import { ImportExportEditor } from "@/components/examples/editor-import-export-example";
import { IndentEditor } from "@/components/examples/editor-indent-example";
import { LinkEditor } from "@/components/examples/editor-link-example";
import { ListEditor } from "@/components/examples/editor-list-example";
import { MarkdownEditor } from "@/components/examples/editor-markdown-example";
import { MaxLengthEditor } from "@/components/examples/editor-max-length-example";
import { MentionEditor } from "@/components/examples/editor-mention-example";
import { NestedListEditor } from "@/components/examples/editor-nested-list-example";
import { PollEditor } from "@/components/examples/editor-poll-example";
import { PullQuoteEditor } from "@/components/examples/editor-pullquote-example";
import { ReadOnlyEditor } from "@/components/examples/editor-read-only-example";
import { ReviewEditor } from "@/components/examples/editor-review-example";
import { RichTextEditor } from "@/components/examples/editor-rich-text-example";
import { RubyEditor } from "@/components/examples/editor-ruby-example";
import { ShortcutsEditor } from "@/components/examples/editor-shortcuts-example";
import { SpecialTextEditor } from "@/components/examples/editor-special-text-example";
import { SpeechToTextEditor } from "@/components/examples/editor-speech-to-text-example";
import { TabFocusEditor } from "@/components/examples/editor-tab-focus-example";
import { TableEditor } from "@/components/examples/editor-table-example";
import { TableOfContentsEditor } from "@/components/examples/editor-table-of-contents-example";
import { TextFormatBasicEditor } from "@/components/examples/editor-text-format-basic-example";
import { TextFormatEditor } from "@/components/examples/editor-text-format-example";
import { TwitterEditor } from "@/components/examples/editor-twitter-example";
import { WordCountEditor } from "@/components/examples/editor-word-count-example";
import { YouTubeEditor } from "@/components/examples/editor-youtube-example";
import { GitHubIcon } from "@/components/github-icon";
import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";
import { buttonVariants } from "@/components/ui/button";
import { TooltipProvider } from "@/components/ui/tooltip";
import { cn } from "@/lib/utils";

const examples: {
  title: string;
  file: string;
  Example: React.ComponentType;
}[] = [
  {
    title: "Rich Text",
    file: "editor-rich-text-example",
    Example: RichTextEditor,
  },
  {
    title: "Floating Toolbar",
    file: "editor-floating-toolbar-example",
    Example: FloatingToolbarEditor,
  },
  { title: "Link", file: "editor-link-example", Example: LinkEditor },
  {
    title: "Text Format Basic",
    file: "editor-text-format-basic-example",
    Example: TextFormatBasicEditor,
  },
  {
    title: "Text Format",
    file: "editor-text-format-example",
    Example: TextFormatEditor,
  },
  { title: "History", file: "editor-history-example", Example: HistoryEditor },
  {
    title: "Alignment Basic",
    file: "editor-alignment-basic-example",
    Example: AlignmentBasicEditor,
  },
  {
    title: "Alignment",
    file: "editor-alignment-example",
    Example: AlignmentEditor,
  },
  { title: "Indent", file: "editor-indent-example", Example: IndentEditor },
  { title: "Font", file: "editor-font-example", Example: FontEditor },
  { title: "Color", file: "editor-color-example", Example: ColorEditor },
  {
    title: "Find & Replace",
    file: "editor-find-replace-example",
    Example: FindReplaceEditor,
  },
  {
    title: "Block Format",
    file: "editor-block-format-example",
    Example: BlockFormatEditor,
  },
  { title: "List", file: "editor-list-example", Example: ListEditor },
  {
    title: "Check List",
    file: "editor-check-list-example",
    Example: CheckListEditor,
  },
  {
    title: "Nested List",
    file: "editor-nested-list-example",
    Example: NestedListEditor,
  },
  { title: "Table", file: "editor-table-example", Example: TableEditor },
  { title: "Image", file: "editor-image-example", Example: ImageEditor },
  { title: "Code", file: "editor-code-example", Example: CodeEditor },
  { title: "Columns", file: "editor-columns-example", Example: ColumnsEditor },
  {
    title: "Horizontal Rule",
    file: "editor-horizontal-rule-example",
    Example: HorizontalRuleEditor,
  },
  { title: "Emoji", file: "editor-emoji-example", Example: EmojiEditor },
  {
    title: "Equation",
    file: "editor-equation-example",
    Example: EquationEditor,
  },
  {
    title: "Block Insert",
    file: "editor-block-insert-example",
    Example: BlockInsertEditor,
  },
  {
    title: "Special Text",
    file: "editor-special-text-example",
    Example: SpecialTextEditor,
  },
  {
    title: "Markdown Shortcuts",
    file: "editor-markdown-example",
    Example: MarkdownEditor,
  },
  {
    title: "Import & Export",
    file: "editor-import-export-example",
    Example: ImportExportEditor,
  },
  { title: "Clear", file: "editor-clear-example", Example: ClearEditor },
  { title: "Mention", file: "editor-mention-example", Example: MentionEditor },
  {
    title: "Component Picker",
    file: "editor-component-picker-example",
    Example: ComponentPickerEditor,
  },
  {
    title: "Draggable Block",
    file: "editor-draggable-block-example",
    Example: DraggableBlockEditor,
  },
  {
    title: "Word Count",
    file: "editor-word-count-example",
    Example: WordCountEditor,
  },
  {
    title: "Max Length",
    file: "editor-max-length-example",
    Example: MaxLengthEditor,
  },
  { title: "I18n", file: "editor-i18n-example", Example: I18nEditor },
  {
    title: "Read Only",
    file: "editor-read-only-example",
    Example: ReadOnlyEditor,
  },
  {
    title: "Speech to Text",
    file: "editor-speech-to-text-example",
    Example: SpeechToTextEditor,
  },
  {
    title: "Shortcuts",
    file: "editor-shortcuts-example",
    Example: ShortcutsEditor,
  },
  { title: "YouTube", file: "editor-youtube-example", Example: YouTubeEditor },
  { title: "Twitter", file: "editor-twitter-example", Example: TwitterEditor },
  { title: "Figma", file: "editor-figma-example", Example: FigmaEditor },
  {
    title: "Auto Embed",
    file: "editor-auto-embed-example",
    Example: AutoEmbedEditor,
  },
  {
    title: "Auto Link",
    file: "editor-auto-link-example",
    Example: AutoLinkEditor,
  },
  {
    title: "Autocomplete",
    file: "editor-autocomplete-example",
    Example: AutocompleteEditor,
  },
  {
    title: "Tab Focus",
    file: "editor-tab-focus-example",
    Example: TabFocusEditor,
  },
  {
    title: "Drag Drop Paste",
    file: "editor-drag-drop-paste-example",
    Example: DragDropPasteEditor,
  },
  {
    title: "Context Menu",
    file: "editor-context-menu-example",
    Example: ContextMenuEditor,
  },
  { title: "Hashtag", file: "editor-hashtag-example", Example: HashtagEditor },
  { title: "Card", file: "editor-card-example", Example: CardEditor },
  {
    title: "Collapsible",
    file: "editor-collapsible-example",
    Example: CollapsibleEditor,
  },
  {
    title: "Date & Time",
    file: "editor-datetime-example",
    Example: DateTimeEditor,
  },
  {
    title: "Pull Quote",
    file: "editor-pullquote-example",
    Example: PullQuoteEditor,
  },
  { title: "Review", file: "editor-review-example", Example: ReviewEditor },
  { title: "Poll", file: "editor-poll-example", Example: PollEditor },
  { title: "Ruby", file: "editor-ruby-example", Example: RubyEditor },
  { title: "AI (Core)", file: "editor-ai-example", Example: AiEditor },
  {
    title: "AI (Vercel AI SDK)",
    file: "editor-ai-sdk-example",
    Example: AiSdkEditor,
  },
  {
    title: "AI (TanStack AI)",
    file: "editor-ai-tanstack-example",
    Example: AiTanstackEditor,
  },
];

export function ExamplesPage() {
  useEffect(() => {
    document.title = "Examples - Shadcn Editor";
  }, []);

  return (
    <TooltipProvider>
      <div className="flex min-h-svh flex-col bg-background">
        <SiteHeader />
        <main className="flex-1">
          <section className="mx-auto w-full max-w-[1400px] px-4 pt-10 pb-8 md:px-6 md:pt-14">
            <a
              href="https://github.com/htmujahid/shadcn-editor"
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center rounded-full border border-border/60 bg-muted/50 px-3 py-1 text-xs font-medium text-muted-foreground transition-colors hover:text-foreground"
            >
              Open Source · MIT License
            </a>
            <h1 className="mt-4 max-w-2xl text-3xl font-bold tracking-tight text-balance sm:text-4xl">
              Beautifully crafted rich text editors
            </h1>
            <p className="mt-3 max-w-2xl text-base text-balance text-muted-foreground sm:text-lg">
              A collection of {examples.length + 2} copy-and-paste editor
              examples built with Lexical and shadcn/ui. Each example
              demonstrates a single feature: accessible, localized, and
              RTL-ready.
            </p>
            <div className="mt-6 flex items-center gap-2">
              <a href="#examples" className={cn(buttonVariants())}>
                Browse Examples
              </a>
              <a
                href="https://github.com/htmujahid/shadcn-editor"
                target="_blank"
                rel="noreferrer"
                className={cn(buttonVariants({ variant: "outline" }))}
              >
                <GitHubIcon className="size-4" />
                GitHub
              </a>
            </div>
          </section>
          <section
            id="examples"
            className="mx-auto grid w-full max-w-[1400px] scroll-mt-20 grid-cols-1 gap-6 px-4 pb-16 md:grid-cols-2 md:px-6"
          >
            {examples.map(({ title, file, Example }) => (
              <div key={title} className="flex h-[480px] flex-col gap-1">
                <div className="flex items-center justify-between">
                  <h2 className="text-sm font-medium">{title}</h2>
                  <CodeDialog
                    title={title}
                    path={`/src/components/examples/${file}.tsx`}
                  />
                </div>
                <Example />
              </div>
            ))}
            <div className="flex h-[480px] flex-col gap-1 md:col-span-2">
              <div className="flex items-center justify-between">
                <h2 className="text-sm font-medium">Table of Contents</h2>
                <CodeDialog
                  title="Table of Contents"
                  path="/src/components/examples/editor-table-of-contents-example.tsx"
                />
              </div>
              <TableOfContentsEditor />
            </div>
            <div className="flex h-[480px] flex-col gap-1 md:col-span-2">
              <div className="flex items-center justify-between">
                <h2 className="text-sm font-medium">Comments</h2>
                <CodeDialog
                  title="Comments"
                  path="/src/components/examples/editor-comments-example.tsx"
                />
              </div>
              <CommentsEditor />
            </div>
          </section>
        </main>
        <SiteFooter />
      </div>
    </TooltipProvider>
  );
}
