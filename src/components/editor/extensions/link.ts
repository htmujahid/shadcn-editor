import {
  configExtension,
  createCommand,
  defineExtension,
  type LexicalCommand,
} from "lexical"

import { LinkExtension as LexicalLinkExtension } from "@lexical/link"

export const OPEN_LINK_EDITOR_COMMAND: LexicalCommand<void> = createCommand(
  "OPEN_LINK_EDITOR_COMMAND"
)

const SUPPORTED_URL_PROTOCOLS = new Set([
  "http:",
  "https:",
  "mailto:",
  "sms:",
  "tel:",
])

function parseUrl(url: string): URL | null {
  try {
    return new URL(url)
  } catch {
    return null
  }
}

export function sanitizeUrl(url: string): string {
  const parsedUrl = parseUrl(url)
  if (parsedUrl !== null && !SUPPORTED_URL_PROTOCOLS.has(parsedUrl.protocol)) {
    return "about:blank"
  }
  return url
}

const SINGLE_TOKEN_REGEXP = /^\S*\s*$/

const WWW_HOST_REGEXP = /^www\.\S/

export function validateUrl(url: string): boolean {
  if (typeof url !== "string") {
    return false
  }
  if (url === "https://") {
    return true
  }
  if (!SINGLE_TOKEN_REGEXP.test(url)) {
    return false
  }
  let parsed = parseUrl(url)
  if (parsed === null && WWW_HOST_REGEXP.test(url)) {
    parsed = parseUrl(`https://${url}`)
  }
  return parsed !== null && SUPPORTED_URL_PROTOCOLS.has(parsed.protocol)
}

export const LinkExtension = defineExtension({
  name: "@shadcn-editor/editor/Link",
  dependencies: [configExtension(LexicalLinkExtension, { validateUrl })],
})
