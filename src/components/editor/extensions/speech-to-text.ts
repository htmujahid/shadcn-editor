import {
  $getSelection,
  $isRangeSelection,
  COMMAND_PRIORITY_EDITOR,
  createCommand,
  defineExtension,
  type LexicalCommand,
  type LexicalEditor,
  type RangeSelection,
  REDO_COMMAND,
  UNDO_COMMAND,
} from "lexical";

type SpeechRecognitionResultEventLike = {
  resultIndex: number;
  results: {
    item(index: number): {
      isFinal: boolean;
      item(index: number): { transcript: string };
    };
  };
};

type SpeechRecognitionLike = {
  continuous: boolean;
  interimResults: boolean;
  lang: string;
  start(): void;
  stop(): void;
  addEventListener(
    type: "result",
    listener: (event: SpeechRecognitionResultEventLike) => void,
  ): void;
  addEventListener(type: "end", listener: () => void): void;
};

type WindowWithSpeechRecognition = Window & {
  SpeechRecognition?: new () => SpeechRecognitionLike;
  webkitSpeechRecognition?: new () => SpeechRecognitionLike;
};

export const SPEECH_TO_TEXT_COMMAND: LexicalCommand<boolean> = createCommand(
  "SPEECH_TO_TEXT_COMMAND",
);

export const SUPPORT_SPEECH_RECOGNITION: boolean =
  typeof window !== "undefined" &&
  ("SpeechRecognition" in window || "webkitSpeechRecognition" in window);

const RECOGNITION_LANGUAGE: Record<string, string> = {
  ar: "ar-SA",
  en: "en-US",
  he: "he-IL",
};

const VOICE_COMMANDS: Readonly<
  Record<
    string,
    (arg: { editor: LexicalEditor; selection: RangeSelection }) => void
  >
> = {
  "\n": ({ selection }) => {
    selection.insertParagraph();
  },
  redo: ({ editor }) => {
    editor.dispatchCommand(REDO_COMMAND, undefined);
  },
  undo: ({ editor }) => {
    editor.dispatchCommand(UNDO_COMMAND, undefined);
  },
};

export const SpeechToTextExtension = defineExtension({
  name: "@shadcn-editor/editor/SpeechToText",
  register: (editor) => {
    let recognition: SpeechRecognitionLike | null = null;
    let lastTranscript = "";

    const stopRecognition = () => {
      const active = recognition;
      recognition = null;
      active?.stop();
    };

    const startRecognition = () => {
      const { SpeechRecognition, webkitSpeechRecognition } =
        window as WindowWithSpeechRecognition;
      const SpeechRecognitionImpl =
        SpeechRecognition ?? webkitSpeechRecognition;
      if (!SpeechRecognitionImpl) {
        return;
      }

      lastTranscript = "";
      const instance = new SpeechRecognitionImpl();
      recognition = instance;
      instance.continuous = true;
      instance.interimResults = true;
      const lang = editor
        .getRootElement()
        ?.closest<HTMLElement>("[lang]")?.lang;
      instance.lang =
        (lang && RECOGNITION_LANGUAGE[lang]) || RECOGNITION_LANGUAGE.en;

      instance.addEventListener("result", (event) => {
        const resultItem = event.results.item(event.resultIndex);
        const { transcript } = resultItem.item(0);

        if (!resultItem.isFinal || transcript.length === 0) {
          return;
        }

        const prev = lastTranscript;
        if (transcript === prev || prev.startsWith(transcript)) {
          return;
        }

        const textToInsert = transcript.startsWith(prev)
          ? transcript.slice(prev.length)
          : transcript;
        lastTranscript = transcript;

        editor.update(() => {
          const selection = $getSelection();
          if (!$isRangeSelection(selection)) {
            return;
          }
          const command = VOICE_COMMANDS[textToInsert.toLowerCase().trim()];
          if (command) {
            command({ editor, selection });
          } else if (textToInsert.match(/\s*\n\s*/)) {
            selection.insertParagraph();
          } else {
            selection.insertText(textToInsert);
          }
        });
      });

      instance.addEventListener("end", () => {
        if (recognition === instance) {
          recognition = null;
          editor.dispatchCommand(SPEECH_TO_TEXT_COMMAND, false);
        }
      });

      instance.start();
    };

    const unregisterCommand = editor.registerCommand(
      SPEECH_TO_TEXT_COMMAND,
      (enabled) => {
        if (enabled) {
          if (recognition === null) {
            startRecognition();
          }
        } else {
          stopRecognition();
        }
        return true;
      },
      COMMAND_PRIORITY_EDITOR,
    );

    return () => {
      unregisterCommand();
      stopRecognition();
    };
  },
});
