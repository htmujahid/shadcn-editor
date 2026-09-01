import { useMemo } from "react"

import {
  $createParagraphNode,
  $createTextNode,
  $getRoot,
  defineExtension,
} from "lexical"

import { TabIndentationExtension } from "@lexical/extension"
import {
  $createListItemNode,
  $createListNode,
  CheckListExtension,
  ListExtension,
} from "@lexical/list"
import { LexicalExtensionComposer } from "@lexical/react/LexicalExtensionComposer"
import { RichTextExtension } from "@lexical/rich-text"

import { FormatStateExtension } from "@/components/editor/extensions/format-state"
import { ContentEditable } from "@/components/editor/plugins/content-editable"
import {
  LanguageProvider,
  useLanguage,
} from "@/components/editor/plugins/i18n-plugin"
import { BlockFormatToolbarPlugin } from "@/components/editor/plugins/toolbar/block-format-toolbar-plugin"
import { IndentToolbarPlugin } from "@/components/editor/plugins/toolbar/indent-toolbar-plugin"
import { Toolbar } from "@/components/editor/plugins/toolbar/toolbar-plugin"
import { editorTheme } from "@/components/editor/theme"
import { DirectionProvider } from "@/components/ui/direction"

export function NestedListEditor() {
  const app = useMemo(
    () =>
      defineExtension({
        name: "@shadcn-editor/editor",
        dependencies: [
          RichTextExtension,
          ListExtension,
          CheckListExtension,
          TabIndentationExtension,
          FormatStateExtension,
        ],
        $initialEditorState: () => {
          $getRoot().append(
            $createListNode("bullet").append(
              $createListItemNode().append($createTextNode("Frontend")),
              $createListItemNode().append(
                $createListNode("bullet").append(
                  $createListItemNode().append(
                    $createTextNode("Components and styling")
                  ),
                  $createListItemNode().append(
                    $createTextNode("Routing and data fetching")
                  )
                )
              ),
              $createListItemNode().append($createTextNode("Backend")),
              $createListItemNode().append(
                $createListNode("bullet").append(
                  $createListItemNode().append(
                    $createTextNode("API endpoints")
                  ),
                  $createListItemNode().append(
                    $createTextNode("Database migrations")
                  )
                )
              )
            ),
            $createParagraphNode().append(
              $createTextNode(
                "Press Tab inside an item to nest it one level deeper, and Shift+Tab to lift it back out."
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
            <BlockFormatToolbarPlugin />
            <IndentToolbarPlugin />
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
