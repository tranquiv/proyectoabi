import React, { useState } from "react";
import {
  Box,
  TextField,
  Typography,
  Button,
  Container,
  Grid,
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
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [openDialog, setOpenDialog] = useState(false);
  const [openSaveDialog, setOpenSaveDialog] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

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
    setOpenSaveDialog(true);
  };

  const handleConfirmSave = async () => {
    setIsLoading(true);

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
      setErrorMessage("");
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
      setIsLoading(false);
      setOpenSaveDialog(false);
    }
  };

  const handleCancelSave = () => {
    setOpenSaveDialog(false);
  };

  const handleClear = () => {
    setOpenDialog(true);
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
    setOpenDialog(false);
  };

  const handleCancelClear = () => {
    setOpenDialog(false);
  };

  return (
    <Container maxWidth="md" sx={{ mt: 10 }}>
      {/* Título del formulario */}
      <Typography variant="h6" gutterBottom>
        Registrar Plan Educativo
      </Typography>

      {/* Mensajes de error o éxito */}
      {errorMessage && <Alert severity="error" sx={{ backgroundColor: "#FFCCBC", color: "#D32F2F" }}>{errorMessage}</Alert>}
      {successMessage && <Alert severity="success" sx={{ backgroundColor: "#C8E6C9", color: "#388E3C" }}>{successMessage}</Alert>}

      <Box component="form" onSubmit={handleSubmit}>
        <Grid container spacing={3}>
          {/* Campo Unidad y Contenidos */}
          <Grid item xs={12}>
            <TextField
              fullWidth
              label="Unidad y Contenidos"
              name="unidad"
              value={formData.unidad}
              onChange={handleChange}
              multiline
              required
              helperText="Ingrese la unidad y los contenidos a enseñar"
              margin="normal"
              variant="outlined"
            />
          </Grid>

          {/* Campo Objetivos Didácticos */}
          <Grid item xs={12}>
            <TextField
              fullWidth
              label="Objetivos Didácticos"
              name="objetivos"
              value={formData.objetivos}
              onChange={handleChange}
              multiline
              required
              helperText="Escriba los objetivos didácticos de la unidad"
              margin="normal"
              variant="outlined"
            />
          </Grid>

          {/* Campo Situaciones de Enseñanza */}
          <Grid item xs={12}>
            <TextField
              fullWidth
              label="Situaciones de Enseñanza y Aprendizaje"
              name="situaciones"
              value={formData.situaciones}
              onChange={handleChange}
              multiline
              required
              helperText="Describa las situaciones de enseñanza y aprendizaje"
              margin="normal"
              variant="outlined"
            />
          </Grid>

          {/* Campo Estrategias Metodológicas */}
          <Grid item xs={12}>
            <TextField
              fullWidth
              label="Estrategias Metodológicas"
              name="estrategias"
              value={formData.estrategias}
              onChange={handleChange}
              multiline
              required
              helperText="Indique las estrategias metodológicas"
              margin="normal"
              variant="outlined"
            />
          </Grid>

          {/* Campo Recursos Didácticos */}
          <Grid item xs={12}>
            <TextField
              fullWidth
              label="Recursos Didácticos"
              name="recursos"
              value={formData.recursos}
              onChange={handleChange}
              multiline
              required
              helperText="Especifique los recursos didácticos necesarios"
              margin="normal"
              variant="outlined"
            />
          </Grid>

          {/* Campo Tiempo de Ejecución */}
          <Grid item xs={12}>
            <TextField
              fullWidth
              label="Tiempo de Ejecución"
              name="tiempo"
              value={formData.tiempo}
              onChange={handleChange}
              required
              helperText="Indique el tiempo estimado para ejecutar el plan"
              margin="normal"
              variant="outlined"
            />
          </Grid>

          {/* Botón de guardar */}
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

          {/* Botón de limpiar */}
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
