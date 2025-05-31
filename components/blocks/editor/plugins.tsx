import { useState } from "react"
import {
  CHECK_LIST,
  ELEMENT_TRANSFORMERS,
  MULTILINE_ELEMENT_TRANSFORMERS,
  TEXT_FORMAT_TRANSFORMERS,
  TEXT_MATCH_TRANSFORMERS,
} from "@lexical/markdown"
import { AutoFocusPlugin } from "@lexical/react/LexicalAutoFocusPlugin"
import { CheckListPlugin } from "@lexical/react/LexicalCheckListPlugin"
import { ClearEditorPlugin } from "@lexical/react/LexicalClearEditorPlugin"
import { ClickableLinkPlugin } from "@lexical/react/LexicalClickableLinkPlugin"
import { LexicalErrorBoundary } from "@lexical/react/LexicalErrorBoundary"
import { HashtagPlugin } from "@lexical/react/LexicalHashtagPlugin"
import { HistoryPlugin } from "@lexical/react/LexicalHistoryPlugin"
import { HorizontalRulePlugin } from "@lexical/react/LexicalHorizontalRulePlugin"
import { ListPlugin } from "@lexical/react/LexicalListPlugin"
import { MarkdownShortcutPlugin } from "@lexical/react/LexicalMarkdownShortcutPlugin"
import { RichTextPlugin } from "@lexical/react/LexicalRichTextPlugin"
import { TabIndentationPlugin } from "@lexical/react/LexicalTabIndentationPlugin"
import { TablePlugin } from "@lexical/react/LexicalTablePlugin"

import { ContentEditable } from "@/registry/new-york-v4/editor/editor-ui/content-editable"
import { ActionsPlugin } from "@/registry/new-york-v4/editor/plugins/actions/actions-plugin"
import { CharacterLimitPlugin } from "@/registry/new-york-v4/editor/plugins/actions/character-limit-plugin"
import { ClearEditorActionPlugin } from "@/registry/new-york-v4/editor/plugins/actions/clear-editor-plugin"
import { CounterCharacterPlugin } from "@/registry/new-york-v4/editor/plugins/actions/counter-character-plugin"
import { EditModeTogglePlugin } from "@/registry/new-york-v4/editor/plugins/actions/edit-mode-toggle-plugin"
import { ImportExportPlugin } from "@/registry/new-york-v4/editor/plugins/actions/import-export-plugin"
import { MarkdownTogglePlugin } from "@/registry/new-york-v4/editor/plugins/actions/markdown-toggle-plugin"
import { MaxLengthPlugin } from "@/registry/new-york-v4/editor/plugins/actions/max-length-plugin"
import { ShareContentPlugin } from "@/registry/new-york-v4/editor/plugins/actions/share-content-plugin"
import { SpeechToTextPlugin } from "@/registry/new-york-v4/editor/plugins/actions/speech-to-text-plugin"
import { TreeViewPlugin } from "@/registry/new-york-v4/editor/plugins/actions/tree-view-plugin"
import { AutoLinkPlugin } from "@/registry/new-york-v4/editor/plugins/auto-link-plugin"
import { AutocompletePlugin } from "@/registry/new-york-v4/editor/plugins/autocomplete-plugin"
import { CodeActionMenuPlugin } from "@/registry/new-york-v4/editor/plugins/code-action-menu-plugin"
import { CodeHighlightPlugin } from "@/registry/new-york-v4/editor/plugins/code-highlight-plugin"
import { CollapsiblePlugin } from "@/registry/new-york-v4/editor/plugins/collapsible-plugin"
import { ComponentPickerMenuPlugin } from "@/registry/new-york-v4/editor/plugins/component-picker-menu-plugin"
import { ContextMenuPlugin } from "@/registry/new-york-v4/editor/plugins/context-menu-plugin"
import { DragDropPastePlugin } from "@/registry/new-york-v4/editor/plugins/drag-drop-paste-plugin"
import { DraggableBlockPlugin } from "@/registry/new-york-v4/editor/plugins/draggable-block-plugin"
import { AutoEmbedPlugin } from "@/registry/new-york-v4/editor/plugins/embeds/auto-embed-plugin"
import { FigmaPlugin } from "@/registry/new-york-v4/editor/plugins/embeds/figma-plugin"
import { TwitterPlugin } from "@/registry/new-york-v4/editor/plugins/embeds/twitter-plugin"
import { YouTubePlugin } from "@/registry/new-york-v4/editor/plugins/embeds/youtube-plugin"
import { EmojiPickerPlugin } from "@/registry/new-york-v4/editor/plugins/emoji-picker-plugin"
import { EmojisPlugin } from "@/registry/new-york-v4/editor/plugins/emojis-plugin"
import { EquationsPlugin } from "@/registry/new-york-v4/editor/plugins/equations-plugin"
import { ExcalidrawPlugin } from "@/registry/new-york-v4/editor/plugins/excalidraw-plugin"
import { FloatingLinkEditorPlugin } from "@/registry/new-york-v4/editor/plugins/floating-link-editor-plugin"
import { FloatingTextFormatToolbarPlugin } from "@/registry/new-york-v4/editor/plugins/floating-text-format-plugin"
import { ImagesPlugin } from "@/registry/new-york-v4/editor/plugins/images-plugin"
import { InlineImagePlugin } from "@/registry/new-york-v4/editor/plugins/inline-image-plugin"
import { KeywordsPlugin } from "@/registry/new-york-v4/editor/plugins/keywords-plugin"
import { LayoutPlugin } from "@/registry/new-york-v4/editor/plugins/layout-plugin"
import { LinkPlugin } from "@/registry/new-york-v4/editor/plugins/link-plugin"
import { ListMaxIndentLevelPlugin } from "@/registry/new-york-v4/editor/plugins/list-max-indent-level-plugin"
import { MentionsPlugin } from "@/registry/new-york-v4/editor/plugins/mentions-plugin"
import { PageBreakPlugin } from "@/registry/new-york-v4/editor/plugins/page-break-plugin"
import { AlignmentPickerPlugin } from "@/registry/new-york-v4/editor/plugins/picker/alignment-picker-plugin"
import { BulletedListPickerPlugin } from "@/registry/new-york-v4/editor/plugins/picker/bulleted-list-picker-plugin"
import { CheckListPickerPlugin } from "@/registry/new-york-v4/editor/plugins/picker/check-list-picker-plugin"
import { CodePickerPlugin } from "@/registry/new-york-v4/editor/plugins/picker/code-picker-plugin"
import { CollapsiblePickerPlugin } from "@/registry/new-york-v4/editor/plugins/picker/collapsible-picker-plugin"
import { ColumnsLayoutPickerPlugin } from "@/registry/new-york-v4/editor/plugins/picker/columns-layout-picker-plugin"
import { DividerPickerPlugin } from "@/registry/new-york-v4/editor/plugins/picker/divider-picker-plugin"
import { EmbedsPickerPlugin } from "@/registry/new-york-v4/editor/plugins/picker/embeds-picker-plugin"
import { EquationPickerPlugin } from "@/registry/new-york-v4/editor/plugins/picker/equation-picker-plugin"
import { ExcalidrawPickerPlugin } from "@/registry/new-york-v4/editor/plugins/picker/excalidraw-picker-plugin"
import { HeadingPickerPlugin } from "@/registry/new-york-v4/editor/plugins/picker/heading-picker-plugin"
import { ImagePickerPlugin } from "@/registry/new-york-v4/editor/plugins/picker/image-picker-plugin"
import { NumberedListPickerPlugin } from "@/registry/new-york-v4/editor/plugins/picker/numbered-list-picker-plugin"
import { PageBreakPickerPlugin } from "@/registry/new-york-v4/editor/plugins/picker/page-break-picker-plugin"
import { ParagraphPickerPlugin } from "@/registry/new-york-v4/editor/plugins/picker/paragraph-picker-plugin"
import { PollPickerPlugin } from "@/registry/new-york-v4/editor/plugins/picker/poll-picker-plugin"
import { QuotePickerPlugin } from "@/registry/new-york-v4/editor/plugins/picker/quote-picker-plugin"
import {
  DynamicTablePickerPlugin,
  TablePickerPlugin,
} from "@/registry/new-york-v4/editor/plugins/picker/table-picker-plugin"
import { PollPlugin } from "@/registry/new-york-v4/editor/plugins/poll-plugin"
import { TabFocusPlugin } from "@/registry/new-york-v4/editor/plugins/tab-focus-plugin"
import { TableActionMenuPlugin } from "@/registry/new-york-v4/editor/plugins/table-action-menu-plugin"
import { TableCellResizerPlugin } from "@/registry/new-york-v4/editor/plugins/table-cell-resizer-plugin"
import { TableHoverActionsPlugin } from "@/registry/new-york-v4/editor/plugins/table-hover-actions-plugin"
import { BlockFormatDropDown } from "@/registry/new-york-v4/editor/plugins/toolbar/block-format-toolbar-plugin"
import { FormatBulletedList } from "@/registry/new-york-v4/editor/plugins/toolbar/block-format/format-bulleted-list"
import { FormatCheckList } from "@/registry/new-york-v4/editor/plugins/toolbar/block-format/format-check-list"
import { FormatCodeBlock } from "@/registry/new-york-v4/editor/plugins/toolbar/block-format/format-code-block"
import { FormatHeading } from "@/registry/new-york-v4/editor/plugins/toolbar/block-format/format-heading"
import { FormatNumberedList } from "@/registry/new-york-v4/editor/plugins/toolbar/block-format/format-numbered-list"
import { FormatParagraph } from "@/registry/new-york-v4/editor/plugins/toolbar/block-format/format-paragraph"
import { FormatQuote } from "@/registry/new-york-v4/editor/plugins/toolbar/block-format/format-quote"
import { BlockInsertPlugin } from "@/registry/new-york-v4/editor/plugins/toolbar/block-insert-plugin"
import { InsertCollapsibleContainer } from "@/registry/new-york-v4/editor/plugins/toolbar/block-insert/insert-collapsible-container"
import { InsertColumnsLayout } from "@/registry/new-york-v4/editor/plugins/toolbar/block-insert/insert-columns-layout"
import { InsertEmbeds } from "@/registry/new-york-v4/editor/plugins/toolbar/block-insert/insert-embeds"
import { InsertExcalidraw } from "@/registry/new-york-v4/editor/plugins/toolbar/block-insert/insert-excalidraw"
import { InsertHorizontalRule } from "@/registry/new-york-v4/editor/plugins/toolbar/block-insert/insert-horizontal-rule"
import { InsertImage } from "@/registry/new-york-v4/editor/plugins/toolbar/block-insert/insert-image"
import { InsertInlineImage } from "@/registry/new-york-v4/editor/plugins/toolbar/block-insert/insert-inline-image"
import { InsertPageBreak } from "@/registry/new-york-v4/editor/plugins/toolbar/block-insert/insert-page-break"
import { InsertPoll } from "@/registry/new-york-v4/editor/plugins/toolbar/block-insert/insert-poll"
import { InsertTable } from "@/registry/new-york-v4/editor/plugins/toolbar/block-insert/insert-table"
import { ClearFormattingToolbarPlugin } from "@/registry/new-york-v4/editor/plugins/toolbar/clear-formatting-toolbar-plugin"
import { CodeLanguageToolbarPlugin } from "@/registry/new-york-v4/editor/plugins/toolbar/code-language-toolbar-plugin"
import { ElementFormatToolbarPlugin } from "@/registry/new-york-v4/editor/plugins/toolbar/element-format-toolbar-plugin"
import { FontBackgroundToolbarPlugin } from "@/registry/new-york-v4/editor/plugins/toolbar/font-background-toolbar-plugin"
import { FontColorToolbarPlugin } from "@/registry/new-york-v4/editor/plugins/toolbar/font-color-toolbar-plugin"
import { FontFamilyToolbarPlugin } from "@/registry/new-york-v4/editor/plugins/toolbar/font-family-toolbar-plugin"
import { FontFormatToolbarPlugin } from "@/registry/new-york-v4/editor/plugins/toolbar/font-format-toolbar-plugin"
import { FontSizeToolbarPlugin } from "@/registry/new-york-v4/editor/plugins/toolbar/font-size-toolbar-plugin"
import { HistoryToolbarPlugin } from "@/registry/new-york-v4/editor/plugins/toolbar/history-toolbar-plugin"
import { LinkToolbarPlugin } from "@/registry/new-york-v4/editor/plugins/toolbar/link-toolbar-plugin"
import { SubSuperToolbarPlugin } from "@/registry/new-york-v4/editor/plugins/toolbar/subsuper-toolbar-plugin"
import { ToolbarPlugin } from "@/registry/new-york-v4/editor/plugins/toolbar/toolbar-plugin"
import { TypingPerfPlugin } from "@/registry/new-york-v4/editor/plugins/typing-pref-plugin"
import { EMOJI } from "@/registry/new-york-v4/editor/transformers/markdown-emoji-transformer"
import { EQUATION } from "@/registry/new-york-v4/editor/transformers/markdown-equation-transformer"
import { HR } from "@/registry/new-york-v4/editor/transformers/markdown-hr-transformer"
import { IMAGE } from "@/registry/new-york-v4/editor/transformers/markdown-image-transformer"
import { TABLE } from "@/registry/new-york-v4/editor/transformers/markdown-table-transformer"
import { TWEET } from "@/registry/new-york-v4/editor/transformers/markdown-tweet-transformer"
import { Separator } from "@/registry/new-york-v4/ui/separator"

const placeholder = "Press / for commands..."
const maxLength = 500

export function Plugins({}) {
  const [floatingAnchorElem, setFloatingAnchorElem] =
    useState<HTMLDivElement | null>(null)

  const onRef = (_floatingAnchorElem: HTMLDivElement) => {
    if (_floatingAnchorElem !== null) {
      setFloatingAnchorElem(_floatingAnchorElem)
    }
  }

  return (
    <div className="relative">
      <ToolbarPlugin>
        {({ blockType }) => (
          <div className="vertical-align-middle sticky top-0 z-10 flex items-center gap-2 overflow-auto border-b p-1">
            <HistoryToolbarPlugin />
            <Separator orientation="vertical" className="!h-7" />
            <BlockFormatDropDown>
              <FormatParagraph />
              <FormatHeading levels={["h1", "h2", "h3"]} />
              <FormatNumberedList />
              <FormatBulletedList />
              <FormatCheckList />
              <FormatCodeBlock />
              <FormatQuote />
            </BlockFormatDropDown>
            {blockType === "code" ? (
              <CodeLanguageToolbarPlugin />
            ) : (
              <>
                <FontFamilyToolbarPlugin />
                <FontSizeToolbarPlugin />
                <Separator orientation="vertical" className="!h-7" />
                <FontFormatToolbarPlugin format="bold" />
                <FontFormatToolbarPlugin format="italic" />
                <FontFormatToolbarPlugin format="underline" />
                <FontFormatToolbarPlugin format="strikethrough" />
                <Separator orientation="vertical" className="!h-7" />
                <SubSuperToolbarPlugin />
                <LinkToolbarPlugin />
                <Separator orientation="vertical" className="!h-7" />
                <ClearFormattingToolbarPlugin />
                <Separator orientation="vertical" className="!h-7" />
                <FontColorToolbarPlugin />
                <FontBackgroundToolbarPlugin />
                <Separator orientation="vertical" className="!h-7" />
                <ElementFormatToolbarPlugin />
                <Separator orientation="vertical" className="!h-7" />
                <BlockInsertPlugin>
                  <InsertHorizontalRule />
                  <InsertPageBreak />
                  <InsertImage />
                  <InsertInlineImage />
                  <InsertCollapsibleContainer />
                  <InsertExcalidraw />
                  <InsertTable />
                  <InsertPoll />
                  <InsertColumnsLayout />
                  <InsertEmbeds />
                </BlockInsertPlugin>
              </>
            )}
          </div>
        )}
      </ToolbarPlugin>
      <div className="relative">
        <AutoFocusPlugin />
        <RichTextPlugin
          contentEditable={
            <div className="">
              <div className="" ref={onRef}>
                <ContentEditable
                  placeholder={placeholder}
                  className="ContentEditable__root relative block h-[calc(100vh-570px)] min-h-72 min-h-full overflow-auto px-8 py-4 focus:outline-none"
                />
              </div>
            </div>
          }
          ErrorBoundary={LexicalErrorBoundary}
        />

        <ClickableLinkPlugin />
        <CheckListPlugin />
        <HorizontalRulePlugin />
        <TablePlugin />
        <ListPlugin />
        <TabIndentationPlugin />
        <HashtagPlugin />
        <HistoryPlugin />

        <MentionsPlugin />
        <PageBreakPlugin />
        <DraggableBlockPlugin anchorElem={floatingAnchorElem} />
        <KeywordsPlugin />
        <EmojisPlugin />
        <ImagesPlugin />
        <InlineImagePlugin />
        <ExcalidrawPlugin />
        <TableCellResizerPlugin />
        <TableHoverActionsPlugin anchorElem={floatingAnchorElem} />
        <TableActionMenuPlugin
          anchorElem={floatingAnchorElem}
          cellMerge={true}
        />
        <PollPlugin />
        <LayoutPlugin />
        <EquationsPlugin />
        <CollapsiblePlugin />

        <AutoEmbedPlugin />
        <FigmaPlugin />
        <TwitterPlugin />
        <YouTubePlugin />

        <CodeHighlightPlugin />
        <CodeActionMenuPlugin anchorElem={floatingAnchorElem} />

        <MarkdownShortcutPlugin
          transformers={[
            TABLE,
            HR,
            IMAGE,
            EMOJI,
            EQUATION,
            TWEET,
            CHECK_LIST,
            ...ELEMENT_TRANSFORMERS,
            ...MULTILINE_ELEMENT_TRANSFORMERS,
            ...TEXT_FORMAT_TRANSFORMERS,
            ...TEXT_MATCH_TRANSFORMERS,
          ]}
        />
        <TypingPerfPlugin />
        <TabFocusPlugin />
        <AutocompletePlugin />
        <AutoLinkPlugin />
        <LinkPlugin />

        <ComponentPickerMenuPlugin
          baseOptions={[
            ParagraphPickerPlugin(),
            HeadingPickerPlugin({ n: 1 }),
            HeadingPickerPlugin({ n: 2 }),
            HeadingPickerPlugin({ n: 3 }),
            TablePickerPlugin(),
            CheckListPickerPlugin(),
            NumberedListPickerPlugin(),
            BulletedListPickerPlugin(),
            QuotePickerPlugin(),
            CodePickerPlugin(),
            DividerPickerPlugin(),
            PageBreakPickerPlugin(),
            ExcalidrawPickerPlugin(),
            PollPickerPlugin(),
            EmbedsPickerPlugin({ embed: "figma" }),
            EmbedsPickerPlugin({ embed: "tweet" }),
            EmbedsPickerPlugin({ embed: "youtube-video" }),
            EquationPickerPlugin(),
            ImagePickerPlugin(),
            CollapsiblePickerPlugin(),
            ColumnsLayoutPickerPlugin(),
            AlignmentPickerPlugin({ alignment: "left" }),
            AlignmentPickerPlugin({ alignment: "center" }),
            AlignmentPickerPlugin({ alignment: "right" }),
            AlignmentPickerPlugin({ alignment: "justify" }),
          ]}
          dynamicOptionsFn={DynamicTablePickerPlugin}
        />

        <ContextMenuPlugin />
        <DragDropPastePlugin />
        <EmojiPickerPlugin />

        <FloatingLinkEditorPlugin anchorElem={floatingAnchorElem} />
        <FloatingTextFormatToolbarPlugin anchorElem={floatingAnchorElem} />

        <ListMaxIndentLevelPlugin />
      </div>
      <ActionsPlugin>
        <div className="clear-both flex items-center justify-between gap-2 overflow-auto border-t p-1">
          <div className="flex flex-1 justify-start">
            <MaxLengthPlugin maxLength={maxLength} />
            <CharacterLimitPlugin maxLength={maxLength} charset="UTF-16" />
          </div>
          <div>
            <CounterCharacterPlugin charset="UTF-16" />
          </div>
          <div className="flex flex-1 justify-end">
            <SpeechToTextPlugin />
            <ShareContentPlugin />
            <ImportExportPlugin />
            <MarkdownTogglePlugin
              shouldPreserveNewLinesInMarkdown={true}
              transformers={[
                TABLE,
                HR,
                IMAGE,
                EMOJI,
                EQUATION,
                TWEET,
                CHECK_LIST,
                ...ELEMENT_TRANSFORMERS,
                ...MULTILINE_ELEMENT_TRANSFORMERS,
                ...TEXT_FORMAT_TRANSFORMERS,
                ...TEXT_MATCH_TRANSFORMERS,
              ]}
            />
            <EditModeTogglePlugin />
            <>
              <ClearEditorActionPlugin />
              <ClearEditorPlugin />
            </>
            <TreeViewPlugin />
          </div>
        </div>
      </ActionsPlugin>
    </div>
  )
}
