import { cn } from "@/lib/utils"
import { Button } from "@/registry/new-york-v4/ui/button"

export function OpenInUndocxCta({ className }: React.ComponentProps<"div">) {
  return (
    <div
      className={cn(
        "group bg-surface text-surface-foreground relative flex flex-col gap-2 rounded-lg p-6 text-sm",
        className
      )}
    >
      <div className="text-base leading-tight font-semibold text-balance group-hover:underline">
        Undocx - Collaborative Rich Text Editor
      </div>
      <div className="text-muted-foreground">
        A realtime collaborative editor inspired by Google Docs
      </div>
      <div className="text-muted-foreground">
        Features real-time multi-user editing, cursor presence, threaded comments, and dark mode support.
      </div>
      <Button size="sm" className="mt-2 w-fit">
        Try Undocx
      </Button>
      <a
        href="https://undocx.com"
        target="_blank"
        rel="noreferrer"
        className="absolute inset-0"
      >
        <span className="sr-only">Visit Undocx</span>
      </a>
    </div>
  )
}
