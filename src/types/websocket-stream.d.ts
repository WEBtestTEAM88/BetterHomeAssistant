declare module 'websocket-stream' {
    import { Duplex } from 'stream';
    function websocketStream(target: string | object, options?: any): Duplex;
    export = websocketStream;
} 