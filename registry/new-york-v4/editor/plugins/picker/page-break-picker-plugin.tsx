import { ScissorsIcon } from "lucide-react"

import { INSERT_PAGE_BREAK } from "@/registry/new-york-v4/editor/plugins/page-break-plugin"
import { ComponentPickerOption } from "@/registry/new-york-v4/editor/plugins/picker/component-picker-option"

export function PageBreakPickerPlugin() {
  return new ComponentPickerOption("Page Break", {
    icon: <ScissorsIcon className="size-4" />,
    keywords: ["page break", "divider"],
    onSelect: (_, editor) =>
      editor.dispatchCommand(INSERT_PAGE_BREAK, undefined),
  })
}
