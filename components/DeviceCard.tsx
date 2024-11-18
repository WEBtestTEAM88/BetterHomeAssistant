import React from 'react';
import { Card, Box, Typography, Switch, Slider, IconButton } from '@mui/material';
import { Edit as EditIcon } from '@mui/icons-material';
import { getDeviceIcon } from '../utils/deviceIcons';

interface DeviceCardProps {
  device: {
    id: string;
    name: string;
    type: 'light' | 'thermostat' | 'security' | 'blinds';
    state: boolean;
    value?: number;
  };
  onToggle: (id: string) => void;
  onValueChange: (id: string, value: number) => void;
  onEdit: () => void;
}

const DeviceCard: React.FC<DeviceCardProps> = ({
  device,
  onToggle,
  onValueChange,
  onEdit
}) => {
  return (
    <Card sx={{ p: 2 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          {getDeviceIcon(device.type)}
          <Typography variant="h6" sx={{ ml: 1 }}>
            {device.name}
          </Typography>
        </Box>
        <IconButton onClick={onEdit} size="small">
          <EditIcon />
        </IconButton>
      </Box>
      <Box sx={{ display: 'flex', alignItems: 'center' }}>
        <Switch
          checked={device.state}
          onChange={() => onToggle(device.id)}
        />
        {device.value !== undefined && (
          <Slider
            value={device.value}
            onChange={(_, newValue) => onValueChange(device.id, newValue as number)}
            disabled={!device.state}
            min={0}
            max={device.type === 'thermostat' ? 30 : 100}
            sx={{ ml: 2 }}
            valueLabelDisplay="auto"
          />
        )}
      </Box>
    </Card>
  );
};

export default DeviceCard; 