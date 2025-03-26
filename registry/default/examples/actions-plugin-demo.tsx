'use client'

import { useState } from "react"

import { Trash2Icon } from "lucide-react"

import { ParagraphNode, TextNode } from "lexical"
import { HeadingNode, QuoteNode } from "@lexical/rich-text"

import { InitialConfigType, LexicalComposer } from "@lexical/react/LexicalComposer"
import { LexicalErrorBoundary } from "@lexical/react/LexicalErrorBoundary"
import { RichTextPlugin } from "@lexical/react/LexicalRichTextPlugin"

import { Button } from "@/registry/default/ui/button"
import { TooltipProvider } from "@/registry/default/ui/tooltip"

import { editorTheme } from "@/registry/default/editor/themes/editor-theme"
import { ContentEditable } from "@/registry/default/editor/editor-ui/content-editable"

import { ActionsPlugin } from "@/registry/default/editor/plugins/actions/actions-plugin"

const editorConfig: InitialConfigType = {
  namespace: 'Editor',
  theme: editorTheme,
  nodes: [
    HeadingNode,
    ParagraphNode,
    TextNode,
    QuoteNode,
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
        {/* rest of the plugins */}
      </div>
      <ActionsPlugin>
        <div className="clear-both flex items-center justify-between border-t p-1 overflow-auto gap-2">
          <div className='flex justify-start flex-1'>
            {/* left side action buttons */}
          </div>
          <div>
            {/* center action buttons */}
          </div>
          <div className="flex justify-end flex-1">
            {/* right side action buttons */}
            <Button size={'sm'} variant={'ghost'} className="p-2">
              <Trash2Icon className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </ActionsPlugin>
    </div>
  )
}
