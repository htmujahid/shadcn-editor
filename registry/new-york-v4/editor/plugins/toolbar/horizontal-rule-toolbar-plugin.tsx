"use client"

import { INSERT_HORIZONTAL_RULE_COMMAND } from "@lexical/react/LexicalHorizontalRuleNode"
import { ScissorsIcon } from "lucide-react"

import { useToolbarContext } from "@/registry/new-york-v4/editor/context/toolbar-context"
import { Button } from "@/registry/new-york-v4/ui/button"

export function HorizontalRuleToolbarPlugin() {
  const { activeEditor } = useToolbarContext()

  return (
    <Button
      onClick={() =>
        activeEditor.dispatchCommand(INSERT_HORIZONTAL_RULE_COMMAND, undefined)
      }
      size={"icon-sm"}
      variant={"outline"}
      className=""
    >
      <ScissorsIcon className="size-4" />
    </Button>
  )
}
