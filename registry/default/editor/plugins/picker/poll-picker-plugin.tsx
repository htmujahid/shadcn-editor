import { ListChecksIcon } from "lucide-react";

import { InsertPollDialog } from "@/registry/default/editor/plugins/poll-plugin";
import { ComponentPickerOption } from "@/registry/default/editor/plugins/picker/component-picker-option";

export function PollPickerPlugin() {

  return new ComponentPickerOption('Poll', {
    icon: <ListChecksIcon className="size-4" />,
    keywords: ['poll', 'vote'],
    onSelect: (_, editor, showModal) =>
      showModal('Insert Poll', (onClose) => (
        <InsertPollDialog activeEditor={editor} onClose={onClose} />
      )),
  })
}