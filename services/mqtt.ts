import mqtt from 'mqtt';
import { recordDeviceState } from './deviceHistory';
import { getSession } from 'next-auth/react';

class MQTTService {
  private client: mqtt.Client;
  private static instance: MQTTService;

  private constructor() {
    const session = getSession();
    
    this.client = mqtt.connect(`mqtt://${process.env.MQTT_HOST}:${process.env.MQTT_PORT}`, {
      clientId: `home_automation_${Math.random().toString(16).slice(2, 8)}`,
      username: session?.user?.email,
      password: process.env.MQTT_USER_PASSWORD,
      reconnectPeriod: 1000,
      keepalive: 60,
      clean: true
    });

    this.client.on('connect', () => {
      console.log('Connected to MQTT broker');
      this.subscribeToTopics();
    });

    this.client.on('message', (topic, message) => {
      this.handleMessage(topic, message);
    });
  }

  static getInstance(): MQTTService {
    if (!MQTTService.instance) {
      MQTTService.instance = new MQTTService();
    }
    return MQTTService.instance;
  }

  private subscribeToTopics() {
    const topics = [
      'home/devices/+/status',
      'home/devices/+/state',
      'home/devices/+/value'
    ];
    topics.forEach(topic => this.client.subscribe(topic));
  }

  private handleMessage(topic: string, message: Buffer) {
    // Handle incoming messages and update UI state
    const payload = JSON.parse(message.toString());
    // Implement your state management here (Redux, Context, etc.)
  }

  publishDeviceState(deviceId: string, state: boolean) {
    this.client.publish(
      `home/devices/${deviceId}/state`,
      JSON.stringify({ state })
    );
    // Record state change in database
    recordDeviceState(deviceId, state);
  }

  publishDeviceValue(deviceId: string, value: number) {
    this.client.publish(
      `home/devices/${deviceId}/value`,
      JSON.stringify({ value })
    );
    // Record value change in database
    recordDeviceState(deviceId, true, value);
  }
}

export default MQTTService; 