import { exportFile, importFile } from "@lexical/file";
import { useLexicalComposerContext } from "@lexical/react/LexicalComposerContext";

import { DownloadIcon, UploadIcon } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";

export function ImportExportPlugin() {
  const [editor] = useLexicalComposerContext();
  return (
    <>
      <Tooltip>
        <TooltipTrigger
          render={
            <Button
              variant={"ghost"}
              onClick={() => importFile(editor)}
              title="Import"
              aria-label="Import editor state from JSON"
              size={"sm"}
              className="p-2"
            >
              <UploadIcon className="size-4" />
            </Button>
          }
        />
        <TooltipContent>Import Content</TooltipContent>
      </Tooltip>

      <Tooltip>
        <TooltipTrigger
          render={
            <Button
              variant={"ghost"}
              onClick={() =>
                exportFile(editor, {
                  fileName: `Editor ${new Date().toISOString()}`,
                  source: "Editor",
                })
              }
              title="Export"
              aria-label="Export editor state to JSON"
              size={"sm"}
              className="p-2"
            >
              <DownloadIcon className="size-4" />
            </Button>
          }
        />
        <TooltipContent>Export Content</TooltipContent>
      </Tooltip>
    </>
  );
}
