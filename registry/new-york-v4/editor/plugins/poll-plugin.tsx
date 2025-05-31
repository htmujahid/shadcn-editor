"use client"

/**
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */
import { JSX, useEffect, useState } from "react"
import * as React from "react"
import { useLexicalComposerContext } from "@lexical/react/LexicalComposerContext"
import { $wrapNodeInElement } from "@lexical/utils"
import {
  $createParagraphNode,
  $insertNodes,
  $isRootOrShadowRoot,
  COMMAND_PRIORITY_EDITOR,
  createCommand,
  LexicalCommand,
  LexicalEditor,
} from "lexical"

import {
  $createPollNode,
  createPollOption,
  PollNode,
} from "@/registry/new-york-v4/editor/nodes/poll-node"
import { Button } from "@/registry/new-york-v4/ui/button"
import { DialogFooter } from "@/registry/new-york-v4/ui/dialog"
import { Input } from "@/registry/new-york-v4/ui/input"
import { Label } from "@/registry/new-york-v4/ui/label"

export const INSERT_POLL_COMMAND: LexicalCommand<string> = createCommand(
  "INSERT_POLL_COMMAND"
)

export function InsertPollDialog({
  activeEditor,
  onClose,
}: {
  activeEditor: LexicalEditor
  onClose: () => void
}): JSX.Element {
  const [question, setQuestion] = useState("")

  const onClick = () => {
    activeEditor.dispatchCommand(INSERT_POLL_COMMAND, question)
    onClose()
  }

  return (
    <>
      <div>
        <Label>Question</Label>
        <Input onChange={(e) => setQuestion(e.target.value)} value={question} />
      </div>
      <DialogFooter>
        <Button disabled={question.trim() === ""} onClick={onClick}>
          Confirm
        </Button>
      </DialogFooter>
    </>
  )
}

export function PollPlugin(): JSX.Element | null {
  const [editor] = useLexicalComposerContext()
  useEffect(() => {
    if (!editor.hasNodes([PollNode])) {
      throw new Error("PollPlugin: PollNode not registered on editor")
    }

    return editor.registerCommand<string>(
      INSERT_POLL_COMMAND,
      (payload) => {
        const pollNode = $createPollNode(payload, [
          createPollOption(),
          createPollOption(),
        ])
        $insertNodes([pollNode])
        if ($isRootOrShadowRoot(pollNode.getParentOrThrow())) {
          $wrapNodeInElement(pollNode, $createParagraphNode).selectEnd()
        }

        return true
      },
      COMMAND_PRIORITY_EDITOR
    )
  }, [editor])
  return null
}
