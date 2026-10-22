import {
  ICON_LIBRARIES,
  type IconLibraryName,
  setIconLibrary,
  useIconLibrary,
} from "@/components/icon-library-store";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export function IconLibrarySwitcher() {
  const iconLibrary = useIconLibrary();

  return (
    <Select
      items={ICON_LIBRARIES}
      value={iconLibrary}
      onValueChange={(value) => {
        if (value) {
          setIconLibrary(value as IconLibraryName);
        }
      }}
    >
      <SelectTrigger size="sm" aria-label="Icon library">
        <SelectValue />
      </SelectTrigger>
      <SelectContent align="end">
        <SelectGroup>
          {ICON_LIBRARIES.map((library) => (
            <SelectItem key={library.value} value={library.value}>
              {library.label}
            </SelectItem>
          ))}
        </SelectGroup>
      </SelectContent>
    </Select>
  );
}
