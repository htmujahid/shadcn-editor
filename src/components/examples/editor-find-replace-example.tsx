import { useMemo } from "react";

import {
  $createParagraphNode,
  $createTextNode,
  $getRoot,
  defineExtension,
} from "lexical";

import { LexicalExtensionComposer } from "@lexical/react/LexicalExtensionComposer";
import { RichTextExtension } from "@lexical/rich-text";

import { ContentEditable } from "@/components/editor/plugins/content-editable";
import { ReactFindReplaceExtension } from "@/components/editor/plugins/decorator/find-replace-panel";
import {
  LanguageProvider,
  useLanguage,
} from "@/components/editor/plugins/i18n-plugin";
import { FindReplaceToolbarPlugin } from "@/components/editor/plugins/toolbar/find-replace-toolbar-plugin";
import { Toolbar } from "@/components/editor/plugins/toolbar/toolbar-plugin";
import { editorTheme } from "@/components/editor/theme";
import { DirectionProvider } from "@/components/ui/direction";

export function FindReplaceEditor() {
  const app = useMemo(
    () =>
      defineExtension({
        name: "@shadcn-editor/editor",
        dependencies: [RichTextExtension, ReactFindReplaceExtension],
        $initialEditorState: () => {
          $getRoot().append(
            $createParagraphNode().append(
              $createTextNode(
                "The quick brown fox jumps over the lazy dog. The fox is quick, the fox is clever, and the fox never seems to tire.",
              ),
            ),
            $createParagraphNode().append(
              $createTextNode(
                "Press Ctrl+F or use the toolbar button, search for the word fox, and replace every match with something else.",
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
          <Toolbar>
            <FindReplaceToolbarPlugin />
          </Toolbar>
          <div className="relative min-w-0 flex-1 overflow-y-auto">
            <ContentEditable variant="toolbar" />
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
