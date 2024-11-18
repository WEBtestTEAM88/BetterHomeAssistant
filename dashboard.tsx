'use client'

import React, { useState, useEffect } from 'react';
import { 
  Grid, Card, Typography, Switch, Slider, Box, Button,
  CircularProgress, Alert, Snackbar, IconButton,
  Dialog, DialogTitle, DialogContent, TextField, DialogActions
} from '@mui/material';
import { 
  LightbulbOutlined, 
  ThermostatAuto, 
  Security, 
  WbSunny,
  Add as AddIcon,
  Edit as EditIcon
} from '@mui/icons-material';
import { useMQTT } from './contexts/MQTTContext';
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';
import UserManagement from '../components/UserManagement';
import { useSession } from 'next-auth/react';

interface DeviceState {
  id: string;
  name: string;
  type: 'light' | 'thermostat' | 'security' | 'blinds';
  state: boolean;
  value?: number;
}

interface Room {
  id: string;
  name: string;
  devices: DeviceState[];
}

const Dashboard: React.FC = () => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [openDialog, setOpenDialog] = useState(false);
  const [selectedDevice, setSelectedDevice] = useState<DeviceState | null>(null);
  const { publishDeviceState, publishDeviceValue } = useMQTT();

  const [rooms, setRooms] = useState<Room[]>([]);
  const [selectedRoom, setSelectedRoom] = useState<string | null>(null);
  const [deviceHistory, setDeviceHistory] = useState<any[]>([]);

  const [devices, setDevices] = React.useState<DeviceState[]>([
    { id: '1', name: 'Living Room Light', type: 'light', state: false },
    { id: '2', name: 'Temperature Control', type: 'thermostat', state: true, value: 22 },
    { id: '3', name: 'Security System', type: 'security', state: true },
    { id: '4', name: 'Living Room Blinds', type: 'blinds', state: false, value: 0 },
  ]);

  const { data: session } = useSession();

  useEffect(() => {
    fetchRoomsAndDevices();
  }, []);

  const fetchRoomsAndDevices = async () => {
    try {
      const response = await fetch('/api/rooms');
      const data = await response.json();
      setRooms(data);
      setLoading(false);
    } catch (err) {
      setError('Failed to load rooms and devices');
      setLoading(false);
    }
  };

  const handleDeviceToggle = async (deviceId: string) => {
    try {
      const device = devices.find(d => d.id === deviceId);
      if (!device) return;

      const newState = !device.state;
      await publishDeviceState(deviceId, newState);
      
      setDevices(prev => 
        prev.map(d => d.id === deviceId ? { ...d, state: newState } : d)
      );
    } catch (err) {
      setError('Failed to toggle device');
    }
  };

  const handleDeviceValue = async (deviceId: string, newValue: number) => {
    try {
      await publishDeviceValue(deviceId, newValue);
      setDevices(prev => 
        prev.map(d => d.id === deviceId ? { ...d, value: newValue } : d)
      );
    } catch (err) {
      setError('Failed to update device value');
    }
  };

  const getDeviceIcon = (type: string) => {
    switch (type) {
      case 'light': return <LightbulbOutlined />;
      case 'thermostat': return <ThermostatAuto />;
      case 'security': return <Security />;
      case 'blinds': return <WbSunny />;
      default: return null;
    }
  };

  const handleSaveDevice = async (deviceData: any) => {
    try {
      const response = await fetch('/api/devices', {
        method: selectedDevice ? 'PUT' : 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...deviceData,
          id: selectedDevice?.id
        }),
      });

      if (!response.ok) throw new Error('Failed to save device');

      fetchRoomsAndDevices();
      setOpenDialog(false);
      setSelectedDevice(null);
    } catch (err) {
      setError('Failed to save device');
    }
  };

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box sx={{ flexGrow: 1, p: 3 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 3 }}>
        <Typography variant="h4">Smart Home Dashboard</Typography>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={() => setOpenDialog(true)}
        >
          Add Device
        </Button>
      </Box>

      {/* Room Selection */}
      <Card sx={{ p: 2, mb: 3 }}>
        <Typography variant="h6" gutterBottom>Rooms</Typography>
        <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
          <Button
            variant={selectedRoom === null ? 'contained' : 'outlined'}
            onClick={() => setSelectedRoom(null)}
          >
            All Rooms
          </Button>
          {rooms.map(room => (
            <Button
              key={room.id}
              variant={selectedRoom === room.id ? 'contained' : 'outlined'}
              onClick={() => setSelectedRoom(room.id)}
            >
              {room.name}
            </Button>
          ))}
        </Box>
      </Card>

      {/* Devices Grid */}
      <Grid container spacing={3}>
        {devices
          .filter(device => !selectedRoom || device.roomId === selectedRoom)
          .map(device => (
            <Grid item xs={12} sm={6} md={4} key={device.id}>
              <DeviceCard
                device={device}
                onToggle={handleDeviceToggle}
                onValueChange={handleDeviceValue}
                onEdit={() => {
                  setSelectedDevice(device);
                  setOpenDialog(true);
                }}
              />
            </Grid>
          ))}
      </Grid>

      {session?.user?.role === 'ADMIN' && (
        <Box sx={{ mt: 4 }}>
          <UserManagement />
        </Box>
      )}

      {/* Error Snackbar */}
      <Snackbar
        open={!!error}
        autoHideDuration={6000}
        onClose={() => setError(null)}
      >
        <Alert severity="error">{error}</Alert>
      </Snackbar>

      {/* Device Dialog */}
      <DeviceDialog
        open={openDialog}
        device={selectedDevice}
        onClose={() => {
          setOpenDialog(false);
          setSelectedDevice(null);
        }}
        onSave={handleSaveDevice}
      />
    </Box>
  );
};

export default Dashboard;