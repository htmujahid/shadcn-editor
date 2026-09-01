import { useMemo } from "react"

import {
  $createParagraphNode,
  $createTextNode,
  $getRoot,
  defineExtension,
} from "lexical"

import { LexicalExtensionComposer } from "@lexical/react/LexicalExtensionComposer"
import { RichTextExtension } from "@lexical/rich-text"

import { ImageExtension } from "@/components/editor/extensions/image"
import { $createImageNode } from "@/components/editor/nodes/image-node"
import { BlockInsert } from "@/components/editor/plugins/block-insert/block-insert-plugin"
import { InsertImagePlugin } from "@/components/editor/plugins/block-insert/insert-image-plugin"
import { ContentEditable } from "@/components/editor/plugins/content-editable"
import {
  LanguageProvider,
  useLanguage,
} from "@/components/editor/plugins/i18n-plugin"
import { Toolbar } from "@/components/editor/plugins/toolbar/toolbar-plugin"
import { editorTheme } from "@/components/editor/theme"
import { DirectionProvider } from "@/components/ui/direction"

export function ImageEditor() {
  const app = useMemo(
    () =>
      defineExtension({
        name: "@shadcn-editor/editor",
        dependencies: [RichTextExtension, ImageExtension],
        $initialEditorState: () => {
          $getRoot().append(
            $createParagraphNode().append(
              $createTextNode(
                "Images sit inside the document flow. Click one to select it, then drag a corner handle to resize it."
              )
            ),
            $createParagraphNode().append(
              $createImageNode({
                altText: "Gradient placeholder",
                maxWidth: 400,
                src: "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='800' height='400'%3E%3Cdefs%3E%3ClinearGradient id='g' x1='0' y1='0' x2='1' y2='1'%3E%3Cstop offset='0' stop-color='%236366f1'/%3E%3Cstop offset='1' stop-color='%23ec4899'/%3E%3C/linearGradient%3E%3C/defs%3E%3Crect width='800' height='400' fill='url(%23g)'/%3E%3C/svg%3E",
              })
            ),
            $createParagraphNode().append(
              $createTextNode(
                "Use the insert menu in the toolbar to add your own image from a URL or a file."
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
              <InsertImagePlugin />
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
