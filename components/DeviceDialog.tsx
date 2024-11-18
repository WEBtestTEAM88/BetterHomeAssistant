import React from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
  FormControl,
  InputLabel,
  Select,
  MenuItem
} from '@mui/material';

interface DeviceDialogProps {
  open: boolean;
  device: any | null;
  onClose: () => void;
  onSave: (deviceData: any) => void;
}

const DeviceDialog: React.FC<DeviceDialogProps> = ({
  open,
  device,
  onClose,
  onSave
}) => {
  const [formData, setFormData] = React.useState({
    name: '',
    type: 'light',
    roomId: ''
  });

  React.useEffect(() => {
    if (device) {
      setFormData({
        name: device.name,
        type: device.type,
        roomId: device.roomId || ''
      });
    } else {
      setFormData({
        name: '',
        type: 'light',
        roomId: ''
      });
    }
  }, [device]);

  const handleSubmit = () => {
    onSave(formData);
  };

  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle>
        {device ? 'Edit Device' : 'Add New Device'}
      </DialogTitle>
      <DialogContent>
        <TextField
          label="Device Name"
          fullWidth
          margin="normal"
          value={formData.name}
          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
        />
        <FormControl fullWidth margin="normal">
          <InputLabel>Device Type</InputLabel>
          <Select
            value={formData.type}
            onChange={(e) => setFormData({ ...formData, type: e.target.value })}
          >
            <MenuItem value="light">Light</MenuItem>
            <MenuItem value="thermostat">Thermostat</MenuItem>
            <MenuItem value="security">Security</MenuItem>
            <MenuItem value="blinds">Blinds</MenuItem>
          </Select>
        </FormControl>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Cancel</Button>
        <Button onClick={handleSubmit} variant="contained">
          Save
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default DeviceDialog; 