import { useMemo, useState } from "react"

import {
  $createParagraphNode,
  $createTextNode,
  $getRoot,
  defineExtension,
  HISTORY_MERGE_TAG,
} from "lexical"

import { getExtensionDependencyFromEditor } from "@lexical/extension"
import { HistoryExtension } from "@lexical/history"
import { $createMarkNode } from "@lexical/mark"
import { LexicalExtensionComposer } from "@lexical/react/LexicalExtensionComposer"
import { RichTextExtension } from "@lexical/rich-text"

import {
  addComment,
  CommentExtension,
  createComment,
  createThread,
} from "@/components/editor/extensions/comment"
import { ContentEditable } from "@/components/editor/plugins/content-editable"
import {
  CommentPlugin,
  CommentsPanel,
} from "@/components/editor/plugins/floating/comment-plugin"
import {
  LanguageProvider,
  useLanguage,
} from "@/components/editor/plugins/i18n-plugin"
import { Toolbar } from "@/components/editor/plugins/toolbar/toolbar-plugin"
import { editorTheme } from "@/components/editor/theme"
import { DirectionProvider } from "@/components/ui/direction"
import {
  Sidebar,
  SidebarContent,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar"
import { cn } from "@/lib/utils"

const SEED_QUOTE = "anchored to the exact words it refers to"

export function CommentsEditor() {
  const [sidebarOpen, setSidebarOpen] = useState(true)
  const app = useMemo(
    () =>
      defineExtension({
        name: "@shadcn-editor/editor",
        dependencies: [RichTextExtension, HistoryExtension, CommentExtension],
        register: (editor) => {
          const state = getExtensionDependencyFromEditor(
            editor,
            CommentExtension
          ).output
          editor.update(
            () => {
              const root = $getRoot()
              if (!root.isEmpty()) {
                return
              }
              const thread = createThread(SEED_QUOTE, [
                createComment(
                  "This is what makes review workflows click.",
                  "Sam",
                  undefined,
                  performance.timeOrigin + performance.now() - 300000
                ),
              ])
              addComment(state, thread)
              root.append(
                $createParagraphNode().append(
                  $createTextNode(
                    "Select any text in this document and press the button that appears beside the line to start a comment thread."
                  )
                ),
                $createParagraphNode().append(
                  $createTextNode("Feedback lives in the panel on the side, "),
                  $createMarkNode([thread.id]).append(
                    $createTextNode(SEED_QUOTE)
                  ),
                  $createTextNode(
                    ", so the context of a discussion never gets lost. Click a thread to jump to its highlight, or place the caret inside a highlight to light the thread up."
                  )
                )
              )
            },
            { tag: HISTORY_MERGE_TAG }
          )
          return () => {}
        },
        theme: editorTheme,
      }),
    []
  )

  return (
    <LanguageProvider>
      <LexicalExtensionComposer extension={app} contentEditable={null}>
        <EditorWrapper>
          <SidebarProvider open={sidebarOpen} className="h-full min-h-0 gap-3">
            <div className="flex min-h-0 min-w-0 flex-1 flex-col overflow-hidden rounded-lg border border-input dark:bg-input/30">
              <Toolbar>
                <SidebarTrigger
                  variant="outline"
                  className="ms-auto"
                  onClick={() => setSidebarOpen((open) => !open)}
                />
              </Toolbar>
              <div className="relative min-w-0 flex-1 overflow-y-auto">
                <ContentEditable variant="toolbar" />
              </div>
            </div>
            <Sidebar
              collapsible="none"
              className={cn(
                "shrink-0 overflow-hidden transition-[width,margin] duration-200 ease-linear",
                sidebarOpen
                  ? "w-64 rounded-lg shadow-sm ring-1 ring-sidebar-border"
                  : "-ms-3 w-0"
              )}
            >
              <SidebarContent className="w-64">
                <CommentsPanel />
              </SidebarContent>
            </Sidebar>
            <CommentPlugin />
          </SidebarProvider>
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
        className="relative flex min-h-0 w-full flex-1 flex-col"
      >
        {children}
      </div>
    </DirectionProvider>
  )
}
