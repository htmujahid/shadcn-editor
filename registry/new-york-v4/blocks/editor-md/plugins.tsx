import { useState } from "react"
import {
  CHECK_LIST,
  ELEMENT_TRANSFORMERS,
  MULTILINE_ELEMENT_TRANSFORMERS,
  TEXT_FORMAT_TRANSFORMERS,
  TEXT_MATCH_TRANSFORMERS,
} from "@lexical/markdown"
import { CheckListPlugin } from "@lexical/react/LexicalCheckListPlugin"
import { ClickableLinkPlugin } from "@lexical/react/LexicalClickableLinkPlugin"
import { LexicalErrorBoundary } from "@lexical/react/LexicalErrorBoundary"
import { HistoryPlugin } from "@lexical/react/LexicalHistoryPlugin"
import { HorizontalRulePlugin } from "@lexical/react/LexicalHorizontalRulePlugin"
import { ListPlugin } from "@lexical/react/LexicalListPlugin"
import { MarkdownShortcutPlugin } from "@lexical/react/LexicalMarkdownShortcutPlugin"
import { RichTextPlugin } from "@lexical/react/LexicalRichTextPlugin"
import { TabIndentationPlugin } from "@lexical/react/LexicalTabIndentationPlugin"
import { TablePlugin } from "@lexical/react/LexicalTablePlugin"

import { ContentEditable } from "@/registry/new-york-v4/editor/editor-ui/content-editable"
import { AutoLinkPlugin } from "@/registry/new-york-v4/editor/plugins/auto-link-plugin"
import { CodeActionMenuPlugin } from "@/registry/new-york-v4/editor/plugins/code-action-menu-plugin"
import { CodeHighlightPlugin } from "@/registry/new-york-v4/editor/plugins/code-highlight-plugin"
import { ComponentPickerMenuPlugin } from "@/registry/new-york-v4/editor/plugins/component-picker-menu-plugin"
import { DraggableBlockPlugin } from "@/registry/new-york-v4/editor/plugins/draggable-block-plugin"
import { FloatingLinkEditorPlugin } from "@/registry/new-york-v4/editor/plugins/floating-link-editor-plugin"
import { FloatingTextFormatToolbarPlugin } from "@/registry/new-york-v4/editor/plugins/floating-text-format-plugin"
import { ImagesPlugin } from "@/registry/new-york-v4/editor/plugins/images-plugin"
import { LinkPlugin } from "@/registry/new-york-v4/editor/plugins/link-plugin"
import { ListMaxIndentLevelPlugin } from "@/registry/new-york-v4/editor/plugins/list-max-indent-level-plugin"
import { AlignmentPickerPlugin } from "@/registry/new-york-v4/editor/plugins/picker/alignment-picker-plugin"
import { BulletedListPickerPlugin } from "@/registry/new-york-v4/editor/plugins/picker/bulleted-list-picker-plugin"
import { CheckListPickerPlugin } from "@/registry/new-york-v4/editor/plugins/picker/check-list-picker-plugin"
import { CodePickerPlugin } from "@/registry/new-york-v4/editor/plugins/picker/code-picker-plugin"
import { DividerPickerPlugin } from "@/registry/new-york-v4/editor/plugins/picker/divider-picker-plugin"
import { HeadingPickerPlugin } from "@/registry/new-york-v4/editor/plugins/picker/heading-picker-plugin"
import { ImagePickerPlugin } from "@/registry/new-york-v4/editor/plugins/picker/image-picker-plugin"
import { NumberedListPickerPlugin } from "@/registry/new-york-v4/editor/plugins/picker/numbered-list-picker-plugin"
import { ParagraphPickerPlugin } from "@/registry/new-york-v4/editor/plugins/picker/paragraph-picker-plugin"
import { QuotePickerPlugin } from "@/registry/new-york-v4/editor/plugins/picker/quote-picker-plugin"
import { TablePickerPlugin } from "@/registry/new-york-v4/editor/plugins/picker/table-picker-plugin"
import { BlockFormatDropDown } from "@/registry/new-york-v4/editor/plugins/toolbar/block-format-toolbar-plugin"
import { FormatBulletedList } from "@/registry/new-york-v4/editor/plugins/toolbar/block-format/format-bulleted-list"
import { FormatCheckList } from "@/registry/new-york-v4/editor/plugins/toolbar/block-format/format-check-list"
import { FormatCodeBlock } from "@/registry/new-york-v4/editor/plugins/toolbar/block-format/format-code-block"
import { FormatHeading } from "@/registry/new-york-v4/editor/plugins/toolbar/block-format/format-heading"
import { FormatNumberedList } from "@/registry/new-york-v4/editor/plugins/toolbar/block-format/format-numbered-list"
import { FormatParagraph } from "@/registry/new-york-v4/editor/plugins/toolbar/block-format/format-paragraph"
import { FormatQuote } from "@/registry/new-york-v4/editor/plugins/toolbar/block-format/format-quote"
import { CodeLanguageToolbarPlugin } from "@/registry/new-york-v4/editor/plugins/toolbar/code-language-toolbar-plugin"
import { ElementFormatToolbarPlugin } from "@/registry/new-york-v4/editor/plugins/toolbar/element-format-toolbar-plugin"
import { FontFormatToolbarPlugin } from "@/registry/new-york-v4/editor/plugins/toolbar/font-format-toolbar-plugin"
import { HistoryToolbarPlugin } from "@/registry/new-york-v4/editor/plugins/toolbar/history-toolbar-plugin"
import { HorizontalRuleToolbarPlugin } from "@/registry/new-york-v4/editor/plugins/toolbar/horizontal-rule-toolbar-plugin"
import { ImageToolbarPlugin } from "@/registry/new-york-v4/editor/plugins/toolbar/image-toolbar-plugin"
import { LinkToolbarPlugin } from "@/registry/new-york-v4/editor/plugins/toolbar/link-toolbar-plugin"
import { TableToolbarPlugin } from "@/registry/new-york-v4/editor/plugins/toolbar/table-toolbar-plugin"
import { ToolbarPlugin } from "@/registry/new-york-v4/editor/plugins/toolbar/toolbar-plugin"
import { HR } from "@/registry/new-york-v4/editor/transformers/markdown-hr-transformer"
import { IMAGE } from "@/registry/new-york-v4/editor/transformers/markdown-image-transformer"
import { TABLE } from "@/registry/new-york-v4/editor/transformers/markdown-table-transformer"

const placeholder = "Press / for commands..."

export function Plugins({}) {
  const [floatingAnchorElem, setFloatingAnchorElem] =
    useState<HTMLDivElement | null>(null)
  const [isLinkEditMode, setIsLinkEditMode] = useState<boolean>(false)

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
                <ElementFormatToolbarPlugin separator={false} />
                <FontFormatToolbarPlugin />
                <LinkToolbarPlugin setIsLinkEditMode={setIsLinkEditMode} />

                <HorizontalRuleToolbarPlugin />
                <ImageToolbarPlugin />
                <TableToolbarPlugin />
              </>
            )}
          </div>
        )}
      </ToolbarPlugin>
      <div className="relative">
        <RichTextPlugin
          contentEditable={
            <div className="">
              <div className="" ref={onRef}>
                <ContentEditable
                  placeholder={placeholder}
                  className="ContentEditable__root relative block h-[calc(100vh-50px)] min-h-72 overflow-auto px-8 py-4 focus:outline-none"
                />
              </div>
            </div>
          }
          ErrorBoundary={LexicalErrorBoundary}
        />
        <HistoryPlugin />

        <ListPlugin />
        <ListMaxIndentLevelPlugin />
        <CheckListPlugin />

        <TabIndentationPlugin />

        <ClickableLinkPlugin />
        <AutoLinkPlugin />
        <LinkPlugin />

        <FloatingLinkEditorPlugin
          anchorElem={floatingAnchorElem}
          isLinkEditMode={isLinkEditMode}
          setIsLinkEditMode={setIsLinkEditMode}
        />

        <CodeActionMenuPlugin anchorElem={floatingAnchorElem} />
        <CodeHighlightPlugin />

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
            ImagePickerPlugin(),
            AlignmentPickerPlugin({ alignment: "left" }),
            AlignmentPickerPlugin({ alignment: "center" }),
            AlignmentPickerPlugin({ alignment: "right" }),
            AlignmentPickerPlugin({ alignment: "justify" }),
          ]}
        />

        <FloatingTextFormatToolbarPlugin
          anchorElem={floatingAnchorElem}
          setIsLinkEditMode={setIsLinkEditMode}
        />

        <HorizontalRulePlugin />

        <ImagesPlugin />

        <TablePlugin />

        <DraggableBlockPlugin anchorElem={floatingAnchorElem} />

        <MarkdownShortcutPlugin
          transformers={[
            TABLE,
            HR,
            IMAGE,
            CHECK_LIST,
            ...ELEMENT_TRANSFORMERS,
            ...MULTILINE_ELEMENT_TRANSFORMERS,
            ...TEXT_FORMAT_TRANSFORMERS,
            ...TEXT_MATCH_TRANSFORMERS,
          ]}
        />
      </div>
    </div>
  )
}
