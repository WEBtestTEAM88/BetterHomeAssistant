declare module 'aedes' {
  import { Server } from 'net';
  import { EventEmitter } from 'events';

  interface AedesOptions {
    id?: string;
    concurrency?: number;
    heartbeatInterval?: number;
    connectTimeout?: number;
  }

  interface AedesPublishPacket {
    topic: string;
    payload: Buffer;
    qos: number;
    retain: boolean;
  }

  interface AedesClient extends EventEmitter {
    id: string;
  }

  class Aedes extends EventEmitter {
    constructor(options?: AedesOptions);
    handle(stream: any): void;
    publish(packet: AedesPublishPacket, callback?: (error?: Error) => void): void;
    subscribe(topic: string, callback: (packet: AedesPublishPacket) => void): void;
    on(event: 'client', listener: (client: AedesClient) => void): this;
    on(event: 'publish', listener: (packet: AedesPublishPacket, client?: AedesClient) => void): this;
  }

  export default function aedes(options?: AedesOptions): Aedes;
} 