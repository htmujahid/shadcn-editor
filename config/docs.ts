import { MainNavItem, SidebarNavItem } from "types/nav"

export interface DocsConfig {
  mainNav: MainNavItem[]
  sidebarNav: SidebarNavItem[]
}

export const docsConfig: DocsConfig = {
  mainNav: [
    {
      title: "Home",
      href: "/",
    },
    {
      title: "Documentation",
      href: "/docs",
    },
    {
      title: "Editor",
      href: "/docs/components/rich-text-editor",
    },
  ],
  sidebarNav: [
    {
      title: "Getting Started",
      items: [
        {
          title: "Introduction",
          href: "/docs",
          items: [],
        },
        {
          title: "Installation",
          href: "/docs/installation",
          items: [],
        },
        {
          title: "Plugins",
          href: "/docs/plugins",
          items: [],
        },
      ],
    },
    {
      title: "Editor Plugins",
      items: [
        {
          title: "Rich Text Editor",
          href: "/docs/plugins/rich-text-editor",
          items: [],
        },
        {
          title: "Toolbar",
          href: "/docs/plugins/toolbar",
          items: [
            {
              title: "History",
              href: "/docs/plugins/history-toolbar",
              items: [],
            },
            {
              title: "Block Format",
              href: "/docs/plugins/block-format-toolbar",
              items: [],
            },
            {
              title: "Font Family",
              href: "/docs/plugins/font-family-toolbar",
              items: [],
            },
            {
              title: "Font Size",
              href: "/docs/plugins/font-size-toolbar",
              items: [],
            },
            {
              title: "Font Format",
              href: "/docs/plugins/font-format-toolbar",
              items: [],
            },
            {
              title: "Sub Super",
              href: "/docs/plugins/subsuper-toolbar",
              items: [],
            },
            {
              title: "Font Color",
              href: "/docs/plugins/font-color-toolbar",
              items: [],
            },
            {
              title: "Element Format",
              href: "/docs/plugins/element-format-toolbar",
              items: [],
            },
            {
              title: "Clear Formatting",
              href: "/docs/plugins/clear-formatting-toolbar",
              items: [],
            },
            {
              title: "Link",
              href: "/docs/plugins/link-toolbar",
              items: [],
            },
          ],
        },
        {
          title: "Actions",
          href: "/docs/plugins/actions",
          items: [
            {
              title: "Max Length",
              href: "/docs/plugins/max-length",
              items: [],
            },
            {
              title: "Counter Character",
              href: "/docs/plugins/counter-character",
              items: [],
            },
            {
              title: "Speech To Text",
              href: "/docs/plugins/speech-to-text",
              items: [],
            },
            {
              title: "Share Content",
              href: "/docs/plugins/share-content",
              items: [],
            },
            {
              title: "Import Export",
              href: "/docs/plugins/import-export",
              items: [],
            },
            {
              title: "Markdown Toggle",
              href: "/docs/plugins/markdown-toggle",
              items: [],
            },
            {
              title: "Clear Editor",
              href: "/docs/plugins/clear-editor",
              items: [],
            },
            {
              title: "Edit Mode Toggle",
              href: "/docs/plugins/edit-mode-toggle",
              items: [],
            },
            {
              title: "Tree View",
              href: "/docs/plugins/tree-view",
              items: [],
            },
          ],
        },
        {
          title: "Autocomplete",
          href: "/docs/plugins/autocomplete",
          items: [],
        },
        {
          title: "Auto Embed",
          href: "/docs/plugins/auto-embed",
          items: [],
        },
        {
          title: "Auto Focus",
          href: "/docs/plugins/auto-focus",
          items: [],
        },
        {
          title: "Code",
          href: "/docs/plugins/code",
          items: [],
        },
        {
          title: "Collapsible",
          href: "/docs/plugins/collapsible",
          items: [],
        },
        {
          title: "Component Picker Menu",
          href: "/docs/plugins/component-picker-menu",
          items: [],
        },
        {
          title: "Context Menu",
          href: "/docs/plugins/context-menu",
          items: [],
        },
        {
          title: "Draggable Block",
          href: "/docs/plugins/draggable-block",
          items: [],
        },
        {
          title: "Drag Drop Paste",
          href: "/docs/plugins/drag-drop-paste",
          items: [],
        },
        {
          title: "Emoji",
          href: "/docs/plugins/emoji",
          items: [],
        },
        {
          title: "Equation",
          href: "/docs/plugins/equation",
          items: [],
        },
        {
          title: "Excalidraw",
          href: "/docs/plugins/excalidraw",
          items: [],
        },
        {
          title: "Floating Text Format",
          href: "/docs/plugins/floating-text-format",
          items: [],
        },
        {
          title: "Hashtag",
          href: "/docs/plugins/hashtag",
          items: [],
        },
        {
          title: "Horizontal Rule",
          href: "/docs/plugins/horizontal-rule",
          items: [],
        },
        {
          title: "Image",
          href: "/docs/plugins/image",
          items: [],
        },
        {
          title: "Inline Image",
          href: "/docs/plugins/inline-image",
          items: [],
        },
        {
          title: "Keywords",
          href: "/docs/plugins/keywords",
          items: [],
        },
        {
          title: "Layout",
          href: "/docs/plugins/layout",
          items: [],
        },
        {
          title: "Link",
          href: "/docs/plugins/link",
          items: [],
        },
        {
          title: "Markdown",
          href: "/docs/plugins/markdown",
          items: [],
        },
        {
          title: "Mention",
          href: "/docs/plugins/mention",
          items: [],
        },
        {
          title: "Page Break",
          href: "/docs/plugins/page-break",
          items: [],
        },
        {
          title: "Poll",
          href: "/docs/plugins/poll",
          items: [],
        },
        {
          title: "Table",
          href: "/docs/plugins/table",
          items: [],
        },
        {
          title: "Tab Focus",
          href: "/docs/plugins/tab-focus",
          items: [],
        },
        {
          title: "Typing Pref",
          href: "/docs/plugins/typing-pref",
          items: [],
        },
      ],
    },
  ],
}
