"use client";

import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { useRouter } from "next/navigation";
import Sidebar from "@/ui/sidebar";
import "./createAlbaranes.css";

// Componente principal para la creación de albaranes.
export default function CreateDeliveryNotePage() {
  // Configuración de react-hook-form para manejar el formulario.
  const { register, handleSubmit, watch, formState: { errors }, reset } = useForm();
  
  // Estados para almacenar datos de proyectos, clientes y otros.
  const [projects, setProjects] = useState([]); // Lista de proyectos disponibles.
  const [clients, setClients] = useState([]); // Lista de clientes disponibles.
  const [selectedProject, setSelectedProject] = useState(null); // Proyecto seleccionado por el usuario.
  const [error, setError] = useState(null); // Mensaje de error en caso de fallo.
  
  const format = watch("format"); // Observa cambios en el campo "format" del formulario.
  const router = useRouter(); // Instancia del enrutador para redirigir al usuario.

  // Efecto para cargar proyectos y clientes al montar el componente.
  useEffect(() => {
    const fetchProjectsAndClients = async () => {
      try {
        const token = localStorage.getItem("jwt"); // Obtiene el token de autenticación del almacenamiento local.

        // Petición para obtener proyectos.
        const projectResponse = await fetch("https://bildy-rpmaya.koyeb.app/api/project", {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (!projectResponse.ok) throw new Error("Error al cargar proyectos");
        const projectsData = await projectResponse.json();
        setProjects(projectsData);

        // Petición para obtener clientes.
        const clientResponse = await fetch("https://bildy-rpmaya.koyeb.app/api/client", {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (!clientResponse.ok) throw new Error("Error al cargar clientes");
        const clientsData = await clientResponse.json();
        setClients(clientsData);
      } catch (err) {
        setError("Error al cargar proyectos o clientes."); // Manejo de errores durante las peticiones.
      }
    };

    fetchProjectsAndClients();
  }, []); // Ejecuta este efecto solo una vez.

  // Maneja el cambio de selección de proyecto.
  const handleProjectChange = (projectId) => {
    const project = projects.find((p) => p._id === projectId); // Busca el proyecto seleccionado.
    if (project) {
      const client = clients.find((c) => c._id === project.clientId); // Busca el cliente asociado al proyecto.
      setSelectedProject({ ...project, client }); // Guarda el proyecto y su cliente.
    } else {
      setSelectedProject(null); // Reinicia la selección si no hay coincidencia.
    }
  };

  // Maneja el envío del formulario.
  const onSubmit = async (data) => {
    try {
      const token = localStorage.getItem("jwt"); // Obtiene el token de autenticación.

      // Construye el cuerpo de la petición según el formato seleccionado.
      const body = {
        clientId: selectedProject?.client?._id,
        projectId: data.projectId,
        format: data.format,
        description: data.description,
        workdate: data.workdate,
      };

      if (data.format === "hours") {
        body.hours = data.hours; // Agrega horas si el formato es "hours".
      } else if (data.format === "material") {
        body.material = data.material; // Agrega material si el formato es "material".
      }

      // Envía la petición para crear el albarán.
      const response = await fetch("https://bildy-rpmaya.koyeb.app/api/deliverynote", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(body),
      });

      if (!response.ok) {
        throw new Error("Error al crear el albarán");
      }

      // Operaciones posteriores al éxito.
      alert("Albarán creado exitosamente.");
      reset(); // Reinicia el formulario.
      setSelectedProject(null); // Limpia la selección del proyecto.
      router.push("/dashboard/albaranes"); // Redirige al usuario.
    } catch (err) {
      setError("Error desconocido al crear el albarán."); // Manejo de errores.
      console.error("Error al crear el albarán:", err.message);
    }
  };

  return (
    <div className="create-deliverynote-layout">
      <Sidebar /> {/* Componente de barra lateral. */}
      <div className="create-deliverynote-content">
        <h1>Crear Albarán</h1>
        {error && <p className="error-text">{error}</p>} {/* Muestra errores si ocurren. */}
        
        <form onSubmit={handleSubmit(onSubmit)} className="deliverynote-form">
          {/* Campo para seleccionar el proyecto. */}
          <label>Proyecto:</label>
          <select
            {...register("projectId", { required: "Selecciona un proyecto" })}
            onChange={(e) => handleProjectChange(e.target.value)}
          >
            <option value="">Seleccionar Proyecto</option>
            {projects.map((project) => (
              <option key={project._id} value={project._id}>
                {project.name}
              </option>
            ))}
          </select>
          {errors.projectId && <p className="error-text">{errors.projectId.message}</p>}

          {/* Campo para mostrar el cliente del proyecto. */}
          <label>Cliente:</label>
          <input
            type="text"
            value={selectedProject?.client?.name || "No definido"}
            readOnly
          />
          <input type="hidden" {...register("clientId")} value={selectedProject?.client?._id || ""} />

          {/* Campo para seleccionar el formato. */}
          <label>Formato:</label>
          <select {...register("format", { required: "Selecciona un formato" })}>
            <option value="">Seleccionar Formato</option>
            <option value="material">Material</option>
            <option value="hours">Horas</option>
          </select>
          {errors.format && <p className="error-text">{errors.format.message}</p>}

          {/* Campos adicionales según el formato seleccionado. */}
          {format === "material" && (
            <>
              <label>Material:</label>
              <input {...register("material", { required: "Especifica el material" })} />
              {errors.material && <p className="error-text">{errors.material.message}</p>}
            </>
          )}

          {format === "hours" && (
            <>
              <label>Horas:</label>
              <input
                type="number"
                {...register("hours", {
                  required: "Especifica las horas trabajadas",
                  min: { value: 1, message: "Debe ser al menos 1 hora" },
                })}
              />
              {errors.hours && <p className="error-text">{errors.hours.message}</p>}
            </>
          )}

          {/* Otros campos obligatorios. */}
          <label>Fecha de Trabajo:</label>
          <input
            type="date"
            {...register("workdate", { required: "Selecciona una fecha de trabajo" })}
          />
          {errors.workdate && <p className="error-text">{errors.workdate.message}</p>}

          <label>Descripción:</label>
          <textarea
            {...register("description", { required: "Escribe una descripción" })}
          />
          {errors.description && <p className="error-text">{errors.description.message}</p>}

          {/* Botón para enviar el formulario. */}
          <button type="submit" className="btn btn-success">Crear Albarán</button>
        </form>
      </div>
    </div>
  );
}





