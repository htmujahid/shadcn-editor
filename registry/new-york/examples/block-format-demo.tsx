'use client'

import { useState } from "react"

import { ParagraphNode, TextNode } from "lexical"
import { HeadingNode, QuoteNode } from "@lexical/rich-text"
import { ListNode, ListItemNode } from "@lexical/list"
import { CodeNode } from "@lexical/code"

import { InitialConfigType, LexicalComposer } from "@lexical/react/LexicalComposer"
import { LexicalErrorBoundary } from "@lexical/react/LexicalErrorBoundary"
import { RichTextPlugin } from "@lexical/react/LexicalRichTextPlugin"
import { ListPlugin } from "@lexical/react/LexicalListPlugin"
import { CheckListPlugin } from "@lexical/react/LexicalCheckListPlugin"

import { TooltipProvider } from "@/registry/new-york/ui/tooltip"

import { editorTheme } from "@/registry/new-york/editor/themes/editor-theme"
import { ContentEditable } from "@/registry/new-york/editor/editor-ui/content-editable"

import { ToolbarPlugin } from "@/registry/new-york/editor/plugins/toolbar/toolbar-plugin"
import { BlockFormatDropDown } from "@/registry/new-york/editor/plugins/toolbar/block-format-toolbar-plugin"

import { FormatParagraph } from "@/registry/new-york/editor/plugins/toolbar/block-format/format-paragraph"
import { FormatHeading } from "@/registry/new-york/editor/plugins/toolbar/block-format/format-heading"
import { FormatNumberedList } from "@/registry/new-york/editor/plugins/toolbar/block-format/format-numbered-list"
import { FormatBulletedList } from "@/registry/new-york/editor/plugins/toolbar/block-format/format-bulleted-list"
import { FormatCheckList } from "@/registry/new-york/editor/plugins/toolbar/block-format/format-check-list"
import { FormatCodeBlock } from "@/registry/new-york/editor/plugins/toolbar/block-format/format-code-block"
import { FormatQuote } from "@/registry/new-york/editor/plugins/toolbar/block-format/format-quote"

const editorConfig: InitialConfigType = {
  namespace: 'Editor',
  theme: editorTheme,
  nodes: [
    HeadingNode,
    ParagraphNode,
    TextNode,
    QuoteNode,
    ListNode,
    ListItemNode,
    CodeNode,
  ],
  onError: (error: Error) => {
    console.error(error)
  },
}

export default function RichTextEditorDemo() {
  return (
    <div className="w-full overflow-hidden rounded-lg border bg-background shadow">
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

const placeholder = 'Start typing...'

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
              <FormatHeading levels={['h1', 'h2', 'h3']} />
              <FormatNumberedList />
              <FormatBulletedList />
              <FormatCheckList />
              <FormatCodeBlock />
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
                <ContentEditable placeholder={placeholder} className="ContentEditable__root relative block min-h-72 overflow-auto min-h-full px-8 py-4 focus:outline-none h-72" />
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
