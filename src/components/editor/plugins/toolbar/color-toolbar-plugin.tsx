import type { ReactNode } from "react";

import { $getRoot, $getSelection } from "lexical";

import { useLexicalComposerContext } from "@lexical/react/LexicalComposerContext";
import { useLexicalEditable } from "@lexical/react/useLexicalEditable";
import { $patchStyleText } from "@lexical/selection";

import { cn } from "cn";

import { useFormatStateValue } from "@/components/editor/extensions/format-state";
import { useTranslation } from "@/components/editor/plugins/i18n-plugin";
import { IconPlaceholder } from "@/components/icon-placeholder";
import { buttonVariants } from "@/components/ui/button";
import { ButtonGroup } from "@/components/ui/button-group";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";

const HEX_COLOR = /^#[0-9a-fA-F]{6}$/;

function ColorPicker({
  property,
  label,
  icon,
}: {
  property: "color" | "background-color";
  label: string;
  icon: ReactNode;
}) {
  const [editor] = useLexicalComposerContext();
  const isEditable = useLexicalEditable();
  const color = useFormatStateValue(
    property === "color" ? "color" : "backgroundColor",
  );

  return (
    <Tooltip>
      <TooltipTrigger
        render={
          <label
            data-slot="button"
            aria-label={label}
            className={cn(
              buttonVariants({ variant: "outline", size: "icon-sm" }),
              "cursor-pointer",
              !isEditable && "pointer-events-none opacity-50",
            )}
          >
            {icon}
            <input
              type="color"
              aria-label={label}
              value={HEX_COLOR.test(color) ? color : "#000000"}
              disabled={!isEditable}
              onChange={(event) => {
                const value = event.target.value;
                editor.update(() => {
                  const selection = $getSelection() ?? $getRoot().selectEnd();
                  $patchStyleText(selection, { [property]: value });
                });
              }}
              className="sr-only"
            />
          </label>
        }
      />
      <TooltipContent>{label}</TooltipContent>
    </Tooltip>
  );
}

export function ColorToolbarPlugin() {
  const { t } = useTranslation();
  return (
    <ButtonGroup>
      <ColorPicker
        property="color"
        label={t.textColor}
        icon={
          <IconPlaceholder
            lucide="Baseline"
            tabler="IconTextColor"
            hugeicons="TextColorIcon"
            phosphor="TextAaIcon"
            remixicon="RiFontColor"
          />
        }
      />
      <ColorPicker
        property="background-color"
        label={t.backgroundColor}
        icon={
          <IconPlaceholder
            lucide="PaintBucket"
            tabler="IconBucketDroplet"
            hugeicons="PaintBucketIcon"
            phosphor="PaintBucketIcon"
            remixicon="RiPaintFill"
          />
        }
      />
    </ButtonGroup>
  );
}
