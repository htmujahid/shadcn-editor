import { PlusIcon } from "lucide-react";

import { useEditorModal } from "@/components/editor/editor-hooks/use-modal";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export function BlockInsertPlugin({ children }: { children: React.ReactNode }) {
  const [modal] = useEditorModal();

  return (
    <>
      {modal}
      <DropdownMenu>
        <DropdownMenuTrigger
          render={
            <Button variant="ghost" size="sm" className="h-7 gap-1 px-2">
              <PlusIcon className="size-4" />
              <span className="text-sm">Insert</span>
            </Button>
          }
        />
        <DropdownMenuContent className="w-fit">{children}</DropdownMenuContent>
      </DropdownMenu>
    </>
  );
}
