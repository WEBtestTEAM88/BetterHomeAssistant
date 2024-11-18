declare module 'aedes' {
  import { Server } from 'net';
  import { EventEmitter } from 'events';

  interface AedesClient {
    id: string;
  }

  interface AedesPacket {
    topic: string;
    payload: Buffer;
    qos: number;
    retain: boolean;
  }

  interface AedesInstance extends EventEmitter {
    handle: (stream: any) => void;
    publish: (packet: AedesPacket, callback?: (error?: Error) => void) => void;
    subscribe: (topic: string, callback: (packet: AedesPacket) => void) => void;
    on(event: 'client', listener: (client: AedesClient) => void): this;
    on(event: 'publish', listener: (packet: AedesPacket, client?: AedesClient) => void): this;
  }

  interface AedesOptions {
    id?: string;
    concurrency?: number;
    heartbeatInterval?: number;
    connectTimeout?: number;
  }

  function aedes(options?: AedesOptions): AedesInstance;
  export = aedes;
} 