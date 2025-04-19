import React, { useState } from 'react'; 
import { db } from "../firebaseConfig";
import { collection, addDoc } from 'firebase/firestore';
import { TextField, Button, Typography, Container, Grid, Box, List, ListItem, ListItemText } from '@mui/material';

function Datos() {
  const [formData, setFormData] = useState({
    facultad: '',
    docente: '',
    cedula: '',
    horas: '',
    horasSemanales: '',
    añoAcademico: '',
    objetivos: '',
    carreras: [],
  });

  const [carrera, setCarrera] = useState('');
  const [materia, setMateria] = useState('');
  const [horas, setHoras] = useState('');
  const [horasSemanales, setHorasSemanales] = useState('');

  // Definición de horas por carrera y materia
  const horasPorMateria = {
    'Ingeniería en Sistemas': {
      'Matemáticas': { horasTotales: 100, horasSemanales: 10 },
      'Programación': { horasTotales: 120, horasSemanales: 12 },
      'Redes': { horasTotales: 80, horasSemanales: 8 },
    },
    'Derecho': {
      'Derecho Penal': { horasTotales: 80, horasSemanales: 8 },
      'Derecho Civil': { horasTotales: 100, horasSemanales: 10 },
      'Constitucional': { horasTotales: 60, horasSemanales: 6 },
    }
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleAddMateria = () => {
    if (carrera && materia && horas && horasSemanales) {
      const existing = formData.carreras.find(c => c.nombre === carrera);
      if (existing) {
        existing.materias.push({ nombre: materia, horas, horasSemanales });
        setFormData({
          ...formData,
          carreras: [...formData.carreras],
        });
      } else {
        setFormData({
          ...formData,
          carreras: [...formData.carreras, { nombre: carrera, materias: [{ nombre: materia, horas, horasSemanales }] }],
        });
      }
      setMateria('');
      setHoras('');
      setHorasSemanales('');
    } else {
      alert("Por favor, completa todos los campos.");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await addDoc(collection(db, 'docentes'), formData);
      alert('Datos guardados exitosamente');
    } catch (error) {
      console.error('Error al guardar datos: ', error);
      alert('Error al guardar datos');
    }
  };

  return (
    <Container maxWidth="md" sx={{ mt: 10 }}>
      {/* Sección Datos del Docente */}
      <Box mb={4}>
        <Typography variant="h6" gutterBottom>
          Datos del Docente
        </Typography>
        <form onSubmit={handleSubmit}>
          <TextField 
            fullWidth 
            label="Facultad" 
            name="facultad" 
            value={formData.facultad} 
            onChange={handleChange} 
            margin="normal" 
            variant="outlined" 
          />
          <TextField 
            fullWidth 
            label="Docente" 
            name="docente" 
            value={formData.docente} 
            onChange={handleChange} 
            margin="normal" 
            variant="outlined" 
          />
          <TextField 
            fullWidth 
            label="Cédula de Identidad" 
            name="cedula" 
            value={formData.cedula} 
            onChange={handleChange} 
            margin="normal" 
            variant="outlined" 
          />
        </form>
      </Box>

      {/* Sección Datos de la Carrera y Materia */}
      <Box>
        <Typography variant="h6" gutterBottom>
          Datos de la Carrera y Materia
        </Typography>

        <Grid container spacing={2}>
          <Grid item xs={12}>
            <TextField 
              fullWidth 
              label="Carrera" 
              value={carrera} 
              onChange={(e) => setCarrera(e.target.value)} 
              margin="normal" 
              variant="outlined" 
            />
          </Grid>
          <Grid item xs={12}>
            <TextField 
              fullWidth 
              label="Materia" 
              value={materia} 
              onChange={(e) => setMateria(e.target.value)} 
              margin="normal" 
              variant="outlined" 
            />
          </Grid>
          <Grid item xs={6}>
            <TextField 
              fullWidth 
              label="Cantidad de Horas" 
              type="number" 
              value={horas} 
              onChange={(e) => setHoras(e.target.value)} 
              margin="normal" 
              variant="outlined" 
            />
          </Grid>
          <Grid item xs={6}>
            <TextField 
              fullWidth 
              label="Cantidad de Horas Semanales" 
              type="number" 
              value={horasSemanales} 
              onChange={(e) => setHorasSemanales(e.target.value)} 
              margin="normal" 
              variant="outlined" 
            />
          </Grid>
        </Grid>

        <Button 
          variant="contained" 
          color="primary" 
          onClick={handleAddMateria} 
          sx={{ mt: 2 }}
        >
          Agregar Materia
        </Button>

        {/* Mostrar las materias agregadas */}
        <List sx={{ mt: 3 }}>
          {formData.carreras.map((c, i) => (
            <ListItem key={i}>
              <ListItemText 
                primary={<strong>{c.nombre}</strong>}
                secondary={
                  <List>
                    {c.materias.map((m, j) => (
                      <ListItem key={j}>
                        <ListItemText 
                          primary={`${m.nombre} - Horas Totales: ${m.horas}, Horas Semanales: ${m.horasSemanales}`} 
                        />
                      </ListItem>
                    ))}
                  </List>
                }
              />
            </ListItem>
          ))}
        </List>
      </Box>

      <Box mt={4} display="flex" justifyContent="center">
        <Button 
          variant="contained" 
          color="success" 
          type="submit"
        >
          Guardar
        </Button>
      </Box>
    </Container>
  );
}

export default Datos;
