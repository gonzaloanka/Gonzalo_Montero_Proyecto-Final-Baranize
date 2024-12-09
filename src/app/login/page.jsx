"use client";
import { useForm } from "react-hook-form";
import { useState } from "react";
import { useRouter } from "next/navigation";
import "./login.css";

export default function Login() {
  const { register, handleSubmit, formState: { errors } } = useForm();
  const [error, setError] = useState(null);
  const router = useRouter();

  const onSubmit = async (formData) => {
    try {
      const response = await fetch("https://bildy-rpmaya.koyeb.app/api/user/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (!response.ok) throw new Error("Credenciales incorrectas");

      const result = await response.json();
      localStorage.setItem("jwt", result.token); // Guardar token
      alert("Inicio de sesión exitoso. Redirigiendo al dashboard...");
      router.push("/dashboard");
    } catch (err) {
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
