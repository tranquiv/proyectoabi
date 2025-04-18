import React, { useState } from "react";
import {
  Box,
  TextField,
  Typography,
  Button,
  Container,
  Paper,
  Grid,
  Divider,
  Alert,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
} from "@mui/material";
import { db } from "../firebaseConfig";
import { collection, addDoc, Timestamp } from "firebase/firestore";

const Form1 = () => {
  const [formData, setFormData] = useState({
    unidad: "",
    objetivos: "",
    situaciones: "",
    estrategias: "",
    recursos: "",
    tiempo: "",
  });

  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState(""); // Estado para mensaje de error
  const [successMessage, setSuccessMessage] = useState(""); // Estado para mensaje de éxito

  const [openDialog, setOpenDialog] = useState(false); // Estado para el diálogo de confirmación de limpiar
  const [openSaveDialog, setOpenSaveDialog] = useState(false); // Estado para el diálogo de confirmación de guardar

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  // Validación simple antes de enviar el formulario
  const validateForm = () => {
    return (
      formData.unidad &&
      formData.objetivos &&
      formData.situaciones &&
      formData.estrategias &&
      formData.recursos &&
      formData.tiempo
    );
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setOpenSaveDialog(true); // Abrir el diálogo de confirmación para guardar
  };

  const handleConfirmSave = async () => {
    setIsLoading(true); // Cambiar estado a cargando

    // Validar formulario
    if (!validateForm()) {
      setIsLoading(false);
      setErrorMessage("Por favor, completa todos los campos.");
      return;
    }

    try {
      await addDoc(collection(db, "planesEducativos"), {
        ...formData,
        timestamp: Timestamp.now(),
      });
      setSuccessMessage("Plan registrado correctamente.");
      setErrorMessage(""); // Limpiar mensaje de error
      setFormData({
        unidad: "",
        objetivos: "",
        situaciones: "",
        estrategias: "",
        recursos: "",
        tiempo: "",
      });
    } catch (error) {
      console.error("Error al guardar en Firestore:", error);
      setErrorMessage("Ocurrió un error al guardar los datos. Intenta nuevamente.");
    } finally {
      setIsLoading(false); // Restablecer el estado de carga
      setOpenSaveDialog(false); // Cerrar el diálogo de confirmación
    }
  };

  const handleCancelSave = () => {
    setOpenSaveDialog(false); // Cerrar el diálogo de confirmación sin guardar
  };

  const handleClear = () => {
    setOpenDialog(true); // Abrir el diálogo de confirmación para limpiar
  };

  const handleConfirmClear = () => {
    setFormData({
      unidad: "",
      objetivos: "",
      situaciones: "",
      estrategias: "",
      recursos: "",
      tiempo: "",
    });
    setErrorMessage("");
    setSuccessMessage("Formulario limpiado exitosamente.");
    setOpenDialog(false); // Cerrar el diálogo de confirmación
  };

  const handleCancelClear = () => {
    setOpenDialog(false); // Cerrar el diálogo de confirmación sin limpiar
  };

  return (
    <Container maxWidth="md">
      <Paper elevation={5} sx={{ p: 6, mt: 15, borderRadius: 3, backgroundColor: "#FFEBE0" }}>
        <Typography variant="h4" gutterBottom align="center" sx={{ fontWeight: "bold", color: "#FF7043" }}>
          Registrar Plan Educativo
        </Typography>

        <Divider sx={{ my: 3, borderColor: "#FF7043" }} />

        {/* Mensajes de error o éxito */}
        {errorMessage && <Alert severity="error" sx={{ backgroundColor: "#FFCCBC", color: "#D32F2F" }}>{errorMessage}</Alert>}
        {successMessage && <Alert severity="success" sx={{ backgroundColor: "#C8E6C9", color: "#388E3C" }}>{successMessage}</Alert>}

        <Box component="form" onSubmit={handleSubmit}>
          <Grid container spacing={3}>
            <Grid item xs={12} sm={6}>
              <TextField
                label="Unidad y Contenidos"
                name="unidad"
                value={formData.unidad}
                onChange={handleChange}
                fullWidth
                multiline
                required
                helperText="Ingrese la unidad y los contenidos a enseñar"
                sx={{
                  "& .MuiInputLabel-root": { color: "#FF7043" },
                  "& .MuiOutlinedInput-root": {
                    "& fieldset": { borderColor: "#FF7043" },
                    "&:hover fieldset": { borderColor: "#FF5722" },
                  },
                  "& .MuiInputBase-root": { color: "#333" },
                }}
              />
            </Grid>

            <Grid item xs={12} sm={6}>
              <TextField
                label="Objetivos Didácticos"
                name="objetivos"
                value={formData.objetivos}
                onChange={handleChange}
                fullWidth
                multiline
                required
                helperText="Escriba los objetivos didácticos de la unidad"
                sx={{
                  "& .MuiInputLabel-root": { color: "#FF7043" },
                  "& .MuiOutlinedInput-root": {
                    "& fieldset": { borderColor: "#FF7043" },
                    "&:hover fieldset": { borderColor: "#FF5722" },
                  },
                  "& .MuiInputBase-root": { color: "#333" },
                }}
              />
            </Grid>

            <Grid item xs={12} sm={6}>
              <TextField
                label="Situaciones de Enseñanza y Aprendizaje"
                name="situaciones"
                value={formData.situaciones}
                onChange={handleChange}
                fullWidth
                multiline
                required
                helperText="Describa las situaciones de enseñanza y aprendizaje"
                sx={{
                  "& .MuiInputLabel-root": { color: "#FF7043" },
                  "& .MuiOutlinedInput-root": {
                    "& fieldset": { borderColor: "#FF7043" },
                    "&:hover fieldset": { borderColor: "#FF5722" },
                  },
                  "& .MuiInputBase-root": { color: "#333" },
                }}
              />
            </Grid>

            <Grid item xs={12} sm={6}>
              <TextField
                label="Estrategias Metodológicas"
                name="estrategias"
                value={formData.estrategias}
                onChange={handleChange}
                fullWidth
                multiline
                required
                helperText="Indique las estrategias metodológicas"
                sx={{
                  "& .MuiInputLabel-root": { color: "#FF7043" },
                  "& .MuiOutlinedInput-root": {
                    "& fieldset": { borderColor: "#FF7043" },
                    "&:hover fieldset": { borderColor: "#FF5722" },
                  },
                  "& .MuiInputBase-root": { color: "#333" },
                }}
              />
            </Grid>

            <Grid item xs={12} sm={6}>
              <TextField
                label="Recursos Didácticos"
                name="recursos"
                value={formData.recursos}
                onChange={handleChange}
                fullWidth
                multiline
                required
                helperText="Especifique los recursos didácticos necesarios"
                sx={{
                  "& .MuiInputLabel-root": { color: "#FF7043" },
                  "& .MuiOutlinedInput-root": {
                    "& fieldset": { borderColor: "#FF7043" },
                    "&:hover fieldset": { borderColor: "#FF5722" },
                  },
                  "& .MuiInputBase-root": { color: "#333" },
                }}
              />
            </Grid>

            <Grid item xs={12} sm={6}>
              <TextField
                label="Tiempo de Ejecución"
                name="tiempo"
                value={formData.tiempo}
                onChange={handleChange}
                fullWidth
                required
                helperText="Indique el tiempo estimado para ejecutar el plan"
                sx={{
                  "& .MuiInputLabel-root": { color: "#FF7043" },
                  "& .MuiOutlinedInput-root": {
                    "& fieldset": { borderColor: "#FF7043" },
                    "&:hover fieldset": { borderColor: "#FF5722" },
                  },
                  "& .MuiInputBase-root": { color: "#333" },
                }}
              />
            </Grid>

            <Grid item xs={12} sm={6}>
              <Button
                type="submit"
                variant="contained"
                color="warning"
                fullWidth
                size="large"
                sx={{ py: 1.5, fontWeight: "bold", fontSize: "1rem", backgroundColor: "#FF7043" }}
                disabled={isLoading}
              >
                {isLoading ? "Guardando..." : "Guardar Plan"}
              </Button>
            </Grid>

            <Grid item xs={12} sm={6}>
              <Button
                type="button"
                variant="outlined"
                color="secondary"
                fullWidth
                size="large"
                sx={{ py: 1.5, fontWeight: "bold", fontSize: "1rem", borderColor: "#FF7043", color: "#FF7043" }}
                onClick={handleClear}
              >
                Limpiar
              </Button>
            </Grid>
          </Grid>
        </Box>
      </Paper>

      {/* Diálogo de confirmación para limpiar */}
      <Dialog open={openDialog} onClose={handleCancelClear}>
        <DialogTitle>Confirmar Limpieza</DialogTitle>
        <DialogContent>
          <Typography>¿Está seguro de que desea limpiar los campos del formulario?</Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCancelClear} color="secondary">
            Cancelar
          </Button>
          <Button onClick={handleConfirmClear} color="primary">
            Limpiar
          </Button>
        </DialogActions>
      </Dialog>

      {/* Diálogo de confirmación para guardar */}
      <Dialog open={openSaveDialog} onClose={handleCancelSave}>
        <DialogTitle>Confirmar Guardado</DialogTitle>
        <DialogContent>
          <Typography>¿Está seguro de que desea guardar este plan educativo?</Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCancelSave} color="secondary">
            Cancelar
          </Button>
          <Button onClick={handleConfirmSave} color="primary">
            Guardar
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default Form1;