import { useCallback, useMemo, useState } from "react"

import type { TextNode } from "lexical"

import { useLexicalComposerContext } from "@lexical/react/LexicalComposerContext"
import {
  LexicalTypeaheadMenuPlugin,
  MenuOption,
  useBasicTypeaheadTriggerMatch,
} from "@lexical/react/LexicalTypeaheadMenuPlugin"

import { Popover as PopoverPrimitive } from "@base-ui/react/popover"
import compactEmojis from "emojibase-data/en/compact.json"

import {
  $createEmojiNode,
  EMOJI_CLASS_NAME,
} from "@/components/editor/nodes/emoji-node"
import { useLanguage } from "@/components/editor/plugins/i18n-plugin"
import { Command, CommandItem, CommandList } from "@/components/ui/command"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"

const MAX_SUGGESTIONS = 8

const EXCLUDED_GROUPS = new Set([2])

type EmojiEntry = {
  emoji: string
  name: string
  keywords: string[]
  hexcode: string
}

const EMOJI_ENTRIES: EmojiEntry[] = compactEmojis
  .filter(
    (entry) => entry.group !== undefined && !EXCLUDED_GROUPS.has(entry.group)
  )
  .sort((a, b) => (a.order ?? 0) - (b.order ?? 0))
  .map((entry) => ({
    emoji: entry.unicode,
    name: entry.label
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "_")
      .replace(/^_+|_+$/g, ""),
    keywords: entry.tags ?? [],
    hexcode: entry.hexcode,
  }))

function normalize(value: string): string {
  return value
    .trim()
    .toLowerCase()
    .replace(/[_\s]+/g, "")
}

function searchEmojis(query: string): EmojiEntry[] {
  const q = normalize(query)
  if (!q) {
    return []
  }

  const startsWith: EmojiEntry[] = []
  const includes: EmojiEntry[] = []

  for (const entry of EMOJI_ENTRIES) {
    const name = normalize(entry.name)
    if (name.startsWith(q)) {
      startsWith.push(entry)
      continue
    }
    const keywordMatch = entry.keywords.some((keyword) =>
      normalize(keyword).startsWith(q)
    )
    if (keywordMatch) {
      startsWith.push(entry)
      continue
    }
    if (
      name.includes(q) ||
      entry.keywords.some((keyword) => normalize(keyword).includes(q))
    ) {
      includes.push(entry)
    }
  }

  return [...startsWith, ...includes]
}

class EmojiTypeaheadOption extends MenuOption {
  entry: EmojiEntry

  constructor(entry: EmojiEntry) {
    super(entry.hexcode)
    this.entry = entry
  }
}

export function EmojiPickerPlugin() {
  const [editor] = useLexicalComposerContext()
  const { dir } = useLanguage()
  const [queryString, setQueryString] = useState<string | null>(null)

  const checkForTriggerMatch = useBasicTypeaheadTriggerMatch(":", {
    minLength: 0,
  })

  const options = useMemo(() => {
    if (queryString === null) {
      return []
    }
    const matches =
      queryString === "" ? EMOJI_ENTRIES : searchEmojis(queryString)
    return matches
      .slice(0, MAX_SUGGESTIONS)
      .map((entry) => new EmojiTypeaheadOption(entry))
  }, [queryString])

  const onSelectOption = useCallback(
    (
      option: EmojiTypeaheadOption,
      nodeToReplace: TextNode | null,
      closeMenu: () => void
    ) => {
      editor.update(() => {
        const emojiNode = $createEmojiNode(EMOJI_CLASS_NAME, option.entry.emoji)
        if (nodeToReplace) {
          nodeToReplace.replace(emojiNode)
        }
        emojiNode.selectNext()
        closeMenu()
      })
    },
    [editor]
  )

  return (
    <LexicalTypeaheadMenuPlugin<EmojiTypeaheadOption>
      onQueryChange={setQueryString}
      onSelectOption={onSelectOption}
      triggerFn={checkForTriggerMatch}
      options={options}
      menuRenderFn={(
        anchorElementRef,
        { selectedIndex, selectOptionAndCleanUp, setHighlightedIndex }
      ) =>
        anchorElementRef.current && options.length > 0 ? (
          <Popover open>
            <PopoverPrimitive.Portal
              dir={dir}
              container={anchorElementRef.current}
            >
              <PopoverTrigger
                nativeButton={false}
                render={
                  <span
                    aria-hidden
                    className="pointer-events-none absolute inset-x-0 top-0 h-0"
                  />
                }
              />
              <PopoverContent
                dir={dir}
                side="bottom"
                align="start"
                sideOffset={6}
                initialFocus={false}
                className="w-auto overflow-hidden p-0"
              >
                <Command
                  value={
                    selectedIndex === null
                      ? ""
                      : (options[selectedIndex]?.entry.hexcode ?? "")
                  }
                  onValueChange={(nextValue) => {
                    const index = options.findIndex(
                      (option) => option.entry.hexcode === nextValue
                    )
                    if (index >= 0) {
                      setHighlightedIndex(index)
                    }
                  }}
                  shouldFilter={false}
                >
                  <CommandList className="max-h-64 w-56">
                    {options.map((option) => (
                      <CommandItem
                        key={option.key}
                        ref={option.setRefElement}
                        value={option.entry.hexcode}
                        onSelect={() => selectOptionAndCleanUp(option)}
                      >
                        <span className="text-base leading-none">
                          {option.entry.emoji}
                        </span>
                        <span className="truncate text-muted-foreground">
                          :{option.entry.name}:
                        </span>
                      </CommandItem>
                    ))}
                  </CommandList>
                </Command>
              </PopoverContent>
            </PopoverPrimitive.Portal>
          </Popover>
        ) : null
      }
    />
  )
}
