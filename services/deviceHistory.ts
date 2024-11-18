import prisma from '../lib/prisma';

export async function recordDeviceState(deviceId: string, state: boolean, value?: number) {
  try {
    await prisma.device.update({
      where: { id: deviceId },
      data: {
        state,
        value,
        lastUpdated: new Date(),
        history: {
          create: {
            state,
            value,
            timestamp: new Date()
          }
        }
      }
    });
  } catch (error) {
    console.error('Failed to record device state:', error);
  }
} 