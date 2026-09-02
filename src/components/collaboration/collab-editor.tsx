import { useCallback, useEffect, useMemo, useRef, useState } from "react";

import { defineExtension } from "lexical";

import { CheckListExtension, ListExtension } from "@lexical/list";
import { LexicalCollaboration } from "@lexical/react/LexicalCollaborationContext";
import { CollaborationPlugin } from "@lexical/react/LexicalCollaborationPlugin";
import { LexicalExtensionComposer } from "@lexical/react/LexicalExtensionComposer";
import { RichTextExtension } from "@lexical/rich-text";
import type { Provider } from "@lexical/yjs";
import type * as Y from "yjs";

import {
  createWebRTCProvider,
  createWebsocketProvider,
} from "@/components/collaboration/providers";
import {
  getRandomUserProfile,
  type UserProfile,
} from "@/components/collaboration/user-profile";
import { FormatStateExtension } from "@/components/editor/extensions/format-state";
import { ContentEditable } from "@/components/editor/plugins/content-editable";
import {
  LanguageProvider,
  useLanguage,
} from "@/components/editor/plugins/i18n-plugin";
import { BlockFormatToolbarPlugin } from "@/components/editor/plugins/toolbar/block-format-toolbar-plugin";
import { TextFormatToolbarPlugin } from "@/components/editor/plugins/toolbar/text-format-toolbar-plugin";
import { Toolbar } from "@/components/editor/plugins/toolbar/toolbar-plugin";
import { editorTheme } from "@/components/editor/theme";
import { Button } from "@/components/ui/button";
import { DirectionProvider } from "@/components/ui/direction";
import { Input } from "@/components/ui/input";

interface ActiveUserProfile extends UserProfile {
  userId: number;
}

export function CollabEditor() {
  const { providerName, userGroup } = useMemo(() => {
    const params = new URLSearchParams(window.location.search);
    const group = params.get("u");
    return {
      providerName: params.get("provider") ?? "webrtc",
      userGroup: group == null ? undefined : Number(group),
    };
  }, []);
  const [userProfile, setUserProfile] = useState<UserProfile>(() =>
    getRandomUserProfile(userGroup),
  );
  const cursorsContainerRef = useRef<HTMLDivElement | null>(null);
  const [yjsProvider, setYjsProvider] = useState<Provider | null>(null);
  const [connected, setConnected] = useState(false);
  const [activeUsers, setActiveUsers] = useState<ActiveUserProfile[]>([]);

  const handleAwarenessUpdate = useCallback(() => {
    if (yjsProvider == null) {
      return;
    }
    setActiveUsers(
      Array.from(yjsProvider.awareness.getStates().entries()).map(
        ([userId, { color, name }]) => ({
          color,
          name,
          userId,
        }),
      ),
    );
  }, [yjsProvider]);

  useEffect(() => {
    if (yjsProvider == null) {
      return;
    }

    yjsProvider.awareness.on("update", handleAwarenessUpdate);

    return () => yjsProvider.awareness.off("update", handleAwarenessUpdate);
  }, [yjsProvider, handleAwarenessUpdate]);

  const handleConnectionToggle = () => {
    if (yjsProvider == null) {
      return;
    }
    if (connected) {
      yjsProvider.disconnect();
    } else {
      yjsProvider.connect();
    }
  };

  const providerFactory = useCallback(
    (id: string, yjsDocMap: Map<string, Y.Doc>) => {
      const provider =
        providerName === "ws"
          ? createWebsocketProvider(id, yjsDocMap)
          : createWebRTCProvider(id, yjsDocMap);

      provider.on("status", (event) => {
        setConnected(
          event.status === "connected" ||
            ("connected" in event && event.connected === true),
        );
      });

      setTimeout(() => setYjsProvider(provider), 0);

      return provider;
    },
    [providerName],
  );

  const app = useMemo(
    () =>
      defineExtension({
        name: "@shadcn-editor/collab",
        dependencies: [
          RichTextExtension,
          ListExtension,
          CheckListExtension,
          FormatStateExtension,
        ],
        $initialEditorState: null,
        theme: editorTheme,
      }),
    [],
  );

  return (
    <LanguageProvider>
      <div className="flex h-svh flex-col gap-3 bg-background p-3">
        <div className="flex flex-wrap items-center gap-2">
          <Input
            aria-label="Display name"
            className="h-8 w-36"
            value={userProfile.name}
            onChange={(e) =>
              setUserProfile((profile) => ({
                ...profile,
                name: e.target.value,
              }))
            }
          />
          <input
            aria-label="Cursor color"
            type="color"
            className="size-8 shrink-0 cursor-pointer rounded-md border border-input bg-transparent p-1"
            value={userProfile.color}
            onChange={(e) =>
              setUserProfile((profile) => ({
                ...profile,
                color: e.target.value,
              }))
            }
          />
          {providerName === "ws" ? (
            <Button
              variant="outline"
              size="sm"
              onClick={handleConnectionToggle}
            >
              {connected ? "Disconnect" : "Connect"}
            </Button>
          ) : null}
          <div className="ms-auto flex min-w-0 items-center gap-1.5 text-xs text-muted-foreground">
            <span className="hidden sm:inline">Active:</span>
            {activeUsers.map(({ name, color, userId }) => (
              <span
                key={userId}
                className="inline-flex items-center gap-1 truncate"
              >
                <span
                  className="size-2 shrink-0 rounded-full"
                  style={{ backgroundColor: color }}
                />
                {name}
              </span>
            ))}
          </div>
        </div>
        <LexicalCollaboration>
          <LexicalExtensionComposer extension={app} contentEditable={null}>
            <EditorWrapper>
              <Toolbar>
                <BlockFormatToolbarPlugin />
                <TextFormatToolbarPlugin />
              </Toolbar>
              <div
                ref={cursorsContainerRef}
                className="relative min-w-0 flex-1 overflow-y-auto"
              >
                <ContentEditable
                  variant="toolbar"
                  placeholder={{
                    en: "Type here and watch the other editor follow…",
                  }}
                />
                <CollaborationPlugin
                  id="shadcn-editor/collab"
                  providerFactory={providerFactory}
                  shouldBootstrap={false}
                  username={userProfile.name}
                  cursorColor={userProfile.color}
                  cursorsContainerRef={cursorsContainerRef}
                />
              </div>
            </EditorWrapper>
          </LexicalExtensionComposer>
        </LexicalCollaboration>
      </div>
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
