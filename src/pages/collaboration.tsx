import { useEffect, useMemo } from "react"

import { SiteFooter } from "@/components/site-footer"
import { SiteHeader } from "@/components/site-header"

const frames = [
  { name: "left", label: "User one", group: 0 },
  { name: "right", label: "User two", group: 1 },
]

export function CollaborationPage() {
  useEffect(() => {
    document.title = "Collaboration - Shadcn Editor"
  }, [])

  const editorSrc = useMemo(() => {
    const provider = new URLSearchParams(window.location.search).get("provider")
    return (params: Record<string, string> = {}) => {
      const search = new URLSearchParams(params)
      if (provider) {
        search.set("provider", provider)
      }
      const query = search.toString()
      return query ? `/collaboration/editor?${query}` : "/collaboration/editor"
    }
  }, [])

  return (
    <div className="flex min-h-svh flex-col bg-background">
      <SiteHeader />
      <main className="flex flex-1">
        <section className="mx-auto grid w-full max-w-[1400px] grid-cols-1 gap-4 px-4 py-6 md:px-6 lg:grid-cols-2">
          {frames.map((frame) => (
            <iframe
              key={frame.name}
              name={frame.name}
              title={frame.label}
              src={editorSrc({ u: String(frame.group) })}
              className="h-full min-h-[560px] w-full bg-background"
            />
          ))}
        </section>
      </main>
      <SiteFooter />
    </div>
  )
}
