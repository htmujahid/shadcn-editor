import { useState } from "react";

import { $getRoot, $getSelection } from "lexical";

import { useLexicalComposerContext } from "@lexical/react/LexicalComposerContext";
import { useLexicalEditable } from "@lexical/react/useLexicalEditable";

import { MessageSquareQuote } from "lucide-react";

import { INSERT_TWEET_COMMAND } from "@/components/editor/extensions/twitter";
import { useTranslation } from "@/components/editor/plugins/i18n-plugin";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";

export function parseTweetID(url: string): string | null {
  const trimmed = url.trim();
  if (/^\d{4,25}$/.test(trimmed)) {
    return trimmed;
  }
  const match =
    /^https:\/\/(twitter|x)\.com\/(#!\/)?(\w+)\/status(es)?\/(\d+)/.exec(
      trimmed,
    );
  return match?.[5] ?? null;
}

export function InsertTwitterPlugin() {
  const [editor] = useLexicalComposerContext();
  const isEditable = useLexicalEditable();
  const { t, dir } = useTranslation();
  const [open, setOpen] = useState(false);
  const [url, setUrl] = useState("");
  const tweetID = parseTweetID(url);

  const onOpenChange = (nextOpen: boolean) => {
    setOpen(nextOpen);
    if (!nextOpen) {
      setUrl("");
    }
  };

  const onSubmit = () => {
    if (!tweetID) {
      return;
    }
    editor.update(() => {
      if (!$getSelection()) {
        $getRoot().selectEnd();
      }
    });
    editor.dispatchCommand(INSERT_TWEET_COMMAND, tweetID);
    onOpenChange(false);
  };

  return (
    <Popover open={open} onOpenChange={onOpenChange}>
      <Tooltip>
        <TooltipTrigger
          render={
            <PopoverTrigger
              render={
                <Button
                  variant="outline"
                  size="icon-sm"
                  aria-label={t.insertTweet}
                  disabled={!isEditable}
                >
                  <MessageSquareQuote />
                </Button>
              }
            />
          }
        />
        <TooltipContent>{t.insertTweet}</TooltipContent>
      </Tooltip>
      <PopoverContent dir={dir} align="start" className="w-72">
        <div className="flex flex-col gap-2">
          <Input
            dir="ltr"
            placeholder={t.tweetUrlPlaceholder}
            value={url}
            onChange={(event) => setUrl(event.target.value)}
            onKeyDown={(event) => {
              if (event.key === "Enter") {
                event.preventDefault();
                onSubmit();
              }
            }}
          />
          <Button size="sm" disabled={!tweetID} onClick={onSubmit}>
            {t.embedTweet}
          </Button>
        </div>
      </PopoverContent>
    </Popover>
  );
}
