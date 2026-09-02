import { useEffect, useRef, useState } from "react";

import { Link, useSearchParams } from "wouter";

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
import { ChatEditor } from "@/components/examples/editor-chat-example";
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
import { Skeleton } from "@/components/ui/skeleton";
import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";
import { Button, buttonVariants } from "@/components/ui/button";
import { TooltipProvider } from "@/components/ui/tooltip";
import { cn } from "@/lib/utils";

const categories = [
  { id: "formatting", label: "Formatting" },
  { id: "blocks", label: "Blocks & Layout" },
  { id: "media", label: "Media & Embeds" },
  { id: "menus", label: "Toolbars & Menus" },
  { id: "behavior", label: "Editor Behavior" },
  { id: "ai", label: "AI & Collaboration" },
] as const;

type Category = (typeof categories)[number]["id"];

type Example = {
  title: string;
  file: string;
  category: Category;
  Example: React.ComponentType;
  wide?: boolean;
};

const examples: Example[] = [
  {
    title: "Rich Text",
    category: "menus",
    file: "editor-rich-text-example",
    Example: RichTextEditor,
  },
  {
    title: "Floating Toolbar",
    category: "menus",
    file: "editor-floating-toolbar-example",
    Example: FloatingToolbarEditor,
  },
  {
    title: "Link",
    category: "formatting",
    file: "editor-link-example",
    Example: LinkEditor,
  },
  {
    title: "Text Format Basic",
    category: "formatting",
    file: "editor-text-format-basic-example",
    Example: TextFormatBasicEditor,
  },
  {
    title: "Text Format",
    category: "formatting",
    file: "editor-text-format-example",
    Example: TextFormatEditor,
  },
  {
    title: "History",
    category: "behavior",
    file: "editor-history-example",
    Example: HistoryEditor,
  },
  {
    title: "Alignment Basic",
    category: "formatting",
    file: "editor-alignment-basic-example",
    Example: AlignmentBasicEditor,
  },
  {
    title: "Alignment",
    category: "formatting",
    file: "editor-alignment-example",
    Example: AlignmentEditor,
  },
  {
    title: "Indent",
    category: "formatting",
    file: "editor-indent-example",
    Example: IndentEditor,
  },
  {
    title: "Font",
    category: "formatting",
    file: "editor-font-example",
    Example: FontEditor,
  },
  {
    title: "Color",
    category: "formatting",
    file: "editor-color-example",
    Example: ColorEditor,
  },
  {
    title: "Find & Replace",
    category: "behavior",
    file: "editor-find-replace-example",
    Example: FindReplaceEditor,
  },
  {
    title: "Block Format",
    category: "blocks",
    file: "editor-block-format-example",
    Example: BlockFormatEditor,
  },
  {
    title: "List",
    category: "blocks",
    file: "editor-list-example",
    Example: ListEditor,
  },
  {
    title: "Check List",
    category: "blocks",
    file: "editor-check-list-example",
    Example: CheckListEditor,
  },
  {
    title: "Nested List",
    category: "blocks",
    file: "editor-nested-list-example",
    Example: NestedListEditor,
  },
  {
    title: "Table",
    category: "blocks",
    file: "editor-table-example",
    Example: TableEditor,
  },
  {
    title: "Image",
    category: "media",
    file: "editor-image-example",
    Example: ImageEditor,
  },
  {
    title: "Code",
    category: "blocks",
    file: "editor-code-example",
    Example: CodeEditor,
  },
  {
    title: "Columns",
    category: "blocks",
    file: "editor-columns-example",
    Example: ColumnsEditor,
  },
  {
    title: "Horizontal Rule",
    category: "blocks",
    file: "editor-horizontal-rule-example",
    Example: HorizontalRuleEditor,
  },
  {
    title: "Emoji",
    category: "formatting",
    file: "editor-emoji-example",
    Example: EmojiEditor,
  },
  {
    title: "Equation",
    category: "blocks",
    file: "editor-equation-example",
    Example: EquationEditor,
  },
  {
    title: "Block Insert",
    category: "blocks",
    file: "editor-block-insert-example",
    Example: BlockInsertEditor,
  },
  {
    title: "Special Text",
    category: "formatting",
    file: "editor-special-text-example",
    Example: SpecialTextEditor,
  },
  {
    title: "Markdown Shortcuts",
    category: "formatting",
    file: "editor-markdown-example",
    Example: MarkdownEditor,
  },
  {
    title: "Import & Export",
    category: "behavior",
    file: "editor-import-export-example",
    Example: ImportExportEditor,
  },
  {
    title: "Clear",
    category: "behavior",
    file: "editor-clear-example",
    Example: ClearEditor,
  },
  {
    title: "Mention",
    category: "menus",
    file: "editor-mention-example",
    Example: MentionEditor,
  },
  {
    title: "Component Picker",
    category: "menus",
    file: "editor-component-picker-example",
    Example: ComponentPickerEditor,
  },
  {
    title: "Draggable Block",
    category: "menus",
    file: "editor-draggable-block-example",
    Example: DraggableBlockEditor,
  },
  {
    title: "Word Count",
    category: "behavior",
    file: "editor-word-count-example",
    Example: WordCountEditor,
  },
  {
    title: "Max Length",
    category: "behavior",
    file: "editor-max-length-example",
    Example: MaxLengthEditor,
  },
  {
    title: "I18n",
    category: "behavior",
    file: "editor-i18n-example",
    Example: I18nEditor,
  },
  {
    title: "Read Only",
    category: "behavior",
    file: "editor-read-only-example",
    Example: ReadOnlyEditor,
  },
  {
    title: "Speech to Text",
    category: "behavior",
    file: "editor-speech-to-text-example",
    Example: SpeechToTextEditor,
  },
  {
    title: "Shortcuts",
    category: "behavior",
    file: "editor-shortcuts-example",
    Example: ShortcutsEditor,
  },
  {
    title: "YouTube",
    category: "media",
    file: "editor-youtube-example",
    Example: YouTubeEditor,
  },
  {
    title: "Twitter",
    category: "media",
    file: "editor-twitter-example",
    Example: TwitterEditor,
  },
  {
    title: "Figma",
    category: "media",
    file: "editor-figma-example",
    Example: FigmaEditor,
  },
  {
    title: "Auto Embed",
    category: "media",
    file: "editor-auto-embed-example",
    Example: AutoEmbedEditor,
  },
  {
    title: "Auto Link",
    category: "formatting",
    file: "editor-auto-link-example",
    Example: AutoLinkEditor,
  },
  {
    title: "Autocomplete",
    category: "menus",
    file: "editor-autocomplete-example",
    Example: AutocompleteEditor,
  },
  {
    title: "Tab Focus",
    category: "behavior",
    file: "editor-tab-focus-example",
    Example: TabFocusEditor,
  },
  {
    title: "Drag Drop Paste",
    category: "behavior",
    file: "editor-drag-drop-paste-example",
    Example: DragDropPasteEditor,
  },
  {
    title: "Context Menu",
    category: "menus",
    file: "editor-context-menu-example",
    Example: ContextMenuEditor,
  },
  {
    title: "Hashtag",
    category: "formatting",
    file: "editor-hashtag-example",
    Example: HashtagEditor,
  },
  {
    title: "Card",
    category: "blocks",
    file: "editor-card-example",
    Example: CardEditor,
  },
  {
    title: "Collapsible",
    category: "blocks",
    file: "editor-collapsible-example",
    Example: CollapsibleEditor,
  },
  {
    title: "Date & Time",
    category: "blocks",
    file: "editor-datetime-example",
    Example: DateTimeEditor,
  },
  {
    title: "Pull Quote",
    category: "blocks",
    file: "editor-pullquote-example",
    Example: PullQuoteEditor,
  },
  {
    title: "Review",
    category: "ai",
    file: "editor-review-example",
    Example: ReviewEditor,
  },
  {
    title: "Poll",
    category: "blocks",
    file: "editor-poll-example",
    Example: PollEditor,
  },
  {
    title: "Ruby",
    category: "formatting",
    file: "editor-ruby-example",
    Example: RubyEditor,
  },
  {
    title: "AI (Core)",
    category: "ai",
    file: "editor-ai-example",
    Example: AiEditor,
  },
  {
    title: "AI (Vercel AI SDK)",
    category: "ai",
    file: "editor-ai-sdk-example",
    Example: AiSdkEditor,
  },
  {
    title: "AI (TanStack AI)",
    category: "ai",
    file: "editor-ai-tanstack-example",
    Example: AiTanstackEditor,
  },
  {
    title: "Chat",
    category: "ai",
    file: "editor-chat-example",
    Example: ChatEditor,
  },
  {
    title: "Table of Contents",
    file: "editor-table-of-contents-example",
    category: "behavior",
    Example: TableOfContentsEditor,
    wide: true,
  },
  {
    title: "Comments",
    file: "editor-comments-example",
    category: "ai",
    Example: CommentsEditor,
    wide: true,
  },
];

function LazyMount({ children }: { children: React.ReactNode }) {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el || visible) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) setVisible(true);
      },
      { rootMargin: "300px 0px" },
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, [visible]);

  return (
    <div ref={ref} className="flex min-h-0 flex-1 flex-col">
      {visible ? children : <Skeleton className="h-full w-full rounded-lg" />}
    </div>
  );
}

function isCategory(value: string | null): value is Category {
  return categories.some((c) => c.id === value);
}

export function ExamplesPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const param = searchParams.get("category");
  const active: Category | "all" = isCategory(param) ? param : "all";

  const filtered =
    active === "all"
      ? examples
      : examples.filter((example) => example.category === active);

  const countFor = (id: Category) =>
    examples.filter((example) => example.category === id).length;

  const setCategory = (id: Category | "all") => {
    setSearchParams(
      (prev) => {
        if (id === "all") prev.delete("category");
        else prev.set("category", id);
        return prev;
      },
      { replace: true },
    );
  };

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
              A collection of {examples.length} copy-and-paste editor examples
              built with Lexical and shadcn/ui. Each example demonstrates a
              single feature: accessible, localized, and RTL-ready.
            </p>
            <div className="mt-6 flex items-center gap-2">
              <Link href="/demo" className={cn(buttonVariants())}>
                Try the Full Demo
              </Link>
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
            className="mx-auto w-full max-w-[1400px] scroll-mt-20 px-4 pb-16 md:px-6"
          >
            <div className="sticky top-14 z-10 -mx-4 mb-6 border-b border-border/60 bg-background/95 px-4 py-3 backdrop-blur supports-[backdrop-filter]:bg-background/80 md:-mx-6 md:px-6">
              <div className="flex flex-wrap items-center gap-2">
                <Button
                  size="sm"
                  variant={active === "all" ? "default" : "outline"}
                  onClick={() => setCategory("all")}
                >
                  All
                  <span className="text-xs opacity-70">{examples.length}</span>
                </Button>
                {categories.map((category) => (
                  <Button
                    key={category.id}
                    size="sm"
                    variant={active === category.id ? "default" : "outline"}
                    onClick={() => setCategory(category.id)}
                  >
                    {category.label}
                    <span className="text-xs opacity-70">
                      {countFor(category.id)}
                    </span>
                  </Button>
                ))}
              </div>
            </div>
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
              {filtered.map(({ title, file, Example, wide }) => (
                <div
                  key={file}
                  className={cn(
                    "flex h-[480px] flex-col gap-1",
                    wide && "md:col-span-2",
                  )}
                >
                  <div className="flex items-center justify-between">
                    <h2 className="text-sm font-medium">{title}</h2>
                    <CodeDialog
                      title={title}
                      path={`/src/components/examples/${file}.tsx`}
                    />
                  </div>
                  <LazyMount>
                    <Example />
                  </LazyMount>
                </div>
              ))}
            </div>
          </section>
        </main>
        <SiteFooter />
      </div>
    </TooltipProvider>
  );
}
