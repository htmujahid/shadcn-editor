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
        "path": "editor/plugins/toolbar/font-family-toolbar-plugin",
        "target": "components/editor/plugins/toolbar/font-family-toolbar-plugin",
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
        "path": "editor/plugins/toolbar/font-size-toolbar-plugin",
        "target": "components/editor/plugins/toolbar/font-size-toolbar-plugin",
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
        "path": "editor/plugins/toolbar/font-format-toolbar-plugin",
        "target": "components/editor/plugins/toolbar/font-format-toolbar-plugin",
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
        "path": "editor/plugins/toolbar/subsuper-toolbar-plugin",
        "target": "components/editor/plugins/toolbar/subsuper-toolbar-plugin",
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
        "path": "editor/plugins/toolbar/font-color-toolbar-plugin",
        "target": "components/editor/plugins/toolbar/font-color-toolbar-plugin",
        "type": "registry:component"
      },
      {
        "path": "editor/plugins/toolbar/font-background-toolbar-plugin",
        "target": "components/editor/plugins/toolbar/font-background-toolbar-plugin",
        "type": "registry:component"
      },
      {
        "path": "editor/editor-ui/colorpicker",
        "target": "components/editor/editor-ui/colorpicker",
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
        "path": "editor/plugins/toolbar/element-format-toolbar-plugin",
        "target": "components/editor/plugins/toolbar/element-format-toolbar-plugin",
        "type": "registry:component"
      }
    ]
  },
  {
    "name": "clear-formatting-toolbar-plugin",
    "type": "registry:ui",
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
    "name": "clear-editor-action-plugin",
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
  },
  {
    "name": "code-plugin",
    "type": "registry:ui",
  },
  {
    "name": "auto-focus-plugin",
    "type": "registry:ui",
  },
  {
    "name": "table-plugin",
    "type": "registry:ui",
  },
  {
    "name": "hashtag-plugin",
    "type": "registry:ui",
  },
  {
    "name": "mention-plugin",
    "type": "registry:ui",
  },
  {
    "name": "page-break-plugin",
    "type": "registry:ui",
  },
  {
    "name": "draggable-block-plugin",
    "type": "registry:ui",
  },
  {
    "name": "keywords-plugin",
    "type": "registry:ui",
  },
  {
    "name": "emoji-plugin",
    "type": "registry:ui",
  },
  {
    "name": "image-plugin",
    "type": "registry:ui",
  },
  {
    "name": "inline-image-plugin",
    "type": "registry:ui",
  },
  {
    "name": "excalidraw-plugin",
    "type": "registry:ui",
  },
  {
    "name": "poll-plugin",
    "type": "registry:ui",
  },
  {
    "name": "layout-plugin",
    "type": "registry:ui",
  },
  {
    "name": "equation-plugin",
    "type": "registry:ui",
  },
  {
    "name": "collapsible-plugin",
    "type": "registry:ui",
  },
  {
    "name": "auto-embed-plugin",
    "type": "registry:ui",
  },
  {
    "name": "markdown-plugin",
    "type": "registry:ui",
  },
  {
    "name": "mention-plugin",
    "type": "registry:ui",
  },
  {
    "name": "typing-pref-plugin",
    "type": "registry:ui",
  },
  {
    "name": "tab-focus-plugin",
    "type": "registry:ui",
  },
  {
    "name": "autocomplete-plugin",
    "type": "registry:ui",
  },
  {
    "name": "component-picker-menu-plugin",
    "type": "registry:ui",
  },
  {
    "name": "context-menu-plugin",
    "type": "registry:ui",
  },
  {
    "name": "drag-drop-paste-plugin",
    "type": "registry:ui",
  },
  {
    "name": "floating-text-format-plugin",
    "type": "registry:ui",
  },
  {
    "name": "clear-editor-plugin",
    "type": "registry:ui",
  },
  {
    "name": "embeds-plugin",
    "type": "registry:ui",
  },
  {
    "name": "horizontal-rule-plugin",
    "type": "registry:ui",
  },
]
