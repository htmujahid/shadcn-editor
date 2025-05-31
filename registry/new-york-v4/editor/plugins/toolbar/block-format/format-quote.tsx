import { $createQuoteNode } from "@lexical/rich-text"
import { $setBlocksType } from "@lexical/selection"
import { $getSelection } from "lexical"

import { useToolbarContext } from "@/registry/new-york-v4/editor/context/toolbar-context"
import { blockTypeToBlockName } from "@/registry/new-york-v4/editor/plugins/toolbar/block-format/block-format-data"
import { SelectItem } from "@/registry/new-york-v4/ui/select"

const BLOCK_FORMAT_VALUE = "quote"

export function FormatQuote() {
  const { activeEditor, blockType } = useToolbarContext()

  const formatQuote = () => {
    if (blockType !== "quote") {
      activeEditor.update(() => {
        const selection = $getSelection()
        $setBlocksType(selection, () => $createQuoteNode())
      })
    }
  }

  return (
    <SelectItem value="quote" onPointerDown={formatQuote}>
      <div className="flex items-center gap-1 font-normal">
        {blockTypeToBlockName[BLOCK_FORMAT_VALUE].icon}
        {blockTypeToBlockName[BLOCK_FORMAT_VALUE].label}
      </div>
    </SelectItem>
  )
}
