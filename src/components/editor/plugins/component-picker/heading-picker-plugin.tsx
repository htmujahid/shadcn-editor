import { useMemo } from "react"

import { $getRoot, $getSelection } from "lexical"

import { useLexicalComposerContext } from "@lexical/react/LexicalComposerContext"
import { $createHeadingNode, type HeadingTagType } from "@lexical/rich-text"
import { $setBlocksType } from "@lexical/selection"

import { Heading1, Heading2, Heading3, type LucideIcon } from "lucide-react"

import type { Locale } from "@/components/editor/locales"
import {
  type ComponentPickerItem,
  useComponentPickerItems,
} from "@/components/editor/plugins/component-picker/component-picker-plugin"
import { useTranslation } from "@/components/editor/plugins/i18n-plugin"

const HEADINGS: {
  tag: HeadingTagType
  labelKey: keyof Locale
  icon: LucideIcon
}[] = [
  { tag: "h1", labelKey: "heading1", icon: Heading1 },
  { tag: "h2", labelKey: "heading2", icon: Heading2 },
  { tag: "h3", labelKey: "heading3", icon: Heading3 },
]

export function HeadingPickerPlugin() {
  const [editor] = useLexicalComposerContext()
  const { t } = useTranslation()

  const items = useMemo<ComponentPickerItem[]>(
    () =>
      HEADINGS.map(({ tag, labelKey, icon: Icon }) => ({
        value: tag,
        label: t[labelKey],
        icon: <Icon className="text-muted-foreground" />,
        keywords: ["heading", "header", tag],
        onSelect: () =>
          editor.update(() => {
            const selection = $getSelection() ?? $getRoot().selectEnd()
            $setBlocksType(selection, () => $createHeadingNode(tag))
          }),
      })),
    [editor, t]
  )

  useComponentPickerItems(items)

  return null
}
