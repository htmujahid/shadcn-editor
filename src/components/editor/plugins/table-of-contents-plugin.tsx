import { useEffect, useRef, useState } from "react";

import { type NodeKey, registerEventListener } from "lexical";

import { useLexicalComposerContext } from "@lexical/react/LexicalComposerContext";
import {
  TableOfContentsPlugin as LexicalTableOfContentsPlugin,
  type TableOfContentsEntry,
} from "@lexical/react/LexicalTableOfContentsPlugin";
import type { HeadingTagType } from "@lexical/rich-text";

import { useTranslation } from "@/components/editor/plugins/i18n-plugin";
import {
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import { cn } from "@/lib/utils";

const INDENTS: Partial<Record<HeadingTagType, string>> = {
  h2: "ps-5",
  h3: "ps-8",
  h4: "ps-8",
  h5: "ps-8",
  h6: "ps-8",
};

function getScrollParent(element: HTMLElement | null): HTMLElement | null {
  let current = element?.parentElement ?? null;
  while (current) {
    const { overflowY } = getComputedStyle(current);
    if (overflowY === "auto" || overflowY === "scroll") {
      return current;
    }
    current = current.parentElement;
  }
  return null;
}

function TableOfContentsList({
  tableOfContents,
}: {
  tableOfContents: TableOfContentsEntry[];
}) {
  const [editor] = useLexicalComposerContext();
  const { t } = useTranslation();
  const [selectedKey, setSelectedKey] = useState<NodeKey>("");
  const suppressTrackingUntil = useRef(0);

  const scrollToNode = (key: NodeKey) => {
    editor.read("latest", () => {
      const domElement = editor.getElementByKey(key);
      if (domElement === null) {
        return;
      }
      suppressTrackingUntil.current = performance.now() + 1000;
      const scroller = getScrollParent(editor.getRootElement());
      if (scroller === null) {
        domElement.scrollIntoView({ behavior: "smooth", block: "start" });
      } else {
        const top =
          domElement.getBoundingClientRect().top -
          scroller.getBoundingClientRect().top +
          scroller.scrollTop;
        scroller.scrollTo({ top, behavior: "smooth" });
      }
      setSelectedKey(key);
    });
  };

  useEffect(() => {
    const rootElement = editor.getRootElement();
    const scroller = getScrollParent(rootElement);
    if (rootElement === null) {
      return;
    }

    let timerId: ReturnType<typeof setTimeout>;

    const updateSelection = () => {
      if (performance.now() < suppressTrackingUntil.current) {
        return;
      }
      const topBoundary =
        (scroller ?? rootElement).getBoundingClientRect().top + 16;
      let nextKey = tableOfContents[0]?.[0] ?? "";
      for (const [key] of tableOfContents) {
        const heading = editor.getElementByKey(key);
        if (heading === null) {
          continue;
        }
        if (heading.getBoundingClientRect().top <= topBoundary) {
          nextKey = key;
        } else {
          break;
        }
      }
      setSelectedKey(nextKey);
    };

    updateSelection();
    const onScroll = () => {
      clearTimeout(timerId);
      timerId = setTimeout(updateSelection, 50);
    };

    return registerEventListener(scroller ?? document, "scroll", onScroll);
  }, [editor, tableOfContents]);

  if (tableOfContents.length === 0) {
    return null;
  }

  return (
    <SidebarGroup>
      <SidebarGroupLabel>{t.tableOfContents}</SidebarGroupLabel>
      <SidebarGroupContent>
        <SidebarMenu>
          {tableOfContents.map(([key, text, tag]) => (
            <SidebarMenuItem key={key}>
              <SidebarMenuButton
                isActive={selectedKey === key}
                className={cn(INDENTS[tag])}
                onClick={() => scrollToNode(key)}
              >
                <span>{text}</span>
              </SidebarMenuButton>
            </SidebarMenuItem>
          ))}
        </SidebarMenu>
      </SidebarGroupContent>
    </SidebarGroup>
  );
}

export function TableOfContentsPlugin() {
  return (
    <LexicalTableOfContentsPlugin>
      {(tableOfContents) => (
        <TableOfContentsList tableOfContents={tableOfContents} />
      )}
    </LexicalTableOfContentsPlugin>
  );
}
