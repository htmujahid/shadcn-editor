import { useMemo } from "react"

import {
  $createParagraphNode,
  $createTextNode,
  $getRoot,
  defineExtension,
} from "lexical"

import { LexicalExtensionComposer } from "@lexical/react/LexicalExtensionComposer"
import { RichTextExtension } from "@lexical/rich-text"

import { LayoutExtension } from "@/components/editor/extensions/layout"
import {
  $createLayoutContainerNode,
  $createLayoutItemNode,
} from "@/components/editor/nodes/layout-node"
import { BlockInsert } from "@/components/editor/plugins/block-insert/block-insert-plugin"
import { InsertColumnsPlugin } from "@/components/editor/plugins/block-insert/insert-columns-plugin"
import { ContentEditable } from "@/components/editor/plugins/content-editable"
import {
  LanguageProvider,
  useLanguage,
} from "@/components/editor/plugins/i18n-plugin"
import { Toolbar } from "@/components/editor/plugins/toolbar/toolbar-plugin"
import { editorTheme } from "@/components/editor/theme"
import { DirectionProvider } from "@/components/ui/direction"

export function ColumnsEditor() {
  const app = useMemo(
    () =>
      defineExtension({
        name: "@shadcn-editor/editor",
        dependencies: [RichTextExtension, LayoutExtension],
        $initialEditorState: () => {
          $getRoot().append(
            $createLayoutContainerNode("1fr 1fr").append(
              $createLayoutItemNode().append(
                $createParagraphNode().append(
                  $createTextNode(
                    "The left column holds its own blocks. Click inside and write as usual."
                  )
                )
              ),
              $createLayoutItemNode().append(
                $createParagraphNode().append(
                  $createTextNode(
                    "The right column flows independently, so the two sides never interleave."
                  )
                )
              )
            ),
            $createParagraphNode().append(
              $createTextNode(
                "Use the insert menu in the toolbar to add another layout with two, three, or mixed width columns."
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
              <InsertColumnsPlugin />
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
