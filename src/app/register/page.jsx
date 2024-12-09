"use client";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import "./register.css";

export default function RegisterPage() {
  const router = useRouter();
  const { register, handleSubmit, formState: { errors } } = useForm();

  const onSubmit = async (data) => {
    try {
      const response = await fetch("https://bildy-rpmaya.koyeb.app/api/user/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      const result = await response.json();
      if (response.ok) {
        localStorage.setItem("jwt", result.token);
        alert("Registro exitoso. Redirigiendo a la página de verificación...");
        router.push("/verify");
      } else {
        alert(result.message || "Error en el registro.");
      }
    } catch (error) {
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
