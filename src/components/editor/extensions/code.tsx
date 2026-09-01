import {
  $getRoot,
  $getSelection,
  $isRangeSelection,
  $nodesOfType,
  configExtension,
  defineExtension,
  type LexicalEditor,
} from "lexical";

import {
  $createCodeNode,
  $isCodeNode,
  CodeIndentExtension,
  CodeNode,
} from "@lexical/code-core";
import {
  CodeShikiExtension,
  ShikiTokenizer,
  type Tokenizer,
} from "@lexical/code-shiki";
import { $setBlocksType } from "@lexical/selection";

export function insertCodeBlock(editor: LexicalEditor) {
  editor.update(() => {
    const selection = $getSelection() ?? $getRoot().selectEnd();
    if (!$isRangeSelection(selection)) {
      return;
    }

    if ($isCodeNode(selection.anchor.getNode().getTopLevelElement())) {
      return;
    }

    if (selection.isCollapsed()) {
      $setBlocksType(selection, () => $createCodeNode());
      return;
    }

    const textContent = selection.getTextContent();
    const codeNode = $createCodeNode();
    selection.insertNodes([codeNode]);

    const updatedSelection = $getSelection();
    if ($isRangeSelection(updatedSelection)) {
      updatedSelection.insertRawText(textContent);
    }
  });
}

const LIGHT_CODE_THEME = "github-light";
const DARK_CODE_THEME = "github-dark";

function getPreferredCodeTheme() {
  if (typeof document === "undefined") {
    return LIGHT_CODE_THEME;
  }
  return document.documentElement.classList.contains("dark")
    ? DARK_CODE_THEME
    : LIGHT_CODE_THEME;
}

const tokenizer: Tokenizer = {
  ...ShikiTokenizer,
  defaultTheme: getPreferredCodeTheme(),
};

export const CodeExtension = defineExtension({
  name: "@shadcn-editor/editor/Code",
  dependencies: [
    configExtension(CodeShikiExtension, { tokenizer }),
    configExtension(CodeIndentExtension, {
      tabSize: 2,
      escapeWithArrows: true,
    }),
  ],
  register: (editor) => {
    const syncCodeTheme = () => {
      const theme = getPreferredCodeTheme();
      editor.update(() => {
        for (const codeNode of $nodesOfType(CodeNode)) {
          if (codeNode.getTheme() !== theme) {
            codeNode.setTheme(theme);
          }
        }
      });
    };

    const observer = new MutationObserver(syncCodeTheme);
    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ["class"],
    });

    return () => observer.disconnect();
  },
});
