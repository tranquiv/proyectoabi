import React from 'react';
import { Box, Typography, Container, Paper, Grid } from '@mui/material';
import { useNavigate } from 'react-router-dom';

const Principal = () => {
  

  return (
    <Container maxWidth="md">
      <Paper elevation={5} sx={{ p: 6, mt: 15, borderRadius: 3, backgroundColor: "#FFEBE0" }}>
        <Typography variant="h4" gutterBottom align="center" sx={{ fontWeight: "bold", color: "#FF7043" }}>
          ¡Bienvenido!
        </Typography>

        <Grid container justifyContent="center" sx={{ mt: 4 }}>
          <Grid item xs={12} sx={{ mb: 4 }}>
            <Typography variant="h6" align="center" sx={{ fontWeight: "bold", color: "#FF7043" }}>
              mood semana santa:
            </Typography>
          </Grid>

          {/* Incrustar el video de YouTube */}
          <Grid item xs={12} sx={{ display: "flex", justifyContent: "center" }}>
            <iframe
              width="560"
              height="315"
              src="https://www.youtube.com/embed/UgzNawfOHdM"  // Reemplaza "your-video-id" por el ID del video
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
