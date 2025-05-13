import React, { useEffect, useState } from "react";  
import {
  Container,
  Paper,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  CircularProgress,
  Alert,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
} from "@mui/material";
import { db } from "../firebaseConfig";
import {
  collection,
  getDocs,
  deleteDoc,
  doc,
  getDoc,
} from "firebase/firestore";
import { useNavigate } from "react-router-dom";

const DataView = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState("");
  const [openDialog, setOpenDialog] = useState(false);
  const [recordToDelete, setRecordToDelete] = useState(null);
  const [docenteData, setDocenteData] = useState({});
  const [facultades, setFacultades] = useState([]);
  const [carreras, setCarreras] = useState([]);
  const [materias, setMaterias] = useState([]);
  const [selectedFacultad, setSelectedFacultad] = useState("");
  const [selectedCarrera, setSelectedCarrera] = useState("");
  const [selectedMateria, setSelectedMateria] = useState("");
  const navigate = useNavigate();

  const fetchData = async () => {
  setLoading(true);
  try {
    const storedUsuario = localStorage.getItem("usuario");
    if (!storedUsuario) {
      setErrorMessage("No se encontró información del usuario. Por favor inicia sesión.");
      setLoading(false);
      return;
    }

    const usuario = JSON.parse(storedUsuario);
    const userName = usuario.name?.trim();
    if (!userName) {
      setErrorMessage("Nombre de usuario inválido.");
      setLoading(false);
      return;
    }

    // Obtener los datos del docente
    const userDocRef = doc(db, "docentes", userName);
    const docSnap = await getDoc(userDocRef);
    if (docSnap.exists()) {
      setDocenteData(docSnap.data());
    } else {
      console.warn(`No se encontró documento del docente ${userName}.`);
    }

    // Obtener los planes educativos y filtrar por uidDocente
    const querySnapshot = await getDocs(collection(db, "planesEducativos"));
    const dataList = querySnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));

    // Filtramos los planes educativos por el uidDocente
    const filteredData = dataList.filter(plan => plan.uidDocente?.trim() === userName);
    setData(filteredData);

    // Obtener facultades, carreras y materias desde los planes educativos
    const facultadesList = Array.from(new Set(filteredData.map((plan) => plan.facultad)));
    setFacultades(facultadesList);

    setErrorMessage("");
  } catch (error) {
    console.error("Error al obtener los datos:", error);
    setErrorMessage("Hubo un error al obtener los datos. Intenta nuevamente.");
  } finally {
    setLoading(false);
  }
};


  // Función para manejar la selección de facultad
// Función para manejar la selección de facultad
const handleFacultadChange = (event) => {
  const selectedFacultad = event.target.value;
  setSelectedFacultad(selectedFacultad);
  setSelectedCarrera("");  // Reset carrera
  setSelectedMateria("");  // Reset materia

  // Filtrar las carreras disponibles para la facultad seleccionada
  const carrerasList = data
    .filter((plan) => plan.facultad === selectedFacultad)
    .map((plan) => plan.carrera);
  setCarreras(Array.from(new Set(carrerasList)));
};

// Función para manejar la selección de carrera
const handleCarreraChange = (event) => {
  const selectedCarrera = event.target.value;
  setSelectedCarrera(selectedCarrera);
  setSelectedMateria(""); // Reset materia

  // Filtrar las materias disponibles para la carrera seleccionada
  const materiasList = data
    .filter((plan) => plan.carrera === selectedCarrera)
    .map((plan) => plan.materia);
  setMaterias(Array.from(new Set(materiasList)));
};


  // Función para manejar la selección de materia
  const handleMateriaChange = (event) => {
    const selectedMateria = event.target.value;
    setSelectedMateria(selectedMateria);
  };

  const handleDelete = async () => {
    if (recordToDelete) {
      try {
        await deleteDoc(doc(db, "planesEducativos", recordToDelete));
        setData(data.filter(item => item.id !== recordToDelete));
        setOpenDialog(false);
      } catch (error) {
        setErrorMessage("Error al eliminar el registro.");
      }
    }
  };

  const openDeleteDialog = (id) => {
    setRecordToDelete(id);
    setOpenDialog(true);
  };

  const handleEdit = (plan) => {
    navigate(`/form2/${plan.id}`);
  };

  useEffect(() => {
    fetchData();
  }, []);

  // Filtrar los planes educativos según la selección del usuario
  // Filtrar los planes educativos según la selección del usuario
const filteredPlans = data.filter(
  (plan) =>
    (selectedFacultad ? plan.facultad === selectedFacultad : true) &&
    (selectedCarrera ? plan.carrera === selectedCarrera : true) &&
    (selectedMateria ? plan.materia === selectedMateria : true)
);


  return (
    <Container maxWidth="md" sx={{ mt: 4 }}>
      <Paper elevation={5} sx={{ p: 8, borderRadius: 3, backgroundColor: "#FFF3E0" }}>
        <Typography variant="h4" gutterBottom align="center" sx={{ fontWeight: "bold", color: "#FF7043" }}>
          Datos del Docente y Planes Educativos
        </Typography>

        {errorMessage && (
          <Alert severity="error" sx={{ backgroundColor: "#FF7043", color: "#FFF" }}>
            {errorMessage}
          </Alert>
        )}

        {loading ? (
          <CircularProgress sx={{ color: "#FF7043", margin: "auto", display: "block" }} />
        ) : (
          <div>
            {/* Datos del docente */}
            <Paper sx={{ mb: 4, p: 3, backgroundColor: "#FFEBEE" }}>
              <Typography variant="h6" sx={{ fontWeight: "bold" }}>Datos del Docente</Typography>
              <Typography><strong>Nombre:</strong> {docenteData.nombre || "N/A"}</Typography>
              <Typography><strong>Cédula:</strong> {docenteData.cedula || "N/A"}</Typography>

              <Typography variant="h6" sx={{ fontWeight: "bold", mt: 2 }}>Facultades y Carreras</Typography>
              {docenteData.facultades ? (
                Object.keys(docenteData.facultades).map((facultad, index) => (
                  <div key={index}>
                    <Typography><strong>{facultad}</strong></Typography>
                    <ul>
                      {docenteData.facultades[facultad].map((carrera, idx) => (
                        <li key={idx}>
                          <Typography><strong>{carrera.nombre}</strong></Typography>
                          <ul>
                            {carrera.materias?.map((materia, materiaIdx) => (
                              <li key={materiaIdx}>
                                {materia.nombre} ({materia.horasSemanales}h/sem - {materia.horasTotales}h totales)
                              </li>
                            ))}
                          </ul>
                        </li>
                      ))}
                    </ul>
                  </div>
                ))
              ) : (
                <Typography>No hay facultades asignadas.</Typography>
              )}
            </Paper>

            {/* Selects para Facultad, Carrera y Materia */}
            <FormControl fullWidth sx={{ mb: 2 }}>
              <InputLabel>Facultad</InputLabel>
              <Select
                value={selectedFacultad}
                onChange={handleFacultadChange}
                label="Facultad"
              >
                {facultades.map((facultad, index) => (
                  <MenuItem key={index} value={facultad}>
                    {facultad}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>

            <FormControl fullWidth sx={{ mb: 2 }} disabled={!selectedFacultad}>
              <InputLabel>Carrera</InputLabel>
              <Select
                value={selectedCarrera}
                onChange={handleCarreraChange}
                label="Carrera"
              >
                {carreras.map((carrera, index) => (
                  <MenuItem key={index} value={carrera}>
                    {carrera}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>

            <FormControl fullWidth sx={{ mb: 2 }} disabled={!selectedCarrera}>
              <InputLabel>Materia</InputLabel>
              <Select
                value={selectedMateria}
                onChange={handleMateriaChange}
                label="Materia"
              >
                {materias.map((materia, index) => (
                  <MenuItem key={index} value={materia}>
                    {materia}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>

            {/* Mostrar los planes educativos filtrados */}
            <TableContainer>
              <Table>
                <TableHead sx={{ backgroundColor: "#FF7043" }}>
                  <TableRow>
                    <TableCell align="center" sx={{ fontWeight: "bold", color: "#FFF" }}>Carrera</TableCell>
                    <TableCell align="center" sx={{ fontWeight: "bold", color: "#FFF" }}>Materia</TableCell>
                    <TableCell align="center" sx={{ fontWeight: "bold", color: "#FFF" }}>Objetivos</TableCell>
                    <TableCell align="center" sx={{ fontWeight: "bold", color: "#FFF" }}>Situaciones</TableCell>
                    <TableCell align="center" sx={{ fontWeight: "bold", color: "#FFF" }}>Estrategias</TableCell>
                    <TableCell align="center" sx={{ fontWeight: "bold", color: "#FFF" }}>Recursos</TableCell>
                    <TableCell align="center" sx={{ fontWeight: "bold", color: "#FFF" }}>Tiempo</TableCell>
                    <TableCell align="center" sx={{ fontWeight: "bold", color: "#FFF" }}>Acciones</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {filteredPlans.length > 0 ? (
                    filteredPlans.map((plan) =>
                      plan.unidades?.map((unidad, index) => (
                        <TableRow key={`${plan.id}-${index}`}>
                          <TableCell align="center">{plan.carrera}</TableCell>
                          <TableCell align="center">{plan.materia}</TableCell>
                          <TableCell align="center">{unidad.objetivos}</TableCell>
                          <TableCell align="center">{unidad.situaciones}</TableCell>
                          <TableCell align="center">{unidad.estrategias}</TableCell>
                          <TableCell align="center">{unidad.recursos}</TableCell>
                          <TableCell align="center">{unidad.tiempo}</TableCell>
                          <TableCell align="center">
                            <Button
                              variant="contained"
                              color="warning"
                              sx={{ mr: 1 }}
                              onClick={() => handleEdit(plan)}
                            >
                              Editar
                            </Button>
                            <Button
                              variant="outlined"
                              color="error"
                              onClick={() => openDeleteDialog(plan.id)}
                            >
                              Eliminar
                            </Button>
                          </TableCell>
                        </TableRow>
                      ))
                    )
                  ) : (
                    <TableRow>
                      <TableCell colSpan={8} align="center">
                        No hay planes educativos disponibles.
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </TableContainer>
          </div>
        )}

        {/* Diálogo de eliminación */}
        <Dialog open={openDialog} onClose={() => setOpenDialog(false)}>
          <DialogTitle>Confirmar Eliminación</DialogTitle>
          <DialogContent>
            ¿Estás seguro de que deseas eliminar este registro?
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setOpenDialog(false)} color="primary">
              Cancelar
            </Button>
            <Button onClick={handleDelete} color="error">
              Eliminar
            </Button>
          </DialogActions>
        </Dialog>
      </Paper>
    </Container>
  );
};

export default DataView;
