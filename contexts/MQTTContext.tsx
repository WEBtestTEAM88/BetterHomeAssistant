import React, { createContext, useContext, useEffect, useState } from 'react';
import MQTTService from '../services/mqtt';

interface MQTTContextType {
  publishDeviceState: (deviceId: string, state: boolean) => void;
  publishDeviceValue: (deviceId: string, value: number) => void;
}

const MQTTContext = createContext<MQTTContextType | null>(null);

export const MQTTProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [mqttService] = useState(() => MQTTService.getInstance());

  const value = {
    publishDeviceState: mqttService.publishDeviceState.bind(mqttService),
    publishDeviceValue: mqttService.publishDeviceValue.bind(mqttService),
  };

  return (
    <MQTTContext.Provider value={value}>
      {children}
    </MQTTContext.Provider>
  );
};

export const useMQTT = () => {
  const context = useContext(MQTTContext);
  if (!context) {
    throw new Error('useMQTT must be used within an MQTTProvider');
  }
  return context;
}; 