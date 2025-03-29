'use client'

import { SquareSplitVerticalIcon } from 'lucide-react'

import { useToolbarContext } from '@/registry/new-york/editor/context/toolbar-context'
import { SelectItem } from '@/registry/new-york/ui/select'

import { INSERT_PAGE_BREAK } from '@/registry/new-york/editor/plugins/page-break-plugin'

export function InsertPageBreak() {
  const { activeEditor } = useToolbarContext()

  return (
    <SelectItem
      value="page-break"
      onPointerUp={() =>
        activeEditor.dispatchCommand(INSERT_PAGE_BREAK, undefined)
      }
      className=""
    >
      <div className="flex items-center gap-1">
        <SquareSplitVerticalIcon className="size-4" />
        <span>Page Break</span>
      </div>
    </SelectItem>
  )
}
