import { useMemo } from "react"

import {
  $createParagraphNode,
  $createTextNode,
  $getRoot,
  defineExtension,
} from "lexical"

import { LexicalExtensionComposer } from "@lexical/react/LexicalExtensionComposer"
import { RichTextExtension } from "@lexical/rich-text"

import { AutoLinkExtension } from "@/components/editor/extensions/auto-link"
import { FigmaExtension } from "@/components/editor/extensions/figma"
import { LinkExtension } from "@/components/editor/extensions/link"
import { TwitterExtension } from "@/components/editor/extensions/twitter"
import { YouTubeExtension } from "@/components/editor/extensions/youtube"
import { AutoEmbedPlugin } from "@/components/editor/plugins/auto-embed-plugin"
import { ContentEditable } from "@/components/editor/plugins/content-editable"
import {
  LanguageProvider,
  useLanguage,
} from "@/components/editor/plugins/i18n-plugin"
import { editorTheme } from "@/components/editor/theme"
import { DirectionProvider } from "@/components/ui/direction"

export function AutoEmbedEditor() {
  const app = useMemo(
    () =>
      defineExtension({
        name: "@shadcn-editor/editor",
        dependencies: [
          RichTextExtension,
          LinkExtension,
          AutoLinkExtension,
          YouTubeExtension,
          TwitterExtension,
          FigmaExtension,
        ],
        $initialEditorState: () => {
          $getRoot().append(
            $createParagraphNode().append(
              $createTextNode(
                "Paste a YouTube, X, or Figma link and a menu appears offering to embed it in place. Copy this one to try it out:"
              )
            ),
            $createParagraphNode().append(
              $createTextNode("https://www.youtube.com/watch?v=jNQXAC9IVRw")
            ),
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
            <AutoEmbedPlugin />
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
