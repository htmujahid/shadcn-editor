import { useMemo } from "react";

import { $getRoot, $getSelection } from "lexical";

import { INSERT_CHECK_LIST_COMMAND } from "@lexical/list";
import { useLexicalComposerContext } from "@lexical/react/LexicalComposerContext";

import {
  type ComponentPickerItem,
  useComponentPickerItems,
} from "@/components/editor/plugins/component-picker/component-picker-plugin";
import { useTranslation } from "@/components/editor/plugins/i18n-plugin";
import { IconPlaceholder } from "@/components/icon-placeholder";

export function CheckListPickerPlugin() {
  const [editor] = useLexicalComposerContext();
  const { t } = useTranslation();

  const items = useMemo<ComponentPickerItem[]>(
    () => [
      {
        value: "check-list",
        label: t.checkListBlock,
        icon: (
          <IconPlaceholder
            lucide="ListTodo"
            tabler="IconListCheck"
            hugeicons="CheckListIcon"
            phosphor="ListChecksIcon"
            remixicon="RiListCheck2"
            className="text-muted-foreground"
          />
        ),
        keywords: ["check list", "todo list", "checkbox"],
        onSelect: () => {
          editor.update(() => {
            if (!$getSelection()) {
              $getRoot().selectEnd();
            }
          });
          editor.dispatchCommand(INSERT_CHECK_LIST_COMMAND, undefined);
        },
      },
    ],
    [editor, t],
  );

  useComponentPickerItems(items);

  return null;
}
