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
      "https://shadcn-editor.vercel.app/r/editor.json",
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
        "path": "editor/plugins/toolbar/block-format/format-code-block.tsx",
        "target": "components/editor/plugins/toolbar/block-format/format-code-block.tsx",
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
    "registryDependencies": [
      "select",
      "https://shadcn-editor.vercel.app/r/toolbar-plugin.json",
    ],
    "dependencies": ["@lexical/selection"],
    "files": [
      {
        "path": "editor/plugins/toolbar/font-family-toolbar-plugin.tsx",
        "target": "components/editor/plugins/toolbar/font-family-toolbar-plugin.tsx",
        "type": "registry:component"
      }
    ]
  },
  {
    "name": "font-size-toolbar-plugin",
    "type": "registry:ui",
    "registryDependencies": [
      "button",
      "input",
      "https://shadcn-editor.vercel.app/r/toolbar-plugin.json",
    ],
    "dependencies": ["@lexical/selection"],
    "files": [
      {
        "path": "editor/plugins/toolbar/font-size-toolbar-plugin.tsx",
        "target": "components/editor/plugins/toolbar/font-size-toolbar-plugin.tsx",
        "type": "registry:component"
      }
    ]
  },
  {
    "name": "font-format-toolbar-plugin",
    "type": "registry:ui",
    "registryDependencies": [
      "toggle",
      "https://shadcn-editor.vercel.app/r/toolbar-plugin.json",
    ],
    "dependencies": ["@lexical/table"],
    "files": [
      {
        "path": "editor/plugins/toolbar/font-format-toolbar-plugin.tsx",
        "target": "components/editor/plugins/toolbar/font-format-toolbar-plugin.tsx",
        "type": "registry:component"
      }
    ]
  },
  {
    "name": "subsuper-toolbar-plugin",
    "type": "registry:ui",
    "registryDependencies": [
      "toggle-group",
      "https://shadcn-editor.vercel.app/r/toolbar-plugin.json",
    ],
    "dependencies": ["@lexical/table"],
    "files": [
      {
        "path": "editor/plugins/toolbar/subsuper-toolbar-plugin.tsx",
        "target": "components/editor/plugins/toolbar/subsuper-toolbar-plugin.tsx",
        "type": "registry:component"
      }
    ]
  },
  {
    "name": "font-color-toolbar-plugin",
    "type": "registry:ui",
    "registryDependencies": [
      "https://shadcn-editor.vercel.app/r/toolbar-plugin.json",
    ],
    "dependencies": ["@lexical/selection"],
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
      }
    ]
  },
  {
    "name": "element-format-toolbar-plugin",
    "type": "registry:ui",
    "registryDependencies": [
      "separator",
      "toggle-group",
      "https://shadcn-editor.vercel.app/r/toolbar-plugin.json",
    ],
    "dependencies": ["@lexical/link", "@lexical/utils"],
    "files": [
      {
        "path": "editor/plugins/toolbar/element-format-toolbar-plugin.tsx",
        "target": "components/editor/plugins/toolbar/element-format-toolbar-plugin.tsx",
        "type": "registry:component"
      }
    ]
  },
  {
    "name": "clear-formatting-toolbar-plugin",
    "type": "registry:ui",
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
  },
  {
    "name": "actions-plugin",
    "type": "registry:ui",
    "registryDependencies": [
      "https://shadcn-editor.vercel.app/r/editor.json",
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
    "files": [
      {
        "path": "editor/plugins/actions/actions-plugin.tsx",
        "target": "components/editor/plugins/actions/actions-plugin.tsx",
        "type": "registry:component"
      }
    ],
  },
  {
    "name": "counter-character-plugin",
    "type": "registry:ui",
    "files": [
      {
        "path": "editor/plugins/actions/actions-plugin.tsx",
        "target": "components/editor/plugins/actions/actions-plugin.tsx",
        "type": "registry:component"
      }
    ],
  },
  {
    "name": "speech-to-text-plugin",
    "type": "registry:ui",
    "files": [
      {
        "path": "editor/plugins/actions/actions-plugin.tsx",
        "target": "components/editor/plugins/actions/actions-plugin.tsx",
        "type": "registry:component"
      }
    ],
  },
  {
    "name": "share-content-plugin",
    "type": "registry:ui",
    "files": [
      {
        "path": "editor/plugins/actions/actions-plugin.tsx",
        "target": "components/editor/plugins/actions/actions-plugin.tsx",
        "type": "registry:component"
      }
    ],
  },
  {
    "name": "import-export-plugin",
    "type": "registry:ui",
    "files": [
      {
        "path": "editor/plugins/actions/actions-plugin.tsx",
        "target": "components/editor/plugins/actions/actions-plugin.tsx",
        "type": "registry:component"
      }
    ],
  },
  {
    "name": "markdown-toggle-plugin",
    "type": "registry:ui",
    "files": [
      {
        "path": "editor/plugins/actions/actions-plugin.tsx",
        "target": "components/editor/plugins/actions/actions-plugin.tsx",
        "type": "registry:component"
      }
    ],
  },
  {
    "name": "clear-editor-plugin",
    "type": "registry:ui",
    "files": [
      {
        "path": "editor/plugins/actions/actions-plugin.tsx",
        "target": "components/editor/plugins/actions/actions-plugin.tsx",
        "type": "registry:component"
      }
    ],
  },
  {
    "name": "edit-mode-toggle-plugin",
    "type": "registry:ui",
    "files": [
      {
        "path": "editor/plugins/actions/actions-plugin.tsx",
        "target": "components/editor/plugins/actions/actions-plugin.tsx",
        "type": "registry:component"
      }
    ],
  },
  {
    "name": "tree-view-plugin",
    "type": "registry:ui",
    "files": [
      {
        "path": "editor/plugins/actions/actions-plugin.tsx",
        "target": "components/editor/plugins/actions/actions-plugin.tsx",
        "type": "registry:component"
      }
    ],
  },
  {
    "name": "link-plugin",
    "type": "registry:ui",
    "files": [
      {
        "path": "editor/plugins/link-plugin.tsx",
        "target": "components/editor/plugins/link-plugin.tsx",
        "type": "registry:component"
      }
    ],
  },
  {
    "name": "code-plugin",
    "type": "registry:ui",
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
      }
    ],
  },
  {
    "name": "auto-focus-plugin",
    "type": "registry:ui"
  },
  {
    "name": "table-plugin",
    "type": "registry:ui",
    "files": [
      {
        "path": "editor/plugins/table-plugin.tsx",
        "target": "components/editor/plugins/table-plugin.tsx",
        "type": "registry:component"
      }
    ],
  },
  {
    "name": "hashtag-plugin",
    "type": "registry:ui",
    "dependencies": ["@lexical/hashtag"],
  },
  {
    "name": "mention-plugin",
    "type": "registry:ui",
    "files": [
      {
        "path": "editor/plugins/mentions-plugin.tsx",
        "target": "components/editor/plugins/mentions-plugin.tsx",
        "type": "registry:component"
      }
    ],
  },
  {
    "name": "page-break-plugin",
    "type": "registry:ui",
    "files": [
      {
        "path": "editor/plugins/page-break-plugin.tsx",
        "target": "components/editor/plugins/page-break-plugin.tsx",
        "type": "registry:component"
      }
    ],
  },
  {
    "name": "draggable-block-plugin",
    "type": "registry:ui",
    "files": [
      {
        "path": "editor/plugins/draggable-block-plugin.tsx",
        "target": "components/editor/plugins/draggable-block-plugin.tsx",
        "type": "registry:component"
      }
    ],
  },
  {
    "name": "keywords-plugin",
    "type": "registry:ui",
    "files": [
      {
        "path": "editor/plugins/keywords-plugin.tsx",
        "target": "components/editor/plugins/keywords-plugin.tsx",
        "type": "registry:component"
      }
    ],
  },
  {
    "name": "emoji-plugin",
    "type": "registry:ui",
    "files": [
      {
        "path": "editor/plugins/emojis-plugin.tsx",
        "target": "components/editor/plugins/emojis-plugin.tsx",
        "type": "registry:component"
      }
    ],
  },
  {
    "name": "image-plugin",
    "type": "registry:ui",
    "files": [
      {
        "path": "editor/plugins/images-plugin.tsx",
        "target": "components/editor/plugins/images-plugin.tsx",
        "type": "registry:component"
      }
    ],
  },
  {
    "name": "inline-image-plugin",
    "type": "registry:ui",
    "files": [
      {
        "path": "editor/plugins/inline-image-plugin.tsx",
        "target": "components/editor/plugins/inline-image-plugin.tsx",
        "type": "registry:component"
      }
    ],
  },
  {
    "name": "excalidraw-plugin",
    "type": "registry:ui",
    "files": [
      {
        "path": "editor/plugins/excalidraw-plugin.tsx",
        "target": "components/editor/plugins/excalidraw-plugin.tsx",
        "type": "registry:component"
      }
    ],
  },
  {
    "name": "poll-plugin",
    "type": "registry:ui",
    "files": [
      {
        "path": "editor/plugins/poll-plugin.tsx",
        "target": "components/editor/plugins/poll-plugin.tsx",
        "type": "registry:component"
      }
    ],
  },
  {
    "name": "layout-plugin",
    "type": "registry:ui",
    "files": [
      {
        "path": "editor/plugins/layout-plugin.tsx",
        "target": "components/editor/plugins/layout-plugin.tsx",
        "type": "registry:component"
      }
    ],
  },
  {
    "name": "equation-plugin",
    "type": "registry:ui",
    "files": [
      {
        "path": "editor/plugins/equations-plugin.tsx",
        "target": "components/editor/plugins/equations-plugin.tsx",
        "type": "registry:component"
      }
    ],
  },
  {
    "name": "collapsible-plugin",
    "type": "registry:ui",
    "files": [
      {
        "path": "editor/plugins/collapsible-plugin.tsx",
        "target": "components/editor/plugins/collapsible-plugin.tsx",
        "type": "registry:component"
      }
    ],
  },
  {
    "name": "auto-embed-plugin",
    "type": "registry:ui",
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
        "path": "editor/plugins/embeds/twitter-plugin.tsx",
        "target": "components/editor/plugins/embeds/twitter-plugin.tsx",
        "type": "registry:component"
      },
      {
        "path": "editor/plugins/embeds/youtube-plugin.tsx",
        "target": "components/editor/plugins/embeds/youtube-plugin.tsx",
        "type": "registry:component"
      }
    ],
  },
  {
    "name": "markdown-plugin",
    "type": "registry:ui",
    "dependencies": ["@lexical/markdown"],
  },
  {
    "name": "typing-pref-plugin",
    "type": "registry:ui",
    "files": [
      {
        "path": "editor/plugins/typing-pref-plugin.tsx",
        "target": "components/editor/plugins/typing-pref-plugin.tsx",
        "type": "registry:component"
      }
    ],
  },
  {
    "name": "tab-focus-plugin",
    "type": "registry:ui",
    "files": [
      {
        "path": "editor/plugins/tab-focus-plugin.tsx",
        "target": "components/editor/plugins/tab-focus-plugin.tsx",
        "type": "registry:component"
      }
    ],
  },
  {
    "name": "autocomplete-plugin",
    "type": "registry:ui",
    "files": [
      {
        "path": "editor/plugins/autocomplete-plugin.tsx",
        "target": "components/editor/plugins/autocomplete-plugin.tsx",
        "type": "registry:component"
      }
    ],
  },
  {
    "name": "component-picker-menu-plugin",
    "type": "registry:ui",
    "files": [
      {
        "path": "editor/plugins/component-picker-menu-plugin.tsx",
        "target": "components/editor/plugins/component-picker-menu-plugin.tsx",
        "type": "registry:component"
      }
    ],
  },
  {
    "name": "context-menu-plugin",
    "type": "registry:ui",
    "files": [
      {
        "path": "editor/plugins/context-menu-plugin.tsx",
        "target": "components/editor/plugins/context-menu-plugin.tsx",
        "type": "registry:component"
      }
    ],
  },
  {
    "name": "drag-drop-paste-plugin",
    "type": "registry:ui",
    "files": [
      {
        "path": "editor/plugins/drag-drop-paste-plugin.tsx",
        "target": "components/editor/plugins/drag-drop-paste-plugin.tsx",
        "type": "registry:component"
      }
    ],
  },
  {
    "name": "floating-text-format-plugin",
    "type": "registry:ui",
    "files": [
      {
        "path": "editor/plugins/floating-text-format-plugin.tsx",
        "target": "components/editor/plugins/floating-text-format-plugin.tsx",
        "type": "registry:component"
      }
    ],
  }
]
