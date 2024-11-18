export class DeviceMonitor {
  private static instance: DeviceMonitor;
  private deviceStatus: Map<string, boolean> = new Map();

  static getInstance() {
    if (!DeviceMonitor.instance) {
      DeviceMonitor.instance = new DeviceMonitor();
    }
    return DeviceMonitor.instance;
  }

  updateDeviceStatus(deviceId: string, isOnline: boolean) {
    this.deviceStatus.set(deviceId, isOnline);
  }

  isDeviceOnline(deviceId: string): boolean {
    return this.deviceStatus.get(deviceId) || false;
  }
} 