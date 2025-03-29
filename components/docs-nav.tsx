'use client'

import Link from "next/link"
import { usePathname } from "next/navigation"
import { SidebarNavItem } from "types/nav"

import { type DocsConfig } from "@/config/docs"
import { cn } from "@/lib/utils"
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/registry/new-york/ui/collapsible"
import { ChevronRight } from "lucide-react"

export function DocsNav({ config }: { config: DocsConfig }) {
  const pathname = usePathname()

  const items = config.sidebarNav

  return items.length ? (
    <div className="flex flex-col gap-6">
      {items.map((item, index) => (
        <div key={index} className="flex flex-col gap-1">
          <h4 className="rounded-md px-2 py-1 text-sm font-semibold">
            {item.title}{" "}
            {item.label && (
              <span className="ml-2 rounded-md bg-[#adfa1d] px-1.5 py-0.5 text-xs font-normal leading-none text-[#000000] no-underline group-hover:no-underline">
                {item.label}
              </span>
            )}
          </h4>
          {item?.items?.length && (
            <DocsNavItems items={item.items} pathname={pathname} />
          )}
        </div>
      ))}
    </div>
  ) : null
}

function DocsNavItems({
  items,
  pathname,
}: {
  items: SidebarNavItem[]
  pathname: string | null
}) {
  return items?.length ? (
    <div className="grid grid-flow-row auto-rows-max gap-0.5 text-sm">
      {items.map((item, index) =>
        item.href && !item.disabled ? (
          <Collapsible key={index}>
            <div
              className={cn(
                "flex justify-between group w-full h-8 items-center rounded-lg font-normal text-foreground underline-offset-2 hover:bg-accent hover:text-accent-foreground",
                item.disabled && "cursor-not-allowed opacity-60",
                pathname === item.href &&
                "bg-accent font-medium text-accent-foreground"
              )}
            >
              <Link
                href={item.href}
                className="h-8 flex items-center w-full pl-2"
                target={item.external ? "_blank" : ""}
                rel={item.external ? "noreferrer" : ""}
              >
                {item.title}
                {item.label && (
                  <span className="ml-2 rounded-md bg-[#adfa1d] px-1.5 py-0.5 text-xs leading-none text-[#000000] no-underline group-hover:no-underline">
                    {item.label}
                  </span>
                )}
              </Link>
              {
                item.items.length > 0 && (
                  <CollapsibleTrigger className="[&[data-state=open]>svg]:rotate-90 hover:bg-accent hover:text-accent-foreground p-1 rounded-lg mr-1">
                    <ChevronRight className="duration-300 size-4" />
                    <span className="sr-only">Toggle</span>
                  </CollapsibleTrigger>
                )
              }
            </div>
            {
              item.items.length > 0 && (
                <CollapsibleContent>
                  <div className="mx-3.5 flex min-w-0 translate-x-px flex-col gap-1 border-l border-sidebar-border px-2.5 py-0.5">
                    {item.items.map((subitem, subindex) =>
                      subitem.href && !subitem.disabled && (
                        <Link
                          key={subindex}
                          href={subitem.href}
                          className={cn(
                            "flex justify-between group px-2 w-full h-8 items-center rounded-lg font-normal text-foreground underline-offset-2 hover:bg-accent hover:text-accent-foreground",
                            item.disabled && "cursor-not-allowed opacity-60",
                            pathname === subitem.href &&
                            "bg-accent font-medium text-accent-foreground"
                          )}
                        >
                          {subitem.title}
                        </Link>
                      )
                    )}
                  </div>
                </CollapsibleContent>
              )
            }
          </Collapsible>
        ) : (
          <span
            key={index}
            className={cn(
              "flex w-full cursor-not-allowed items-center rounded-md p-2 text-muted-foreground hover:underline",
              item.disabled && "cursor-not-allowed opacity-60"
            )}
          >
            {item.title}
            {item.label && (
              <span className="ml-2 rounded-md bg-muted px-1.5 py-0.5 text-xs leading-none text-muted-foreground no-underline group-hover:no-underline">
                {item.label}
              </span>
            )}
          </span>
        )
      )}
    </div>
  ) : null
}
