import { useMemo } from "react"

import {
  $createParagraphNode,
  $createTextNode,
  $getRoot,
  defineExtension,
} from "lexical"

import { LexicalExtensionComposer } from "@lexical/react/LexicalExtensionComposer"
import { RichTextExtension } from "@lexical/rich-text"

import { FormatStateExtension } from "@/components/editor/extensions/format-state"
import { ContentEditable } from "@/components/editor/plugins/content-editable"
import {
  LanguageProvider,
  useLanguage,
} from "@/components/editor/plugins/i18n-plugin"
import { TextFormatToolbarPlugin } from "@/components/editor/plugins/toolbar/text-format-toolbar-plugin"
import { Toolbar } from "@/components/editor/plugins/toolbar/toolbar-plugin"
import { editorTheme } from "@/components/editor/theme"
import { DirectionProvider } from "@/components/ui/direction"

export function TextFormatEditor() {
  const app = useMemo(
    () =>
      defineExtension({
        name: "@shadcn-editor/editor",
        dependencies: [RichTextExtension, FormatStateExtension],
        $initialEditorState: () => {
          $getRoot().append(
            $createParagraphNode().append(
              $createTextNode("This toolbar goes beyond "),
              $createTextNode("bold").toggleFormat("bold"),
              $createTextNode(" and "),
              $createTextNode("italic").toggleFormat("italic"),
              $createTextNode(": there is "),
              $createTextNode("underline").toggleFormat("underline"),
              $createTextNode(", "),
              $createTextNode("strikethrough").toggleFormat("strikethrough"),
              $createTextNode(", "),
              $createTextNode("inline code").toggleFormat("code"),
              $createTextNode(", "),
              $createTextNode("highlight").toggleFormat("highlight"),
              $createTextNode(", and even x"),
              $createTextNode("2").toggleFormat("superscript"),
              $createTextNode(" or H"),
              $createTextNode("2").toggleFormat("subscript"),
              $createTextNode("O.")
            ),
            $createParagraphNode().append(
              $createTextNode(
                "Open the overflow menu in the toolbar for case transforms and the rest of the formats."
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
            <TextFormatToolbarPlugin />
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
