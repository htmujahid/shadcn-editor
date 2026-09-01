import { useState } from "react"
import type { JSX } from "react"

import {
  $getDocument,
  $getNodeByKey,
  $getState,
  $setState,
  createState,
  type DOMExportOutput,
  IS_BOLD,
  IS_HIGHLIGHT,
  IS_ITALIC,
  IS_STRIKETHROUGH,
  IS_UNDERLINE,
  type LexicalNode,
  type NodeKey,
  type Spread,
  type StateConfigValue,
  type StateValueOrUpdater,
} from "lexical"

import {
  applyFormatToDom,
  DecoratorTextNode,
  type SerializedDecoratorTextNode,
} from "@lexical/extension"
import { useLexicalComposerContext } from "@lexical/react/LexicalComposerContext"
import { useLexicalNodeSelection } from "@lexical/react/useLexicalNodeSelection"

import { setHours, setMinutes } from "date-fns"

import { useTranslation } from "@/components/editor/plugins/i18n-plugin"
import { Calendar } from "@/components/ui/calendar"
import { Checkbox } from "@/components/ui/checkbox"
import { Field, FieldLabel } from "@/components/ui/field"
import { InputGroup, InputGroupInput } from "@/components/ui/input-group"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import { cn } from "@/lib/utils"

const tagToFormat = {
  b: "bold",
  i: "italic",
  mark: "highlight",
  s: "strikethrough",
  u: "underline",
} as const

const FORMAT_CLASSES = [
  [IS_BOLD, "font-bold"],
  [IS_HIGHLIGHT, "bg-yellow-200/70 dark:bg-yellow-500/30"],
  [IS_ITALIC, "italic"],
  [IS_STRIKETHROUGH, "line-through"],
  [IS_UNDERLINE, "underline"],
] as const

function getDateTimeText(dateTime: Date | undefined): string {
  if (dateTime === undefined) {
    return ""
  }
  const hours = dateTime.getHours()
  const minutes = dateTime.getMinutes()
  return (
    dateTime.toDateString() +
    (hours === 0 && minutes === 0
      ? ""
      : ` ${hours.toString().padStart(2, "0")}:${minutes
          .toString()
          .padStart(2, "0")}`)
  )
}

export type SerializedDateTimeNode = Spread<
  { dateTime?: string },
  SerializedDecoratorTextNode
>

const dateTimeState = createState("dateTime", {
  parse: (v) => new Date(v as string),
  unparse: (v) => v.toISOString(),
})

export class DateTimeNode extends DecoratorTextNode {
  $config() {
    return this.config("datetime", {
      extends: DecoratorTextNode,
      stateConfigs: [{ flat: true, stateConfig: dateTimeState }],
    })
  }

  getDateTime(): StateConfigValue<typeof dateTimeState> {
    return $getState(this, dateTimeState)
  }

  setDateTime(valueOrUpdater: StateValueOrUpdater<typeof dateTimeState>): this {
    return $setState(this, dateTimeState, valueOrUpdater)
  }

  getTextContent(): string {
    return getDateTimeText(this.getDateTime())
  }

  exportDOM(): DOMExportOutput {
    const element = $getDocument().createElement("span")
    const textDom = $getDocument().createTextNode(
      getDateTimeText(this.getDateTime())
    )
    element.setAttribute(
      "data-lexical-datetime",
      this.getDateTime()?.toString() || ""
    )
    element.appendChild(applyFormatToDom(this, textDom, tagToFormat))
    return { element }
  }

  createDOM(): HTMLElement {
    const element = $getDocument().createElement("span")
    element.setAttribute(
      "data-lexical-datetime",
      this.getDateTime()?.toString() || ""
    )
    element.style.display = "inline-block"
    return element
  }

  updateDOM(): false {
    return false
  }

  decorate(): JSX.Element {
    return (
      <DateTimeComponent
        dateTime={this.getDateTime()}
        format={this.getFormat()}
        nodeKey={this.__key}
      />
    )
  }
}

export function $createDateTimeNode(dateTime: Date): DateTimeNode {
  return new DateTimeNode().setDateTime(dateTime)
}

export function $isDateTimeNode(
  node: LexicalNode | null | undefined
): node is DateTimeNode {
  return node instanceof DateTimeNode
}

function DateTimeComponent({
  dateTime,
  format,
  nodeKey,
}: {
  dateTime: Date | undefined
  format: number
  nodeKey: NodeKey
}): JSX.Element {
  const [editor] = useLexicalComposerContext()
  const { t, dir, language } = useTranslation()
  const [isOpen, setIsOpen] = useState(false)
  const [selected, setSelected] = useState(dateTime)
  const [month, setMonth] = useState<Date | undefined>(dateTime ?? new Date())
  const [includeTime, setIncludeTime] = useState(() => {
    if (dateTime === undefined) {
      return false
    }
    return dateTime.getHours() !== 0 || dateTime.getMinutes() !== 0
  })
  const [timeValue, setTimeValue] = useState(() => {
    if (dateTime === undefined) {
      return "00:00"
    }
    const hours = dateTime.getHours()
    const minutes = dateTime.getMinutes()
    if (hours !== 0 || minutes !== 0) {
      return `${hours.toString().padStart(2, "0")}:${minutes
        .toString()
        .padStart(2, "0")}`
    }
    return "00:00"
  })
  const [isNodeSelected] = useLexicalNodeSelection(nodeKey)

  const withDateTimeNode = (cb: (node: DateTimeNode) => void): void => {
    editor.update(() => {
      const node = $getNodeByKey(nodeKey)
      if ($isDateTimeNode(node)) {
        cb(node)
      }
    })
  }

  const handleIncludeTimeChange = (checked: boolean) => {
    withDateTimeNode((node) => {
      if (checked) {
        setIncludeTime(true)
      } else {
        if (selected) {
          node.setDateTime(setHours(setMinutes(selected, 0), 0))
        }
        setIncludeTime(false)
        setTimeValue("00:00")
      }
    })
  }

  const handleTimeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    withDateTimeNode((node) => {
      const time = e.target.value
      if (!selected) {
        setTimeValue(time)
        return
      }
      const [hours, minutes] = time.split(":").map((str) => parseInt(str, 10))
      const newSelectedDate = setHours(setMinutes(selected, minutes), hours)
      setSelected(newSelectedDate)
      node.setDateTime(newSelectedDate)
      setTimeValue(time)
    })
  }

  const handleDaySelect = (date: Date | undefined) => {
    withDateTimeNode((node) => {
      if (!timeValue || !date) {
        setSelected(date)
        return
      }
      const [hours, minutes] = timeValue
        .split(":")
        .map((str) => parseInt(str, 10))
      const newDate = new Date(
        date.getFullYear(),
        date.getMonth(),
        date.getDate(),
        hours,
        minutes
      )
      node.setDateTime(newDate)
      setSelected(newDate)
    })
  }

  return (
    <Popover open={isOpen} onOpenChange={setIsOpen}>
      <PopoverTrigger
        nativeButton={false}
        render={
          <span
            className={cn(
              "cursor-pointer rounded-md bg-secondary px-1.5 py-0.5 text-secondary-foreground transition-colors hover:bg-secondary/80",
              FORMAT_CLASSES.filter(([flag]) => format & flag).map(
                ([, className]) => className
              ),
              isNodeSelected && "outline-2 outline-offset-1 outline-primary"
            )}
          >
            {dateTime
              ? new Intl.DateTimeFormat(language, {
                  weekday: "short",
                  day: "2-digit",
                  month: "short",
                  year: "numeric",
                }).format(dateTime) + (includeTime ? " " + timeValue : "")
              : "Invalid Date"}
          </span>
        }
      />
      <PopoverContent dir={dir} align="start" className="w-auto gap-0 p-0">
        <Calendar
          mode="single"
          captionLayout="dropdown"
          fixedWeeks={false}
          showOutsideDays={false}
          selected={selected}
          required={true}
          month={month}
          onMonthChange={setMonth}
          onSelect={handleDaySelect}
          startMonth={new Date(1925, 0)}
          endMonth={new Date(2042, 7)}
          className="p-2.5"
        />
        <div className="w-0 min-w-full border-t p-2.5">
          <Field>
            <FieldLabel className="font-normal has-data-checked:border-transparent has-data-checked:bg-transparent">
              <Checkbox
                checked={includeTime}
                onCheckedChange={handleIncludeTimeChange}
              />
              {t.dateTimeTime}
            </FieldLabel>
            <InputGroup>
              <InputGroupInput
                type="time"
                value={timeValue}
                onChange={handleTimeChange}
                disabled={!includeTime}
              />
            </InputGroup>
          </Field>
        </div>
      </PopoverContent>
    </Popover>
  )
}
