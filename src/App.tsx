import { BlockViewerProvider } from "./components/block-viewer-provider";
import { BlockViewerSidebar } from "./components/block-viewer-sidebar";
import { Editor } from "./components/blocks/editor-x";
import { SidebarInset, SidebarProvider } from "./components/ui/sidebar";

export function App() {
  return (
    <BlockViewerProvider>
      <SidebarProvider
        defaultOpen={true}
        className="bg-background text-foreground"
      >
        <BlockViewerSidebar />
        <SidebarInset>
          <div className="flex h-svh flex-col py-2 pr-1 md:w-[calc(100vw-260px)]">
            <Editor />
          </div>
        </SidebarInset>
      </SidebarProvider>
    </BlockViewerProvider>
  );
}

export default App;
