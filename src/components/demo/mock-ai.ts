import type { AiRequest } from "@/components/editor/extensions/ai";

/**
 * A stand-in for a real model endpoint. It streams a canned reply word by
 * word so the AI editor works without an API key. Swap `mockAiResponse` for a
 * `fetch` to your own route (or any SDK) and keep the rest of the wiring.
 */
export function mockAiResponse(
  request: AiRequest,
  signal: AbortSignal,
): Response {
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
