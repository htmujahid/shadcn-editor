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
          title: "Actions",
          href: "/docs/plugins/actions",
          items: [],
        },
        {
          title: "Toolbar",
          href: "/docs/plugins/toolbar",
          items: [],
        },
        {
          title: "History",
          href: "/docs/plugins/history-toolbar",
          items: [],
        },
      ],
    },
  ],
}
