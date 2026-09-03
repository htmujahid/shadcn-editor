import { Link, useLocation } from "wouter";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export function MainNav({
  items,
  className,
  ...props
}: React.ComponentProps<"nav"> & {
  items: { href: string; label: string }[];
}) {
  const [pathname] = useLocation();

  return (
    <nav className={cn("items-center gap-0", className)} {...props}>
      {items.map((item) => (
        <Button
          key={item.href}
          variant="ghost"
          size="sm"
          nativeButton={false}
          className="px-2.5 data-[active=true]:text-foreground data-[active=false]:text-muted-foreground"
          render={
            <Link
              href={item.href}
              data-active={pathname === item.href}
              aria-current={pathname === item.href ? "page" : undefined}
              className="relative items-center"
            />
          }
        >
          {item.label}
        </Button>
      ))}
    </nav>
  );
}
