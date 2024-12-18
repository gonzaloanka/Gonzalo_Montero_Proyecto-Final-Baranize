"use client";

import { useForm } from "react-hook-form";
import { useState } from "react";
import { useRouter } from "next/navigation";
import "./login.css";

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
    <div className="login-container">
      <div className="login-card"> 
        <h1 className="login-title">Iniciar Sesión</h1>
        <form onSubmit={handleSubmit(onSubmit)} className="login-form">
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
          <button type="submit" className="btn-primary">Entrar</button>
        </form>
        {error && <p className="login-error">{error}</p>}
      </div>
    </div>
  );
}
