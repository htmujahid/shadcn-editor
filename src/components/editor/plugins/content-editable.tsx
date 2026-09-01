import { useEffect } from "react";

import { $getRoot, HISTORY_MERGE_TAG } from "lexical";

import { useLexicalComposerContext } from "@lexical/react/LexicalComposerContext";
import { ContentEditable as LexicalContentEditable } from "@lexical/react/LexicalContentEditable";

import { cva, type VariantProps } from "class-variance-authority";

import {
  type LocalizedText,
  useTranslation,
} from "@/components/editor/plugins/i18n-plugin";
import { cn } from "@/lib/utils";

const contentEditableVariants = cva(
  "min-h-full w-full bg-transparent text-sm outline-none",
  {
    variants: {
      variant: {
        default: "px-2.5 py-2",
        toolbar: "px-4 py-4",
        draggable: "px-12 py-4",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  },
);

const placeholderVariants = cva(
  "pointer-events-none absolute text-sm text-muted-foreground select-none",
  {
    variants: {
      variant: {
        default: "start-2.5 top-2",
        toolbar: "start-4 top-4",
        draggable: "start-12 top-4",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  },
);

export function ContentEditable({
  variant,
  className,
  placeholder,
  placeholderClassName,
}: VariantProps<typeof contentEditableVariants> & {
  className?: string;
  placeholder?: LocalizedText;
  placeholderClassName?: string;
}) {
  const [editor] = useLexicalComposerContext();
  const { language, dir, t } = useTranslation();
  const placeholderText = placeholder?.[language] ?? t.typeSomething;

  useEffect(() => {
    editor.update(
      () => {
        $getRoot().setDirection(dir);
      },
      { tag: HISTORY_MERGE_TAG },
    );
  }, [editor, dir]);

  return (
    <LexicalContentEditable
      className={cn(contentEditableVariants({ variant }), className)}
      aria-placeholder={placeholderText}
      placeholder={
        <div
          className={cn(placeholderVariants({ variant }), placeholderClassName)}
        >
          {placeholderText}
        </div>
      }
    />
  );
}
