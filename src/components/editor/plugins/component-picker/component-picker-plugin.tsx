import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useId,
  useMemo,
  useRef,
  useState,
} from "react"

import type { TextNode } from "lexical"

import { useLexicalComposerContext } from "@lexical/react/LexicalComposerContext"
import {
  LexicalTypeaheadMenuPlugin,
  MenuOption,
  useBasicTypeaheadTriggerMatch,
} from "@lexical/react/LexicalTypeaheadMenuPlugin"

import { Popover as PopoverPrimitive } from "@base-ui/react/popover"

import { useLanguage } from "@/components/editor/plugins/i18n-plugin"
import { Command, CommandItem, CommandList } from "@/components/ui/command"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"

export type ComponentPickerItem = {
  value: string
  label: string
  icon?: React.ReactNode
  keywords?: string[]
  onSelect: (queryString: string) => void
}

type ComponentPickerContextValue = {
  registerItems: (id: string, items: ComponentPickerItem[]) => () => void
  queryString: string | null
}

const ComponentPickerContext =
  createContext<ComponentPickerContextValue | null>(null)

function useComponentPickerContext(): ComponentPickerContextValue {
  const context = useContext(ComponentPickerContext)
  if (context === null) {
    throw new Error(
      "ComponentPicker plugins must be rendered inside <ComponentPicker>"
    )
  }
  return context
}

export function useComponentPickerQuery(): string | null {
  return useComponentPickerContext().queryString
}

export function useComponentPickerItems(items: ComponentPickerItem[]) {
  const { registerItems } = useComponentPickerContext()
  const id = useId()

  useEffect(() => registerItems(id, items), [registerItems, id, items])
}

class ComponentPickerOption extends MenuOption {
  item: ComponentPickerItem

  constructor(item: ComponentPickerItem) {
    super(item.value)
    this.item = item
  }
}

export function ComponentPicker({ children }: { children: React.ReactNode }) {
  const [editor] = useLexicalComposerContext()
  const { dir } = useLanguage()
  const [queryString, setQueryString] = useState<string | null>(null)
  const [itemsById, setItemsById] = useState(
    () => new Map<string, ComponentPickerItem[]>()
  )
  const registrationOrderRef = useRef(new Map<string, number>())

  const registerItems = useCallback(
    (id: string, items: ComponentPickerItem[]) => {
      const order = registrationOrderRef.current
      if (!order.has(id)) {
        order.set(id, order.size)
      }
      setItemsById((prev) => new Map(prev).set(id, items))
      return () => {
        setItemsById((prev) => {
          const next = new Map(prev)
          next.delete(id)
          return next
        })
      }
    },
    []
  )

  const contextValue = useMemo(
    () => ({ registerItems, queryString }),
    [registerItems, queryString]
  )

  const checkForTriggerMatch = useBasicTypeaheadTriggerMatch("/", {
    allowWhitespace: true,
    minLength: 0,
  })

  const options = useMemo(() => {
    const order = registrationOrderRef.current
    const allItems = Array.from(itemsById.entries())
      .sort(([a], [b]) => (order.get(a) ?? 0) - (order.get(b) ?? 0))
      .flatMap(([, items]) => items)
    const query = (queryString ?? "").trim().toLowerCase()
    const matches =
      query === ""
        ? allItems
        : allItems.filter(
            (item) =>
              item.label.toLowerCase().includes(query) ||
              (item.keywords ?? []).some((keyword) =>
                keyword.toLowerCase().includes(query)
              )
          )
    return matches.map((item) => new ComponentPickerOption(item))
  }, [itemsById, queryString])

  const onSelectOption = useCallback(
    (
      option: ComponentPickerOption,
      nodeToReplace: TextNode | null,
      closeMenu: () => void,
      matchingString: string
    ) => {
      editor.update(() => {
        if (nodeToReplace) {
          nodeToReplace.remove()
        }
      })
      closeMenu()
      option.item.onSelect(matchingString)
    },
    [editor]
  )

  return (
    <ComponentPickerContext.Provider value={contextValue}>
      {children}
      <LexicalTypeaheadMenuPlugin<ComponentPickerOption>
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
                        : (options[selectedIndex]?.item.value ?? "")
                    }
                    onValueChange={(nextValue) => {
                      const index = options.findIndex(
                        (option) => option.item.value === nextValue
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
                          value={option.item.value}
                          onSelect={() => selectOptionAndCleanUp(option)}
                        >
                          {option.item.icon}
                          <span className="truncate">{option.item.label}</span>
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
    </ComponentPickerContext.Provider>
  )
}
