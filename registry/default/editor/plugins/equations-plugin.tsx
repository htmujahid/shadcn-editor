'use client'

/**
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */
import { useCallback, useEffect, JSX } from 'react'
import * as React from 'react'

import { useLexicalComposerContext } from '@lexical/react/LexicalComposerContext'
import { $wrapNodeInElement } from '@lexical/utils'
import 'katex/dist/katex.css'
import {
  $createParagraphNode,
  $insertNodes,
  $isRootOrShadowRoot,
  COMMAND_PRIORITY_EDITOR,
  LexicalCommand,
  LexicalEditor,
  createCommand,
} from 'lexical'

import { $createEquationNode, EquationNode } from '@/registry/default/editor/nodes/equation-node'
import KatexEquationAlterer from '@/registry/default/editor/editor-ui/katex-equation-alterer'

type CommandPayload = {
  equation: string
  inline: boolean
}

export const INSERT_EQUATION_COMMAND: LexicalCommand<CommandPayload> =
  createCommand('INSERT_EQUATION_COMMAND')

export function InsertEquationDialog({
  activeEditor,
  onClose,
}: {
  activeEditor: LexicalEditor
  onClose: () => void
}): JSX.Element {
  const onEquationConfirm = useCallback(
    (equation: string, inline: boolean) => {
      activeEditor.dispatchCommand(INSERT_EQUATION_COMMAND, {
        equation,
        inline,
      })
      onClose()
    },
    [activeEditor, onClose]
  )

  return <KatexEquationAlterer onConfirm={onEquationConfirm} />
}

export function EquationsPlugin(): JSX.Element | null {
  const [editor] = useLexicalComposerContext()

  useEffect(() => {
    if (!editor.hasNodes([EquationNode])) {
      throw new Error(
        'EquationsPlugins: EquationsNode not registered on editor'
      )
    }

    return editor.registerCommand<CommandPayload>(
      INSERT_EQUATION_COMMAND,
      (payload) => {
        const { equation, inline } = payload
        const equationNode = $createEquationNode(equation, inline)

        $insertNodes([equationNode])
        if ($isRootOrShadowRoot(equationNode.getParentOrThrow())) {
          $wrapNodeInElement(equationNode, $createParagraphNode).selectEnd()
        }

        return true
      },
      COMMAND_PRIORITY_EDITOR
    )
  }, [editor])

  return null
}
