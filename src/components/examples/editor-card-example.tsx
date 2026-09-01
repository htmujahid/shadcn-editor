import { useMemo } from "react";

import {
  $createParagraphNode,
  $createTextNode,
  $getRoot,
  $getSlot,
  $isParagraphNode,
  defineExtension,
} from "lexical";

import { ClipboardDOMImportExtension } from "@lexical/clipboard";
import { HistoryExtension } from "@lexical/history";
import { LexicalExtensionComposer } from "@lexical/react/LexicalExtensionComposer";
import { RichTextExtension } from "@lexical/rich-text";

import { CardExtension } from "@/components/editor/extensions/card";
import { $createCardNode } from "@/components/editor/nodes/card-node";
import { CardPickerPlugin } from "@/components/editor/plugins/component-picker/card-picker-plugin";
import { ComponentPicker } from "@/components/editor/plugins/component-picker/component-picker-plugin";
import { HeadingPickerPlugin } from "@/components/editor/plugins/component-picker/heading-picker-plugin";
import { ParagraphPickerPlugin } from "@/components/editor/plugins/component-picker/paragraph-picker-plugin";
import { ContentEditable } from "@/components/editor/plugins/content-editable";
import {
  LanguageProvider,
  useLanguage,
} from "@/components/editor/plugins/i18n-plugin";
import { editorTheme } from "@/components/editor/theme";
import { DirectionProvider } from "@/components/ui/direction";

export function CardEditor() {
  const app = useMemo(
    () =>
      defineExtension({
        name: "@shadcn-editor/editor",
        namespace: "shadcn-editor",
        dependencies: [
          RichTextExtension,
          HistoryExtension,
          CardExtension,
          ClipboardDOMImportExtension,
        ],
        $initialEditorState: () => {
          const card = $createCardNode();
          const title = $getSlot(card, "title");
          if ($isParagraphNode(title)) {
            title.append($createTextNode("Weekly sync notes"));
          }
          const body = card.getFirstChild();
          if ($isParagraphNode(body)) {
            body.append(
              $createTextNode(
                "A card groups a titled block of content. Click the title or this body to edit it, and use arrow keys to move between the two.",
              ),
            );
          }
          $getRoot().append(
            $createParagraphNode().append(
              $createTextNode(
                'Type "/card" on an empty line to insert a card like this one:',
              ),
            ),
            card,
          );
        },
        theme: editorTheme,
      }),
    [],
  );

  return (
    <LanguageProvider>
      <LexicalExtensionComposer extension={app} contentEditable={null}>
        <EditorWrapper>
          <div className="relative min-w-0 flex-1 overflow-y-auto">
            <ContentEditable />
            <ComponentPicker>
              <ParagraphPickerPlugin />
              <HeadingPickerPlugin />
              <CardPickerPlugin />
            </ComponentPicker>
          </div>
        </EditorWrapper>
      </LexicalExtensionComposer>
    </LanguageProvider>
  );
}

function EditorWrapper({ children }: { children: React.ReactNode }) {
  const { language, dir } = useLanguage();
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
  );
}
