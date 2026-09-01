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

import { FormatStateExtension } from "@/components/editor/extensions/format-state"
import { RubyExtension } from "@/components/editor/extensions/ruby"
import { $createRubyNode } from "@/components/editor/nodes/ruby-node"
import { ContentEditable } from "@/components/editor/plugins/content-editable"
import { FloatingToolbarPlugin } from "@/components/editor/plugins/floating/floating-toolbar-plugin"
import { RubyEditorPlugin } from "@/components/editor/plugins/floating/ruby-editor-plugin"
import {
  LanguageProvider,
  useLanguage,
} from "@/components/editor/plugins/i18n-plugin"
import { RubyToolbarPlugin } from "@/components/editor/plugins/toolbar/ruby-toolbar-plugin"
import { Toolbar } from "@/components/editor/plugins/toolbar/toolbar-plugin"
import { editorTheme } from "@/components/editor/theme"
import { DirectionProvider } from "@/components/ui/direction"

export function RubyEditor() {
  const app = useMemo(
    () =>
      defineExtension({
        name: "@shadcn-editor/editor",
        namespace: "shadcn-editor",
        dependencies: [
          RichTextExtension,
          HistoryExtension,
          FormatStateExtension,
          RubyExtension,
          ClipboardDOMImportExtension,
        ],
        $initialEditorState: () => {
          $getRoot().append(
            $createParagraphNode().append(
              $createTextNode(
                "Ruby annotations place a small reading above the text, like "
              ),
              $createRubyNode("漢字", "かんじ"),
              $createTextNode(" in Japanese or "),
              $createRubyNode("北京", "Běijīng"),
              $createTextNode(" in Chinese.")
            ),
            $createParagraphNode().append(
              $createTextNode(
                "Select any text and use the toolbar button to add your own annotation."
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
            <RubyToolbarPlugin />
          </Toolbar>
          <div className="relative min-w-0 flex-1 overflow-y-auto">
            <ContentEditable variant="toolbar" />
            <FloatingToolbarPlugin />
            <RubyEditorPlugin />
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
