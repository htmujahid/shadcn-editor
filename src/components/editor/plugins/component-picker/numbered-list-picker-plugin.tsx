import { useMemo } from "react";

import { $getRoot, $getSelection } from "lexical";

import { INSERT_ORDERED_LIST_COMMAND } from "@lexical/list";
import { useLexicalComposerContext } from "@lexical/react/LexicalComposerContext";

import {
  type ComponentPickerItem,
  useComponentPickerItems,
} from "@/components/editor/plugins/component-picker/component-picker-plugin";
import { useTranslation } from "@/components/editor/plugins/i18n-plugin";
import { IconPlaceholder } from "@/components/icon-placeholder";

export function NumberedListPickerPlugin() {
  const [editor] = useLexicalComposerContext();
  const { t } = useTranslation();

  const items = useMemo<ComponentPickerItem[]>(
    () => [
      {
        value: "numbered-list",
        label: t.numberedListBlock,
        icon: (
          <IconPlaceholder
            lucide="ListOrdered"
            tabler="IconListNumbers"
            hugeicons="LeftToRightListNumberIcon"
            phosphor="ListNumbersIcon"
            remixicon="RiListOrdered"
            className="text-muted-foreground"
          />
        ),
        keywords: ["numbered list", "ordered list", "ol"],
        onSelect: () => {
          editor.update(() => {
            if (!$getSelection()) {
              $getRoot().selectEnd();
            }
          });
          editor.dispatchCommand(INSERT_ORDERED_LIST_COMMAND, undefined);
        },
      },
    ],
    [editor, t],
  );

  useComponentPickerItems(items);

  return null;
}
