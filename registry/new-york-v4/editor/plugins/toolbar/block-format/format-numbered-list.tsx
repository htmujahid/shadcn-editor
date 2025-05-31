import { INSERT_ORDERED_LIST_COMMAND } from "@lexical/list"
import { $setBlocksType } from "@lexical/selection"
import { $createParagraphNode, $getSelection, $isRangeSelection } from "lexical"

import { useToolbarContext } from "@/registry/new-york-v4/editor/context/toolbar-context"
import { blockTypeToBlockName } from "@/registry/new-york-v4/editor/plugins/toolbar/block-format/block-format-data"
import { SelectItem } from "@/registry/new-york-v4/ui/select"

const BLOCK_FORMAT_VALUE = "number"

export function FormatNumberedList() {
  const { activeEditor, blockType } = useToolbarContext()

  const formatParagraph = () => {
    activeEditor.update(() => {
      const selection = $getSelection()
      if ($isRangeSelection(selection)) {
        $setBlocksType(selection, () => $createParagraphNode())
      }
    })
  }

  const formatNumberedList = () => {
    if (blockType !== "number") {
      activeEditor.dispatchCommand(INSERT_ORDERED_LIST_COMMAND, undefined)
    } else {
      formatParagraph()
    }
  }

  return (
    <SelectItem value={BLOCK_FORMAT_VALUE} onPointerDown={formatNumberedList}>
      <div className="flex items-center gap-1 font-normal">
        {blockTypeToBlockName[BLOCK_FORMAT_VALUE].icon}
        {blockTypeToBlockName[BLOCK_FORMAT_VALUE].label}
      </div>
    </SelectItem>
  )
}
