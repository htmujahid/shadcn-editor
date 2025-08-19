"use client"

/**
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */
import { JSX, useCallback, useMemo, useState } from "react"
import dynamic from "next/dynamic"
import { useLexicalComposerContext } from "@lexical/react/LexicalComposerContext"
import { useBasicTypeaheadTriggerMatch } from "@lexical/react/LexicalTypeaheadMenuPlugin"
import { TextNode } from "lexical"
import { createPortal } from "react-dom"

import { useEditorModal } from "@/registry/new-york-v4/editor/editor-hooks/use-modal"
import {
  Command,
  CommandGroup,
  CommandItem,
  CommandList,
} from "@/registry/new-york-v4/ui/command"

import { ComponentPickerOption } from "./picker/component-picker-option"

const LexicalTypeaheadMenuPlugin = dynamic(
  () => import("./default/lexical-typeahead-menu-plugin"),
  { ssr: false }
)

export function ComponentPickerMenuPlugin({
  baseOptions = [],
  dynamicOptionsFn,
}: {
  baseOptions?: Array<ComponentPickerOption>
  dynamicOptionsFn?: ({
    queryString,
  }: {
    queryString: string
  }) => Array<ComponentPickerOption>
}): JSX.Element {
  const [editor] = useLexicalComposerContext()
  const [modal, showModal] = useEditorModal()
  const [queryString, setQueryString] = useState<string | null>(null)

  const checkForTriggerMatch = useBasicTypeaheadTriggerMatch("/", {
    minLength: 0,
  })

  const options = useMemo(() => {
    if (!queryString) {
      return baseOptions
    }

    const regex = new RegExp(queryString, "i")

    return [
      ...(dynamicOptionsFn?.({ queryString }) || []),
      ...baseOptions.filter(
        (option) =>
          regex.test(option.title) ||
          option.keywords.some((keyword) => regex.test(keyword))
      ),
    ]
  }, [editor, queryString, showModal])

  const onSelectOption = useCallback(
    (
      selectedOption: ComponentPickerOption,
      nodeToRemove: TextNode | null,
      closeMenu: () => void,
      matchingString: string
    ) => {
      editor.update(() => {
        nodeToRemove?.remove()
        selectedOption.onSelect(matchingString, editor, showModal)
        closeMenu()
      })
    },
    [editor]
  )

  return (
    <>
      {modal}
      {/* @ts-ignore */}
      <LexicalTypeaheadMenuPlugin<ComponentPickerOption>
        onQueryChange={setQueryString}
        onSelectOption={onSelectOption}
        triggerFn={checkForTriggerMatch}
        options={options}
        menuRenderFn={(
          anchorElementRef,
          { selectedIndex, selectOptionAndCleanUp, setHighlightedIndex }
        ) => {
          return anchorElementRef.current && options.length
            ? createPortal(
                <div className="fixed z-10 w-[250px] rounded-md shadow-md">
                  <Command
                    onKeyDown={(e) => {
                      if (e.key === "ArrowUp") {
                        e.preventDefault()
                        setHighlightedIndex(
                          selectedIndex !== null
                            ? (selectedIndex - 1 + options.length) %
                                options.length
                            : options.length - 1
                        )
                      } else if (e.key === "ArrowDown") {
                        e.preventDefault()
                        setHighlightedIndex(
                          selectedIndex !== null
                            ? (selectedIndex + 1) % options.length
                            : 0
                        )
                      }
                    }}
                  >
                    <CommandList>
                      <CommandGroup>
                        {options.map((option, index) => (
                          <CommandItem
                            key={option.key}
                            value={option.title}
                            onSelect={() => {
                              selectOptionAndCleanUp(option)
                            }}
                            className={`flex items-center gap-2 ${
                              selectedIndex === index
                                ? "bg-accent"
                                : "!bg-transparent"
                            }`}
                          >
                            {option.icon}
                            {option.title}
                          </CommandItem>
                        ))}
                      </CommandGroup>
                    </CommandList>
                  </Command>
                </div>,
                anchorElementRef.current
              )
            : null
        }}
      />
    </>
  )
}
