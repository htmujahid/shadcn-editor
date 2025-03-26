'use client'

import { useState } from "react"

import { ParagraphNode, TextNode } from "lexical"
import { HeadingNode, QuoteNode } from "@lexical/rich-text"
import { TableCellNode, TableNode, TableRowNode } from "@lexical/table"

import { InitialConfigType, LexicalComposer } from "@lexical/react/LexicalComposer"
import { LexicalErrorBoundary } from "@lexical/react/LexicalErrorBoundary"
import { RichTextPlugin } from "@lexical/react/LexicalRichTextPlugin"
import { TablePlugin } from '@lexical/react/LexicalTablePlugin'

import { TooltipProvider } from "@/registry/default/ui/tooltip"

import { editorTheme } from "@/registry/default/editor/themes/editor-theme"
import { ContentEditable } from "@/registry/default/editor/editor-ui/content-editable"

import { ToolbarPlugin } from "@/registry/default/editor/plugins/toolbar/toolbar-plugin"
import { BlockInsertPlugin } from "@/registry/default/editor/plugins/toolbar/block-insert-plugin"
import { InsertTable } from "@/registry/default/editor/plugins/toolbar/block-insert/insert-table"

import { TableActionMenuPlugin } from '@/registry/default/editor/plugins/table-action-menu-plugin'
import { TableCellResizerPlugin } from '@/registry/default/editor/plugins/table-cell-resizer-plugin'
import { TableHoverActionsPlugin } from '@/registry/default/editor/plugins/table-hover-actions-plugin'

const editorConfig: InitialConfigType = {
  namespace: 'Editor',
  theme: editorTheme,
  nodes: [
    HeadingNode,
    ParagraphNode,
    TextNode,
    QuoteNode,
    TableNode,
    TableRowNode,
    TableCellNode
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
            <BlockInsertPlugin>
              <InsertTable />
            </BlockInsertPlugin>
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
        <TablePlugin />
        <TableActionMenuPlugin anchorElem={floatingAnchorElem} />
        <TableCellResizerPlugin />
        <TableHoverActionsPlugin anchorElem={floatingAnchorElem} />
        {/* rest of the plugins */}
      </div>
    </div>
  )
}
