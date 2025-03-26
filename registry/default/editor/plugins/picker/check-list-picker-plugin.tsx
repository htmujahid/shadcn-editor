import { ListTodoIcon } from "lucide-react";
import { INSERT_CHECK_LIST_COMMAND } from "@lexical/list";

import { ComponentPickerOption } from "@/registry/default/editor/plugins/picker/component-picker-option";

export function CheckListPickerPlugin() {
  return new ComponentPickerOption('Check List', {
    icon: <ListTodoIcon className="size-4" />,
    keywords: ['check list', 'todo list'],
    onSelect: (_, editor) =>
      editor.dispatchCommand(INSERT_CHECK_LIST_COMMAND, undefined),
  })
}