"use client"; // Indica que este componente se ejecuta en el cliente

import { useRouter } from "next/navigation"; // Hook para la navegación en Next.js
import { useForm } from "react-hook-form"; // Librería para manejar formularios
import "./register.css"; // Archivo CSS para los estilos de esta página

export default function RegisterPage() {
  const router = useRouter(); // Hook para redirigir al usuario
  const { register, handleSubmit, formState: { errors } } = useForm(); // Configuración del formulario

  // Función que se ejecuta al enviar el formulario
  const onSubmit = async (data) => {
    try {
      const response = await fetch("https://bildy-rpmaya.koyeb.app/api/user/register", {
        method: "POST", // Método POST para enviar los datos del formulario
        headers: { "Content-Type": "application/json" }, // Especifica el tipo de contenido
        body: JSON.stringify(data), // Convierte los datos del formulario a JSON
      });
      const result = await response.json(); // Obtiene la respuesta en formato JSON
      if (response.ok) {
        // Si el registro es exitoso
        localStorage.setItem("jwt", result.token); // Almacena el token JWT en el almacenamiento local
        alert("Registro exitoso. Redirigiendo a la página de verificación...");
        router.push("/verify"); // Redirige a la página de verificación
      } else {
        // Muestra un mensaje de error en caso de fallo
        alert(result.message || "Error en el registro.");
      }
    } catch (error) {
      // Manejo de errores en caso de que la petición falle
      alert("Ocurrió un error.");
    }
  };

  return (
    <div className="register-container"> {/* Contenedor principal de la página */}
      <div className="register-card"> {/* Tarjeta que contiene el formulario */}
        <h1 className="register-title">Registro de Usuario</h1> {/* Título de la página */}
        <form onSubmit={handleSubmit(onSubmit)} className="register-form"> {/* Formulario de registro */}
          <div className="form-group">
            <label>Email:</label> {/* Etiqueta para el campo de correo */}
            <input
              type="email" // Campo de entrada para el correo
              {...register("email", { required: "Correo es obligatorio" })} // Validación del campo
              className={errors.email ? "input-error" : ""} // Clase condicional para mostrar error
            />
            {errors.email && <p className="error-message">{errors.email.message}</p>} {/* Mensaje de error */}
          </div>
          <div className="form-group">
            <label>Contraseña:</label> {/* Etiqueta para el campo de contraseña */}
            <input
              type="password" // Campo de entrada para la contraseña
              {...register("password", { required: "Contraseña es obligatoria" })} // Validación del campo
              className={errors.password ? "input-error" : ""} // Clase condicional para mostrar error
            />
            {errors.password && <p className="error-message">{errors.password.message}</p>} {/* Mensaje de error */}
          </div>
          <button type="submit" className="btn btn-primary">Registrar</button> {/* Botón de envío */}
        </form>
      </div>
    </div>
  );
}
