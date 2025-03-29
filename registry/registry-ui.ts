import { type Registry } from "shadcn/registry"

export const ui: Registry["items"] = [
  {
    "name": "rich-text-editor-plugin",
    "type": "registry:ui",
    "dependencies": ["@lexical/rich-text"],
    "registryDependencies": [
      "https://shadcn-editor.vercel.app/r/editor.json",
    ],
    "files": [
      {
        "path": "editor/editor-ui/content-editable.tsx",
        "target": "components/editor/editor-ui/content-editable.tsx",
        "type": "registry:ui"
      }
    ]
  },
  {
    "name": "toolbar-plugin",
    "type": "registry:ui",
    "registryDependencies": [
      "https://shadcn-editor.vercel.app/r/rich-text-editor-plugin.json",
    ],
    "files": [
      {
        "path": "editor/plugins/toolbar/toolbar-plugin.tsx",
        "target": "components/editor/plugins/toolbar/toolbar-plugin.tsx",
        "type": "registry:component"
      },
      {
        "path": "editor/context/toolbar-context.tsx",
        "target": "components/editor/context/toolbar-context.tsx",
        "type": "registry:component"
      },
      {
        "path": "editor/editor-hooks/use-modal.tsx",
        "target": "components/editor/editor-hooks/use-modal.tsx",
        "type": "registry:hook"
      }
    ]
  },
  {
    "name": "history-toolbar-plugin",
    "type": "registry:ui",
    "dependencies": ["@lexical/utils"],
    "registryDependencies": [
      "button",
      "https://shadcn-editor.vercel.app/r/toolbar-plugin.json",
    ],
    "files": [
      {
        "path": "editor/plugins/toolbar/history-toolbar-plugin.tsx",
        "target": "components/editor/plugins/toolbar/history-toolbar-plugin.tsx",
        "type": "registry:component"
      }
    ]
  },
  {
    "name": "block-format-toolbar-plugin",
    "type": "registry:ui",
    "registryDependencies": [
      "select",
      "https://shadcn-editor.vercel.app/r/toolbar-plugin.json",
    ],
    "dependencies": ["@lexical/list", "@lexical/utils", "@lexical/selection", "@lexical/code"],
    "files": [
      {
        "path": "editor/plugins/toolbar/block-format-toolbar-plugin.tsx",
        "target": "components/editor/plugins/toolbar/block-format-toolbar-plugin.tsx",
        "type": "registry:component"
      },
      {
        "path": "editor/editor-hooks/use-update-toolbar.ts",
        "target": "components/editor/editor-hooks/use-update-toolbar.ts",
        "type": "registry:hook"
      },
      {
        "path": "editor/plugins/toolbar/block-format/block-format-data.tsx",
        "target": "components/editor/plugins/toolbar/block-format/block-format-data.tsx",
        "type": "registry:component"
      },
      {
        "path": "editor/plugins/toolbar/block-format/format-bulleted-list.tsx",
        "target": "components/editor/plugins/toolbar/block-format/format-bulleted-list.tsx",
        "type": "registry:component"
      },
      {
        "path": "editor/plugins/toolbar/block-format/format-check-list.tsx",
        "target": "components/editor/plugins/toolbar/block-format/format-check-list.tsx",
        "type": "registry:component"
      },
      {
        "path": "editor/plugins/toolbar/block-format/format-numbered-list.tsx",
        "target": "components/editor/plugins/toolbar/block-format/format-numbered-list.tsx",
        "type": "registry:component"
      },
      {
        "path": "editor/plugins/toolbar/block-format/format-paragraph.tsx",
        "target": "components/editor/plugins/toolbar/block-format/format-paragraph.tsx",
        "type": "registry:component"
      },
      {
        "path": "editor/plugins/toolbar/block-format/format-quote.tsx",
        "target": "components/editor/plugins/toolbar/block-format/format-quote.tsx",
        "type": "registry:component"
      }
    ]
  },
  {
    "name": "font-family-toolbar-plugin",
    "type": "registry:ui",
    "dependencies": ["@lexical/selection"],
    "registryDependencies": [
      "select",
      "https://shadcn-editor.vercel.app/r/toolbar-plugin.json",
    ],
    "files": [
      {
        "path": "editor/plugins/toolbar/font-family-toolbar-plugin.tsx",
        "target": "components/editor/plugins/toolbar/font-family-toolbar-plugin.tsx",
        "type": "registry:component"
      },
      {
        "path": "editor/editor-hooks/use-update-toolbar.ts",
        "target": "components/editor/editor-hooks/use-update-toolbar.ts",
        "type": "registry:hook"
      },
    ]
  },
  {
    "name": "font-size-toolbar-plugin",
    "type": "registry:ui",
    "dependencies": ["@lexical/selection"],
    "registryDependencies": [
      "button",
      "input",
      "https://shadcn-editor.vercel.app/r/toolbar-plugin.json",
    ],
    "files": [
      {
        "path": "editor/plugins/toolbar/font-size-toolbar-plugin.tsx",
        "target": "components/editor/plugins/toolbar/font-size-toolbar-plugin.tsx",
        "type": "registry:component"
      },
      {
        "path": "editor/editor-hooks/use-update-toolbar.ts",
        "target": "components/editor/editor-hooks/use-update-toolbar.ts",
        "type": "registry:hook"
      }
    ]
  },
  {
    "name": "font-format-toolbar-plugin",
    "type": "registry:ui",
    "dependencies": ["@lexical/table"],
    "registryDependencies": [
      "toggle",
      "https://shadcn-editor.vercel.app/r/toolbar-plugin.json",
    ],
    "files": [
      {
        "path": "editor/plugins/toolbar/font-format-toolbar-plugin.tsx",
        "target": "components/editor/plugins/toolbar/font-format-toolbar-plugin.tsx",
        "type": "registry:component"
      },
      {
        "path": "editor/editor-hooks/use-update-toolbar.ts",
        "target": "components/editor/editor-hooks/use-update-toolbar.ts",
        "type": "registry:hook"
      }
    ]
  },
  {
    "name": "subsuper-toolbar-plugin",
    "type": "registry:ui",
    "dependencies": ["@lexical/table"],
    "registryDependencies": [
      "toggle-group",
      "https://shadcn-editor.vercel.app/r/toolbar-plugin.json",
    ],
    "files": [
      {
        "path": "editor/plugins/toolbar/subsuper-toolbar-plugin.tsx",
        "target": "components/editor/plugins/toolbar/subsuper-toolbar-plugin.tsx",
        "type": "registry:component"
      },
      {
        "path": "editor/editor-hooks/use-update-toolbar.ts",
        "target": "components/editor/editor-hooks/use-update-toolbar.ts",
        "type": "registry:hook"
      }
    ]
  },
  {
    "name": "font-color-toolbar-plugin",
    "type": "registry:ui",
    "dependencies": ["react-colorful", "@lexical/selection"],
    "registryDependencies": [
      "button",
      "input",
      "popover",
      "https://shadcn-editor.vercel.app/r/toolbar-plugin.json",
    ],
    "files": [
      {
        "path": "editor/plugins/toolbar/font-color-toolbar-plugin.tsx",
        "target": "components/editor/plugins/toolbar/font-color-toolbar-plugin.tsx",
        "type": "registry:component"
      },
      {
        "path": "editor/plugins/toolbar/font-background-toolbar-plugin.tsx",
        "target": "components/editor/plugins/toolbar/font-background-toolbar-plugin.tsx",
        "type": "registry:component"
      },
      {
        "path": "editor/editor-ui/colorpicker.tsx",
        "target": "components/editor/editor-ui/colorpicker.tsx",
        "type": "registry:ui"
      },
      {
        "path": "editor/editor-hooks/use-update-toolbar.ts",
        "target": "components/editor/editor-hooks/use-update-toolbar.ts",
        "type": "registry:hook"
      },
    ]
  },
  {
    "name": "element-format-toolbar-plugin",
    "type": "registry:ui",
    "dependencies": [
      "@lexical/link", 
      "@lexical/utils",
      "@lexical/selection"
    ],
    "registryDependencies": [
      "separator",
      "toggle-group",
      "https://shadcn-editor.vercel.app/r/toolbar-plugin.json",
    ],
    "files": [
      {
        "path": "editor/plugins/toolbar/element-format-toolbar-plugin.tsx",
        "target": "components/editor/plugins/toolbar/element-format-toolbar-plugin.tsx",
        "type": "registry:component"
      },
      {
        "path": "editor/utils/get-selected-node.ts",
        "target": "components/editor/utils/get-selected-node.ts",
        "type": "registry:component"
      },
      {
        "path": "editor/editor-hooks/use-update-toolbar.ts",
        "target": "components/editor/editor-hooks/use-update-toolbar.ts",
        "type": "registry:hook"
      },
    ]
  },
  {
    "name": "clear-formatting-toolbar-plugin",
    "type": "registry:ui",
    "dependencies": ["@lexical/utils", "@lexical/table"],
    "registryDependencies": [
      "button",
      "https://shadcn-editor.vercel.app/r/toolbar-plugin.json",
    ],
    "files": [
      {
        "path": "editor/plugins/toolbar/clear-formatting-toolbar-plugin.tsx",
        "target": "components/editor/plugins/toolbar/clear-formatting-toolbar-plugin.tsx",
        "type": "registry:component"
      }
    ],
  },
  {
    "name": "link-toolbar-plugin",
    "type": "registry:ui",
    "dependencies": ["@lexical/link", "@lexical/utils", "@lexical/selection"],
    "registryDependencies": [
      "toggle",
      "button",
      "input",
      "https://shadcn-editor.vercel.app/r/toolbar-plugin.json",
    ],
    "files": [
      {
        "path": "editor/plugins/toolbar/link-toolbar-plugin.tsx",
        "target": "components/editor/plugins/toolbar/link-toolbar-plugin.tsx",
        "type": "registry:component"
      },
      {
        "path": "editor/editor-hooks/use-update-toolbar.ts",
        "target": "components/editor/editor-hooks/use-update-toolbar.ts",
        "type": "registry:hook"
      },
      {
        "path": "editor/utils/get-selected-node.ts",
        "target": "components/editor/utils/get-selected-node.ts",
        "type": "registry:component"
      },
      {
        "path": "editor/context/floating-link-context.tsx",
        "target": "components/editor/context/floating-link-context.tsx",
        "type": "registry:component"
      },
      {
        "path": "editor/utils/url.ts",
        "target": "components/editor/utils/url.ts",
        "type": "registry:component"
      },
    ],
  },
  {
    "name": "actions-plugin",
    "type": "registry:ui",
    "registryDependencies": [
      "https://shadcn-editor.vercel.app/r/rich-text-editor-plugin.json",
    ],
    "files": [
      {
        "path": "editor/plugins/actions/actions-plugin.tsx",
        "target": "components/editor/plugins/actions/actions-plugin.tsx",
        "type": "registry:component"
      }
    ]
  },
  {
    "name": "max-length-plugin",
    "type": "registry:ui",
    "dependencies": ["@lexical/utils", "@lexical/selection"],
    "registryDependencies": [
      "https://shadcn-editor.vercel.app/r/actions-plugin.json",
    ],
    "files": [
      {
        "path": "editor/plugins/actions/max-length-plugin.tsx",
        "target": "components/editor/plugins/actions/max-length-plugin.tsx",
        "type": "registry:component"
      }
    ],
  },
  {
    "name": "counter-character-plugin",
    "type": "registry:ui",
    "dependencies": ["@lexical/text"],
    "registryDependencies": [
      "https://shadcn-editor.vercel.app/r/actions-plugin.json",
    ],
    "files": [
      {
        "path": "editor/plugins/actions/counter-character-plugin.tsx",
        "target": "components/editor/plugins/actions/counter-character-plugin.tsx",
        "type": "registry:component"
      }
    ],
  },
  {
    "name": "speech-to-text-plugin",
    "type": "registry:ui",
    "registryDependencies": [
      "button",
      "tooltip",
      "https://shadcn-editor.vercel.app/r/actions-plugin.json",
    ],
    "files": [
      {
        "path": "editor/plugins/actions/speech-to-text-plugin.tsx",
        "target": "components/editor/plugins/actions/speech-to-text-plugin.tsx",
        "type": "registry:component"
      },
      {
        "path": "editor/editor-hooks/use-report.ts",
        "target": "components/editor/editor-hooks/use-report.ts",
        "type": "registry:hook"
      },
      {
        "path": "editor/shared/can-use-dom.ts",
        "target": "components/editor/shared/can-use-dom.ts",
        "type": "registry:component"
      },
    ],
  },
  {
    "name": "share-content-plugin",
    "type": "registry:ui",
    "dependencies": ["sonner", "@lexical/file"],
    "registryDependencies": [
      "button",
      "tooltip",
      "sonner",
      "toast",
      "https://shadcn-editor.vercel.app/r/actions-plugin.json",
    ],
    "files": [
      {
        "path": "editor/plugins/actions/share-content-plugin.tsx",
        "target": "components/editor/plugins/actions/share-content-plugin.tsx",
        "type": "registry:component"
      },
      {
        "path": "editor/utils/doc-serialization.ts",
        "target": "components/editor/utils/doc-serialization.ts",
        "type": "registry:component"
      },
      
    ],
  },
  {
    "name": "import-export-plugin",
    "type": "registry:ui",
    "dependencies": ["@lexical/file"],
    "registryDependencies": [
      "button",
      "tooltip",
      "https://shadcn-editor.vercel.app/r/actions-plugin.json",
    ],
    "files": [
      {
        "path": "editor/plugins/actions/import-export-plugin.tsx",
        "target": "components/editor/plugins/actions/import-export-plugin.tsx",
        "type": "registry:component"
      }
    ],
  },
  {
    "name": "markdown-toggle-plugin",
    "type": "registry:ui",
    "dependencies": ["@lexical/markdown", "@lexical/code"],
    "registryDependencies": [
      "button",
      "https://shadcn-editor.vercel.app/r/actions-plugin.json",
    ],
    "files": [
      {
        "path": "editor/plugins/actions/markdown-toggle-plugin.tsx",
        "target": "components/editor/plugins/actions/markdown-toggle-plugin.tsx",
        "type": "registry:component"
      }
    ],
  },
  {
    "name": "clear-editor-plugin",
    "type": "registry:ui",
    "registryDependencies": [
      "button",
      "dialog",
      "tooltip",
      "https://shadcn-editor.vercel.app/r/actions-plugin.json",
    ],
    "files": [
      {
        "path": "editor/plugins/actions/clear-editor-plugin.tsx",
        "target": "components/editor/plugins/actions/clear-editor-plugin.tsx",
        "type": "registry:component"
      }
    ],
  },
  {
    "name": "edit-mode-toggle-plugin",
    "type": "registry:ui",
    "registryDependencies": [
      "button",
      "tooltip",
      "https://shadcn-editor.vercel.app/r/actions-plugin.json",
    ],
    "files": [
      {
        "path": "editor/plugins/actions/edit-mode-toggle-plugin.tsx",
        "target": "components/editor/plugins/actions/edit-mode-toggle-plugin.tsx",
        "type": "registry:component"
      }
    ],
  },
  {
    "name": "tree-view-plugin",
    "type": "registry:ui",
    "registryDependencies": [
      "button",
      "dialog",
      "scroll-area",
      "https://shadcn-editor.vercel.app/r/actions-plugin.json",
    ],
    "files": [
      {
        "path": "editor/plugins/actions/tree-view-plugin.tsx",
        "target": "components/editor/plugins/actions/tree-view-plugin.tsx",
        "type": "registry:component"
      }
    ],
  },
  {
    "name": "autocomplete-plugin",
    "type": "registry:ui",
    "dependencies": ["@lexical/utils", "@lexical/selection"],
    "registryDependencies": [
      "https://shadcn-editor.vercel.app/r/rich-text-editor-plugin.json",
    ],
    "files": [
      {
        "path": "editor/plugins/autocomplete-plugin.tsx",
        "target": "components/editor/plugins/autocomplete-plugin.tsx",
        "type": "registry:component"
      },
      {
        "path": "editor/context/shared-autocomplete-context.tsx",
        "target": "components/editor/context/shared-autocomplete-context.tsx",
        "type": "registry:component"
      },
      {
        "path": "editor/nodes/autocomplete-node.tsx",
        "target": "components/editor/nodes/autocomplete-node.tsx",
        "type": "registry:component"
      },
      {
        "path": "editor/utils/swipe.ts",
        "target": "components/editor/utils/swipe.ts",
        "type": "registry:component"
      },
    ],
  },
  {
    "name": "auto-embed-plugin",
    "type": "registry:ui",
    "dependencies": ["@lexical/utils", "@lexical/markdown"],
    "registryDependencies": [
      "button",
      "command",
      "dialog",
      "input",
      "popover",
      "select",
      "https://shadcn-editor.vercel.app/r/toolbar-plugin.json",
    ],
    "files": [
      {
        "path": "editor/plugins/embeds/auto-embed-plugin.tsx",
        "target": "components/editor/plugins/embeds/auto-embed-plugin.tsx",
        "type": "registry:component"
      },
      {
        "path": "editor/plugins/embeds/figma-plugin.tsx",
        "target": "components/editor/plugins/embeds/figma-plugin.tsx",
        "type": "registry:component"
      },
      {
        "path": "editor/nodes/embeds/figma-node.tsx",
        "target": "components/editor/nodes/embeds/figma-node.tsx",
        "type": "registry:component"
      },
      {
        "path": "editor/plugins/embeds/twitter-plugin.tsx",
        "target": "components/editor/plugins/embeds/twitter-plugin.tsx",
        "type": "registry:component"
      },
      {
        "path": "editor/nodes/embeds/tweet-node.tsx",
        "target": "components/editor/nodes/embeds/tweet-node.tsx",
        "type": "registry:component"
      },
      {
        "path": "editor/plugins/embeds/youtube-plugin.tsx",
        "target": "components/editor/plugins/embeds/youtube-plugin.tsx",
        "type": "registry:component"
      },
      {
        "path": "editor/nodes/embeds/youtube-node.tsx",
        "target": "components/editor/nodes/embeds/youtube-node.tsx",
        "type": "registry:component"
      },
      {
        "path": "editor/editor-hooks/use-modal.tsx",
        "target": "components/editor/editor-hooks/use-modal.tsx",
        "type": "registry:component"
      },
      {
        "path": "editor/transformers/markdown-tweet-transformer.ts",
        "target": "components/editor/transformers/markdown-tweet-transformer.ts",
        "type": "registry:component"
      },
      {
        "path": "editor/plugins/toolbar/block-insert/insert-embeds.tsx",
        "target": "components/editor/plugins/toolbar/block-insert/insert-embeds.tsx",
        "type": "registry:component"
      },
    ],
  },
  {
    "name": "auto-focus-plugin",
    "type": "registry:ui",
    "registryDependencies": [
      "https://shadcn-editor.vercel.app/r/rich-text-editor-plugin.json",
    ],
  },
  {
    "name": "component-picker-menu-plugin",
    "type": "registry:ui",
    "registryDependencies": [
      "command",
      "dialog",
      "https://shadcn-editor.vercel.app/r/rich-text-editor-plugin.json",
    ],
    "files": [
      {
        "path": "editor/plugins/component-picker-menu-plugin.tsx",
        "target": "components/editor/plugins/component-picker-menu-plugin.tsx",
        "type": "registry:component"
      },
      {
        "path": "editor/editor-hooks/use-modal",
        "target": "components/editor/editor-hooks/use-modal",
        "type": "registry:component"
      },
      {
        "path": "editor/plugins/picker/component-picker-option.tsx",
        "target": "components/editor/plugins/picker/component-picker-option.tsx",
        "type": "registry:component"
      },
      {
        "path": "editor/plugins/default/lexical-typeahead-menu-plugin.tsx",
        "target": "components/editor/plugins/default/lexical-typeahead-menu-plugin.tsx",
        "type": "registry:component"
      }
    ],
  },
  {
    "name": "code-plugin",
    "type": "registry:ui",
    "dependencies": [
      "lodash-es", 
      "@lexical/utils", 
      "@lexical/code",
      "@lexical/selection"
    ],
    "registryDependencies": [
      "select",
      "https://shadcn-editor.vercel.app/r/toolbar-plugin.json",
    ],
    "files": [
      {
        "path": "editor/plugins/code-action-menu-plugin.tsx",
        "target": "components/editor/plugins/code-action-menu-plugin.tsx",
        "type": "registry:component"
      },
      {
        "path": "editor/plugins/code-highlight-plugin.tsx",
        "target": "components/editor/plugins/code-highlight-plugin.tsx",
        "type": "registry:component"
      },
      {
        "path": "editor/editor-hooks/use-debounce.ts",
        "target": "components/editor/editor-hooks/use-debounce.ts",
        "type": "registry:component"
      },
      {
        "path": "editor/editor-ui/code-button.tsx",
        "target": "components/editor/editor-ui/code-button.tsx",
        "type": "registry:component"
      },
      {
        "path": "editor/plugins/toolbar/block-format/format-code-block.tsx",
        "target": "components/editor/plugins/toolbar/block-format/format-code-block.tsx",
        "type": "registry:component"
      },
      {
        "path": "editor/plugins/toolbar/block-format/block-format-data.tsx",
        "target": "components/editor/plugins/toolbar/block-format/block-format-data.tsx",
        "type": "registry:component"
      }
    ],
  },
  {
    "name": "collapsible-plugin",
    "type": "registry:ui",
    "dependencies": ["@lexical/utils"],
    "registryDependencies": [
      "select",
      "https://shadcn-editor.vercel.app/r/toolbar-plugin.json",
    ],
    "files": [
      {
        "path": "editor/plugins/collapsible-plugin.tsx",
        "target": "components/editor/plugins/collapsible-plugin.tsx",
        "type": "registry:component"
      },
      {
        "path": "editor/nodes/collapsible-container-node.tsx",
        "target": "components/editor/nodes/collapsible-container-node.tsx",
        "type": "registry:component"
      },
      {
        "path": "editor/nodes/collapsible-content-node.tsx",
        "target": "components/editor/nodes/collapsible-content-node.tsx",
        "type": "registry:component"
      },
      {
        "path": "editor/nodes/collapsible-title-node.tsx",
        "target": "components/editor/nodes/collapsible-title-node.tsx",
        "type": "registry:component"
      },
      {
        "path": "editor/plugins/toolbar/block-insert/insert-collapsible-container.tsx",
        "target": "components/editor/plugins/toolbar/block-insert/insert-collapsible-container.tsx",
        "type": "registry:component"
      },
    ],
  },
  {
    "name": "context-menu-plugin",
    "type": "registry:ui",
    "dependencies": ["@lexical/link"],
    "registryDependencies": [
      "command",
      "popover",
      "https://shadcn-editor.vercel.app/r/rich-text-editor-plugin.json",
    ],
    "files": [
      {
        "path": "editor/plugins/context-menu-plugin.tsx",
        "target": "components/editor/plugins/context-menu-plugin.tsx",
        "type": "registry:component"
      },
      {
        "path": "editor/plugins/default/lexical-context-menu-plugin.tsx",
        "target": "components/editor/plugins/default/lexical-context-menu-plugin.tsx",
        "type": "registry:component"
      }
    ],
  },
  {
    "name": "draggable-block-plugin",
    "type": "registry:ui",
    "registryDependencies": [
      "https://shadcn-editor.vercel.app/r/rich-text-editor-plugin.json",
    ],
    "files": [
      {
        "path": "editor/plugins/draggable-block-plugin.tsx",
        "target": "components/editor/plugins/draggable-block-plugin.tsx",
        "type": "registry:component"
      },
    ],
  },
  {
    "name": "drag-drop-paste-plugin",
    "type": "registry:ui",
    "dependencies": ["@lexical/utils"],
    "registryDependencies": [
      "https://shadcn-editor.vercel.app/r/rich-text-editor-plugin.json",
      "https://shadcn-editor.vercel.app/r/image-plugin.json",
    ],
    "files": [
      {
        "path": "editor/plugins/drag-drop-paste-plugin.tsx",
        "target": "components/editor/plugins/drag-drop-paste-plugin.tsx",
        "type": "registry:component"
      }
    ],
  },
  {
    "name": "emoji-plugin",
    "type": "registry:ui",
    "registryDependencies": [
      "command",
      "https://shadcn-editor.vercel.app/r/rich-text-editor-plugin.json",
    ],
    "files": [
      {
        "path": "editor/plugins/emojis-plugin.tsx",
        "target": "components/editor/plugins/emojis-plugin.tsx",
        "type": "registry:component"
      },
      {
        "path": "editor/nodes/emoji-node.tsx",
        "target": "components/editor/nodes/emoji-node.tsx",
        "type": "registry:component"
      },
      {
        "path": "editor/editor-ui/emoji-picker-plugin.tsx",
        "target": "components/editor/editor-ui/emoji-picker-plugin.tsx",
        "type": "registry:component"
      },
      {
        "path": "editor/utils/emoji-list.ts",
        "target": "components/editor/utils/emoji-list.ts",
        "type": "registry:component"
      },
      {
        "path": "editor/transformers/markdown-emoji-transformer.ts",
        "target": "components/editor/transformers/markdown-emoji-transformer.ts",
        "type": "registry:component"
      },
      {
        "path": "editor/plugins/default/lexical-typeahead-menu-plugin.tsx",
        "target": "components/editor/plugins/default/lexical-typeahead-menu-plugin.tsx",
        "type": "registry:component"
      }
    ],
  },
  {
    "name": "equation-plugin",
    "type": "registry:ui",
    "dependencies": [
      "katex", 
      "react-error-boundary", 
      "@lexical/utils",
      "@lexical/markdown"
    ],
    "registryDependencies": [
      "button",
      "checkbox",
      "input",
      "label",
      "select",
      "textarea",
      "https://shadcn-editor.vercel.app/r/toolbar-plugin.json",
    ],
    "files": [
      {
        "path": "editor/plugins/equations-plugin.tsx",
        "target": "components/editor/plugins/equations-plugin.tsx",
        "type": "registry:component"
      },
      {
        "path": "editor/nodes/equation-node.tsx",
        "target": "components/editor/nodes/equation-node.tsx",
        "type": "registry:component"
      },
      {
        "path": "editor/editor-ui/equation-component.tsx",
        "target": "components/editor/editor-ui/equation-component.tsx",
        "type": "registry:component"
      },
      {
        "path": "editor/editor-ui/equation-editor.tsx",
        "target": "components/editor/editor-ui/equation-editor.tsx",
        "type": "registry:component"
      },
      {
        "path": "editor/editor-ui/katex-equation-alterer.tsx",
        "target": "components/editor/editor-ui/katex-equation-alterer.tsx",
        "type": "registry:component"
      },
      {
        "path": "editor/editor-ui/katex-renderer.tsx",
        "target": "components/editor/editor-ui/katex-renderer.tsx",
        "type": "registry:component"
      },
      {
        "path": "editor/transformers/markdown-equation-transformer.ts",
        "target": "components/editor/transformers/markdown-equation-transformer.ts",
        "type": "registry:component"
      },
      {
        "path": "editor/plugins/toolbar/block-insert/insert-equation.tsx",
        "target": "components/editor/plugins/toolbar/block-insert/insert-equation.tsx",
        "type": "registry:component"
      },
    ],
  },
  {
    "name": "excalidraw-plugin",
    "dependencies": ["@excalidraw/excalidraw", "@lexical/utils"],
    "type": "registry:ui",
    "registryDependencies": [
      "button",
      "dialog",
      "select",
      "https://shadcn-editor.vercel.app/r/toolbar-plugin.json",
    ],
    "files": [
      {
        "path": "editor/plugins/excalidraw-plugin.tsx",
        "target": "components/editor/plugins/excalidraw-plugin.tsx",
        "type": "registry:component"
      },
      {
        "path": "editor/nodes/excalidraw-node.tsx",
        "target": "components/editor/nodes/excalidraw-node.tsx",
        "type": "registry:component"
      },
      {
        "path": "editor/editor-ui/excalidraw-modal.tsx",
        "target": "components/editor/editor-ui/excalidraw-modal.tsx",
        "type": "registry:component"
      },
      {
        "path": "editor/editor-ui/excalidraw-component.tsx",
        "target": "components/editor/editor-ui/excalidraw-component.tsx",
        "type": "registry:component"
      },
      {
        "path": "editor/editor-ui/excalidraw.tsx",
        "target": "components/editor/editor-ui/excalidraw.tsx",
        "type": "registry:component"
      },
      {
        "path": "editor/plugins/toolbar/block-insert/insert-excalidraw.tsx",
        "target": "components/editor/plugins/toolbar/block-insert/insert-excalidraw.tsx",
        "type": "registry:component"
      },
    ],
  },
  {
    "name": "floating-text-format-plugin",
    "type": "registry:ui",
    "dependencies": ["@lexical/code", "@lexical/link", "@lexical/utils", "@lexical/selection"],
    "registryDependencies": [
      "separator",
      "toggle-group",
      "https://shadcn-editor.vercel.app/r/rich-text-editor-plugin.json",
    ],
    "files": [
      {
        "path": "editor/plugins/floating-text-format-plugin.tsx",
        "target": "components/editor/plugins/floating-text-format-plugin.tsx",
        "type": "registry:component"
      },
      {
        "path": "editor/context/floating-link-context.tsx",
        "target": "components/editor/context/floating-link-context.tsx",
        "type": "registry:component"
      },
      {
        "path": "editor/utils/get-dom-range-rect.ts",
        "target": "components/editor/utils/get-dom-range-rect.ts",
        "type": "registry:component"
      },
      {
        "path": "editor/utils/get-selected-node.ts",
        "target": "components/editor/utils/get-selected-node.ts",
        "type": "registry:component"
      },
      {
        "path": "editor/utils/set-floating-elem-position.ts",
        "target": "components/editor/utils/set-floating-elem-position.ts",
        "type": "registry:component"
      },
    ],
  },
  {
    "name": "hashtag-plugin",
    "type": "registry:ui",
    "dependencies": ["@lexical/hashtag"],
    "registryDependencies": [
      "https://shadcn-editor.vercel.app/r/rich-text-editor-plugin.json",
    ],
  },
  {
    "name": "horizontal-rule-plugin",
    "type": "registry:ui",
    "dependencies": ["@lexical/utils"],
    "registryDependencies": [
      "select",
      "https://shadcn-editor.vercel.app/r/toolbar-plugin.json",
    ],
    "files": [
      {
        "path": "editor/plugins/toolbar/block-insert/insert-horizontal-rule.tsx",
        "target": "components/editor/plugins/toolbar/block-insert/insert-horizontal-rule.tsx",
        "type": "registry:component"
      },
    ],
  },
  {
    "name": "image-plugin",
    "type": "registry:ui",
    "dependencies": ["@lexical/utils", "@lexical/markdown"],
    "registryDependencies": [
      "button",
      "dialog",
      "input",
      "label",
      "select",
      "tabs",
      "https://shadcn-editor.vercel.app/r/toolbar-plugin.json",
    ],
    "files": [
      {
        "path": "editor/plugins/images-plugin.tsx",
        "target": "components/editor/plugins/images-plugin.tsx",
        "type": "registry:component"
      },
      {
        "path": "editor/nodes/image-node.tsx",
        "target": "components/editor/nodes/image-node.tsx",
        "type": "registry:component"
      },
      {
        "path": "editor/editor-ui/image-component.tsx",
        "target": "components/editor/editor-ui/image-component.tsx",
        "type": "registry:component"
      },
      {
        "path": "editor/editor-ui/image-resizer.tsx",
        "target": "components/editor/editor-ui/image-resizer.tsx",
        "type": "registry:component"
      },
      {
        "path": "editor/shared/can-use-dom.ts",
        "target": "components/editor/shared/can-use-dom.ts",
        "type": "registry:component"
      },
      {
        "path": "editor/transformers/markdown-image-transformer.ts",
        "target": "components/editor/transformers/markdown-image-transformer.ts",
        "type": "registry:component"
      },
      {
        "path": "editor/plugins/toolbar/block-insert/insert-image.tsx",
        "target": "components/editor/plugins/toolbar/block-insert/insert-image.tsx",
        "type": "registry:component"
      },
    ],
  },
  {
    "name": "inline-image-plugin",
    "type": "registry:ui",
    "dependencies": ["@lexical/utils"],
    "registryDependencies": [
      "button",
      "checkbox",
      "dialog",
      "input",
      "label",
      "select",
      "https://shadcn-editor.vercel.app/r/toolbar-plugin.json",
      "https://shadcn-editor.vercel.app/r/link-plugin.json",
    ],
    "files": [
      {
        "path": "editor/plugins/inline-image-plugin.tsx",
        "target": "components/editor/plugins/inline-image-plugin.tsx",
        "type": "registry:component"
      },
      {
        "path": "editor/nodes/inline-image-node.tsx",
        "target": "components/editor/nodes/inline-image-node.tsx",
        "type": "registry:component"
      },
      {
        "path": "editor/nodes/inline-image-component.tsx",
        "target": "components/editor/nodes/inline-image-component.tsx",
        "type": "registry:component"
      },
      {
        "path": "editor/editor-hooks/use-modal.tsx",
        "target": "components/editor/editor-hooks/use-modal.tsx",
        "type": "registry:component"
      },
      {
        "path": "editor/editor-ui/content-editable.tsx",
        "target": "components/editor/editor-ui/content-editable.tsx",
        "type": "registry:component"
      },
      {
        "path": "editor/shared/can-use-dom.tsx",
        "target": "components/editor/shared/can-use-dom.tsx",
        "type": "registry:component"
      },
      {
        "path": "editor/plugins/toolbar/block-insert/insert-inline-image.tsx",
        "target": "components/editor/plugins/toolbar/block-insert/insert-inline-image.tsx",
        "type": "registry:component"
      },
    ],
  },
  {
    "name": "keywords-plugin",
    "type": "registry:ui",
    "registryDependencies": [
      "https://shadcn-editor.vercel.app/r/rich-text-editor-plugin.json",
    ],
    "files": [
      {
        "path": "editor/plugins/keywords-plugin.tsx",
        "target": "components/editor/plugins/keywords-plugin.tsx",
        "type": "registry:component"
      },
      {
        "path": "editor/nodes/keyword-node.tsx",
        "target": "components/editor/nodes/keyword-node.tsx",
        "type": "registry:component"
      }
    ],
  },  
  {
    "name": "layout-plugin",
    "type": "registry:ui",
    "dependencies": ["@lexical/utils"],
    "registryDependencies": [
      "button",
      "select",
      "https://shadcn-editor.vercel.app/r/toolbar-plugin.json",
    ],
    "files": [
      {
        "path": "editor/plugins/layout-plugin.tsx",
        "target": "components/editor/plugins/layout-plugin.tsx",
        "type": "registry:component"
      },
      {
        "path": "editor/nodes/layout-container-node.tsx",
        "target": "components/editor/nodes/layout-container-node.tsx",
        "type": "registry:component"
      },
      {
        "path": "editor/nodes/layout-item-node.tsx",
        "target": "components/editor/nodes/layout-item-node.tsx",
        "type": "registry:component"
      },
      {
        "path": "editor/plugins/toolbar/block-insert/insert-columns-layout.tsx",
        "target": "components/editor/plugins/toolbar/block-insert/insert-columns-layout.tsx",
        "type": "registry:component"
      },
    ],
  },
  {
    "name": "link-plugin",
    "type": "registry:ui",
    "registryDependencies": [
      "https://shadcn-editor.vercel.app/r/rich-text-editor-plugin.json",
    ],
    "files": [
      {
        "path": "editor/plugins/link-plugin.tsx",
        "target": "components/editor/plugins/link-plugin.tsx",
        "type": "registry:component"
      },
      {
        "path": "editor/utils/url.ts",
        "target": "components/editor/utils/url.ts",
        "type": "registry:component"
      }
    ],
  },
  {
    "name": "markdown-plugin",
    "type": "registry:ui",
    "dependencies": ["@lexical/markdown"],
    "registryDependencies": [
      "https://shadcn-editor.vercel.app/r/rich-text-editor-plugin.json",
    ],
  },
  {
    "name": "mention-plugin",
    "type": "registry:ui",
    "registryDependencies": [
      "command",
      "https://shadcn-editor.vercel.app/r/rich-text-editor-plugin.json",
    ],
    "files": [
      {
        "path": "editor/plugins/mentions-plugin.tsx",
        "target": "components/editor/plugins/mentions-plugin.tsx",
        "type": "registry:component"
      },
      {
        "path": "editor/nodes/mention-node.tsx",
        "target": "components/editor/nodes/mention-node.tsx",
        "type": "registry:component"
      },
      {
        "path": "editor/plugins/default/lexical-typeahead-menu-plugin.tsx",
        "target": "components/editor/plugins/default/lexical-typeahead-menu-plugin.tsx",
        "type": "registry:component"
      }
    ],
  },
  {
    "name": "page-break-plugin",
    "type": "registry:ui",
    "dependencies": ["@lexical/utils"],
    "registryDependencies": [
      "select",
      "https://shadcn-editor.vercel.app/r/toolbar-plugin.json",
    ],
    "files": [
      {
        "path": "editor/plugins/page-break-plugin.tsx",
        "target": "components/editor/plugins/page-break-plugin.tsx",
        "type": "registry:component"
      },
      {
        "path": "editor/nodes/page-break-node.tsx",
        "target": "components/editor/nodes/page-break-node.tsx",
        "type": "registry:component"
      },
      {
        "path": "editor/plugins/toolbar/block-insert/insert-page-break.tsx",
        "target": "components/editor/plugins/toolbar/block-insert/insert-page-break.tsx",
        "type": "registry:component"
      },
    ],
  },
  {
    "name": "poll-plugin",
    "type": "registry:ui",
    "dependencies": ["@lexical/utils"],
    "registryDependencies": [
      "button",
      "dialog",
      "input",
      "label",
      "select",
      "https://shadcn-editor.vercel.app/r/toolbar-plugin.json",
    ],
    "files": [
      {
        "path": "editor/plugins/poll-plugin.tsx",
        "target": "components/editor/plugins/poll-plugin.tsx",
        "type": "registry:component"
      },
      {
        "path": "editor/nodes/poll-node.tsx",
        "target": "components/editor/nodes/poll-node.tsx",
        "type": "registry:component"
      },
      {
        "path": "editor/editor-ui/poll-component.tsx",
        "target": "components/editor/editor-ui/poll-component.tsx",
        "type": "registry:component"
      },
      {
        "path": "editor/plugins/toolbar/block-insert/insert-poll.tsx",
        "target": "components/editor/plugins/toolbar/block-insert/insert-poll.tsx",
        "type": "registry:component"
      },
    ],
  },
  {
    "name": "table-plugin",
    "type": "registry:ui",
    "dependencies": [
      "lodash-es",
      "react-colorful", 
      "@lexical/table",
      "@lexical/utils",
      "@lexical/markdown"
    ],
    "registryDependencies": [
      "button",
      "command",
      "dialog",
      "input",
      "label",
      "popover",
      "select",
      "https://shadcn-editor.vercel.app/r/toolbar-plugin.json",
    ],
    "files": [
      {
        "path": "editor/plugins/table-plugin.tsx",
        "target": "components/editor/plugins/table-plugin.tsx",
        "type": "registry:component"
      },
      {
        "path": "editor/plugins/table-action-menu-plugin.tsx",
        "target": "components/editor/plugins/table-action-menu-plugin.tsx",
        "type": "registry:component"
      },
      {
        "path": "editor/plugins/table-cell-resizer-plugin.tsx",
        "target": "components/editor/plugins/table-cell-resizer-plugin.tsx",
        "type": "registry:component"
      },
      {
        "path": "editor/plugins/table-hover-actions-plugin.tsx",
        "target": "components/editor/plugins/table-hover-actions-plugin.tsx",
        "type": "registry:component"
      },
      {
        "path": "editor/plugins/block-insert-plugin.tsx",
        "target": "components/editor/plugins/block-insert-plugin.tsx",
        "type": "registry:component"
      },
      {
        "path": "editor/plugins/block-insert/insert-table.tsx",
        "target": "components/editor/plugins/block-insert/insert-table.tsx",
        "type": "registry:component"
      },
      {
        "path": "editor/editor-hooks/use-modal.tsx",
        "target": "components/editor/editor-hooks/use-modal.tsx",
        "type": "registry:component"
      },
      {
        "path": "editor/editor-hooks/use-debounce.ts",
        "target": "components/editor/editor-hooks/use-debounce.ts",
        "type": "registry:component"
      },
      {
        "path": "editor/shared/invariant.ts",
        "target": "components/editor/shared/invariant.ts",
        "type": "registry:component"
      },
      {
        "path": "editor/transformers/markdown-table-transformer.ts",
        "target": "components/editor/transformers/markdown-table-transformer.ts",
        "type": "registry:component"
      },
    ],
  },
  {
    "name": "tab-focus-plugin",
    "type": "registry:ui",
    "registryDependencies": [
      "https://shadcn-editor.vercel.app/r/rich-text-editor-plugin.json",
    ],
    "files": [
      {
        "path": "editor/plugins/tab-focus-plugin.tsx",
        "target": "components/editor/plugins/tab-focus-plugin.tsx",
        "type": "registry:component"
      }
    ],
  },
  {
    "name": "typing-pref-plugin",
    "type": "registry:ui",
    "registryDependencies": [
      "https://shadcn-editor.vercel.app/r/rich-text-editor-plugin.json",
    ],
    "files": [
      {
        "path": "editor/plugins/typing-pref-plugin.tsx",
        "target": "components/editor/plugins/typing-pref-plugin.tsx",
        "type": "registry:component"
      },
      {
        "path": "editor/editor-hooks/use-report.tsx",
        "target": "components/editor/editor-hooks/use-report.tsx",
        "type": "registry:component"
      }
    ],
  },
]
