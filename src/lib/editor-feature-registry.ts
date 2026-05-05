/**
 * Editor Feature Registry
 *
 * Maps each sidebar condition to the code artifacts it requires.
 * Condition keys follow the pattern: "category.itemKey"
 *
 * Relationships:
 *   - One condition  → exactly one FeatureSpec (fixed imports, extensions, nodes, plugins)
 *   - One artifact   → can appear in many conditions (deduped at generation time)
 *
 * To add a new condition: add one entry to FEATURE_REGISTRY.
 */

export type ImportSpec = {
  source: string;
  specifiers?: string[];      // named imports
  typeSpecifiers?: string[];  // type-only named imports: import { type Foo }
};

/** Slot positions in the generated editor JSX */
export type PluginSlot =
  | "toolbar_start"   // undo/redo, block format — before code-language check
  | "toolbar_font"    // font tools, link, etc. — inside !code branch
  | "toolbar_insert"  // items inside BlockInsertPlugin
  | "content"         // after ContentEditable
  | "floating"        // floating overlays (require anchorElem)
  | "footer_left"     // left side of ActionsPlugin footer
  | "footer_center"   // center of footer
  | "footer_right";   // right side of footer

export type FeatureSpec = {
  imports?: ImportSpec[];
  extensions?: string[];                           // names / configExtension(...) strings
  nodes?: string[];                                // node class names
  plugins?: Partial<Record<PluginSlot, string[]>>; // JSX lines per slot
};

/**
 * Base spec — always included.
 * Contains the minimal scaffolding every editor needs.
 */
export const BASE_SPEC: FeatureSpec = {
  imports: [
    { source: "react", specifiers: ["useMemo", "useState"] },
    {
      source: "@lexical/extension",
      specifiers: ["AutoFocusExtension", "SelectionAlwaysOnDisplayExtension"],
    },
    {
      source: "@lexical/react/LexicalExtensionComposer",
      specifiers: ["LexicalExtensionComposer"],
    },
    { source: "@lexical/react/LexicalOnChangePlugin", specifiers: ["OnChangePlugin"] },
    { source: "@lexical/rich-text", specifiers: ["RichTextExtension"] },
    {
      source: "lexical",
      specifiers: ["configExtension", "defineExtension"],
      typeSpecifiers: ["EditorState", "SerializedEditorState"],
    },
    { source: "@/components/block-viewer-provider", specifiers: ["useBlockViewer"] },
    {
      source: "@/components/editor/editor-ui/content-editable",
      specifiers: ["ContentEditable"],
    },
    {
      source: "@/components/editor/plugins/actions/actions-plugin",
      specifiers: ["ActionsPlugin"],
    },
    {
      source: "@/components/editor/plugins/toolbar/toolbar-plugin",
      specifiers: ["ToolbarPlugin"],
    },
    { source: "@/components/editor/themes/editor-theme", specifiers: ["editorTheme"] },
    { source: "@/components/ui/tooltip", specifiers: ["TooltipProvider"] },
  ],
  extensions: ["RichTextExtension", "AutoFocusExtension", "SelectionAlwaysOnDisplayExtension"],
  nodes: [],
  plugins: {},
};

/**
 * Condition registry.
 * Key format: "category.itemKey" — matches the useBlockViewer() state shape.
 */
export const FEATURE_REGISTRY: Record<string, FeatureSpec> = {
  // ─── Toolbar ──────────────────────────────────────────────────────────────

  "toolbarItems.undoRedo": {
    imports: [
      { source: "@lexical/history", specifiers: ["HistoryExtension"] },
      {
        source: "@/components/editor/plugins/toolbar/history-toolbar-plugin",
        specifiers: ["HistoryToolbarPlugin"],
      },
      { source: "@/components/ui/separator", specifiers: ["Separator"] },
    ],
    extensions: ["HistoryExtension"],
    plugins: {
      toolbar_start: [
        "<HistoryToolbarPlugin />",
        `<Separator orientation="vertical" className="h-7!" />`,
      ],
    },
  },

  "toolbarItems.blockFormat": {
    imports: [
      {
        source: "@/components/editor/plugins/toolbar/block-format-toolbar-plugin",
        specifiers: ["BlockFormatDropDown"],
      },
      {
        source: "@/components/editor/plugins/toolbar/block-format/format-bulleted-list",
        specifiers: ["FormatBulletedList"],
      },
      {
        source: "@/components/editor/plugins/toolbar/block-format/format-check-list",
        specifiers: ["FormatCheckList"],
      },
      {
        source: "@/components/editor/plugins/toolbar/block-format/format-code-block",
        specifiers: ["FormatCodeBlock"],
      },
      {
        source: "@/components/editor/plugins/toolbar/block-format/format-heading",
        specifiers: ["FormatHeading"],
      },
      {
        source: "@/components/editor/plugins/toolbar/block-format/format-numbered-list",
        specifiers: ["FormatNumberedList"],
      },
      {
        source: "@/components/editor/plugins/toolbar/block-format/format-paragraph",
        specifiers: ["FormatParagraph"],
      },
      {
        source: "@/components/editor/plugins/toolbar/block-format/format-quote",
        specifiers: ["FormatQuote"],
      },
    ],
    plugins: {
      toolbar_start: [
        `<BlockFormatDropDown>\n  <FormatParagraph />\n  <FormatHeading levels={["h1", "h2", "h3"]} />\n  <FormatNumberedList />\n  <FormatBulletedList />\n  <FormatCheckList />\n  <FormatCodeBlock />\n  <FormatQuote />\n</BlockFormatDropDown>`,
      ],
    },
  },

  "toolbarItems.fontFamily": {
    imports: [
      {
        source: "@/components/editor/plugins/toolbar/font-family-toolbar-plugin",
        specifiers: ["FontFamilyToolbarPlugin"],
      },
      { source: "@/components/ui/separator", specifiers: ["Separator"] },
    ],
    plugins: {
      toolbar_font: [
        "<FontFamilyToolbarPlugin />",
        `<Separator orientation="vertical" className="h-7!" />`,
      ],
    },
  },

  "toolbarItems.fontSize": {
    imports: [
      {
        source: "@/components/editor/plugins/toolbar/font-size-toolbar-plugin",
        specifiers: ["FontSizeToolbarPlugin"],
      },
      { source: "@/components/ui/separator", specifiers: ["Separator"] },
    ],
    plugins: {
      toolbar_font: [
        "<FontSizeToolbarPlugin />",
        `<Separator orientation="vertical" className="h-7!" />`,
      ],
    },
  },

  "toolbarItems.fontFormat": {
    imports: [
      {
        source: "@/components/editor/plugins/toolbar/font-format-toolbar-plugin",
        specifiers: ["FontFormatToolbarPlugin"],
      },
      { source: "@/components/ui/separator", specifiers: ["Separator"] },
    ],
    plugins: {
      toolbar_font: [
        "<FontFormatToolbarPlugin />",
        `<Separator orientation="vertical" className="h-7!" />`,
      ],
    },
  },

  "toolbarItems.subSuper": {
    imports: [
      {
        source: "@/components/editor/plugins/toolbar/subsuper-toolbar-plugin",
        specifiers: ["SubSuperToolbarPlugin"],
      },
      { source: "@/components/ui/separator", specifiers: ["Separator"] },
    ],
    plugins: {
      toolbar_font: [
        "<SubSuperToolbarPlugin />",
        `<Separator orientation="vertical" className="h-7!" />`,
      ],
    },
  },

  "toolbarItems.link": {
    imports: [
      {
        source: "@lexical/link",
        specifiers: ["AutoLinkExtension", "ClickableLinkExtension", "LinkExtension"],
      },
      {
        source: "@/components/editor/plugins/toolbar/link-toolbar-plugin",
        specifiers: ["LinkToolbarPlugin"],
      },
      { source: "@/components/editor/utils/url", specifiers: ["validateUrl"] },
      { source: "@/components/ui/separator", specifiers: ["Separator"] },
    ],
    extensions: [
      `configExtension(LinkExtension, {\n  validateUrl,\n  attributes: { rel: "noopener noreferrer", target: "_blank" },\n})`,
      "AutoLinkExtension",
      "ClickableLinkExtension",
    ],
    plugins: {
      toolbar_font: [
        "<LinkToolbarPlugin setIsLinkEditMode={setIsLinkEditMode} />",
        `<Separator orientation="vertical" className="h-7!" />`,
      ],
    },
  },

  "toolbarItems.clearFormatting": {
    imports: [
      {
        source: "@/components/editor/plugins/toolbar/clear-formatting-toolbar-plugin",
        specifiers: ["ClearFormattingToolbarPlugin"],
      },
      { source: "@/components/ui/separator", specifiers: ["Separator"] },
    ],
    plugins: {
      toolbar_font: [
        "<ClearFormattingToolbarPlugin />",
        `<Separator orientation="vertical" className="h-7!" />`,
      ],
    },
  },

  "toolbarItems.fontColor": {
    imports: [
      {
        source: "@/components/editor/plugins/toolbar/font-color-toolbar-plugin",
        specifiers: ["FontColorToolbarPlugin"],
      },
    ],
    plugins: {
      toolbar_font: ["<FontColorToolbarPlugin />"],
    },
  },

  "toolbarItems.fontBackground": {
    imports: [
      {
        source: "@/components/editor/plugins/toolbar/font-background-toolbar-plugin",
        specifiers: ["FontBackgroundToolbarPlugin"],
      },
      { source: "@/components/ui/separator", specifiers: ["Separator"] },
    ],
    plugins: {
      toolbar_font: [
        "<FontBackgroundToolbarPlugin />",
        `<Separator orientation="vertical" className="h-7!" />`,
      ],
    },
  },

  "toolbarItems.fontAlignment": {
    imports: [
      {
        source: "@/components/editor/plugins/toolbar/element-format-toolbar-plugin",
        specifiers: ["ElementFormatToolbarPlugin"],
      },
      { source: "@/components/ui/separator", specifiers: ["Separator"] },
    ],
    plugins: {
      toolbar_font: [
        "<ElementFormatToolbarPlugin />",
        `<Separator orientation="vertical" className="h-7!" />`,
      ],
    },
  },

  "toolbarItems.blockInsert": {
    imports: [
      {
        source: "@/components/editor/plugins/toolbar/block-insert-plugin",
        specifiers: ["BlockInsertPlugin"],
      },
    ],
    // BlockInsertPlugin children are populated by blockInsertItems.* entries
  },

  // ─── Block format items ───────────────────────────────────────────────────

  "blockFormatItems.codeBlock": {
    imports: [
      { source: "@lexical/code", specifiers: ["CodeHighlightNode", "CodeNode"] },
      {
        source: "@/components/editor/plugins/code-action-menu-plugin",
        specifiers: ["CodeActionMenuPlugin"],
      },
      {
        source: "@/components/editor/plugins/code-highlight-plugin",
        specifiers: ["CodeHighlightPlugin"],
      },
      {
        source: "@/components/editor/plugins/toolbar/code-language-toolbar-plugin",
        specifiers: ["CodeLanguageToolbarPlugin"],
      },
    ],
    nodes: ["CodeNode", "CodeHighlightNode"],
    plugins: {
      content: ["<CodeHighlightPlugin />"],
      floating: ["<CodeActionMenuPlugin anchorElem={floatingAnchorElem} />"],
    },
  },

  "blockFormatItems.numberList": {
    imports: [{ source: "@lexical/list", specifiers: ["ListExtension"] }],
    extensions: [`configExtension(ListExtension, { shouldPreserveNumbering: false })`],
  },

  "blockFormatItems.bulletList": {
    imports: [{ source: "@lexical/list", specifiers: ["ListExtension"] }],
    extensions: [`configExtension(ListExtension, { shouldPreserveNumbering: false })`],
  },

  "blockFormatItems.checkList": {
    imports: [{ source: "@lexical/list", specifiers: ["CheckListExtension", "ListExtension"] }],
    extensions: [
      `configExtension(ListExtension, { shouldPreserveNumbering: false })`,
      "CheckListExtension",
    ],
  },

  // paragraph / h1 / h2 / h3 / blockquote need no extra imports beyond base

  // ─── Block insert items ───────────────────────────────────────────────────

  "blockInsertItems.divider": {
    imports: [
      { source: "@lexical/extension", specifiers: ["HorizontalRuleExtension"] },
      {
        source: "@/components/editor/plugins/toolbar/block-insert/insert-horizontal-rule",
        specifiers: ["InsertHorizontalRule"],
      },
    ],
    extensions: ["HorizontalRuleExtension"],
    plugins: {
      toolbar_insert: ["<InsertHorizontalRule />"],
    },
  },

  "blockInsertItems.image": {
    imports: [
      {
        source: "@/components/editor/extensions/images-extension",
        specifiers: ["ImagesExtension"],
      },
      {
        source: "@/components/editor/plugins/toolbar/block-insert/insert-image",
        specifiers: ["InsertImage"],
      },
    ],
    extensions: ["ImagesExtension"],
    plugins: {
      toolbar_insert: ["<InsertImage />"],
    },
  },

  "blockInsertItems.table": {
    imports: [
      { source: "@lexical/react/LexicalTablePlugin", specifiers: ["TablePlugin"] },
      { source: "@lexical/table", specifiers: ["TableCellNode", "TableNode", "TableRowNode"] },
      {
        source: "@/components/editor/plugins/toolbar/block-insert/insert-table",
        specifiers: ["InsertTable"],
      },
    ],
    nodes: ["TableNode", "TableCellNode", "TableRowNode"],
    plugins: {
      toolbar_insert: ["<InsertTable />"],
      content: ["<TablePlugin />"],
    },
  },

  "blockInsertItems.columnsLayout": {
    imports: [
      {
        source: "@/components/editor/nodes/layout-container-node",
        specifiers: ["LayoutContainerNode"],
      },
      { source: "@/components/editor/nodes/layout-item-node", specifiers: ["LayoutItemNode"] },
      { source: "@/components/editor/plugins/layout-plugin", specifiers: ["LayoutPlugin"] },
      {
        source: "@/components/editor/plugins/toolbar/block-insert/insert-columns-layout",
        specifiers: ["InsertColumnsLayout"],
      },
    ],
    nodes: ["LayoutContainerNode", "LayoutItemNode"],
    plugins: {
      toolbar_insert: ["<InsertColumnsLayout />"],
      content: ["<LayoutPlugin />"],
    },
  },

  "blockInsertItems.embeds": {
    imports: [
      { source: "@/components/editor/nodes/embeds/tweet-node", specifiers: ["TweetNode"] },
      { source: "@/components/editor/nodes/embeds/youtube-node", specifiers: ["YouTubeNode"] },
      {
        source: "@/components/editor/plugins/embeds/twitter-plugin",
        specifiers: ["TwitterPlugin"],
      },
      {
        source: "@/components/editor/plugins/embeds/youtube-plugin",
        specifiers: ["YouTubePlugin"],
      },
      {
        source: "@/components/editor/plugins/toolbar/block-insert/insert-embeds",
        specifiers: ["InsertEmbeds"],
      },
    ],
    nodes: ["TweetNode", "YouTubeNode"],
    plugins: {
      toolbar_insert: ["<InsertEmbeds />"],
      content: ["<TwitterPlugin />", "<YouTubePlugin />"],
    },
  },

  // ─── Plugin (misc) items ──────────────────────────────────────────────────

  "pluginItems.componentPicker": {
    imports: [
      {
        source: "@/components/editor/plugins/component-picker-menu-plugin",
        specifiers: ["ComponentPickerMenuPlugin"],
      },
    ],
    // baseOptions populated dynamically by componentPickerItems.* entries
    plugins: {
      content: ["<ComponentPickerMenuPlugin baseOptions={[]} />"],
    },
  },

  "pluginItems.emojiPicker": {
    imports: [
      {
        source: "@/components/editor/extensions/emojis-extension",
        specifiers: ["EmojisExtension"],
      },
      { source: "@/components/editor/nodes/emoji-node", specifiers: ["EmojiNode"] },
      {
        source: "@/components/editor/plugins/emoji-picker-plugin",
        specifiers: ["EmojiPickerPlugin"],
      },
    ],
    extensions: ["EmojisExtension"],
    nodes: ["EmojiNode"],
    plugins: {
      content: ["<EmojiPickerPlugin />"],
    },
  },

  "pluginItems.autoEmbed": {
    imports: [
      {
        source: "@/components/editor/plugins/embeds/auto-embed-plugin",
        specifiers: ["AutoEmbedPlugin"],
      },
    ],
    plugins: {
      content: ["<AutoEmbedPlugin />"],
    },
  },

  "pluginItems.mentions": {
    imports: [
      { source: "@/components/editor/nodes/mention-node", specifiers: ["MentionNode"] },
      { source: "@/components/editor/plugins/mentions-plugin", specifiers: ["MentionsPlugin"] },
    ],
    nodes: ["MentionNode"],
    plugins: {
      content: ["<MentionsPlugin />"],
    },
  },

  "pluginItems.draggableBlock": {
    imports: [
      {
        source: "@/components/editor/plugins/draggable-block-plugin",
        specifiers: ["DraggableBlockPlugin"],
      },
    ],
    plugins: {
      floating: [
        "<DraggableBlockPlugin anchorElem={floatingAnchorElem} baseOptions={[]} />",
      ],
    },
  },

  "pluginItems.autoComplete": {
    imports: [
      {
        source: "@/components/editor/nodes/autocomplete-node",
        specifiers: ["AutocompleteNode"],
      },
      {
        source: "@/components/editor/plugins/auto-complete-plugin",
        specifiers: ["AutoCompletePlugin"],
      },
    ],
    nodes: ["AutocompleteNode"],
    plugins: {
      content: ["<AutoCompletePlugin />"],
    },
  },

  "pluginItems.floatingTextToolbar": {
    imports: [
      {
        source: "@/components/editor/plugins/floating-text-format-plugin",
        specifiers: ["FloatingTextFormatToolbarPlugin"],
      },
    ],
    plugins: {
      floating: [
        "<FloatingTextFormatToolbarPlugin anchorElem={floatingAnchorElem} setIsLinkEditMode={setIsLinkEditMode} />",
      ],
    },
  },

  "pluginItems.floatingLinkToolbar": {
    imports: [
      {
        source: "@/components/editor/plugins/floating-link-editor-plugin",
        specifiers: ["FloatingLinkEditorPlugin"],
      },
    ],
    plugins: {
      floating: [
        "<FloatingLinkEditorPlugin anchorElem={floatingAnchorElem} isLinkEditMode={isLinkEditMode} setIsLinkEditMode={setIsLinkEditMode} />",
      ],
    },
  },

  "pluginItems.contextMenu": {
    imports: [
      {
        source: "@/components/editor/plugins/context-menu-plugin",
        specifiers: ["ContextMenuPlugin"],
      },
    ],
    plugins: {
      content: ["<ContextMenuPlugin />"],
    },
  },

  "pluginItems.specialText": {
    imports: [
      {
        source: "@lexical/extension",
        specifiers: ["DecoratorTextExtension"],
      },
      {
        source: "@/components/editor/nodes/special-text-node",
        specifiers: ["SpecialTextNode"],
      },
      {
        source: "@/components/editor/plugins/special-text-plugin",
        specifiers: ["SpecialTextPlugin"],
      },
    ],
    extensions: ["DecoratorTextExtension"],
    nodes: ["SpecialTextNode"],
    plugins: {
      content: ["<SpecialTextPlugin />"],
    },
  },

  "pluginItems.tabFocus": {
    imports: [
      { source: "@/components/editor/plugins/tab-focus-plugin", specifiers: ["TabFocusPlugin"] },
    ],
    plugins: {
      content: ["<TabFocusPlugin />"],
    },
  },

  "pluginItems.tabIndentation": {
    imports: [
      {
        source: "@lexical/react/LexicalTabIndentationPlugin",
        specifiers: ["TabIndentationPlugin"],
      },
    ],
    plugins: {
      content: ["<TabIndentationPlugin />"],
    },
  },

  // ─── Footer items ─────────────────────────────────────────────────────────

  "footerItems.characterCount": {
    imports: [
      { source: "@lexical/overflow", specifiers: ["OverflowNode"] },
      {
        source: "@lexical/react/LexicalCharacterLimitPlugin",
        specifiers: ["CharacterLimitPlugin"],
      },
      {
        source: "@/components/editor/extensions/max-length-extension",
        specifiers: ["MaxLengthExtension"],
      },
      {
        source: "@/components/editor/plugins/actions/counter-character-plugin",
        specifiers: ["CounterCharacterPlugin"],
      },
    ],
    extensions: [`configExtension(MaxLengthExtension, { disabled: false, maxLength })`],
    nodes: ["OverflowNode"],
    plugins: {
      footer_left: [`<CharacterLimitPlugin maxLength={maxLength} charset="UTF-16" />`],
      footer_center: [`<CounterCharacterPlugin charset="UTF-16" />`],
    },
  },

  "footerItems.speechToText": {
    imports: [
      {
        source: "@/components/editor/plugins/actions/speech-to-text-plugin",
        specifiers: ["SpeechToTextPlugin"],
      },
    ],
    plugins: { footer_right: ["<SpeechToTextPlugin />"] },
  },

  "footerItems.shareContent": {
    imports: [
      {
        source: "@/components/editor/plugins/actions/share-content-plugin",
        specifiers: ["ShareContentPlugin"],
      },
    ],
    plugins: { footer_right: ["<ShareContentPlugin />"] },
  },

  "footerItems.exportImport": {
    imports: [
      {
        source: "@/components/editor/plugins/actions/import-export-plugin",
        specifiers: ["ImportExportPlugin"],
      },
    ],
    plugins: { footer_right: ["<ImportExportPlugin />"] },
  },

  "footerItems.markdownToggle": {
    imports: [
      {
        source: "@lexical/markdown",
        specifiers: [
          "CHECK_LIST",
          "ELEMENT_TRANSFORMERS",
          "MULTILINE_ELEMENT_TRANSFORMERS",
          "TEXT_FORMAT_TRANSFORMERS",
          "TEXT_MATCH_TRANSFORMERS",
        ],
      },
      {
        source: "@/components/editor/extensions/markdown-shortcuts-extension",
        specifiers: ["MarkdownShortcutsExtension"],
      },
      {
        source: "@/components/editor/plugins/actions/markdown-toggle-plugin",
        specifiers: ["MarkdownTogglePlugin"],
      },
      {
        source: "@/components/editor/transformers/markdown-emoji-transformer",
        specifiers: ["EMOJI"],
      },
      {
        source: "@/components/editor/transformers/markdown-hr-transformer",
        specifiers: ["HR"],
      },
      {
        source: "@/components/editor/transformers/markdown-image-transformer",
        specifiers: ["IMAGE"],
      },
      {
        source: "@/components/editor/transformers/markdown-table-transformer",
        specifiers: ["TABLE"],
      },
      {
        source: "@/components/editor/transformers/markdown-tweet-transformer",
        specifiers: ["TWEET"],
      },
    ],
    extensions: [
      `configExtension(MarkdownShortcutsExtension, {\n  transformers: [\n    TABLE, HR, IMAGE, EMOJI, TWEET, CHECK_LIST,\n    ...ELEMENT_TRANSFORMERS,\n    ...MULTILINE_ELEMENT_TRANSFORMERS,\n    ...TEXT_FORMAT_TRANSFORMERS,\n    ...TEXT_MATCH_TRANSFORMERS,\n  ],\n})`,
    ],
    plugins: {
      footer_right: [
        `<MarkdownTogglePlugin\n  shouldPreserveNewLinesInMarkdown={true}\n  transformers={[\n    TABLE, HR, IMAGE, EMOJI, TWEET, CHECK_LIST,\n    ...ELEMENT_TRANSFORMERS,\n    ...MULTILINE_ELEMENT_TRANSFORMERS,\n    ...TEXT_FORMAT_TRANSFORMERS,\n    ...TEXT_MATCH_TRANSFORMERS,\n  ]}\n/>`,
      ],
    },
  },

  "footerItems.viewOnly": {
    imports: [
      {
        source: "@/components/editor/plugins/actions/edit-mode-toggle-plugin",
        specifiers: ["EditModeTogglePlugin"],
      },
    ],
    plugins: { footer_right: ["<EditModeTogglePlugin />"] },
  },

  "footerItems.clearEditor": {
    imports: [
      { source: "@lexical/extension", specifiers: ["ClearEditorExtension"] },
      {
        source: "@/components/editor/plugins/actions/clear-editor-plugin",
        specifiers: ["ClearEditorActionPlugin"],
      },
    ],
    extensions: ["ClearEditorExtension"],
    plugins: { footer_right: ["<ClearEditorActionPlugin />"] },
  },

  "footerItems.treeView": {
    imports: [
      {
        source: "@/components/editor/plugins/actions/tree-view-plugin",
        specifiers: ["TreeViewPlugin"],
      },
    ],
    plugins: { footer_right: ["<TreeViewPlugin />"] },
  },

  // ─── Component picker items ───────────────────────────────────────────────
  // These add entries to ComponentPickerMenuPlugin / DraggableBlockPlugin.
  // Most reuse imports already declared by blockFormat/blockInsert items.

  "componentPickerItems.dateTime": {
    imports: [
      {
        source: "@/components/editor/extensions/date-time-extension",
        specifiers: ["DateTimeExtension"],
      },
      {
        source: "@/components/editor/plugins/picker/date-time-picker-plugin",
        specifiers: ["DateTimePickerPlugin"],
      },
    ],
    extensions: ["DateTimeExtension"],
  },

  "componentPickerItems.tweetEmbed": {
    imports: [
      { source: "@/components/editor/nodes/embeds/tweet-node", specifiers: ["TweetNode"] },
      {
        source: "@/components/editor/plugins/embeds/twitter-plugin",
        specifiers: ["TwitterPlugin"],
      },
      {
        source: "@/components/editor/plugins/picker/embeds-picker-plugin",
        specifiers: ["EmbedsPickerPlugin"],
      },
    ],
    nodes: ["TweetNode"],
    plugins: {
      content: ["<TwitterPlugin />"],
    },
  },

  "componentPickerItems.youtubeEmbed": {
    imports: [
      { source: "@/components/editor/nodes/embeds/youtube-node", specifiers: ["YouTubeNode"] },
      {
        source: "@/components/editor/plugins/embeds/youtube-plugin",
        specifiers: ["YouTubePlugin"],
      },
      {
        source: "@/components/editor/plugins/picker/embeds-picker-plugin",
        specifiers: ["EmbedsPickerPlugin"],
      },
    ],
    nodes: ["YouTubeNode"],
    plugins: {
      content: ["<YouTubePlugin />"],
    },
  },
};
