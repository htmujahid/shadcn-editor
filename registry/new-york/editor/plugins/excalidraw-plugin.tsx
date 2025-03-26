'use client'

/**
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */
import { useEffect, useState, JSX } from 'react'

import type { AppState, BinaryFiles } from '@excalidraw/excalidraw/types/types'
import { useLexicalComposerContext } from '@lexical/react/LexicalComposerContext'
import { $wrapNodeInElement } from '@lexical/utils'
import {
  $createParagraphNode,
  $insertNodes,
  $isRootOrShadowRoot,
  COMMAND_PRIORITY_EDITOR,
  LexicalCommand,
  createCommand,
} from 'lexical'

import { $createExcalidrawNode, ExcalidrawNode } from '@/registry/new-york/editor/nodes/excalidraw-node'
import type { ExcalidrawInitialElements } from '@/registry/new-york/editor/editor-ui/excalidraw-modal'
import { ExcalidrawModal } from '@/registry/new-york/editor/editor-ui/excalidraw-modal'

export const INSERT_EXCALIDRAW_COMMAND: LexicalCommand<void> = createCommand(
  'INSERT_EXCALIDRAW_COMMAND'
)

export function ExcalidrawPlugin(): JSX.Element | null {
  const [editor] = useLexicalComposerContext()
  const [isModalOpen, setModalOpen] = useState<boolean>(false)

  useEffect(() => {
    if (!editor.hasNodes([ExcalidrawNode])) {
      throw new Error(
        'ExcalidrawPlugin: ExcalidrawNode not registered on editor'
      )
    }

    return editor.registerCommand(
      INSERT_EXCALIDRAW_COMMAND,
      () => {
        setModalOpen(true)
        return true
      },
      COMMAND_PRIORITY_EDITOR
    )
  }, [editor])

  const onClose = () => {
    setModalOpen(false)
  }

  const onDelete = () => {
    setModalOpen(false)
  }

  const onSave = (
    elements: ExcalidrawInitialElements,
    appState: Partial<AppState>,
    files: BinaryFiles
  ) => {
    editor.update(() => {
      const excalidrawNode = $createExcalidrawNode()
      excalidrawNode.setData(
        JSON.stringify({
          appState,
          elements,
          files,
        })
      )
      $insertNodes([excalidrawNode])
      if ($isRootOrShadowRoot(excalidrawNode.getParentOrThrow())) {
        $wrapNodeInElement(excalidrawNode, $createParagraphNode).selectEnd()
      }
    })
    setModalOpen(false)
  }
  return (
    <ExcalidrawModal
      initialElements={[]}
      initialAppState={{} as AppState}
      initialFiles={{}}
      isShown={isModalOpen}
      onDelete={onDelete}
      onClose={onClose}
      onSave={onSave}
      closeOnClickOutside={false}
    />
  )
}
