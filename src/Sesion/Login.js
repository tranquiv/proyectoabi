import React, { useState } from 'react';    
import { useNavigate } from 'react-router-dom';
import { fakeAuth } from './Managements';
import { TextField, Button, Box, Typography, IconButton, InputAdornment, CircularProgress, Snackbar } from '@mui/material';
import { Visibility, VisibilityOff } from '@mui/icons-material';

const Login = ({ setUpdate }) => {
  const [name, setName] = useState(''); // Estado para el nombre de usuario (coincide con Firestore)
  const [pin, setPin] = useState('');
  const [showPin, setShowPin] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async () => {
    setLoading(true);
    setErrorMessage('');

    try {
      const isAuthenticated = await fakeAuth.login(name, pin, navigate, setUpdate);
      if (!isAuthenticated) {
        setErrorMessage('Usuario o PIN incorrectos.');
        setOpenSnackbar(true);
      }
    } catch (error) {
      setErrorMessage('Error al autenticar el usuario. Intente nuevamente.');
      setOpenSnackbar(true);
    } finally {
      setLoading(false);
    }
  };

  const handleCloseSnackbar = () => {
    setOpenSnackbar(false);
  };

  return (
    <Box textAlign="center" mt={10} sx={{ maxWidth: 400, mx: 'auto', padding: 2 }}>
      <Typography variant="h4" gutterBottom sx={{ fontWeight: 'bold', color: '#FF6F00' }}>
        Iniciar Sesión
      </Typography>

      <TextField
        label="Ingrese su usuario"
        variant="outlined"
        value={name}
        onChange={(e) => setName(e.target.value)}
        onKeyDown={(e) => e.key === 'Enter' && handleLogin()}
        sx={{
          marginBottom: '20px', 
          width: '100%',  // Asegura que ocupe todo el ancho posible
          '& .MuiInputLabel-root': { color: '#FF6F00' },
          '& .MuiOutlinedInput-root': { 
            '& fieldset': { borderColor: '#FF6F00' },
            '&:hover fieldset': { borderColor: '#FF6F00' },
            '&.Mui-focused fieldset': { borderColor: '#FF6F00' }
          }
        }}
      />
      
      <TextField
        label="Ingrese su PIN"
        variant="outlined"
        type={showPin ? 'text' : 'password'}
        value={pin}
        onChange={(e) => setPin(e.target.value)}
        onKeyDown={(e) => e.key === 'Enter' && handleLogin()}
        inputProps={{ maxLength: 5 }}
        sx={{
          marginBottom: '20px', 
          width: '100%',  // Asegura que ocupe todo el ancho posible
          '& .MuiInputLabel-root': { color: '#FF6F00' },
          '& .MuiOutlinedInput-root': { 
            '& fieldset': { borderColor: '#FF6F00' },
            '&:hover fieldset': { borderColor: '#FF6F00' },
            '&.Mui-focused fieldset': { borderColor: '#FF6F00' }
          }
        }}
        InputProps={{
          endAdornment: (
            <InputAdornment position="end">
              <IconButton onClick={() => setShowPin(!showPin)} edge="end">
                {showPin ? <VisibilityOff /> : <Visibility />}
              </IconButton>
            </InputAdornment>
          ),
        }}
      />
      
      <Button 
        variant="contained" 
        color="warning" 
        onClick={handleLogin} 
        disabled={loading}
        sx={{ 
          backgroundColor: '#FF6F00', 
          '&:hover': { backgroundColor: '#E65100' },
          marginBottom: '20px',
          width: '100%' // Botón ocupará el ancho completo
        }}
      >
        {loading ? <CircularProgress size={24} /> : 'Ingresar'}
      </Button>

      <Snackbar
        open={openSnackbar}
        autoHideDuration={6000}
        onClose={handleCloseSnackbar}
        message={errorMessage}
        sx={{
          '& .MuiSnackbarContent-root': {
            backgroundColor: '#FF7043', // Naranja para error
            color: '#fff',
            borderRadius: '8px',
            padding: '10px',
          }
        }}
      />
    </Box>
  );
};

export default Login;
