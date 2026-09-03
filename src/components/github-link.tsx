import { GitHubIcon } from "@/components/github-icon";
import { Button } from "@/components/ui/button";
import { siteConfig } from "@/lib/config";

export function GitHubLink() {
  return (
    <Button
      size="icon"
      variant="ghost"
      nativeButton={false}
      className="size-8 shadow-none"
      render={
        <a
          href={siteConfig.links.github}
          target="_blank"
          rel="noreferrer"
          aria-label="GitHub"
        />
      }
    >
      <GitHubIcon className="size-4" />
    </Button>
  );
}
