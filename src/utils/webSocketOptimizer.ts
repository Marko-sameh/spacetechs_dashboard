/**
 * WebSocket optimization to prevent back/forward cache issues
 */
export class OptimizedWebSocket {
  private ws: WebSocket | null = null;
  private url: string;
  private protocols?: string | string[];
  private reconnectAttempts = 0;
  private maxReconnectAttempts = 5;
  private reconnectDelay = 1000;
  private isPageVisible = true;
  constructor(url: string, protocols?: string | string[]) {
    this.url = url;
    this.protocols = protocols;
    // Handle page visibility changes to optimize connection
    this.setupVisibilityHandlers();
    // Handle page unload to properly close connection
    this.setupUnloadHandlers();
  }
  connect() {
    if (this.ws?.readyState === WebSocket.OPEN) return;
    try {
      this.ws = new WebSocket(this.url, this.protocols);
      this.setupEventHandlers();
    } catch (error) {
      console.error('WebSocket connection failed:', error);
      this.scheduleReconnect();
    }
  }
  disconnect() {
    if (this.ws) {
      this.ws.close(1000, 'Normal closure');
      this.ws = null;
    }
    this.reconnectAttempts = 0;
  }
  send(data: string | ArrayBufferLike | Blob | ArrayBufferView) {
    if (this.ws?.readyState === WebSocket.OPEN) {
      this.ws.send(data);
    } else {
    }
  }
  private setupEventHandlers() {
    if (!this.ws) return;
    this.ws.onopen = () => {
      this.reconnectAttempts = 0;
    };
    this.ws.onclose = (event) => {
      // Only reconnect if page is visible and it wasn't a normal closure
      if (this.isPageVisible && event.code !== 1000 && this.reconnectAttempts < this.maxReconnectAttempts) {
        this.scheduleReconnect();
      }
    };
    this.ws.onerror = (error) => {
      console.error('WebSocket error:', error);
    };
  }
  private scheduleReconnect() {
    this.reconnectAttempts++;
    const delay = this.reconnectDelay * Math.pow(2, this.reconnectAttempts - 1);
    setTimeout(() => {
      if (this.isPageVisible) {
        this.connect();
      }
    }, delay);
  }
  private setupVisibilityHandlers() {
    document.addEventListener('visibilitychange', () => {
      this.isPageVisible = !document.hidden;
      if (document.hidden) {
        // Page is hidden, close connection to allow bfcache
        this.disconnect();
      } else {
        // Page is visible again, reconnect
        this.connect();
      }
    });
  }
  private setupUnloadHandlers() {
    // Handle page unload to properly close WebSocket
    const handleUnload = () => {
      if (this.ws) {
        this.ws.close(1000, 'Page unload');
      }
    };
    window.addEventListener('beforeunload', handleUnload);
    window.addEventListener('pagehide', handleUnload);
    // For better bfcache compatibility
    window.addEventListener('pageshow', (event) => {
      if (event.persisted) {
        // Page was restored from bfcache, reconnect if needed
        this.connect();
      }
    });
  }
}
// Factory function for creating optimized WebSocket instances
export const createOptimizedWebSocket = (url: string, protocols?: string | string[]) => {
  return new OptimizedWebSocket(url, protocols);
};