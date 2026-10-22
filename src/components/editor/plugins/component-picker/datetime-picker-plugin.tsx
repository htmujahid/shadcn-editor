import { type ReactNode, useMemo } from "react";

import { $getRoot, $getSelection, type LexicalEditor } from "lexical";

import { useLexicalComposerContext } from "@lexical/react/LexicalComposerContext";

import { addDays } from "date-fns";

import { INSERT_DATETIME_COMMAND } from "@/components/editor/extensions/datetime";
import type { Locale } from "@/components/editor/locales";
import {
  type ComponentPickerItem,
  useComponentPickerItems,
} from "@/components/editor/plugins/component-picker/component-picker-plugin";
import { useTranslation } from "@/components/editor/plugins/i18n-plugin";
import { IconPlaceholder } from "@/components/icon-placeholder";

const DATETIME_ITEMS: {
  value: string;
  labelKey: keyof Locale;
  icon: ReactNode;
  offsetDays: number;
  keywords: string[];
}[] = [
  {
    value: "datetime",
    labelKey: "insertDateTime",
    icon: (
      <IconPlaceholder
        lucide="CalendarDays"
        tabler="IconCalendarWeek"
        hugeicons="Calendar03Icon"
        phosphor="CalendarDotsIcon"
        remixicon="RiCalendar2Line"
        className="text-muted-foreground"
      />
    ),
    offsetDays: 0,
    keywords: ["date", "time", "datetime", "calendar"],
  },
  {
    value: "datetime-today",
    labelKey: "dateTimeToday",
    icon: (
      <IconPlaceholder
        lucide="CalendarCheck"
        tabler="IconCalendarCheck"
        hugeicons="CalendarCheck01Icon"
        phosphor="CalendarCheckIcon"
        remixicon="RiCalendarCheckLine"
        className="text-muted-foreground"
      />
    ),
    offsetDays: 0,
    keywords: ["today", "date", "now"],
  },
  {
    value: "datetime-tomorrow",
    labelKey: "dateTimeTomorrow",
    icon: (
      <IconPlaceholder
        lucide="CalendarPlus"
        tabler="IconCalendarPlus"
        hugeicons="CalendarAdd01Icon"
        phosphor="CalendarPlusIcon"
        remixicon="RiCalendarEventLine"
        className="text-muted-foreground"
      />
    ),
    offsetDays: 1,
    keywords: ["tomorrow", "date"],
  },
  {
    value: "datetime-yesterday",
    labelKey: "dateTimeYesterday",
    icon: (
      <IconPlaceholder
        lucide="CalendarMinus"
        tabler="IconCalendarMinus"
        hugeicons="CalendarMinus01Icon"
        phosphor="CalendarMinusIcon"
        remixicon="RiCalendarCloseLine"
        className="text-muted-foreground"
      />
    ),
    offsetDays: -1,
    keywords: ["yesterday", "date"],
  },
];

function insertDateTime(editor: LexicalEditor, offsetDays: number) {
  editor.update(() => {
    if (!$getSelection()) {
      $getRoot().selectEnd();
    }
  });
  const date = addDays(new Date(), offsetDays);
  date.setHours(0, 0, 0, 0);
  editor.dispatchCommand(INSERT_DATETIME_COMMAND, { dateTime: date });
}

export function DateTimePickerPlugin() {
  const [editor] = useLexicalComposerContext();
  const { t } = useTranslation();

  const items = useMemo<ComponentPickerItem[]>(
    () =>
      DATETIME_ITEMS.map(({ value, labelKey, icon, offsetDays, keywords }) => ({
        value,
        label: t[labelKey],
        icon,
        keywords,
        onSelect: () => insertDateTime(editor, offsetDays),
      })),
    [editor, t],
  );

  useComponentPickerItems(items);

  return null;
}
