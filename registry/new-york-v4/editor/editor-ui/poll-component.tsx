/**
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */
import * as React from "react"
import { JSX, useCallback, useEffect, useMemo, useRef, useState } from "react"
import { useCollaborationContext } from "@lexical/react/LexicalCollaborationContext"
import { useLexicalComposerContext } from "@lexical/react/LexicalComposerContext"
import { useLexicalNodeSelection } from "@lexical/react/useLexicalNodeSelection"
import { mergeRegister } from "@lexical/utils"
import {
  $getNodeByKey,
  $getSelection,
  $isNodeSelection,
  BaseSelection,
  CLICK_COMMAND,
  COMMAND_PRIORITY_LOW,
  KEY_BACKSPACE_COMMAND,
  KEY_DELETE_COMMAND,
  NodeKey,
} from "lexical"

import type {
  Option,
  Options,
  PollNode,
} from "@/registry/new-york-v4/editor/nodes/poll-node"
import {
  $isPollNode,
  createPollOption,
} from "@/registry/new-york-v4/editor/nodes/poll-node"
import { Button } from "@/registry/new-york-v4/ui/button"
import { Input } from "@/registry/new-york-v4/ui/input"

function getTotalVotes(options: Options): number {
  return options.reduce((totalVotes, next) => {
    return totalVotes + next.votes.length
  }, 0)
}

function PollOptionComponent({
  option,
  index,
  options,
  totalVotes,
  withPollNode,
}: {
  index: number
  option: Option
  options: Options
  totalVotes: number
  withPollNode: (
    cb: (pollNode: PollNode) => void,
    onSelect?: () => void
  ) => void
}): JSX.Element {
  const { clientID } = useCollaborationContext()
  const checkboxRef = useRef(null)
  const votesArray = option.votes
  const checkedIndex = votesArray.indexOf(clientID)
  const checked = checkedIndex !== -1
  const votes = votesArray.length
  const text = option.text

  return (
    <div className="mb-2.5 flex flex-row items-center">
      <div
        className={`relative mr-2.5 flex h-[22px] w-[22px] rounded-md border border-gray-400 ${
          checked
            ? 'border-primary bg-primary after:pointer-events-none after:absolute after:top-1 after:left-2 after:m-0 after:block after:h-[9px] after:w-[5px] after:rotate-45 after:cursor-pointer after:border-r-2 after:border-b-2 after:border-solid after:border-white after:content-[""]'
            : ""
        }`}
      >
        <input
          ref={checkboxRef}
          className="absolute block h-full w-full cursor-pointer border-0 opacity-0"
          type="checkbox"
          onChange={(e) => {
            withPollNode((node) => {
              node.toggleVote(option, clientID)
            })
          }}
          checked={checked}
        />
      </div>
      <div className="border-primary relative flex flex-[10px] cursor-pointer overflow-hidden rounded-md border">
        <div
          className="transition-width bg-accent absolute top-0 left-0 z-0 h-full duration-1000 ease-in-out"
          style={{ width: `${votes === 0 ? 0 : (votes / totalVotes) * 100}%` }}
        />
        <span className="text-primary absolute top-1.5 right-4 text-xs">
          {votes > 0 && (votes === 1 ? "1 vote" : `${votes} votes`)}
        </span>
        <Input
          type="text"
          value={text}
          onChange={(e) => {
            const target = e.target
            const value = target.value
            const selectionStart = target.selectionStart
            const selectionEnd = target.selectionEnd
            withPollNode(
              (node) => {
                node.setOptionText(option, value)
              },
              () => {
                target.selectionStart = selectionStart
                target.selectionEnd = selectionEnd
              }
            )
          }}
          placeholder={`Option ${index + 1}`}
        />
      </div>
      <button
        disabled={options.length < 3}
        className={`relative z-0 ml-1.5 flex h-7 w-7 cursor-pointer rounded-md border-0 bg-transparent bg-[position:6px_6px] bg-no-repeat opacity-30 before:absolute before:top-1.5 before:left-[13px] before:block before:h-[15px] before:w-0.5 before:-rotate-45 before:bg-gray-400 before:content-[''] after:absolute after:top-1.5 after:left-[13px] after:block after:h-[15px] after:w-0.5 after:rotate-45 after:bg-gray-400 after:content-[''] hover:bg-gray-100 hover:opacity-100 disabled:cursor-not-allowed disabled:hover:bg-transparent disabled:hover:opacity-30`}
        aria-label="Remove"
        onClick={() => {
          withPollNode((node) => {
            node.deleteOption(option)
          })
        }}
      />
    </div>
  )
}

export default function PollComponent({
  question,
  options,
  nodeKey,
}: {
  nodeKey: NodeKey
  options: Options
  question: string
}): JSX.Element {
  const [editor] = useLexicalComposerContext()
  const totalVotes = useMemo(() => getTotalVotes(options), [options])
  const [isSelected, setSelected, clearSelection] =
    useLexicalNodeSelection(nodeKey)
  const [selection, setSelection] = useState<BaseSelection | null>(null)
  const ref = useRef(null)

  const $onDelete = useCallback(
    (payload: KeyboardEvent) => {
      const deleteSelection = $getSelection()
      if (isSelected && $isNodeSelection(deleteSelection)) {
        const event: KeyboardEvent = payload
        event.preventDefault()
        editor.update(() => {
          deleteSelection.getNodes().forEach((node) => {
            if ($isPollNode(node)) {
              node.remove()
            }
          })
        })
      }
      return false
    },
    [editor, isSelected]
  )

  useEffect(() => {
    return mergeRegister(
      editor.registerUpdateListener(({ editorState }) => {
        setSelection(editorState.read(() => $getSelection()))
      }),
      editor.registerCommand<MouseEvent>(
        CLICK_COMMAND,
        (payload) => {
          const event = payload

          if (event.target === ref.current) {
            if (!event.shiftKey) {
              clearSelection()
            }
            setSelected(!isSelected)
            return true
          }

          return false
        },
        COMMAND_PRIORITY_LOW
      ),
      editor.registerCommand(
        KEY_DELETE_COMMAND,
        $onDelete,
        COMMAND_PRIORITY_LOW
      ),
      editor.registerCommand(
        KEY_BACKSPACE_COMMAND,
        $onDelete,
        COMMAND_PRIORITY_LOW
      )
    )
  }, [clearSelection, editor, isSelected, nodeKey, $onDelete, setSelected])

  const withPollNode = (
    cb: (node: PollNode) => void,
    onUpdate?: () => void
  ): void => {
    editor.update(
      () => {
        const node = $getNodeByKey(nodeKey)
        if ($isPollNode(node)) {
          cb(node)
        }
      },
      { onUpdate }
    )
  }

  const addOption = () => {
    withPollNode((node) => {
      node.addOption(createPollOption())
    })
  }

  const isFocused = $isNodeSelection(selection) && isSelected

  return (
    <div
      className={`bg-background max-w-[600px] min-w-[400px] cursor-pointer rounded-lg border border-gray-200 select-none ${
        isFocused ? "outline-primary outline outline-2" : ""
      }`}
      ref={ref}
    >
      <div className="m-4 cursor-default">
        <h2 className="m-0 mb-4 text-center text-lg text-gray-600">
          {question}
        </h2>
        {options.map((option, index) => {
          const key = option.uid
          return (
            <PollOptionComponent
              key={key}
              withPollNode={withPollNode}
              option={option}
              index={index}
              options={options}
              totalVotes={totalVotes}
            />
          )
        })}
        <div className="flex justify-center">
          <Button onClick={addOption} size="sm">
            Add Option
          </Button>
        </div>
      </div>
    </div>
  )
}
