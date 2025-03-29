'use client'

import { ImageIcon } from 'lucide-react'

import { useToolbarContext } from '@/registry/new-york/editor/context/toolbar-context'
import { SelectItem } from '@/registry/new-york/ui/select'

import { InsertImageDialog } from '@/registry/new-york/editor/plugins/images-plugin'

export function InsertImage() {
  const { activeEditor, showModal } = useToolbarContext()

  return (
    <SelectItem
      value="image"
      onPointerUp={(e) => {
        showModal('Insert Image', (onClose) => (
          <InsertImageDialog activeEditor={activeEditor} onClose={onClose} />
        ))
      }}
      className=""
    >
      <div className="flex items-center gap-1">
        <ImageIcon className="size-4" />
        <span>Image</span>
      </div>
    </SelectItem>
  )
}
