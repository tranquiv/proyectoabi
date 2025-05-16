import React, { useState, useEffect } from "react";
import {
  Typography,
  Button,
  Box,
  Paper,
  List,
  ListItem,
  ListItemText,
  Divider,
  Checkbox,
} from "@mui/material";
import { CalendarMonth, AccessTime, AddCircle } from "@mui/icons-material";
import { collection, query, where, getDocs, doc, updateDoc } from "firebase/firestore";
import { db } from "../firebaseConfig";

const Inicio = () => {
  const [usuario, setUsuario] = useState(null);
  const [fechaActual, setFechaActual] = useState(new Date());
  const [planesHoy, setPlanesHoy] = useState([]); // planes que toca hoy

  useEffect(() => {
    const u = JSON.parse(localStorage.getItem("usuario"));
    setUsuario(u);

    const intervalId = setInterval(() => {
      setFechaActual(new Date());
    }, 60000);

    return () => clearInterval(intervalId);
  }, []);

  useEffect(() => {
    if (usuario?.name) {
  cargarPlanesDelDia(usuario.name, fechaActual);
}

  }, [usuario, fechaActual]);

  const cargarPlanesDelDia = async (uidDocente, fecha) => {
    try {
      const diaSemana = fecha.toLocaleDateString("es-ES", { weekday: "long" }).toLowerCase(); 
      // ej: "viernes"

      // Consulta a Firestore:
      const planesRef = collection(db, "planesEducativos");
      const q = query(
        planesRef,
        where("uidDocente", "==", uidDocente),
        where("dia", "==", diaSemana)
      );
      const querySnapshot = await getDocs(q);

      const planes = [];
      querySnapshot.forEach((docSnap) => {
        planes.push({ id: docSnap.id, ...docSnap.data() });
      });

      setPlanesHoy(planes);
    } catch (error) {
      console.error("Error al cargar planes del día:", error);
    }
  };

  // Función para actualizar el estado completado de una unidad y guardar en Firestore
  const toggleCompletado = async (idPlan, indexUnidad) => {
    try {
      // Copiamos los planes para no mutar estado directo
      const planesActualizados = [...planesHoy];

      // Cambiamos el completado
      const unidadActual = planesActualizados.find((p) => p.id === idPlan).unidades[indexUnidad];
      unidadActual.completado = !unidadActual.completado;

      // Actualizamos en Firestore
      const planDocRef = doc(db, "planesEducativos", idPlan);
      await updateDoc(planDocRef, {
        unidades: planesActualizados.find((p) => p.id === idPlan).unidades,
      });

      // Actualizamos estado
      setPlanesHoy(planesActualizados);
    } catch (error) {
      console.error("Error actualizando completado:", error);
    }
  };

  const opcionesFecha = {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  };
  const fechaFormateada = fechaActual.toLocaleDateString(undefined, opcionesFecha);

  return (
    <Box
      sx={{
        mt: 4,
        p: 3,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        textAlign: "center",
      }}
    >
      <Typography variant="h4" gutterBottom>
        Bienvenido, {usuario?.name || "Docente"}
      </Typography>
      <Typography variant="subtitle1" gutterBottom>
        Hoy es: {fechaFormateada}
      </Typography>

      <Typography
        variant="h6"
        mt={3}
        sx={{ display: "flex", alignItems: "center", gap: 1 }}
      >
        <CalendarMonth /> Planes Educativos para Hoy
      </Typography>

      {planesHoy.length === 0 ? (
        <Typography sx={{ mt: 2 }}>No tienes planes educativos para hoy.</Typography>
      ) : (
        planesHoy.map((plan) => (
          <Paper key={plan.id} elevation={3} sx={{ mt: 3, p: 2, width: "100%", maxWidth: 700 }}>
            <Typography variant="subtitle1" fontWeight="bold" gutterBottom>
              {plan.materia} - {plan.carrera} ({plan.facultad})
            </Typography>
            <Typography variant="body2" mb={2}>
              Día: {plan.dia.charAt(0).toUpperCase() + plan.dia.slice(1)}
            </Typography>

            <List>
              {plan.unidades.map((unidad, index) => (
                <ListItem
                  key={index}
                  secondaryAction={
                    <Checkbox
                      edge="end"
                      checked={unidad.completado || false}
                      onChange={() => toggleCompletado(plan.id, index)}
                      inputProps={{ "aria-label": `Completado ${unidad.unidad}` }}
                    />
                  }
                >
                  <ListItemText
                    primary={unidad.unidad}
                    secondary={`Objetivos: ${unidad.objetivos}`}
                  />
                </ListItem>
              ))}
            </List>
          </Paper>
        ))
      )}
    </Box>
  );
};

export default Inicio;
