import type { JSX } from "react";
import * as React from "react";
import { useState } from "react";

import { useLexicalComposerContext } from "@lexical/react/LexicalComposerContext";
import { useLexicalNodeSelection } from "@lexical/react/useLexicalNodeSelection";
import {
  $getNodeByKey,
  IS_BOLD,
  IS_HIGHLIGHT,
  IS_ITALIC,
  IS_STRIKETHROUGH,
  IS_UNDERLINE,
  type NodeKey,
} from "lexical";

import { format } from "date-fns";
import { setHours, setMinutes } from "date-fns";
import { CalendarIcon } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { cn } from "@/lib/utils";

import { $isDateTimeNode, type DateTimeNode } from "../nodes/date-time-node";

const userTimeZone = Intl.DateTimeFormat().resolvedOptions().timeZone;

export default function DateTimeComponent({
  dateTime,
  format: textFormat,
  nodeKey,
}: {
  dateTime: Date | undefined;
  format: number;
  nodeKey: NodeKey;
}): JSX.Element {
  const [editor] = useLexicalComposerContext();
  const [selected, setSelected] = useState(dateTime);
  const [includeTime, setIncludeTime] = useState(() => {
    if (!dateTime) return false;
    return dateTime.getHours() !== 0 || dateTime.getMinutes() !== 0;
  });
  const [timeValue, setTimeValue] = useState(() => {
    if (!dateTime) return "00:00";
    const h = dateTime.getHours();
    const m = dateTime.getMinutes();
    if (h !== 0 || m !== 0) {
      return `${h.toString().padStart(2, "0")}:${m.toString().padStart(2, "0")}`;
    }
    return "00:00";
  });
  const [isNodeSelected] = useLexicalNodeSelection(nodeKey);

  const withDateTimeNode = (cb: (node: DateTimeNode) => void): void => {
    editor.update(() => {
      const node = $getNodeByKey(nodeKey);
      if ($isDateTimeNode(node)) {
        cb(node);
      }
    });
  };

  const handleCheckedChange = (checked: boolean) => {
    withDateTimeNode((node) => {
      if (checked) {
        setIncludeTime(true);
      } else {
        if (selected) {
          node.setDateTime(setHours(setMinutes(selected, 0), 0));
        }
        setIncludeTime(false);
        setTimeValue("00:00");
      }
    });
  };

  const handleTimeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    withDateTimeNode((node) => {
      const time = e.target.value;
      if (!selected) {
        setTimeValue(time);
        return;
      }
      const [hours, minutes] = time.split(":").map((s) => parseInt(s, 10));
      const newDate = setHours(setMinutes(selected, minutes), hours);
      setSelected(newDate);
      node.setDateTime(newDate);
      setTimeValue(time);
    });
  };

  const handleDaySelect = (date: Date | undefined) => {
    withDateTimeNode((node) => {
      if (!date) {
        setSelected(date);
        return;
      }
      const [hours, minutes] = timeValue.split(":").map((s) => parseInt(s, 10));
      const newDate = new Date(
        date.getFullYear(),
        date.getMonth(),
        date.getDate(),
        hours,
        minutes,
      );
      node.setDateTime(newDate);
      setSelected(newDate);
    });
  };

  const displayLabel = dateTime
    ? format(dateTime, includeTime ? "PPP p" : "PPP")
    : null;

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          data-empty={!dateTime}
          data-selected={isNodeSelected}
          className={cn(
            "inline-flex h-auto gap-1.5 px-2 py-0.5 text-sm font-normal",
            "data-[empty=true]:text-muted-foreground",
            "data-[selected=true]:ring-2 data-[selected=true]:ring-primary",
            textFormat & IS_BOLD && "font-bold",
            textFormat & IS_ITALIC && "italic",
            textFormat & IS_UNDERLINE && "underline",
            textFormat & IS_STRIKETHROUGH && "line-through",
            textFormat & IS_HIGHLIGHT &&
              "bg-accent text-accent-foreground hover:bg-accent/80",
          )}
        >
          <CalendarIcon className="size-3.5" />
          {displayLabel ?? <span>Pick a date</span>}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-auto p-0" align="start">
        <Calendar
          captionLayout="dropdown"
          mode="single"
          selected={selected}
          onSelect={handleDaySelect}
          showOutsideDays={false}
          startMonth={new Date(1925, 0)}
          endMonth={new Date(2042, 7)}
        />
        <div className="border-t px-3 py-2">
          <div className="flex items-center gap-2">
            <Checkbox
              id={`include-time-${nodeKey}`}
              checked={includeTime}
              onCheckedChange={(checked: boolean | "indeterminate") =>
                handleCheckedChange(checked === true)
              }
            />
            <Label
              htmlFor={`include-time-${nodeKey}`}
              className="flex items-center gap-2"
            >
              <Input
                type="time"
                value={timeValue}
                onChange={handleTimeChange}
                disabled={!includeTime}
                className="h-7 w-28 px-1.5 text-xs"
              />
              <span className="text-xs text-muted-foreground">
                {userTimeZone}
              </span>
            </Label>
          </div>
        </div>
      </PopoverContent>
    </Popover>
  );
}
