import { useMemo } from "react";

import {
  $createParagraphNode,
  $createTextNode,
  $getRoot,
  defineExtension,
} from "lexical";

import { LexicalExtensionComposer } from "@lexical/react/LexicalExtensionComposer";
import {
  $createHeadingNode,
  $createQuoteNode,
  RichTextExtension,
} from "@lexical/rich-text";

import { ActivityBar } from "@/components/editor/plugins/activitybar/activitybar-plugin";
import { ReadOnlyTogglePlugin } from "@/components/editor/plugins/activitybar/read-only-toggle-plugin";
import { ContentEditable } from "@/components/editor/plugins/content-editable";
import {
  LanguageProvider,
  useLanguage,
} from "@/components/editor/plugins/i18n-plugin";
import { editorTheme } from "@/components/editor/theme";
import { DirectionProvider } from "@/components/ui/direction";

export function ReadOnlyEditor() {
  const app = useMemo(
    () =>
      defineExtension({
        name: "@shadcn-editor/editor",
        namespace: "shadcn-editor",
        dependencies: [RichTextExtension],
        $initialEditorState: () => {
          $getRoot().append(
            $createHeadingNode("h2").append(
              $createTextNode("Terms of the demo"),
            ),
            $createParagraphNode().append(
              $createTextNode(
                "Press the lock in the bar below and this document becomes read only: you can still select and copy the text, but not change a word of it.",
              ),
            ),
            $createQuoteNode().append(
              $createTextNode(
                "Perfect for published articles, previews, and audit views.",
              ),
            ),
            $createParagraphNode().append(
              $createTextNode(
                "Unlock it again whenever the content needs another pass.",
              ),
            ),
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
            <ContentEditable variant="toolbar" />
          </div>
          <ActivityBar>
            <div className="flex items-center gap-3">
              <ReadOnlyTogglePlugin />
            </div>
          </ActivityBar>
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
