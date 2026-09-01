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

import { DateTimeExtension } from "@/components/editor/extensions/datetime"
import { $createDateTimeNode } from "@/components/editor/nodes/datetime-node"
import { ComponentPicker } from "@/components/editor/plugins/component-picker/component-picker-plugin"
import { DateTimePickerPlugin } from "@/components/editor/plugins/component-picker/datetime-picker-plugin"
import { HeadingPickerPlugin } from "@/components/editor/plugins/component-picker/heading-picker-plugin"
import { ParagraphPickerPlugin } from "@/components/editor/plugins/component-picker/paragraph-picker-plugin"
import { ContentEditable } from "@/components/editor/plugins/content-editable"
import {
  LanguageProvider,
  useLanguage,
} from "@/components/editor/plugins/i18n-plugin"
import { editorTheme } from "@/components/editor/theme"
import { DirectionProvider } from "@/components/ui/direction"

export function DateTimeEditor() {
  const app = useMemo(
    () =>
      defineExtension({
        name: "@shadcn-editor/editor",
        namespace: "shadcn-editor",
        dependencies: [
          RichTextExtension,
          HistoryExtension,
          DateTimeExtension,
          ClipboardDOMImportExtension,
        ],
        $initialEditorState: () => {
          $getRoot().append(
            $createParagraphNode().append(
              $createTextNode("The launch review is scheduled for "),
              $createDateTimeNode(new Date(2026, 0, 15)),
              $createTextNode(" and the follow-up lands on "),
              $createDateTimeNode(new Date(2026, 1, 2)),
              $createTextNode(".")
            ),
            $createParagraphNode().append(
              $createTextNode(
                "Click a date pill to change it with the calendar, or type / to insert another one."
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
            <ContentEditable />
            <ComponentPicker>
              <ParagraphPickerPlugin />
              <HeadingPickerPlugin />
              <DateTimePickerPlugin />
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
