import { useMemo } from "react"

import {
  $createParagraphNode,
  $createTextNode,
  $getRoot,
  $getSlot,
  $isParagraphNode,
  defineExtension,
} from "lexical"

import { ClipboardDOMImportExtension } from "@lexical/clipboard"
import { HistoryExtension } from "@lexical/history"
import { LexicalExtensionComposer } from "@lexical/react/LexicalExtensionComposer"
import { RichTextExtension } from "@lexical/rich-text"

import { $createReviewNode } from "@/components/editor/nodes/review-node"
import { ComponentPicker } from "@/components/editor/plugins/component-picker/component-picker-plugin"
import { HeadingPickerPlugin } from "@/components/editor/plugins/component-picker/heading-picker-plugin"
import { ParagraphPickerPlugin } from "@/components/editor/plugins/component-picker/paragraph-picker-plugin"
import { ReviewPickerPlugin } from "@/components/editor/plugins/component-picker/review-picker-plugin"
import { ContentEditable } from "@/components/editor/plugins/content-editable"
import { ReactReviewExtension } from "@/components/editor/plugins/floating/review-plugin"
import {
  LanguageProvider,
  useLanguage,
} from "@/components/editor/plugins/i18n-plugin"
import { editorTheme } from "@/components/editor/theme"
import { DirectionProvider } from "@/components/ui/direction"

export function ReviewEditor() {
  const app = useMemo(
    () =>
      defineExtension({
        name: "@shadcn-editor/editor",
        namespace: "shadcn-editor",
        dependencies: [
          RichTextExtension,
          HistoryExtension,
          ReactReviewExtension,
          ClipboardDOMImportExtension,
        ],
        $initialEditorState: () => {
          const review = $createReviewNode().setRating(4)
          const author = $getSlot(review, "author")
          if ($isParagraphNode(author)) {
            author.append($createTextNode("Jordan P."))
          }
          const body = review.getFirstChild()
          if ($isParagraphNode(body)) {
            body.append(
              $createTextNode(
                "A thoughtful writing surface. The slash menu makes inserting blocks quick, and the rating is set with the stars above."
              )
            )
          }
          $getRoot().append(
            $createParagraphNode().append(
              $createTextNode(
                'A review pairs a star rating with a body and an author line. Type "/review" on an empty line to add your own:'
              )
            ),
            review
          )
        },
        theme: editorTheme,
      }),
    []
  )

  return (
    <LanguageProvider>
      <LexicalExtensionComposer extension={app} contentEditable={null}>
        <EditorWrapper>
          <div className="relative min-w-0 flex-1 overflow-y-auto">
            <ContentEditable />
            <ComponentPicker>
              <ParagraphPickerPlugin />
              <HeadingPickerPlugin />
              <ReviewPickerPlugin />
            </ComponentPicker>
          </div>
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
        className="relative flex min-h-0 w-full flex-1 flex-col overflow-hidden rounded-lg border border-input dark:bg-input/30"
      >
        {children}
      </div>
    </DirectionProvider>
  )
}
