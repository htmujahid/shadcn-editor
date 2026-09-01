import { useEffect, useState } from "react";

import { Check, Code, Copy, Terminal } from "lucide-react";
import { codeToHtml } from "shiki";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Spinner } from "@/components/ui/spinner";

const REGISTRY_ITEM = "@shadcn-editor/editor-x";

const PACKAGE_MANAGERS = ["pnpm", "npm", "yarn", "bun"] as const;

type PackageManager = (typeof PACKAGE_MANAGERS)[number];

const INSTALL_COMMANDS: Record<PackageManager, string> = {
  pnpm: `pnpm dlx shadcn@latest add ${REGISTRY_ITEM}`,
  npm: `npx shadcn@latest add ${REGISTRY_ITEM}`,
  yarn: `yarn shadcn@latest add ${REGISTRY_ITEM}`,
  bun: `bunx --bun shadcn@latest add ${REGISTRY_ITEM}`,
};

const sources = import.meta.glob<string>("/src/components/examples/*.tsx", {
  query: "?raw",
  import: "default",
});

function CopyButton({
  value,
  className,
}: {
  value: string;
  className?: string;
}) {
  const [copied, setCopied] = useState(false);

  return (
    <Button
      variant="ghost"
      size="icon-sm"
      aria-label={copied ? "Copied" : "Copy"}
      className={className}
      onClick={() => {
        void navigator.clipboard.writeText(value).then(() => {
          setCopied(true);
          setTimeout(() => setCopied(false), 1500);
        });
      }}
    >
      {copied ? <Check /> : <Copy />}
    </Button>
  );
}

function InstallCommand() {
  const [packageManager, setPackageManager] = useState<PackageManager>("pnpm");
  const command = INSTALL_COMMANDS[packageManager];

  return (
    <div className="flex shrink-0 flex-col gap-2">
      <span className="text-sm font-medium">Installation</span>
      <div className="overflow-hidden rounded-lg border bg-card">
        <div className="flex items-center gap-1 border-b px-2.5 py-1.5">
          <Terminal className="me-1 size-3.5 opacity-70" />
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
          <CopyButton value={command} className="ms-auto" />
        </div>
        <pre className="overflow-x-auto px-4 py-3.5 font-mono text-[13px]">
          {command}
        </pre>
      </div>
    </div>
  );
}

function GeneratedCode({ path }: { path: string }) {
  const [code, setCode] = useState<string | null>(null);
  const [html, setHtml] = useState<string | null>(null);
  const fileName = path.split("/").pop();

  useEffect(() => {
    let cancelled = false;
    async function load() {
      const raw = await sources[path]();
      const highlighted = await codeToHtml(raw, {
        lang: "tsx",
        themes: { light: "github-light", dark: "github-dark" },
      });
      if (!cancelled) {
        setCode(raw);
        setHtml(highlighted);
      }
    }
    void load();
    return () => {
      cancelled = true;
    };
  }, [path]);

  return (
    <div className="flex min-h-0 flex-1 flex-col gap-2">
      <span className="text-sm font-medium">Code</span>
      <figure className="flex min-h-48 flex-1 flex-col overflow-hidden rounded-lg border bg-card">
        <figcaption className="flex h-10 shrink-0 items-center gap-2 border-b px-4 text-[13px] font-medium">
          {fileName}
          {code !== null && <CopyButton value={code} className="ms-auto" />}
        </figcaption>
        {html === null ? (
          <div className="flex flex-1 items-center justify-center py-10">
            <Spinner />
          </div>
        ) : (
          <div
            dangerouslySetInnerHTML={{ __html: html }}
            className="min-h-0 flex-1 overflow-auto text-[13px] [&_pre]:m-0 [&_pre]:min-w-fit [&_pre]:px-4 [&_pre]:py-3.5 [&_pre]:outline-none"
          />
        )}
      </figure>
    </div>
  );
}

export function CodeDialog({ title, path }: { title: string; path: string }) {
  return (
    <Dialog>
      <DialogTrigger
        render={
          <Button
            variant="ghost"
            size="xs"
            className="text-muted-foreground hover:text-foreground"
          >
            <Code />
            View Code
          </Button>
        }
      />
      <DialogContent className="flex max-h-[85vh] flex-col gap-0 overflow-hidden p-0 sm:max-w-3xl">
        <DialogHeader className="shrink-0 border-b px-6 py-4">
          <DialogTitle>{title}</DialogTitle>
          <DialogDescription>
            Install the editor with the shadcn CLI, then replace it with the
            code below to match your customizations.
          </DialogDescription>
        </DialogHeader>
        <div className="flex min-h-0 flex-1 flex-col gap-5 overflow-hidden p-6">
          <InstallCommand />
          <GeneratedCode path={path} />
        </div>
      </DialogContent>
    </Dialog>
  );
}
