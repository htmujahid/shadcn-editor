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
  }
]
