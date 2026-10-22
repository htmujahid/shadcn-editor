import { type ComponentProps, Suspense, lazy } from "react";

import { SquareIcon } from "lucide-react";

import {
  type IconLibraryName,
  useIconLibrary,
} from "@/components/icon-library-store";
import { IconLucide } from "@/components/icons/icon-lucide";

const IconTabler = lazy(() =>
  import("@/components/icons/icon-tabler").then((mod) => ({
    default: mod.IconTabler,
  })),
);

const IconHugeicons = lazy(() =>
  import("@/components/icons/icon-hugeicons").then((mod) => ({
    default: mod.IconHugeicons,
  })),
);

const IconPhosphor = lazy(() =>
  import("@/components/icons/icon-phosphor").then((mod) => ({
    default: mod.IconPhosphor,
  })),
);

const IconRemixicon = lazy(() =>
  import("@/components/icons/icon-remixicon").then((mod) => ({
    default: mod.IconRemixicon,
  })),
);

// Markers for the shadcn CLI: when this registry is installed, every
// <IconPlaceholder /> is rewritten to the icon of the consumer's
// `iconLibrary` (components.json) and this import is removed. Locally it
// renders the icon of the library picked in the site header (live preview).
type IconPlaceholderProps = {
  [K in IconLibraryName]?: string;
} & Omit<
  ComponentProps<"svg">,
  "ref" | "children" | "width" | "height" | "strokeWidth"
>;

export function IconPlaceholder({
  lucide,
  tabler,
  hugeicons,
  phosphor,
  remixicon,
  ...props
}: IconPlaceholderProps) {
  const iconLibrary = useIconLibrary();
  const names = { lucide, tabler, hugeicons, phosphor, remixicon };
  const name = names[iconLibrary];

  if (!name) {
    return null;
  }

  return (
    <Suspense fallback={<SquareIcon {...props} />}>
      {iconLibrary === "lucide" && <IconLucide name={name} {...props} />}
      {iconLibrary === "tabler" && <IconTabler name={name} {...props} />}
      {iconLibrary === "hugeicons" && <IconHugeicons name={name} {...props} />}
      {iconLibrary === "phosphor" && <IconPhosphor name={name} {...props} />}
      {iconLibrary === "remixicon" && <IconRemixicon name={name} {...props} />}
    </Suspense>
  );
}
