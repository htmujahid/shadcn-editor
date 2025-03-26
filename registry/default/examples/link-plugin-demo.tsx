'use client'

import { useState } from "react"

import { LinkNode, AutoLinkNode } from "@lexical/link"
import { InitialConfigType, LexicalComposer } from "@lexical/react/LexicalComposer"
import { LexicalErrorBoundary } from "@lexical/react/LexicalErrorBoundary"
import { RichTextPlugin } from "@lexical/react/LexicalRichTextPlugin"

import { TooltipProvider } from "@/registry/default/ui/tooltip"

import { editorTheme } from "@/registry/default/editor/themes/editor-theme"
import { ContentEditable } from "@/registry/default/editor/editor-ui/content-editable"
import { ClickableLinkPlugin } from "@lexical/react/LexicalClickableLinkPlugin"
import { AutoLinkPlugin } from '@/registry/default/editor/plugins/auto-link-plugin'
import { LinkPlugin } from "@/registry/default/editor/plugins/link-plugin"
import { FloatingLinkEditorPlugin } from "@/registry/default/editor/plugins/floating-link-editor-plugin"
import { FloatingLinkContext } from "@/registry/default/editor/context/floating-link-context"

const editorConfig: InitialConfigType = {
  namespace: 'Editor',
  theme: editorTheme,
  nodes: [
    LinkNode,
    AutoLinkNode
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
          <FloatingLinkContext>
            <Plugins />
          </FloatingLinkContext>
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
        <ClickableLinkPlugin />
        <AutoLinkPlugin />
        <LinkPlugin />

        <FloatingLinkEditorPlugin anchorElem={floatingAnchorElem} />

        {/* rest of the plugins */}
      </div>
    </div>
  )
}
