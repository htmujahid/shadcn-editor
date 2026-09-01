import { exportFile, importFile } from "@lexical/file"
import { $generateHtmlFromNodes } from "@lexical/html"
import {
  $convertToMarkdownString,
  type Transformer,
  TRANSFORMERS,
} from "@lexical/markdown"
import { useLexicalComposerContext } from "@lexical/react/LexicalComposerContext"
import { useLexicalEditable } from "@lexical/react/useLexicalEditable"

import { FileDown, FileUp } from "lucide-react"

import { useTranslation } from "@/components/editor/plugins/i18n-plugin"
import { Button } from "@/components/ui/button"
import { ButtonGroup } from "@/components/ui/button-group"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip"

function toSafeFileName(value: string) {
  return value
    .replace(/[^a-zA-Z0-9-_. ]+/g, "-")
    .replace(/-{2,}/g, "-")
    .replace(/^[-. ]+|[-. ]+$/g, "")
}

function downloadFile(content: string, fileName: string, mimeType: string) {
  const blob = new Blob([content], { type: mimeType })
  const url = URL.createObjectURL(blob)
  const anchor = document.createElement("a")
  anchor.href = url
  anchor.download = fileName
  anchor.click()
  URL.revokeObjectURL(url)
}

export function ImportExportToolbarPlugin({
  transformers = TRANSFORMERS,
}: {
  transformers?: Transformer[]
}) {
  const [editor] = useLexicalComposerContext()
  const { t, dir, language } = useTranslation()
  const isEditable = useLexicalEditable()

  const namespace = editor._config.namespace

  const getFileName = () =>
    toSafeFileName(`${namespace} ${new Date().toISOString()}`)

  const exportLexical = () => {
    exportFile(editor, {
      fileName: getFileName(),
      source: namespace,
    })
  }

  const exportMarkdown = () => {
    const markdown = editor.read(() => $convertToMarkdownString(transformers))
    downloadFile(markdown, `${getFileName()}.md`, "text/markdown")
  }

  const exportHtml = () => {
    const body = editor.read(() => $generateHtmlFromNodes(editor))
    const html = `<!doctype html>\n<html lang="${language}" dir="${dir}">\n<body>\n${body}\n</body>\n</html>`
    downloadFile(html, `${getFileName()}.html`, "text/html")
  }

  return (
    <ButtonGroup>
      <Tooltip>
        <TooltipTrigger
          render={
            <Button
              variant="outline"
              size="icon-sm"
              aria-label={t.importFile}
              disabled={!isEditable}
              onClick={() => {
                importFile(editor)
              }}
            >
              <FileUp />
            </Button>
          }
        />
        <TooltipContent>{t.importFile}</TooltipContent>
      </Tooltip>
      <DropdownMenu>
        <Tooltip>
          <TooltipTrigger
            render={
              <DropdownMenuTrigger
                render={
                  <Button
                    variant="outline"
                    size="icon-sm"
                    aria-label={t.exportAs}
                  >
                    <FileDown />
                  </Button>
                }
              />
            }
          />
          <TooltipContent>{t.exportAs}</TooltipContent>
        </Tooltip>
        <DropdownMenuContent dir={dir}>
          <DropdownMenuItem onClick={exportLexical}>
            {t.exportLexical}
          </DropdownMenuItem>
          <DropdownMenuItem onClick={exportMarkdown}>
            {t.exportMarkdown}
          </DropdownMenuItem>
          <DropdownMenuItem onClick={exportHtml}>
            {t.exportHtml}
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </ButtonGroup>
  )
}
