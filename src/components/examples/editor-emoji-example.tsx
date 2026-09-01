import { useMemo } from "react"

import {
  $createParagraphNode,
  $createTextNode,
  $getRoot,
  defineExtension,
} from "lexical"

import { LexicalExtensionComposer } from "@lexical/react/LexicalExtensionComposer"
import { RichTextExtension } from "@lexical/rich-text"

import { EmojiExtension } from "@/components/editor/extensions/emoji"
import {
  $createEmojiNode,
  EMOJI_CLASS_NAME,
} from "@/components/editor/nodes/emoji-node"
import { BlockInsert } from "@/components/editor/plugins/block-insert/block-insert-plugin"
import { InsertEmojiPlugin } from "@/components/editor/plugins/block-insert/insert-emoji-plugin"
import { ContentEditable } from "@/components/editor/plugins/content-editable"
import { EmojiPickerPlugin } from "@/components/editor/plugins/emoji-picker-plugin"
import {
  LanguageProvider,
  useLanguage,
} from "@/components/editor/plugins/i18n-plugin"
import { Toolbar } from "@/components/editor/plugins/toolbar/toolbar-plugin"
import { editorTheme } from "@/components/editor/theme"
import { DirectionProvider } from "@/components/ui/direction"

export function EmojiEditor() {
  const app = useMemo(
    () =>
      defineExtension({
        name: "@shadcn-editor/editor",
        dependencies: [RichTextExtension, EmojiExtension],
        $initialEditorState: () => {
          $getRoot().append(
            $createParagraphNode().append(
              $createTextNode("The release went out on time "),
              $createEmojiNode(EMOJI_CLASS_NAME, "🎉"),
              $createTextNode(
                " and the team is already planning the next one "
              ),
              $createEmojiNode(EMOJI_CLASS_NAME, "🚀"),
              $createTextNode(".")
            ),
            $createParagraphNode().append(
              $createTextNode(
                "Type a colon like :smile: to search emoji inline, or use the insert menu in the toolbar."
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
              <InsertEmojiPlugin />
            </BlockInsert>
          </Toolbar>
          <div className="relative min-w-0 flex-1 overflow-y-auto">
            <ContentEditable variant="toolbar" />
            <EmojiPickerPlugin />
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
