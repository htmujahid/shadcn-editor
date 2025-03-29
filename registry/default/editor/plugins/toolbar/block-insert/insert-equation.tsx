'use client'

import { DiffIcon } from 'lucide-react'

import { useToolbarContext } from '@/registry/default/editor/context/toolbar-context'
import { SelectItem } from '@/registry/default/ui/select'

import { InsertEquationDialog } from '@/registry/default/editor/plugins/equations-plugin'

export function InsertEquation() {
  const { activeEditor, showModal } = useToolbarContext()

  return (
    <SelectItem
      value="equation"
      onPointerUp={() =>
        showModal('Insert Equation', (onClose) => (
          <InsertEquationDialog activeEditor={activeEditor} onClose={onClose} />
        ))
      }
      className=""
    >
      <div className="flex items-center gap-1">
        <DiffIcon className="size-4" />
        <span>Equation</span>
      </div>
    </SelectItem>
  )
}
