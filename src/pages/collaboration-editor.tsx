import { useEffect } from "react"

import { CollabEditor } from "@/components/collaboration/collab-editor"

export function CollaborationEditorPage() {
  useEffect(() => {
    document.title = "Collaboration Editor - Shadcn Editor"
  }, [])

  return <CollabEditor />
}
