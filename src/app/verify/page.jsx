"use client";

import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import "./verify.css";

export default function VerificationPage() {
  const router = useRouter(); // Hook de navegación para redirigir al usuario
  const { register, handleSubmit, formState: { errors } } = useForm(); // Configuración del formulario

  // Función que se ejecuta al enviar el formulario
  const onSubmit = async (data) => {
    const token = localStorage.getItem("jwt"); // Obtiene el token JWT del almacenamiento local
    try {
      const response = await fetch("https://bildy-rpmaya.koyeb.app/api/user/validation", {
        method: "PUT", // Método PUT para validar el correo
        headers: {
          "Content-Type": "application/json", // Especifica el tipo de contenido
          "Authorization": `Bearer ${token}`, // Autoriza la petición con el token
        },
        body: JSON.stringify(data), // Convierte los datos del formulario a JSON
      });
      const result = await response.json(); // Obtiene la respuesta en formato JSON
      if (response.ok) {
        // Si la validación es exitosa
        alert("Correo validado exitosamente. Redirigiendo al login...");
        router.push("/login"); // Redirige al login
      } else {
        // Muestra un mensaje de error en caso de fallo
        alert(result.message || "Error en la validación.");
      }
    } catch (error) {
      // Manejo de errores en caso de que la petición falle
      alert("Ocurrió un error.");
    }
  };

  return (
    <div className="verification-container">
      <div className="verification-card">
        <h1 className="verification-title">Verificación de Correo</h1>
        <form onSubmit={handleSubmit(onSubmit)} className="verification-form">
          <div className="form-group">
            <label>Código:</label>
            <input
              type="text"
              {...register("code", { required: "Código es obligatorio" })}
              className={errors.code ? "input-error" : ""}
            />
            {errors.code && <p className="error-message">{errors.code.message}</p>}
          </div>
          <button type="submit" className="btn-primary">Validar</button>
        </form>
      </div>
    </div>
  );
}









