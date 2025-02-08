import { type Registry } from "shadcn/registry"

export const ui: Registry["items"] = [
  {
    "name": "rich-text-plugin",
    "type": "registry:ui",
    "dependencies": ["@lexical/rich-text"],
    "files": [
      {
        "path": "editor/editor-ui/content-editable.tsx",
        "target": "components/editor/editor-ui/content-editable.tsx",
        "type": "registry:ui"
      }
    ]
  }
]
