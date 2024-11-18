import React, { useState } from 'react';
import { 
  Card, 
  Typography, 
  Button,
  Dialog,
  TextField,
  Box,
  Switch
} from '@mui/material';

interface Scene {
  id: string;
  name: string;
  devices: Array<{
    id: string;
    state: boolean;
    value?: number;
  }>;
}

const Scenes: React.FC = () => {
  const [scenes, setScenes] = useState<Scene[]>([]);
  const [openDialog, setOpenDialog] = useState(false);
  const [newScene, setNewScene] = useState<Partial<Scene>>({});

  const activateScene = (sceneId: string) => {
    // Activate scene through MQTT
  };

  return (
    <Box>
      <Typography variant="h5">Scenes</Typography>
      <Button 
        variant="contained" 
        onClick={() => setOpenDialog(true)}
        sx={{ mt: 2, mb: 2 }}
      >
        Create New Scene
      </Button>

      <Grid container spacing={2}>
        {scenes.map(scene => (
          <Grid item xs={12} sm={6} md={4} key={scene.id}>
            <Card sx={{ p: 2 }}>
              <Typography variant="h6">{scene.name}</Typography>
              <Button 
                variant="contained" 
                onClick={() => activateScene(scene.id)}
              >
                Activate
              </Button>
            </Card>
          </Grid>
        ))}
      </Grid>

      <Dialog open={openDialog} onClose={() => setOpenDialog(false)}>
        {/* Scene creation form */}
      </Dialog>
    </Box>
  );
};

export default Scenes; 