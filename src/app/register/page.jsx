"use client";

import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import "./register.css";

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
    <div className="register-container">
      <div className="register-card">
        <h1 className="register-title">Registro de Usuario</h1>
        <form onSubmit={handleSubmit(onSubmit)} className="register-form">
          <div className="form-group">
            <label>Email:</label>
            <input
              type="email"
              {...register("email", { required: "Correo es obligatorio" })}
              className={errors.email ? "input-error" : ""}
            />
            {errors.email && <p className="error-message">{errors.email.message}</p>}
          </div>
          <div className="form-group">
            <label>Contraseña:</label>
            <input
              type="password"
              {...register("password", { required: "Contraseña es obligatoria" })}
              className={errors.password ? "input-error" : ""}
            />
            {errors.password && <p className="error-message">{errors.password.message}</p>}
          </div>
          <button type="submit" className="btn btn-primary">Registrar</button>
        </form>
      </div>
    </div>
  );
}
