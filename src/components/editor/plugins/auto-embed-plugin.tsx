import { useCallback } from "react";

import type { LexicalEditor, LexicalNode } from "lexical";

import {
  AutoEmbedOption,
  type EmbedConfig,
  type EmbedMatchResult,
  LexicalAutoEmbedPlugin,
} from "@lexical/react/LexicalAutoEmbedPlugin";

import { Popover as PopoverPrimitive } from "@base-ui/react/popover";
import type { LucideIcon } from "lucide-react";
import { Frame, MessageSquareQuote, SquarePlay, X } from "lucide-react";

import { INSERT_FIGMA_COMMAND } from "@/components/editor/extensions/figma";
import { INSERT_TWEET_COMMAND } from "@/components/editor/extensions/twitter";
import { INSERT_YOUTUBE_COMMAND } from "@/components/editor/extensions/youtube";
import type { Locale } from "@/components/editor/locales";
import { parseFigmaDocumentID } from "@/components/editor/plugins/block-insert/insert-figma-plugin";
import { parseTweetID } from "@/components/editor/plugins/block-insert/insert-twitter-plugin";
import { parseYouTubeVideoID } from "@/components/editor/plugins/block-insert/insert-youtube-plugin";
import {
  useLanguage,
  useTranslation,
} from "@/components/editor/plugins/i18n-plugin";
import { Command, CommandItem, CommandList } from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

type EditorEmbedConfig = EmbedConfig & {
  labelKey: keyof Locale;
  icon: LucideIcon;
};

const YouTubeEmbedConfig: EditorEmbedConfig = {
  type: "youtube-video",
  labelKey: "embedYoutube",
  icon: SquarePlay,
  parseUrl: (text: string) => {
    const id = parseYouTubeVideoID(text);
    return id ? { id, url: text } : null;
  },
  insertNode: (editor: LexicalEditor, result: EmbedMatchResult) => {
    editor.dispatchCommand(INSERT_YOUTUBE_COMMAND, result.id);
  },
};

const TwitterEmbedConfig: EditorEmbedConfig = {
  type: "tweet",
  labelKey: "embedTweet",
  icon: MessageSquareQuote,
  parseUrl: (text: string) => {
    const id = parseTweetID(text);
    return id ? { id, url: text } : null;
  },
  insertNode: (editor: LexicalEditor, result: EmbedMatchResult) => {
    editor.dispatchCommand(INSERT_TWEET_COMMAND, result.id);
  },
};

const FigmaEmbedConfig: EditorEmbedConfig = {
  type: "figma",
  labelKey: "embedFigma",
  icon: Frame,
  parseUrl: (text: string) => {
    const id = parseFigmaDocumentID(text);
    return id ? { id, url: text } : null;
  },
  insertNode: (editor: LexicalEditor, result: EmbedMatchResult) => {
    editor.dispatchCommand(INSERT_FIGMA_COMMAND, result.id);
  },
};

const EMBED_CONFIGS: EditorEmbedConfig[] = [
  YouTubeEmbedConfig,
  TwitterEmbedConfig,
  FigmaEmbedConfig,
];

class EditorAutoEmbedOption extends AutoEmbedOption {
  Icon: LucideIcon;

  constructor(
    title: string,
    Icon: LucideIcon,
    options: { onSelect: (targetNode: LexicalNode | null) => void },
  ) {
    super(title, options);
    this.Icon = Icon;
  }
}

export function AutoEmbedPlugin() {
  const { t } = useTranslation();
  const { dir } = useLanguage();

  const getMenuOptions = useCallback(
    (
      activeEmbedConfig: EditorEmbedConfig,
      embedFn: () => void,
      dismissFn: () => void,
    ) => [
      new EditorAutoEmbedOption(t.autoEmbedDismiss, X, {
        onSelect: dismissFn,
      }),
      new EditorAutoEmbedOption(
        t[activeEmbedConfig.labelKey],
        activeEmbedConfig.icon,
        { onSelect: embedFn },
      ),
    ],
    [t],
  );

  return (
    <LexicalAutoEmbedPlugin<EditorEmbedConfig>
      embedConfigs={EMBED_CONFIGS}
      getMenuOptions={getMenuOptions}
      menuRenderFn={(
        anchorElementRef,
        { selectedIndex, options, selectOptionAndCleanUp, setHighlightedIndex },
      ) =>
        anchorElementRef.current && options.length > 0 ? (
          <Popover open>
            <PopoverPrimitive.Portal container={anchorElementRef.current}>
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
                      : (options[selectedIndex]?.key ?? "")
                  }
                  onValueChange={(nextValue) => {
                    const index = options.findIndex(
                      (option) => option.key === nextValue,
                    );
                    if (index >= 0) {
                      setHighlightedIndex(index);
                    }
                  }}
                  shouldFilter={false}
                >
                  <CommandList className="max-h-64 w-56">
                    {options.map((option) => {
                      const Icon =
                        option instanceof EditorAutoEmbedOption
                          ? option.Icon
                          : null;
                      return (
                        <CommandItem
                          key={option.key}
                          ref={option.setRefElement}
                          value={option.key}
                          onSelect={() => selectOptionAndCleanUp(option)}
                        >
                          {Icon ? (
                            <Icon className="size-4 text-muted-foreground" />
                          ) : null}
                          <span className="truncate">{option.title}</span>
                        </CommandItem>
                      );
                    })}
                  </CommandList>
                </Command>
              </PopoverContent>
            </PopoverPrimitive.Portal>
          </Popover>
        ) : null
      }
    />
  );
}
