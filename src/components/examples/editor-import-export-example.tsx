import { useMemo } from "react"

import { defineExtension } from "lexical"

import { HorizontalRuleExtension } from "@lexical/extension"
import { CheckListExtension, ListExtension } from "@lexical/list"
import {
  $convertFromMarkdownString,
  CHECK_LIST,
  ELEMENT_TRANSFORMERS,
  MULTILINE_ELEMENT_TRANSFORMERS,
  registerMarkdownShortcuts,
  TEXT_FORMAT_TRANSFORMERS,
  TEXT_MATCH_TRANSFORMERS,
  type Transformer,
} from "@lexical/markdown"
import { LexicalExtensionComposer } from "@lexical/react/LexicalExtensionComposer"
import { RichTextExtension } from "@lexical/rich-text"
import { TableExtension } from "@lexical/table"

import { CodeExtension } from "@/components/editor/extensions/code"
import { EmojiExtension } from "@/components/editor/extensions/emoji"
import { ImageExtension } from "@/components/editor/extensions/image"
import { LayoutExtension } from "@/components/editor/extensions/layout"
import { LinkExtension } from "@/components/editor/extensions/link"
import { ContentEditable } from "@/components/editor/plugins/content-editable"
import {
  LanguageProvider,
  useLanguage,
} from "@/components/editor/plugins/i18n-plugin"
import { ImportExportToolbarPlugin } from "@/components/editor/plugins/toolbar/import-export-toolbar-plugin"
import { Toolbar } from "@/components/editor/plugins/toolbar/toolbar-plugin"
import { editorTheme } from "@/components/editor/theme"
import { EMOJI } from "@/components/editor/transformers/emoji-transformer"
import { HR } from "@/components/editor/transformers/horizontal-rule-transformer"
import { IMAGE } from "@/components/editor/transformers/image-transformer"
import { TABLE } from "@/components/editor/transformers/table-transformer"
import { DirectionProvider } from "@/components/ui/direction"

const EDITOR_TRANSFORMERS: Transformer[] = [
  TABLE,
  HR,
  IMAGE,
  EMOJI,
  CHECK_LIST,
  ...ELEMENT_TRANSFORMERS,
  ...MULTILINE_ELEMENT_TRANSFORMERS,
  ...TEXT_FORMAT_TRANSFORMERS,
  ...TEXT_MATCH_TRANSFORMERS,
]

export function ImportExportEditor() {
  const app = useMemo(
    () =>
      defineExtension({
        name: "@shadcn-editor/editor",
        namespace: "shadcn-editor",
        dependencies: [
          RichTextExtension,
          ListExtension,
          CheckListExtension,
          LinkExtension,
          CodeExtension,
          LayoutExtension,
          EmojiExtension,
          TableExtension,
          HorizontalRuleExtension,
          ImageExtension,
        ],
        register: (editor) =>
          registerMarkdownShortcuts(editor, EDITOR_TRANSFORMERS),
        $initialEditorState: () => {
          $convertFromMarkdownString(
            [
              "## Weekly review",
              "",
              "Notes from the product sync, ready to share:",
              "",
              "- Onboarding flow shipped to **all** users",
              "- Support volume down 12% week over week",
              "- Next up: billing page redesign",
              "",
              "Use the toolbar to export this document, or import one you saved earlier.",
            ].join("\n"),
            EDITOR_TRANSFORMERS
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
            <ImportExportToolbarPlugin transformers={EDITOR_TRANSFORMERS} />
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
