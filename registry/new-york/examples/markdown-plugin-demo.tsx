'use client'

import { useState } from "react"
import { ParagraphNode, TextNode } from "lexical"

import {
  CHECK_LIST,
  ELEMENT_TRANSFORMERS,
  MULTILINE_ELEMENT_TRANSFORMERS,
  TEXT_FORMAT_TRANSFORMERS,
  TEXT_MATCH_TRANSFORMERS,
} from '@lexical/markdown'
import { AutoLinkNode } from "@lexical/link"
import { LinkNode } from "@lexical/link"
import { OverflowNode } from "@lexical/overflow"
import { ListNode, ListItemNode } from "@lexical/list"
import { QuoteNode, HeadingNode } from "@lexical/rich-text"
import { CodeHighlightNode, CodeNode } from "@lexical/code"
import { TableNode, TableRowNode, TableCellNode } from "@lexical/table"

import { HorizontalRuleNode } from "@lexical/react/LexicalHorizontalRuleNode"
import { TablePlugin } from "@lexical/react/LexicalTablePlugin"
import { HorizontalRulePlugin } from "@lexical/react/LexicalHorizontalRulePlugin"
import { CheckListPlugin } from "@lexical/react/LexicalCheckListPlugin"
import { ListPlugin } from "@lexical/react/LexicalListPlugin"
import { InitialConfigType, LexicalComposer } from "@lexical/react/LexicalComposer"
import { LexicalErrorBoundary } from "@lexical/react/LexicalErrorBoundary"
import { MarkdownShortcutPlugin } from "@lexical/react/LexicalMarkdownShortcutPlugin"
import { RichTextPlugin } from "@lexical/react/LexicalRichTextPlugin"

import { TooltipProvider } from "@/registry/new-york/ui/tooltip"

import { editorTheme } from "@/registry/new-york/editor/themes/editor-theme"
import { ContentEditable } from "@/registry/new-york/editor/editor-ui/content-editable"

import { EMOJI } from '@/registry/new-york/editor/transformers/markdown-emoji-transformer'
import { EQUATION } from '@/registry/new-york/editor/transformers/markdown-equation-transofrmer'
import { HR } from '@/registry/new-york/editor/transformers/markdown-hr-transformer'
import { IMAGE } from '@/registry/new-york/editor/transformers/markdown-image-transformer'
import { TABLE } from '@/registry/new-york/editor/transformers/markdown-table-transformer'
import { TWEET } from '@/registry/new-york/editor/transformers/markdown-tweet-transformer'

import { ImageNode } from "@/registry/new-york/editor/nodes/image-node"
import { EmojiNode } from "@/registry/new-york/editor/nodes/emoji-node"
import { EquationNode } from "@/registry/new-york/editor/nodes/equation-node"
import { TweetNode } from "@/registry/new-york/editor/nodes/embeds/tweet-node"

import { ImagesPlugin } from "@/registry/new-york/editor/plugins/images-plugin"
import { EmojisPlugin } from "@/registry/new-york/editor/plugins/emojis-plugin"
import { TwitterPlugin } from "@/registry/new-york/editor/plugins/embeds/twitter-plugin"
import { EquationsPlugin } from "@/registry/new-york/editor/plugins/equations-plugin"
import { TableActionMenuPlugin } from '@/registry/new-york/editor/plugins/table-action-menu-plugin'
import { TableCellResizerPlugin } from '@/registry/new-york/editor/plugins/table-cell-resizer-plugin'
import { TableHoverActionsPlugin } from '@/registry/new-york/editor/plugins/table-hover-actions-plugin'

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
    LinkNode,
    OverflowNode,
    TableNode,
    TableCellNode,
    TableRowNode,
    CodeNode,
    CodeHighlightNode,
    HorizontalRuleNode,
    ImageNode,
    EmojiNode,
    EquationNode,
    AutoLinkNode,
    TweetNode,
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
        <TableCellResizerPlugin />
        <TableHoverActionsPlugin anchorElem={floatingAnchorElem} />
        <TableActionMenuPlugin
          anchorElem={floatingAnchorElem}
          cellMerge={true}
        />

        <HorizontalRulePlugin />
        <ImagesPlugin />
        <EmojisPlugin />
        <EquationsPlugin />
        <TwitterPlugin />
        <CheckListPlugin />
        <ListPlugin />
        
        <MarkdownShortcutPlugin
          transformers={[
            TABLE,
            HR,
            IMAGE,
            EMOJI,
            EQUATION,
            TWEET,
            CHECK_LIST,
            ...ELEMENT_TRANSFORMERS,
            ...MULTILINE_ELEMENT_TRANSFORMERS,
            ...TEXT_FORMAT_TRANSFORMERS,
            ...TEXT_MATCH_TRANSFORMERS,
          ]}
        />
        {/* rest of the plugins */}
      </div>
    </div>
  )
}
