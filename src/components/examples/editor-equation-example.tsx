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

import { EquationExtension } from "@/components/editor/extensions/equation"
import { $createEquationNode } from "@/components/editor/nodes/equation-node"
import { BlockInsert } from "@/components/editor/plugins/block-insert/block-insert-plugin"
import { InsertEquationPlugin } from "@/components/editor/plugins/block-insert/insert-equation-plugin"
import { ContentEditable } from "@/components/editor/plugins/content-editable"
import {
  LanguageProvider,
  useLanguage,
} from "@/components/editor/plugins/i18n-plugin"
import { Toolbar } from "@/components/editor/plugins/toolbar/toolbar-plugin"
import { editorTheme } from "@/components/editor/theme"
import { DirectionProvider } from "@/components/ui/direction"

export function EquationEditor() {
  const app = useMemo(
    () =>
      defineExtension({
        name: "@shadcn-editor/editor",
        namespace: "shadcn-editor",
        dependencies: [
          RichTextExtension,
          HistoryExtension,
          EquationExtension,
          ClipboardDOMImportExtension,
        ],
        $initialEditorState: () => {
          $getRoot().append(
            $createParagraphNode().append(
              $createTextNode("Einstein's identity "),
              $createEquationNode("E = mc^2", true),
              $createTextNode(
                " fits right inside a sentence, while bigger formulas get a block of their own:"
              )
            ),
            $createParagraphNode().append(
              $createEquationNode("\\int_0^1 x^2 \\, dx = \\frac{1}{3}", false)
            ),
            $createParagraphNode().append(
              $createTextNode(
                "Double click any formula to edit its LaTeX, or add a new one from the toolbar."
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
            <BlockInsert>
              <InsertEquationPlugin />
            </BlockInsert>
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
