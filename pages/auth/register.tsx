import { useState } from 'react';
import { useRouter } from 'next/router';
import { 
  Box, 
  Card, 
  TextField, 
  Button, 
  Typography, 
  Alert,
  Link
} from '@mui/material';

export default function Register() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    confirmPassword: '',
    name: ''
  });
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    try {
      const res = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: formData.email,
          password: formData.password,
          name: formData.name
        })
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error);
      }

      // Redirect to sign in page
      router.push('/auth/signin');
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <Box sx={{ 
      display: 'flex', 
      justifyContent: 'center', 
      alignItems: 'center', 
      minHeight: '100vh' 
    }}>
      <Card sx={{ p: 4, maxWidth: 400, width: '100%' }}>
        <Typography variant="h5" gutterBottom>
          Register
        </Typography>
        
        {error && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {error}
          </Alert>
        )}

        <form onSubmit={handleSubmit}>
          <TextField
            label="Name"
            fullWidth
            margin="normal"
            value={formData.name}
            onChange={(e) => setFormData(prev => ({ 
              ...prev, 
              name: e.target.value 
            }))}
            required
          />
          <TextField
            label="Email"
            type="email"
            fullWidth
            margin="normal"
            value={formData.email}
            onChange={(e) => setFormData(prev => ({ 
              ...prev, 
              email: e.target.value 
            }))}
            required
          />
          <TextField
            label="Password"
            type="password"
            fullWidth
            margin="normal"
            value={formData.password}
            onChange={(e) => setFormData(prev => ({ 
              ...prev, 
              password: e.target.value 
            }))}
            required
          />
          <TextField
            label="Confirm Password"
            type="password"
            fullWidth
            margin="normal"
            value={formData.confirmPassword}
            onChange={(e) => setFormData(prev => ({ 
              ...prev, 
              confirmPassword: e.target.value 
            }))}
            required
          />
          <Button
            type="submit"
            variant="contained"
            fullWidth
            sx={{ mt: 2 }}
          >
            Register
          </Button>
          <Box sx={{ mt: 2, textAlign: 'center' }}>
            Already have an account?{' '}
            <Link href="/auth/signin">
              Sign In
            </Link>
          </Box>
        </form>
      </Card>
    </Box>
  );
} 