import type { Provider } from "@lexical/yjs";

import { WebrtcProvider } from "y-webrtc";
import { WebsocketProvider } from "y-websocket";
import * as Y from "yjs";

let idSuffix = 0;

export function createWebRTCProvider(
  id: string,
  yjsDocMap: Map<string, Y.Doc>,
): Provider {
  const doc = getDocFromMap(id, yjsDocMap);

  const provider = new WebrtcProvider(`${id}/${idSuffix++}`, doc, {
    signaling: [],
  });

  return provider as unknown as Provider;
}

export function createWebsocketProvider(
  id: string,
  yjsDocMap: Map<string, Y.Doc>,
): Provider {
  const doc = getDocFromMap(id, yjsDocMap);

  const provider = new WebsocketProvider("ws://localhost:1234", id, doc, {
    connect: false,
  });

  return provider as unknown as Provider;
}

function getDocFromMap(id: string, yjsDocMap: Map<string, Y.Doc>): Y.Doc {
  let doc = yjsDocMap.get(id);

  if (doc === undefined) {
    doc = new Y.Doc();
    yjsDocMap.set(id, doc);
  } else {
    doc.load();
  }

  return doc;
}
