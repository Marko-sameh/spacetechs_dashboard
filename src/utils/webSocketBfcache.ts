/**
 * BFCache-compatible WebSocket that enables back/forward cache
 */

class BfcacheWebSocket {
  private ws: WebSocket | null = null;
  private url: string;
  private shouldReconnect = true;

  constructor(url: string) {
    this.url = url;
    this.setupBfcacheHandlers();
  }

  connect() {
    if (this.ws?.readyState === WebSocket.OPEN) return;
    this.ws = new WebSocket(this.url);
  }

  disconnect() {
    this.shouldReconnect = false;
    this.ws?.close();
    this.ws = null;
  }

  private setupBfcacheHandlers() {
    // Critical: Close WebSocket before page hide to enable bfcache
    window.addEventListener('pagehide', () => {
      this.ws?.close();
    }, { passive: true });

    // Reconnect when page shows from bfcache
    window.addEventListener('pageshow', (event) => {
      if (event.persisted && this.shouldReconnect) {
        this.connect();
      }
    }, { passive: true });
  }
}

export const createBfcacheWebSocket = (url: string) => new BfcacheWebSocket(url);