const aedes = require('aedes')();
const net = require('net');
const { createServer } = require('http');
const ws = require('websocket-stream');

interface AedesClient {
  id: string;
}

interface AedesPacket {
  topic: string;
  payload: Buffer;
}

const port = process.env.MQTT_PORT ? parseInt(process.env.MQTT_PORT) : 1883;
const wsPort = process.env.MQTT_WS_PORT ? parseInt(process.env.MQTT_WS_PORT) : 8888;

const server = net.createServer(aedes.handle.bind(aedes));
const httpServer = createServer();

// WebSocket support
ws.createServer({ server: httpServer }, aedes.handle.bind(aedes));

server.listen(port, () => {
  console.log(`MQTT Broker running on port ${port}`);
});

httpServer.listen(wsPort, () => {
  console.log(`WebSocket MQTT running on port ${wsPort}`);
});

// Handle client connections
aedes.on('client', (client: AedesClient) => {
  console.log(`Client Connected: ${client.id}`);
});

// Handle published messages
aedes.on('publish', (packet: AedesPacket, client: AedesClient | undefined) => {
  if (client) {
    console.log(`Message from ${client.id}:`, packet.payload.toString());
  }
});

module.exports = aedes; 