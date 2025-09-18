/* eslint-disable @typescript-eslint/no-explicit-any */

type Listener = (event: MessageEvent<any>) => void;

export type ReconnectingSocket = {
  send: (data: string) => void;
  close: () => void;
  isOpen: () => boolean;
  onMessage: (listener: Listener) => void;
  onOpen: (listener: () => void) => void;
  onClose: (listener: (ev?: CloseEvent | undefined) => void) => void;
  clearListeners: () => void;
};

type Options = {
  maxBackoffMs?: number;
  initialBackoffMs?: number;
  heartbeatMs?: number;
  makeUrl: () => string; // provide fresh token each reconnect
};

export function createReconnectingWebSocket({
  makeUrl,
  initialBackoffMs = 1000,
  maxBackoffMs = 30000,
  heartbeatMs = 30000,
}: Options): ReconnectingSocket {
  let socket: WebSocket | null = null;
  let backoffMs = initialBackoffMs;
  let heartbeatTimer: number | null = null;
  let reconnectTimer: number | null = null;
  let manuallyClosed = false;
  let isConnecting = false;

  const openListeners: Array<() => void> = [];
  const closeListeners: Array<(ev?: CloseEvent) => void> = [];
  const messageListeners: Array<Listener> = [];

  const scheduleReconnect = () => {
    if (manuallyClosed) return;
    if (reconnectTimer) return;
    const delay = Math.min(backoffMs, maxBackoffMs);
    reconnectTimer = window.setTimeout(() => {
      reconnectTimer = null;
      backoffMs = Math.min(backoffMs * 2, maxBackoffMs);
      connect();
    }, delay);
  };

  const clearHeartbeat = () => {
    if (heartbeatTimer) {
      window.clearInterval(heartbeatTimer);
      heartbeatTimer = null;
    }
  };

  const startHeartbeat = () => {
    clearHeartbeat();
    heartbeatTimer = window.setInterval(() => {
      if (socket && socket.readyState === WebSocket.OPEN) {
        try {
          socket.send(JSON.stringify({ type: "ping" }));
        } catch (_) {
          // ignore send errors; reconnect will handle
        }
      }
    }, heartbeatMs);
  };

  const connect = () => {
    if (isConnecting || manuallyClosed) return;
    
    isConnecting = true;
    
    try {
      const url = makeUrl();
      socket = new WebSocket(url);

      socket.onopen = () => {
        isConnecting = false;
        backoffMs = initialBackoffMs; // reset backoff on success
        startHeartbeat();
        openListeners.forEach((l) => l());
      };

      socket.onmessage = (ev) => {
        messageListeners.forEach((l) => l(ev));
      };

      socket.onclose = (ev) => {
        isConnecting = false;
        clearHeartbeat();
        closeListeners.forEach((l) => l(ev));
        scheduleReconnect();
      };

      socket.onerror = () => {
        isConnecting = false;
        // error will usually be followed by close; ensure reconnect
        try { socket?.close(); } catch (_) { /* noop */ }
      };
    } catch (_) {
      isConnecting = false;
      scheduleReconnect();
    }
  };

  // kick off first connection lazily after microtask to allow listeners to attach
  Promise.resolve().then(connect);

  return {
    send: (data: string) => {
      if (socket && socket.readyState === WebSocket.OPEN) {
        socket.send(data);
      }
    },
    close: () => {
      manuallyClosed = true;
      isConnecting = false;
      clearHeartbeat();
      if (reconnectTimer) {
        window.clearTimeout(reconnectTimer);
        reconnectTimer = null;
      }
      try { socket?.close(); } catch (_) { /* noop */ }
      socket = null;
    },
    isOpen: () => socket?.readyState === WebSocket.OPEN,
    onMessage: (listener: Listener) => { messageListeners.push(listener); },
    onOpen: (listener: () => void) => { openListeners.push(listener); },
    onClose: (listener: (ev?: CloseEvent) => void) => { closeListeners.push(listener); },
    clearListeners: () => {
      messageListeners.length = 0;
      openListeners.length = 0;
      closeListeners.length = 0;
    },
  };
}


