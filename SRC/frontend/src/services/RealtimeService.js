const WS_URL = import.meta.env.VITE_WS_URL ?? "ws://localhost:8000/api/ws/";

const listeners = new Map();

let socket = null;
let reconnectTimer = null;
let reconnectEnabled = false;

function emit(message) {
  const typeListeners = listeners.get(message.type);

  if (!typeListeners) {
    return;
  }

  typeListeners.forEach((listener) => {
    try {
      listener(message);
    } catch (error) {
      console.error(`Ошибка обработчика WebSocket: ${message.type}`, error);
    }
  });
}

function connect() {
  reconnectEnabled = true;

  if (
    socket?.readyState === WebSocket.OPEN ||
    socket?.readyState === WebSocket.CONNECTING
  ) {
    return;
  }

  const currentSocket = new WebSocket(WS_URL);
  socket = currentSocket;

  currentSocket.onopen = () => {
    console.log("WebSocket подключён");
  };

  currentSocket.onmessage = (event) => {
    try {
      const message = JSON.parse(event.data);
      emit(message);
    } catch (error) {
      console.error("Некорректное сообщение WebSocket", error);
    }
  };

  currentSocket.onerror = () => {
    currentSocket.close();
  };

  currentSocket.onclose = () => {
    if (socket === currentSocket) {
      socket = null;
    }

    if (!reconnectEnabled) {
      return;
    }

    clearTimeout(reconnectTimer);

    reconnectTimer = setTimeout(() => {
      connect();
    }, 1500);
  };
}

function disconnect() {
  reconnectEnabled = false;

  clearTimeout(reconnectTimer);
  reconnectTimer = null;

  const currentSocket = socket;
  socket = null;

  currentSocket?.close();
}

function subscribe(type, listener) {
  if (!listeners.has(type)) {
    listeners.set(type, new Set());
  }

  listeners.get(type).add(listener);

  return () => {
    const typeListeners = listeners.get(type);

    typeListeners?.delete(listener);

    if (typeListeners?.size === 0) {
      listeners.delete(type);
    }
  };
}

export const RealtimeService = {
  connect,
  disconnect,
  subscribe,
};
