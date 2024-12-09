"use client";

import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { useRouter } from "next/navigation";
import Sidebar from "@/ui/sidebar";
import "./createAlbaranes.css";

export default function CreateDeliveryNotePage() {
  const { register, handleSubmit, watch, formState: { errors }, reset } = useForm();
  const [projects, setProjects] = useState([]);
  const [clients, setClients] = useState([]);
  const [selectedProject, setSelectedProject] = useState(null);
  const [error, setError] = useState(null);
  const format = watch("format");
  const router = useRouter();

  useEffect(() => {
    const fetchProjectsAndClients = async () => {
      try {
        const token = localStorage.getItem("jwt");

        const projectResponse = await fetch("https://bildy-rpmaya.koyeb.app/api/project", {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (!projectResponse.ok) throw new Error("Error al cargar proyectos");
        const projectsData = await projectResponse.json();
        setProjects(projectsData);

        const clientResponse = await fetch("https://bildy-rpmaya.koyeb.app/api/client", {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (!clientResponse.ok) throw new Error("Error al cargar clientes");
        const clientsData = await clientResponse.json();
        setClients(clientsData);
      } catch (err) {
        setError("Error al cargar proyectos o clientes.");
      }
    };

    fetchProjectsAndClients();
  }, []);

  const handleProjectChange = (projectId) => {
    const project = projects.find((p) => p._id === projectId);
    if (project) {
      const client = clients.find((c) => c._id === project.clientId);
      setSelectedProject({ ...project, client });
    } else {
      setSelectedProject(null);
    }
  };

  const onSubmit = async (data) => {
    try {
      const token = localStorage.getItem("jwt");

      const body = {
        clientId: selectedProject?.client?._id,
        projectId: data.projectId,
        format: data.format,
        description: data.description,
        workdate: data.workdate,
      };

      if (data.format === "hours") {
        body.hours = data.hours;
      } else if (data.format === "material") {
        body.material = data.material;
      }

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

      alert("Albarán creado exitosamente.");
      reset();
      setSelectedProject(null);
      router.push("/dashboard/albaranes");
    } catch (err) {
      setError("Error desconocido al crear el albarán.");
      console.error("Error al crear el albarán:", err.message);
    }
  };

  return (
    <div className="create-deliverynote-layout">
      <Sidebar />
      <div className="create-deliverynote-content">
        <h1>Crear Albarán</h1>
        {error && <p className="error-text">{error}</p>}
        <form onSubmit={handleSubmit(onSubmit)} className="deliverynote-form">
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

          <label>Cliente:</label>
          <input
            type="text"
            value={selectedProject?.client?.name || "No definido"}
            readOnly
          />
          <input type="hidden" {...register("clientId")} value={selectedProject?.client?._id || ""} />

          <label>Formato:</label>
          <select {...register("format", { required: "Selecciona un formato" })}>
            <option value="">Seleccionar Formato</option>
            <option value="material">Material</option>
            <option value="hours">Horas</option>
          </select>
          {errors.format && <p className="error-text">{errors.format.message}</p>}

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

          <button type="submit" className="btn btn-success">Crear Albarán</button>
        </form>
      </div>
    </div>
  );
}





