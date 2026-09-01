import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area"
import { cn } from "@/lib/utils"

export function ActivityBar({
  children,
  className,
}: {
  children: React.ReactNode
  className?: string
}) {
  return (
    <ScrollArea
      data-slot="activitybar"
      className={cn("w-full shrink-0 border-t border-input", className)}
    >
      <div className="flex h-10 w-max min-w-full items-center justify-between gap-3 px-4 text-xs whitespace-nowrap text-muted-foreground">
        {children}
      </div>
      <ScrollBar orientation="horizontal" />
    </ScrollArea>
  )
}
