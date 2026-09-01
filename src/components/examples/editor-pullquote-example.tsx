import { useMemo } from "react"

import {
  $createParagraphNode,
  $createTextNode,
  $getRoot,
  defineExtension,
} from "lexical"

import { ClipboardDOMImportExtension } from "@lexical/clipboard"
import { HistoryExtension } from "@lexical/history"
import { LexicalExtensionComposer } from "@lexical/react/LexicalExtensionComposer"
import { RichTextExtension } from "@lexical/rich-text"

import { PullQuoteExtension } from "@/components/editor/extensions/pullquote"
import { $createPullQuoteNode } from "@/components/editor/nodes/pullquote-node"
import { ComponentPicker } from "@/components/editor/plugins/component-picker/component-picker-plugin"
import { HeadingPickerPlugin } from "@/components/editor/plugins/component-picker/heading-picker-plugin"
import { ParagraphPickerPlugin } from "@/components/editor/plugins/component-picker/paragraph-picker-plugin"
import { PullQuotePickerPlugin } from "@/components/editor/plugins/component-picker/pullquote-picker-plugin"
import { QuotePickerPlugin } from "@/components/editor/plugins/component-picker/quote-picker-plugin"
import { ContentEditable } from "@/components/editor/plugins/content-editable"
import {
  LanguageProvider,
  useLanguage,
} from "@/components/editor/plugins/i18n-plugin"
import { editorTheme } from "@/components/editor/theme"
import { DirectionProvider } from "@/components/ui/direction"

export function PullQuoteEditor() {
  const app = useMemo(
    () =>
      defineExtension({
        name: "@shadcn-editor/editor",
        namespace: "shadcn-editor",
        dependencies: [
          RichTextExtension,
          HistoryExtension,
          PullQuoteExtension,
          ClipboardDOMImportExtension,
        ],
        $initialEditorState: () => {
          $getRoot().append(
            $createParagraphNode().append(
              $createTextNode(
                'A pull quote lifts a key line out of the text, with an attribution underneath. Both parts are editable. Type "/pullquote" on an empty line to insert one:'
              )
            ),
            $createPullQuoteNode(),
            $createParagraphNode()
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
            <ContentEditable />
            <ComponentPicker>
              <ParagraphPickerPlugin />
              <HeadingPickerPlugin />
              <QuotePickerPlugin />
              <PullQuotePickerPlugin />
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
