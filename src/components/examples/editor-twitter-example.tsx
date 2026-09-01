import { useMemo } from "react"

import {
  $createParagraphNode,
  $createTextNode,
  $getRoot,
  defineExtension,
} from "lexical"

import { LexicalExtensionComposer } from "@lexical/react/LexicalExtensionComposer"
import { RichTextExtension } from "@lexical/rich-text"

import { TwitterExtension } from "@/components/editor/extensions/twitter"
import { $createTweetNode } from "@/components/editor/nodes/tweet-node"
import { BlockInsert } from "@/components/editor/plugins/block-insert/block-insert-plugin"
import { InsertTwitterPlugin } from "@/components/editor/plugins/block-insert/insert-twitter-plugin"
import { ContentEditable } from "@/components/editor/plugins/content-editable"
import {
  LanguageProvider,
  useLanguage,
} from "@/components/editor/plugins/i18n-plugin"
import { Toolbar } from "@/components/editor/plugins/toolbar/toolbar-plugin"
import { editorTheme } from "@/components/editor/theme"
import { DirectionProvider } from "@/components/ui/direction"

export function TwitterEditor() {
  const app = useMemo(
    () =>
      defineExtension({
        name: "@shadcn-editor/editor",
        dependencies: [RichTextExtension, TwitterExtension],
        $initialEditorState: () => {
          $getRoot().append(
            $createParagraphNode().append(
              $createTextNode(
                "Use the toolbar button above to embed a post from X by its link. Here is the very first one:"
              )
            ),
            $createTweetNode("20"),
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
          <Toolbar>
            <BlockInsert>
              <InsertTwitterPlugin />
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
