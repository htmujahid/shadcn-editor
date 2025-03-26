'use client'

/**
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */
import { useCallback, useMemo, JSX } from 'react'
import * as React from 'react'

import dynamic from 'next/dynamic'

import { $isLinkNode, TOGGLE_LINK_COMMAND } from '@lexical/link'
import { useLexicalComposerContext } from '@lexical/react/LexicalComposerContext'
import { MenuOption } from '@lexical/react/LexicalContextMenuPlugin'
import { PopoverPortal } from '@radix-ui/react-popover'
import {
  $getNearestNodeFromDOMNode,
  $getSelection,
  $isRangeSelection,
  COPY_COMMAND,
  CUT_COMMAND,
  type LexicalNode,
  PASTE_COMMAND,
} from 'lexical'

import { Command, CommandItem, CommandList } from '@/registry/default/ui/command'
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/registry/default/ui/popover'

const LexicalContextMenuPlugin = dynamic(
  () => import('./default/lexical-context-menu-plugin'),
  { ssr: false }
)

export class ContextMenuOption extends MenuOption {
  title: string
  onSelect: (targetNode: LexicalNode | null) => void
  constructor(
    title: string,
    options: {
      onSelect: (targetNode: LexicalNode | null) => void
    }
  ) {
    super(title)
    this.title = title
    this.onSelect = options.onSelect.bind(this)
  }
}

export function ContextMenuPlugin(): JSX.Element {
  const [editor] = useLexicalComposerContext()
  const [isOpen, setIsOpen] = React.useState(false)

  const defaultOptions = useMemo(() => {
    return [
      new ContextMenuOption(`Copy`, {
        onSelect: (_node) => {
          editor.dispatchCommand(COPY_COMMAND, null)
        },
      }),
      new ContextMenuOption(`Cut`, {
        onSelect: (_node) => {
          editor.dispatchCommand(CUT_COMMAND, null)
        },
      }),
      new ContextMenuOption(`Paste`, {
        onSelect: (_node) => {
          navigator.clipboard.read().then(async function (...args) {
            const data = new DataTransfer()

            const items = await navigator.clipboard.read()
            const item = items[0]

            const permission = await navigator.permissions.query({
              // @ts-expect-error These types are incorrect.
              name: 'clipboard-read',
            })
            if (permission.state === 'denied') {
              alert('Not allowed to paste from clipboard.')
              return
            }

            for (const type of item.types) {
              const dataString = await (await item.getType(type)).text()
              data.setData(type, dataString)
            }

            const event = new ClipboardEvent('paste', {
              clipboardData: data,
            })

            editor.dispatchCommand(PASTE_COMMAND, event)
          })
        },
      }),
      new ContextMenuOption(`Paste as Plain Text`, {
        onSelect: (_node) => {
          navigator.clipboard.read().then(async function (...args) {
            const permission = await navigator.permissions.query({
              // @ts-expect-error These types are incorrect.
              name: 'clipboard-read',
            })

            if (permission.state === 'denied') {
              alert('Not allowed to paste from clipboard.')
              return
            }

            const data = new DataTransfer()
            const items = await navigator.clipboard.readText()
            data.setData('text/plain', items)

            const event = new ClipboardEvent('paste', {
              clipboardData: data,
            })
            editor.dispatchCommand(PASTE_COMMAND, event)
          })
        },
      }),
      new ContextMenuOption(`Delete Node`, {
        onSelect: (_node) => {
          const selection = $getSelection()
          if ($isRangeSelection(selection)) {
            const currentNode = selection.anchor.getNode()
            const ancestorNodeWithRootAsParent = currentNode.getParents().at(-2)

            ancestorNodeWithRootAsParent?.remove()
          }
        },
      }),
    ]
  }, [editor])

  const [options, setOptions] = React.useState(defaultOptions)

  const onSelectOption = useCallback(
    (
      selectedOption: ContextMenuOption,
      targetNode: LexicalNode | null,
      closeMenu: () => void
    ) => {
      editor.update(() => {
        selectedOption.onSelect(targetNode)
        closeMenu()
      })
    },
    [editor]
  )

  const onWillOpen = (event: MouseEvent) => {
    let newOptions = defaultOptions
    setIsOpen(true)
    editor.update(() => {
      const node = $getNearestNodeFromDOMNode(event.target as Element)
      if (node) {
        const parent = node.getParent()
        if ($isLinkNode(parent)) {
          newOptions = [
            new ContextMenuOption(`Remove Link`, {
              onSelect: (_node) => {
                editor.dispatchCommand(TOGGLE_LINK_COMMAND, null)
              },
            }),
            ...defaultOptions,
          ]
        }
      }
    })
    setOptions(newOptions)
  }

  return (
    <LexicalContextMenuPlugin
      options={options}
      onSelectOption={(option, targetNode) => {
        onSelectOption(option as ContextMenuOption, targetNode, () => {
          setIsOpen(false)
        })
      }}
      onWillOpen={onWillOpen}
      onOpen={() => {
        setIsOpen(true)
      }}
      onClose={() => {
        setIsOpen(false)
      }}
      menuRenderFn={(
        anchorElementRef,
        { options: _options, selectOptionAndCleanUp },
        { setMenuRef }
      ) => {
        return anchorElementRef.current ? (
          <Popover open={isOpen} onOpenChange={setIsOpen}>
            <PopoverPortal container={anchorElementRef.current}>
              <div>
                <PopoverTrigger
                  ref={setMenuRef}
                  style={{
                    marginLeft: anchorElementRef.current?.style.width,
                    userSelect: 'none',
                  }}
                />
                <PopoverContent className="w-[200px] p-1">
                  <Command>
                    <CommandList>
                      {options.map((option) => (
                        <CommandItem
                          key={option.key}
                          onSelect={() => {
                            selectOptionAndCleanUp(option)
                          }}
                        >
                          {option.title}
                        </CommandItem>
                      ))}
                    </CommandList>
                  </Command>
                </PopoverContent>
              </div>
            </PopoverPortal>
          </Popover>
        ) : null
      }}
    />
  )
}
