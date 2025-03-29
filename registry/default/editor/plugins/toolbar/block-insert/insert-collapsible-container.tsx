'use client'

import { ChevronRightIcon } from 'lucide-react'

import { useToolbarContext } from '@/registry/default/editor/context/toolbar-context'
import { SelectItem } from '@/registry/default/ui/select'

import { INSERT_COLLAPSIBLE_COMMAND } from '@/registry/default/editor/plugins/collapsible-plugin'

export function InsertCollapsibleContainer() {
  const { activeEditor } = useToolbarContext()
  return (
    <SelectItem
      value="collapsible"
      onPointerUp={() =>
        activeEditor.dispatchCommand(INSERT_COLLAPSIBLE_COMMAND, undefined)
      }
      className=""
    >
      <div className="flex items-center gap-1">
        <ChevronRightIcon className="size-4" />
        <span>Collapsible container</span>
      </div>
    </SelectItem>
  )
}
