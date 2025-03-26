import { TextIcon } from "lucide-react"
import { $createParagraphNode, $getSelection, $isRangeSelection } from "lexical"
import { $setBlocksType } from "@lexical/selection"

import { ComponentPickerOption } from "@/registry/default/editor/plugins/picker/component-picker-option";

export function ParagraphPickerPlugin() {
  return new ComponentPickerOption('Paragraph', {
    icon: <TextIcon className="size-4" />,
    keywords: ['normal', 'paragraph', 'p', 'text'],
    onSelect: (_, editor) =>
      editor.update(() => {
        const selection = $getSelection()
        if ($isRangeSelection(selection)) {
          $setBlocksType(selection, () => $createParagraphNode())
        }
      }),
  })
}