/**
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */
import * as React from "react"
import { JSX, useCallback, useState } from "react"
import { useLexicalComposerContext } from "@lexical/react/LexicalComposerContext"
import { ErrorBoundary } from "react-error-boundary"

import KatexRenderer from "@/registry/new-york-v4/editor/editor-ui/katex-renderer"
import { Button } from "@/registry/new-york-v4/ui/button"
import { Checkbox } from "@/registry/new-york-v4/ui/checkbox"
import { Input } from "@/registry/new-york-v4/ui/input"
import { Label } from "@/registry/new-york-v4/ui/label"
import { Textarea } from "@/registry/new-york-v4/ui/textarea"

type Props = {
  initialEquation?: string
  onConfirm: (equation: string, inline: boolean) => void
}

export default function KatexEquationAlterer({
  onConfirm,
  initialEquation = "",
}: Props): JSX.Element {
  const [editor] = useLexicalComposerContext()
  const [equation, setEquation] = useState<string>(initialEquation)
  const [inline, setInline] = useState<boolean>(true)

  const onClick = useCallback(() => {
    onConfirm(equation, inline)
  }, [onConfirm, equation, inline])

  const onCheckboxChange = useCallback(() => {
    setInline(!inline)
  }, [setInline, inline])

  return (
    <>
      <div className="flex items-center space-x-2">
        <Label htmlFor="inline-toggle" className="text-sm font-medium">
          Inline
        </Label>
        <Checkbox
          id="inline-toggle"
          checked={inline}
          onCheckedChange={onCheckboxChange}
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="equation-input" className="text-sm font-medium">
          Equation
        </Label>
        {inline ? (
          <Input
            id="equation-input"
            onChange={(event) => setEquation(event.target.value)}
            value={equation}
            placeholder="Enter inline equation..."
          />
        ) : (
          <Textarea
            id="equation-input"
            onChange={(event) => setEquation(event.target.value)}
            value={equation}
            placeholder="Enter block equation..."
            className="min-h-[100px]"
          />
        )}
      </div>

      <div className="space-y-2">
        <Label className="text-sm font-medium">Visualization</Label>
        <div className="bg-muted rounded-md border p-4">
          <ErrorBoundary onError={(e) => editor._onError(e)} fallback={null}>
            <KatexRenderer
              equation={equation}
              inline={false}
              onDoubleClick={() => null}
            />
          </ErrorBoundary>
        </div>
      </div>

      <div className="flex justify-end">
        <Button onClick={onClick}>Confirm</Button>
      </div>
    </>
  )
}
