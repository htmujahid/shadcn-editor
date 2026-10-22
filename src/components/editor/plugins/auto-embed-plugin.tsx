import { type ReactElement, useCallback } from "react";

import type { LexicalEditor, LexicalNode } from "lexical";

import {
  AutoEmbedOption,
  type EmbedConfig,
  type EmbedMatchResult,
  LexicalAutoEmbedPlugin,
} from "@lexical/react/LexicalAutoEmbedPlugin";

import { Popover as PopoverPrimitive } from "@base-ui/react/popover";

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
import { IconPlaceholder } from "@/components/icon-placeholder";
import { Command, CommandItem, CommandList } from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

type EditorEmbedConfig = EmbedConfig & {
  labelKey: keyof Locale;
  icon: ReactElement;
};

const YouTubeEmbedConfig: EditorEmbedConfig = {
  type: "youtube-video",
  labelKey: "embedYoutube",
  icon: (
    <IconPlaceholder
      lucide="SquarePlay"
      tabler="IconPlayerPlay"
      hugeicons="PlayIcon"
      phosphor="PlayIcon"
      remixicon="RiPlayCircleLine"
      className="size-4 text-muted-foreground"
    />
  ),
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
  icon: (
    <IconPlaceholder
      lucide="MessageSquareQuote"
      tabler="IconMessageCircleStar"
      hugeicons="BubbleChatQuestionIcon"
      phosphor="ChatCenteredTextIcon"
      remixicon="RiChatQuoteLine"
      className="size-4 text-muted-foreground"
    />
  ),
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
  icon: (
    <IconPlaceholder
      lucide="Frame"
      tabler="IconFrame"
      hugeicons="FrameIcon"
      phosphor="FrameCornersIcon"
      remixicon="RiCropLine"
      className="size-4 text-muted-foreground"
    />
  ),
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
  icon: ReactElement;

  constructor(
    title: string,
    icon: ReactElement,
    options: { onSelect: (targetNode: LexicalNode | null) => void },
  ) {
    super(title, options);
    this.icon = icon;
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
      new EditorAutoEmbedOption(
        t.autoEmbedDismiss,
        <IconPlaceholder
          lucide="X"
          tabler="IconX"
          hugeicons="Cancel01Icon"
          phosphor="XIcon"
          remixicon="RiCloseLine"
          className="size-4 text-muted-foreground"
        />,
        {
          onSelect: dismissFn,
        },
      ),
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
                      const icon =
                        option instanceof EditorAutoEmbedOption
                          ? option.icon
                          : null;
                      return (
                        <CommandItem
                          key={option.key}
                          ref={option.setRefElement}
                          value={option.key}
                          onSelect={() => selectOptionAndCleanUp(option)}
                        >
                          {icon}
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
