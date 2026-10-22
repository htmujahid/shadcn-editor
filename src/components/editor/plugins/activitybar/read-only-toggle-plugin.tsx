import { useEffect, useState } from "react";

import { useLexicalComposerContext } from "@lexical/react/LexicalComposerContext";

import { useTranslation } from "@/components/editor/plugins/i18n-plugin";
import { IconPlaceholder } from "@/components/icon-placeholder";
import { Button } from "@/components/ui/button";

export function ReadOnlyTogglePlugin() {
  const [editor] = useLexicalComposerContext();
  const { t } = useTranslation();
  const [isEditable, setIsEditable] = useState(() => editor.isEditable());

  useEffect(() => {
    return editor.registerEditableListener(setIsEditable);
  }, [editor]);

  const label = isEditable ? t.switchToReadOnly : t.switchToEditMode;

  return (
    <Button
      variant="ghost"
      size="icon-xs"
      className="text-muted-foreground"
      title={label}
      aria-label={label}
      aria-pressed={!isEditable}
      onClick={() => editor.setEditable(!editor.isEditable())}
    >
      {isEditable ? (
        <IconPlaceholder
          lucide="LockOpen"
          tabler="IconLockOpen"
          hugeicons="SquareUnlock01Icon"
          phosphor="LockOpenIcon"
          remixicon="RiLockUnlockLine"
        />
      ) : (
        <IconPlaceholder
          lucide="Lock"
          tabler="IconLock"
          hugeicons="LockIcon"
          phosphor="LockIcon"
          remixicon="RiLockLine"
        />
      )}
    </Button>
  );
}
