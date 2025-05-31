import { FrameIcon } from "lucide-react"

import { INSERT_EXCALIDRAW_COMMAND } from "@/registry/new-york-v4/editor/plugins/excalidraw-plugin"
import { ComponentPickerOption } from "@/registry/new-york-v4/editor/plugins/picker/component-picker-option"

export function ExcalidrawPickerPlugin() {
  return new ComponentPickerOption("Excalidraw", {
    icon: <FrameIcon className="size-4" />,
    keywords: ["excalidraw", "diagram", "drawing"],
    onSelect: (_, editor) =>
      editor.dispatchCommand(INSERT_EXCALIDRAW_COMMAND, undefined),
  })
}
