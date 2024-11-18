import React, { useState } from 'react';
import { 
  Card, 
  Typography, 
  Button, 
  Dialog, 
  TextField,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Box
} from '@mui/material';

interface AutomationRule {
  id: string;
  name: string;
  condition: {
    type: string;
    device?: string;
    value: any;
    operator: string;
  };
  actions: Array<{
    device: string;
    action: string;
    value: any;
  }>;
  active: boolean;
}

const AutomationRules: React.FC = () => {
  const [rules, setRules] = useState<AutomationRule[]>([]);
  const [openDialog, setOpenDialog] = useState(false);
  const [newRule, setNewRule] = useState<Partial<AutomationRule>>({});

  const handleSaveRule = () => {
    // Save rule to backend
    setOpenDialog(false);
  };

  return (
    <Box>
      <Typography variant="h5">Automation Rules</Typography>
      <Button 
        variant="contained" 
        onClick={() => setOpenDialog(true)}
        sx={{ mt: 2, mb: 2 }}
      >
        Add New Rule
      </Button>

      {rules.map(rule => (
        <Card key={rule.id} sx={{ p: 2, mb: 2 }}>
          <Typography variant="h6">{rule.name}</Typography>
          <Typography>
            When {rule.condition.type} {rule.condition.operator} {rule.condition.value}
          </Typography>
          <Typography>
            Then: {rule.actions.map(action => 
              `${action.device} ${action.action} ${action.value}`
            ).join(', ')}
          </Typography>
        </Card>
      ))}

      <Dialog open={openDialog} onClose={() => setOpenDialog(false)}>
        {/* Rule creation form */}
      </Dialog>
    </Box>
  );
};

export default AutomationRules; 