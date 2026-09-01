import {
  $getNodeByKeyOrThrow,
  $getRoot,
  $isElementNode,
  $isLineBreakNode,
  $isTextNode,
  COMMAND_PRIORITY_LOW,
  CONTROL_OR_META,
  createCommand,
  defineExtension,
  isExactShortcutMatch,
  KEY_DOWN_COMMAND,
  type LexicalCommand,
  type LexicalEditor,
  type NodeKey,
} from "lexical";

import {
  computed,
  effect,
  namedSignals,
  watchedSignal,
} from "@lexical/extension";
import { createDOMRange, createRectsFromDOMRange } from "@lexical/selection";
import { $dfsWithSlotsIterator, mergeRegister } from "@lexical/utils";

const MATCH_HIGHLIGHT = "editor-find-match";
const CURRENT_MATCH_HIGHLIGHT = "editor-find-match-current";

export interface TextMatch {
  end: number;
  matchText: string;
  start: number;
}

interface OffsetEntry {
  globalEnd: number;
  globalStart: number;
  key: NodeKey;
}

interface MatchPoints {
  anchorKey: NodeKey;
  anchorOffset: number;
  focusKey: NodeKey;
  focusOffset: number;
  format: number;
}

function escapeRegExp(value: string): string {
  return value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

export function findMatches(
  text: string,
  searchTerm: string,
  caseSensitive: boolean,
  isRegex: boolean,
): TextMatch[] {
  if (!searchTerm || !text) {
    return [];
  }

  const pattern = isRegex ? searchTerm : escapeRegExp(searchTerm);
  const flags = "g" + (caseSensitive ? "" : "i");

  let regex: RegExp;
  try {
    regex = new RegExp(pattern, flags);
  } catch {
    return [];
  }

  const matches: TextMatch[] = [];
  let match: RegExpExecArray | null;
  while ((match = regex.exec(text)) !== null) {
    if (match[0].length === 0) {
      regex.lastIndex++;
      continue;
    }
    matches.push({
      end: match.index + match[0].length,
      matchText: match[0],
      start: match.index,
    });
  }
  return matches;
}

function expandReplacement(
  template: string,
  matchText: string,
  searchRegex: RegExp | null,
): string {
  if (!searchRegex) {
    return template;
  }
  return matchText.replace(searchRegex, template);
}

function buildSearchRegex(
  searchTerm: string,
  caseSensitive: boolean,
): RegExp | null {
  try {
    return new RegExp(searchTerm, caseSensitive ? "" : "i");
  } catch {
    return null;
  }
}

function $buildOffsetMap(): OffsetEntry[] {
  const entries: OffsetEntry[] = [];
  let offset = 0;
  let prevNonInlineDepth: number | null = null;

  for (const { node, depth } of $dfsWithSlotsIterator()) {
    if ($isElementNode(node) && !node.isInline() && depth > 0) {
      if (prevNonInlineDepth !== null && depth <= prevNonInlineDepth) {
        offset += 2;
      }
      prevNonInlineDepth = depth;
    }

    if ($isLineBreakNode(node)) {
      offset += 1;
    } else if ($isTextNode(node)) {
      const length = node.getTextContentSize();
      entries.push({
        globalEnd: offset + length,
        globalStart: offset,
        key: node.getKey(),
      });
      offset += length;
    }
  }

  return entries;
}

function findEntryForOffset(
  offsetMap: OffsetEntry[],
  offset: number,
): OffsetEntry | null {
  let lo = 0;
  let hi = offsetMap.length - 1;
  while (lo <= hi) {
    const mid = (lo + hi) >>> 1;
    const entry = offsetMap[mid];
    if (offset < entry.globalStart) {
      hi = mid - 1;
    } else if (offset >= entry.globalEnd) {
      lo = mid + 1;
    } else {
      return entry;
    }
  }
  return null;
}

function $resolveMatchToPoints(
  match: TextMatch,
  offsetMap: OffsetEntry[],
): MatchPoints | null {
  const anchorEntry = findEntryForOffset(offsetMap, match.start);
  const focusEntry = findEntryForOffset(offsetMap, match.end - 1);
  if (!anchorEntry || !focusEntry) {
    return null;
  }

  const anchorOffset = match.start - anchorEntry.globalStart;
  const focusOffset = match.end - focusEntry.globalStart;
  const isSingleNode = anchorEntry.key === focusEntry.key;
  const anchorNode = $getNodeByKeyOrThrow(anchorEntry.key);
  const format =
    isSingleNode && $isTextNode(anchorNode) ? anchorNode.getFormat() : 0;

  return {
    anchorKey: anchorEntry.key,
    anchorOffset,
    focusKey: focusEntry.key,
    focusOffset,
    format,
  };
}

function $replaceMatch(
  points: MatchPoints,
  replacementText: string,
  match: TextMatch,
  searchRegex: RegExp | null,
): void {
  const finalText = searchRegex
    ? expandReplacement(replacementText, match.matchText, searchRegex)
    : replacementText;
  const anchorNode = $getNodeByKeyOrThrow(points.anchorKey);
  const focusNode = $getNodeByKeyOrThrow(points.focusKey);
  if (!$isTextNode(anchorNode) || !$isTextNode(focusNode)) {
    return;
  }
  if (points.anchorKey === points.focusKey) {
    anchorNode.spliceText(
      points.anchorOffset,
      points.focusOffset - points.anchorOffset,
      finalText,
      true,
    );
    return;
  }
  const selection = anchorNode.select(0, 0);
  selection.setTextNodeRange(
    anchorNode,
    points.anchorOffset,
    focusNode,
    points.focusOffset,
  );
  selection.format = points.format;
  selection.insertText(finalText);
}

function $replaceAllMatches(
  matches: TextMatch[],
  offsetMap: OffsetEntry[],
  replacementText: string,
  searchRegex: RegExp | null,
): void {
  for (let index = matches.length - 1; index >= 0; index--) {
    const points = $resolveMatchToPoints(matches[index], offsetMap);
    if (points) {
      $replaceMatch(points, replacementText, matches[index], searchRegex);
    }
  }
}

const SUPPORTS_CSS_HIGHLIGHTS =
  typeof Highlight !== "undefined" &&
  typeof CSS !== "undefined" &&
  "highlights" in CSS;

interface HighlightState {
  allHighlight: Highlight | null;
  currentHighlight: Highlight | null;
  overlayContainer: HTMLDivElement | null;
  originalParentPosition: string | null;
}

function createHighlightState(): HighlightState {
  return {
    allHighlight: null,
    currentHighlight: null,
    originalParentPosition: null,
    overlayContainer: null,
  };
}

function ensureHighlightRegistered(state: HighlightState): void {
  if (state.allHighlight) {
    return;
  }
  state.allHighlight = new Highlight();
  state.currentHighlight = new Highlight();
  CSS.highlights.set(MATCH_HIGHLIGHT, state.allHighlight);
  CSS.highlights.set(CURRENT_MATCH_HIGHLIGHT, state.currentHighlight);
}

function disposeHighlightState(state: HighlightState): void {
  if (state.allHighlight) {
    state.allHighlight.clear();
    if (CSS.highlights.get(MATCH_HIGHLIGHT) === state.allHighlight) {
      CSS.highlights.delete(MATCH_HIGHLIGHT);
    }
    state.allHighlight = null;
  }
  if (state.currentHighlight) {
    state.currentHighlight.clear();
    if (
      CSS.highlights.get(CURRENT_MATCH_HIGHLIGHT) === state.currentHighlight
    ) {
      CSS.highlights.delete(CURRENT_MATCH_HIGHLIGHT);
    }
    state.currentHighlight = null;
  }
  if (state.overlayContainer) {
    if (state.originalParentPosition !== null) {
      const parent = state.overlayContainer.parentElement;
      if (parent) {
        parent.style.position = state.originalParentPosition;
      }
      state.originalParentPosition = null;
    }
    state.overlayContainer.remove();
    state.overlayContainer = null;
  }
}

function scrollRangeIntoView(range: Range): void {
  const element = range.startContainer.parentElement;
  element?.scrollIntoView({ behavior: "smooth", block: "nearest" });
}

function clearHighlights(state: HighlightState): void {
  state.allHighlight?.clear();
  state.currentHighlight?.clear();
  if (state.overlayContainer) {
    state.overlayContainer.innerHTML = "";
  }
}

function getOverlayContainer(
  editor: LexicalEditor,
  state: HighlightState,
): HTMLDivElement | null {
  if (state.overlayContainer) {
    return state.overlayContainer;
  }
  const root = editor.getRootElement();
  const parent = root?.parentElement;
  if (!root || !parent) {
    return null;
  }
  if (getComputedStyle(parent).position === "static") {
    state.originalParentPosition = parent.style.position;
    parent.style.position = "relative";
  }
  const container = root.ownerDocument.createElement("div");
  container.style.position = "absolute";
  container.style.top = "0";
  container.style.left = "0";
  container.style.pointerEvents = "none";
  parent.appendChild(container);
  state.overlayContainer = container;
  return container;
}

function $updateOverlayHighlights(
  editor: LexicalEditor,
  matches: TextMatch[],
  currentIndex: number,
  offsetMap: OffsetEntry[],
  state: HighlightState,
): void {
  const container = getOverlayContainer(editor, state);
  const rootElement = editor.getRootElement();
  if (!container || !rootElement) {
    return;
  }
  container.innerHTML = "";
  const doc = rootElement.ownerDocument;
  const containerRect = container.offsetParent
    ? container.offsetParent.getBoundingClientRect()
    : rootElement.getBoundingClientRect();

  for (let index = 0; index < matches.length; index++) {
    const points = $resolveMatchToPoints(matches[index], offsetMap);
    if (!points) {
      continue;
    }
    const range = createDOMRange(
      editor,
      $getNodeByKeyOrThrow(points.anchorKey),
      points.anchorOffset,
      $getNodeByKeyOrThrow(points.focusKey),
      points.focusOffset,
    );
    if (!range) {
      continue;
    }
    const isCurrent = index === currentIndex;
    if (isCurrent) {
      scrollRangeIntoView(range);
    }
    for (const rect of createRectsFromDOMRange(editor, range)) {
      const span = doc.createElement("span");
      span.className = isCurrent
        ? "editor-find-match-overlay editor-find-match-overlay-current"
        : "editor-find-match-overlay";
      span.style.top = `${rect.top - containerRect.top}px`;
      span.style.left = `${rect.left - containerRect.left}px`;
      span.style.width = `${rect.width}px`;
      span.style.height = `${rect.height}px`;
      container.appendChild(span);
    }
  }
}

function $updateHighlights(
  editor: LexicalEditor,
  matches: TextMatch[],
  currentIndex: number,
  state: HighlightState,
): void {
  clearHighlights(state);

  if (matches.length === 0 || !editor.getRootElement()) {
    return;
  }

  const offsetMap = $buildOffsetMap();

  if (!SUPPORTS_CSS_HIGHLIGHTS) {
    $updateOverlayHighlights(editor, matches, currentIndex, offsetMap, state);
    return;
  }

  ensureHighlightRegistered(state);
  for (let index = 0; index < matches.length; index++) {
    const points = $resolveMatchToPoints(matches[index], offsetMap);
    if (!points) {
      continue;
    }
    const range = createDOMRange(
      editor,
      $getNodeByKeyOrThrow(points.anchorKey),
      points.anchorOffset,
      $getNodeByKeyOrThrow(points.focusKey),
      points.focusOffset,
    );
    if (!range) {
      continue;
    }
    state.allHighlight!.add(range);
    if (index === currentIndex) {
      state.currentHighlight!.add(range);
      scrollRangeIntoView(range);
    }
  }
}

export const TOGGLE_FIND_REPLACE_COMMAND: LexicalCommand<void> = createCommand(
  "TOGGLE_FIND_REPLACE_COMMAND",
);

export const CLOSE_FIND_REPLACE_COMMAND: LexicalCommand<void> = createCommand(
  "CLOSE_FIND_REPLACE_COMMAND",
);

export const FIND_NEXT_COMMAND: LexicalCommand<void> =
  createCommand("FIND_NEXT_COMMAND");

export const FIND_PREV_COMMAND: LexicalCommand<void> =
  createCommand("FIND_PREV_COMMAND");

export const REPLACE_CURRENT_COMMAND: LexicalCommand<void> = createCommand(
  "REPLACE_CURRENT_COMMAND",
);

export const REPLACE_ALL_COMMAND: LexicalCommand<void> = createCommand(
  "REPLACE_ALL_COMMAND",
);

export const SET_SEARCH_TERM_COMMAND: LexicalCommand<string> = createCommand(
  "SET_SEARCH_TERM_COMMAND",
);

export const SET_REPLACE_TERM_COMMAND: LexicalCommand<string> = createCommand(
  "SET_REPLACE_TERM_COMMAND",
);

export const TOGGLE_CASE_SENSITIVE_COMMAND: LexicalCommand<void> =
  createCommand("TOGGLE_CASE_SENSITIVE_COMMAND");

export const TOGGLE_REGEX_COMMAND: LexicalCommand<void> = createCommand(
  "TOGGLE_REGEX_COMMAND",
);

export const FindReplaceExtension = defineExtension({
  name: "@shadcn-editor/find-replace",
  build: (editor) => {
    const named = namedSignals({
      caseSensitive: false,
      currentIndex: 0,
      isOpen: false,
      isRegex: false,
      replaceTerm: "",
      searchTerm: "",
    });

    const cachedText = watchedSignal(
      () => editor.read("latest", () => $getRoot().getTextContent()),
      (self) =>
        editor.registerTextContentListener((text) => {
          self.value = text;
        }),
    );

    const matches = computed(() => {
      if (!named.isOpen.value) {
        return [];
      }
      return findMatches(
        cachedText.value,
        named.searchTerm.value,
        named.caseSensitive.value,
        named.isRegex.value,
      );
    });

    const effectiveIndex = computed(() => {
      const length = matches.value.length;
      const index = named.currentIndex.value;
      return length > 0 ? Math.min(index, length - 1) : 0;
    });

    const regexError = computed(() => {
      if (!named.isRegex.value || !named.searchTerm.value) {
        return false;
      }
      try {
        RegExp(named.searchTerm.value);
        return false;
      } catch {
        return true;
      }
    });

    return { ...named, cachedText, effectiveIndex, matches, regexError };
  },
  register: (editor, _config, state) => {
    const output = state.getOutput();
    const highlightState = createHighlightState();

    return mergeRegister(
      editor.registerCommand(
        TOGGLE_FIND_REPLACE_COMMAND,
        () => {
          output.isOpen.value = !output.isOpen.peek();
          return true;
        },
        COMMAND_PRIORITY_LOW,
      ),

      editor.registerCommand(
        CLOSE_FIND_REPLACE_COMMAND,
        () => {
          output.isOpen.value = false;
          return true;
        },
        COMMAND_PRIORITY_LOW,
      ),

      editor.registerCommand(
        FIND_NEXT_COMMAND,
        () => {
          const length = output.matches.peek().length;
          if (length > 0) {
            output.currentIndex.value =
              (output.effectiveIndex.peek() + 1) % length;
          }
          return true;
        },
        COMMAND_PRIORITY_LOW,
      ),

      editor.registerCommand(
        FIND_PREV_COMMAND,
        () => {
          const length = output.matches.peek().length;
          if (length > 0) {
            output.currentIndex.value =
              (output.effectiveIndex.peek() - 1 + length) % length;
          }
          return true;
        },
        COMMAND_PRIORITY_LOW,
      ),

      editor.registerCommand(
        REPLACE_CURRENT_COMMAND,
        () => {
          const currentMatches = output.matches.peek();
          if (currentMatches.length === 0 || !editor.isEditable()) {
            return true;
          }
          const index = output.effectiveIndex.peek();
          const replaceText = output.replaceTerm.peek();
          const regex = output.isRegex.peek()
            ? buildSearchRegex(
                output.searchTerm.peek(),
                output.caseSensitive.peek(),
              )
            : null;
          editor.update(
            () => {
              const offsetMap = $buildOffsetMap();
              const points = $resolveMatchToPoints(
                currentMatches[index],
                offsetMap,
              );
              if (points) {
                $replaceMatch(
                  points,
                  replaceText,
                  currentMatches[index],
                  regex,
                );
              }
            },
            { discrete: true },
          );
          return true;
        },
        COMMAND_PRIORITY_LOW,
      ),

      editor.registerCommand(
        REPLACE_ALL_COMMAND,
        () => {
          const currentMatches = output.matches.peek();
          if (currentMatches.length === 0 || !editor.isEditable()) {
            return true;
          }
          const replaceText = output.replaceTerm.peek();
          const regex = output.isRegex.peek()
            ? buildSearchRegex(
                output.searchTerm.peek(),
                output.caseSensitive.peek(),
              )
            : null;
          editor.update(
            () => {
              const offsetMap = $buildOffsetMap();
              $replaceAllMatches(currentMatches, offsetMap, replaceText, regex);
            },
            { discrete: true },
          );
          return true;
        },
        COMMAND_PRIORITY_LOW,
      ),

      editor.registerCommand(
        SET_SEARCH_TERM_COMMAND,
        (term) => {
          output.searchTerm.value = term;
          output.currentIndex.value = 0;
          return true;
        },
        COMMAND_PRIORITY_LOW,
      ),

      editor.registerCommand(
        SET_REPLACE_TERM_COMMAND,
        (term) => {
          output.replaceTerm.value = term;
          return true;
        },
        COMMAND_PRIORITY_LOW,
      ),

      editor.registerCommand(
        TOGGLE_CASE_SENSITIVE_COMMAND,
        () => {
          output.caseSensitive.value = !output.caseSensitive.peek();
          output.currentIndex.value = 0;
          return true;
        },
        COMMAND_PRIORITY_LOW,
      ),

      editor.registerCommand(
        TOGGLE_REGEX_COMMAND,
        () => {
          output.isRegex.value = !output.isRegex.peek();
          output.currentIndex.value = 0;
          return true;
        },
        COMMAND_PRIORITY_LOW,
      ),

      editor.registerCommand(
        KEY_DOWN_COMMAND,
        (event) => {
          if (
            isExactShortcutMatch(event, "f", CONTROL_OR_META) ||
            isExactShortcutMatch(event, "f", { altKey: true, metaKey: true })
          ) {
            event.preventDefault();
            editor.dispatchCommand(TOGGLE_FIND_REPLACE_COMMAND, undefined);
            return true;
          }
          if (output.isOpen.peek()) {
            if (
              isExactShortcutMatch(event, "g", CONTROL_OR_META) ||
              isExactShortcutMatch(event, "g", {
                ...CONTROL_OR_META,
                shiftKey: true,
              })
            ) {
              event.preventDefault();
              editor.dispatchCommand(
                event.shiftKey ? FIND_PREV_COMMAND : FIND_NEXT_COMMAND,
                undefined,
              );
              return true;
            }
          }
          return false;
        },
        COMMAND_PRIORITY_LOW,
      ),

      effect(() => {
        const currentMatches = output.matches.value;
        const index = output.effectiveIndex.value;
        const open = output.isOpen.value;

        clearHighlights(highlightState);
        if (!open || currentMatches.length === 0) {
          return;
        }
        editor.read(() => {
          $updateHighlights(editor, currentMatches, index, highlightState);
        });
      }),

      () => disposeHighlightState(highlightState),
    );
  },
});
