# Shadcn Editor

## Usage

1. Run this command to setup batteries included editor.

```bash
npx shadcn@latest add https://shadcn-editor.vercel.app/r/editor-x.json
```

2. Use the `Editor` component in your project.

```tsx
'use client'

import { useState } from 'react'

import { SerializedEditorState } from 'lexical'

import { Editor } from '@/components/blocks/editor-x/editor'

const initialValue = {
  root: {
    children: [
      {
        children: [
          {
            detail: 0,
            format: 0,
            mode: 'normal',
            style: '',
            text: 'Hello World 🚀',
            type: 'text',
            version: 1,
          },
        ],
        direction: 'ltr',
        format: '',
        indent: 0,
        type: 'paragraph',
        version: 1,
      },
    ],
    direction: 'ltr',
    format: '',
    indent: 0,
    type: 'root',
    version: 1,
  },
} as unknown as SerializedEditorState

export function EditorDemo() {
  const [editorState, setEditorState] =
    useState<SerializedEditorState>(initialValue)

  return (
    <Editor
      editorSerializedState={editorState}
      onSerializedChange={(value) => setEditorState(value)}
    />
  )
}
```

## Start History

[![Star History Chart](https://api.star-history.com/svg?repos=htmujahid/shadcn-editor&type=Date)](https://star-history.com/#bytebase/star-history&Date)
