import { useEffect } from "react";

import { DemoEditor } from "@/components/demo/demo-editor";

export function DemoPage() {
  useEffect(() => {
    document.title = "Demo - Shadcn Editor";
  }, []);

  return <DemoEditor />;
}
