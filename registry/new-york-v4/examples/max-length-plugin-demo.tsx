"use client"

import { useState } from "react"
import { OverflowNode } from "@lexical/overflow"
import {
  InitialConfigType,
  LexicalComposer,
} from "@lexical/react/LexicalComposer"
import { LexicalErrorBoundary } from "@lexical/react/LexicalErrorBoundary"
import { RichTextPlugin } from "@lexical/react/LexicalRichTextPlugin"
import { HeadingNode, QuoteNode } from "@lexical/rich-text"
import { ParagraphNode, TextNode } from "lexical"
import { Trash2Icon } from "lucide-react"

import { ContentEditable } from "@/registry/new-york-v4/editor/editor-ui/content-editable"
import { ActionsPlugin } from "@/registry/new-york-v4/editor/plugins/actions/actions-plugin"
import { CharacterLimitPlugin } from "@/registry/new-york-v4/editor/plugins/actions/character-limit-plugin"
import { MaxLengthPlugin } from "@/registry/new-york-v4/editor/plugins/actions/max-length-plugin"
import { editorTheme } from "@/registry/new-york-v4/editor/themes/editor-theme"
import { Button } from "@/registry/new-york-v4/ui/button"
import { TooltipProvider } from "@/registry/new-york-v4/ui/tooltip"

const editorConfig: InitialConfigType = {
  namespace: "Editor",
  theme: editorTheme,
  nodes: [HeadingNode, ParagraphNode, TextNode, QuoteNode, OverflowNode],
  onError: (error: Error) => {
    console.error(error)
  },
}

const maxLength = 100

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
        {/* rest of the plugins */}
      </div>
      <ActionsPlugin>
        <div className="clear-both flex items-center justify-between gap-2 overflow-auto border-t p-1">
          <div className="flex flex-1 justify-start">
            {/* left side action buttons */}
            <MaxLengthPlugin maxLength={maxLength} />
            <CharacterLimitPlugin maxLength={maxLength} charset="UTF-16" />
          </div>
          <div>{/* center action buttons */}</div>
          <div className="flex flex-1 justify-end">
            {/* right side action buttons */}
            <Button size={"sm"} variant={"ghost"} className="p-2">
              <Trash2Icon className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </ActionsPlugin>
    </div>
  )
}
