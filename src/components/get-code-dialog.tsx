import * as React from "react";

import { Check, Copy, Terminal } from "lucide-react";

import { useCopyToClipboard } from "@/hooks/use-copy-to-clipboard";
import { generateEditorCode } from "@/lib/generate-editor-code";
import { highlightCode } from "@/lib/highlight-code";

import { useBlockViewer } from "./block-viewer-provider";
import { Button } from "./ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "./ui/dialog";

const REGISTRY_ITEM = "@shadcn-editor/editor-x";

const PACKAGE_MANAGERS = ["pnpm", "npm", "yarn", "bun"] as const;

type PackageManager = (typeof PACKAGE_MANAGERS)[number];

const INSTALL_COMMANDS: Record<PackageManager, string> = {
  pnpm: `pnpm dlx shadcn@latest add ${REGISTRY_ITEM}`,
  npm: `npx shadcn@latest add ${REGISTRY_ITEM}`,
  yarn: `yarn shadcn@latest add ${REGISTRY_ITEM}`,
  bun: `bunx --bun shadcn@latest add ${REGISTRY_ITEM}`,
};

function CopyButton({
  value,
  className,
}: {
  value: string;
  className?: string;
}) {
  const { copyToClipboard, isCopied } = useCopyToClipboard();

  return (
    <Button
      variant="ghost"
      size="icon-sm"
      className={className}
      onClick={() => copyToClipboard(value)}
    >
      {isCopied ? <Check /> : <Copy />}
      <span className="sr-only">Copy</span>
    </Button>
  );
}

function InstallCommand() {
  const [packageManager, setPackageManager] =
    React.useState<PackageManager>("pnpm");
  const command = INSTALL_COMMANDS[packageManager];

  return (
    <div className="flex shrink-0 flex-col gap-2">
      <span className="text-sm font-medium">Installation</span>
      <div className="overflow-hidden rounded-lg border bg-surface">
        <div className="flex items-center gap-1 border-b px-2.5 py-1.5">
          <Terminal className="mr-1 size-3.5 opacity-70" />
          {PACKAGE_MANAGERS.map((pm) => (
            <button
              key={pm}
              type="button"
              data-active={packageManager === pm}
              onClick={() => setPackageManager(pm)}
              className="rounded-sm px-2 py-1 font-mono text-xs text-muted-foreground transition-colors hover:text-foreground data-[active=true]:bg-foreground/10 data-[active=true]:text-foreground"
            >
              {pm}
            </button>
          ))}
          <CopyButton value={command} className="ml-auto" />
        </div>
        <pre className="no-scrollbar overflow-x-auto px-4 py-3.5 font-mono text-[13px]">
          {command}
        </pre>
      </div>
    </div>
  );
}

function GeneratedCode({ code }: { code: string }) {
  const [html, setHtml] = React.useState<string>("");

  React.useEffect(() => {
    let cancelled = false;
    highlightCode(code).then((result) => {
      if (!cancelled) {
        setHtml(result);
      }
    });
    return () => {
      cancelled = true;
    };
  }, [code]);

  return (
    <div className="flex min-h-0 flex-1 flex-col gap-2">
      <span className="text-sm font-medium">Code</span>
      <figure className="flex min-h-48 flex-1 flex-col overflow-hidden rounded-lg border bg-surface">
        <figcaption className="flex h-10 shrink-0 items-center gap-2 border-b px-4 text-[13px] font-medium">
          editor-x.tsx
          <CopyButton value={code} className="ml-auto" />
        </figcaption>
        {html ? (
          <div
            // biome-ignore lint/security/noDangerouslySetInnerHtml: shiki output is trusted
            dangerouslySetInnerHTML={{ __html: html }}
            className="no-scrollbar min-h-0 flex-1 overflow-y-auto text-[13px]"
          />
        ) : (
          <pre className="no-scrollbar min-h-0 flex-1 overflow-auto px-4 py-3.5 font-mono text-[13px]">
            {code}
          </pre>
        )}
      </figure>
    </div>
  );
}

function GetCodeDialog() {
  const [open, setOpen] = React.useState(false);
  const state = useBlockViewer();
  const code = React.useMemo(
    () => (open ? generateEditorCode(state) : ""),
    [open, state],
  );

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger
        render={
          <Button size="sm" className="w-full">
            <Terminal />
            Get Code
          </Button>
        }
      />
      <DialogContent className="flex max-h-[85vh] flex-col gap-0 overflow-hidden p-0 sm:max-w-3xl">
        <DialogHeader className="shrink-0 border-b px-6 py-4">
          <DialogTitle>Get Code</DialogTitle>
          <DialogDescription>
            Install the editor with the shadcn CLI, then replace it with the
            code below to match your customizations.
          </DialogDescription>
        </DialogHeader>
        <div className="flex min-h-0 flex-1 flex-col gap-5 overflow-hidden p-6">
          <InstallCommand />
          {open && <GeneratedCode code={code} />}
        </div>
      </DialogContent>
    </Dialog>
  );
}

export { GetCodeDialog };
