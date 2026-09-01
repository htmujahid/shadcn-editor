import {
  COMMAND_PRIORITY_EDITOR,
  configExtension,
  createCommand,
  defineExtension,
  type LexicalCommand,
} from "lexical";

import { defineImportRule, DOMImportExtension, sel } from "@lexical/html";
import { $insertNodeToNearestRoot } from "@lexical/utils";

import {
  $createTweetNode,
  TweetNode,
} from "@/components/editor/nodes/tweet-node";

export const INSERT_TWEET_COMMAND: LexicalCommand<string> = createCommand(
  "INSERT_TWEET_COMMAND",
);

const TweetImportRule = defineImportRule({
  $import: (ctx) => [$createTweetNode(ctx.captures.id[0])],
  match: sel
    .tag("div")
    .attr("data-lexical-tweet-id", /^.+$/, { capture: "id" }),
  name: "@shadcn-editor/editor/tweet",
});

export const TwitterExtension = defineExtension({
  name: "@shadcn-editor/editor/Twitter",
  dependencies: [
    configExtension(DOMImportExtension, {
      rules: [TweetImportRule],
    }),
  ],
  nodes: () => [TweetNode],
  register: (editor) =>
    editor.registerCommand(
      INSERT_TWEET_COMMAND,
      (tweetID) => {
        const tweetNode = $createTweetNode(tweetID);
        $insertNodeToNearestRoot(tweetNode);
        return true;
      },
      COMMAND_PRIORITY_EDITOR,
    ),
});
