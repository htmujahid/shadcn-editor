"use client"

import { FileImageIcon } from "lucide-react"

import { useToolbarContext } from "@/registry/new-york-v4/editor/context/toolbar-context"
import { InsertInlineImageDialog } from "@/registry/new-york-v4/editor/plugins/inline-image-plugin"
import { SelectItem } from "@/registry/new-york-v4/ui/select"

export function InsertInlineImage() {
  const { activeEditor, showModal } = useToolbarContext()

  return (
    <SelectItem
      value="inline-image"
      onPointerUp={() =>
        showModal("Insert Inline Image", (onClose) => (
          <InsertInlineImageDialog
            activeEditor={activeEditor}
            onClose={onClose}
          />
        ))
      }
      className=""
    >
      <div className="flex items-center gap-1">
        <FileImageIcon className="size-4" />
        <span>Inline Image</span>
      </div>
    </SelectItem>
  )
}
