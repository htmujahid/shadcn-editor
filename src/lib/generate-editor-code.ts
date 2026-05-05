import type { BlockViewerContextType } from "@/components/block-viewer-provider";

import {
  BASE_SPEC,
  FEATURE_REGISTRY,
  type FeatureSpec,
  type PluginSlot,
} from "./editor-feature-registry";

// ─── Merge types ─────────────────────────────────────────────────────────────

type MergedArtifacts = {
  /** source → Set of regular specifiers */
  imports: Map<string, Set<string>>;
  /** source → Set of type-only specifiers */
  typeImports: Map<string, Set<string>>;
  /** Ordered, deduplicated extension strings */
  extensions: string[];
  /** Ordered, deduplicated node class names */
  nodes: string[];
  /** JSX lines per slot, deduplicated */
  plugins: Record<PluginSlot, string[]>;
};

function emptyMerged(): MergedArtifacts {
  return {
    imports: new Map(),
    typeImports: new Map(),
    extensions: [],
    nodes: [],
    plugins: {
      toolbar_start: [],
      toolbar_font: [],
      toolbar_insert: [],
      content: [],
      floating: [],
      footer_left: [],
      footer_center: [],
      footer_right: [],
    },
  };
}

// ─── Merging ─────────────────────────────────────────────────────────────────

function mergeSpec(merged: MergedArtifacts, spec: FeatureSpec): void {
  // Imports: group by source, merge specifiers into Sets (automatic dedup)
  for (const imp of spec.imports ?? []) {
    if (!merged.imports.has(imp.source)) {
      merged.imports.set(imp.source, new Set());
    }
    for (const s of imp.specifiers ?? []) {
      merged.imports.get(imp.source)!.add(s);
    }

    if (imp.typeSpecifiers?.length) {
      if (!merged.typeImports.has(imp.source)) {
        merged.typeImports.set(imp.source, new Set());
      }
      for (const s of imp.typeSpecifiers) {
        merged.typeImports.get(imp.source)!.add(s);
      }
    }
  }

  // Extensions: preserve first-seen order, deduplicate by exact string
  for (const ext of spec.extensions ?? []) {
    if (!merged.extensions.includes(ext)) {
      merged.extensions.push(ext);
    }
  }

  // Nodes: same strategy
  for (const node of spec.nodes ?? []) {
    if (!merged.nodes.includes(node)) {
      merged.nodes.push(node);
    }
  }

  // Plugins: per-slot, deduplicate by exact JSX string
  for (const [slot, lines] of Object.entries(spec.plugins ?? {})) {
    const s = slot as PluginSlot;
    for (const line of lines ?? []) {
      if (!merged.plugins[s].includes(line)) {
        merged.plugins[s].push(line);
      }
    }
  }
}

// ─── Active condition keys ────────────────────────────────────────────────────

function getActiveKeys(state: BlockViewerContextType): string[] {
  const keys: string[] = [];
  const push = (category: string, record: Record<string, boolean>) => {
    for (const [key, val] of Object.entries(record)) {
      if (val) keys.push(`${category}.${key}`);
    }
  };
  push("toolbarItems", state.toolbarItems);
  push("footerItems", state.footerItems);
  push("pluginItems", state.pluginItems);
  push("blockFormatItems", state.blockFormatItems);
  push("blockInsertItems", state.blockInsertItems);
  push("componentPickerItems", state.componentPickerItems);
  return keys;
}

// ─── Import line rendering ────────────────────────────────────────────────────

/** Sort: external packages before @/ internal, then alphabetically within each group. */
function sortedSources(sources: Iterable<string>): string[] {
  const arr = [...sources];
  return arr.sort((a, b) => {
    const aInternal = a.startsWith("@/");
    const bInternal = b.startsWith("@/");
    if (aInternal !== bInternal) return aInternal ? 1 : -1;
    return a.localeCompare(b);
  });
}

function renderImportLines(merged: MergedArtifacts): string {
  const allSources = new Set([...merged.imports.keys(), ...merged.typeImports.keys()]);
  const lines: string[] = [];
  let lastWasExternal = true;

  for (const source of sortedSources(allSources)) {
    const isInternal = source.startsWith("@/");

    // Blank line between external and internal groups
    if (isInternal && lastWasExternal && lines.length > 0) {
      lines.push("");
    }
    lastWasExternal = !isInternal;

    const regular = [...(merged.imports.get(source) ?? [])].sort();
    const typed = [...(merged.typeImports.get(source) ?? [])].sort();

    const parts = [
      ...typed.map((s) => `type ${s}`),
      ...regular,
    ];

    if (parts.length === 0) continue;

    const body = parts.join(", ");
    lines.push(`import { ${body} } from "${source}";`);
  }

  return lines.join("\n");
}

// ─── Indentation helper ───────────────────────────────────────────────────────

function indent(code: string, spaces: number): string {
  const pad = " ".repeat(spaces);
  return code
    .split("\n")
    .map((line) => (line.trim() === "" ? "" : pad + line))
    .join("\n");
}

function renderSlot(merged: MergedArtifacts, slot: PluginSlot, spaces: number): string {
  return merged.plugins[slot].map((line) => indent(line, spaces)).join("\n");
}

// ─── Template ─────────────────────────────────────────────────────────────────

function renderCode(merged: MergedArtifacts, flags: GeneratorFlags): string {
  const {
    hasCharCount,
    hasCodeBlock,
    hasLink,
    needsAnchorElem,
    hasBlockInsert,
    hasToolbarFontSection,
  } = flags;

  const importSection = renderImportLines(merged);

  const extensionLines = merged.extensions
    .map((e) => indent(e + ",", 10))
    .join("\n");

  const nodeLines = merged.nodes
    .map((n) => `          ${n},`)
    .join("\n");

  // Toolbar slots
  const toolbarStart = renderSlot(merged, "toolbar_start", 18);
  const toolbarFont = renderSlot(merged, "toolbar_font", 20);
  // const toolbarInsert = renderSlot(merged, "toolbar_insert", 20);

  // Toolbar inner: font section + optional block-insert
  const toolbarFontBlock = hasToolbarFontSection
    ? [
        toolbarFont,
        hasBlockInsert
          ? indent(
              `<BlockInsertPlugin>\n${renderSlot(merged, "toolbar_insert", 2)}\n</BlockInsertPlugin>`,
              20,
            )
          : "",
      ]
        .filter(Boolean)
        .join("\n")
    : "";

  // code-language check only when codeBlock format is active
  const toolbarInner = hasCodeBlock
    ? `                  {blockType === "code" ? (
                    <CodeLanguageToolbarPlugin />
                  ) : (
                    <>
${toolbarFontBlock}
                    </>
                  )}`
    : toolbarFontBlock
      ? `                  <>
${toolbarFontBlock}
                  </>`
      : "";

  const toolbarSection = `            <ToolbarPlugin>
              {({ blockType }) => (
                <div className="vertical-align-middle sticky top-0 z-10 flex items-center gap-2 overflow-auto border-b p-1">
${toolbarStart}${toolbarStart && toolbarInner ? "\n" : ""}${toolbarInner}
                </div>
              )}
            </ToolbarPlugin>`;

  // Content + floating
  const contentPlugins = renderSlot(merged, "content", 14);
  const floatingPlugins = renderSlot(merged, "floating", 14);

  const refAttr = needsAnchorElem ? " ref={onRef}" : "";
  const placeholderPad = `pl-4`;

  // Footer
  const footerLeft = renderSlot(merged, "footer_left", 18);
  const footerCenter = renderSlot(merged, "footer_center", 16);
  const footerRight = renderSlot(merged, "footer_right", 18);

  return `${importSection}

const placeholder = "Press / for commands...";${hasCharCount ? "\nconst maxLength = 30;" : ""}

export function Editor({
  editorState,
  editorSerializedState,
  onChange,
  onSerializedChange,
}: {
  editorState?: EditorState;
  editorSerializedState?: SerializedEditorState;
  onChange?: (editorState: EditorState) => void;
  onSerializedChange?: (editorSerializedState: SerializedEditorState) => void;
}) {${
    needsAnchorElem
      ? `
  const [floatingAnchorElem, setFloatingAnchorElem] =
    useState<HTMLDivElement | null>(null);`
      : ""
  }${
    hasLink
      ? `
  const [isLinkEditMode, setIsLinkEditMode] = useState<boolean>(false);`
      : ""
  }${
    needsAnchorElem
      ? `

  const onRef = (_floatingAnchorElem: HTMLDivElement) => {
    if (_floatingAnchorElem !== null) {
      setFloatingAnchorElem(_floatingAnchorElem);
    }
  };`
      : ""
  }

  const AppExtension = useMemo(
    () =>
      defineExtension({
        dependencies: [
${extensionLines}
        ],
        name: "@shadcn-editor",
        namespace: "Playground",
        nodes: [
${nodeLines}
        ],
        $initialEditorState(editor) {
          if (editorSerializedState) {
            editor.parseEditorState(editorSerializedState);
          } else if (editorState) {
            editor.setEditorState(editorState);
          }
        },
        theme: editorTheme,
      }),
    [editorState, editorSerializedState],
  );

  return (
    <div className="bg-background overflow-hidden rounded-lg border shadow w-full">
      <LexicalExtensionComposer extension={AppExtension} contentEditable={null}>
        <TooltipProvider>
          <div className="relative">
${toolbarSection}
            <div className="relative">
              <div className="">
                <div className=""${refAttr}>
                  <ContentEditable
                    placeholder={placeholder}
                    className="h-[calc(100vh-141px)] ${placeholderPad}"
                  />
                </div>
              </div>
${contentPlugins}${floatingPlugins ? `\n${floatingPlugins}` : ""}
            </div>
            <ActionsPlugin>
              <div className="clear-both flex items-center justify-between gap-2 overflow-auto border-t p-1">
                <div className="flex flex-1 justify-start text-xs text-gray-500">
${footerLeft}
                </div>
                <div>
${footerCenter}
                </div>
                <div className="flex flex-1 justify-end">
${footerRight}
                </div>
              </div>
            </ActionsPlugin>
          </div>

          <OnChangePlugin
            ignoreSelectionChange={true}
            onChange={(editorState) => {
              onChange?.(editorState);
              onSerializedChange?.(editorState.toJSON());
            }}
          />
        </TooltipProvider>
      </LexicalExtensionComposer>
    </div>
  );
}`;
}

// ─── Flags ────────────────────────────────────────────────────────────────────

type GeneratorFlags = {
  hasCharCount: boolean;
  hasCodeBlock: boolean;
  hasLink: boolean;
  needsAnchorElem: boolean;
  hasBlockInsert: boolean;
  hasToolbarFontSection: boolean;
};

function computeFlags(
  activeKeys: string[],
  merged: MergedArtifacts,
): GeneratorFlags {
  const has = (key: string) => activeKeys.includes(key);
  const hasAnyFloating = merged.plugins.floating.length > 0;
  const hasLink = has("toolbarItems.link") || has("pluginItems.floatingLinkToolbar");

  return {
    hasCharCount: has("footerItems.characterCount"),
    hasCodeBlock: has("blockFormatItems.codeBlock"),
    hasLink,
    needsAnchorElem: hasAnyFloating || hasLink,
    hasBlockInsert: has("toolbarItems.blockInsert"),
    hasToolbarFontSection: merged.plugins.toolbar_font.length > 0 || merged.plugins.toolbar_insert.length > 0,
  };
}

// ─── Public API ───────────────────────────────────────────────────────────────

export function generateEditorCode(state: BlockViewerContextType): string {
  const merged = emptyMerged();

  // 1. Always start with the base spec
  mergeSpec(merged, BASE_SPEC);

  // 2. Merge every active condition — deduplication is automatic
  for (const key of getActiveKeys(state)) {
    const spec = FEATURE_REGISTRY[key];
    if (spec) mergeSpec(merged, spec);
  }

  const activeKeys = getActiveKeys(state);
  const flags = computeFlags(activeKeys, merged);

  return renderCode(merged, flags);
}
