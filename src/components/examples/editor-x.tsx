import { useMemo } from "react";

import {
  $createParagraphNode,
  $createTextNode,
  $getRoot,
  defineExtension,
} from "lexical";

import { ClipboardDOMImportExtension } from "@lexical/clipboard";
import { $createCodeNode } from "@lexical/code-core";
import {
  ClearEditorExtension,
  HorizontalRuleExtension,
  TabIndentationExtension,
} from "@lexical/extension";
import { HashtagExtension } from "@lexical/hashtag";
import { HistoryExtension } from "@lexical/history";
import {
  $createListItemNode,
  $createListNode,
  CheckListExtension,
  ListExtension,
} from "@lexical/list";
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
import {
  $createHeadingNode,
  $createQuoteNode,
  RichTextExtension,
} from "@lexical/rich-text";
import { TableExtension } from "@lexical/table";

import { AutoLinkExtension } from "@/components/editor/extensions/auto-link";
import { AutocompleteExtension } from "@/components/editor/extensions/autocomplete";
import { CardExtension } from "@/components/editor/extensions/card";
import { CodeExtension } from "@/components/editor/extensions/code";
import { CollapsibleExtension } from "@/components/editor/extensions/collapsible";
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
import { DraggableBlockPlugin } from "@/components/editor/plugins/draggable-block-plugin";
import { EmojiPickerPlugin } from "@/components/editor/plugins/emoji-picker-plugin";
import { ReactFindReplaceExtension } from "@/components/editor/plugins/decorator/find-replace-panel";
import { FloatingToolbarPlugin } from "@/components/editor/plugins/floating/floating-toolbar-plugin";
import { LinkEditorPlugin } from "@/components/editor/plugins/floating/link-editor-plugin";
import { ReactReviewExtension } from "@/components/editor/plugins/decorator/review-plugin";
import { RubyEditorPlugin } from "@/components/editor/plugins/floating/ruby-editor-plugin";
import { TableHoverActionsPlugin } from "@/components/editor/plugins/floating/table-hover-actions-plugin";
import {
  LanguageProvider,
  LanguageSelectorPlugin,
  useLanguage,
} from "@/components/editor/plugins/i18n-plugin";
import { MentionPlugin } from "@/components/editor/plugins/mention-plugin";
import { BlockFormatToolbarPlugin } from "@/components/editor/plugins/toolbar/block-format-toolbar-plugin";
import { ClearToolbarPlugin } from "@/components/editor/plugins/toolbar/clear-toolbar-plugin";
import { ColorToolbarPlugin } from "@/components/editor/plugins/toolbar/color-toolbar-plugin";
import { ElementFormatToolbarPlugin } from "@/components/editor/plugins/toolbar/element-format-toolbar-plugin";
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
import { DirectionProvider } from "@/components/ui/direction";

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

export function EditorX() {
  const app = useMemo(
    () =>
      defineExtension({
        name: "@shadcn-editor/editor",
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
          ClearEditorExtension,
          ClipboardDOMImportExtension,
        ],
        $initialEditorState: () => {
          $getRoot().append(
            $createHeadingNode("h1").append($createTextNode("Editor X")),
            $createParagraphNode().append(
              $createTextNode("A "),
              $createTextNode("complete").toggleFormat("bold"),
              $createTextNode(" writing surface: "),
              $createTextNode("rich text").toggleFormat("italic"),
              $createTextNode(", "),
              $createTextNode("markdown shortcuts").toggleFormat("underline"),
              $createTextNode(", and "),
              $createTextNode("blocks").toggleFormat("code"),
              $createTextNode(", all in one place."),
            ),
            $createHeadingNode("h2").append(
              $createTextNode("Everything included"),
            ),
            $createListNode("bullet").append(
              $createListItemNode().append(
                $createTextNode(
                  "Tables, images, equations, and embeds from the toolbar",
                ),
              ),
              $createListItemNode().append(
                $createTextNode('A slash menu: type "/" to insert any block'),
              ),
              $createListItemNode().append(
                $createTextNode(
                  "Drag handles, a floating toolbar, mentions, and emoji",
                ),
              ),
            ),
            $createQuoteNode().append(
              $createTextNode(
                "Select any text to format it in place, or grab a drag handle to rearrange the page.",
              ),
            ),
            $createCodeNode("markdown").append(
              $createTextNode("## Markdown works too, as you type"),
            ),
            $createParagraphNode().append(
              $createTextNode(
                'Try it now: press "/" on the empty line below, or explore the toolbar above.',
              ),
            ),
            $createParagraphNode(),
          );
        },
        register: (editor) =>
          registerMarkdownShortcuts(editor, EDITOR_TRANSFORMERS),
        theme: editorTheme,
      }),
    [],
  );

  return (
    <LanguageProvider>
      <LexicalExtensionComposer extension={app} contentEditable={null}>
        <EditorWrapper>
          <Toolbar>
            <HistoryToolbarPlugin />
            <BlockFormatToolbarPlugin />
            <FontFamilyToolbarPlugin />
            <FontSizeToolbarPlugin />
            <ColorToolbarPlugin />
            <TextFormatToolbarPlugin formats="basic" />
            <ElementFormatToolbarPlugin formats="basic" />
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
            <ClearToolbarPlugin />
            <ImportExportToolbarPlugin transformers={EDITOR_TRANSFORMERS} />
          </Toolbar>
          <div className="relative min-w-0 flex-1 overflow-y-auto">
            <ContentEditable variant="draggable" />
            <DraggableBlockPlugin />
            <FloatingToolbarPlugin>
              <LinkToolbarPlugin />
              <RubyToolbarPlugin />
            </FloatingToolbarPlugin>
            <LinkEditorPlugin />
            <RubyEditorPlugin />
            <TableHoverActionsPlugin />
            <EmojiPickerPlugin />
            <MentionPlugin />
            <AutoEmbedPlugin />
            <ContextMenuPlugin />
            <ComponentPicker>
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
        </EditorWrapper>
      </LexicalExtensionComposer>
    </LanguageProvider>
  );
}

function EditorWrapper({ children }: { children: React.ReactNode }) {
  const { language, dir } = useLanguage();
  return (
    <DirectionProvider direction={dir}>
      <div
        dir={dir}
        lang={language}
        className="relative flex min-h-0 w-full flex-1 flex-col overflow-hidden rounded-lg border border-input dark:bg-input/30"
      >
        {children}
      </div>
    </DirectionProvider>
  );
}
