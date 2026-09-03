import { useState } from "react";

import { Menu, Moon, Sun } from "lucide-react";
import { Link, useLocation } from "wouter";

import { GitHubIcon } from "@/components/github-icon";
import { useTheme } from "@/components/theme-provider";
import { Button, buttonVariants } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { cn } from "@/lib/utils";

const navLinks = [
  { label: "Home", href: "/" },
  { label: "Examples", href: "/examples" },
  { label: "Collaboration", href: "/collaboration" },
];

function ThemeToggle() {
  const { setTheme } = useTheme();
  return (
    <Button
      variant="ghost"
      size="icon"
      aria-label="Toggle theme"
      onClick={() =>
        setTheme(
          document.documentElement.classList.contains("dark")
            ? "light"
            : "dark",
        )
      }
    >
      <Sun className="dark:hidden" />
      <Moon className="hidden dark:block" />
    </Button>
  );
}

function DesktopNav({ location }: { location: string }) {
  return (
    <nav aria-label="Main" className="hidden items-center gap-5 text-sm md:flex">
      {navLinks.map(({ label, href }) => (
        <Link
          key={label}
          href={href}
          aria-current={location === href ? "page" : undefined}
          className={cn(
            "transition-colors hover:text-foreground",
            location === href
              ? "font-medium text-foreground"
              : "text-muted-foreground",
          )}
        >
          {label}
        </Link>
      ))}
    </nav>
  );
}

function MobileNav({ location }: { location: string }) {
  const [open, setOpen] = useState(false);
  const [prevLocation, setPrevLocation] = useState(location);

  // Close the drawer whenever navigation happens (link tap, back button, etc.).
  if (location !== prevLocation) {
    setPrevLocation(location);
    setOpen(false);
  }

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger
        render={
          <Button
            variant="ghost"
            size="icon"
            className="md:hidden"
            aria-label="Open navigation menu"
          />
        }
      >
        <Menu />
      </SheetTrigger>
      <SheetContent side="left" className="w-72 gap-0 p-0">
        <SheetHeader className="border-b border-border/60 px-4 py-3">
          <SheetTitle>Shadcn Editor</SheetTitle>
          <SheetDescription className="sr-only">
            Site navigation
          </SheetDescription>
        </SheetHeader>
        <nav aria-label="Main" className="flex flex-col gap-1 p-2">
          {navLinks.map(({ label, href }) => (
            <Link
              key={label}
              href={href}
              aria-current={location === href ? "page" : undefined}
              onClick={() => setOpen(false)}
              className={cn(
                "rounded-md px-3 py-2.5 text-base transition-colors hover:bg-accent hover:text-accent-foreground",
                location === href
                  ? "bg-accent font-medium text-accent-foreground"
                  : "text-muted-foreground",
              )}
            >
              {label}
            </Link>
          ))}
        </nav>
      </SheetContent>
    </Sheet>
  );
}

export function SiteHeader() {
  const [location] = useLocation();

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/60 bg-background/80 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="mx-auto flex h-14 w-full max-w-[1400px] items-center gap-2 px-4 md:px-6">
        <MobileNav location={location} />
        <Link
          href="/"
          className="text-sm font-semibold tracking-tight md:hidden"
        >
          Shadcn Editor
        </Link>
        <DesktopNav location={location} />
        <div className="ms-auto flex items-center gap-1.5">
          <a
            href="https://github.com/htmujahid/shadcn-editor"
            target="_blank"
            rel="noreferrer"
            aria-label="GitHub"
            className={cn(buttonVariants({ variant: "ghost", size: "icon" }))}
          >
            <GitHubIcon className="size-4" />
          </a>
          <ThemeToggle />
        </div>
      </div>
    </header>
  );
}
