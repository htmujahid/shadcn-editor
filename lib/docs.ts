import { Icons } from "@/components/icons"

export interface NavItem {
  title: string
  href?: string
  disabled?: boolean
  external?: boolean
  icon?: keyof typeof Icons
  label?: string
}

export interface NavItemWithChildren extends NavItem {
  items: NavItemWithChildren[]
}

export interface DocsConfig {
  sidebarNav: NavItemWithChildren[]
}

export const docsConfig: DocsConfig = {
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
              title: "Block Format",
              href: "/docs/plugins/toolbar/block-format-toolbar",
              items: [],
            },
            {
              title: "Clear Formatting",
              href: "/docs/plugins/toolbar/clear-formatting-toolbar",
              items: [],
            },
            {
              title: "Element Format",
              href: "/docs/plugins/toolbar/element-format-toolbar",
              items: [],
            },
            {
              title: "Font Color",
              href: "/docs/plugins/toolbar/font-color-toolbar",
              items: [],
            },
            {
              title: "Font Family",
              href: "/docs/plugins/toolbar/font-family-toolbar",
              items: [],
            },
            {
              title: "Font Format",
              href: "/docs/plugins/toolbar/font-format-toolbar",
              items: [],
            },
            {
              title: "Font Size",
              href: "/docs/plugins/toolbar/font-size-toolbar",
              items: [],
            },
            {
              title: "History",
              href: "/docs/plugins/toolbar/history-toolbar",
              items: [],
            },
            {
              title: "Link",
              href: "/docs/plugins/toolbar/link-toolbar",
              items: [],
            },
            {
              title: "Sub Super",
              href: "/docs/plugins/toolbar/subsuper-toolbar",
              items: [],
            },
          ],
        },
        {
          title: "Actions",
          href: "/docs/plugins/actions",
          items: [
            {
              title: "Clear Editor",
              href: "/docs/plugins/actions/clear-editor",
              items: [],
            },
            {
              title: "Counter Character",
              href: "/docs/plugins/actions/counter-character",
              items: [],
            },
            {
              title: "Edit Mode Toggle",
              href: "/docs/plugins/actions/edit-mode-toggle",
              items: [],
            },
            {
              title: "Import Export",
              href: "/docs/plugins/actions/import-export",
              items: [],
            },
            {
              title: "Markdown Toggle",
              href: "/docs/plugins/actions/markdown-toggle",
              items: [],
            },
            {
              title: "Max Length",
              href: "/docs/plugins/actions/max-length",
              items: [],
            },
            {
              title: "Share Content",
              href: "/docs/plugins/actions/share-content",
              items: [],
            },
            {
              title: "Speech To Text",
              href: "/docs/plugins/actions/speech-to-text",
              items: [],
            },
            {
              title: "Tree View",
              href: "/docs/plugins/actions/tree-view",
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
