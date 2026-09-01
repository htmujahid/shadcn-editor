import { useMemo } from "react";

import {
  $createParagraphNode,
  $createTextNode,
  $getRoot,
  defineExtension,
} from "lexical";

import { LexicalExtensionComposer } from "@lexical/react/LexicalExtensionComposer";
import { RichTextExtension } from "@lexical/rich-text";

import { ActivityBar } from "@/components/editor/plugins/activitybar/activitybar-plugin";
import { ContentEditable } from "@/components/editor/plugins/content-editable";
import {
  LanguageProvider,
  LanguageSelectorPlugin,
  useLanguage,
} from "@/components/editor/plugins/i18n-plugin";
import { editorTheme } from "@/components/editor/theme";
import { DirectionProvider } from "@/components/ui/direction";

export function I18nEditor() {
  const app = useMemo(
    () =>
      defineExtension({
        name: "@shadcn-editor/editor",
        namespace: "shadcn-editor",
        dependencies: [RichTextExtension],
        $initialEditorState: () => {
          $getRoot().append(
            $createParagraphNode().append(
              $createTextNode(
                "Your content stays exactly as you wrote it, while every label, tooltip, and placeholder around it follows the editor language.",
              ),
            ),
            $createParagraphNode().append(
              $createTextNode(
                "Switch between English, Arabic, and Hebrew from the selector below and watch the interface flip, right to left included.",
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
              <LanguageSelectorPlugin />
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
