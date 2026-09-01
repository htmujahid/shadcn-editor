import { useCallback, useEffect, useMemo, useState } from "react"

import type { TextNode } from "lexical"

import { useLexicalComposerContext } from "@lexical/react/LexicalComposerContext"
import {
  LexicalTypeaheadMenuPlugin,
  MenuOption,
  type MenuTextMatch,
  useBasicTypeaheadTriggerMatch,
} from "@lexical/react/LexicalTypeaheadMenuPlugin"

import { Popover as PopoverPrimitive } from "@base-ui/react/popover"
import { User } from "lucide-react"

import { $createMentionNode } from "@/components/editor/nodes/mention-node"
import { useLanguage } from "@/components/editor/plugins/i18n-plugin"
import { Command, CommandItem, CommandList } from "@/components/ui/command"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"

const MAX_SUGGESTIONS = 5

const PUNCTUATION =
  "\\.,\\+\\*\\?\\$\\@\\|#{}\\(\\)\\^\\-\\[\\]\\\\/!%'\"~=<>_:;"

const TRIGGERS = ["@"].join("")

const VALID_CHARS = "[^" + TRIGGERS + PUNCTUATION + "\\s]"

const VALID_JOINS = "(?:" + "\\.[ |$]|" + " |" + "[" + PUNCTUATION + "]|" + ")"

const LENGTH_LIMIT = 75

const AtSignMentionsRegex = new RegExp(
  "(^|\\s|\\()(" +
    "[" +
    TRIGGERS +
    "]" +
    "((?:" +
    VALID_CHARS +
    VALID_JOINS +
    "){0," +
    LENGTH_LIMIT +
    "})" +
    ")$"
)

const ALIAS_LENGTH_LIMIT = 50

const AtSignMentionsRegexAliasRegex = new RegExp(
  "(^|\\s|\\()(" +
    "[" +
    TRIGGERS +
    "]" +
    "((?:" +
    VALID_CHARS +
    "){0," +
    ALIAS_LENGTH_LIMIT +
    "})" +
    ")$"
)

const MENTIONS = [
  "Aayla Secura",
  "Admiral Gial Ackbar",
  "Ahsoka Tano",
  "Anakin Skywalker",
  "Asajj Ventress",
  "BB-8",
  "Bail Organa",
  "Beru Lars",
  "Boba Fett",
  "Bodhi Rook",
  "C-3PO",
  "Captain Phasma",
  "Captain Rex",
  "Cassian Andor",
  "Chewbacca",
  "Chirrut Îmwe",
  "Count Dooku",
  "Darth Maul",
  "Darth Vader",
  "Ezra Bridger",
  "Finn",
  "Galen Erso",
  "General Grievous",
  "Grand Moff Tarkin",
  "Greedo",
  "Han Solo",
  "Hera Syndulla",
  "Jabba the Hutt",
  "Jango Fett",
  "Jar Jar Binks",
  "Jyn Erso",
  "K-2SO",
  "Kanan Jarrus",
  "Ki-Adi-Mundi",
  "Kit Fisto",
  "Kylo Ren",
  "Lando Calrissian",
  "Leia Organa",
  "Luke Skywalker",
  "Mace Windu",
  "Maz Kanata",
  "Mon Mothma",
  "Obi-Wan Kenobi",
  "Owen Lars",
  "Padmé Amidala",
  "Plo Koon",
  "Poe Dameron",
  "Qui-Gon Jinn",
  "R2-D2",
  "Rey",
  "Rose Tico",
  "Sabine Wren",
  "Saw Gerrera",
  "Sheev Palpatine",
  "Shmi Skywalker",
  "Wedge Antilles",
  "Yoda",
]

const mentionsCache = new Map<string, string[] | null>()

const lookupService = {
  search(query: string, callback: (results: string[]) => void): void {
    setTimeout(() => {
      const results = MENTIONS.filter((mention) =>
        mention.toLowerCase().includes(query.toLowerCase())
      )
      callback(results)
    }, 250)
  },
}

function useMentionLookupService(mentionString: string | null) {
  const [results, setResults] = useState<string[]>([])

  useEffect(() => {
    if (mentionString === null) {
      setResults([])
      return
    }

    const cachedResults = mentionsCache.get(mentionString)
    if (cachedResults === null) {
      return
    }
    if (cachedResults !== undefined) {
      setResults(cachedResults)
      return
    }

    mentionsCache.set(mentionString, null)
    lookupService.search(mentionString, (newResults) => {
      mentionsCache.set(mentionString, newResults)
      setResults(newResults)
    })
  }, [mentionString])

  return results
}

function checkForAtSignMentions(
  text: string,
  minMatchLength: number
): MenuTextMatch | null {
  let match = AtSignMentionsRegex.exec(text)

  if (match === null) {
    match = AtSignMentionsRegexAliasRegex.exec(text)
  }
  if (match !== null) {
    const maybeLeadingWhitespace = match[1]
    const matchingString = match[3]
    if (matchingString.length >= minMatchLength) {
      return {
        leadOffset: match.index + maybeLeadingWhitespace.length,
        matchingString,
        replaceableString: match[2],
      }
    }
  }
  return null
}

class MentionTypeaheadOption extends MenuOption {
  name: string

  constructor(name: string) {
    super(name)
    this.name = name
  }
}

export function MentionPlugin() {
  const [editor] = useLexicalComposerContext()
  const { dir } = useLanguage()
  const [queryString, setQueryString] = useState<string | null>(null)

  const results = useMentionLookupService(queryString)

  const options = useMemo(
    () =>
      results
        .slice(0, MAX_SUGGESTIONS)
        .map((result) => new MentionTypeaheadOption(result)),
    [results]
  )

  const onSelectOption = useCallback(
    (
      option: MentionTypeaheadOption,
      nodeToReplace: TextNode | null,
      closeMenu: () => void
    ) => {
      editor.update(() => {
        const mentionNode = $createMentionNode(option.name)
        if (nodeToReplace) {
          nodeToReplace.replace(mentionNode)
        }
        mentionNode.select()
        closeMenu()
      })
    },
    [editor]
  )

  const checkForSlashTriggerMatch = useBasicTypeaheadTriggerMatch("/", {
    minLength: 0,
  })

  const checkForMentionMatch = useCallback(
    (text: string) => {
      if (checkForSlashTriggerMatch(text, editor) !== null) {
        return null
      }
      return checkForAtSignMentions(text, 1)
    },
    [checkForSlashTriggerMatch, editor]
  )

  return (
    <LexicalTypeaheadMenuPlugin<MentionTypeaheadOption>
      onQueryChange={setQueryString}
      onSelectOption={onSelectOption}
      triggerFn={checkForMentionMatch}
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
                      : (options[selectedIndex]?.name ?? "")
                  }
                  onValueChange={(nextValue) => {
                    const index = options.findIndex(
                      (option) => option.name === nextValue
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
                        value={option.name}
                        onSelect={() => selectOptionAndCleanUp(option)}
                      >
                        <User className="size-4 text-muted-foreground" />
                        <span className="truncate">{option.name}</span>
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
