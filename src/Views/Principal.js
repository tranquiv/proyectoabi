import React, { useEffect, useState } from 'react'; 
import { Box, Typography, Container, Paper, Grid } from '@mui/material';

const Principal = () => {
  const [usuario, setUsuario] = useState(null);

  useEffect(() => {
    // Obtener el usuario desde el localStorage
    const u = JSON.parse(localStorage.getItem('usuario'));
    setUsuario(u);
  }, []);

  return (
    <Container maxWidth="md">
      <Paper elevation={5} sx={{ p: 6, mt: 15, borderRadius: 3, backgroundColor: "#FFEBE0" }}>
        <Typography variant="h4" gutterBottom align="center" sx={{ fontWeight: "bold", color: "#FF7043" }}>
          ¡Bienvenido{usuario ? `, ${usuario.name}` : ''}!
        </Typography>

        <Grid container justifyContent="center" sx={{ mt: 4 }}>
          <Grid item xs={12} sx={{ mb: 4 }}>
            <Typography variant="h6" align="center" sx={{ fontWeight: "bold", color: "#FF7043" }}>
              mood 3 de mayooooo:
            </Typography>
          </Grid>

          {/* Incrustar el video de YouTube */}
          <Grid item xs={12} sx={{ display: "flex", justifyContent: "center" }}>
            <iframe
              width="560"
              height="315"
              src="https://www.youtube.com/embed/n23T_SAUkrU"
              title="YouTube video player"
              frameBorder="0"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            />
          </Grid>
        </Grid>
      </Paper>
    </Container>
  );
};

export default Principal;
