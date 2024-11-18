import {
  LightbulbOutlined,
  ThermostatAuto,
  Security,
  WbSunny
} from '@mui/icons-material';

export const getDeviceIcon = (type: string) => {
  switch (type) {
    case 'light': return <LightbulbOutlined />;
    case 'thermostat': return <ThermostatAuto />;
    case 'security': return <Security />;
    case 'blinds': return <WbSunny />;
    default: return null;
  }
}; 