'use client'

import { useState } from 'react'

import { $isLinkNode } from '@lexical/link'
import { $findMatchingParent } from '@lexical/utils'
import {
  $isElementNode,
  $isRangeSelection,
  BaseSelection,
  ElementFormatType,
  FORMAT_ELEMENT_COMMAND,
  INDENT_CONTENT_COMMAND,
  OUTDENT_CONTENT_COMMAND,
} from 'lexical'
import { IndentIncreaseIcon } from 'lucide-react'
import { IndentDecreaseIcon } from 'lucide-react'
import { AlignLeftIcon } from 'lucide-react'
import { AlignJustifyIcon } from 'lucide-react'
import { AlignCenterIcon, AlignRightIcon } from 'lucide-react'

import { Separator } from '@/registry/default/ui/separator'
import { ToggleGroup, ToggleGroupItem } from '@/registry/default/ui/toggle-group'

import { useToolbarContext } from '@/registry/default/editor/context/toolbar-context'
import { useUpdateToolbarHandler } from '@/registry/default/editor/editor-hooks/use-update-toolbar'
import { getSelectedNode } from '@/registry/default/editor/utils/get-selected-node'

const ELEMENT_FORMAT_OPTIONS: {
  [key in Exclude<ElementFormatType, 'start' | 'end' | ''>]: {
    icon: React.ReactNode
    iconRTL: string
    name: string
  }
} = {
  left: {
    icon: <AlignLeftIcon className="size-4" />,
    iconRTL: 'left-align',
    name: 'Left Align',
  },
  center: {
    icon: <AlignCenterIcon className="size-4" />,
    iconRTL: 'center-align',
    name: 'Center Align',
  },
  right: {
    icon: <AlignRightIcon className="size-4" />,
    iconRTL: 'right-align',
    name: 'Right Align',
  },
  justify: {
    icon: <AlignJustifyIcon className="size-4" />,
    iconRTL: 'justify-align',
    name: 'Justify Align',
  },
} as const

export function ElementFormatToolbarPlugin() {
  const { activeEditor } = useToolbarContext()
  const [elementFormat, setElementFormat] = useState<ElementFormatType>('left')

  const $updateToolbar = (selection: BaseSelection) => {
    if ($isRangeSelection(selection)) {
      const node = getSelectedNode(selection)
      const parent = node.getParent()

      let matchingParent
      if ($isLinkNode(parent)) {
        // If node is a link, we need to fetch the parent paragraph node to set format
        matchingParent = $findMatchingParent(
          node,
          (parentNode) => $isElementNode(parentNode) && !parentNode.isInline()
        )
      }
      setElementFormat(
        $isElementNode(matchingParent)
          ? matchingParent.getFormatType()
          : $isElementNode(node)
            ? node.getFormatType()
            : parent?.getFormatType() || 'left'
      )
    }
  }

  useUpdateToolbarHandler($updateToolbar)

  const handleValueChange = (value: string) => {
    if (!value) return // Prevent unselecting current value

    setElementFormat(value as ElementFormatType)

    if (value === 'indent') {
      activeEditor.dispatchCommand(INDENT_CONTENT_COMMAND, undefined)
    } else if (value === 'outdent') {
      activeEditor.dispatchCommand(OUTDENT_CONTENT_COMMAND, undefined)
    } else {
      activeEditor.dispatchCommand(
        FORMAT_ELEMENT_COMMAND,
        value as ElementFormatType
      )
    }
  }

  return (
    <ToggleGroup
      type="single"
      value={elementFormat}
      defaultValue={elementFormat}
      onValueChange={handleValueChange}
      className="flex gap-1"
    >
      {/* Alignment toggles */}
      {Object.entries(ELEMENT_FORMAT_OPTIONS).map(([value, option]) => (
        <ToggleGroupItem
          key={value}
          value={value}
          variant={'outline'}
          aria-label={option.name}
          size="sm"
          className="h-8 w-8 p-0"
        >
          {option.icon}
        </ToggleGroupItem>
      ))}

      <Separator orientation="vertical" className="h-8" />
      {/* Indentation toggles */}
      <ToggleGroupItem
        value="outdent"
        aria-label="Outdent"
        variant={'outline'}
        size="sm"
        className="h-8 w-8"
      >
        <IndentDecreaseIcon className="size-4" />
      </ToggleGroupItem>

      <ToggleGroupItem
        value="indent"
        variant={'outline'}
        aria-label="Indent"
        size="sm"
        className="h-8 w-8"
      >
        <IndentIncreaseIcon className="size-4" />
      </ToggleGroupItem>
    </ToggleGroup>
  )
}
