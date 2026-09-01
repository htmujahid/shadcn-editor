import {
  COMMAND_PRIORITY_EDITOR,
  configExtension,
  createCommand,
  defineExtension,
  type LexicalCommand,
} from "lexical"

import { defineImportRule, DOMImportExtension, sel } from "@lexical/html"
import { $insertNodeToNearestRoot } from "@lexical/utils"

import {
  $createYouTubeNode,
  YouTubeNode,
} from "@/components/editor/nodes/youtube-node"

export const INSERT_YOUTUBE_COMMAND: LexicalCommand<string> = createCommand(
  "INSERT_YOUTUBE_COMMAND"
)

const YouTubeImportRule = defineImportRule({
  $import: (ctx) => [$createYouTubeNode(ctx.captures.id[0])],
  match: sel
    .tag("iframe")
    .attr("data-lexical-youtube", /^.+$/, { capture: "id" }),
  name: "@shadcn-editor/editor/youtube",
})

export const YouTubeExtension = defineExtension({
  name: "@shadcn-editor/editor/YouTube",
  dependencies: [
    configExtension(DOMImportExtension, {
      rules: [YouTubeImportRule],
    }),
  ],
  nodes: () => [YouTubeNode],
  register: (editor) =>
    editor.registerCommand(
      INSERT_YOUTUBE_COMMAND,
      (videoID) => {
        const youTubeNode = $createYouTubeNode(videoID)
        $insertNodeToNearestRoot(youTubeNode)
        return true
      },
      COMMAND_PRIORITY_EDITOR
    ),
})
