import {
  $createParagraphNode,
  $insertNodes,
  $isRootOrShadowRoot,
  COMMAND_PRIORITY_EDITOR,
  type LexicalCommand,
  configExtension,
  createCommand,
  defineExtension,
} from "lexical";

import {
  CoreImportExtension,
  DOMImportExtension,
  defineImportRule,
  sel,
} from "@lexical/html";
import { $wrapNodeInElement } from "@lexical/utils";

import {
  $createPollNode,
  PollNode,
  createPollOption,
} from "@/components/editor/nodes/poll-node";

export const INSERT_POLL_COMMAND: LexicalCommand<string> = createCommand(
  "INSERT_POLL_COMMAND",
);

function $convertPollElement(el: HTMLElement) {
  const question = el.getAttribute("data-lexical-poll-question");
  const options = el.getAttribute("data-lexical-poll-options");
  if (question === null || options === null) {
    return null;
  }
  return $createPollNode(question, JSON.parse(options));
}

const PollImportRule = defineImportRule({
  $import: (_ctx, el, $next) => {
    const node = $convertPollElement(el);
    return node ? [node] : $next();
  },
  match: sel.tag("span").attr("data-lexical-poll-question", true),
  name: "@shadcn-editor/editor/poll",
});

export const PollExtension = defineExtension({
  name: "@shadcn-editor/editor/Poll",
  nodes: () => [PollNode],
  dependencies: [
    CoreImportExtension,
    configExtension(DOMImportExtension, {
      rules: [PollImportRule],
    }),
  ],
  register: (editor) =>
    editor.registerCommand(
      INSERT_POLL_COMMAND,
      (question) => {
        const pollNode = $createPollNode(question, [
          createPollOption(),
          createPollOption(),
        ]);
        $insertNodes([pollNode]);
        if ($isRootOrShadowRoot(pollNode.getParentOrThrow())) {
          $wrapNodeInElement(pollNode, $createParagraphNode).selectEnd();
        }
        return true;
      },
      COMMAND_PRIORITY_EDITOR,
    ),
});
