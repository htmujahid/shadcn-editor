import { useMemo } from "react";

import {
  $createParagraphNode,
  $createTextNode,
  $getRoot,
  defineExtension,
} from "lexical";

import { ListExtension } from "@lexical/list";
import { LexicalExtensionComposer } from "@lexical/react/LexicalExtensionComposer";
import { RichTextExtension } from "@lexical/rich-text";

import { useCompletion } from "@ai-sdk/react";
import { simulateReadableStream } from "ai";

import { type AiRequest, toAiPrompt } from "@/components/editor/extensions/ai";
import { FormatStateExtension } from "@/components/editor/extensions/format-state";
import { ContentEditable } from "@/components/editor/plugins/content-editable";
import { AiPickerPlugin } from "@/components/editor/plugins/component-picker/ai-picker-plugin";
import { ComponentPicker } from "@/components/editor/plugins/component-picker/component-picker-plugin";
import { AiEditorPlugin } from "@/components/editor/plugins/floating/ai-editor-plugin";
import { FloatingToolbarPlugin } from "@/components/editor/plugins/floating/floating-toolbar-plugin";
import {
  LanguageProvider,
  useLanguage,
} from "@/components/editor/plugins/i18n-plugin";
import { AiToolbarPlugin } from "@/components/editor/plugins/toolbar/ai-toolbar-plugin";
import { Toolbar } from "@/components/editor/plugins/toolbar/toolbar-plugin";
import { editorTheme } from "@/components/editor/theme";
import { DirectionProvider } from "@/components/ui/direction";

const mockFetch: typeof fetch = (_input, init) => {
  const { request } = JSON.parse(String(init?.body)) as {
    request: AiRequest;
  };
  const stream = simulateReadableStream({
    chunks: mockReply(request).split(/(?=\s)/),
    chunkDelayInMs: 40,
  }).pipeThrough(new TextEncoderStream());
  return Promise.resolve(
    new Response(stream, {
      headers: { "Content-Type": "text/plain; charset=utf-8" },
    }),
  );
};

function mockReply(request: AiRequest): string {
  const source = (request.text || request.before).replace(/\s+/g, " ").trim();
  switch (request.command) {
    case "improve":
      return `${sentenceCase(source.replace(/\b(very|really|just)\s+/gi, ""))} It stays **predictable** as the document grows.`;
    case "longer":
      return `${sentenceCase(source)} In practice this means each feature lives in its own extension, so you can add or remove behavior without touching the rest of the editor.`;
    case "shorter":
      return sentenceCase(source.split(/(?<=[.!?])\s+/)[0] ?? source);
    case "fix":
      return sentenceCase(source.replace(/\bi\b/g, "I"));
    case "continue":
      return "From here the document keeps going with a sentence written by the mock provider, so you can see how a continuation lands at the caret.";
    case "summarize":
      return `**In short:** ${sentenceCase(source.split(/(?<=[.!?])\s+/)[0] ?? source)}`;
    case "brainstorm":
      return "- Add a keyboard shortcut for the most used command\n- Show a *preview* before applying changes\n- Let users save their own prompts";
    default:
      return `Here is a line for "${request.prompt}", written by the mock provider so the demo works without a key.`;
  }
}

function sentenceCase(text: string): string {
  const withPeriod = /[.!?]$/.test(text) ? text : `${text}.`;
  return withPeriod.replace(
    /(^|[.!?]\s+)([a-z])/g,
    (_match, prefix: string, letter: string) => prefix + letter.toUpperCase(),
  );
}

export function AiSdkEditor() {
  const { completion, complete, isLoading, error, stop } = useCompletion({
    api: "/api/ai",
    streamProtocol: "text",
    fetch: mockFetch,
  });
  const output = completion;
  const onGenerate = (request: AiRequest) => {
    void complete(toAiPrompt(request), { body: { request } });
  };

  const app = useMemo(
    () =>
      defineExtension({
        name: "@shadcn-editor/editor",
        dependencies: [RichTextExtension, ListExtension, FormatStateExtension],
        $initialEditorState: () => {
          $getRoot().append(
            $createParagraphNode().append(
              $createTextNode(
                "this example streams every request through useCompletion from the vercel ai sdk. the fetch is mocked here, so it works without a key.",
              ),
            ),
            $createParagraphNode().append(
              $createTextNode(
                "Drop the fetch option and point api at a route that returns streamText as a text stream response, and the editor keeps working unchanged.",
              ),
            ),
          );
        },
        theme: editorTheme,
      }),
    [],
  );

  return (
    <LanguageProvider>
      <LexicalExtensionComposer extension={app} contentEditable={null}>
        <EditorWrapper>
          <Toolbar>
            <AiToolbarPlugin />
          </Toolbar>
          <div className="relative min-w-0 flex-1 overflow-y-auto">
            <ContentEditable variant="toolbar" />
            <FloatingToolbarPlugin>
              <AiToolbarPlugin />
            </FloatingToolbarPlugin>
            <ComponentPicker>
              <AiPickerPlugin />
            </ComponentPicker>
            <AiEditorPlugin
              output={output}
              isLoading={isLoading}
              error={error}
              onGenerate={onGenerate}
              onStop={stop}
            />
          </div>
        </EditorWrapper>
      </LexicalExtensionComposer>
    </LanguageProvider>
  );
}

function EditorWrapper({ children }: { children: React.ReactNode }) {
  const { language, dir } = useLanguage();
  return (
    <DirectionProvider direction={dir}>
      <div
        dir={dir}
        lang={language}
        className="relative flex min-h-0 w-full flex-1 flex-col overflow-hidden rounded-lg border border-input dark:bg-input/30"
      >
        {children}
      </div>
    </DirectionProvider>
  );
}
