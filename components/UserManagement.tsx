import React, { useState, useEffect } from 'react';
import {
  Box,
  Card,
  Typography,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Select,
  MenuItem,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  IconButton,
  FormControl,
  InputLabel,
  FormGroup,
  FormControlLabel,
  Switch,
  CircularProgress
} from '@mui/material';
import { Add as AddIcon, Delete as DeleteIcon, Edit as EditIcon } from '@mui/icons-material';

interface User {
  id: string;
  email: string;
  name: string;
  role: 'ADMIN' | 'USER' | 'GUEST';
}

interface UserPermissions {
  canControlDevices: boolean;
  canCreateScenes: boolean;
  canCreateAutomations: boolean;
  canViewHistory: boolean;
  canManageRooms: boolean;
  allowedRooms: string[];
}

interface UserFormData {
  email: string;
  password: string;
  name: string;
  role: 'ADMIN' | 'USER' | 'GUEST';
  permissions: UserPermissions;
}

const UserManagement: React.FC = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [openDialog, setOpenDialog] = useState(false);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [formData, setFormData] = useState<UserFormData>({
    email: '',
    password: '',
    name: '',
    role: 'USER',
    permissions: {
      canControlDevices: true,
      canCreateScenes: false,
      canCreateAutomations: false,
      canViewHistory: true,
      canManageRooms: false,
      allowedRooms: []
    }
  });
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const response = await fetch('/api/admin/users');
      const data = await response.json();
      setUsers(data);
    } catch (error) {
      console.error('Failed to fetch users:', error);
    }
  };

  const handleSubmit = async () => {
    setIsLoading(true);
    try {
      const response = await fetch('/api/admin/users', {
        method: selectedUser ? 'PUT' : 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...formData,
          id: selectedUser?.id
        }),
      });

      if (!response.ok) throw new Error('Failed to save user');

      fetchUsers();
      handleCloseDialog();
    } catch (error) {
      console.error('Error saving user:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeleteUser = async (userId: string) => {
    if (!confirm('Are you sure you want to delete this user?')) return;

    try {
      const response = await fetch(`/api/admin/users/${userId}`, {
        method: 'DELETE',
      });

      if (!response.ok) throw new Error('Failed to delete user');

      fetchUsers();
    } catch (error) {
      console.error('Error deleting user:', error);
    }
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setSelectedUser(null);
    setFormData({
      email: '',
      password: '',
      name: '',
      role: 'USER',
      permissions: {
        canControlDevices: true,
        canCreateScenes: false,
        canCreateAutomations: false,
        canViewHistory: true,
        canManageRooms: false,
        allowedRooms: []
      }
    });
  };

  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 3 }}>
        <Typography variant="h5">User Management</Typography>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={() => setOpenDialog(true)}
        >
          Add User
        </Button>
      </Box>

      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Name</TableCell>
              <TableCell>Email</TableCell>
              <TableCell>Role</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {users.map((user) => (
              <TableRow key={user.id}>
                <TableCell>{user.name}</TableCell>
                <TableCell>{user.email}</TableCell>
                <TableCell>{user.role}</TableCell>
                <TableCell>
                  <IconButton
                    onClick={() => {
                      setSelectedUser(user);
                      setFormData({
                        email: user.email,
                        password: '',
                        name: user.name,
                        role: user.role,
                        permissions: user.permissions
                      });
                      setOpenDialog(true);
                    }}
                  >
                    <EditIcon />
                  </IconButton>
                  <IconButton
                    onClick={() => handleDeleteUser(user.id)}
                    color="error"
                  >
                    <DeleteIcon />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      <Dialog open={openDialog} onClose={handleCloseDialog}>
        <DialogTitle>
          {selectedUser ? 'Edit User' : 'Add New User'}
        </DialogTitle>
        <DialogContent>
          <TextField
            label="Name"
            fullWidth
            margin="normal"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
          />
          <TextField
            label="Email"
            fullWidth
            margin="normal"
            value={formData.email}
            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
          />
          <TextField
            label="Password"
            type="password"
            fullWidth
            margin="normal"
            value={formData.password}
            onChange={(e) => setFormData({ ...formData, password: e.target.value })}
          />
          <FormControl fullWidth margin="normal">
            <InputLabel>Role</InputLabel>
            <Select
              value={formData.role}
              onChange={(e) => setFormData({ ...formData, role: e.target.value as 'ADMIN' | 'USER' | 'GUEST' })}
            >
              <MenuItem value="ADMIN">Admin</MenuItem>
              <MenuItem value="USER">User</MenuItem>
              <MenuItem value="GUEST">Guest</MenuItem>
            </Select>
          </FormControl>
          
          <Typography variant="h6" sx={{ mt: 2, mb: 1 }}>
            Permissions
          </Typography>
          
          <FormGroup>
            <FormControlLabel
              control={
                <Switch
                  checked={formData.permissions.canControlDevices}
                  onChange={(e) => setFormData(prev => ({
                    ...prev,
                    permissions: {
                      ...prev.permissions,
                      canControlDevices: e.target.checked
                    }
                  }))}
                />
              }
              label="Can Control Devices"
            />
            <FormControlLabel
              control={
                <Switch
                  checked={formData.permissions.canCreateScenes}
                  onChange={(e) => setFormData(prev => ({
                    ...prev,
                    permissions: {
                      ...prev.permissions,
                      canCreateScenes: e.target.checked
                    }
                  }))}
                />
              }
              label="Can Create Scenes"
            />
            <FormControlLabel
              control={
                <Switch
                  checked={formData.permissions.canCreateAutomations}
                  onChange={(e) => setFormData(prev => ({
                    ...prev,
                    permissions: {
                      ...prev.permissions,
                      canCreateAutomations: e.target.checked
                    }
                  }))}
                />
              }
              label="Can Create Automations"
            />
            <FormControlLabel
              control={
                <Switch
                  checked={formData.permissions.canViewHistory}
                  onChange={(e) => setFormData(prev => ({
                    ...prev,
                    permissions: {
                      ...prev.permissions,
                      canViewHistory: e.target.checked
                    }
                  }))}
                />
              }
              label="Can View History"
            />
            <FormControlLabel
              control={
                <Switch
                  checked={formData.permissions.canManageRooms}
                  onChange={(e) => setFormData(prev => ({
                    ...prev,
                    permissions: {
                      ...prev.permissions,
                      canManageRooms: e.target.checked
                    }
                  }))}
                />
              }
              label="Can Manage Rooms"
            />
          </FormGroup>

          {/* Room Access Selection */}
          <FormControl fullWidth margin="normal">
            <InputLabel>Allowed Rooms</InputLabel>
            <Select
              multiple
              value={formData.permissions.allowedRooms}
              onChange={(e) => setFormData(prev => ({
                ...prev,
                permissions: {
                  ...prev.permissions,
                  allowedRooms: e.target.value as string[]
                }
              }))}
              renderValue={(selected) => selected.join(', ')}
            >
              {rooms.map((room) => (
                <MenuItem key={room.id} value={room.id}>
                  {room.name}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog}>Cancel</Button>
          <Button 
            onClick={handleSubmit} 
            variant="contained"
            disabled={isLoading}
          >
            {isLoading ? <CircularProgress size={24} /> : 'Save'}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default UserManagement; 