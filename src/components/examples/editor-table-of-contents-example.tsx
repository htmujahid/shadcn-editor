import { useMemo, useState } from "react"

import {
  $createParagraphNode,
  $createTextNode,
  $getRoot,
  defineExtension,
  HISTORY_MERGE_TAG,
} from "lexical"

import { HistoryExtension } from "@lexical/history"
import { HEADING, registerMarkdownShortcuts } from "@lexical/markdown"
import { LexicalExtensionComposer } from "@lexical/react/LexicalExtensionComposer"
import { $createHeadingNode, RichTextExtension } from "@lexical/rich-text"
import { mergeRegister } from "@lexical/utils"

import { ContentEditable } from "@/components/editor/plugins/content-editable"
import {
  LanguageProvider,
  useLanguage,
} from "@/components/editor/plugins/i18n-plugin"
import { TableOfContentsPlugin } from "@/components/editor/plugins/table-of-contents-plugin"
import { BlockFormatToolbarPlugin } from "@/components/editor/plugins/toolbar/block-format-toolbar-plugin"
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

const SECTIONS: { tag: "h1" | "h2" | "h3"; title: string; body: string }[] = [
  {
    tag: "h1",
    title: "Getting started",
    body: "This document is a small tour of the editor. Scroll it, or jump between sections using the table of contents on the side.",
  },
  {
    tag: "h2",
    title: "Installation",
    body: "Add the packages, copy the components you need, and compose them into an editor that fits your app.",
  },
  {
    tag: "h2",
    title: "Usage",
    body: "Type a heading with the block format menu, or start a line with one or more hashes followed by a space.",
  },
  {
    tag: "h3",
    title: "Keyboard shortcuts",
    body: "Everything in the editor works without a mouse, from formatting text to navigating between blocks.",
  },
  {
    tag: "h2",
    title: "Theming",
    body: "Styling comes from the shadcn/ui tokens, so a change to your theme flows into every editor surface.",
  },
  {
    tag: "h3",
    title: "Dark mode",
    body: "The editor follows the theme of the page it lives in, with no extra configuration required.",
  },
]

export function TableOfContentsEditor() {
  const [sidebarOpen, setSidebarOpen] = useState(true)
  const app = useMemo(
    () =>
      defineExtension({
        name: "@shadcn-editor/editor",
        dependencies: [RichTextExtension, HistoryExtension],
        register: (editor) =>
          mergeRegister(
            registerMarkdownShortcuts(editor, [HEADING]),
            (() => {
              editor.update(
                () => {
                  const root = $getRoot()
                  if (!root.isEmpty()) {
                    return
                  }
                  for (const { tag, title, body } of SECTIONS) {
                    root.append(
                      $createHeadingNode(tag).append($createTextNode(title)),
                      $createParagraphNode().append($createTextNode(body))
                    )
                  }
                },
                { tag: HISTORY_MERGE_TAG }
              )
              return () => {}
            })()
          ),
        theme: editorTheme,
      }),
    []
  )

  return (
    <LanguageProvider>
      <LexicalExtensionComposer extension={app} contentEditable={null}>
        <EditorWrapper>
          <SidebarProvider open={sidebarOpen} className="h-full min-h-0 gap-3">
            <Sidebar
              collapsible="none"
              className={cn(
                "shrink-0 overflow-hidden transition-[width,margin] duration-200 ease-linear",
                sidebarOpen
                  ? "w-56 rounded-lg shadow-sm ring-1 ring-sidebar-border"
                  : "-me-3 w-0"
              )}
            >
              <SidebarContent className="w-56">
                <TableOfContentsPlugin />
              </SidebarContent>
            </Sidebar>
            <div className="flex min-h-0 min-w-0 flex-1 flex-col overflow-hidden rounded-lg border border-input dark:bg-input/30">
              <Toolbar>
                <SidebarTrigger
                  variant={"outline"}
                  onClick={() => setSidebarOpen((open) => !open)}
                />
                <BlockFormatToolbarPlugin />
              </Toolbar>
              <div className="relative min-w-0 flex-1 overflow-y-auto">
                <ContentEditable variant="toolbar" />
              </div>
            </div>
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
