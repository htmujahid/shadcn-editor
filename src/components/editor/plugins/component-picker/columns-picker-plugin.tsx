import { type ReactNode, useMemo } from "react";

import { $getRoot, $getSelection } from "lexical";

import { useLexicalComposerContext } from "@lexical/react/LexicalComposerContext";

import { INSERT_LAYOUT_COMMAND } from "@/components/editor/extensions/layout";
import type { Locale } from "@/components/editor/locales";
import {
  type ComponentPickerItem,
  useComponentPickerItems,
} from "@/components/editor/plugins/component-picker/component-picker-plugin";
import { useTranslation } from "@/components/editor/plugins/i18n-plugin";
import { IconPlaceholder } from "@/components/icon-placeholder";

const COLUMN_ITEMS: {
  value: string;
  labelKey: keyof Locale;
  icon: ReactNode;
  templateColumns: string;
}[] = [
  {
    value: "columns-one",
    labelKey: "columnsOne",
    icon: (
      <IconPlaceholder
        lucide="RectangleVertical"
        tabler="IconRectangleVertical"
        hugeicons="RectangularIcon"
        phosphor="RectangleIcon"
        remixicon="RiRectangleLine"
        className="text-muted-foreground"
      />
    ),
    templateColumns: "1fr",
  },
  {
    value: "columns-two",
    labelKey: "columnsTwo",
    icon: (
      <IconPlaceholder
        lucide="Columns2"
        tabler="IconColumns2"
        hugeicons="LayoutTwoColumnIcon"
        phosphor="ColumnsIcon"
        remixicon="RiLayoutColumnLine"
        className="text-muted-foreground"
      />
    ),
    templateColumns: "1fr 1fr",
  },
  {
    value: "columns-three",
    labelKey: "columnsThree",
    icon: (
      <IconPlaceholder
        lucide="Columns3"
        tabler="IconColumns3"
        hugeicons="LayoutThreeColumnIcon"
        phosphor="ColumnsPlusRightIcon"
        remixicon="RiLayoutGridLine"
        className="text-muted-foreground"
      />
    ),
    templateColumns: "1fr 1fr 1fr",
  },
];

export function ColumnsPickerPlugin() {
  const [editor] = useLexicalComposerContext();
  const { t } = useTranslation();

  const items = useMemo<ComponentPickerItem[]>(
    () =>
      COLUMN_ITEMS.map(({ value, labelKey, icon, templateColumns }) => ({
        value,
        label: t[labelKey],
        icon,
        keywords: ["columns", "layout", "grid"],
        onSelect: () => {
          editor.update(() => {
            if (!$getSelection()) {
              $getRoot().selectEnd();
            }
          });
          editor.dispatchCommand(INSERT_LAYOUT_COMMAND, templateColumns);
        },
      })),
    [editor, t],
  );

  useComponentPickerItems(items);

  return null;
}
