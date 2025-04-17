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
} from "@mui/material";
import { db } from "../firebaseConfig";
import { collection, getDocs } from "firebase/firestore";

const DataView = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState(""); // Estado para manejar errores

  // Función para obtener los datos
  const fetchData = async () => {
    setLoading(true); // Empezamos a cargar
    try {
      const querySnapshot = await getDocs(collection(db, "planesEducativos"));
      const dataList = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setData(dataList); // Guardamos los datos en el estado
      setErrorMessage(""); // Limpiamos cualquier mensaje de error
    } catch (error) {
      console.error("Error al obtener los datos de Firestore:", error);
      setErrorMessage("Hubo un error al obtener los datos. Intenta nuevamente.");
    } finally {
      setLoading(false); // Terminamos de cargar
    }
  };

  // Cargar los datos al montar el componente
  useEffect(() => {
    fetchData();
  }, []);

  return (
    <Container maxWidth="md" sx={{ mt: 4 }}>
      <Paper elevation={5} sx={{ p: 6, borderRadius: 3, backgroundColor: "#FFF3E0" }}>
        <Typography variant="h4" gutterBottom align="center" sx={{ fontWeight: "bold", color: "#FF7043" }}>
          Datos Cargados - Planes Educativos
        </Typography>

        {/* Mostrar mensaje de error */}
        {errorMessage && <Alert severity="error" sx={{ backgroundColor: "#FF7043", color: "#FFF" }}>{errorMessage}</Alert>}

        {/* Mostrar cargando */}
        {loading ? (
          <CircularProgress sx={{ color: "#FF7043", margin: "auto", display: "block" }} />
        ) : (
          <TableContainer>
            <Table>
              <TableHead sx={{ backgroundColor: "#FF7043" }}>
                <TableRow>
                  <TableCell align="center" sx={{ fontWeight: "bold", color: "#FFF" }}>Unidad</TableCell>
                  <TableCell align="center" sx={{ fontWeight: "bold", color: "#FFF" }}>Objetivos</TableCell>
                  <TableCell align="center" sx={{ fontWeight: "bold", color: "#FFF" }}>Situaciones</TableCell>
                  <TableCell align="center" sx={{ fontWeight: "bold", color: "#FFF" }}>Estrategias</TableCell>
                  <TableCell align="center" sx={{ fontWeight: "bold", color: "#FFF" }}>Recursos</TableCell>
                  <TableCell align="center" sx={{ fontWeight: "bold", color: "#FFF" }}>Tiempo</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {data.length > 0 ? (
                  data.map((row) => (
                    <TableRow key={row.id}>
                      <TableCell align="center">{row.unidad}</TableCell>
                      <TableCell align="center">{row.objetivos}</TableCell>
                      <TableCell align="center">{row.situaciones}</TableCell>
                      <TableCell align="center">{row.estrategias}</TableCell>
                      <TableCell align="center">{row.recursos}</TableCell>
                      <TableCell align="center">{row.tiempo}</TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={6} align="center">
                      No hay datos disponibles.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </TableContainer>
        )}

        {/* Botón de refrescar */}
        <Button
          variant="contained"
          color="primary"
          sx={{
            mt: 3,
            display: "block",
            marginLeft: "auto",
            marginRight: "auto",
            backgroundColor: "#FF7043",
            "&:hover": {
              backgroundColor: "#FF5722",
            },
            fontWeight: "bold",
          }}
          onClick={fetchData} // Refrescar los datos sin recargar la página
        >
          Refrescar Datos
        </Button>
      </Paper>
    </Container>
  );
};

export default DataView;
