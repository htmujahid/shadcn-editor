import { type Registry } from "shadcn/schema"

export const blocks: Registry["items"] = [
  {
    name: "editor",
    type: "registry:block",
    dependencies: [
      "lexical",
      "@lexical/react",
      "lucide-react",
      "@lexical/rich-text",
    ],
    registryDependencies: ["tooltip"],
    files: [
      {
        path: "blocks/editor-00/page.tsx",
        target: "app/editor-00/page.tsx",
        type: "registry:page",
      },
      {
        path: "blocks/editor-00/editor.tsx",
        target: "components/blocks/editor-00/editor.tsx",
        type: "registry:block",
      },
      {
        path: "blocks/editor-00/nodes.ts",
        target: "components/blocks/editor-00/nodes.ts",
        type: "registry:block",
      },
      {
        path: "blocks/editor-00/plugins.tsx",
        target: "components/blocks/editor-00/plugins.tsx",
        type: "registry:block",
      },
      {
        path: "editor/themes/editor-theme.ts",
        target: "components/editor/themes/editor-theme.ts",
        type: "registry:theme",
      },
      {
        path: "editor/themes/editor-theme.css",
        target: "components/editor/themes/editor-theme.css",
        type: "registry:theme",
      },
      {
        path: "editor/editor-ui/content-editable.tsx",
        target: "components/editor/editor-ui/content-editable.tsx",
        type: "registry:ui",
      },
    ],
  },
  {
    name: "editor-x",
    type: "registry:block",
    dependencies: [
      "@lexical/code",
      "@lexical/file",
      "@lexical/hashtag",
      "@lexical/link",
      "@lexical/list",
      "@lexical/markdown",
      "@lexical/overflow",
      "@lexical/react",
      "@lexical/rich-text",
      "@lexical/selection",
      "@lexical/table",
      "@lexical/text",
      "@lexical/utils",
      "@radix-ui/react-icons",
      "lexical",
      "lodash",
      "lucide-react",
      "react-colorful",
      "react-error-boundary",
      "sonner",
    ],
    devDependencies: ["@types/lodash"],
    registryDependencies: [
      "button",
      "button-group",
      "checkbox",
      "command",
      "dialog",
      "input",
      "label",
      "popover",
      "scroll-area",
      "select",
      "separator",
      "tabs",
      "textarea",
      "tooltip",
      "toggle",
      "toggle-group",
    ],
    files: [
      {
        path: "blocks/editor-x/page.tsx",
        target: "app/editor-x/page.tsx",
        type: "registry:page",
      },
      {
        path: "blocks/editor-x/editor.tsx",
        target: "components/blocks/editor-x/editor.tsx",
        type: "registry:block",
      },
      {
        path: "blocks/editor-x/nodes.ts",
        target: "components/blocks/editor-x/nodes.ts",
        type: "registry:block",
      },
      {
        path: "blocks/editor-x/plugins.tsx",
        target: "components/blocks/editor-x/plugins.tsx",
        type: "registry:block",
      },
      {
        path: "editor/themes/editor-theme.ts",
        target: "components/editor/themes/editor-theme.ts",
        type: "registry:theme",
      },
      {
        path: "editor/themes/editor-theme.css",
        target: "components/editor/themes/editor-theme.css",
        type: "registry:theme",
      },
      {
        path: "editor/context/toolbar-context.tsx",
        target: "components/editor/context/toolbar-context.tsx",
        type: "registry:component",
      },
      {
        path: "editor/editor-hooks/use-debounce.ts",
        target: "components/editor/editor-hooks/use-debounce.ts",
        type: "registry:hook",
      },
      {
        path: "editor/editor-hooks/use-modal.tsx",
        target: "components/editor/editor-hooks/use-modal.tsx",
        type: "registry:hook",
      },
      {
        path: "editor/editor-hooks/use-report.ts",
        target: "components/editor/editor-hooks/use-report.ts",
        type: "registry:hook",
      },
      {
        path: "editor/editor-hooks/use-update-toolbar.ts",
        target: "components/editor/editor-hooks/use-update-toolbar.ts",
        type: "registry:hook",
      },
      {
        path: "editor/nodes/embeds/tweet-node.tsx",
        target: "components/editor/nodes/embeds/tweet-node.tsx",
        type: "registry:file",
      },
      {
        path: "editor/nodes/embeds/youtube-node.tsx",
        target: "components/editor/nodes/embeds/youtube-node.tsx",
        type: "registry:file",
      },
      {
        path: "editor/nodes/autocomplete-node.tsx",
        target: "components/editor/nodes/autocomplete-node.tsx",
        type: "registry:file",
      },
      {
        path: "editor/nodes/emoji-node.tsx",
        target: "components/editor/nodes/emoji-node.tsx",
        type: "registry:file",
      },
      {
        path: "editor/nodes/image-node.tsx",
        target: "components/editor/nodes/image-node.tsx",
        type: "registry:file",
      },
      {
        path: "editor/nodes/keyword-node.tsx",
        target: "components/editor/nodes/keyword-node.tsx",
        type: "registry:file",
      },
      {
        path: "editor/nodes/layout-container-node.tsx",
        target: "components/editor/nodes/layout-container-node.tsx",
        type: "registry:file",
      },
      {
        path: "editor/nodes/layout-item-node.tsx",
        target: "components/editor/nodes/layout-item-node.tsx",
        type: "registry:file",
      },
      {
        path: "editor/nodes/mention-node.ts",
        target: "components/editor/nodes/mention-node.ts",
        type: "registry:file",
      },
      {
        path: "editor/plugins/actions/actions-plugin.tsx",
        target: "components/editor/plugins/actions/actions-plugin.tsx",
        type: "registry:component",
      },
      {
        path: "editor/plugins/actions/character-limit-plugin.tsx",
        target: "components/editor/plugins/actions/character-limit-plugin.tsx",
        type: "registry:component",
      },
      {
        path: "editor/plugins/actions/clear-editor-plugin.tsx",
        target: "components/editor/plugins/actions/clear-editor-plugin.tsx",
        type: "registry:component",
      },
      {
        path: "editor/plugins/actions/counter-character-plugin.tsx",
        target:
          "components/editor/plugins/actions/counter-character-plugin.tsx",
        type: "registry:component",
      },
      {
        path: "editor/plugins/actions/edit-mode-toggle-plugin.tsx",
        target: "components/editor/plugins/actions/edit-mode-toggle-plugin.tsx",
        type: "registry:component",
      },
      {
        path: "editor/plugins/actions/import-export-plugin.tsx",
        target: "components/editor/plugins/actions/import-export-plugin.tsx",
        type: "registry:component",
      },
      {
        path: "editor/plugins/actions/markdown-toggle-plugin.tsx",
        target: "components/editor/plugins/actions/markdown-toggle-plugin.tsx",
        type: "registry:component",
      },
      {
        path: "editor/plugins/actions/max-length-plugin.tsx",
        target: "components/editor/plugins/actions/max-length-plugin.tsx",
        type: "registry:component",
      },
      {
        path: "editor/plugins/actions/share-content-plugin.tsx",
        target: "components/editor/plugins/actions/share-content-plugin.tsx",
        type: "registry:component",
      },
      {
        path: "editor/plugins/actions/speech-to-text-plugin.tsx",
        target: "components/editor/plugins/actions/speech-to-text-plugin.tsx",
        type: "registry:component",
      },
      {
        path: "editor/plugins/actions/tree-view-plugin.tsx",
        target: "components/editor/plugins/actions/tree-view-plugin.tsx",
        type: "registry:component",
      },
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
        path: "editor/plugins/embeds/youtube-plugin.tsx",
        target: "components/editor/plugins/embeds/youtube-plugin.tsx",
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
        path: "editor/plugins/toolbar/block-format/format-code-block.tsx",
        target:
          "components/editor/plugins/toolbar/block-format/format-code-block.tsx",
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
        path: "editor/plugins/toolbar/block-insert/insert-columns-layout.tsx",
        target:
          "components/editor/plugins/toolbar/block-insert/insert-columns-layout.tsx",
        type: "registry:component",
      },
      {
        path: "editor/plugins/toolbar/block-insert/insert-embeds.tsx",
        target:
          "components/editor/plugins/toolbar/block-insert/insert-embeds.tsx",
        type: "registry:component",
      },
      {
        path: "editor/plugins/toolbar/block-insert/insert-horizontal-rule.tsx",
        target:
          "components/editor/plugins/toolbar/block-insert/insert-horizontal-rule.tsx",
        type: "registry:component",
      },
      {
        path: "editor/plugins/toolbar/block-insert/insert-image.tsx",
        target:
          "components/editor/plugins/toolbar/block-insert/insert-image.tsx",
        type: "registry:component",
      },
      {
        path: "editor/plugins/toolbar/block-insert/insert-table.tsx",
        target:
          "components/editor/plugins/toolbar/block-insert/insert-table.tsx",
        type: "registry:component",
      },
      {
        path: "editor/plugins/toolbar/block-format-toolbar-plugin.tsx",
        target:
          "components/editor/plugins/toolbar/block-format-toolbar-plugin.tsx",
        type: "registry:component",
      },
      {
        path: "editor/plugins/toolbar/block-insert-plugin.tsx",
        target: "components/editor/plugins/toolbar/block-insert-plugin.tsx",
        type: "registry:component",
      },
      {
        path: "editor/plugins/toolbar/clear-formatting-toolbar-plugin.tsx",
        target:
          "components/editor/plugins/toolbar/clear-formatting-toolbar-plugin.tsx",
        type: "registry:component",
      },
      {
        path: "editor/plugins/toolbar/code-language-toolbar-plugin.tsx",
        target:
          "components/editor/plugins/toolbar/code-language-toolbar-plugin.tsx",
        type: "registry:component",
      },
      {
        path: "editor/plugins/toolbar/element-format-toolbar-plugin.tsx",
        target:
          "components/editor/plugins/toolbar/element-format-toolbar-plugin.tsx",
        type: "registry:component",
      },
      {
        path: "editor/plugins/toolbar/font-background-toolbar-plugin.tsx",
        target:
          "components/editor/plugins/toolbar/font-background-toolbar-plugin.tsx",
        type: "registry:component",
      },
      {
        path: "editor/plugins/toolbar/font-color-toolbar-plugin.tsx",
        target:
          "components/editor/plugins/toolbar/font-color-toolbar-plugin.tsx",
        type: "registry:component",
      },
      {
        path: "editor/plugins/toolbar/font-family-toolbar-plugin.tsx",
        target:
          "components/editor/plugins/toolbar/font-family-toolbar-plugin.tsx",
        type: "registry:component",
      },
      {
        path: "editor/plugins/toolbar/font-format-toolbar-plugin.tsx",
        target:
          "components/editor/plugins/toolbar/font-format-toolbar-plugin.tsx",
        type: "registry:component",
      },
      {
        path: "editor/plugins/toolbar/font-size-toolbar-plugin.tsx",
        target:
          "components/editor/plugins/toolbar/font-size-toolbar-plugin.tsx",
        type: "registry:component",
      },
      {
        path: "editor/plugins/toolbar/history-toolbar-plugin.tsx",
        target: "components/editor/plugins/toolbar/history-toolbar-plugin.tsx",
        type: "registry:component",
      },
      {
        path: "editor/plugins/toolbar/link-toolbar-plugin.tsx",
        target: "components/editor/plugins/toolbar/link-toolbar-plugin.tsx",
        type: "registry:component",
      },
      {
        path: "editor/plugins/toolbar/subsuper-toolbar-plugin.tsx",
        target: "components/editor/plugins/toolbar/subsuper-toolbar-plugin.tsx",
        type: "registry:component",
      },
      {
        path: "editor/plugins/toolbar/toolbar-plugin.tsx",
        target: "components/editor/plugins/toolbar/toolbar-plugin.tsx",
        type: "registry:component",
      },
      {
        path: "editor/plugins/auto-link-plugin.tsx",
        target: "components/editor/plugins/auto-link-plugin.tsx",
        type: "registry:component",
      },
      {
        path: "editor/plugins/autocomplete-plugin.tsx",
        target: "components/editor/plugins/autocomplete-plugin.tsx",
        type: "registry:component",
      },
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
        path: "editor/plugins/component-picker-menu-plugin.tsx",
        target: "components/editor/plugins/component-picker-menu-plugin.tsx",
        type: "registry:component",
      },
      {
        path: "editor/plugins/context-menu-plugin.tsx",
        target: "components/editor/plugins/context-menu-plugin.tsx",
        type: "registry:component",
      },
      {
        path: "editor/plugins/drag-drop-paste-plugin.tsx",
        target: "components/editor/plugins/drag-drop-paste-plugin.tsx",
        type: "registry:component",
      },
      {
        path: "editor/plugins/draggable-block-plugin.tsx",
        target: "components/editor/plugins/draggable-block-plugin.tsx",
        type: "registry:component",
      },
      {
        path: "editor/plugins/emoji-picker-plugin.tsx",
        target: "components/editor/plugins/emoji-picker-plugin.tsx",
        type: "registry:component",
      },
      {
        path: "editor/plugins/emojis-plugin.tsx",
        target: "components/editor/plugins/emojis-plugin.tsx",
        type: "registry:component",
      },
      {
        path: "editor/plugins/floating-link-editor-plugin.tsx",
        target: "components/editor/plugins/floating-link-editor-plugin.tsx",
        type: "registry:component",
      },
      {
        path: "editor/plugins/floating-text-format-plugin.tsx",
        target: "components/editor/plugins/floating-text-format-plugin.tsx",
        type: "registry:component",
      },
      {
        path: "editor/plugins/images-plugin.tsx",
        target: "components/editor/plugins/images-plugin.tsx",
        type: "registry:component",
      },
      {
        path: "editor/plugins/keywords-plugin.tsx",
        target: "components/editor/plugins/keywords-plugin.tsx",
        type: "registry:component",
      },
      {
        path: "editor/plugins/layout-plugin.tsx",
        target: "components/editor/plugins/layout-plugin.tsx",
        type: "registry:component",
      },
      {
        path: "editor/plugins/link-plugin.tsx",
        target: "components/editor/plugins/link-plugin.tsx",
        type: "registry:component",
      },
      {
        path: "editor/plugins/list-max-indent-level-plugin.tsx",
        target: "components/editor/plugins/list-max-indent-level-plugin.tsx",
        type: "registry:component",
      },
      {
        path: "editor/plugins/mentions-plugin.tsx",
        target: "components/editor/plugins/mentions-plugin.tsx",
        type: "registry:component",
      },
      {
        path: "editor/plugins/tab-focus-plugin.tsx",
        target: "components/editor/plugins/tab-focus-plugin.tsx",
        type: "registry:component",
      },
      {
        path: "editor/plugins/table-plugin.tsx",
        target: "components/editor/plugins/table-plugin.tsx",
        type: "registry:component",
      },
      {
        path: "editor/plugins/typing-pref-plugin.tsx",
        target: "components/editor/plugins/typing-pref-plugin.tsx",
        type: "registry:component",
      },
      {
        path: "editor/shared/can-use-dom.ts",
        target: "components/editor/shared/can-use-dom.ts",
        type: "registry:file",
      },
      {
        path: "editor/shared/caret-from-point.ts",
        target: "components/editor/shared/caret-from-point.ts",
        type: "registry:file",
      },
      {
        path: "editor/shared/environment.ts",
        target: "components/editor/shared/environment.ts",
        type: "registry:file",
      },
      {
        path: "editor/shared/invariant.ts",
        target: "components/editor/shared/invariant.ts",
        type: "registry:file",
      },
      {
        path: "editor/shared/normalize-class-names.ts",
        target: "components/editor/shared/normalize-class-names.ts",
        type: "registry:file",
      },
      {
        path: "editor/shared/react-patches.ts",
        target: "components/editor/shared/react-patches.ts",
        type: "registry:file",
      },
      {
        path: "editor/shared/react-test-utils.ts",
        target: "components/editor/shared/react-test-utils.ts",
        type: "registry:file",
      },
      {
        path: "editor/shared/simple-diff-with-cursor.ts",
        target: "components/editor/shared/simple-diff-with-cursor.ts",
        type: "registry:file",
      },
      {
        path: "editor/shared/use-layout-effect.ts",
        target: "components/editor/shared/use-layout-effect.ts",
        type: "registry:file",
      },
      {
        path: "editor/shared/warn-only-once.ts",
        target: "components/editor/shared/warn-only-once.ts",
        type: "registry:file",
      },
      {
        path: "editor/transformers/markdown-emoji-transformer.ts",
        target: "components/editor/transformers/markdown-emoji-transformer.ts",
        type: "registry:file",
      },
      {
        path: "editor/transformers/markdown-hr-transformer.ts",
        target: "components/editor/transformers/markdown-hr-transformer.ts",
        type: "registry:file",
      },
      {
        path: "editor/transformers/markdown-image-transformer.ts",
        target: "components/editor/transformers/markdown-image-transformer.ts",
        type: "registry:file",
      },
      {
        path: "editor/transformers/markdown-table-transformer.ts",
        target: "components/editor/transformers/markdown-table-transformer.ts",
        type: "registry:file",
      },
      {
        path: "editor/transformers/markdown-tweet-transformer.ts",
        target: "components/editor/transformers/markdown-tweet-transformer.ts",
        type: "registry:file",
      },
      {
        path: "editor/editor-ui/code-button.tsx",
        target: "components/editor/editor-ui/code-button.tsx",
        type: "registry:ui",
      },
      {
        path: "editor/editor-ui/colorpicker.tsx",
        target: "components/editor/editor-ui/colorpicker.tsx",
        type: "registry:ui",
      },
      {
        path: "editor/editor-ui/content-editable.tsx",
        target: "components/editor/editor-ui/content-editable.tsx",
        type: "registry:ui",
      },
      {
        path: "editor/editor-ui/image-component.tsx",
        target: "components/editor/editor-ui/image-component.tsx",
        type: "registry:ui",
      },
      {
        path: "editor/editor-ui/image-resizer.tsx",
        target: "components/editor/editor-ui/image-resizer.tsx",
        type: "registry:ui",
      },
      {
        path: "editor/utils/doc-serialization.ts",
        target: "components/editor/utils/doc-serialization.ts",
        type: "registry:file",
      },
      {
        path: "editor/utils/emoji-list.ts",
        target: "components/editor/utils/emoji-list.ts",
        type: "registry:file",
      },
      {
        path: "editor/utils/get-dom-range-rect.ts",
        target: "components/editor/utils/get-dom-range-rect.ts",
        type: "registry:file",
      },
      {
        path: "editor/utils/get-selected-node.ts",
        target: "components/editor/utils/get-selected-node.ts",
        type: "registry:file",
      },
      {
        path: "editor/utils/guard.ts",
        target: "components/editor/utils/guard.ts",
        type: "registry:file",
      },
      {
        path: "editor/utils/is-mobile-width.ts",
        target: "components/editor/utils/is-mobile-width.ts",
        type: "registry:file",
      },
      {
        path: "editor/utils/set-floating-elem-position-for-link-editor.ts",
        target:
          "components/editor/utils/set-floating-elem-position-for-link-editor.ts",
        type: "registry:file",
      },
      {
        path: "editor/utils/set-floating-elem-position.ts",
        target: "components/editor/utils/set-floating-elem-position.ts",
        type: "registry:file",
      },
      {
        path: "editor/utils/swipe.ts",
        target: "components/editor/utils/swipe.ts",
        type: "registry:file",
      },
      {
        path: "editor/utils/url.ts",
        target: "components/editor/utils/url.ts",
        type: "registry:file",
      },
    ],
  },
  {
    name: "editor-md",
    type: "registry:block",
    registryDependencies: [
      "@shadcn-editor/editor",
      "@shadcn-editor/rich-text-editor-plugin",
      "@shadcn-editor/block-format-toolbar-plugin",
      "@shadcn-editor/element-format-toolbar-plugin",
      "@shadcn-editor/font-format-toolbar-plugin",
      "@shadcn-editor/history-toolbar-plugin",
      "@shadcn-editor/link-toolbar-plugin",
      "@shadcn-editor/code-plugin",
      "@shadcn-editor/component-picker-menu-plugin",
      "@shadcn-editor/draggable-block-plugin",
      "@shadcn-editor/floating-text-format-plugin",
      "@shadcn-editor/horizontal-rule-plugin",
      "@shadcn-editor/image-plugin",
      "@shadcn-editor/link-plugin",
      "@shadcn-editor/markdown-plugin",
      "@shadcn-editor/table-plugin",
    ],
    files: [
      {
        path: "blocks/editor-md/page.tsx",
        target: "app/editor-md/page.tsx",
        type: "registry:page",
      },
      {
        path: "blocks/editor-md/editor.tsx",
        target: "components/blocks/editor-md/editor.tsx",
        type: "registry:block",
      },
      {
        path: "blocks/editor-md/nodes.ts",
        target: "components/blocks/editor-md/nodes.ts",
        type: "registry:block",
      },
      {
        path: "blocks/editor-md/plugins.tsx",
        target: "components/blocks/editor-md/plugins.tsx",
        type: "registry:block",
      },
      {
        path: "editor/plugins/toolbar/horizontal-rule-toolbar-plugin.tsx",
        target:
          "components/editor/plugins/toolbar/horizontal-rule-toolbar-plugin.tsx",
        type: "registry:component",
      },
      {
        path: "editor/plugins/toolbar/image-toolbar-plugin.tsx",
        target: "components/editor/plugins/toolbar/image-toolbar-plugin.tsx",
        type: "registry:component",
      },
      {
        path: "editor/plugins/toolbar/table-toolbar-plugin.tsx",
        target: "components/editor/plugins/toolbar/table-toolbar-plugin.tsx",
        type: "registry:component",
      },
    ],
  },
]
