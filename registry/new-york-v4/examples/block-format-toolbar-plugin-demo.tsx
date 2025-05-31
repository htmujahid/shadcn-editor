"use client"

import { useState } from "react"
import { ListItemNode, ListNode } from "@lexical/list"
import { CheckListPlugin } from "@lexical/react/LexicalCheckListPlugin"
import {
  InitialConfigType,
  LexicalComposer,
} from "@lexical/react/LexicalComposer"
import { LexicalErrorBoundary } from "@lexical/react/LexicalErrorBoundary"
import { ListPlugin } from "@lexical/react/LexicalListPlugin"
import { RichTextPlugin } from "@lexical/react/LexicalRichTextPlugin"
import { HeadingNode, QuoteNode } from "@lexical/rich-text"
import { ParagraphNode, TextNode } from "lexical"

import { ContentEditable } from "@/registry/new-york-v4/editor/editor-ui/content-editable"
import { BlockFormatDropDown } from "@/registry/new-york-v4/editor/plugins/toolbar/block-format-toolbar-plugin"
import { FormatBulletedList } from "@/registry/new-york-v4/editor/plugins/toolbar/block-format/format-bulleted-list"
import { FormatCheckList } from "@/registry/new-york-v4/editor/plugins/toolbar/block-format/format-check-list"
import { FormatHeading } from "@/registry/new-york-v4/editor/plugins/toolbar/block-format/format-heading"
import { FormatNumberedList } from "@/registry/new-york-v4/editor/plugins/toolbar/block-format/format-numbered-list"
import { FormatParagraph } from "@/registry/new-york-v4/editor/plugins/toolbar/block-format/format-paragraph"
import { FormatQuote } from "@/registry/new-york-v4/editor/plugins/toolbar/block-format/format-quote"
import { ToolbarPlugin } from "@/registry/new-york-v4/editor/plugins/toolbar/toolbar-plugin"
import { editorTheme } from "@/registry/new-york-v4/editor/themes/editor-theme"
import { TooltipProvider } from "@/registry/new-york-v4/ui/tooltip"

const editorConfig: InitialConfigType = {
  namespace: "Editor",
  theme: editorTheme,
  nodes: [
    HeadingNode,
    ParagraphNode,
    TextNode,
    QuoteNode,
    ListNode,
    ListItemNode,
  ],
  onError: (error: Error) => {
    console.error(error)
  },
}

export default function RichTextEditorDemo() {
  return (
    <div className="bg-background w-full overflow-hidden rounded-lg border">
      <LexicalComposer
        initialConfig={{
          ...editorConfig,
        }}
      >
        <TooltipProvider>
          <Plugins />
        </TooltipProvider>
      </LexicalComposer>
    </div>
  )
}

const placeholder = "Start typing..."

export function Plugins() {
  const [floatingAnchorElem, setFloatingAnchorElem] =
    useState<HTMLDivElement | null>(null)

  const onRef = (_floatingAnchorElem: HTMLDivElement) => {
    if (_floatingAnchorElem !== null) {
      setFloatingAnchorElem(_floatingAnchorElem)
    }
  }

  return (
    <div className="relative">
      {/* toolbar plugins */}
      <ToolbarPlugin>
        {({ blockType }) => (
          <div className="vertical-align-middle sticky top-0 z-10 flex gap-2 overflow-auto border-b p-1">
            <BlockFormatDropDown>
              <FormatParagraph />
              <FormatHeading levels={["h1", "h2", "h3"]} />
              <FormatNumberedList />
              <FormatBulletedList />
              <FormatCheckList />
              <FormatQuote />
            </BlockFormatDropDown>
          </div>
        )}
      </ToolbarPlugin>

      <div className="relative">
        <RichTextPlugin
          contentEditable={
            <div className="">
              <div className="" ref={onRef}>
                <ContentEditable
                  placeholder={placeholder}
                  className="ContentEditable__root relative block h-72 min-h-72 min-h-full overflow-auto px-8 py-4 focus:outline-none"
                />
              </div>
            </div>
          }
          ErrorBoundary={LexicalErrorBoundary}
        />
        <ListPlugin />
        <CheckListPlugin />
        {/* rest of the plugins */}
      </div>
    </div>
  )
}
