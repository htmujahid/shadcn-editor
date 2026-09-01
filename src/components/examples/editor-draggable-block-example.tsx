import { useMemo } from "react"

import {
  $createParagraphNode,
  $createTextNode,
  $getRoot,
  defineExtension,
} from "lexical"

import { HorizontalRuleExtension } from "@lexical/extension"
import { CheckListExtension, ListExtension } from "@lexical/list"
import { LexicalExtensionComposer } from "@lexical/react/LexicalExtensionComposer"
import {
  $createHeadingNode,
  $createQuoteNode,
  RichTextExtension,
} from "@lexical/rich-text"
import { TableExtension } from "@lexical/table"

import { CodeExtension } from "@/components/editor/extensions/code"
import { ImageExtension } from "@/components/editor/extensions/image"
import { LayoutExtension } from "@/components/editor/extensions/layout"
import { BulletedListPickerPlugin } from "@/components/editor/plugins/component-picker/bulleted-list-picker-plugin"
import { CheckListPickerPlugin } from "@/components/editor/plugins/component-picker/check-list-picker-plugin"
import { CodePickerPlugin } from "@/components/editor/plugins/component-picker/code-picker-plugin"
import { ColumnsPickerPlugin } from "@/components/editor/plugins/component-picker/columns-picker-plugin"
import { ComponentPicker } from "@/components/editor/plugins/component-picker/component-picker-plugin"
import { DividerPickerPlugin } from "@/components/editor/plugins/component-picker/divider-picker-plugin"
import { HeadingPickerPlugin } from "@/components/editor/plugins/component-picker/heading-picker-plugin"
import { ImagePickerPlugin } from "@/components/editor/plugins/component-picker/image-picker-plugin"
import { NumberedListPickerPlugin } from "@/components/editor/plugins/component-picker/numbered-list-picker-plugin"
import { ParagraphPickerPlugin } from "@/components/editor/plugins/component-picker/paragraph-picker-plugin"
import { QuotePickerPlugin } from "@/components/editor/plugins/component-picker/quote-picker-plugin"
import { TablePickerPlugin } from "@/components/editor/plugins/component-picker/table-picker-plugin"
import { ContentEditable } from "@/components/editor/plugins/content-editable"
import { DraggableBlockPlugin } from "@/components/editor/plugins/draggable-block-plugin"
import {
  LanguageProvider,
  useLanguage,
} from "@/components/editor/plugins/i18n-plugin"
import { editorTheme } from "@/components/editor/theme"
import { DirectionProvider } from "@/components/ui/direction"

export function DraggableBlockEditor() {
  const app = useMemo(
    () =>
      defineExtension({
        name: "@shadcn-editor/editor",
        namespace: "shadcn-editor",
        dependencies: [
          RichTextExtension,
          ListExtension,
          CheckListExtension,
          CodeExtension,
          TableExtension,
          HorizontalRuleExtension,
          LayoutExtension,
          ImageExtension,
        ],
        $initialEditorState: () => {
          $getRoot().append(
            $createHeadingNode("h3").append($createTextNode("Grab the handle")),
            $createParagraphNode().append(
              $createTextNode(
                "Hover any block and a drag handle appears at its edge. Drag it up or down to reorder the document."
              )
            ),
            $createQuoteNode().append(
              $createTextNode(
                "Quotes, headings, and paragraphs all move as whole blocks."
              )
            ),
            $createParagraphNode().append(
              $createTextNode(
                'The plus button on the handle inserts a "/" prompt on the same line for the component picker.'
              )
            )
          )
        },
        theme: editorTheme,
      }),
    []
  )

  return (
    <LanguageProvider>
      <LexicalExtensionComposer extension={app} contentEditable={null}>
        <EditorWrapper>
          <div className="relative min-w-0 flex-1 overflow-y-auto">
            <ContentEditable variant="draggable" />
            <DraggableBlockPlugin />
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
            </ComponentPicker>
          </div>
        </EditorWrapper>
      </LexicalExtensionComposer>
    </LanguageProvider>
  )
}

function EditorWrapper({ children }: { children: React.ReactNode }) {
  const { language, dir } = useLanguage()
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
  )
}
