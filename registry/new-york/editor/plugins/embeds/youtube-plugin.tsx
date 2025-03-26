'use client'

/**
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */
import { useEffect, JSX } from 'react'

import { useLexicalComposerContext } from '@lexical/react/LexicalComposerContext'
import { $insertNodeToNearestRoot } from '@lexical/utils'
import { COMMAND_PRIORITY_EDITOR, LexicalCommand, createCommand } from 'lexical'

import {
  $createYouTubeNode,
  YouTubeNode,
} from '@/registry/new-york/editor/nodes/embeds/youtube-node'

export const INSERT_YOUTUBE_COMMAND: LexicalCommand<string> = createCommand(
  'INSERT_YOUTUBE_COMMAND'
)

export function YouTubePlugin(): JSX.Element | null {
  const [editor] = useLexicalComposerContext()

  useEffect(() => {
    if (!editor.hasNodes([YouTubeNode])) {
      throw new Error('YouTubePlugin: YouTubeNode not registered on editor')
    }

    return editor.registerCommand<string>(
      INSERT_YOUTUBE_COMMAND,
      (payload) => {
        const youTubeNode = $createYouTubeNode(payload)
        $insertNodeToNearestRoot(youTubeNode)

        return true
      },
      COMMAND_PRIORITY_EDITOR
    )
  }, [editor])

  return null
}
