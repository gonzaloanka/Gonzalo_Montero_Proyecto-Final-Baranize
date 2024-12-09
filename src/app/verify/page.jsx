"use client";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import "./verify.css";

export default function VerificationPage() {
  const router = useRouter();
  const { register, handleSubmit, formState: { errors } } = useForm();

  const onSubmit = async (data) => {
    const token = localStorage.getItem("jwt");
    try {
      const response = await fetch("https://bildy-rpmaya.koyeb.app/api/user/validation", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`,
        },
        body: JSON.stringify(data),
      });
      const result = await response.json();
      if (response.ok) {
        alert("Correo validado exitosamente. Redirigiendo al login...");
        router.push("/login");
      } else {
        alert(result.message || "Error en la validación.");
      }
    } catch (error) {
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








