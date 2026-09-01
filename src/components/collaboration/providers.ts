import type { Provider } from "@lexical/yjs"

import { WebrtcProvider } from "y-webrtc"
import { WebsocketProvider } from "y-websocket"
import * as Y from "yjs"

// In React strict mode a provider may be created twice for the same room,
// which y-webrtc treats as an error. A per-window suffix keeps rooms unique
// while staying deterministic across the embedded iframes.
let idSuffix = 0

/**
 * Syncs same-origin windows (tabs and the two demo iframes) through the
 * BroadcastChannel API, so no signaling or relay server is required.
 */
export function createWebRTCProvider(
  id: string,
  yjsDocMap: Map<string, Y.Doc>
): Provider {
  const doc = getDocFromMap(id, yjsDocMap)

  const provider = new WebrtcProvider(`${id}/${idSuffix++}`, doc, {
    signaling: [],
  })

  return provider as unknown as Provider
}

/**
 * Syncs across browsers through a Yjs websocket server. Start one locally with
 * `HOST=localhost PORT=1234 npx y-websocket` and open the editor with
 * `?provider=ws`.
 */
export function createWebsocketProvider(
  id: string,
  yjsDocMap: Map<string, Y.Doc>
): Provider {
  const doc = getDocFromMap(id, yjsDocMap)

  const provider = new WebsocketProvider("ws://localhost:1234", id, doc, {
    connect: false,
  })

  return provider as unknown as Provider
}

function getDocFromMap(id: string, yjsDocMap: Map<string, Y.Doc>): Y.Doc {
  let doc = yjsDocMap.get(id)

  if (doc === undefined) {
    doc = new Y.Doc()
    yjsDocMap.set(id, doc)
  } else {
    doc.load()
  }

  return doc
}
