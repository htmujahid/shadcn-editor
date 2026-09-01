import {
  $getSelection,
  $isRangeSelection,
  $setSelection,
  COMMAND_PRIORITY_LOW,
  defineExtension,
  FOCUS_COMMAND,
} from "lexical"

const TAB_TO_FOCUS_INTERVAL = 100

let lastTabKeyDownTimestamp = 0
let hasRegisteredKeyDownListener = false

function registerKeyTimeStampTracker() {
  window.addEventListener(
    "keydown",
    (event: KeyboardEvent) => {
      if (event.key === "Tab") {
        lastTabKeyDownTimestamp = event.timeStamp
      }
    },
    true
  )
}

export const TabFocusExtension = defineExtension({
  name: "@shadcn-editor/tab-focus",
  register: (editor) => {
    if (!hasRegisteredKeyDownListener) {
      registerKeyTimeStampTracker()
      hasRegisteredKeyDownListener = true
    }

    return editor.registerCommand(
      FOCUS_COMMAND,
      (event: FocusEvent) => {
        const selection = $getSelection()
        if ($isRangeSelection(selection)) {
          if (
            lastTabKeyDownTimestamp + TAB_TO_FOCUS_INTERVAL >
            event.timeStamp
          ) {
            $setSelection(selection.clone())
          }
        }
        return false
      },
      COMMAND_PRIORITY_LOW
    )
  },
})
