import { useMemo } from "react"

import { $getRoot, $getSelection } from "lexical"

import { INSERT_UNORDERED_LIST_COMMAND } from "@lexical/list"
import { useLexicalComposerContext } from "@lexical/react/LexicalComposerContext"

import { List } from "lucide-react"

import {
  type ComponentPickerItem,
  useComponentPickerItems,
} from "@/components/editor/plugins/component-picker/component-picker-plugin"
import { useTranslation } from "@/components/editor/plugins/i18n-plugin"

export function BulletedListPickerPlugin() {
  const [editor] = useLexicalComposerContext()
  const { t } = useTranslation()

  const items = useMemo<ComponentPickerItem[]>(
    () => [
      {
        value: "bulleted-list",
        label: t.bulletedListBlock,
        icon: <List className="text-muted-foreground" />,
        keywords: ["bulleted list", "unordered list", "ul"],
        onSelect: () => {
          editor.update(() => {
            if (!$getSelection()) {
              $getRoot().selectEnd()
            }
          })
          editor.dispatchCommand(INSERT_UNORDERED_LIST_COMMAND, undefined)
        },
      },
    ],
    [editor, t]
  )

  useComponentPickerItems(items)

  return null
}
