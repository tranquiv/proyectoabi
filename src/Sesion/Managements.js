import { collection, getDocs } from 'firebase/firestore';   
import { db } from '../firebaseConfig'; // Importar la configuración de Firebase

export const fakeAuth = {
  isAuthenticated: JSON.parse(localStorage.getItem("isAuthenticated")) || false,
  userRole: localStorage.getItem("userRole") || null,
  userName: localStorage.getItem("userName") || null, // Nuevo campo para el nombre del usuario

  // Función de login
  async login(username, pin, navigate, setUpdate) {
    try {
      // Obtener los usuarios desde Firestore
      const querySnapshot = await getDocs(collection(db, 'users'));
      const users = querySnapshot.docs.map((doc) => doc.data());

      // Buscar el usuario con el nombre de usuario y el PIN proporcionados
      const user = users.find((u) => u.name === username && u.pin === Number(pin)); // Asegurarse de comparar como número

      if (user) {
        this.isAuthenticated = true;
        this.userRole = user.role;
        this.userName = user.name; // Obtener el nombre del usuario
        // Guardar la sesión en localStorage
        localStorage.setItem("isAuthenticated", true);
        localStorage.setItem("userRole", user.role);
        localStorage.setItem("userName", user.name); // Guardar el nombre del usuario

        // Forzar la actualización
        setUpdate((prev) => !prev);
        // Redirigir al usuario después del login
        navigate('/form1');
      } else {
        alert('Usuario o PIN incorrectos');
      }
    } catch (error) {
      console.error('Error al autenticar el usuario: ', error.message);
      alert('Hubo un error al autenticar el usuario: ' + error.message);
    }
  },

  // Función de logout
  logout(navigate, setUpdate) {
    this.isAuthenticated = false;
    this.userRole = null;
    this.userName = null; // Limpiar el nombre del usuario
    localStorage.removeItem("isAuthenticated");
    localStorage.removeItem("userRole");
    localStorage.removeItem("userName"); // Eliminar el nombre del usuario de localStorage
    setUpdate((prev) => !prev); // Forzar la actualización
    navigate('/login'); // Redirigir al login después de cerrar sesión
  },

  // Método para mostrar mensajes de error de manera más visible
  showError(message) {
    alert(`⚠️ Error: ${message}`);
    // O si prefieres usar un diseño más interactivo, puedes usar alguna librería como 'react-toastify' para mostrar alertas personalizadas con colores agradables
  }
};