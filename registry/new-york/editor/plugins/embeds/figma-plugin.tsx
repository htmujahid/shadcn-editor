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

import { $createFigmaNode, FigmaNode } from '@/registry/new-york/editor/nodes/embeds/figma-node'

export const INSERT_FIGMA_COMMAND: LexicalCommand<string> = createCommand(
  'INSERT_FIGMA_COMMAND'
)

export function FigmaPlugin(): JSX.Element | null {
  const [editor] = useLexicalComposerContext()

  useEffect(() => {
    if (!editor.hasNodes([FigmaNode])) {
      throw new Error('FigmaPlugin: FigmaNode not registered on editor')
    }

    return editor.registerCommand<string>(
      INSERT_FIGMA_COMMAND,
      (payload) => {
        const figmaNode = $createFigmaNode(payload)
        $insertNodeToNearestRoot(figmaNode)
        return true
      },
      COMMAND_PRIORITY_EDITOR
    )
  }, [editor])

  return null
}
