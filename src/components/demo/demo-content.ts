import {
  $createParagraphNode,
  $createTextNode,
  $getRoot,
  $isParagraphNode,
} from "lexical";

import { $createCodeNode } from "@lexical/code-core";
import { $createLinkNode } from "@lexical/link";
import { $createListItemNode, $createListNode } from "@lexical/list";
import { $createMarkNode } from "@lexical/mark";
import { $createHeadingNode, $createQuoteNode } from "@lexical/rich-text";
import {
  $createTableNodeWithDimensions,
  $isTableCellNode,
  $isTableRowNode,
} from "@lexical/table";

import {
  type Comment,
  createComment,
  createThread,
  type Thread,
} from "@/components/editor/extensions/comment";
import {
  $createCollapsibleContainerNode,
  $createCollapsibleContentNode,
  $createCollapsibleTitleNode,
} from "@/components/editor/nodes/collapsible-node";
import { $createDateTimeNode } from "@/components/editor/nodes/datetime-node";
import { $createEquationNode } from "@/components/editor/nodes/equation-node";
import { $createImageNode } from "@/components/editor/nodes/image-node";
import {
  $createLayoutContainerNode,
  $createLayoutItemNode,
} from "@/components/editor/nodes/layout-node";
import {
  $createPollNode,
  createPollOption,
} from "@/components/editor/nodes/poll-node";

const NOW = performance.timeOrigin + performance.now();
const MINUTE = 60_000;

function comment(content: string, author: string, minutesAgo: number): Comment {
  return createComment(content, author, undefined, NOW - minutesAgo * MINUTE);
}

const QUOTES = {
  anchored: "anchored to the exact words it refers to",
  extend: "every feature is an extension",
  columns: "never interleave",
  outline: "watch the outline update",
} as const;

export type SeedThreadKey = keyof typeof QUOTES;

export function createSeedThreads(): Record<SeedThreadKey, Thread> {
  return {
    anchored: createThread(QUOTES.anchored, [
      comment("This is what makes review workflows click.", "Sam", 42),
      comment(
        "Agreed. Can we link the thread from the outline too?",
        "Priya",
        30,
      ),
    ]),
    extend: createThread(QUOTES.extend, [
      comment("Worth calling out that extensions are tree-shaken.", "Ada", 25),
    ]),
    columns: createThread(QUOTES.columns, [
      comment("Should we mention the three column preset here?", "Noah", 18),
      comment("Yes, and the mixed 2:1 layout.", "Sam", 12),
    ]),
    outline: createThread(QUOTES.outline, [
      comment("Love this. Ship it.", "Priya", 5),
    ]),
  };
}

const IMAGE_SRC =
  "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='800' height='300'%3E%3Cdefs%3E%3ClinearGradient id='g' x1='0' y1='0' x2='1' y2='1'%3E%3Cstop offset='0' stop-color='%236366f1'/%3E%3Cstop offset='1' stop-color='%23ec4899'/%3E%3C/linearGradient%3E%3C/defs%3E%3Crect width='800' height='300' fill='url(%23g)'/%3E%3C/svg%3E";

function $createTable(data: string[][]) {
  const table = $createTableNodeWithDimensions(
    data.length,
    data[0].length,
    true,
  );
  table.getChildren().forEach((row, rowIndex) => {
    if (!$isTableRowNode(row)) {
      return;
    }
    row.getChildren().forEach((cell, cellIndex) => {
      const paragraph = $isTableCellNode(cell) ? cell.getFirstChild() : null;
      if ($isParagraphNode(paragraph)) {
        paragraph.append($createTextNode(data[rowIndex][cellIndex]));
      }
    });
  });
  return table;
}

function $text(text: string) {
  return $createParagraphNode().append($createTextNode(text));
}

export function $seedDocument(threads: Record<SeedThreadKey, Thread>) {
  const mark = (key: SeedThreadKey) =>
    $createMarkNode([threads[key].id]).append($createTextNode(QUOTES[key]));

  $getRoot().append(
    $createHeadingNode("h1").append($createTextNode("Editor X")),
    $createParagraphNode().append(
      $createTextNode("A "),
      $createTextNode("complete").toggleFormat("bold"),
      $createTextNode(" writing surface: "),
      $createTextNode("rich text").toggleFormat("italic"),
      $createTextNode(", "),
      $createTextNode("markdown shortcuts").toggleFormat("underline"),
      $createTextNode(", and "),
      $createTextNode("blocks").toggleFormat("code"),
      $createTextNode(", all in one place. Built on "),
      $createLinkNode("https://lexical.dev").append($createTextNode("Lexical")),
      $createTextNode(" and "),
      $createLinkNode("https://ui.shadcn.com").append(
        $createTextNode("shadcn/ui"),
      ),
      $createTextNode("."),
    ),

    $createHeadingNode("h2").append($createTextNode("Everything included")),
    $createListNode("bullet").append(
      $createListItemNode().append(
        $createTextNode(
          "Every toolbar control, from fonts and colors to find & replace",
        ),
      ),
      $createListItemNode().append(
        $createTextNode('A slash menu: type "/" to insert any block'),
      ),
      $createListItemNode().append(
        $createTextNode(
          "Drag handles, a floating toolbar, mentions, emoji, and embeds",
        ),
      ),
      $createListItemNode().append(
        $createTextNode(
          "AI commands, inline comments, and a live table of contents",
        ),
      ),
    ),

    $createHeadingNode("h2").append($createTextNode("Ask AI")),
    $createParagraphNode().append(
      $createTextNode(
        "the editor is fast and it is very very easy to extend. ",
      ),
      mark("extend"),
      $createTextNode(", and i can compose them however i like."),
    ),
    $text(
      "Select the sentence above and press the sparkles button in either toolbar, then pick a command or type your own prompt. On an empty line, type / and choose Ask AI to write something new. The demo streams a mock reply, so any endpoint or SDK can take its place.",
    ),

    $createHeadingNode("h2").append($createTextNode("Comments")),
    $createParagraphNode().append(
      $createTextNode(
        "Select any text and press the button that appears beside the line to start a thread. Feedback lives in the panel on the side, ",
      ),
      mark("anchored"),
      $createTextNode(
        ", so the context of a discussion never gets lost. Click a thread to jump to its highlight.",
      ),
    ),

    $createHeadingNode("h2").append($createTextNode("Blocks")),
    $createHeadingNode("h3").append($createTextNode("Tables")),
    $createTable([
      ["Plan", "Monthly", "Yearly", "Seats"],
      ["Free", "$0", "$0", "1"],
      ["Pro", "$12", "$120", "5"],
      ["Team", "$29", "$290", "Unlimited"],
    ]),

    $createHeadingNode("h3").append($createTextNode("Columns")),
    $createLayoutContainerNode("1fr 1fr").append(
      $createLayoutItemNode().append(
        $createHeadingNode("h4").append($createTextNode("Left column")),
        $text(
          "Each column holds its own blocks. Click inside and write as usual.",
        ),
        $createListNode("check").append(
          $createListItemNode(true).append(
            $createTextNode("Write the release notes"),
          ),
          $createListItemNode(true).append(
            $createTextNode("Tag the final build"),
          ),
          $createListItemNode(false).append(
            $createTextNode("Publish the announcement"),
          ),
        ),
      ),
      $createLayoutItemNode().append(
        $createHeadingNode("h4").append($createTextNode("Right column")),
        $createParagraphNode().append(
          $createTextNode("The two sides flow independently and "),
          mark("columns"),
          $createTextNode("."),
        ),
        $createParagraphNode().append(
          $createImageNode({
            altText: "Gradient placeholder",
            maxWidth: 240,
            src: IMAGE_SRC,
          }),
        ),
      ),
    ),

    $createHeadingNode("h3").append($createTextNode("Equations")),
    $createParagraphNode().append(
      $createTextNode("Einstein's identity "),
      $createEquationNode("E = mc^2", true),
      $createTextNode(
        " fits inside a sentence, while bigger formulas get a block of their own:",
      ),
    ),
    $createParagraphNode().append(
      $createEquationNode("\\int_0^1 x^2 \\, dx = \\frac{1}{3}", false),
    ),

    $createHeadingNode("h3").append($createTextNode("Collapsible")),
    $createCollapsibleContainerNode(true).append(
      $createCollapsibleTitleNode().append(
        $createTextNode("What is a collapsible?"),
      ),
      $createCollapsibleContentNode().append(
        $text(
          "A summary row that opens to reveal its details. Click the title to fold this content away and open it again.",
        ),
      ),
    ),

    $createHeadingNode("h3").append($createTextNode("Code")),
    $createCodeNode("typescript").append(
      $createTextNode(
        'const editor = defineExtension({\n  name: "@shadcn-editor/demo",\n  dependencies: [RichTextExtension, TableExtension, CommentExtension],\n});',
      ),
    ),

    $createHeadingNode("h3").append($createTextNode("Poll")),
    $createPollNode("Which feature should we build next?", [
      createPollOption("Version history"),
      createPollOption("Real-time collaboration"),
      createPollOption("Offline mode"),
    ]),

    $createHeadingNode("h2").append($createTextNode("Navigation")),
    $createHeadingNode("h3").append($createTextNode("Table of contents")),
    $createParagraphNode().append(
      $createTextNode(
        "Headings in this document show up in the outline on the left. Click one to scroll to it, or add a heading and ",
      ),
      mark("outline"),
      $createTextNode("."),
    ),
    $createHeadingNode("h3").append($createTextNode("Shortcuts")),
    $createQuoteNode().append(
      $createTextNode(
        "Select any text to format it in place, or grab a drag handle to rearrange the page. Markdown works too, as you type.",
      ),
    ),

    $createHeadingNode("h2").append($createTextNode("Planning")),
    $createParagraphNode().append(
      $createTextNode("The launch review is scheduled for "),
      $createDateTimeNode(new Date(2026, 8, 15)),
      $createTextNode(" and the follow-up lands on "),
      $createDateTimeNode(new Date(2026, 9, 2)),
      $createTextNode(". Click a date pill to change it with the calendar."),
    ),
    $createListNode("number").append(
      $createListItemNode().append($createTextNode("Freeze the feature set")),
      $createListItemNode().append(
        $createTextNode("Run the accessibility audit"),
      ),
      $createListItemNode().append($createTextNode("Publish the changelog")),
    ),
    $text(
      'Try it now: press "/" on the empty line below, or browse the toolbar above.',
    ),
    $createParagraphNode(),
  );
}
