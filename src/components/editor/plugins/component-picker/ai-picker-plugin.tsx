import { useMemo } from "react";

import { useLexicalComposerContext } from "@lexical/react/LexicalComposerContext";

import { Sparkles } from "lucide-react";

import { OPEN_AI_EDITOR_COMMAND } from "@/components/editor/extensions/ai";
import {
  type ComponentPickerItem,
  useComponentPickerItems,
} from "@/components/editor/plugins/component-picker/component-picker-plugin";
import { useTranslation } from "@/components/editor/plugins/i18n-plugin";

export function AiPickerPlugin() {
  const [editor] = useLexicalComposerContext();
  const { t } = useTranslation();

  const items = useMemo<ComponentPickerItem[]>(
    () => [
      {
        value: "ask-ai",
        label: t.askAi,
        icon: <Sparkles className="text-muted-foreground" />,
        keywords: ["ai", "ask", "assistant", "generate", "write"],
        onSelect: () => {
          editor.dispatchCommand(OPEN_AI_EDITOR_COMMAND, undefined);
        },
      },
    ],
    [editor, t],
  );

  useComponentPickerItems(items);

  return null;
}
