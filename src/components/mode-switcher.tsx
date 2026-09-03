import { Moon, Sun } from "lucide-react";

import { useTheme } from "@/components/theme-provider";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export function ModeSwitcher({
  variant = "ghost",
  className,
}: {
  variant?: React.ComponentProps<typeof Button>["variant"];
  className?: React.ComponentProps<typeof Button>["className"];
}) {
  const { setTheme } = useTheme();

  const toggleTheme = () => {
    setTheme(
      document.documentElement.classList.contains("dark") ? "light" : "dark",
    );
  };

  return (
    <Button
      variant={variant}
      size="icon"
      className={cn("group/toggle extend-touch-target size-8", className)}
      onClick={toggleTheme}
    >
      <Sun className="dark:hidden" />
      <Moon className="hidden dark:block" />
      <span className="sr-only">Toggle theme</span>
    </Button>
  );
}
