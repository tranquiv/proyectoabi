import React, { useState, useEffect } from "react";
import { db } from "../firebaseConfig";
import { collection, doc, setDoc, getDoc } from "firebase/firestore";
import {
  TextField,
  Button,
  Typography,
  Box,
  Grid,
  Divider,
  Card,
  CardContent,
  CardHeader,
  IconButton,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Paper,
} from "@mui/material";
import { Delete, Edit } from "@mui/icons-material";
import { Autocomplete } from "@mui/material";


const Datos = () => {
  const [form, setForm] = useState({
    nombre: "",
    cedula: "",
    carrera: "",
    materia: "",
    horasTotales: "",
    horasSemanales: "",
  });
  const [facultadSeleccionada, setFacultadSeleccionada] = useState("");
  const [facultades, setFacultades] = useState({});
  const [usuario, setUsuario] = useState(null);

  useEffect(() => {
    const u = JSON.parse(localStorage.getItem("usuario"));
    setUsuario(u);
    if (u) cargarDatos(u.name);
  }, []);

  const cargarDatos = async (uid) => {
    const ref = doc(db, "docentes", uid);
    const snap = await getDoc(ref);
    if (snap.exists()) {
      const data = snap.data();
      setForm((prev) => ({
        ...prev,
        nombre: data.nombre || prev.nombre,
        cedula: data.cedula || prev.cedula,
      }));
      if (data.facultades) setFacultades(data.facultades);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const agregarCarrera = () => {
    const { carrera, materia, horasTotales, horasSemanales } = form;
    if (
      !facultadSeleccionada ||
      !carrera.trim() ||
      !materia.trim() ||
      horasTotales === "" ||
      horasSemanales === ""
    ) {
      alert("Completa todos los campos.");
      return;
    }

    const nuevaMateria = {
      id: crypto.randomUUID(),
      nombre: materia,
      horasTotales,
      horasSemanales,
    };

    const carrerasExistentes = facultades[facultadSeleccionada] || [];
    const index = carrerasExistentes.findIndex((c) => c.nombre === carrera);

    let nuevasCarreras;
    if (index > -1) {
      nuevasCarreras = [...carrerasExistentes];
      nuevasCarreras[index].materias.push(nuevaMateria);
    } else {
      nuevasCarreras = [...carrerasExistentes, { nombre: carrera, materias: [nuevaMateria] }];
    }

    setFacultades({
      ...facultades,
      [facultadSeleccionada]: nuevasCarreras,
    });

    setForm((prev) => ({
      ...prev,
      carrera: "",
      materia: "",
      horasTotales: "",
      horasSemanales: "",
    }));
  };

  const eliminarMateria = (facultad, indexCarrera, idMateria) => {
    const nuevasCarreras = [...facultades[facultad]];
    nuevasCarreras[indexCarrera].materias = nuevasCarreras[indexCarrera].materias.filter(
      (m) => m.id !== idMateria
    );
    if (nuevasCarreras[indexCarrera].materias.length === 0) {
      nuevasCarreras.splice(indexCarrera, 1);
    }

    setFacultades({
      ...facultades,
      [facultad]: nuevasCarreras,
    });
  };

  const handleSubmit = async () => {
    if (!usuario) return alert("No hay usuario autenticado");
    const ref = doc(db, "docentes", usuario.name);
    await setDoc(ref, {
      nombre: form.nombre,
      cedula: form.cedula,
      facultades,
    });
    alert("Datos guardados correctamente");
  };

  return (
    <Box sx={{ maxWidth: 900, mx: "auto", mt: 10, px: 2 }}>
      <Typography variant="h5" gutterBottom>
        Datos del Docente
      </Typography>

      <Grid container spacing={2}>
        <Grid item xs={12} sm={6}>
          <TextField
            label="Nombre"
            name="nombre"
            value={form.nombre}
            onChange={handleChange}
            fullWidth
            required
          />
        </Grid>
        <Grid item xs={12} sm={6}>
          <TextField
            label="Cédula"
            name="cedula"
            value={form.cedula}
            onChange={handleChange}
            fullWidth
            required
          />
        </Grid>
      </Grid>

      <Divider sx={{ my: 4 }} />

      <Typography variant="h6" gutterBottom>
        Agregar Carrera y Materia por Facultad
      </Typography>

      <Paper sx={{ p: 2, mb: 4, backgroundColor: "#f9f9f9" }}>
        <Grid container spacing={2}>
          <Box sx={{ width: "100%", mb: 2 }}>
  <Autocomplete
    freeSolo
    options={Object.keys(facultades)}
    value={facultadSeleccionada}
    onChange={(event, newValue) => {
      setFacultadSeleccionada(newValue || "");
    }}
    onInputChange={(event, newInputValue) => {
      setFacultadSeleccionada(newInputValue);
    }}
    renderInput={(params) => (
      <TextField
        {...params}
        label="Facultad"
        required
        fullWidth
        sx={{ maxWidth: 225 }} // o el ancho que prefieras
      />
    )}
  />
</Box>




          <Grid item xs={12} sm={6}>
            <TextField
              label="Carrera"
              name="carrera"
              value={form.carrera}
              onChange={handleChange}
              fullWidth
              required
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              label="Materia"
              name="materia"
              value={form.materia}
              onChange={handleChange}
              fullWidth
              required
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              label="Horas Totales"
              name="horasTotales"
              type="number"
              value={form.horasTotales}
              onChange={handleChange}
              fullWidth
              required
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              label="Horas Semanales"
              name="horasSemanales"
              type="number"
              value={form.horasSemanales}
              onChange={handleChange}
              fullWidth
              required
            />
          </Grid>
          <Grid item xs={12}>
            <Button variant="contained" fullWidth onClick={agregarCarrera}>
              Agregar Materia
            </Button>
          </Grid>
        </Grid>
      </Paper>

      {/* Visualización */}
      {Object.entries(facultades).map(([facultad, carreras]) => (
        <Box key={facultad} sx={{ mb: 5 }}>
          <Typography variant="h6" gutterBottom>
            {facultad}
          </Typography>
          {carreras.map((carrera, i) => (
            <Card key={i} variant="outlined" sx={{ mb: 2 }}>
              <CardHeader
                title={carrera.nombre}
                action={
                  <Button
                    color="error"
                    onClick={() => {
                      const confirm = window.confirm(
                        `¿Eliminar la carrera "${carrera.nombre}" y todas sus materias de la facultad "${facultad}"?`
                      );
                      if (confirm) {
                        const nuevasCarreras = [...carreras];
                        nuevasCarreras.splice(i, 1);
                        setFacultades({
                          ...facultades,
                          [facultad]: nuevasCarreras,
                        });
                      }
                    }}
                  >
                    Eliminar Carrera
                  </Button>
                }
              />
              <CardContent>
                <Table>
                  <TableHead>
                    <TableRow>
                      <TableCell>Materia</TableCell>
                      <TableCell align="center">Horas Totales</TableCell>
                      <TableCell align="center">Horas Semanales</TableCell>
                      <TableCell align="center">Acciones</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {carrera.materias.map((m, j) => (
                      <TableRow key={m.id}>
                        <TableCell>{m.nombre}</TableCell>
                        <TableCell align="center">{m.horasTotales}</TableCell>
                        <TableCell align="center">{m.horasSemanales}</TableCell>
                        <TableCell align="center">
                          <IconButton
                            onClick={() => {
                              setForm({
                                ...form,
                                carrera: carrera.nombre,
                                materia: m.nombre,
                                horasTotales: m.horasTotales,
                                horasSemanales: m.horasSemanales,
                              });
                              setFacultadSeleccionada(facultad);
                              const nuevasCarreras = [...carreras];
                              nuevasCarreras[i].materias.splice(j, 1);
                              if (nuevasCarreras[i].materias.length === 0) {
                                nuevasCarreras.splice(i, 1);
                              }
                              setFacultades({
                                ...facultades,
                                [facultad]: nuevasCarreras,
                              });
                            }}
                          >
                            <Edit />
                          </IconButton>
                          <IconButton
                            color="error"
                            onClick={() => eliminarMateria(facultad, i, m.id)}
                          >
                            <Delete />
                          </IconButton>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          ))}
        </Box>
      ))}

      <Button
        variant="contained"
        color="primary"
        sx={{ mt: 4, mb: 6 }}
        fullWidth
        onClick={handleSubmit}
      >
        Guardar Datos
      </Button>
    </Box>
  );
};

export default Datos;
