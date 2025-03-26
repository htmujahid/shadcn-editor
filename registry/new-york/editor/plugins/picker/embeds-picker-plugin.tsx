import { INSERT_EMBED_COMMAND } from "@lexical/react/LexicalAutoEmbedPlugin"

import { CustomEmbedConfig, EmbedConfigs } from "@/registry/new-york/editor/plugins/embeds/auto-embed-plugin"
import { ComponentPickerOption } from "@/registry/new-york/editor/plugins/picker/component-picker-option";

export function EmbedsPickerPlugin({
  embed
}: {
  embed: 'figma' | 'tweet' | 'youtube-video'
}) {
  const embedConfig = EmbedConfigs.find((config) => config.type === embed) as CustomEmbedConfig

  return new ComponentPickerOption(`Embed ${embedConfig.contentName}`, {
    icon: embedConfig.icon,
    keywords: [...embedConfig.keywords, 'embed'],
    onSelect: (_, editor) =>
      editor.dispatchCommand(INSERT_EMBED_COMMAND, embedConfig.type),
  })
}