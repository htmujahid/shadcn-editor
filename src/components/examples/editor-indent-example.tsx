import { useMemo } from "react"

import {
  $createParagraphNode,
  $createTextNode,
  $getRoot,
  defineExtension,
} from "lexical"

import { TabIndentationExtension } from "@lexical/extension"
import { LexicalExtensionComposer } from "@lexical/react/LexicalExtensionComposer"
import { RichTextExtension } from "@lexical/rich-text"

import { FormatStateExtension } from "@/components/editor/extensions/format-state"
import { ContentEditable } from "@/components/editor/plugins/content-editable"
import {
  LanguageProvider,
  useLanguage,
} from "@/components/editor/plugins/i18n-plugin"
import { IndentToolbarPlugin } from "@/components/editor/plugins/toolbar/indent-toolbar-plugin"
import { Toolbar } from "@/components/editor/plugins/toolbar/toolbar-plugin"
import { editorTheme } from "@/components/editor/theme"
import { DirectionProvider } from "@/components/ui/direction"

export function IndentEditor() {
  const app = useMemo(
    () =>
      defineExtension({
        name: "@shadcn-editor/editor",
        dependencies: [
          RichTextExtension,
          TabIndentationExtension,
          FormatStateExtension,
        ],
        $initialEditorState: () => {
          const first = $createParagraphNode().append(
            $createTextNode("A top level thought.")
          )
          const second = $createParagraphNode().append(
            $createTextNode("A supporting detail, one level in.")
          )
          second.setIndent(1)
          const third = $createParagraphNode().append(
            $createTextNode("A finer point, nested one level deeper.")
          )
          third.setIndent(2)
          $getRoot().append(
            first,
            second,
            third,
            $createParagraphNode().append(
              $createTextNode(
                "Use the toolbar buttons or the Tab key to change the indent of any line."
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
          <Toolbar>
            <IndentToolbarPlugin />
          </Toolbar>
          <div className="relative min-w-0 flex-1 overflow-y-auto">
            <ContentEditable variant="toolbar" />
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
