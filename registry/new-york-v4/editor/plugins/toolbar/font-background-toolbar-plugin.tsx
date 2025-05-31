"use client"

import { useCallback, useState } from "react"
import {
  $getSelectionStyleValueForProperty,
  $patchStyleText,
} from "@lexical/selection"
import { $getSelection, $isRangeSelection, BaseSelection } from "lexical"
import { PaintBucketIcon } from "lucide-react"

import { useToolbarContext } from "@/registry/new-york-v4/editor/context/toolbar-context"
import { useUpdateToolbarHandler } from "@/registry/new-york-v4/editor/editor-hooks/use-update-toolbar"
import ColorPicker from "@/registry/new-york-v4/editor/editor-ui/colorpicker"

export function FontBackgroundToolbarPlugin() {
  const { activeEditor } = useToolbarContext()

  const [bgColor, setBgColor] = useState("#fff")

  const $updateToolbar = (selection: BaseSelection) => {
    if ($isRangeSelection(selection)) {
      setBgColor(
        $getSelectionStyleValueForProperty(
          selection,
          "background-color",
          "#fff"
        )
      )
    }
  }

  useUpdateToolbarHandler($updateToolbar)

  const applyStyleText = useCallback(
    (styles: Record<string, string>, skipHistoryStack?: boolean) => {
      activeEditor.update(
        () => {
          const selection = $getSelection()
          if (selection !== null) {
            $patchStyleText(selection, styles)
          }
        },
        skipHistoryStack ? { tag: "historic" } : {}
      )
    },
    [activeEditor]
  )

  const onBgColorSelect = useCallback(
    (value: string, skipHistoryStack: boolean) => {
      applyStyleText({ "background-color": value }, skipHistoryStack)
    },
    [applyStyleText]
  )

  return (
    <ColorPicker
      icon={<PaintBucketIcon className="size-4" />}
      color={bgColor}
      onChange={onBgColorSelect}
      title="text background color"
    />
  )
}
