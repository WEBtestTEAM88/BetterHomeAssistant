declare module 'websocket-stream' {
  import { Server } from 'http';
  import { Duplex } from 'stream';

  interface WebSocketStreamOptions {
    server: Server;
    binary?: boolean;
    browserBufferSize?: number;
    browserBufferTimeout?: number;
    perMessageDeflate?: boolean;
    protocol?: string;
  }

  function WebSocketStream(options: WebSocketStreamOptions, callback?: (stream: Duplex) => void): void;
  
  namespace WebSocketStream {
    function createServer(options: WebSocketStreamOptions, callback?: (stream: Duplex) => void): void;
  }

  export = WebSocketStream;
} 