import { Keyboard } from "lucide-react";

import {
  type BuiltinShortcutName,
  formatShortcut,
  type ShortcutName,
} from "@/components/editor/extensions/shortcuts";
import type { Locale } from "@/components/editor/locales";
import { useTranslation } from "@/components/editor/plugins/i18n-plugin";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Kbd, KbdGroup } from "@/components/ui/kbd";

type ShortcutRow = {
  name: ShortcutName | BuiltinShortcutName;
  labelKey: keyof Locale;
};

const SHORTCUT_GROUPS: { groupKey: keyof Locale; rows: ShortcutRow[] }[] = [
  {
    groupKey: "shortcutsHistory",
    rows: [
      { name: "UNDO", labelKey: "undo" },
      { name: "REDO", labelKey: "redo" },
    ],
  },
  {
    groupKey: "shortcutsFormatting",
    rows: [
      { name: "BOLD", labelKey: "bold" },
      { name: "ITALIC", labelKey: "italic" },
      { name: "UNDERLINE", labelKey: "underline" },
      { name: "STRIKETHROUGH", labelKey: "strikethrough" },
      { name: "INSERT_CODE_BLOCK", labelKey: "inlineCode" },
      { name: "SUBSCRIPT", labelKey: "subscript" },
      { name: "SUPERSCRIPT", labelKey: "superscript" },
      { name: "LOWERCASE", labelKey: "lowercase" },
      { name: "UPPERCASE", labelKey: "uppercase" },
      { name: "CAPITALIZE", labelKey: "titleCase" },
      { name: "LEFT_ALIGN", labelKey: "alignLeft" },
      { name: "CENTER_ALIGN", labelKey: "alignCenter" },
      { name: "RIGHT_ALIGN", labelKey: "alignRight" },
      { name: "JUSTIFY_ALIGN", labelKey: "alignJustify" },
      { name: "INDENT", labelKey: "indent" },
      { name: "OUTDENT", labelKey: "outdent" },
      { name: "CLEAR_FORMATTING", labelKey: "clearFormatting" },
    ],
  },
  {
    groupKey: "shortcutsParagraphs",
    rows: [
      { name: "NORMAL", labelKey: "paragraph" },
      { name: "HEADING1", labelKey: "heading1" },
      { name: "HEADING2", labelKey: "heading2" },
      { name: "HEADING3", labelKey: "heading3" },
      { name: "QUOTE", labelKey: "quote" },
      { name: "CODE_BLOCK", labelKey: "insertCodeBlock" },
    ],
  },
  {
    groupKey: "shortcutsLists",
    rows: [
      { name: "NUMBERED_LIST", labelKey: "numberedListBlock" },
      { name: "BULLET_LIST", labelKey: "bulletedListBlock" },
      { name: "CHECK_LIST", labelKey: "checkListBlock" },
    ],
  },
];

export function ShortcutPlugin() {
  const { t, dir } = useTranslation();

  return (
    <Dialog>
      <DialogTrigger
        render={
          <Button
            variant="ghost"
            size="icon-xs"
            className="text-muted-foreground"
            title={t.keyboardShortcuts}
            aria-label={t.keyboardShortcuts}
          >
            <Keyboard />
          </Button>
        }
      />
      <DialogContent dir={dir} className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>{t.keyboardShortcuts}</DialogTitle>
        </DialogHeader>
        <div className="-mx-4 no-scrollbar max-h-[60vh] overflow-y-auto px-4">
          {SHORTCUT_GROUPS.map(({ groupKey, rows }) => (
            <section key={groupKey} className="mb-4 last:mb-0">
              <h3 className="mb-1.5 text-xs font-medium text-muted-foreground">
                {t[groupKey]}
              </h3>
              <div className="divide-y divide-border rounded-md border">
                {rows.map(({ name, labelKey }) => (
                  <div
                    key={name}
                    className="flex items-center justify-between gap-3 px-3 py-1.5 text-sm"
                  >
                    <span>{t[labelKey]}</span>
                    <KbdGroup>
                      {formatShortcut(name).map((segment, index) => (
                        <Kbd key={index}>{segment}</Kbd>
                      ))}
                    </KbdGroup>
                  </div>
                ))}
              </div>
            </section>
          ))}
        </div>
      </DialogContent>
    </Dialog>
  );
}
