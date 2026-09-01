import { useMemo } from "react";

import {
  $createParagraphNode,
  $createTextNode,
  $getRoot,
  $isParagraphNode,
  defineExtension,
} from "lexical";

import { LexicalExtensionComposer } from "@lexical/react/LexicalExtensionComposer";
import { RichTextExtension } from "@lexical/rich-text";
import {
  $createTableNodeWithDimensions,
  $isTableCellNode,
  $isTableRowNode,
  TableExtension,
} from "@lexical/table";

import { BlockInsert } from "@/components/editor/plugins/block-insert/block-insert-plugin";
import { InsertTablePlugin } from "@/components/editor/plugins/block-insert/insert-table-plugin";
import { ContentEditable } from "@/components/editor/plugins/content-editable";
import { TableHoverActionsPlugin } from "@/components/editor/plugins/floating/table-hover-actions-plugin";
import {
  LanguageProvider,
  useLanguage,
} from "@/components/editor/plugins/i18n-plugin";
import { Toolbar } from "@/components/editor/plugins/toolbar/toolbar-plugin";
import { editorTheme } from "@/components/editor/theme";
import { DirectionProvider } from "@/components/ui/direction";

export function TableEditor() {
  const app = useMemo(
    () =>
      defineExtension({
        name: "@shadcn-editor/editor",
        dependencies: [RichTextExtension, TableExtension],
        $initialEditorState: () => {
          const data = [
            ["Plan", "Monthly", "Yearly"],
            ["Free", "$0", "$0"],
            ["Pro", "$12", "$120"],
            ["Team", "$29", "$290"],
          ];
          const table = $createTableNodeWithDimensions(4, 3, true);
          table.getChildren().forEach((row, rowIndex) => {
            if (!$isTableRowNode(row)) {
              return;
            }
            row.getChildren().forEach((cell, cellIndex) => {
              const paragraph = $isTableCellNode(cell)
                ? cell.getFirstChild()
                : null;
              if ($isParagraphNode(paragraph)) {
                paragraph.append($createTextNode(data[rowIndex][cellIndex]));
              }
            });
          });
          $getRoot().append(
            $createParagraphNode().append(
              $createTextNode(
                "Hover the table to reveal row and column actions, or insert a new one from the toolbar.",
              ),
            ),
            table,
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
            <BlockInsert>
              <InsertTablePlugin />
            </BlockInsert>
          </Toolbar>
          <div className="relative min-w-0 flex-1 overflow-y-auto">
            <ContentEditable variant="toolbar" />
            <TableHoverActionsPlugin />
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
