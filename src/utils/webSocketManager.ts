/**
 * WebSocket manager that enables bfcache
 */
class BfcacheCompatibleWebSocket {
  private ws: WebSocket | null = null;
  private url: string;
  private shouldReconnect = true;
  constructor(url: string) {
    this.url = url;
    this.setupPageHandlers();
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
  private setupPageHandlers() {
    // Close connection before page hide to enable bfcache
    window.addEventListener('pagehide', () => {
      this.ws?.close();
    });
    // Reconnect when page shows from bfcache
    window.addEventListener('pageshow', (event) => {
      if (event.persisted && this.shouldReconnect) {
        this.connect();
      }
    });
  }
}
export const createBfcacheWebSocket = (url: string) => 
  new BfcacheCompatibleWebSocket(url);