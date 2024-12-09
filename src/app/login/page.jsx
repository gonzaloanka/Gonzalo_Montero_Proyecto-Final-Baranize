"use client"; // Indica que este componente se ejecuta en el cliente.

import { useForm } from "react-hook-form"; // Librería para manejar formularios con validación.
import { useState } from "react"; // Hook para manejar estados locales.
import { useRouter } from "next/navigation"; // Hook de navegación de Next.js.
import "./login.css"; // Archivo CSS para los estilos específicos de la página de login.

export default function Login() {
  const { register, handleSubmit, formState: { errors } } = useForm(); // Configuración del formulario.
  const [error, setError] = useState(null); // Estado para manejar errores del servidor.
  const router = useRouter(); // Hook para redirigir al usuario tras el login.

  // Lógica para manejar el envío del formulario.
  const onSubmit = async (formData) => {
    try {
      // Realiza una petición POST al endpoint de login.
      const response = await fetch("https://bildy-rpmaya.koyeb.app/api/user/login", {
        method: "POST", // Método HTTP.
        headers: { "Content-Type": "application/json" }, // Cabeceras de la petición.
        body: JSON.stringify(formData), // Convierte los datos del formulario a JSON.
      });

      // Si la respuesta no es exitosa, lanza un error.
      if (!response.ok) throw new Error("Credenciales incorrectas");

      // Procesa la respuesta y guarda el token en el localStorage.
      const result = await response.json();
      localStorage.setItem("jwt", result.token); // Almacena el JWT para autenticar futuras peticiones.
      alert("Inicio de sesión exitoso. Redirigiendo al dashboard...");
      router.push("/dashboard"); // Redirige al usuario al dashboard.
    } catch (err) {
      // Maneja errores mostrando un mensaje en pantalla.
      setError(err.message);
    }
  };

  return (
    <div className="login-container"> {/* Contenedor principal del login. */}
      <div className="login-card"> {/* Tarjeta para estilizar el formulario. */}
        <h1 className="login-title">Iniciar Sesión</h1> {/* Título de la página de login. */}
        <form onSubmit={handleSubmit(onSubmit)} className="login-form"> {/* Formulario de inicio de sesión. */}
          <div className="form-group">
            <label>Email:</label> {/* Campo para el correo electrónico. */}
            <input
              type="email" // Tipo de input.
              {...register("email", { required: "Correo es obligatorio" })} // Registro del campo con validación.
              className={errors.email ? "input-error" : ""} // Aplica clase condicional para errores.
            />
            {errors.email && <p className="error-message">{errors.email.message}</p>} {/* Mensaje de error si es necesario. */}
          </div>
          <div className="form-group">
            <label>Contraseña:</label> {/* Campo para la contraseña. */}
            <input
              type="password" // Tipo de input.
              {...register("password", { required: "Contraseña es obligatoria" })} // Registro del campo con validación.
              className={errors.password ? "input-error" : ""} // Aplica clase condicional para errores.
            />
            {errors.password && <p className="error-message">{errors.password.message}</p>} {/* Mensaje de error si es necesario. */}
          </div>
          <button type="submit" className="btn-primary">Entrar</button> {/* Botón de envío del formulario. */}
        </form>
        {error && <p className="login-error">{error}</p>} {/* Muestra errores del servidor, si los hay. */}
      </div>
    </div>
  );
}
