'use client'

import { TableIcon } from 'lucide-react'

import { useToolbarContext } from '@/registry/new-york/editor/context/toolbar-context'
import { SelectItem } from '@/registry/new-york/ui/select'

import { InsertTableDialog } from '@/registry/new-york/editor/plugins/table-plugin'

export function InsertTable() {
  const { activeEditor, showModal } = useToolbarContext()

  return (
    <SelectItem
      value="table"
      onPointerUp={() =>
        showModal('Insert Table', (onClose) => (
          <InsertTableDialog activeEditor={activeEditor} onClose={onClose} />
        ))
      }
      className=""
    >
      <div className="flex items-center gap-1">
        <TableIcon className="size-4" />
        <span>Table</span>
      </div>
    </SelectItem>
  )
}
