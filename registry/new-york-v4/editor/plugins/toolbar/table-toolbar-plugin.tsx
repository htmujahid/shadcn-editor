"use client"

import { TableIcon } from "lucide-react"

import { useToolbarContext } from "@/registry/new-york-v4/editor/context/toolbar-context"
import { InsertTableDialog } from "@/registry/new-york-v4/editor/plugins/table-plugin"
import { Button } from "@/registry/new-york-v4/ui/button"

export function TableToolbarPlugin() {
  const { activeEditor, showModal } = useToolbarContext()

  return (
    <Button
      onClick={() =>
        showModal("Insert Table", (onClose) => (
          <InsertTableDialog activeEditor={activeEditor} onClose={onClose} />
        ))
      }
      size={"icon-sm"}
      variant={"outline"}
      className=""
    >
      <TableIcon className="size-4" />
    </Button>
  )
}
