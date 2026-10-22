import type { ReactNode } from "react";

import { type ElementFormatType, FORMAT_ELEMENT_COMMAND } from "lexical";

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

type AlignItem = {
  value: Exclude<ElementFormatType, "">;
  labelKey: keyof Locale;
  icon: ReactNode;
};

function AlignToggleGroup({ items }: { items: AlignItem[] }) {
  const [editor] = useLexicalComposerContext();
  const { t } = useTranslation();
  const elementFormat = useFormatStateValue("elementFormat");
  const isEditable = useLexicalEditable();
  return (
    <ToggleGroup
      variant="outline"
      size="sm"
      spacing={0}
      disabled={!isEditable}
      value={[elementFormat]}
      onValueChange={(value) => {
        const next = value[0] as Exclude<ElementFormatType, ""> | undefined;
        if (next) {
          editor.dispatchCommand(FORMAT_ELEMENT_COMMAND, next);
        }
      }}
    >
      {items.map(({ value, labelKey, icon }) => (
        <Tooltip key={value}>
          <TooltipTrigger
            render={
              <ToggleGroupItem value={value} aria-label={t[labelKey]}>
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

export function ElementFormatToolbarPlugin({
  formats = "all",
}: {
  formats?: "basic" | "all";
}) {
  const { dir } = useTranslation();
  const isRtl = dir === "rtl";

  const alignGroups: AlignItem[][] = [
    [
      {
        value: "left",
        icon: (
          <IconPlaceholder
            lucide="AlignLeft"
            tabler="IconAlignLeft"
            hugeicons="TextAlignLeftIcon"
            phosphor="TextAlignLeftIcon"
            remixicon="RiAlignLeft"
          />
        ),
        labelKey: "alignLeft",
      },
      {
        value: "center",
        icon: (
          <IconPlaceholder
            lucide="AlignCenter"
            tabler="IconAlignCenter"
            hugeicons="TextAlignCenterIcon"
            phosphor="TextAlignCenterIcon"
            remixicon="RiAlignCenter"
          />
        ),
        labelKey: "alignCenter",
      },
      {
        value: "right",
        icon: (
          <IconPlaceholder
            lucide="AlignRight"
            tabler="IconAlignRight"
            hugeicons="TextAlignRightIcon"
            phosphor="TextAlignRightIcon"
            remixicon="RiAlignRight"
          />
        ),
        labelKey: "alignRight",
      },
      {
        value: "justify",
        icon: (
          <IconPlaceholder
            lucide="AlignJustify"
            tabler="IconAlignJustified"
            hugeicons="TextAlignJustifyCenterIcon"
            phosphor="TextAlignJustifyIcon"
            remixicon="RiAlignJustify"
          />
        ),
        labelKey: "alignJustify",
      },
    ],
    [
      {
        value: "start",
        icon: isRtl ? (
          <IconPlaceholder
            lucide="PilcrowRight"
            tabler="IconPilcrowRight"
            hugeicons="ParagraphIcon"
            phosphor="ParagraphIcon"
            remixicon="RiParagraph"
          />
        ) : (
          <IconPlaceholder
            lucide="PilcrowLeft"
            tabler="IconPilcrowLeft"
            hugeicons="ParagraphIcon"
            phosphor="ParagraphIcon"
            remixicon="RiParagraph"
          />
        ),
        labelKey: "alignStart",
      },
      {
        value: "end",
        icon: isRtl ? (
          <IconPlaceholder
            lucide="PilcrowLeft"
            tabler="IconPilcrowLeft"
            hugeicons="ParagraphIcon"
            phosphor="ParagraphIcon"
            remixicon="RiParagraph"
          />
        ) : (
          <IconPlaceholder
            lucide="PilcrowRight"
            tabler="IconPilcrowRight"
            hugeicons="ParagraphIcon"
            phosphor="ParagraphIcon"
            remixicon="RiParagraph"
          />
        ),
        labelKey: "alignEnd",
      },
    ],
  ];

  const groups = formats === "basic" ? alignGroups.slice(0, 1) : alignGroups;

  return (
    <>
      {groups.map((items, groupIndex) => (
        <AlignToggleGroup key={groupIndex} items={items} />
      ))}
    </>
  );
}
