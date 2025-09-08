"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"

import { type DocsConfig } from "@/lib/docs"
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
} from "@/registry/new-york-v4/ui/sidebar"

export function DocsSidebar({
  tree,
  ...props
}: React.ComponentProps<typeof Sidebar> & { tree: DocsConfig["sidebarNav"] }) {
  const pathname = usePathname()

  return (
    <Sidebar
      className="sticky top-[calc(var(--header-height)+1px)] z-30 hidden h-[calc(100svh-var(--header-height)-var(--footer-height))] bg-transparent lg:flex"
      collapsible="none"
      {...props}
    >
      <SidebarContent className="no-scrollbar px-2 pb-12">
        <div className="h-(--top-spacing) shrink-0" />
        {tree.map((item) => (
          <SidebarGroup key={item.title}>
            <SidebarGroupLabel className="text-muted-foreground font-medium">
              {item.title}
            </SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu className="gap-0.5">
                {item.items.map((item) => {
                  return (
                    <SidebarMenuItem key={item.href}>
                      <SidebarMenuButton
                        asChild
                        isActive={item.href === pathname}
                        className="data-[active=true]:bg-accent data-[active=true]:border-accent relative h-[30px] w-fit overflow-visible border border-transparent text-[0.8rem] font-medium after:absolute after:inset-x-0 after:-inset-y-1 after:z-0 after:rounded-md"
                      >
                        <Link href={item.href ?? ""}>{item.title}</Link>
                      </SidebarMenuButton>
                      {item.items?.length ? (
                        <SidebarMenuSub>
                          {item.items.map((item) => (
                            <SidebarMenuSubItem key={item.title}>
                              <SidebarMenuSubButton
                                asChild
                                isActive={item.href === pathname}
                                className="data-[active=true]:bg-accent data-[active=true]:border-accent relative h-[30px] w-fit overflow-visible border border-transparent text-[0.8rem] font-medium after:absolute after:inset-x-0 after:-inset-y-1 after:z-0 after:rounded-md"
                              >
                                <Link href={item.href ?? ""}>{item.title}</Link>
                              </SidebarMenuSubButton>
                            </SidebarMenuSubItem>
                          ))}
                        </SidebarMenuSub>
                      ) : null}
                    </SidebarMenuItem>
                  )
                })}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        ))}
      </SidebarContent>
    </Sidebar>
  )

  // return (
  //   <Sidebar
  //     className="sticky top-[calc(var(--header-height)+1px)] z-30 hidden h-[calc(100svh-var(--header-height)-var(--footer-height))] bg-transparent lg:flex"
  //     collapsible="none"
  //     {...props}
  //   >
  //     <SidebarContent className="no-scrollbar px-2 pb-12">
  //       <div className="h-(--top-spacing) shrink-0" />
  //       {tree.children.map((item) => (
  //         <SidebarGroup key={item.$id}>
  //           <SidebarGroupLabel className="text-muted-foreground font-medium">
  //             {item.name}
  //           </SidebarGroupLabel>
  //           <SidebarGroupContent>
  //             {item.type === "folder" && (
  //               <SidebarMenu className="gap-0.5">
  //                 {item.children.map((item) => {
  //                   return (
  //                     item.type === "page" && (
  //                       <SidebarMenuItem key={item.url}>
  //                         <SidebarMenuButton
  //                           asChild
  //                           isActive={item.url === pathname}
  //                           className="data-[active=true]:bg-accent data-[active=true]:border-accent relative h-[30px] w-fit overflow-visible border border-transparent text-[0.8rem] font-medium after:absolute after:inset-x-0 after:-inset-y-1 after:z-0 after:rounded-md"
  //                         >
  //                           <Link href={item.url}>{item.name}</Link>
  //                         </SidebarMenuButton>
  //                       </SidebarMenuItem>
  //                     )
  //                   )
  //                 })}
  //               </SidebarMenu>
  //             )}
  //           </SidebarGroupContent>
  //         </SidebarGroup>
  //       ))}
  //     </SidebarContent>
  //   </Sidebar>
  // )
}
