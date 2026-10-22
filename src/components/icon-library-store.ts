import { useSyncExternalStore } from "react";

export const ICON_LIBRARIES = [
  { value: "lucide", label: "Lucide" },
  { value: "tabler", label: "Tabler Icons" },
  { value: "hugeicons", label: "HugeIcons" },
  { value: "phosphor", label: "Phosphor Icons" },
  { value: "remixicon", label: "Remix Icon" },
] as const;

export type IconLibraryName = (typeof ICON_LIBRARIES)[number]["value"];

const DEFAULT_ICON_LIBRARY: IconLibraryName = "lucide";

let iconLibrary: IconLibraryName = DEFAULT_ICON_LIBRARY;
const listeners = new Set<() => void>();

function subscribe(listener: () => void) {
  listeners.add(listener);
  return () => {
    listeners.delete(listener);
  };
}

function getSnapshot() {
  return iconLibrary;
}

function getServerSnapshot() {
  return DEFAULT_ICON_LIBRARY;
}

export function setIconLibrary(next: IconLibraryName) {
  if (next === iconLibrary) {
    return;
  }
  iconLibrary = next;
  listeners.forEach((listener) => listener());
}

export function useIconLibrary() {
  return useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
}
