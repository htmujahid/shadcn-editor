'use client'

import { FileImageIcon } from 'lucide-react'

import { useToolbarContext } from '@/registry/default/editor/context/toolbar-context'
import { SelectItem } from '@/registry/default/ui/select'

import { InsertInlineImageDialog } from '@/registry/default/editor/plugins/inline-image-plugin'

export function InsertInlineImage() {
  const { activeEditor, showModal } = useToolbarContext()

  return (
    <SelectItem
      value="inline-image"
      onPointerUp={() =>
        showModal('Insert Inline Image', (onClose) => (
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
