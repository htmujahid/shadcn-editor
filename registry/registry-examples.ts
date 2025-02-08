import { type Registry } from "shadcn/registry"

export const examples: Registry["items"] = [
  {
    name: "rich-text-editor-demo",
    type: "registry:example",
    registryDependencies: ["rich-text-editor-plugin"],
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
    registryDependencies: ["actions-plugin", "button"],
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
    registryDependencies: ["toolbar-plugin", "button"],
    files: [
      {
        path: "examples/toolbar-demo.tsx",
        type: "registry:example",
      },
    ],
  },
]
