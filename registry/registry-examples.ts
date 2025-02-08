import { type Registry } from "shadcn/registry"

export const examples: Registry["items"] = [
  {
    name: "rich-text-editor-demo",
    type: "registry:example",
    registryDependencies: ["https://shadcn-editor.vercel.app/r/rich-text-editor-plugin.json"],
    files: [
      {
        path: "examples/rich-text-editor-demo.tsx",
        type: "registry:example",
      },
    ],
  },
  {
    name: "actions-demo",
    type: "registry:example",
    registryDependencies: ["https://shadcn-editor.vercel.app/r/actions-plugin.json", "button"],
    files: [
      {
        path: "examples/actions-demo.tsx",
        type: "registry:example",
      },
    ],
  },
  {
    name: "toolbar-demo",
    type: "registry:example",
    registryDependencies: ["https://shadcn-editor.vercel.app/r/toolbar-plugin.json", "button"],
    files: [
      {
        path: "examples/toolbar-demo.tsx",
        type: "registry:example",
      },
    ],
  },
]
