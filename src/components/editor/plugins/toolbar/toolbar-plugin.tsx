import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area"
import { cn } from "@/lib/utils"

export function Toolbar({
  className,
  children,
  ...props
}: React.ComponentProps<"div">) {
  return (
    <ScrollArea
      data-slot="toolbar"
      className={cn("w-full border-b bg-muted/30", className)}
      {...props}
    >
      <div
        role="toolbar"
        className="flex w-max min-w-full items-center gap-1 px-2 py-2"
      >
        {children}
      </div>
      <ScrollBar orientation="horizontal" />
    </ScrollArea>
  )
}
