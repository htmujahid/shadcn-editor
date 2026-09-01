import {
  $createParagraphNode,
  $insertNodes,
  $isRootOrShadowRoot,
  COMMAND_PRIORITY_EDITOR,
  defineExtension,
} from "lexical"

import {
  $createImageNode,
  ImageNode,
  INSERT_IMAGE_COMMAND,
} from "@/components/editor/nodes/image-node"

export const ImageExtension = defineExtension({
  name: "@shadcn-editor/editor/Image",
  nodes: () => [ImageNode],
  register: (editor) =>
    editor.registerCommand(
      INSERT_IMAGE_COMMAND,
      (payload) => {
        const imageNode = $createImageNode(payload)
        $insertNodes([imageNode])
        if ($isRootOrShadowRoot(imageNode.getParentOrThrow())) {
          const paragraph = $createParagraphNode()
          imageNode.replace(paragraph)
          paragraph.append(imageNode)
          paragraph.selectEnd()
        }
        return true
      },
      COMMAND_PRIORITY_EDITOR
    ),
})
