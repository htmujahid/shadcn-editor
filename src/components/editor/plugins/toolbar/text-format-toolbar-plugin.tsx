import type { ReactNode } from "react";

import { FORMAT_TEXT_COMMAND, type TextFormatType } from "lexical";

import { useLexicalComposerContext } from "@lexical/react/LexicalComposerContext";
import { useLexicalEditable } from "@lexical/react/useLexicalEditable";

import { useFormatStateValue } from "@/components/editor/extensions/format-state";
import type { Locale } from "@/components/editor/locales";
import { useTranslation } from "@/components/editor/plugins/i18n-plugin";
import { IconPlaceholder } from "@/components/icon-placeholder";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";

const FORMAT_GROUPS: {
  format: TextFormatType;
  labelKey: keyof Locale;
  icon: ReactNode;
}[][] = [
  [
    {
      format: "bold",
      labelKey: "bold",
      icon: (
        <IconPlaceholder
          lucide="Bold"
          tabler="IconBold"
          hugeicons="TextBoldIcon"
          phosphor="TextBIcon"
          remixicon="RiBold"
        />
      ),
    },
    {
      format: "italic",
      labelKey: "italic",
      icon: (
        <IconPlaceholder
          lucide="Italic"
          tabler="IconItalic"
          hugeicons="TextItalicIcon"
          phosphor="TextItalicIcon"
          remixicon="RiItalic"
        />
      ),
    },
    {
      format: "underline",
      labelKey: "underline",
      icon: (
        <IconPlaceholder
          lucide="Underline"
          tabler="IconUnderline"
          hugeicons="TextUnderlineIcon"
          phosphor="TextUnderlineIcon"
          remixicon="RiUnderline"
        />
      ),
    },
    {
      format: "strikethrough",
      labelKey: "strikethrough",
      icon: (
        <IconPlaceholder
          lucide="Strikethrough"
          tabler="IconStrikethrough"
          hugeicons="TextStrikethroughIcon"
          phosphor="TextStrikethroughIcon"
          remixicon="RiStrikethrough"
        />
      ),
    },
  ],
  [
    {
      format: "highlight",
      labelKey: "highlight",
      icon: (
        <IconPlaceholder
          lucide="Highlighter"
          tabler="IconHighlight"
          hugeicons="HighlighterIcon"
          phosphor="HighlighterIcon"
          remixicon="RiMarkPenLine"
        />
      ),
    },
    {
      format: "code",
      labelKey: "inlineCode",
      icon: (
        <IconPlaceholder
          lucide="Code"
          tabler="IconCode"
          hugeicons="CodeIcon"
          phosphor="CodeIcon"
          remixicon="RiCodeLine"
        />
      ),
    },
  ],
  [
    {
      format: "subscript",
      labelKey: "subscript",
      icon: (
        <IconPlaceholder
          lucide="Subscript"
          tabler="IconSubscript"
          hugeicons="SubscriptIcon"
          phosphor="TextSubscriptIcon"
          remixicon="RiSubscript"
        />
      ),
    },
    {
      format: "superscript",
      labelKey: "superscript",
      icon: (
        <IconPlaceholder
          lucide="Superscript"
          tabler="IconSuperscript"
          hugeicons="SuperscriptIcon"
          phosphor="TextSuperscriptIcon"
          remixicon="RiSuperscript"
        />
      ),
    },
  ],
  [
    {
      format: "uppercase",
      labelKey: "uppercase",
      icon: (
        <IconPlaceholder
          lucide="CaseUpper"
          tabler="IconLetterCaseUpper"
          hugeicons="TextCreationIcon"
          phosphor="TextAUnderlineIcon"
          remixicon="RiFontSize"
        />
      ),
    },
    {
      format: "lowercase",
      labelKey: "lowercase",
      icon: (
        <IconPlaceholder
          lucide="CaseLower"
          tabler="IconLetterCaseLower"
          hugeicons="TextSmallcapsIcon"
          phosphor="TextAaIcon"
          remixicon="RiFontSize"
        />
      ),
    },
    {
      format: "capitalize",
      labelKey: "titleCase",
      icon: (
        <IconPlaceholder
          lucide="CaseSensitive"
          tabler="IconLetterCase"
          hugeicons="TextFontIcon"
          phosphor="TextAaIcon"
          remixicon="RiFontSize2"
        />
      ),
    },
  ],
];

function FormatToggleGroup({
  items,
}: {
  items: (typeof FORMAT_GROUPS)[number];
}) {
  const [editor] = useLexicalComposerContext();
  const { t } = useTranslation();
  const formats = useFormatStateValue("formats");
  const isEditable = useLexicalEditable();
  return (
    <ToggleGroup
      multiple
      variant="outline"
      size="sm"
      spacing={0}
      disabled={!isEditable}
      value={formats}
      onValueChange={(value) => {
        const next = new Set(value as TextFormatType[]);
        for (const { format } of items) {
          if (next.has(format) !== formats.includes(format)) {
            editor.dispatchCommand(FORMAT_TEXT_COMMAND, format);
          }
        }
      }}
    >
      {items.map(({ format, labelKey, icon }) => (
        <Tooltip key={format}>
          <TooltipTrigger
            render={
              <ToggleGroupItem value={format} aria-label={t[labelKey]}>
                {icon}
              </ToggleGroupItem>
            }
          />
          <TooltipContent>{t[labelKey]}</TooltipContent>
        </Tooltip>
      ))}
    </ToggleGroup>
  );
}

export function TextFormatToolbarPlugin({
  formats = "all",
}: {
  formats?: "basic" | "all";
}) {
  const groups =
    formats === "basic" ? FORMAT_GROUPS.slice(0, 1) : FORMAT_GROUPS;
  return (
    <>
      {groups.map((items, groupIndex) => (
        <FormatToggleGroup key={groupIndex} items={items} />
      ))}
    </>
  );
}
