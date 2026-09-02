import { useMemo, useRef, useState } from "react";

import {
  $createParagraphNode,
  $createTextNode,
  $getRoot,
  defineExtension,
} from "lexical";

import { ListExtension } from "@lexical/list";
import { LexicalExtensionComposer } from "@lexical/react/LexicalExtensionComposer";
import { RichTextExtension } from "@lexical/rich-text";

import type { AiRequest } from "@/components/editor/extensions/ai";
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

function mockAiResponse(request: AiRequest, signal: AbortSignal): Response {
  const words = mockReply(request).split(/(?=\s)/);
  const body = new ReadableStream<string>({
    async start(controller) {
      for (const word of words) {
        if (signal.aborted) {
          break;
        }
        await new Promise((resolve) => setTimeout(resolve, 40));
        controller.enqueue(word);
      }
      controller.close();
    },
  }).pipeThrough(new TextEncoderStream());
  return new Response(body, {
    headers: { "Content-Type": "text/plain; charset=utf-8" },
  });
}

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

export function AiEditor() {
  const [output, setOutput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  const abortRef = useRef<AbortController | null>(null);

  const stop = () => {
    abortRef.current?.abort();
    abortRef.current = null;
    setIsLoading(false);
  };

  const onGenerate = async (request: AiRequest) => {
    abortRef.current?.abort();
    const controller = new AbortController();
    abortRef.current = controller;
    setOutput("");
    setError(null);
    setIsLoading(true);
    try {
      const response = mockAiResponse(request, controller.signal);
      if (!response.ok || response.body === null) {
        throw new Error(`AI request failed with status ${response.status}`);
      }
      const reader = response.body
        .pipeThrough(new TextDecoderStream())
        .getReader();
      while (true) {
        const { value, done } = await reader.read();
        if (done) {
          break;
        }
        setOutput((prev) => prev + value);
      }
    } catch (err) {
      if (!controller.signal.aborted) {
        setError(err instanceof Error ? err : new Error(String(err)));
      }
    } finally {
      if (abortRef.current === controller) {
        abortRef.current = null;
        setIsLoading(false);
      }
    }
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
                "the editor is fast and it is very very easy to extend. every feature is an extension, and i can compose them however i like.",
              ),
            ),
            $createParagraphNode().append(
              $createTextNode(
                "Select a sentence, press the sparkles button in either toolbar, then pick a command or type your own prompt. On an empty line, type / and choose Ask AI to write something new. The component calls the model directly and streams the response body into state, so any endpoint or SDK works here.",
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
