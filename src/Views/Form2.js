import React, { useState, useEffect } from "react";
import {
  Box, TextField, Typography, Button, Container, Paper, Grid, Divider, Alert, Dialog, DialogActions, DialogContent, DialogTitle
} from "@mui/material";
import { db } from "../firebaseConfig";
import { doc, updateDoc, getDoc } from "firebase/firestore";
import { useLocation, useNavigate } from "react-router-dom";
import { useParams } from "react-router-dom";


const Form2 = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { id } = useParams();


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

  useEffect(() => {
    const fetchPlan = async () => {
      try {
        const docRef = doc(db, "planesEducativos", id);
        const docSnap = await getDoc(docRef);
  
        if (docSnap.exists()) {
          const planData = docSnap.data();
          setFormData({
            unidad: planData.unidad || "",
            objetivos: planData.objetivos || "",
            situaciones: planData.situaciones || "",
            estrategias: planData.estrategias || "",
            recursos: planData.recursos || "",
            tiempo: planData.tiempo || "",
          });
        } else {
          setErrorMessage("El plan no existe.");
        }
      } catch (error) {
        console.error("Error al cargar el plan:", error);
        setErrorMessage("Error al cargar los datos del plan.");
      }
    };
  
    fetchPlan();
  }, [id]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const validateForm = () => {
    return Object.values(formData).every((field) => field.trim() !== "");
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setOpenDialog(true);
  };

  const handleConfirmUpdate = async () => {
    if (!validateForm()) {
      setErrorMessage("Por favor, completa todos los campos.");
      setOpenDialog(false);
      return;
    }

    setIsLoading(true);
    try {
      const planRef = doc(db, "planesEducativos", id);
      await updateDoc(planRef, formData);
      setSuccessMessage("Plan actualizado correctamente.");
      setErrorMessage("");
      setTimeout(() => navigate("/datos"), 1500); // volver después de actualizar
    } catch (error) {
      console.error("Error al actualizar:", error);
      setErrorMessage("Hubo un error al actualizar el plan.");
    } finally {
      setIsLoading(false);
      setOpenDialog(false);
    }
  };

  const handleCancelUpdate = () => {
    setOpenDialog(false);
  };

  return (
    <Container maxWidth="md">
      <Paper elevation={5} sx={{ p: 6, mt: 10, borderRadius: 3, backgroundColor: "#FFFDE7" }}>
        <Typography variant="h4" align="center" gutterBottom sx={{ fontWeight: "bold", color: "#F57C00" }}>
          Editar Plan Educativo
        </Typography>

        <Divider sx={{ my: 3, borderColor: "#F57C00" }} />

        {errorMessage && <Alert severity="error">{errorMessage}</Alert>}
        {successMessage && <Alert severity="success">{successMessage}</Alert>}

        <Box component="form" onSubmit={handleSubmit}>
          <Grid container spacing={3}>
            {[
              { name: "unidad", label: "Unidad y Contenidos" },
              { name: "objetivos", label: "Objetivos Didácticos" },
              { name: "situaciones", label: "Situaciones de Enseñanza y Aprendizaje" },
              { name: "estrategias", label: "Estrategias Metodológicas" },
              { name: "recursos", label: "Recursos Didácticos" },
              { name: "tiempo", label: "Tiempo de Ejecución" },
            ].map(({ name, label }) => (
              <Grid item xs={12} sm={6} key={name}>
                <TextField
                  label={label}
                  name={name}
                  value={formData[name]}
                  onChange={handleChange}
                  fullWidth
                  multiline={name !== "tiempo"}
                  required
                  sx={{
                    "& .MuiInputLabel-root": { color: "#F57C00" },
                    "& .MuiOutlinedInput-root": {
                      "& fieldset": { borderColor: "#F57C00" },
                      "&:hover fieldset": { borderColor: "#EF6C00" },
                    },
                    "& .MuiInputBase-root": { color: "#333" },
                  }}
                />
              </Grid>
            ))}

            <Grid item xs={12}>
              <Button
                type="submit"
                variant="contained"
                color="warning"
                fullWidth
                size="large"
                sx={{ py: 1.5, fontWeight: "bold", fontSize: "1rem", backgroundColor: "#F57C00" }}
                disabled={isLoading}
              >
                {isLoading ? "Guardando cambios..." : "Actualizar Plan"}
              </Button>
            </Grid>
          </Grid>
        </Box>
      </Paper>

      <Dialog open={openDialog} onClose={handleCancelUpdate}>
        <DialogTitle>Confirmar Actualización</DialogTitle>
        <DialogContent>
          <Typography>¿Está seguro de que desea actualizar este plan educativo?</Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCancelUpdate} color="secondary">Cancelar</Button>
          <Button onClick={handleConfirmUpdate} color="primary">Actualizar</Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default Form2;
