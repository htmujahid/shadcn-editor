import { type Registry } from "shadcn/schema"

export const ui: Registry["items"] = [
  {
    name: "rich-text-editor-plugin",
    type: "registry:ui",
    title: "Rich Text Editor Plugin",
    description: "A plugin for the rich text editor.",
    dependencies: ["@lexical/rich-text"],
    registryDependencies: ["@shadcn-editor/editor"],
    files: [
      {
        path: "editor/editor-ui/content-editable.tsx",
        target: "components/editor/editor-ui/content-editable.tsx",
        type: "registry:ui",
      },
    ],
  },
  {
    name: "toolbar-plugin",
    type: "registry:ui",
    title: "Toolbar Plugin",
    description: "A plugin for the toolbar.",
    registryDependencies: [
      "button-group",
      "dialog",
      "@shadcn-editor/rich-text-editor-plugin",
    ],
    files: [
      {
        path: "editor/plugins/toolbar/toolbar-plugin.tsx",
        target: "components/editor/plugins/toolbar/toolbar-plugin.tsx",
        type: "registry:component",
      },
      {
        path: "editor/context/toolbar-context.tsx",
        target: "components/editor/context/toolbar-context.tsx",
        type: "registry:component",
      },
      {
        path: "editor/editor-hooks/use-modal.tsx",
        target: "components/editor/editor-hooks/use-modal.tsx",
        type: "registry:hook",
      },
    ],
  },
  {
    name: "history-toolbar-plugin",
    type: "registry:ui",
    title: "History Toolbar Plugin",
    description: "A plugin for the history toolbar.",
    dependencies: ["@lexical/utils"],
    registryDependencies: ["button", "@shadcn-editor/toolbar-plugin"],
    files: [
      {
        path: "editor/plugins/toolbar/history-toolbar-plugin.tsx",
        target: "components/editor/plugins/toolbar/history-toolbar-plugin.tsx",
        type: "registry:component",
      },
    ],
  },
  {
    name: "block-format-toolbar-plugin",
    type: "registry:ui",
    title: "Block Format Toolbar Plugin",
    description: "A plugin for the block format toolbar.",
    registryDependencies: ["select", "@shadcn-editor/toolbar-plugin"],
    dependencies: [
      "@lexical/list",
      "@lexical/utils",
      "@lexical/selection",
      "@lexical/code",
    ],
    files: [
      {
        path: "editor/plugins/toolbar/block-format-toolbar-plugin.tsx",
        target:
          "components/editor/plugins/toolbar/block-format-toolbar-plugin.tsx",
        type: "registry:component",
      },
      {
        path: "editor/editor-hooks/use-update-toolbar.ts",
        target: "components/editor/editor-hooks/use-update-toolbar.ts",
        type: "registry:hook",
      },
      {
        path: "editor/plugins/toolbar/block-format/block-format-data.tsx",
        target:
          "components/editor/plugins/toolbar/block-format/block-format-data.tsx",
        type: "registry:component",
      },
      {
        path: "editor/plugins/toolbar/block-format/format-bulleted-list.tsx",
        target:
          "components/editor/plugins/toolbar/block-format/format-bulleted-list.tsx",
        type: "registry:component",
      },
      {
        path: "editor/plugins/toolbar/block-format/format-check-list.tsx",
        target:
          "components/editor/plugins/toolbar/block-format/format-check-list.tsx",
        type: "registry:component",
      },
      {
        path: "editor/plugins/toolbar/block-format/format-heading.tsx",
        target:
          "components/editor/plugins/toolbar/block-format/format-heading.tsx",
        type: "registry:component",
      },
      {
        path: "editor/plugins/toolbar/block-format/format-numbered-list.tsx",
        target:
          "components/editor/plugins/toolbar/block-format/format-numbered-list.tsx",
        type: "registry:component",
      },
      {
        path: "editor/plugins/toolbar/block-format/format-paragraph.tsx",
        target:
          "components/editor/plugins/toolbar/block-format/format-paragraph.tsx",
        type: "registry:component",
      },
      {
        path: "editor/plugins/toolbar/block-format/format-quote.tsx",
        target:
          "components/editor/plugins/toolbar/block-format/format-quote.tsx",
        type: "registry:component",
      },
      {
        path: "editor/plugins/list-max-indent-level-plugin.tsx",
        target: "components/editor/plugins/list-max-indent-level-plugin.tsx",
        type: "registry:component",
      },
    ],
  },
  {
    name: "font-family-toolbar-plugin",
    type: "registry:ui",
    title: "Font Family Toolbar Plugin",
    description: "A plugin for the font family toolbar.",
    dependencies: ["@lexical/selection"],
    registryDependencies: ["select", "@shadcn-editor/toolbar-plugin"],
    files: [
      {
        path: "editor/plugins/toolbar/font-family-toolbar-plugin.tsx",
        target:
          "components/editor/plugins/toolbar/font-family-toolbar-plugin.tsx",
        type: "registry:component",
      },
      {
        path: "editor/editor-hooks/use-update-toolbar.ts",
        target: "components/editor/editor-hooks/use-update-toolbar.ts",
        type: "registry:hook",
      },
    ],
  },
  {
    name: "font-size-toolbar-plugin",
    type: "registry:ui",
    title: "Font Size Toolbar Plugin",
    description: "A plugin for the font size toolbar.",
    dependencies: ["@lexical/selection"],
    registryDependencies: ["button", "input", "@shadcn-editor/toolbar-plugin"],
    files: [
      {
        path: "editor/plugins/toolbar/font-size-toolbar-plugin.tsx",
        target:
          "components/editor/plugins/toolbar/font-size-toolbar-plugin.tsx",
        type: "registry:component",
      },
      {
        path: "editor/editor-hooks/use-update-toolbar.ts",
        target: "components/editor/editor-hooks/use-update-toolbar.ts",
        type: "registry:hook",
      },
    ],
  },
  {
    name: "font-format-toolbar-plugin",
    type: "registry:ui",
    title: "Font Format Toolbar Plugin",
    description: "A plugin for the font format toolbar.",
    dependencies: ["@lexical/table"],
    registryDependencies: ["toggle", "@shadcn-editor/toolbar-plugin"],
    files: [
      {
        path: "editor/plugins/toolbar/font-format-toolbar-plugin.tsx",
        target:
          "components/editor/plugins/toolbar/font-format-toolbar-plugin.tsx",
        type: "registry:component",
      },
      {
        path: "editor/editor-hooks/use-update-toolbar.ts",
        target: "components/editor/editor-hooks/use-update-toolbar.ts",
        type: "registry:hook",
      },
    ],
  },
  {
    name: "subsuper-toolbar-plugin",
    type: "registry:ui",
    title: "Subsuper Toolbar Plugin",
    description: "A plugin for the subsuper toolbar.",
    dependencies: ["@lexical/table"],
    registryDependencies: ["toggle-group", "@shadcn-editor/toolbar-plugin"],
    files: [
      {
        path: "editor/plugins/toolbar/subsuper-toolbar-plugin.tsx",
        target: "components/editor/plugins/toolbar/subsuper-toolbar-plugin.tsx",
        type: "registry:component",
      },
      {
        path: "editor/editor-hooks/use-update-toolbar.ts",
        target: "components/editor/editor-hooks/use-update-toolbar.ts",
        type: "registry:hook",
      },
    ],
  },
  {
    name: "font-color-toolbar-plugin",
    type: "registry:ui",
    title: "Font Color Toolbar Plugin",
    description: "A plugin for the font color toolbar.",
    dependencies: ["@lexical/selection"],
    registryDependencies: [
      "button",
      "input",
      "popover",
      "@shadcn-editor/toolbar-plugin",
    ],
    files: [
      {
        path: "editor/plugins/toolbar/font-color-toolbar-plugin.tsx",
        target:
          "components/editor/plugins/toolbar/font-color-toolbar-plugin.tsx",
        type: "registry:component",
      },
      {
        path: "editor/plugins/toolbar/font-background-toolbar-plugin.tsx",
        target:
          "components/editor/plugins/toolbar/font-background-toolbar-plugin.tsx",
        type: "registry:component",
      },
      {
        path: "editor/editor-ui/color-picker.tsx",
        target: "components/editor/editor-ui/color-picker.tsx",
        type: "registry:ui",
      },
      {
        path: "editor/editor-hooks/use-update-toolbar.ts",
        target: "components/editor/editor-hooks/use-update-toolbar.ts",
        type: "registry:hook",
      },
    ],
  },
  {
    name: "element-format-toolbar-plugin",
    type: "registry:ui",
    title: "Element Format Toolbar Plugin",
    description: "A plugin for the element format toolbar.",
    dependencies: ["@lexical/link", "@lexical/utils", "@lexical/selection"],
    registryDependencies: [
      "separator",
      "toggle-group",
      "@shadcn-editor/toolbar-plugin",
    ],
    files: [
      {
        path: "editor/plugins/toolbar/element-format-toolbar-plugin.tsx",
        target:
          "components/editor/plugins/toolbar/element-format-toolbar-plugin.tsx",
        type: "registry:component",
      },
      {
        path: "editor/utils/get-selected-node.ts",
        target: "components/editor/utils/get-selected-node.ts",
        type: "registry:component",
      },
      {
        path: "editor/editor-hooks/use-update-toolbar.ts",
        target: "components/editor/editor-hooks/use-update-toolbar.ts",
        type: "registry:hook",
      },
    ],
  },
  {
    name: "clear-formatting-toolbar-plugin",
    type: "registry:ui",
    title: "Clear Formatting Toolbar Plugin",
    description: "A plugin for the clear formatting toolbar.",
    dependencies: ["@lexical/utils", "@lexical/table"],
    registryDependencies: ["button", "@shadcn-editor/toolbar-plugin"],
    files: [
      {
        path: "editor/plugins/toolbar/clear-formatting-toolbar-plugin.tsx",
        target:
          "components/editor/plugins/toolbar/clear-formatting-toolbar-plugin.tsx",
        type: "registry:component",
      },
    ],
  },
  {
    name: "link-toolbar-plugin",
    type: "registry:ui",
    title: "Link Toolbar Plugin",
    description: "A plugin for the link toolbar.",
    dependencies: ["@lexical/link", "@lexical/utils", "@lexical/selection"],
    registryDependencies: [
      "toggle",
      "button",
      "input",
      "@shadcn-editor/toolbar-plugin",
      "@shadcn-editor/link-plugin",
    ],
    files: [
      {
        path: "editor/plugins/toolbar/link-toolbar-plugin.tsx",
        target: "components/editor/plugins/toolbar/link-toolbar-plugin.tsx",
        type: "registry:component",
      },
      {
        path: "editor/editor-hooks/use-update-toolbar.ts",
        target: "components/editor/editor-hooks/use-update-toolbar.ts",
        type: "registry:hook",
      },
      {
        path: "editor/utils/get-selected-node.ts",
        target: "components/editor/utils/get-selected-node.ts",
        type: "registry:component",
      },
      {
        path: "editor/utils/url.ts",
        target: "components/editor/utils/url.ts",
        type: "registry:component",
      },
    ],
  },
  {
    name: "actions-plugin",
    type: "registry:ui",
    title: "Actions Plugin",
    description: "A plugin for the actions.",
    registryDependencies: ["@shadcn-editor/rich-text-editor-plugin"],
    files: [
      {
        path: "editor/plugins/actions/actions-plugin.tsx",
        target: "components/editor/plugins/actions/actions-plugin.tsx",
        type: "registry:component",
      },
    ],
  },
  {
    name: "max-length-plugin",
    type: "registry:ui",
    title: "Max Length Plugin",
    description: "A plugin for the max length.",
    dependencies: ["@lexical/utils", "@lexical/selection"],
    registryDependencies: ["@shadcn-editor/actions-plugin"],
    files: [
      {
        path: "editor/plugins/actions/max-length-plugin.tsx",
        target: "components/editor/plugins/actions/max-length-plugin.tsx",
        type: "registry:component",
      },
    ],
  },
  {
    name: "counter-character-plugin",
    type: "registry:ui",
    title: "Counter Character Plugin",
    description: "A plugin for the counter character.",
    dependencies: ["@lexical/text"],
    registryDependencies: ["@shadcn-editor/actions-plugin"],
    files: [
      {
        path: "editor/plugins/actions/counter-character-plugin.tsx",
        target:
          "components/editor/plugins/actions/counter-character-plugin.tsx",
        type: "registry:component",
      },
    ],
  },
  {
    name: "speech-to-text-plugin",
    type: "registry:ui",
    title: "Speech to Text Plugin",
    description: "A plugin for the speech to text.",
    registryDependencies: [
      "button",
      "tooltip",
      "@shadcn-editor/actions-plugin",
    ],
    files: [
      {
        path: "editor/plugins/actions/speech-to-text-plugin.tsx",
        target: "components/editor/plugins/actions/speech-to-text-plugin.tsx",
        type: "registry:component",
      },
      {
        path: "editor/editor-hooks/use-report.ts",
        target: "components/editor/editor-hooks/use-report.ts",
        type: "registry:hook",
      },
      {
        path: "editor/shared/can-use-dom.ts",
        target: "components/editor/shared/can-use-dom.ts",
        type: "registry:component",
      },
    ],
  },
  {
    name: "share-content-plugin",
    type: "registry:ui",
    title: "Share Content Plugin",
    description: "A plugin for the share content.",
    dependencies: ["sonner", "@lexical/file"],
    registryDependencies: [
      "button",
      "tooltip",
      "sonner",
      "toast",
      "@shadcn-editor/actions-plugin",
    ],
    files: [
      {
        path: "editor/plugins/actions/share-content-plugin.tsx",
        target: "components/editor/plugins/actions/share-content-plugin.tsx",
        type: "registry:component",
      },
      {
        path: "editor/utils/doc-serialization.ts",
        target: "components/editor/utils/doc-serialization.ts",
        type: "registry:component",
      },
    ],
  },
  {
    name: "import-export-plugin",
    type: "registry:ui",
    title: "Import Export Plugin",
    description: "A plugin for the import export.",
    dependencies: ["@lexical/file"],
    registryDependencies: [
      "button",
      "tooltip",
      "@shadcn-editor/actions-plugin",
    ],
    files: [
      {
        path: "editor/plugins/actions/import-export-plugin.tsx",
        target: "components/editor/plugins/actions/import-export-plugin.tsx",
        type: "registry:component",
      },
    ],
  },
  {
    name: "markdown-toggle-plugin",
    type: "registry:ui",
    title: "Markdown Toggle Plugin",
    description: "A plugin for the markdown toggle.",
    dependencies: ["@lexical/markdown", "@lexical/code"],
    registryDependencies: ["button", "@shadcn-editor/actions-plugin"],
    files: [
      {
        path: "editor/plugins/actions/markdown-toggle-plugin.tsx",
        target: "components/editor/plugins/actions/markdown-toggle-plugin.tsx",
        type: "registry:component",
      },
    ],
  },
  {
    name: "clear-editor-plugin",
    type: "registry:ui",
    title: "Clear Editor Plugin",
    description: "A plugin for the clear editor.",
    registryDependencies: [
      "button",
      "dialog",
      "tooltip",
      "@shadcn-editor/actions-plugin",
    ],
    files: [
      {
        path: "editor/plugins/actions/clear-editor-plugin.tsx",
        target: "components/editor/plugins/actions/clear-editor-plugin.tsx",
        type: "registry:component",
      },
    ],
  },
  {
    name: "edit-mode-toggle-plugin",
    type: "registry:ui",
    title: "Edit Mode Toggle Plugin",
    description: "A plugin for the edit mode toggle.",
    registryDependencies: [
      "button",
      "tooltip",
      "@shadcn-editor/actions-plugin",
    ],
    files: [
      {
        path: "editor/plugins/actions/edit-mode-toggle-plugin.tsx",
        target: "components/editor/plugins/actions/edit-mode-toggle-plugin.tsx",
        type: "registry:component",
      },
    ],
  },
  {
    name: "tree-view-plugin",
    type: "registry:ui",
    title: "Tree View Plugin",
    description: "A plugin for the tree view.",
    registryDependencies: [
      "button",
      "dialog",
      "scroll-area",
      "@shadcn-editor/actions-plugin",
    ],
    files: [
      {
        path: "editor/plugins/actions/tree-view-plugin.tsx",
        target: "components/editor/plugins/actions/tree-view-plugin.tsx",
        type: "registry:component",
      },
    ],
  },
  {
    name: "autocomplete-plugin",
    type: "registry:ui",
    title: "Autocomplete Plugin",
    description: "A plugin for the autocomplete.",
    dependencies: ["@lexical/utils", "@lexical/selection"],
    registryDependencies: ["@shadcn-editor/rich-text-editor-plugin"],
    files: [
      {
        path: "editor/plugins/autocomplete-plugin.tsx",
        target: "components/editor/plugins/autocomplete-plugin.tsx",
        type: "registry:component",
      },
      {
        path: "editor/nodes/autocomplete-node.tsx",
        target: "components/editor/nodes/autocomplete-node.tsx",
        type: "registry:component",
      },
      {
        path: "editor/utils/swipe.ts",
        target: "components/editor/utils/swipe.ts",
        type: "registry:component",
      },
    ],
  },
  {
    name: "auto-embed-plugin",
    type: "registry:ui",
    title: "Auto Embed Plugin",
    description: "A plugin for the auto embed.",
    dependencies: ["@lexical/utils", "@lexical/markdown"],
    registryDependencies: [
      "button",
      "command",
      "dialog",
      "input",
      "popover",
      "select",
      "@shadcn-editor/toolbar-plugin",
    ],
    files: [
      {
        path: "editor/plugins/embeds/auto-embed-plugin.tsx",
        target: "components/editor/plugins/embeds/auto-embed-plugin.tsx",
        type: "registry:component",
      },
      {
        path: "editor/plugins/embeds/twitter-plugin.tsx",
        target: "components/editor/plugins/embeds/twitter-plugin.tsx",
        type: "registry:component",
      },
      {
        path: "editor/nodes/embeds/tweet-node.tsx",
        target: "components/editor/nodes/embeds/tweet-node.tsx",
        type: "registry:component",
      },
      {
        path: "editor/plugins/embeds/youtube-plugin.tsx",
        target: "components/editor/plugins/embeds/youtube-plugin.tsx",
        type: "registry:component",
      },
      {
        path: "editor/nodes/embeds/youtube-node.tsx",
        target: "components/editor/nodes/embeds/youtube-node.tsx",
        type: "registry:component",
      },
      {
        path: "editor/editor-hooks/use-modal.tsx",
        target: "components/editor/editor-hooks/use-modal.tsx",
        type: "registry:component",
      },
      {
        path: "editor/transformers/markdown-tweet-transformer.ts",
        target: "components/editor/transformers/markdown-tweet-transformer.ts",
        type: "registry:component",
      },
      {
        path: "editor/plugins/toolbar/block-insert/insert-embeds.tsx",
        target:
          "components/editor/plugins/toolbar/block-insert/insert-embeds.tsx",
        type: "registry:component",
      },
    ],
  },
  {
    name: "auto-focus-plugin",
    type: "registry:ui",
    title: "Auto Focus Plugin",
    description: "A plugin for the auto focus.",
    registryDependencies: ["@shadcn-editor/rich-text-editor-plugin"],
  },
  {
    name: "component-picker-menu-plugin",
    type: "registry:ui",
    title: "Component Picker Menu Plugin",
    description: "A plugin for the component picker menu.",
    registryDependencies: [
      "command",
      "dialog",
      "@shadcn-editor/rich-text-editor-plugin",
    ],
    files: [
      {
        path: "editor/plugins/component-picker-menu-plugin.tsx",
        target: "components/editor/plugins/component-picker-menu-plugin.tsx",
        type: "registry:component",
      },
      {
        path: "editor/editor-hooks/use-modal.tsx",
        target: "components/editor/editor-hooks/use-modal.tsx",
        type: "registry:component",
      },
      {
        path: "editor/plugins/picker/alignment-picker-plugin.tsx",
        target: "components/editor/plugins/picker/alignment-picker-plugin.tsx",
        type: "registry:component",
      },
      {
        path: "editor/plugins/picker/bulleted-list-picker-plugin.tsx",
        target:
          "components/editor/plugins/picker/bulleted-list-picker-plugin.tsx",
        type: "registry:component",
      },
      {
        path: "editor/plugins/picker/check-list-picker-plugin.tsx",
        target: "components/editor/plugins/picker/check-list-picker-plugin.tsx",
        type: "registry:component",
      },
      {
        path: "editor/plugins/picker/code-picker-plugin.tsx",
        target: "components/editor/plugins/picker/code-picker-plugin.tsx",
        type: "registry:component",
      },
      {
        path: "editor/plugins/picker/columns-layout-picker-plugin.tsx",
        target:
          "components/editor/plugins/picker/columns-layout-picker-plugin.tsx",
        type: "registry:component",
      },
      {
        path: "editor/plugins/picker/component-picker-option.tsx",
        target: "components/editor/plugins/picker/component-picker-option.tsx",
        type: "registry:component",
      },
      {
        path: "editor/plugins/picker/divider-picker-plugin.tsx",
        target: "components/editor/plugins/picker/divider-picker-plugin.tsx",
        type: "registry:component",
      },
      {
        path: "editor/plugins/picker/embeds-picker-plugin.tsx",
        target: "components/editor/plugins/picker/embeds-picker-plugin.tsx",
        type: "registry:component",
      },
      {
        path: "editor/plugins/picker/heading-picker-plugin.tsx",
        target: "components/editor/plugins/picker/heading-picker-plugin.tsx",
        type: "registry:component",
      },
      {
        path: "editor/plugins/picker/image-picker-plugin.tsx",
        target: "components/editor/plugins/picker/image-picker-plugin.tsx",
        type: "registry:component",
      },
      {
        path: "editor/plugins/picker/numbered-list-picker-plugin.tsx",
        target:
          "components/editor/plugins/picker/numbered-list-picker-plugin.tsx",
        type: "registry:component",
      },
      {
        path: "editor/plugins/picker/paragraph-picker-plugin.tsx",
        target: "components/editor/plugins/picker/paragraph-picker-plugin.tsx",
        type: "registry:component",
      },
      {
        path: "editor/plugins/picker/quote-picker-plugin.tsx",
        target: "components/editor/plugins/picker/quote-picker-plugin.tsx",
        type: "registry:component",
      },
      {
        path: "editor/plugins/picker/table-picker-plugin.tsx",
        target: "components/editor/plugins/picker/table-picker-plugin.tsx",
        type: "registry:component",
      },
    ],
  },
  {
    name: "code-plugin",
    type: "registry:ui",
    title: "Code Plugin",
    description: "A plugin for the code.",
    dependencies: [
      "lodash",
      "@lexical/utils",
      "@lexical/code",
      "@lexical/selection",
    ],
    devDependencies: ["@types/lodash"],
    registryDependencies: ["select", "@shadcn-editor/toolbar-plugin"],
    files: [
      {
        path: "editor/plugins/code-action-menu-plugin.tsx",
        target: "components/editor/plugins/code-action-menu-plugin.tsx",
        type: "registry:component",
      },
      {
        path: "editor/plugins/code-highlight-plugin.tsx",
        target: "components/editor/plugins/code-highlight-plugin.tsx",
        type: "registry:component",
      },
      {
        path: "editor/editor-hooks/use-debounce.ts",
        target: "components/editor/editor-hooks/use-debounce.ts",
        type: "registry:component",
      },
      {
        path: "editor/editor-ui/code-button.tsx",
        target: "components/editor/editor-ui/code-button.tsx",
        type: "registry:component",
      },
      {
        path: "editor/plugins/toolbar/block-format/format-code-block.tsx",
        target:
          "components/editor/plugins/toolbar/block-format/format-code-block.tsx",
        type: "registry:component",
      },
      {
        path: "editor/plugins/toolbar/block-format/block-format-data.tsx",
        target:
          "components/editor/plugins/toolbar/block-format/block-format-data.tsx",
        type: "registry:component",
      },
      {
        path: "editor/plugins/toolbar/code-language-toolbar-plugin.tsx",
        target:
          "components/editor/plugins/toolbar/code-language-toolbar-plugin.tsx",
        type: "registry:component",
      },
    ],
  },
  {
    name: "context-menu-plugin",
    type: "registry:ui",
    title: "Context Menu Plugin",
    description: "A plugin for the context menu.",
    dependencies: ["@lexical/link"],
    registryDependencies: [
      "command",
      "popover",
      "@shadcn-editor/rich-text-editor-plugin",
    ],
    files: [
      {
        path: "editor/plugins/context-menu-plugin.tsx",
        target: "components/editor/plugins/context-menu-plugin.tsx",
        type: "registry:component",
      },
    ],
  },
  {
    name: "draggable-block-plugin",
    type: "registry:ui",
    title: "Draggable Block Plugin",
    description: "A plugin for the draggable block.",
    registryDependencies: ["@shadcn-editor/rich-text-editor-plugin"],
    files: [
      {
        path: "editor/plugins/draggable-block-plugin.tsx",
        target: "components/editor/plugins/draggable-block-plugin.tsx",
        type: "registry:component",
      },
    ],
  },
  {
    name: "drag-drop-paste-plugin",
    type: "registry:ui",
    title: "Drag Drop Paste Plugin",
    description: "A plugin for the drag drop paste.",
    dependencies: ["@lexical/utils"],
    registryDependencies: [
      "@shadcn-editor/rich-text-editor-plugin",
      "@shadcn-editor/image-plugin",
    ],
    files: [
      {
        path: "editor/plugins/drag-drop-paste-plugin.tsx",
        target: "components/editor/plugins/drag-drop-paste-plugin.tsx",
        type: "registry:component",
      },
    ],
  },
  {
    name: "emoji-plugin",
    type: "registry:ui",
    title: "Emoji Plugin",
    description: "A plugin for the emoji.",
    registryDependencies: ["command", "@shadcn-editor/rich-text-editor-plugin"],
    files: [
      {
        path: "editor/plugins/emojis-plugin.tsx",
        target: "components/editor/plugins/emojis-plugin.tsx",
        type: "registry:component",
      },
      {
        path: "editor/nodes/emoji-node.tsx",
        target: "components/editor/nodes/emoji-node.tsx",
        type: "registry:component",
      },
      {
        path: "editor/plugins/emoji-picker-plugin.tsx",
        target: "components/editor/plugins/emoji-picker-plugin.tsx",
        type: "registry:component",
      },
      {
        path: "editor/utils/emoji-list.ts",
        target: "components/editor/utils/emoji-list.ts",
        type: "registry:component",
      },
      {
        path: "editor/transformers/markdown-emoji-transformer.ts",
        target: "components/editor/transformers/markdown-emoji-transformer.ts",
        type: "registry:component",
      },
    ],
  },
  {
    name: "floating-text-format-plugin",
    type: "registry:ui",
    title: "Floating Text Format Plugin",
    description: "A plugin for the floating text format.",
    dependencies: [
      "@lexical/code",
      "@lexical/link",
      "@lexical/utils",
      "@lexical/selection",
    ],
    registryDependencies: [
      "separator",
      "toggle-group",
      "@shadcn-editor/rich-text-editor-plugin",
    ],
    files: [
      {
        path: "editor/plugins/floating-text-format-plugin.tsx",
        target: "components/editor/plugins/floating-text-format-plugin.tsx",
        type: "registry:component",
      },
      {
        path: "editor/utils/get-dom-range-rect.ts",
        target: "components/editor/utils/get-dom-range-rect.ts",
        type: "registry:component",
      },
      {
        path: "editor/utils/get-selected-node.ts",
        target: "components/editor/utils/get-selected-node.ts",
        type: "registry:component",
      },
      {
        path: "editor/utils/set-floating-elem-position.ts",
        target: "components/editor/utils/set-floating-elem-position.ts",
        type: "registry:component",
      },
    ],
  },
  {
    name: "hashtag-plugin",
    type: "registry:ui",
    title: "Hashtag Plugin",
    description: "A plugin for the hashtag.",
    dependencies: ["@lexical/hashtag"],
    registryDependencies: ["@shadcn-editor/rich-text-editor-plugin"],
  },
  {
    name: "horizontal-rule-plugin",
    type: "registry:ui",
    title: "Horizontal Rule Plugin",
    description: "A plugin for the horizontal rule.",
    dependencies: ["@lexical/utils"],
    registryDependencies: ["select", "@shadcn-editor/toolbar-plugin"],
    files: [
      {
        path: "editor/plugins/toolbar/block-insert/insert-horizontal-rule.tsx",
        target:
          "components/editor/plugins/toolbar/block-insert/insert-horizontal-rule.tsx",
        type: "registry:component",
      },
      {
        path: "editor/transformers/markdown-hr-transformer.ts",
        target: "components/editor/transformers/markdown-hr-transformer.ts",
        type: "registry:file",
      },
    ],
  },
  {
    name: "image-plugin",
    type: "registry:ui",
    title: "Image Plugin",
    description: "A plugin for the image.",
    dependencies: ["@lexical/utils", "@lexical/markdown"],
    registryDependencies: [
      "button",
      "dialog",
      "input",
      "label",
      "select",
      "tabs",
      "@shadcn-editor/toolbar-plugin",
    ],
    files: [
      {
        path: "editor/plugins/images-plugin.tsx",
        target: "components/editor/plugins/images-plugin.tsx",
        type: "registry:component",
      },
      {
        path: "editor/nodes/image-node.tsx",
        target: "components/editor/nodes/image-node.tsx",
        type: "registry:component",
      },
      {
        path: "editor/editor-ui/image-component.tsx",
        target: "components/editor/editor-ui/image-component.tsx",
        type: "registry:component",
      },
      {
        path: "editor/editor-ui/image-resizer.tsx",
        target: "components/editor/editor-ui/image-resizer.tsx",
        type: "registry:component",
      },
      {
        path: "editor/shared/can-use-dom.ts",
        target: "components/editor/shared/can-use-dom.ts",
        type: "registry:component",
      },
      {
        path: "editor/transformers/markdown-image-transformer.ts",
        target: "components/editor/transformers/markdown-image-transformer.ts",
        type: "registry:component",
      },
      {
        path: "editor/plugins/toolbar/block-insert/insert-image.tsx",
        target:
          "components/editor/plugins/toolbar/block-insert/insert-image.tsx",
        type: "registry:component",
      },
    ],
  },
  {
    name: "keywords-plugin",
    type: "registry:ui",
    title: "Keywords Plugin",
    description: "A plugin for the keywords.",
    registryDependencies: ["@shadcn-editor/rich-text-editor-plugin"],
    files: [
      {
        path: "editor/plugins/keywords-plugin.tsx",
        target: "components/editor/plugins/keywords-plugin.tsx",
        type: "registry:component",
      },
      {
        path: "editor/nodes/keyword-node.tsx",
        target: "components/editor/nodes/keyword-node.tsx",
        type: "registry:component",
      },
    ],
  },
  {
    name: "layout-plugin",
    type: "registry:ui",
    title: "Layout Plugin",
    description: "A plugin for the layout.",
    dependencies: ["@lexical/utils"],
    registryDependencies: ["button", "select", "@shadcn-editor/toolbar-plugin"],
    files: [
      {
        path: "editor/plugins/layout-plugin.tsx",
        target: "components/editor/plugins/layout-plugin.tsx",
        type: "registry:component",
      },
      {
        path: "editor/nodes/layout-container-node.tsx",
        target: "components/editor/nodes/layout-container-node.tsx",
        type: "registry:component",
      },
      {
        path: "editor/nodes/layout-item-node.tsx",
        target: "components/editor/nodes/layout-item-node.tsx",
        type: "registry:component",
      },
      {
        path: "editor/plugins/toolbar/block-insert/insert-columns-layout.tsx",
        target:
          "components/editor/plugins/toolbar/block-insert/insert-columns-layout.tsx",
        type: "registry:component",
      },
    ],
  },
  {
    name: "link-plugin",
    type: "registry:ui",
    title: "Link Plugin",
    description: "A plugin for the link.",
    files: [
      {
        path: "editor/plugins/auto-link-plugin.tsx",
        target: "components/editor/plugins/auto-link-plugin.tsx",
        type: "registry:component",
      },
      {
        path: "editor/plugins/floating-link-editor-plugin.tsx",
        target: "components/editor/plugins/floating-link-editor-plugin.tsx",
        type: "registry:component",
      },
      {
        path: "editor/plugins/link-plugin.tsx",
        target: "components/editor/plugins/link-plugin.tsx",
        type: "registry:component",
      },
      {
        path: "editor/utils/set-floating-elem-position-for-link-editor.ts",
        target:
          "components/editor/utils/set-floating-elem-position-for-link-editor.ts",
        type: "registry:component",
      },
      {
        path: "editor/utils/url.ts",
        target: "components/editor/utils/url.ts",
        type: "registry:component",
      },
    ],
  },
  {
    name: "markdown-plugin",
    type: "registry:ui",
    title: "Markdown Plugin",
    description: "A plugin for the markdown.",
    dependencies: ["@lexical/markdown"],
    registryDependencies: [
      "button",
      "@shadcn-editor/actions-plugin",
      "@shadcn-editor/rich-text-editor-plugin",
    ],
    files: [
      {
        path: "editor/plugins/actions/markdown-toggle-plugin.tsx",
        target: "components/editor/plugins/actions/markdown-toggle-plugin.tsx",
        type: "registry:component",
      },
    ],
  },
  {
    name: "mention-plugin",
    type: "registry:ui",
    title: "Mention Plugin",
    description: "A plugin for the mention.",
    registryDependencies: ["command", "@shadcn-editor/rich-text-editor-plugin"],
    files: [
      {
        path: "editor/plugins/mentions-plugin.tsx",
        target: "components/editor/plugins/mentions-plugin.tsx",
        type: "registry:component",
      },
      {
        path: "editor/nodes/mention-node.ts",
        target: "components/editor/nodes/mention-node.ts",
        type: "registry:component",
      },
    ],
  },
  {
    name: "table-plugin",
    type: "registry:ui",
    title: "Table Plugin",
    description: "A plugin for the table.",
    dependencies: [
      "lodash",
      "@lexical/table",
      "@lexical/utils",
      "@lexical/markdown",
    ],
    devDependencies: ["@types/lodash"],
    registryDependencies: [
      "button",
      "command",
      "dialog",
      "input",
      "label",
      "popover",
      "select",
      "@shadcn-editor/toolbar-plugin",
    ],
    files: [
      {
        path: "editor/plugins/table-plugin.tsx",
        target: "components/editor/plugins/table-plugin.tsx",
        type: "registry:component",
      },
      {
        path: "editor/plugins/toolbar/block-insert-plugin.tsx",
        target: "components/editor/plugins/toolbar/block-insert-plugin.tsx",
        type: "registry:component",
      },
      {
        path: "editor/plugins/toolbar/block-insert/insert-table.tsx",
        target:
          "components/editor/plugins/toolbar/block-insert/insert-table.tsx",
        type: "registry:component",
      },
      {
        path: "editor/editor-hooks/use-modal.tsx",
        target: "components/editor/editor-hooks/use-modal.tsx",
        type: "registry:component",
      },
      {
        path: "editor/editor-hooks/use-debounce.ts",
        target: "components/editor/editor-hooks/use-debounce.ts",
        type: "registry:component",
      },
      {
        path: "editor/shared/invariant.ts",
        target: "components/editor/shared/invariant.ts",
        type: "registry:component",
      },
      {
        path: "editor/transformers/markdown-table-transformer.ts",
        target: "components/editor/transformers/markdown-table-transformer.ts",
        type: "registry:component",
      },
    ],
  },
  {
    name: "tab-focus-plugin",
    type: "registry:ui",
    title: "Tab Focus Plugin",
    description: "A plugin for the tab focus.",
    registryDependencies: ["@shadcn-editor/rich-text-editor-plugin"],
    files: [
      {
        path: "editor/plugins/tab-focus-plugin.tsx",
        target: "components/editor/plugins/tab-focus-plugin.tsx",
        type: "registry:component",
      },
    ],
  },
  {
    name: "typing-pref-plugin",
    type: "registry:ui",
    title: "Typing Pref Plugin",
    description: "A plugin for the typing pref.",
    registryDependencies: ["@shadcn-editor/rich-text-editor-plugin"],
    files: [
      {
        path: "editor/plugins/typing-pref-plugin.tsx",
        target: "components/editor/plugins/typing-pref-plugin.tsx",
        type: "registry:component",
      },
      {
        path: "editor/editor-hooks/use-report.ts",
        target: "components/editor/editor-hooks/use-report.ts",
        type: "registry:component",
      },
    ],
  },
]
