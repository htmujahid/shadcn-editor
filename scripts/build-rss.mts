import { promises as fs } from "fs"
import path from "path"

import { blocks } from "../registry/registry-blocks.ts"
import { ui } from "../registry/registry-ui.ts"

const SITE_URL = "https://shadcn-editor.vercel.app"
const FEED_TITLE = "Shadcn Editor Registry"
const FEED_DESCRIPTION =
  "RSS feed for Shadcn Editor UI components and blocks registry"

interface RegistryItem {
  name: string
  type: string
  title?: string
  description?: string
  dependencies?: string[]
  devDependencies?: string[]
  registryDependencies?: string[]
  files?: Array<{ path: string; target?: string; type: string }>
}

function escapeXml(text: string): string {
  return text
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&apos;")
}

function getPluginDocUrl(name: string): string {
  // Map plugin names to their documentation URLs
  // Toolbar plugins
  const toolbarPlugins = [
    "history-toolbar-plugin",
    "block-format-toolbar-plugin",
    "font-family-toolbar-plugin",
    "font-size-toolbar-plugin",
    "font-format-toolbar-plugin",
    "subsuper-toolbar-plugin",
    "font-color-toolbar-plugin",
    "element-format-toolbar-plugin",
    "clear-formatting-toolbar-plugin",
    "link-toolbar-plugin",
  ]

  // Actions plugins
  const actionsPlugins = [
    "max-length-plugin",
    "counter-character-plugin",
    "speech-to-text-plugin",
    "share-content-plugin",
    "import-export-plugin",
    "markdown-toggle-plugin",
    "clear-editor-plugin",
    "edit-mode-toggle-plugin",
    "tree-view-plugin",
  ]

  // Convert plugin name to doc slug (remove -plugin suffix for URL)
  const docSlug = name.replace(/-plugin$/, "")

  if (toolbarPlugins.includes(name)) {
    return `${SITE_URL}/docs/plugins/toolbar/${docSlug}`
  }

  if (actionsPlugins.includes(name)) {
    return `${SITE_URL}/docs/plugins/actions/${docSlug}`
  }

  // Default plugins at root level
  return `${SITE_URL}/docs/plugins/${docSlug}`
}

function getItemLink(item: RegistryItem): string {
  if (item.type === "registry:block") {
    // Blocks use /view/[name] route
    return `${SITE_URL}/view/${item.name}`
  }

  // UI plugins use docs structure
  return getPluginDocUrl(item.name)
}

function generateItemXml(item: RegistryItem, pubDate: string): string {
  const title = item.title || item.name
  const description = item.description || `${title} for Shadcn Editor`
  const link = getItemLink(item)
  const guid = link


  return `    <item>
      <title>${escapeXml(title)}</title>
      <description>${escapeXml(description)}</description>
      <link>${link}</link>
      <guid>${guid}</guid>
      <pubDate>${pubDate}</pubDate>
    </item>`
}

function generateRssFeed(items: RegistryItem[]): string {
  const now = new Date()
  const pubDate = now.toUTCString()
  const lastBuildDate = now.toUTCString()

  const itemsXml = items
    .map((item) => generateItemXml(item, pubDate))
    .join("\n")

  return `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <title>${escapeXml(FEED_TITLE)}</title>
    <description>${escapeXml(FEED_DESCRIPTION)}</description>
    <link>${SITE_URL}</link>
    <atom:link href="${SITE_URL}/rss.xml" rel="self" type="application/rss+xml"/>
    <language>en-us</language>
    <lastBuildDate>${lastBuildDate}</lastBuildDate>
    <generator>Shadcn Editor RSS Generator</generator>
${itemsXml}
  </channel>
</rss>`
}

async function buildRss() {
  const allItems = [...ui, ...blocks] as RegistryItem[]

  console.log(`=� Generating RSS feed for ${allItems.length} items...`)
  console.log(`   - UI plugins: ${ui.length}`)
  console.log(`   - Blocks: ${blocks.length}`)

  const rssFeed = generateRssFeed(allItems)

  const outputPath = path.join(process.cwd(), "public/rss.xml")
  await fs.writeFile(outputPath, rssFeed, "utf-8")

  console.log(` RSS feed generated at ${outputPath}`)
}

try {
  await buildRss()
} catch (error) {
  console.error("Error building RSS feed:", error)
  process.exit(1)
}
