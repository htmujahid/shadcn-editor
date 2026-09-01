import { useMemo } from "react"

import {
  $createParagraphNode,
  $createTextNode,
  $getRoot,
  defineExtension,
} from "lexical"

import {
  ClearEditorExtension,
  HorizontalRuleExtension,
} from "@lexical/extension"
import { CheckListExtension, ListExtension } from "@lexical/list"
import {
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
import { LinkExtension } from "@/components/editor/extensions/link"
import { ContentEditable } from "@/components/editor/plugins/content-editable"
import {
  LanguageProvider,
  useLanguage,
} from "@/components/editor/plugins/i18n-plugin"
import { ClearToolbarPlugin } from "@/components/editor/plugins/toolbar/clear-toolbar-plugin"
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

export function ClearEditor() {
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
          EmojiExtension,
          TableExtension,
          HorizontalRuleExtension,
          ImageExtension,
          ClearEditorExtension,
        ],
        $initialEditorState: () => {
          $getRoot().append(
            $createParagraphNode().append(
              $createTextNode("This sentence has ")
                .toggleFormat("bold")
                .setStyle("color: #e11d48"),
              $createTextNode("far too much ")
                .toggleFormat("italic")
                .toggleFormat("underline"),
              $createTextNode("formatting ")
                .toggleFormat("strikethrough")
                .setStyle("background-color: #fde047; color: #713f12"),
              $createTextNode("going on").toggleFormat("code"),
              $createTextNode(".").toggleFormat("bold")
            ),
            $createParagraphNode().append(
              $createTextNode(
                "Select it all and press the eraser in the toolbar to strip every format away."
              )
            )
          )
        },
        register: (editor) =>
          registerMarkdownShortcuts(editor, EDITOR_TRANSFORMERS),
        theme: editorTheme,
      }),
    []
  )

  return (
    <LanguageProvider>
      <LexicalExtensionComposer extension={app} contentEditable={null}>
        <EditorWrapper>
          <Toolbar>
            <ClearToolbarPlugin />
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
