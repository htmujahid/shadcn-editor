"use client"

import { useCallback, useState } from "react"
import {
  $getSelectionStyleValueForProperty,
  $patchStyleText,
} from "@lexical/selection"
import {
  $getSelection,
  $isRangeSelection,
  $setSelection,
  BaseSelection,
} from "lexical"
import { PaintBucketIcon } from "lucide-react"

import { useToolbarContext } from "@/registry/new-york-v4/editor/context/toolbar-context"
import { useUpdateToolbarHandler } from "@/registry/new-york-v4/editor/editor-hooks/use-update-toolbar"
import {
  ColorPicker,
  ColorPickerAlphaSlider,
  ColorPickerArea,
  ColorPickerContent,
  ColorPickerEyeDropper,
  ColorPickerFormatSelect,
  ColorPickerHueSlider,
  ColorPickerInput,
  ColorPickerTrigger,
} from "@/registry/new-york-v4/editor/editor-ui/color-picker"
import { Button } from "@/registry/new-york-v4/ui/button"

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
          activeEditor.setEditable(false)
          if (selection !== null) {
            $patchStyleText(selection, styles)
          }
        },
        { tag: "historic" }
      )
    },
    [activeEditor]
  )

  const onBgColorSelect = useCallback(
    (value: string) => {
      applyStyleText({ "background-color": value }, true)
    },
    [applyStyleText]
  )

  return (
    <ColorPicker
      modal
      defaultFormat="hex"
      defaultValue={bgColor}
      onValueChange={onBgColorSelect}
      onOpenChange={(open) => {
        if (!open) {
          activeEditor.setEditable(true)
          activeEditor.focus()
        }
      }}
    >
      <ColorPickerTrigger asChild>
        <Button variant={"outline"} size={"icon-sm"}>
          <PaintBucketIcon className="h-4 w-4" />
        </Button>
      </ColorPickerTrigger>
      <ColorPickerContent>
        <ColorPickerArea />
        <div className="flex items-center gap-2">
          <ColorPickerEyeDropper />
          <div className="flex flex-1 flex-col gap-2">
            <ColorPickerHueSlider />
            <ColorPickerAlphaSlider />
          </div>
        </div>
        <div className="flex items-center gap-2">
          <ColorPickerFormatSelect />
          <ColorPickerInput />
        </div>
      </ColorPickerContent>
    </ColorPicker>
  )
}
