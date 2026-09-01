import { useEffect } from "react";

import { Link } from "wouter";

import { CodeDialog } from "@/components/code-dialog";
import { EditorX } from "@/components/examples/editor-x";
import { GitHubIcon } from "@/components/github-icon";
import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";
import { buttonVariants } from "@/components/ui/button";
import { TooltipProvider } from "@/components/ui/tooltip";
import { cn } from "@/lib/utils";

export function HomePage() {
  useEffect(() => {
    document.title = "Shadcn Editor";
  }, []);

  return (
    <TooltipProvider>
      <div className="flex min-h-svh flex-col bg-background">
        <SiteHeader />
        <main className="flex flex-1 flex-col">
          <section className="mx-auto w-full max-w-[1400px] px-4 pt-10 pb-8 text-center md:px-6 md:pt-14">
            <h1 className="mx-auto max-w-2xl text-3xl font-bold tracking-tight text-balance sm:text-4xl">
              Beautifully crafted rich text editors
            </h1>
            <p className="mx-auto mt-3 max-w-2xl text-base text-balance text-muted-foreground sm:text-lg">
              Copy-and-paste editor components built with Lexical and shadcn/ui:
              accessible, localized, and RTL-ready. Try it below.
            </p>
            <div className="mt-6 flex items-center justify-center gap-2">
              <Link href="/examples" className={cn(buttonVariants())}>
                Browse Examples
              </Link>
              <a
                href="https://github.com/htmujahid/shadcn-editor"
                target="_blank"
                rel="noreferrer"
                className={cn(buttonVariants({ variant: "outline" }))}
              >
                <GitHubIcon className="size-4" />
                GitHub
              </a>
            </div>
          </section>
          <section className="mx-auto flex w-full max-w-[1400px] flex-1 flex-col px-4 pb-16 md:px-6">
            <div className="flex h-[560px] flex-col gap-1">
              <div className="flex items-center justify-between">
                <h2 className="text-sm font-medium">Editor X</h2>
                <CodeDialog
                  title="Editor X"
                  path="/src/components/examples/editor-x.tsx"
                />
              </div>
              <EditorX />
            </div>
          </section>
        </main>
        <SiteFooter />
      </div>
    </TooltipProvider>
  );
}
