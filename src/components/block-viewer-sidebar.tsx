import { FieldGroup, FieldSeparator } from "@/components/ui/field";
import {
  Picker,
  PickerCheckboxItem,
  PickerContent,
  PickerTrigger,
} from "@/components/ui/picker";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
} from "@/components/ui/sidebar";

import { GetCodeDialog } from "./get-code-dialog";
import {
  BLOCK_FORMAT_ITEM_LABELS,
  BLOCK_INSERT_ITEM_LABELS,
  type BlockFormatItemKey,
  type BlockInsertItemKey,
  COMPONENT_PICKER_ITEM_LABELS,
  type ComponentPickerItemKey,
  FOOTER_ITEM_LABELS,
  type FooterItemKey,
  PLUGIN_ITEM_LABELS,
  type PluginItemKey,
  TOOLBAR_ITEM_LABELS,
  type ToolbarItemKey,
  useBlockViewer,
} from "./block-viewer-provider";

function enabledLabel(enabled: number, total: number) {
  return enabled === total ? "All enabled" : `${enabled} of ${total} enabled`;
}

function ToolbarPicker() {
  const { toolbarItems, toggleToolbarItem } = useBlockViewer();
  const allKeys = Object.keys(TOOLBAR_ITEM_LABELS) as ToolbarItemKey[];
  const enabled = allKeys.filter((k) => toolbarItems[k]).length;

  return (
    <Picker>
      <PickerTrigger label="Toolbar">
        {enabledLabel(enabled, allKeys.length)}
      </PickerTrigger>
      <PickerContent>
        {allKeys.map((key) => (
          <PickerCheckboxItem
            key={key}
            checked={toolbarItems[key]}
            onCheckedChange={() => toggleToolbarItem(key)}
          >
            {TOOLBAR_ITEM_LABELS[key]}
          </PickerCheckboxItem>
        ))}
      </PickerContent>
    </Picker>
  );
}

function BlockFormatPicker() {
  const { blockFormatItems, toggleBlockFormatItem } = useBlockViewer();
  const allKeys = Object.keys(BLOCK_FORMAT_ITEM_LABELS) as BlockFormatItemKey[];
  const enabled = allKeys.filter((k) => blockFormatItems[k]).length;

  return (
    <Picker>
      <PickerTrigger label="Block Format">
        {enabledLabel(enabled, allKeys.length)}
      </PickerTrigger>
      <PickerContent>
        {allKeys.map((key) => (
          <PickerCheckboxItem
            key={key}
            checked={blockFormatItems[key]}
            onCheckedChange={() => toggleBlockFormatItem(key)}
          >
            {BLOCK_FORMAT_ITEM_LABELS[key]}
          </PickerCheckboxItem>
        ))}
      </PickerContent>
    </Picker>
  );
}

function BlockInsertPicker() {
  const { blockInsertItems, toggleBlockInsertItem } = useBlockViewer();
  const allKeys = Object.keys(BLOCK_INSERT_ITEM_LABELS) as BlockInsertItemKey[];
  const enabled = allKeys.filter((k) => blockInsertItems[k]).length;

  return (
    <Picker>
      <PickerTrigger label="Block Insert">
        {enabledLabel(enabled, allKeys.length)}
      </PickerTrigger>
      <PickerContent>
        {allKeys.map((key) => (
          <PickerCheckboxItem
            key={key}
            checked={blockInsertItems[key]}
            onCheckedChange={() => toggleBlockInsertItem(key)}
          >
            {BLOCK_INSERT_ITEM_LABELS[key]}
          </PickerCheckboxItem>
        ))}
      </PickerContent>
    </Picker>
  );
}

function FooterPicker() {
  const { footerItems, toggleFooterItem } = useBlockViewer();
  const allKeys = Object.keys(FOOTER_ITEM_LABELS) as FooterItemKey[];
  const enabled = allKeys.filter((k) => footerItems[k]).length;

  return (
    <Picker>
      <PickerTrigger label="Footer">
        {enabledLabel(enabled, allKeys.length)}
      </PickerTrigger>
      <PickerContent>
        {allKeys.map((key) => (
          <PickerCheckboxItem
            key={key}
            checked={footerItems[key]}
            onCheckedChange={() => toggleFooterItem(key)}
          >
            {FOOTER_ITEM_LABELS[key]}
          </PickerCheckboxItem>
        ))}
      </PickerContent>
    </Picker>
  );
}

function ComponentPickerMenuPicker() {
  const { componentPickerItems, toggleComponentPickerItem } = useBlockViewer();
  const allKeys = Object.keys(
    COMPONENT_PICKER_ITEM_LABELS,
  ) as ComponentPickerItemKey[];
  const enabled = allKeys.filter((k) => componentPickerItems[k]).length;

  return (
    <Picker>
      <PickerTrigger label="Component Picker">
        {enabledLabel(enabled, allKeys.length)}
      </PickerTrigger>
      <PickerContent>
        {allKeys.map((key) => (
          <PickerCheckboxItem
            key={key}
            checked={componentPickerItems[key]}
            onCheckedChange={() => toggleComponentPickerItem(key)}
          >
            {COMPONENT_PICKER_ITEM_LABELS[key]}
          </PickerCheckboxItem>
        ))}
      </PickerContent>
    </Picker>
  );
}

function MiscPicker() {
  const { pluginItems, togglePluginItem } = useBlockViewer();
  const allKeys = Object.keys(PLUGIN_ITEM_LABELS) as PluginItemKey[];
  const enabled = allKeys.filter((k) => pluginItems[k]).length;

  return (
    <Picker>
      <PickerTrigger label="Misc">
        {enabledLabel(enabled, allKeys.length)}
      </PickerTrigger>
      <PickerContent>
        {allKeys.map((key) => (
          <PickerCheckboxItem
            key={key}
            checked={pluginItems[key]}
            onCheckedChange={() => togglePluginItem(key)}
          >
            {PLUGIN_ITEM_LABELS[key]}
          </PickerCheckboxItem>
        ))}
      </PickerContent>
    </Picker>
  );
}

function BlockViewerSidebar() {
  return (
    <Sidebar side="left" variant="floating" className="dark">
      <SidebarHeader className="border-b border-border px-4 py-3">
        <span className="text-sm font-semibold text-foreground">Customize</span>
      </SidebarHeader>

      <SidebarContent>
        <ScrollArea className="flex-1">
          <div className="px-4 py-4">
            <FieldGroup>
              <ToolbarPicker />

              <FieldSeparator />

              <BlockFormatPicker />

              <FieldSeparator />

              <BlockInsertPicker />

              <FieldSeparator />

              <ComponentPickerMenuPicker />

              <FieldSeparator />

              <MiscPicker />

              <FieldSeparator />

              <FooterPicker />
            </FieldGroup>
          </div>
        </ScrollArea>
      </SidebarContent>

      <SidebarFooter className="border-t border-border px-4 py-3">
        <GetCodeDialog />
      </SidebarFooter>
    </Sidebar>
  );
}

export { BlockViewerSidebar };
