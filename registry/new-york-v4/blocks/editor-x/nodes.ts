import { CodeHighlightNode, CodeNode } from "@lexical/code"
import { HashtagNode } from "@lexical/hashtag"
import { AutoLinkNode, LinkNode } from "@lexical/link"
import { ListItemNode, ListNode } from "@lexical/list"
import { OverflowNode } from "@lexical/overflow"
import { HorizontalRuleNode } from "@lexical/react/LexicalHorizontalRuleNode"
import { HeadingNode, QuoteNode } from "@lexical/rich-text"
import { TableCellNode, TableNode, TableRowNode } from "@lexical/table"
import {
  Klass,
  LexicalNode,
  LexicalNodeReplacement,
  ParagraphNode,
  TextNode,
} from "lexical"

import { AutocompleteNode } from "@/registry/new-york-v4/editor/nodes/autocomplete-node"
import { CollapsibleContainerNode } from "@/registry/new-york-v4/editor/nodes/collapsible-container-node"
import { CollapsibleContentNode } from "@/registry/new-york-v4/editor/nodes/collapsible-content-node"
import { CollapsibleTitleNode } from "@/registry/new-york-v4/editor/nodes/collapsible-title-node"
import { FigmaNode } from "@/registry/new-york-v4/editor/nodes/embeds/figma-node"
import { TweetNode } from "@/registry/new-york-v4/editor/nodes/embeds/tweet-node"
import { YouTubeNode } from "@/registry/new-york-v4/editor/nodes/embeds/youtube-node"
import { EmojiNode } from "@/registry/new-york-v4/editor/nodes/emoji-node"
import { EquationNode } from "@/registry/new-york-v4/editor/nodes/equation-node"
import { ExcalidrawNode } from "@/registry/new-york-v4/editor/nodes/excalidraw-node"
import { ImageNode } from "@/registry/new-york-v4/editor/nodes/image-node"
import { InlineImageNode } from "@/registry/new-york-v4/editor/nodes/inline-image-node"
import { KeywordNode } from "@/registry/new-york-v4/editor/nodes/keyword-node"
import { LayoutContainerNode } from "@/registry/new-york-v4/editor/nodes/layout-container-node"
import { LayoutItemNode } from "@/registry/new-york-v4/editor/nodes/layout-item-node"
import { MentionNode } from "@/registry/new-york-v4/editor/nodes/mention-node"
import { PageBreakNode } from "@/registry/new-york-v4/editor/nodes/page-break-node"
import { PollNode } from "@/registry/new-york-v4/editor/nodes/poll-node"

export const nodes: ReadonlyArray<Klass<LexicalNode> | LexicalNodeReplacement> =
  [
    HeadingNode,
    ParagraphNode,
    TextNode,
    QuoteNode,
    ListNode,
    ListItemNode,
    LinkNode,
    OverflowNode,
    HashtagNode,
    TableNode,
    TableCellNode,
    TableRowNode,
    CodeNode,
    CodeHighlightNode,
    HorizontalRuleNode,
    MentionNode,
    PageBreakNode,
    ImageNode,
    InlineImageNode,
    EmojiNode,
    KeywordNode,
    ExcalidrawNode,
    PollNode,
    LayoutContainerNode,
    LayoutItemNode,
    EquationNode,
    CollapsibleContainerNode,
    CollapsibleContentNode,
    CollapsibleTitleNode,
    AutoLinkNode,
    FigmaNode,
    TweetNode,
    YouTubeNode,
    AutocompleteNode,
  ]
