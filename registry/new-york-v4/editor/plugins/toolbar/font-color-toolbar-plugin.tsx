"use client"

import { useCallback, useState } from "react"
import {
  $getSelectionStyleValueForProperty,
  $patchStyleText,
} from "@lexical/selection"
import { $getSelection, $isRangeSelection, BaseSelection } from "lexical"
import { BaselineIcon } from "lucide-react"

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

export function FontColorToolbarPlugin() {
  const { activeEditor } = useToolbarContext()

  const [fontColor, setFontColor] = useState("#000")

  const $updateToolbar = (selection: BaseSelection) => {
    if ($isRangeSelection(selection)) {
      setFontColor(
        $getSelectionStyleValueForProperty(selection, "color", "#000")
      )
    }
  }

  useUpdateToolbarHandler($updateToolbar)

  const applyStyleText = useCallback(
    (styles: Record<string, string>) => {
      activeEditor.update(() => {
        const selection = $getSelection()
        activeEditor.setEditable(false)
        if (selection !== null) {
          $patchStyleText(selection, styles)
        }
      })
    },
    [activeEditor]
  )

  const onFontColorSelect = useCallback(
    (value: string) => {
      applyStyleText({ color: value })
    },
    [applyStyleText]
  )

  return (
    <ColorPicker
      modal
      defaultFormat="hex"
      defaultValue={fontColor}
      onValueChange={onFontColorSelect}
      onOpenChange={(open) => {
        if (!open) {
          activeEditor.setEditable(true)
          activeEditor.focus()
        }
      }}
    >
      <ColorPickerTrigger asChild>
        <Button variant="outline" size="icon-sm">
          <BaselineIcon className="size-4" />
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
