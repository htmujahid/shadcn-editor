import {
  CodeIcon,
  Heading1Icon,
  Heading2Icon,
  Heading3Icon,
  Heading4Icon,
  Heading5Icon,
  Heading6Icon,
  ListIcon,
  ListOrderedIcon,
  ListTodoIcon,
  QuoteIcon,
  TextIcon,
} from "lucide-react"

export const blockTypeToBlockName: Record<
  string,
  { label: string; icon: React.ReactNode }
> = {
  paragraph: {
    label: "Paragraph",
    icon: <TextIcon className="size-4" />,
  },
  h1: {
    label: "Heading 1",
    icon: <Heading1Icon className="size-4" />,
  },
  h2: {
    label: "Heading 2",
    icon: <Heading2Icon className="size-4" />,
  },
  h3: {
    label: "Heading 3",
    icon: <Heading3Icon className="size-4" />,
  },
  h4: {
    label: "Heading 4",
    icon: <Heading4Icon className="size-4" />,
  },
  h5: {
    label: "Heading 5",
    icon: <Heading5Icon className="size-4" />,
  },
  h6: {
    label: "Heading 6",
    icon: <Heading6Icon className="size-4" />,
  },
  number: {
    label: "Numbered List",
    icon: <ListOrderedIcon className="size-4" />,
  },
  bullet: {
    label: "Bulleted List",
    icon: <ListIcon className="size-4" />,
  },
  check: {
    label: "Check List",
    icon: <ListTodoIcon className="size-4" />,
  },
  code: {
    label: "Code Block",
    icon: <CodeIcon className="size-4" />,
  },
  quote: {
    label: "Quote",
    icon: <QuoteIcon className="size-4" />,
  },
}
