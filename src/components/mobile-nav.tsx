import * as React from "react";

import { Popover as PopoverPrimitive } from "@base-ui/react/popover";
import { cn } from "cn";
import { Link } from "wouter";

import { Button } from "@/components/ui/button";
import { Popover, PopoverTrigger } from "@/components/ui/popover";

export function MobileNav({
  items,
  className,
}: {
  items: { href: string; label: string }[];
  className?: string;
}) {
  const [open, setOpen] = React.useState(false);

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger
        render={
          <Button
            variant="ghost"
            className={cn(
              "extend-touch-target h-8 touch-manipulation items-center justify-start gap-2.5 p-0! hover:bg-transparent focus-visible:bg-transparent focus-visible:ring-0 active:bg-transparent aria-expanded:bg-transparent dark:hover:bg-transparent",
              className,
            )}
          />
        }
      >
        <div className="relative flex h-8 w-4 items-center justify-center">
          <div className="relative size-4">
            <span
              className={cn(
                "absolute left-0 block h-0.5 w-4 bg-foreground transition-all duration-100",
                open ? "top-[0.4rem] -rotate-45" : "top-1",
              )}
            />
            <span
              className={cn(
                "absolute left-0 block h-0.5 w-4 bg-foreground transition-all duration-100",
                open ? "top-[0.4rem] rotate-45" : "top-2.5",
              )}
            />
          </div>
          <span className="sr-only">Toggle Menu</span>
        </div>
        <span className="flex h-8 items-center text-lg leading-none font-medium">
          Menu
        </span>
      </PopoverTrigger>
      <PopoverPrimitive.Portal>
        <PopoverPrimitive.Positioner
          align="start"
          side="bottom"
          alignOffset={-16}
          sideOffset={12}
          collisionPadding={0}
          className="isolate z-50"
        >
          <PopoverPrimitive.Popup
            data-slot="popover-content"
            className="z-50 no-scrollbar h-(--available-height) w-(--available-width) origin-(--transform-origin) overflow-y-auto bg-background/90 p-0 text-sm text-popover-foreground outline-hidden backdrop-blur"
          >
            <div className="flex flex-col gap-12 overflow-auto px-6 py-6">
              <div className="flex flex-col gap-4">
                <div className="text-sm font-medium text-muted-foreground">
                  Menu
                </div>
                <div className="flex flex-col gap-3">
                  {items.map((item) => (
                    <MobileLink
                      key={item.href}
                      href={item.href}
                      onOpenChange={setOpen}
                    >
                      {item.label}
                    </MobileLink>
                  ))}
                </div>
              </div>
            </div>
          </PopoverPrimitive.Popup>
        </PopoverPrimitive.Positioner>
      </PopoverPrimitive.Portal>
    </Popover>
  );
}

function MobileLink({
  href,
  onOpenChange,
  className,
  children,
}: {
  href: string;
  onOpenChange?: (open: boolean) => void;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <Link
      href={href}
      onClick={() => onOpenChange?.(false)}
      className={cn("flex items-center gap-2 text-2xl font-medium", className)}
    >
      {children}
    </Link>
  );
}
