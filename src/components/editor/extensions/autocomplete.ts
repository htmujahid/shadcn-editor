import {
  $getNodeByKey,
  $getSelection,
  $isRangeSelection,
  $isTextNode,
  $setCompositionKey,
  type BaseSelection,
  BLUR_COMMAND,
  COMMAND_PRIORITY_LOW,
  COMPOSITION_END_TAG,
  COMPOSITION_START_COMMAND,
  defineExtension,
  type EditorState,
  getActiveElement,
  isHTMLElement,
  KEY_ARROW_RIGHT_COMMAND,
  KEY_TAB_COMMAND,
  type LexicalEditor,
  mergeRegister,
  type NodeKey,
  registerEventListener,
  safeCast,
  setDOMUnmanaged,
} from "lexical";

import {
  effect,
  IMEExtension,
  namedSignals,
  RootElementExtension,
  shallowMergeConfig,
  WatchEditableExtension,
} from "@lexical/extension";
import { $isAtNodeEnd } from "@lexical/selection";

import { locales } from "@/components/editor/locales";
import type { Language } from "@/components/editor/plugins/i18n-plugin";

export interface AutocompleteDictionary {
  readonly minPrefixLength: number;
  query(prefix: string): null | string;
}

export interface WordlistDictionaryOptions {
  minPrefixLength?: number;
  caseSensitive?: boolean;
}

export function createWordlistDictionary(
  words: readonly string[],
  options: WordlistDictionaryOptions = {},
): AutocompleteDictionary {
  const { minPrefixLength = 2, caseSensitive = false } = options;
  const fold = (text: string): string =>
    caseSensitive ? text : text.toLowerCase();
  const folded = words.map(fold);
  const order = Uint32Array.from(
    words
      .map((_, index) => index)
      .sort((a, b) =>
        folded[a] < folded[b] ? -1 : folded[a] > folded[b] ? 1 : a - b,
      ),
  );
  return {
    minPrefixLength,
    query(prefix: string): null | string {
      if (prefix.length < minPrefixLength) {
        return null;
      }
      const needle = fold(prefix);
      let lo = 0;
      let hi = order.length;
      while (lo < hi) {
        const mid = (lo + hi) >>> 1;
        if (fold(words[order[mid]]) < needle) {
          lo = mid + 1;
        } else {
          hi = mid;
        }
      }
      let bestIndex = -1;
      let bestWord: string | null = null;
      for (let k = lo; k < order.length; k++) {
        const index = order[k];
        const word = words[index];
        if (!fold(word).startsWith(needle)) {
          break;
        }
        if (
          word.length > prefix.length &&
          (bestIndex === -1 || index < bestIndex)
        ) {
          bestIndex = index;
          bestWord = word;
        }
      }
      return bestWord === null ? null : bestWord.substring(prefix.length);
    },
  };
}

function isArabic(cp: number): boolean {
  return (
    (cp >= 0x0600 && cp <= 0x06ff) ||
    (cp >= 0x0750 && cp <= 0x077f) ||
    (cp >= 0x08a0 && cp <= 0x08ff) ||
    (cp >= 0xfb50 && cp <= 0xfdff) ||
    (cp >= 0xfe70 && cp <= 0xfeff)
  );
}

function isHebrew(cp: number): boolean {
  return (cp >= 0x0590 && cp <= 0x05ff) || (cp >= 0xfb1d && cp <= 0xfb4f);
}

function isZeroWidthOrControl(cp: number): boolean {
  return (
    cp < 0x20 ||
    (cp >= 0x200b && cp <= 0x200f) ||
    (cp >= 0x202a && cp <= 0x202e) ||
    cp === 0xfeff
  );
}

export function detectLanguage(text: string): string {
  const codePoints = Array.from(text);
  for (let i = codePoints.length - 1; i >= 0; i--) {
    const cp = codePoints[i].codePointAt(0);
    if (cp === undefined || isZeroWidthOrControl(cp)) {
      continue;
    }
    if (isArabic(cp)) {
      return "ar";
    }
    if (isHebrew(cp)) {
      return "he";
    }
    return "en";
  }
  return "en";
}

export type AutocompleteDictionaryLoader =
  () => Promise<AutocompleteDictionary>;

export const defaultDictionaries: Readonly<
  Record<string, AutocompleteDictionaryLoader>
> = {
  ar: () =>
    import("@/components/editor/dictionaries/arabic").then(({ ARABIC_WORDS }) =>
      createWordlistDictionary(ARABIC_WORDS),
    ),
  en: () =>
    import("@/components/editor/dictionaries/english").then(
      ({ ENGLISH_WORDS }) =>
        createWordlistDictionary(ENGLISH_WORDS, { minPrefixLength: 4 }),
    ),
  he: () =>
    import("@/components/editor/dictionaries/hebrew").then(({ HEBREW_WORDS }) =>
      createWordlistDictionary(HEBREW_WORDS),
    ),
};

const DEFAULT_COMPOSITION_IDLE_DEBOUNCE_MS = 200;

const QUERY_LATENCY_MS = 200;

const AUTOCOMPLETE_GHOST_ATTR = "data-autocomplete-ghost";

function $search(selection: null | BaseSelection): [boolean, string] {
  if (!$isRangeSelection(selection) || !selection.isCollapsed()) {
    return [false, ""];
  }
  const node = selection.getNodes()[0];
  const anchor = selection.anchor;
  if (!$isTextNode(node) || !node.isSimpleText() || !$isAtNodeEnd(anchor)) {
    return [false, ""];
  }
  const word = [];
  const text = node.getTextContent();
  let i = node.getTextContentSize();
  let c;
  while (i-- && i >= 0 && (c = text[i]) !== " ") {
    word.push(c);
  }
  if (word.length === 0) {
    return [false, ""];
  }
  return [true, word.reverse().join("")];
}

function query(
  dictionaryPromise: Promise<AutocompleteDictionary | undefined>,
  searchText: string,
  signal: AbortSignal,
): Promise<null | string> {
  return new Promise((resolve, reject) => {
    if (signal.aborted) {
      reject(signal.reason);
      return;
    }
    const onAbort = () => {
      clearTimeout(timeout);
      reject(signal.reason);
    };
    const timeout = setTimeout(async () => {
      signal.removeEventListener("abort", onAbort);
      let dictionary: AutocompleteDictionary | undefined;
      try {
        dictionary = await dictionaryPromise;
      } catch (e) {
        reject(e);
        return;
      }
      if (signal.aborted) {
        reject(signal.reason);
        return;
      }
      if (dictionary === undefined) {
        resolve(null);
        return;
      }
      resolve(dictionary.query(searchText));
    }, QUERY_LATENCY_MS);
    signal.addEventListener("abort", onAbort, { once: true });
  });
}

export function extractTrailingWord(text: string): string {
  const trimmed = text.replace(/\s+$/u, "");
  const match = trimmed.match(/\S+$/u);
  return match === null ? "" : match[0];
}

export function getCompositionTextFromDOM(dom: HTMLElement): string {
  let text = "";
  for (const node of dom.childNodes) {
    if (node.nodeType === Node.TEXT_NODE) {
      text += node.textContent ?? "";
    } else if (
      isHTMLElement(node) &&
      !node.hasAttribute(AUTOCOMPLETE_GHOST_ATTR)
    ) {
      text += node.textContent ?? "";
    }
  }
  return text.replace(/[\u200B-\u200D\uFEFF]/g, "");
}

function formatSuggestionText(
  suggestion: string,
  rootElem: HTMLElement | null,
): string {
  const userAgentData = (
    window.navigator as Navigator & { userAgentData?: { mobile: boolean } }
  ).userAgentData;
  const isMobile =
    userAgentData !== undefined
      ? userAgentData.mobile
      : window.innerWidth <= 800 && window.innerHeight <= 600;

  if (!isMobile) {
    return `${suggestion} (TAB)`;
  }
  const lang = rootElem?.closest<HTMLElement>("[lang]")?.lang ?? "en";
  const isRTL =
    rootElem !== null && getComputedStyle(rootElem).direction === "rtl";
  const swipeWord = (locales[lang as Language] ?? locales.en).autocompleteSwipe;
  return `${suggestion} (${swipeWord} ${isRTL ? "⬅" : "⮕"})`;
}

function syncGhost(
  editor: LexicalEditor,
  textNodeKey: NodeKey | null,
  ghostText: string | null,
): void {
  const root = editor.getRootElement();
  if (root) {
    for (const el of root.querySelectorAll(`[${AUTOCOMPLETE_GHOST_ATTR}]`)) {
      el.remove();
    }
  }
  if (textNodeKey === null || ghostText === null) {
    return;
  }
  const dom = editor.getElementByKey(textNodeKey);
  if (!dom) {
    return;
  }
  const ghost = dom.ownerDocument.createElement("span");
  ghost.setAttribute(AUTOCOMPLETE_GHOST_ATTR, "true");
  ghost.setAttribute("contenteditable", "false");
  ghost.className = editor._config.theme.autocomplete || "";
  ghost.textContent = ghostText;
  setDOMUnmanaged(ghost);
  dom.appendChild(ghost);
}

function addSwipeRightListener(
  element: HTMLElement,
  cb: (force: number, e: TouchEvent) => void,
): () => void {
  let start: [number, number] | null = null;
  const readTouch = (e: TouchEvent): [number, number] | null => {
    const touch = e.changedTouches[0];
    return touch === undefined ? null : [touch.clientX, touch.clientY];
  };
  const handleTouchstart = (e: TouchEvent) => {
    start = readTouch(e);
  };
  const handleTouchend = (e: TouchEvent) => {
    if (start === null) {
      return;
    }
    const end = readTouch(e);
    if (end !== null) {
      const isRTL = getComputedStyle(element).direction === "rtl";
      const x = end[0] - start[0];
      const y = end[1] - start[1];
      const forward = isRTL ? -x : x;
      if (forward > 0 && forward > Math.abs(y)) {
        cb(forward, e);
      }
    }
  };
  element.addEventListener("touchstart", handleTouchstart);
  element.addEventListener("touchend", handleTouchend);
  return () => {
    element.removeEventListener("touchstart", handleTouchstart);
    element.removeEventListener("touchend", handleTouchend);
  };
}

export interface AutocompleteConfig {
  disabled: boolean;
  dictionaries: Readonly<Record<string, AutocompleteDictionaryLoader>>;
  detectLanguage: (text: string) => string;
  compositionIdleDebounceMs: number;
}

function mergeAutocompleteConfig(
  config: AutocompleteConfig,
  overrides: Partial<AutocompleteConfig>,
): AutocompleteConfig {
  const merged = shallowMergeConfig(config, overrides);
  if (overrides.dictionaries) {
    merged.dictionaries = {
      ...config.dictionaries,
      ...overrides.dictionaries,
    };
  }
  return merged;
}

export const AutocompleteExtension = defineExtension({
  name: "@shadcn-editor/editor/Autocomplete",
  build: (_editor, config) => namedSignals(config),
  config: safeCast<AutocompleteConfig>({
    compositionIdleDebounceMs: DEFAULT_COMPOSITION_IDLE_DEBOUNCE_MS,
    detectLanguage,
    dictionaries: defaultDictionaries,
    disabled: false,
  }),
  dependencies: [IMEExtension, RootElementExtension, WatchEditableExtension],
  mergeConfig: mergeAutocompleteConfig,
  register: (editor: LexicalEditor, _config, state) => {
    const ime = state.getDependency(IMEExtension).output;
    const editableSignal = state.getDependency(WatchEditableExtension).output;
    const rootElemSignal = state.getDependency(RootElementExtension).output;
    let activeTextNodeKey: NodeKey | null = null;
    let lastMatch: string | null = null;
    let lastSuggestion: string | null = null;
    let searchController: AbortController | null = null;
    let pendingCompositionTimer: number | null = null;
    const dictionaryCache = new Map<
      AutocompleteDictionaryLoader,
      Promise<AutocompleteDictionary>
    >();

    function loadDictionary(
      loader: AutocompleteDictionaryLoader | undefined,
    ): Promise<AutocompleteDictionary | undefined> {
      if (loader === undefined) {
        return Promise.resolve(undefined);
      }
      let cached = dictionaryCache.get(loader);
      if (cached === undefined) {
        cached = loader();
        dictionaryCache.set(loader, cached);
      }
      return cached;
    }

    function clearPendingCompositionTimer() {
      if (pendingCompositionTimer !== null) {
        clearTimeout(pendingCompositionTimer);
        pendingCompositionTimer = null;
      }
    }

    function isEditorFocused(): boolean {
      const rootElem = editor.getRootElement();
      const active = rootElem ? getActiveElement(rootElem) : null;
      return rootElem != null && active != null && rootElem.contains(active);
    }

    function dismiss() {
      activeTextNodeKey = null;
      lastMatch = null;
      lastSuggestion = null;
      if (searchController !== null) {
        searchController.abort();
        searchController = null;
      }
      syncGhost(editor, null, null);
    }

    function tryCompositionSuggestion() {
      pendingCompositionTimer = null;
      const composingNode = ime.composingTextNode.value;
      if (composingNode === null) {
        return;
      }
      const composingKey = composingNode.getKey();
      const dom = editor.getElementByKey(composingKey);
      if (dom === null) {
        return;
      }
      const text = getCompositionTextFromDOM(dom);
      if (text.length === 0) {
        return;
      }
      const prefix = extractTrailingWord(text);
      if (prefix.length === 0 || prefix === lastMatch) {
        return;
      }
      if (searchController !== null) {
        searchController.abort();
      }
      syncGhost(editor, null, null);
      lastMatch = prefix;
      lastSuggestion = null;
      activeTextNodeKey = null;
      const controller = new AbortController();
      searchController = controller;
      const language = output.detectLanguage.value(prefix);
      query(
        loadDictionary(output.dictionaries.value[language]),
        prefix,
        controller.signal,
      )
        .then((newSuggestion) => {
          applyCompositionSuggestion(
            controller,
            composingKey,
            prefix,
            newSuggestion,
          );
        })
        .catch((e) => {
          if (!(e instanceof DOMException && e.name === "AbortError")) {
            console.error(e);
          }
        });
    }

    function applyCompositionSuggestion(
      refController: AbortController,
      composingKey: NodeKey,
      prefix: string,
      newSuggestion: string | null,
    ) {
      const composingNode = ime.composingTextNode.value;
      if (
        searchController !== refController ||
        newSuggestion === null ||
        composingNode === null ||
        composingNode.getKey() !== composingKey
      ) {
        return;
      }
      const dom = editor.getElementByKey(composingKey);
      if (dom === null) {
        return;
      }
      if (extractTrailingWord(getCompositionTextFromDOM(dom)) !== prefix) {
        return;
      }
      activeTextNodeKey = composingKey;
      lastSuggestion = newSuggestion;
      syncGhost(
        editor,
        composingKey,
        formatSuggestionText(newSuggestion, editor.getRootElement()),
      );
    }

    function onCompositionUpdateDOM() {
      const debounceMs = output.compositionIdleDebounceMs.value;
      if (debounceMs <= 0) {
        return;
      }
      clearPendingCompositionTimer();
      pendingCompositionTimer = window.setTimeout(
        tryCompositionSuggestion,
        debounceMs,
      );
    }

    function onCompositionEndDOM() {
      clearPendingCompositionTimer();
      Promise.resolve().then(() => {
        handleUpdate({
          editorState: editor.getEditorState(),
          tags: new Set([COMPOSITION_END_TAG]),
        });
      });
    }

    function applyAsyncSuggestion(
      refController: AbortController,
      newSuggestion: string | null,
    ) {
      if (searchController !== refController || newSuggestion === null) {
        return;
      }
      if (!isEditorFocused()) {
        return;
      }
      editor.read("latest", () => {
        const selection = $getSelection();
        const [hasMatch, match] = $search(selection);
        if (!hasMatch || match !== lastMatch || !$isRangeSelection(selection)) {
          return;
        }
        const node = selection.getNodes()[0];
        if (!$isTextNode(node)) {
          return;
        }
        activeTextNodeKey = node.getKey();
        lastSuggestion = newSuggestion;
        syncGhost(
          editor,
          activeTextNodeKey,
          formatSuggestionText(newSuggestion, editor.getRootElement()),
        );
      });
    }

    function handleUpdate({
      editorState,
      tags,
    }: {
      editorState: EditorState;
      tags: Set<string>;
    }) {
      if (!isEditorFocused()) {
        dismiss();
        return;
      }
      if (!tags.has(COMPOSITION_END_TAG) && editor.isComposing()) {
        return;
      }
      editorState.read(
        () => {
          const selection = $getSelection();
          const [hasMatch, match] = $search(selection);
          if (!hasMatch) {
            dismiss();
            return;
          }
          if (match === lastMatch) {
            if ($isRangeSelection(selection)) {
              const node = selection.getNodes()[0];
              if ($isTextNode(node)) {
                const key = node.getKey();
                if (key !== activeTextNodeKey) {
                  activeTextNodeKey = key;
                  syncGhost(
                    editor,
                    activeTextNodeKey,
                    lastSuggestion
                      ? formatSuggestionText(
                          lastSuggestion,
                          editor.getRootElement(),
                        )
                      : null,
                  );
                }
              }
            }
            return;
          }
          if (searchController !== null) {
            searchController.abort();
          }
          syncGhost(editor, null, null);
          lastMatch = match;
          lastSuggestion = null;
          activeTextNodeKey = null;
          const controller = new AbortController();
          searchController = controller;
          const language = output.detectLanguage.value(match);
          query(
            loadDictionary(output.dictionaries.value[language]),
            match,
            controller.signal,
          )
            .then((newSuggestion) => {
              applyAsyncSuggestion(controller, newSuggestion);
            })
            .catch((e) => {
              if (!(e instanceof DOMException && e.name === "AbortError")) {
                console.error(e);
              }
            });
        },
        { editor },
      );
    }

    function $commitSuggestion(): boolean {
      if (activeTextNodeKey === null || lastSuggestion === null) {
        return false;
      }
      const node = $getNodeByKey(activeTextNodeKey);
      if (!$isTextNode(node)) {
        dismiss();
        return false;
      }
      const composingNode = ime.composingTextNode.value;
      if (
        composingNode !== null &&
        composingNode.getKey() === activeTextNodeKey
      ) {
        const dom = editor.getElementByKey(activeTextNodeKey);
        if (dom !== null) {
          const liveText = getCompositionTextFromDOM(dom);
          const fullText = liveText + lastSuggestion;
          node.setTextContent(fullText);
          $setCompositionKey(null);
          node.select();
          dismiss();
          return true;
        }
      }
      node.spliceText(node.getTextContentSize(), 0, lastSuggestion, true);
      dismiss();
      return true;
    }

    function $handleCommitCommand(event: Event): boolean {
      const didCommit = $commitSuggestion();
      if (didCommit) {
        event.preventDefault();
      }
      return didCommit;
    }

    function handleSwipeRight(_force: number, event: TouchEvent) {
      let didCommit = false;
      editor.update(
        () => {
          didCommit = $commitSuggestion();
        },
        { discrete: true },
      );
      if (didCommit) {
        event.preventDefault();
      }
    }

    const output = state.getOutput();
    return effect(() => {
      const rootElem = rootElemSignal.value;
      const editable = editableSignal.value;
      if (output.disabled.value || !rootElem || !editable) {
        return;
      }
      for (const loader of Object.values(output.dictionaries.value)) {
        loadDictionary(loader);
      }
      return mergeRegister(
        registerEventListener(
          rootElem,
          "compositionupdate",
          onCompositionUpdateDOM,
        ),
        registerEventListener(rootElem, "compositionend", onCompositionEndDOM),
        editor.registerUpdateListener(handleUpdate),
        editor.registerCommand(
          BLUR_COMMAND,
          () => {
            dismiss();
            return false;
          },
          COMMAND_PRIORITY_LOW,
        ),
        editor.registerCommand(
          COMPOSITION_START_COMMAND,
          () => {
            dismiss();
            return false;
          },
          COMMAND_PRIORITY_LOW,
        ),
        editor.registerCommand(
          KEY_TAB_COMMAND,
          $handleCommitCommand,
          COMMAND_PRIORITY_LOW,
        ),
        editor.registerCommand(
          KEY_ARROW_RIGHT_COMMAND,
          $handleCommitCommand,
          COMMAND_PRIORITY_LOW,
        ),
        addSwipeRightListener(rootElem, handleSwipeRight),
        clearPendingCompositionTimer,
        dismiss,
      );
    });
  },
});
