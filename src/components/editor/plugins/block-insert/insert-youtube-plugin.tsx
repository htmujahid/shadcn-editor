import { useState } from "react";

import { $getRoot, $getSelection } from "lexical";

import { useLexicalComposerContext } from "@lexical/react/LexicalComposerContext";
import { useLexicalEditable } from "@lexical/react/useLexicalEditable";

import { SquarePlay } from "lucide-react";

import { INSERT_YOUTUBE_COMMAND } from "@/components/editor/extensions/youtube";
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

export function parseYouTubeVideoID(url: string): string | null {
  const trimmed = url.trim();
  if (/^[A-Za-z0-9_-]{11}$/.test(trimmed)) {
    return trimmed;
  }
  const match =
    /^.*(youtu\.be\/|v\/|u\/\w\/|embed\/|shorts\/|live\/|watch\?v=|&v=)([^#&?]*).*/.exec(
      trimmed,
    );
  const id = match?.[2];
  return id && id.length === 11 ? id : null;
}

export function InsertYouTubePlugin() {
  const [editor] = useLexicalComposerContext();
  const isEditable = useLexicalEditable();
  const { t, dir } = useTranslation();
  const [open, setOpen] = useState(false);
  const [url, setUrl] = useState("");
  const videoID = parseYouTubeVideoID(url);

  const onOpenChange = (nextOpen: boolean) => {
    setOpen(nextOpen);
    if (!nextOpen) {
      setUrl("");
    }
  };

  const onSubmit = () => {
    if (!videoID) {
      return;
    }
    editor.update(() => {
      if (!$getSelection()) {
        $getRoot().selectEnd();
      }
    });
    editor.dispatchCommand(INSERT_YOUTUBE_COMMAND, videoID);
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
                  aria-label={t.insertYoutube}
                  disabled={!isEditable}
                >
                  <SquarePlay />
                </Button>
              }
            />
          }
        />
        <TooltipContent>{t.insertYoutube}</TooltipContent>
      </Tooltip>
      <PopoverContent dir={dir} align="start" className="w-72">
        <div className="flex flex-col gap-2">
          <Input
            dir="ltr"
            placeholder={t.youtubeUrlPlaceholder}
            value={url}
            onChange={(event) => setUrl(event.target.value)}
            onKeyDown={(event) => {
              if (event.key === "Enter") {
                event.preventDefault();
                onSubmit();
              }
            }}
          />
          <Button size="sm" disabled={!videoID} onClick={onSubmit}>
            {t.embedYoutube}
          </Button>
        </div>
      </PopoverContent>
    </Popover>
  );
}
