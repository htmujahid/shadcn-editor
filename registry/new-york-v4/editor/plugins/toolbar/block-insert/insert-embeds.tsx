"use client"

import { INSERT_EMBED_COMMAND } from "@lexical/react/LexicalAutoEmbedPlugin"

import { useToolbarContext } from "@/registry/new-york-v4/editor/context/toolbar-context"
import { EmbedConfigs } from "@/registry/new-york-v4/editor/plugins/embeds/auto-embed-plugin"
import { SelectItem } from "@/registry/new-york-v4/ui/select"

export function InsertEmbeds() {
  const { activeEditor } = useToolbarContext()
  return EmbedConfigs.map((embedConfig) => (
    <SelectItem
      key={embedConfig.type}
      value={embedConfig.type}
      onPointerUp={() => {
        activeEditor.dispatchCommand(INSERT_EMBED_COMMAND, embedConfig.type)
      }}
      className=""
    >
      <div className="flex items-center gap-1">
        {embedConfig.icon}
        <span>{embedConfig.contentName}</span>
      </div>
    </SelectItem>
  ))
}
