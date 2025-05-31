import { INSERT_ORDERED_LIST_COMMAND } from "@lexical/list"
import { ListOrderedIcon } from "lucide-react"

import { ComponentPickerOption } from "@/registry/new-york-v4/editor/plugins/picker/component-picker-option"

export function NumberedListPickerPlugin() {
  return new ComponentPickerOption("Numbered List", {
    icon: <ListOrderedIcon className="size-4" />,
    keywords: ["numbered list", "ordered list", "ol"],
    onSelect: (_, editor) =>
      editor.dispatchCommand(INSERT_ORDERED_LIST_COMMAND, undefined),
  })
}
