import { useEffect } from "react";

import { Compass } from "lucide-react";
import { Link } from "wouter";

import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";
import { buttonVariants } from "@/components/ui/button";
import {
  Empty,
  EmptyContent,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from "@/components/ui/empty";
import { cn } from "@/lib/utils";

export function NotFoundPage() {
  useEffect(() => {
    document.title = "Page Not Found - Shadcn Editor";
  }, []);

  return (
    <div className="flex min-h-svh flex-col bg-background">
      <SiteHeader />
      <main className="flex flex-1 items-center justify-center px-4">
        <Empty>
          <EmptyHeader>
            <EmptyMedia variant="icon">
              <Compass />
            </EmptyMedia>
            <EmptyTitle>Page not found</EmptyTitle>
            <EmptyDescription>
              The page you are looking for does not exist.
            </EmptyDescription>
          </EmptyHeader>
          <EmptyContent>
            <Link
              href="/"
              className={cn(buttonVariants({ variant: "outline" }))}
            >
              Back to home
            </Link>
          </EmptyContent>
        </Empty>
      </main>
      <SiteFooter />
    </div>
  );
}
