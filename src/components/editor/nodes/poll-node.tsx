import { useEffect, useMemo, useRef } from "react";
import type { JSX } from "react";

import {
  $getDocument,
  $getNodeByKey,
  $getState,
  $setState,
  CLICK_COMMAND,
  COMMAND_PRIORITY_LOW,
  createState,
  DecoratorNode,
  type DOMExportOutput,
  type LexicalNode,
  mergeRegister,
  type NodeKey,
  type SerializedLexicalNode,
  type Spread,
  type StateConfigValue,
  type StateValueOrUpdater,
} from "lexical";

import { useLexicalComposerContext } from "@lexical/react/LexicalComposerContext";
import { useLexicalEditable } from "@lexical/react/useLexicalEditable";
import { useLexicalNodeSelection } from "@lexical/react/useLexicalNodeSelection";

import { Plus, X } from "lucide-react";

import { useTranslation } from "@/components/editor/plugins/i18n-plugin";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";

export type Option = Readonly<{
  text: string;
  uid: string;
  votes: string[];
}>;

export type Options = readonly Option[];

const LOCAL_VOTER = "local";

function createUID(): string {
  return Math.random()
    .toString(36)
    .replace(/[^a-z]+/g, "")
    .substring(0, 5);
}

export function createPollOption(text = ""): Option {
  return {
    text,
    uid: createUID(),
    votes: [],
  };
}

function cloneOption(option: Option, text: string, votes?: string[]): Option {
  return {
    text,
    uid: option.uid,
    votes: votes || Array.from(option.votes),
  };
}

export type SerializedPollNode = Spread<
  {
    question: string;
    options: Options;
  },
  SerializedLexicalNode
>;

function parseOptions(json: unknown): Options {
  const options = [];
  if (Array.isArray(json)) {
    for (const row of json) {
      if (
        row &&
        typeof row.text === "string" &&
        typeof row.uid === "string" &&
        Array.isArray(row.votes) &&
        row.votes.every((v: unknown) => typeof v === "string")
      ) {
        options.push(row);
      }
    }
  }
  return options;
}

const questionState = createState("question", {
  parse: (v) => (typeof v === "string" ? v : ""),
});
const optionsState = createState("options", {
  isEqual: (a, b) =>
    a.length === b.length && JSON.stringify(a) === JSON.stringify(b),
  parse: parseOptions,
});

export class PollNode extends DecoratorNode<JSX.Element> {
  $config() {
    return this.config("poll", {
      extends: DecoratorNode,
      stateConfigs: [
        { flat: true, stateConfig: questionState },
        { flat: true, stateConfig: optionsState },
      ],
    });
  }

  getQuestion(): StateConfigValue<typeof questionState> {
    return $getState(this, questionState);
  }

  setQuestion(valueOrUpdater: StateValueOrUpdater<typeof questionState>): this {
    return $setState(this, questionState, valueOrUpdater);
  }

  getOptions(): StateConfigValue<typeof optionsState> {
    return $getState(this, optionsState);
  }

  setOptions(valueOrUpdater: StateValueOrUpdater<typeof optionsState>): this {
    return $setState(this, optionsState, valueOrUpdater);
  }

  addOption(option: Option): this {
    return this.setOptions((options) => [...options, option]);
  }

  deleteOption(option: Option): this {
    return this.setOptions((prevOptions) => {
      const index = prevOptions.indexOf(option);
      if (index === -1) {
        return prevOptions;
      }
      const options = Array.from(prevOptions);
      options.splice(index, 1);
      return options;
    });
  }

  setOptionText(option: Option, text: string): this {
    return this.setOptions((prevOptions) => {
      const clonedOption = cloneOption(option, text);
      const options = Array.from(prevOptions);
      const index = options.indexOf(option);
      options[index] = clonedOption;
      return options;
    });
  }

  toggleVote(option: Option, username: string): this {
    return this.setOptions((prevOptions) => {
      const index = prevOptions.indexOf(option);
      if (index === -1) {
        return prevOptions;
      }
      const votes = option.votes;
      const votesClone = Array.from(votes);
      const voteIndex = votes.indexOf(username);
      if (voteIndex === -1) {
        votesClone.push(username);
      } else {
        votesClone.splice(voteIndex, 1);
      }
      const clonedOption = cloneOption(option, option.text, votesClone);
      const options = Array.from(prevOptions);
      options[index] = clonedOption;
      return options;
    });
  }

  exportDOM(): DOMExportOutput {
    const element = $getDocument().createElement("span");
    element.setAttribute("data-lexical-poll-question", this.getQuestion());
    element.setAttribute(
      "data-lexical-poll-options",
      JSON.stringify(this.getOptions()),
    );
    return { element };
  }

  createDOM(): HTMLElement {
    const elem = $getDocument().createElement("span");
    elem.style.display = "inline-block";
    return elem;
  }

  updateDOM(): false {
    return false;
  }

  decorate(): JSX.Element {
    return (
      <PollComponent
        question={this.getQuestion()}
        options={this.getOptions()}
        nodeKey={this.__key}
      />
    );
  }
}

export function $createPollNode(question: string, options: Options): PollNode {
  return new PollNode().setQuestion(question).setOptions(options);
}

export function $isPollNode(
  node: LexicalNode | null | undefined,
): node is PollNode {
  return node instanceof PollNode;
}

function getTotalVotes(options: Options): number {
  return options.reduce(
    (totalVotes, next) => totalVotes + next.votes.length,
    0,
  );
}

function PollOptionComponent({
  option,
  index,
  options,
  totalVotes,
  withPollNode,
}: {
  index: number;
  option: Option;
  options: Options;
  totalVotes: number;
  withPollNode: (
    cb: (pollNode: PollNode) => void,
    onSelect?: () => void,
  ) => void;
}): JSX.Element {
  const { t } = useTranslation();
  const isEditable = useLexicalEditable();
  const votes = option.votes.length;
  const checked = option.votes.includes(LOCAL_VOTER);

  return (
    <div className="flex items-center gap-2">
      <Checkbox
        checked={checked}
        disabled={!isEditable}
        aria-label={option.text || `${t.pollOptionPlaceholder} ${index + 1}`}
        onCheckedChange={() => {
          withPollNode((node) => {
            node.toggleVote(option, LOCAL_VOTER);
          });
        }}
      />
      <div className="relative min-w-0 flex-1">
        <div
          className="pointer-events-none absolute inset-y-0 start-0 rounded-md bg-primary/10 transition-all"
          style={{
            width: `${votes === 0 ? 0 : (votes / totalVotes) * 100}%`,
          }}
        />
        <span className="pointer-events-none absolute end-2.5 top-1/2 -translate-y-1/2 text-xs text-muted-foreground">
          {votes > 0 && `${votes} ${votes === 1 ? t.pollVote : t.pollVotes}`}
        </span>
        <Input
          value={option.text}
          disabled={!isEditable}
          className="bg-transparent pe-16 dark:bg-transparent"
          placeholder={`${t.pollOptionPlaceholder} ${index + 1}`}
          onChange={(e) => {
            const target = e.target;
            const value = target.value;
            const { selectionStart, selectionEnd } = target;
            withPollNode(
              (node) => {
                node.setOptionText(option, value);
              },
              () => {
                target.selectionStart = selectionStart;
                target.selectionEnd = selectionEnd;
              },
            );
          }}
        />
      </div>
      <Button
        variant="ghost"
        size="icon-sm"
        className="text-muted-foreground"
        disabled={!isEditable || options.length < 3}
        aria-label={t.pollRemoveOption}
        onClick={() => {
          withPollNode((node) => {
            node.deleteOption(option);
          });
        }}
      >
        <X />
      </Button>
    </div>
  );
}

function PollComponent({
  question,
  options,
  nodeKey,
}: {
  nodeKey: NodeKey;
  options: Options;
  question: string;
}): JSX.Element {
  const [editor] = useLexicalComposerContext();
  const { t } = useTranslation();
  const isEditable = useLexicalEditable();
  const totalVotes = useMemo(() => getTotalVotes(options), [options]);
  const [isSelected, setSelected, clearSelection] =
    useLexicalNodeSelection(nodeKey);
  const ref = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    return mergeRegister(
      editor.registerCommand(
        CLICK_COMMAND,
        (event) => {
          if (event.target === ref.current) {
            if (!event.shiftKey) {
              clearSelection();
            }
            setSelected(!isSelected);
            return true;
          }
          return false;
        },
        COMMAND_PRIORITY_LOW,
      ),
    );
  }, [clearSelection, editor, isSelected, nodeKey, setSelected]);

  const withPollNode = (
    cb: (node: PollNode) => void,
    onUpdate?: () => void,
  ): void => {
    editor.update(
      () => {
        const node = $getNodeByKey(nodeKey);
        if ($isPollNode(node)) {
          cb(node);
        }
      },
      { onUpdate },
    );
  };

  const addOption = () => {
    withPollNode((node) => {
      node.addOption(createPollOption());
    });
  };

  return (
    <div
      ref={ref}
      className={cn(
        "my-1 flex w-full max-w-md flex-col gap-2 rounded-lg border bg-card p-4 text-card-foreground",
        isSelected && "ring-2 ring-ring",
      )}
    >
      <Input
        value={question}
        disabled={!isEditable}
        className="border-transparent bg-transparent text-sm font-medium shadow-none dark:bg-transparent"
        placeholder={t.pollQuestionPlaceholder}
        onChange={(e) => {
          const target = e.target;
          const value = target.value;
          const { selectionStart, selectionEnd } = target;
          withPollNode(
            (node) => {
              node.setQuestion(value);
            },
            () => {
              target.selectionStart = selectionStart;
              target.selectionEnd = selectionEnd;
            },
          );
        }}
      />
      {options.map((option, index) => (
        <PollOptionComponent
          key={option.uid}
          withPollNode={withPollNode}
          option={option}
          index={index}
          options={options}
          totalVotes={totalVotes}
        />
      ))}
      <div>
        <Button
          variant="outline"
          size="sm"
          disabled={!isEditable}
          onClick={addOption}
        >
          <Plus />
          {t.pollAddOption}
        </Button>
      </div>
    </div>
  );
}
