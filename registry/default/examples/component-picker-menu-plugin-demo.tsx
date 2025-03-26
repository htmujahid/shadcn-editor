'use client'

import { useState } from "react"
import { QuoteNode } from "@lexical/rich-text"

import { InitialConfigType, LexicalComposer } from "@lexical/react/LexicalComposer"
import { LexicalErrorBoundary } from "@lexical/react/LexicalErrorBoundary"
import { RichTextPlugin } from "@lexical/react/LexicalRichTextPlugin"

import { TooltipProvider } from "@/registry/default/ui/tooltip"

import { editorTheme } from "@/registry/default/editor/themes/editor-theme"
import { ContentEditable } from "@/registry/default/editor/editor-ui/content-editable"
import { ComponentPickerMenuPlugin } from "@/registry/default/editor/plugins/component-picker-plugin"

import { AlignmentPickerPlugin } from '@/registry/default/editor/plugins/picker/alignment-picker-plugin'
import { ParagraphPickerPlugin } from '@/registry/default/editor/plugins/picker/paragraph-picker-plugin'
import { HeadingPickerPlugin } from '@/registry/default/editor/plugins/picker/heading-picker-plugin'
import { QuotePickerPlugin } from '@/registry/default/editor/plugins/picker/quote-picker-plugin'

const editorConfig: InitialConfigType = {
  namespace: 'Editor',
  theme: editorTheme,
  nodes: [
    QuoteNode
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
        <ComponentPickerMenuPlugin 
          baseOptions={[
            ParagraphPickerPlugin(),
            HeadingPickerPlugin({ n: 1 }),
            HeadingPickerPlugin({ n: 2 }),
            HeadingPickerPlugin({ n: 3 }),
            QuotePickerPlugin(),
            AlignmentPickerPlugin({ alignment: "left" }),
            AlignmentPickerPlugin({ alignment: "right" }),
            AlignmentPickerPlugin({ alignment: "center" }),
            AlignmentPickerPlugin({ alignment: "justify" }),
          ]}
        />
        {/* rest of the plugins */}
      </div>
    </div>
  )
}
