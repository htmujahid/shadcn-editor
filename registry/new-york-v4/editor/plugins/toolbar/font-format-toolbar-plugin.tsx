"use client"

import { useState } from "react"
import { $isTableSelection } from "@lexical/table"
import {
  $isRangeSelection,
  BaseSelection,
  FORMAT_TEXT_COMMAND,
  TextFormatType,
} from "lexical"
import {
  BoldIcon,
  CodeIcon,
  ItalicIcon,
  StrikethroughIcon,
  UnderlineIcon,
} from "lucide-react"

import { useToolbarContext } from "@/registry/new-york-v4/editor/context/toolbar-context"
import { useUpdateToolbarHandler } from "@/registry/new-york-v4/editor/editor-hooks/use-update-toolbar"
import { Toggle } from "@/registry/new-york-v4/ui/toggle"

const Icons: Partial<Record<TextFormatType, React.ElementType>> = {
  bold: BoldIcon,
  italic: ItalicIcon,
  underline: UnderlineIcon,
  strikethrough: StrikethroughIcon,
  code: CodeIcon,
} as const

export function FontFormatToolbarPlugin({
  format,
}: {
  format: Omit<TextFormatType, "highlight" | "subscript" | "superscript">
}) {
  const { activeEditor } = useToolbarContext()
  const [isSelected, setIsSelected] = useState<boolean>(false)

  const $updateToolbar = (selection: BaseSelection) => {
    if ($isRangeSelection(selection) || $isTableSelection(selection)) {
      // @ts-ignore
      setIsSelected(selection.hasFormat(format as TextFormatType))
    }
  }

  useUpdateToolbarHandler($updateToolbar)

  const Icon = Icons[format as TextFormatType] as React.ElementType

  return (
    <Toggle
      aria-label="Toggle bold"
      variant="outline"
      size="sm"
      defaultPressed={isSelected}
      pressed={isSelected}
      onPressedChange={setIsSelected}
      onClick={() => {
        activeEditor.dispatchCommand(
          FORMAT_TEXT_COMMAND,
          format as TextFormatType
        )
      }}
    >
      <Icon className="h-4 w-4" />
    </Toggle>
  )
}
