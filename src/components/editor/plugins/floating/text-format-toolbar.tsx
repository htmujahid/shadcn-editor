import { type Dispatch, useMemo } from "react";

import {
  FORMAT_TEXT_COMMAND,
  type LexicalEditor,
  type TextFormatType,
} from "lexical";

import { TOGGLE_LINK_COMMAND } from "@lexical/link";

import {
  Bold,
  CaseLower,
  CaseSensitive,
  CaseUpper,
  Code,
  Highlighter,
  Italic,
  Languages,
  Link as LinkIcon,
  type LucideIcon,
  Strikethrough,
  Subscript,
  Superscript,
  Underline,
} from "lucide-react";

import { useFormatStateValue } from "@/components/editor/extensions/format-state";
import { toggleRubyEditor } from "@/components/editor/extensions/ruby";
import type { Locale } from "@/components/editor/locales";
import { RubyNode } from "@/components/editor/nodes/ruby-node";
import { useTranslation } from "@/components/editor/plugins/i18n-plugin";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";

const FORMAT_GROUPS: {
  format: TextFormatType;
  labelKey: keyof Locale;
  icon: LucideIcon;
}[][] = [
  [
    { format: "bold", labelKey: "bold", icon: Bold },
    { format: "italic", labelKey: "italic", icon: Italic },
    { format: "underline", labelKey: "underline", icon: Underline },
    { format: "strikethrough", labelKey: "strikethrough", icon: Strikethrough },
  ],
  [
    { format: "highlight", labelKey: "highlight", icon: Highlighter },
    { format: "code", labelKey: "inlineCode", icon: Code },
  ],
  [
    { format: "subscript", labelKey: "subscript", icon: Subscript },
    { format: "superscript", labelKey: "superscript", icon: Superscript },
  ],
  [
    { format: "uppercase", labelKey: "uppercase", icon: CaseUpper },
    { format: "lowercase", labelKey: "lowercase", icon: CaseLower },
    { format: "capitalize", labelKey: "titleCase", icon: CaseSensitive },
  ],
];

function FormatToggleGroup({
  editor,
  items,
}: {
  editor: LexicalEditor;
  items: (typeof FORMAT_GROUPS)[number];
}) {
  const { t } = useTranslation();
  const formats = useFormatStateValue("formats");
  return (
    <ToggleGroup
      multiple
      variant="outline"
      size="sm"
      spacing={0}
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
      {items.map(({ format, labelKey, icon: Icon }) => (
        <Tooltip key={format}>
          <TooltipTrigger
            render={
              <ToggleGroupItem value={format} aria-label={t[labelKey]}>
                <Icon />
              </ToggleGroupItem>
            }
          />
          <TooltipContent>{t[labelKey]}</TooltipContent>
        </Tooltip>
      ))}
    </ToggleGroup>
  );
}

export function TextFormatToolbar({
  editor,
  linksEnabled,
  setIsLinkEditMode,
}: {
  editor: LexicalEditor;
  linksEnabled: boolean;
  setIsLinkEditMode: Dispatch<boolean>;
}) {
  const { t } = useTranslation();
  const isLink = useFormatStateValue("isLink");
  const rubyEnabled = useMemo(() => editor.hasNodes([RubyNode]), [editor]);

  const insertLink = () => {
    if (!isLink) {
      setIsLinkEditMode(true);
      editor.dispatchCommand(TOGGLE_LINK_COMMAND, "https://");
    } else {
      setIsLinkEditMode(false);
      editor.dispatchCommand(TOGGLE_LINK_COMMAND, null);
    }
  };

  return (
    <>
      {FORMAT_GROUPS.map((items, groupIndex) => (
        <FormatToggleGroup key={groupIndex} editor={editor} items={items} />
      ))}
      {(linksEnabled || rubyEnabled) && (
        <ToggleGroup
          multiple
          variant="outline"
          size="sm"
          spacing={0}
          value={isLink ? ["link"] : []}
          onValueChange={(value) => {
            const next = new Set(value as string[]);
            if (linksEnabled && next.has("link") !== isLink) {
              insertLink();
            }
            if (rubyEnabled && next.has("ruby")) {
              toggleRubyEditor(editor);
            }
          }}
        >
          {linksEnabled && (
            <Tooltip>
              <TooltipTrigger
                render={
                  <ToggleGroupItem value="link" aria-label={t.insertLink}>
                    <LinkIcon />
                  </ToggleGroupItem>
                }
              />
              <TooltipContent>{t.insertLink}</TooltipContent>
            </Tooltip>
          )}
          {rubyEnabled && (
            <Tooltip>
              <TooltipTrigger
                render={
                  <ToggleGroupItem value="ruby" aria-label={t.insertRuby}>
                    <Languages />
                  </ToggleGroupItem>
                }
              />
              <TooltipContent>{t.insertRuby}</TooltipContent>
            </Tooltip>
          )}
        </ToggleGroup>
      )}
    </>
  );
}
