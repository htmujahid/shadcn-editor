import { configExtension, defineExtension } from "lexical"

import { $isCodeNode } from "@lexical/code-core"
import {
  autoLinkEmailMatcher,
  autoLinkUrlMatcher,
  AutoLinkExtension as LexicalAutoLinkExtension,
} from "@lexical/link"

export const AutoLinkExtension = defineExtension({
  name: "@shadcn-editor/editor/AutoLink",
  dependencies: [
    configExtension(LexicalAutoLinkExtension, {
      excludeParents: [$isCodeNode],
      matchers: [autoLinkUrlMatcher, autoLinkEmailMatcher],
    }),
  ],
})
