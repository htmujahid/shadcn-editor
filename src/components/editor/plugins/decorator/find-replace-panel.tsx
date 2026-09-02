/* eslint-disable react-refresh/only-export-components */
import { useRef } from "react";

import { createPortal } from "react-dom";

import {
  configExtension,
  CONTROL_OR_META,
  defineExtension,
  isExactShortcutMatch,
} from "lexical";

import { ReactExtension } from "@lexical/react/ReactExtension";
import type { DecoratorComponentProps } from "@lexical/react/ReactPluginHostExtension";
import { useExtensionSignalValue } from "@lexical/react/useExtensionSignalValue";
import { useLexicalEditable } from "@lexical/react/useLexicalEditable";

import {
  CaseSensitive,
  ChevronDown,
  ChevronUp,
  Regex,
  Replace,
  ReplaceAll,
  X,
} from "lucide-react";

import {
  CLOSE_FIND_REPLACE_COMMAND,
  FIND_NEXT_COMMAND,
  FIND_PREV_COMMAND,
  FindReplaceExtension,
  REPLACE_ALL_COMMAND,
  REPLACE_CURRENT_COMMAND,
  SET_REPLACE_TERM_COMMAND,
  SET_SEARCH_TERM_COMMAND,
  TOGGLE_CASE_SENSITIVE_COMMAND,
  TOGGLE_REGEX_COMMAND,
} from "@/components/editor/extensions/find-replace";
import { useTranslation } from "@/components/editor/plugins/i18n-plugin";
import { Button } from "@/components/ui/button";
import { ButtonGroup } from "@/components/ui/button-group";
import {
  InputGroup,
  InputGroupAddon,
  InputGroupButton,
  InputGroupInput,
} from "@/components/ui/input-group";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { cn } from "@/lib/utils";

function FindReplacePanel({ context }: DecoratorComponentProps) {
  const [editor] = context;
  const { t, dir } = useTranslation();
  const isEditable = useLexicalEditable();
  const isOpen = useExtensionSignalValue(FindReplaceExtension, "isOpen");
  const searchTerm = useExtensionSignalValue(
    FindReplaceExtension,
    "searchTerm",
  );
  const replaceTerm = useExtensionSignalValue(
    FindReplaceExtension,
    "replaceTerm",
  );
  const caseSensitive = useExtensionSignalValue(
    FindReplaceExtension,
    "caseSensitive",
  );
  const isRegex = useExtensionSignalValue(FindReplaceExtension, "isRegex");
  const matches = useExtensionSignalValue(FindReplaceExtension, "matches");
  const effectiveIndex = useExtensionSignalValue(
    FindReplaceExtension,
    "effectiveIndex",
  );
  const regexError = useExtensionSignalValue(
    FindReplaceExtension,
    "regexError",
  );
  const findInputRef = useRef<HTMLInputElement>(null);

  if (!isOpen) {
    return null;
  }

  const goToNext = () => editor.dispatchCommand(FIND_NEXT_COMMAND, undefined);
  const goToPrevious = () =>
    editor.dispatchCommand(FIND_PREV_COMMAND, undefined);
  const close = () => {
    editor.dispatchCommand(CLOSE_FIND_REPLACE_COMMAND, undefined);
    editor.focus();
  };

  const handlePanelKeyDown = (event: React.KeyboardEvent) => {
    if (event.key === "Escape") {
      event.preventDefault();
      close();
      return;
    }
    if (
      isExactShortcutMatch(event, "g", CONTROL_OR_META) ||
      isExactShortcutMatch(event, "g", { ...CONTROL_OR_META, shiftKey: true })
    ) {
      event.preventDefault();
      if (event.shiftKey) {
        goToPrevious();
      } else {
        goToNext();
      }
      return;
    }
    if (
      isExactShortcutMatch(event, "f", CONTROL_OR_META) ||
      isExactShortcutMatch(event, "f", { altKey: true, metaKey: true })
    ) {
      event.preventDefault();
      findInputRef.current?.focus();
    }
  };

  const canNavigate = matches.length > 0;
  const canReplace = isEditable && matches.length > 0;
  const statusLabel = regexError
    ? t.invalidRegex
    : searchTerm === ""
      ? null
      : matches.length === 0
        ? t.noResults
        : t.matchCount
            .replace("{current}", String(effectiveIndex + 1))
            .replace("{total}", String(matches.length));

  const rootElement = editor.getRootElement();
  const portalTarget =
    rootElement?.parentElement ?? rootElement?.ownerDocument.body ?? null;
  if (!portalTarget) {
    return null;
  }

  return createPortal(
    <div
      role="dialog"
      aria-label={t.findAndReplace}
      dir={dir}
      onKeyDown={handlePanelKeyDown}
      className="absolute end-2 top-2 z-50 flex w-80 flex-col gap-2 rounded-md border bg-popover p-2 text-popover-foreground shadow-md"
    >
      <div className="flex items-center justify-between gap-2">
        <span className="ps-1 text-sm font-medium">{t.findAndReplace}</span>
        <Tooltip>
          <TooltipTrigger
            render={
              <Button
                variant="ghost"
                size="icon-xs"
                aria-label={t.closeFindReplace}
                onClick={close}
              >
                <X />
              </Button>
            }
          />
          <TooltipContent>{t.closeFindReplace}</TooltipContent>
        </Tooltip>
      </div>
      <InputGroup>
        <InputGroupInput
          ref={findInputRef}
          autoFocus
          placeholder={t.find}
          aria-label={t.find}
          aria-invalid={regexError || undefined}
          value={searchTerm}
          onChange={(event) => {
            editor.dispatchCommand(SET_SEARCH_TERM_COMMAND, event.target.value);
          }}
          onKeyDown={(event) => {
            if (event.key === "Enter") {
              event.preventDefault();
              if (event.shiftKey) {
                goToPrevious();
              } else {
                goToNext();
              }
            }
          }}
        />
        <InputGroupAddon align="inline-end">
          <Tooltip>
            <TooltipTrigger
              render={
                <InputGroupButton
                  size="icon-xs"
                  aria-label={t.matchCase}
                  aria-pressed={caseSensitive}
                  className={cn(
                    caseSensitive && "bg-accent text-accent-foreground",
                  )}
                  onClick={() => {
                    editor.dispatchCommand(
                      TOGGLE_CASE_SENSITIVE_COMMAND,
                      undefined,
                    );
                  }}
                >
                  <CaseSensitive />
                </InputGroupButton>
              }
            />
            <TooltipContent>{t.matchCase}</TooltipContent>
          </Tooltip>
          <Tooltip>
            <TooltipTrigger
              render={
                <InputGroupButton
                  size="icon-xs"
                  aria-label={t.useRegex}
                  aria-pressed={isRegex}
                  className={cn(isRegex && "bg-accent text-accent-foreground")}
                  onClick={() => {
                    editor.dispatchCommand(TOGGLE_REGEX_COMMAND, undefined);
                  }}
                >
                  <Regex />
                </InputGroupButton>
              }
            />
            <TooltipContent>{t.useRegex}</TooltipContent>
          </Tooltip>
        </InputGroupAddon>
      </InputGroup>
      <InputGroup>
        <InputGroupInput
          placeholder={t.replace}
          aria-label={t.replace}
          disabled={!isEditable}
          value={replaceTerm}
          onChange={(event) => {
            editor.dispatchCommand(
              SET_REPLACE_TERM_COMMAND,
              event.target.value,
            );
          }}
          onKeyDown={(event) => {
            if (event.key === "Enter") {
              event.preventDefault();
              editor.dispatchCommand(REPLACE_CURRENT_COMMAND, undefined);
            }
          }}
        />
        <InputGroupAddon align="inline-end">
          <Tooltip>
            <TooltipTrigger
              render={
                <InputGroupButton
                  size="icon-xs"
                  aria-label={t.replace}
                  disabled={!canReplace}
                  onClick={() => {
                    editor.dispatchCommand(REPLACE_CURRENT_COMMAND, undefined);
                  }}
                >
                  <Replace className="rtl:-scale-x-100" />
                </InputGroupButton>
              }
            />
            <TooltipContent>{t.replace}</TooltipContent>
          </Tooltip>
          <Tooltip>
            <TooltipTrigger
              render={
                <InputGroupButton
                  size="icon-xs"
                  aria-label={t.replaceAll}
                  disabled={!canReplace}
                  onClick={() => {
                    editor.dispatchCommand(REPLACE_ALL_COMMAND, undefined);
                  }}
                >
                  <ReplaceAll className="rtl:-scale-x-100" />
                </InputGroupButton>
              }
            />
            <TooltipContent>{t.replaceAll}</TooltipContent>
          </Tooltip>
        </InputGroupAddon>
      </InputGroup>
      <div className="flex items-center justify-between gap-2">
        <span
          aria-live="polite"
          className={cn(
            "ps-1 text-xs whitespace-nowrap tabular-nums",
            regexError ? "text-destructive" : "text-muted-foreground",
          )}
        >
          {statusLabel}
        </span>
        <ButtonGroup>
          <Tooltip>
            <TooltipTrigger
              render={
                <Button
                  variant="outline"
                  size="icon-sm"
                  aria-label={t.previousMatch}
                  disabled={!canNavigate}
                  onClick={goToPrevious}
                >
                  <ChevronUp />
                </Button>
              }
            />
            <TooltipContent>{t.previousMatch}</TooltipContent>
          </Tooltip>
          <Tooltip>
            <TooltipTrigger
              render={
                <Button
                  variant="outline"
                  size="icon-sm"
                  aria-label={t.nextMatch}
                  disabled={!canNavigate}
                  onClick={goToNext}
                >
                  <ChevronDown />
                </Button>
              }
            />
            <TooltipContent>{t.nextMatch}</TooltipContent>
          </Tooltip>
        </ButtonGroup>
      </div>
    </div>,
    portalTarget,
  );
}

export const ReactFindReplaceExtension = defineExtension({
  name: "@shadcn-editor/react-find-replace",
  dependencies: [
    FindReplaceExtension,
    configExtension(ReactExtension, {
      decorators: [FindReplacePanel],
    }),
  ],
});
