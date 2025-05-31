"use client"

import { useState } from "react"
import { AutoLinkNode, LinkNode } from "@lexical/link"
import { ClickableLinkPlugin } from "@lexical/react/LexicalClickableLinkPlugin"
import {
  InitialConfigType,
  LexicalComposer,
} from "@lexical/react/LexicalComposer"
import { LexicalErrorBoundary } from "@lexical/react/LexicalErrorBoundary"
import { RichTextPlugin } from "@lexical/react/LexicalRichTextPlugin"

import { FloatingLinkContext } from "@/registry/new-york-v4/editor/context/floating-link-context"
import { ContentEditable } from "@/registry/new-york-v4/editor/editor-ui/content-editable"
import { AutoLinkPlugin } from "@/registry/new-york-v4/editor/plugins/auto-link-plugin"
import { FloatingLinkEditorPlugin } from "@/registry/new-york-v4/editor/plugins/floating-link-editor-plugin"
import { LinkPlugin } from "@/registry/new-york-v4/editor/plugins/link-plugin"
import { editorTheme } from "@/registry/new-york-v4/editor/themes/editor-theme"
import { TooltipProvider } from "@/registry/new-york-v4/ui/tooltip"

const editorConfig: InitialConfigType = {
  namespace: "Editor",
  theme: editorTheme,
  nodes: [LinkNode, AutoLinkNode],
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
          <FloatingLinkContext>
            <Plugins />
          </FloatingLinkContext>
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
        <ClickableLinkPlugin />
        <AutoLinkPlugin />
        <LinkPlugin />

        <FloatingLinkEditorPlugin anchorElem={floatingAnchorElem} />

        {/* rest of the plugins */}
      </div>
    </div>
  )
}
