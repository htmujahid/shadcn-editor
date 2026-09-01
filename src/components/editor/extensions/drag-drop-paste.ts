import { COMMAND_PRIORITY_LOW, defineExtension } from "lexical"

import { DRAG_DROP_PASTE } from "@lexical/rich-text"
import { isMimeType, mediaFileReader } from "@lexical/utils"

import { ImageExtension } from "@/components/editor/extensions/image"
import { INSERT_IMAGE_COMMAND } from "@/components/editor/nodes/image-node"

const ACCEPTABLE_IMAGE_TYPES = [
  "image/",
  "image/heic",
  "image/heif",
  "image/gif",
  "image/webp",
]

export const DragDropPasteExtension = defineExtension({
  name: "@shadcn-editor/drag-drop-paste",
  dependencies: [ImageExtension],
  register: (editor) =>
    editor.registerCommand(
      DRAG_DROP_PASTE,
      (files) => {
        ;(async () => {
          const filesResult = await mediaFileReader(
            files,
            ACCEPTABLE_IMAGE_TYPES
          )
          for (const { file, result } of filesResult) {
            if (isMimeType(file, ACCEPTABLE_IMAGE_TYPES)) {
              editor.dispatchCommand(INSERT_IMAGE_COMMAND, {
                altText: file.name,
                src: result,
              })
            }
          }
        })()
        return true
      },
      COMMAND_PRIORITY_LOW
    ),
})
