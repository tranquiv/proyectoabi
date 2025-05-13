import React, { useState, useEffect } from "react";
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
  MenuItem,
  Select,
  FormControl,
  InputLabel,
  Divider,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow
} from "@mui/material";
import { db } from "../firebaseConfig";
import { collection, addDoc, Timestamp, doc, getDoc } from "firebase/firestore";

const Form1 = () => {
  const [datosGenerales, setDatosGenerales] = useState({
    facultad: "",
    carrera: "",
    materia: "",
  });

  const [unidadData, setUnidadData] = useState({
    unidad: "",
    objetivos: "",
    situaciones: "",
    estrategias: "",
    recursos: "",
    tiempo: "",
  });


  const [facultades, setFacultades] = useState([]);
  const [carreras, setCarreras] = useState([]);
  const [materiasDisponibles, setMateriasDisponibles] = useState([]);
  const [unidades, setUnidades] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [openDialog, setOpenDialog] = useState(false);
  const [openSaveDialog, setOpenSaveDialog] = useState(false);
  const [usuario, setUsuario] = useState(null);

  useEffect(() => {
    const u = JSON.parse(localStorage.getItem("usuario"));
    if (!u) {
      setErrorMessage("No se encontró información del usuario. Iniciá sesión.");
      return;
    }
    setUsuario(u);
    cargarFacultades(u.name);
  }, []);

  const cargarFacultades = async (userName) => {
  try {
    const ref = doc(db, "docentes", userName);
    const snap = await getDoc(ref);

    if (snap.exists()) {
      const data = snap.data();
      const facObj = data.facultades || {};

      // Convertir el mapa a array de objetos con formato esperado
      const facArray = Object.entries(facObj).map(([nombre, carreras]) => ({
        nombre,
        carreras,
      }));

      setFacultades(facArray);
    } else {
      setErrorMessage("No se encontraron datos registrados para el docente.");
    }
  } catch (error) {
    console.error("Error al obtener facultades:", error);
    setErrorMessage("Error al cargar datos del docente.");
  }
};
  const handleChange = (e) => {
  const { name, value } = e.target;

  // Datos generales
  if (["facultad", "carrera", "materia"].includes(name)) {
    if (name === "facultad") {
      const facultadSeleccionada = facultades.find(f => f.nombre === value);
      const carrerasExtraidas = facultadSeleccionada?.carreras || [];
      setCarreras(carrerasExtraidas);
      setMateriasDisponibles([]);
      setDatosGenerales({
        facultad: value,
        carrera: "",
        materia: "",
      });
    } else if (name === "carrera") {
      const carreraSeleccionada = carreras.find(c => c.nombre === value);
      const materias = carreraSeleccionada?.materias?.map(m => m.nombre || m) || [];
      setMateriasDisponibles(materias);
      setDatosGenerales((prev) => ({
        ...prev,
        carrera: value,
        materia: "",
      }));
    } else {
      setDatosGenerales((prev) => ({
        ...prev,
        [name]: value,
      }));
    }
  } else {
    // Datos por unidad
    setUnidadData((prev) => ({
      ...prev,
      [name]: value,
    }));
  }
};


 const validateUnidad = () => {
  return Object.values(unidadData).every((val) => val !== "");
};

  const handleAddUnidad = () => {
  if (!validateUnidad()) {
    setErrorMessage("Por favor, completá todos los campos de la unidad.");
    return;
  }
  setUnidades((prev) => [...prev, unidadData]);
  setUnidadData({
    unidad: "",
    objetivos: "",
    situaciones: "",
    estrategias: "",
    recursos: "",
    tiempo: "",
  });
  setSuccessMessage("Unidad agregada correctamente.");
};


  const handleDeleteUnidad = (index) => {
    setUnidades((prevUnidades) => prevUnidades.filter((_, i) => i !== index));
    setSuccessMessage("Unidad eliminada correctamente.");
  };

  const handleEditUnidad = (index) => {
  const unidadToEdit = unidades[index];
  setUnidadData({ ...unidadToEdit });
  setUnidades((prev) => prev.filter((_, i) => i !== index));
};

  const handleSubmit = (e) => {
    e.preventDefault();
    setOpenSaveDialog(true);
  };

const handleConfirmSave = async () => {
    setIsLoading(true);
    if (!usuario || !usuario.name) {
  setErrorMessage("Error: No se detectó el usuario. Iniciá sesión nuevamente.");
  return;
}

    if (unidades.length === 0) {
      setIsLoading(false);
      setErrorMessage("No se ha agregado ninguna unidad.");
      return;
    }

    try {
      await addDoc(collection(db, "planesEducativos"), {
  unidades,
  timestamp: Timestamp.now(),
  uidDocente: usuario?.name || null,
  facultad: datosGenerales.facultad,
  carrera: datosGenerales.carrera,
  materia: datosGenerales.materia,
});

      

      setSuccessMessage("Plan registrado correctamente.");
      setErrorMessage("");
      setUnidades([]); // Limpiar unidades después de guardar
    } catch (error) {
      console.error("Error al guardar plan:", error);
      setErrorMessage("Ocurrió un error al guardar. Intentá nuevamente.");
    } finally {
      setIsLoading(false);
      setOpenSaveDialog(false);
    }
  };


  const handleClear = () => {
    setOpenDialog(true);
  };

 const handleConfirmClear = () => {
    setDatosGenerales({
      facultad: "",
      carrera: "",
      materia: "",
    });
    setUnidadData({
      unidad: "",
      objetivos: "",
      situaciones: "",
      estrategias: "",
      recursos: "",
      tiempo: "",
    });
    setUnidades([]);
    setErrorMessage("");
    setSuccessMessage("Formulario limpiado exitosamente.");
    setOpenDialog(false);
  };

  return (
    <Container maxWidth="md" sx={{ mt: 10 }}>
      <Typography variant="h6" gutterBottom>
        Registrar Plan Educativo
      </Typography>

      {errorMessage && <Alert severity="error">{errorMessage}</Alert>}
      {successMessage && <Alert severity="success">{successMessage}</Alert>}

      <Box sx={{ mb: 3, p: 2, backgroundColor: "#f5f5f5", borderRadius: "8px" }}>
        <Typography variant="h6" gutterBottom>
          Selección de Facultad, Carrera y Materia
        </Typography>
        <Grid container spacing={3}>
          <Grid item xs={12}>
            <FormControl margin="normal" required sx={{ width: 250 }}>
              <InputLabel>Facultad</InputLabel>
              <Select
                name="facultad"
                value={datosGenerales.facultad}
                onChange={handleChange}
                label="Facultad"
              >
                {facultades.length > 0 ? (
                  facultades.map((f, i) => (
                    <MenuItem key={i} value={f.nombre}>
                      {f.nombre}
                    </MenuItem>
                  ))
                ) : (
                  <MenuItem disabled>No hay facultades disponibles</MenuItem>
                )}
              </Select>
            </FormControl>
          </Grid>

          <Grid item xs={12}>
            <FormControl margin="normal" required sx={{ width: 250 }}>
              <InputLabel>Carrera</InputLabel>
              <Select
                name="carrera"
                value={datosGenerales.carrera}
                onChange={handleChange}
                label="Carrera"
                disabled={!carreras.length}
              >
                {carreras.length > 0 ? (
                  carreras.map((c, i) => (
                    <MenuItem key={i} value={c.nombre}>
                      {c.nombre}
                    </MenuItem>
                  ))
                ) : (
                  <MenuItem disabled>No hay carreras disponibles</MenuItem>
                )}
              </Select>
            </FormControl>
          </Grid>

          <Grid item xs={12}>
           <FormControl margin="normal" required sx={{ width: 250 }}>
              <InputLabel>Materia</InputLabel>
              <Select
                name="materia"
                value={datosGenerales.materia}
                onChange={handleChange}
                label="Materia"
                disabled={!materiasDisponibles.length}
              >
                {materiasDisponibles.map((m, i) => (
                  <MenuItem key={i} value={m}>
                    {m}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>
        </Grid>
      </Box>

      <Divider sx={{ mb: 3 }} />

      {/* Detalles del plan */}
      <Box>
        <Grid container spacing={3}>
          {[
            { name: "unidad", label: "Unidad y Contenidos" },
            { name: "objetivos", label: "Objetivos Didácticos" },
            { name: "situaciones", label: "Situaciones de Enseñanza y Aprendizaje" },
            { name: "estrategias", label: "Estrategias Metodológicas" },
            { name: "recursos", label: "Recursos Didácticos" },
            { name: "tiempo", label: "Tiempo de Ejecución" },
          ].map(({ name, label }) => (
            <Grid item xs={12} key={name}>
              <TextField
                fullWidth
                label={label}
                name={name}
                value={unidadData[name]}
                onChange={handleChange}
                multiline
                required
                variant="outlined"
              />
            </Grid>
          ))}

          <Grid item xs={12} sm={6}>
            <Button
              type="button"
              variant="contained"
              color="warning"
              fullWidth
              size="large"
              onClick={handleAddUnidad}
            >
              Agregar Unidad
            </Button>
          </Grid>
        </Grid>
      </Box>

      {/* Tabla de unidades */}
      <Box sx={{ mt: 5 }}>
  <Typography variant="h6" gutterBottom>
    Unidades Agregadas
  </Typography>
  {unidades.length === 0 ? (
    <Typography variant="body2" color="textSecondary">No hay unidades agregadas.</Typography>
  ) : (
    <Box sx={{ overflowX: "auto" }}>
      <Table sx={{ minWidth: 650 }} aria-label="tabla de unidades">
        <TableHead>
          <TableRow>
            <TableCell>Unidad</TableCell>
            <TableCell>Objetivos</TableCell>
            <TableCell>Situaciones</TableCell>
            <TableCell>Estrategias</TableCell>
            <TableCell>Recursos</TableCell>
            <TableCell>Tiempo</TableCell>
            <TableCell align="center">Acciones</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {unidades.map((unidad, index) => (
            <TableRow key={index}>
              <TableCell>{unidad.unidad}</TableCell>
              <TableCell>{unidad.objetivos}</TableCell>
              <TableCell>{unidad.situaciones}</TableCell>
              <TableCell>{unidad.estrategias}</TableCell>
              <TableCell>{unidad.recursos}</TableCell>
              <TableCell>{unidad.tiempo}</TableCell>
              <TableCell align="center">
                <Button
                  size="small"
                  variant="outlined"
                  color="primary"
                  onClick={() => handleEditUnidad(index)}
                  sx={{ mr: 1 }}
                >
                  Editar
                </Button>
                <Button
                  size="small"
                  variant="outlined"
                  color="error"
                  onClick={() => handleDeleteUnidad(index)}
                >
                  Eliminar
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </Box>
  )}
</Box>
 <Grid container spacing={3} sx={{ mt: 3 }}>
 <Grid item xs={12} sm={6}>
    <Button
  type="button"
  variant="contained"
  color="warning"
  fullWidth
  size="large"
  disabled={isLoading}
  onClick={() => {
    if (!usuario || !usuario.name) {
      setErrorMessage("Error: No se detectó el usuario. Iniciá sesión nuevamente.");
      return;
    }

    if (unidades.length === 0) {
      setErrorMessage("No se ha agregado ninguna unidad.");
      return;
    }

    setOpenSaveDialog(true);
  }}
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
      onClick={handleClear} // Llamada a la función que abre el diálogo
    >
      Limpiar Formulario
    </Button>
  </Grid>
</Grid>

<Dialog open={openSaveDialog} onClose={() => setOpenSaveDialog(false)}>
  <DialogTitle>Confirmar Guardado</DialogTitle>
    <DialogContent>
      <Typography>¿Deseás guardar este plan educativo?</Typography>
    </DialogContent>
    <DialogActions>
      <Button onClick={() => setOpenSaveDialog(false)}>Cancelar</Button>
      <Button onClick={handleConfirmSave} color="primary">Guardar</Button>
    </DialogActions>
</Dialog>

<Dialog open={openDialog} onClose={() => setOpenDialog(false)}>
  <DialogTitle>¿Estás seguro de limpiar el formulario?</DialogTitle>
    <DialogContent>
      <Typography variant="body2">Todos los datos no guardados se perderán.</Typography>
    </DialogContent>
  <DialogActions>
    <Button onClick={() => setOpenDialog(false)} color="primary">
      Cancelar
    </Button>
    <Button onClick={handleConfirmClear} color="secondary">
      Limpiar
    </Button>
  </DialogActions>
</Dialog>
</Container>
  );
};

export default Form1;