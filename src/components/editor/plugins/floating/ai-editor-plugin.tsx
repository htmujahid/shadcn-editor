import { useCallback, useEffect, useMemo, useRef, useState } from "react";

import {
  $createParagraphNode,
  $getNodeByKey,
  $getSelection,
  $isRangeSelection,
  $setSelection,
  CLICK_COMMAND,
  COMMAND_PRIORITY_HIGH,
  KEY_ESCAPE_COMMAND,
  type RangeSelection,
  registerEventListener,
} from "lexical";

import {
  $generateNodesFromMarkdownString,
  type Transformer,
  TRANSFORMERS,
} from "@lexical/markdown";
import { useLexicalComposerContext } from "@lexical/react/LexicalComposerContext";
import { createDOMRange } from "@lexical/selection";
import { mergeRegister } from "@lexical/utils";

import { Popover as PopoverPrimitive } from "@base-ui/react/popover";
import { Command as CommandPrimitive } from "cmdk";
import {
  CornerDownRight,
  FoldVertical,
  Lightbulb,
  ListCollapse,
  type LucideIcon,
  PenLine,
  RefreshCw,
  Replace,
  Sparkles,
  SpellCheck,
  UnfoldVertical,
  WandSparkles,
  X,
} from "lucide-react";

import {
  $getAiContext,
  AI_COMMANDS,
  type AiCommandId,
  type AiContext,
  type AiMode,
  type AiRequest,
  OPEN_AI_EDITOR_COMMAND,
} from "@/components/editor/extensions/ai";
import {
  hideFloatingAnchor,
  setFloatingAnchorRect,
} from "@/components/editor/plugins/floating/floating-utils";
import { useTranslation } from "@/components/editor/plugins/i18n-plugin";
import { Button } from "@/components/ui/button";
import { Command, CommandItem, CommandList } from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Spinner } from "@/components/ui/spinner";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";

const COMMAND_ICONS: Record<Exclude<AiCommandId, "custom">, LucideIcon> = {
  improve: WandSparkles,
  longer: UnfoldVertical,
  shorter: FoldVertical,
  fix: SpellCheck,
  continue: PenLine,
  summarize: ListCollapse,
  brainstorm: Lightbulb,
};

type Phase = "closed" | "prompt" | "generating";

export interface AiEditorPluginProps {
  output: string;
  isLoading: boolean;
  error?: Error | string | null;
  onGenerate: (request: AiRequest) => void;
  onStop?: () => void;
  transformers?: Transformer[];
}

const EMPTY_CONTEXT: AiContext = { text: "", before: "", after: "" };

function preventDefault(event: React.MouseEvent<HTMLElement>): void {
  event.preventDefault();
}

function $isLiveSelection(selection: RangeSelection): boolean {
  return (
    $getNodeByKey(selection.anchor.key) !== null &&
    $getNodeByKey(selection.focus.key) !== null
  );
}

export function AiEditorPlugin({
  output,
  isLoading,
  error,
  onGenerate,
  onStop,
  transformers = TRANSFORMERS,
}: AiEditorPluginProps) {
  const [editor] = useLexicalComposerContext();
  const { t, dir } = useTranslation();
  const activeTransformers = useMemo(
    () =>
      transformers.filter(
        (transformer) =>
          !("dependencies" in transformer) ||
          editor.hasNodes(transformer.dependencies),
      ),
    [editor, transformers],
  );

  const triggerRef = useRef<HTMLButtonElement | null>(null);
  const contentRef = useRef<HTMLDivElement | null>(null);
  const selectionRef = useRef<RangeSelection | null>(null);
  const lastRequestRef = useRef<AiRequest | null>(null);

  const [phase, setPhase] = useState<Phase>("closed");
  const [context, setContext] = useState<AiContext>(EMPTY_CONTEXT);
  const [mode, setMode] = useState<AiMode>("transform");
  const [query, setQuery] = useState("");
  const [baseline, setBaseline] = useState<string | null>(null);

  const isOpen = phase !== "closed";
  const errorMessage =
    error == null ? null : typeof error === "string" ? error : error.message;
  const visibleOutput = isLoading && output === baseline ? "" : output;
  const status =
    phase !== "generating"
      ? phase
      : isLoading
        ? "loading"
        : errorMessage !== null
          ? "error"
          : "result";

  const $getSavedSelection = useCallback((): RangeSelection | null => {
    const saved = selectionRef.current;
    if (saved !== null && $isLiveSelection(saved)) {
      return saved;
    }
    const current = $getSelection();
    if ($isRangeSelection(current)) {
      selectionRef.current = current.clone();
      return selectionRef.current;
    }
    return null;
  }, []);

  const positionToSelection = useCallback(() => {
    const triggerElem = triggerRef.current;
    if (triggerElem === null) {
      return;
    }
    const rect = isOpen
      ? editor.read(() => {
          const selection = $getSavedSelection();
          if (selection === null) {
            return null;
          }
          const range = createDOMRange(
            editor,
            selection.anchor.getNode(),
            selection.anchor.offset,
            selection.focus.getNode(),
            selection.focus.offset,
          );
          const rangeRect = range?.getBoundingClientRect() ?? null;
          if (rangeRect && (rangeRect.width > 0 || rangeRect.height > 0)) {
            return rangeRect;
          }
          const block = selection.anchor.getNode().getTopLevelElement();
          const element = block ? editor.getElementByKey(block.getKey()) : null;
          return element?.getBoundingClientRect() ?? rangeRect;
        })
      : null;
    if (rect === null) {
      hideFloatingAnchor(triggerElem);
    } else {
      setFloatingAnchorRect(triggerElem, rect);
    }
  }, [editor, isOpen, $getSavedSelection]);

  const close = useCallback(() => {
    if (isLoading) {
      onStop?.();
    }
    selectionRef.current = null;
    lastRequestRef.current = null;
    setBaseline(null);
    setPhase("closed");
    setQuery("");
  }, [isLoading, onStop]);

  const generate = (request: AiRequest) => {
    lastRequestRef.current = request;
    setBaseline(output);
    setPhase("generating");
    onGenerate(request);
  };

  const retry = () => {
    const last = lastRequestRef.current;
    if (last) {
      generate(last);
    }
  };

  const $restoreSelection = (): RangeSelection | null => {
    const saved = $getSavedSelection();
    if (saved === null) {
      return null;
    }
    const selection = saved.clone();
    $setSelection(selection);
    return selection;
  };

  const $insertOutput = (selection: RangeSelection) => {
    const nodes = $generateNodesFromMarkdownString(output, activeTransformers);
    if (nodes.length > 0) {
      selection.insertNodes(nodes);
    }
  };

  const insertAtSelection = () => {
    editor.update(() => {
      const selection = $restoreSelection();
      if ($isRangeSelection(selection)) {
        $insertOutput(selection);
      }
    });
    close();
    requestAnimationFrame(() => editor.focus());
  };

  const insertBelow = () => {
    editor.update(() => {
      const selection = $restoreSelection();
      if (!$isRangeSelection(selection)) {
        return;
      }
      const block = selection.focus.getNode().getTopLevelElementOrThrow();
      const paragraph = $createParagraphNode();
      block.insertAfter(paragraph);
      $insertOutput(paragraph.select());
    });
    close();
    requestAnimationFrame(() => editor.focus());
  };

  useEffect(() => {
    return mergeRegister(
      editor.registerCommand(
        OPEN_AI_EDITOR_COMMAND,
        () => {
          const selection = $getSelection();
          if (!$isRangeSelection(selection)) {
            return false;
          }
          if (isLoading) {
            onStop?.();
          }
          selectionRef.current = selection.clone();
          lastRequestRef.current = null;
          setBaseline(null);
          setMode(selection.isCollapsed() ? "insert" : "transform");
          setContext($getAiContext(selection, activeTransformers));
          setQuery("");
          setPhase("prompt");
          return true;
        },
        COMMAND_PRIORITY_HIGH,
      ),
      editor.registerCommand(
        CLICK_COMMAND,
        (event) => {
          if (isOpen && !contentRef.current?.contains(event.target as Node)) {
            close();
          }
          return false;
        },
        COMMAND_PRIORITY_HIGH,
      ),
      editor.registerCommand(
        KEY_ESCAPE_COMMAND,
        () => {
          if (isOpen) {
            close();
            return true;
          }
          return false;
        },
        COMMAND_PRIORITY_HIGH,
      ),
    );
  }, [editor, isOpen, isLoading, onStop, close, activeTransformers]);

  useEffect(() => {
    positionToSelection();
    if (!isOpen) {
      return;
    }
    return mergeRegister(
      registerEventListener(window, "resize", positionToSelection),
      registerEventListener(document, "scroll", positionToSelection, true),
    );
  }, [isOpen, positionToSelection]);

  return (
    <Popover open={isOpen}>
      <PopoverTrigger
        ref={triggerRef}
        aria-hidden="true"
        tabIndex={-1}
        className="pointer-events-none fixed top-0 left-0 opacity-0"
        style={{ transform: "translate(-10000px, -10000px)" }}
      />
      <PopoverPrimitive.Portal dir={dir}>
        <PopoverContent
          dir={dir}
          ref={contentRef}
          side="bottom"
          align="start"
          sideOffset={8}
          initialFocus={false}
          finalFocus={false}
          aria-label={t.askAi}
          className="w-80 min-w-0 flex-col gap-0 p-0"
          onKeyDown={(event) => {
            if (event.key === "Escape") {
              event.preventDefault();
              close();
            }
          }}
          onBlur={(event) => {
            if (!event.currentTarget.contains(event.relatedTarget as Node)) {
              close();
            }
          }}
        >
          {status === "prompt" && (
            <Command className="rounded-lg">
              <div className="flex items-center gap-2 border-b px-3">
                <Sparkles className="size-4 shrink-0 text-muted-foreground" />
                <CommandPrimitive.Input
                  ref={(elem) => {
                    if (elem) {
                      elem.focus();
                    }
                  }}
                  value={query}
                  onValueChange={setQuery}
                  placeholder={
                    mode === "insert"
                      ? t.askAiWritePlaceholder
                      : t.askAiPlaceholder
                  }
                  aria-label={t.askAi}
                  className="h-9 w-full bg-transparent text-sm outline-hidden placeholder:text-muted-foreground"
                />
              </div>
              <CommandList className="p-1">
                {query.trim() !== "" && (
                  <CommandItem
                    forceMount
                    value={`custom ${query}`}
                    onSelect={() => {
                      generate({
                        mode,
                        command: "custom",
                        prompt: query.trim(),
                        ...context,
                      });
                    }}
                  >
                    <Sparkles />
                    <span className="truncate">
                      {t.askAi}: {query}
                    </span>
                  </CommandItem>
                )}
                {AI_COMMANDS.filter((command) => command.mode === mode).map(
                  ({ id, labelKey, prompt }) => {
                    const Icon = COMMAND_ICONS[id];
                    return (
                      <CommandItem
                        key={id}
                        value={t[labelKey]}
                        onSelect={() => {
                          generate({
                            mode,
                            command: id,
                            prompt,
                            ...context,
                          });
                        }}
                      >
                        <Icon />
                        <span className="truncate">{t[labelKey]}</span>
                      </CommandItem>
                    );
                  },
                )}
              </CommandList>
            </Command>
          )}
          {status !== "prompt" && status !== "closed" && (
            <div className="flex flex-col gap-2 p-2">
              <div className="max-h-48 min-h-9 overflow-y-auto rounded-md bg-muted/50 px-2.5 py-2 text-sm whitespace-pre-wrap">
                {status === "error" ? (
                  <span className="text-destructive">{errorMessage}</span>
                ) : (
                  <>
                    {visibleOutput}
                    {status === "loading" && (
                      <span className="inline-flex items-center gap-1.5 text-muted-foreground">
                        {visibleOutput === "" && t.aiGenerating}
                        <Spinner className="size-3.5" />
                      </span>
                    )}
                  </>
                )}
              </div>
              <div className="flex items-center gap-1">
                {mode === "insert" ? (
                  <Tooltip>
                    <TooltipTrigger
                      render={
                        <Button
                          variant="default"
                          size="sm"
                          disabled={status !== "result"}
                          onMouseDown={preventDefault}
                          onClick={insertAtSelection}
                        >
                          <CornerDownRight />
                          {t.aiInsert}
                        </Button>
                      }
                    />
                    <TooltipContent>{t.aiInsert}</TooltipContent>
                  </Tooltip>
                ) : (
                  <>
                    <Tooltip>
                      <TooltipTrigger
                        render={
                          <Button
                            variant="default"
                            size="sm"
                            disabled={status !== "result"}
                            onMouseDown={preventDefault}
                            onClick={insertAtSelection}
                          >
                            <Replace />
                            {t.aiReplace}
                          </Button>
                        }
                      />
                      <TooltipContent>{t.aiReplace}</TooltipContent>
                    </Tooltip>
                    <Tooltip>
                      <TooltipTrigger
                        render={
                          <Button
                            variant="outline"
                            size="sm"
                            disabled={status !== "result"}
                            onMouseDown={preventDefault}
                            onClick={insertBelow}
                          >
                            <CornerDownRight />
                            {t.aiInsertBelow}
                          </Button>
                        }
                      />
                      <TooltipContent>{t.aiInsertBelow}</TooltipContent>
                    </Tooltip>
                  </>
                )}
                <div className="ms-auto flex items-center">
                  <Tooltip>
                    <TooltipTrigger
                      render={
                        <Button
                          variant="ghost"
                          size="icon-sm"
                          aria-label={t.aiTryAgain}
                          disabled={status === "loading"}
                          onMouseDown={preventDefault}
                          onClick={retry}
                        >
                          <RefreshCw />
                        </Button>
                      }
                    />
                    <TooltipContent>{t.aiTryAgain}</TooltipContent>
                  </Tooltip>
                  <Tooltip>
                    <TooltipTrigger
                      render={
                        <Button
                          variant="ghost"
                          size="icon-sm"
                          aria-label={t.aiDiscard}
                          onMouseDown={preventDefault}
                          onClick={close}
                        >
                          <X />
                        </Button>
                      }
                    />
                    <TooltipContent>{t.aiDiscard}</TooltipContent>
                  </Tooltip>
                </div>
              </div>
            </div>
          )}
        </PopoverContent>
      </PopoverPrimitive.Portal>
    </Popover>
  );
}
