import { useEffect, useMemo, useState } from "react";

import {
  $createParagraphNode,
  $getRoot,
  $getSelection,
  $isElementNode,
  $isRangeSelection,
  COMMAND_PRIORITY_CRITICAL,
  type ElementNode,
  SELECTION_CHANGE_COMMAND,
} from "lexical";

import { getPeerDependencyFromEditor } from "@lexical/extension";
import {
  $isListNode,
  type CheckListExtension,
  INSERT_CHECK_LIST_COMMAND,
  INSERT_ORDERED_LIST_COMMAND,
  INSERT_UNORDERED_LIST_COMMAND,
  type ListExtension,
} from "@lexical/list";
import { useLexicalComposerContext } from "@lexical/react/LexicalComposerContext";
import { useLexicalEditable } from "@lexical/react/useLexicalEditable";
import {
  $createHeadingNode,
  $createQuoteNode,
  $isHeadingNode,
  $isQuoteNode,
} from "@lexical/rich-text";
import { $setBlocksType } from "@lexical/selection";
import { $findMatchingParent, mergeRegister } from "@lexical/utils";

import {
  Heading1,
  Heading2,
  Heading3,
  List,
  ListOrdered,
  ListTodo,
  type LucideIcon,
  Pilcrow,
  TextQuote,
} from "lucide-react";

import { $getSelectedNode } from "@/components/editor/extensions/format-state";
import type { Locale } from "@/components/editor/locales";
import { useTranslation } from "@/components/editor/plugins/i18n-plugin";
import {
  Combobox,
  ComboboxContent,
  ComboboxEmpty,
  ComboboxInput,
  ComboboxItem,
  ComboboxList,
} from "@/components/ui/combobox";

const BLOCK_TYPES = [
  "paragraph",
  "h1",
  "h2",
  "h3",
  "number",
  "bullet",
  "check",
  "quote",
] as const;

type BlockType = (typeof BLOCK_TYPES)[number];

const BLOCK_ITEMS: Record<
  BlockType,
  { labelKey: keyof Locale; icon: LucideIcon }
> = {
  paragraph: { labelKey: "paragraph", icon: Pilcrow },
  h1: { labelKey: "heading1", icon: Heading1 },
  h2: { labelKey: "heading2", icon: Heading2 },
  h3: { labelKey: "heading3", icon: Heading3 },
  number: { labelKey: "numberedListBlock", icon: ListOrdered },
  bullet: { labelKey: "bulletedListBlock", icon: List },
  check: { labelKey: "checkListBlock", icon: ListTodo },
  quote: { labelKey: "quote", icon: TextQuote },
};

function $getBlockType(): BlockType | null {
  const selection = $getSelection();
  if (!$isRangeSelection(selection)) {
    return null;
  }
  const node = $getSelectedNode(selection);
  const list = $findMatchingParent(node, $isListNode);
  if (list) {
    return list.getListType();
  }
  const element = $findMatchingParent(
    node,
    (parent): parent is ElementNode =>
      $isElementNode(parent) && !parent.isInline(),
  );
  if ($isHeadingNode(element)) {
    const tag = element.getTag();
    return (BLOCK_TYPES as readonly string[]).includes(tag)
      ? (tag as BlockType)
      : "paragraph";
  }
  return $isQuoteNode(element) ? "quote" : "paragraph";
}

function $createBlockNode(blockType: BlockType) {
  switch (blockType) {
    case "h1":
    case "h2":
    case "h3":
      return $createHeadingNode(blockType);
    case "quote":
      return $createQuoteNode();
    default:
      return $createParagraphNode();
  }
}

function useBlockType(): BlockType {
  const [editor] = useLexicalComposerContext();
  const [blockType, setBlockType] = useState<BlockType>(
    () => editor.getEditorState().read($getBlockType) ?? "paragraph",
  );

  useEffect(() => {
    return mergeRegister(
      editor.registerUpdateListener(({ editorState }) => {
        const next = editorState.read($getBlockType);
        if (next) {
          setBlockType(next);
        }
      }),
      editor.registerCommand(
        SELECTION_CHANGE_COMMAND,
        () => {
          const next = $getBlockType();
          if (next) {
            setBlockType(next);
          }
          return false;
        },
        COMMAND_PRIORITY_CRITICAL,
      ),
    );
  }, [editor]);

  return blockType;
}

export function BlockFormatToolbarPlugin() {
  const [editor] = useLexicalComposerContext();
  const { t, dir, language } = useTranslation();
  const blockType = useBlockType();
  const isEditable = useLexicalEditable();

  const items = useMemo(() => {
    const hasList =
      getPeerDependencyFromEditor<typeof ListExtension>(
        editor,
        "@lexical/list/List",
      ) !== undefined;
    const hasCheckList =
      getPeerDependencyFromEditor<typeof CheckListExtension>(
        editor,
        "@lexical/list/CheckList",
      ) !== undefined;
    return BLOCK_TYPES.filter((item) => {
      if (item === "number" || item === "bullet") {
        return hasList;
      }
      if (item === "check") {
        return hasCheckList;
      }
      return true;
    });
  }, [editor]);

  return (
    <Combobox
      key={language}
      items={items}
      value={blockType}
      disabled={!isEditable}
      itemToStringLabel={(item) => t[BLOCK_ITEMS[item].labelKey]}
      onValueChange={(value) => {
        if (!value) {
          return;
        }
        editor.update(() => {
          if (!$getSelection()) {
            $getRoot().selectEnd();
          }
        });
        switch (value) {
          case "number":
            editor.dispatchCommand(INSERT_ORDERED_LIST_COMMAND, undefined);
            return;
          case "bullet":
            editor.dispatchCommand(INSERT_UNORDERED_LIST_COMMAND, undefined);
            return;
          case "check":
            editor.dispatchCommand(INSERT_CHECK_LIST_COMMAND, undefined);
            return;
        }
        editor.update(() => {
          const selection = $getSelection() ?? $getRoot().selectEnd();
          $setBlocksType(selection, () => $createBlockNode(value));
        });
      }}
    >
      <ComboboxInput
        aria-label={t.blockFormatTrigger}
        disabled={!isEditable}
        className="h-7 w-48"
      />
      <ComboboxContent dir={dir}>
        <ComboboxEmpty>{t.noMatches}</ComboboxEmpty>
        <ComboboxList>
          {(item: BlockType) => {
            const { labelKey, icon: Icon } = BLOCK_ITEMS[item];
            return (
              <ComboboxItem key={item} value={item}>
                <Icon className="text-muted-foreground" />
                {t[labelKey]}
              </ComboboxItem>
            );
          }}
        </ComboboxList>
      </ComboboxContent>
    </Combobox>
  );
}
