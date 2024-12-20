"use client";

import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import Sidebar from "@/ui/sidebar";
import "./projects.css";

export default function ProjectsPage() {
  const [projects, setProjects] = useState([]);
  const [clients, setClients] = useState([]);
  const [selectedProject, setSelectedProject] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const { register, handleSubmit, formState: { errors }, reset, setValue } = useForm();

  // Efecto para cargar proyectos y clientes al montar el componente
  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = localStorage.getItem("jwt");

        // Carga los proyectos
        const projectResponse = await fetch("https://bildy-rpmaya.koyeb.app/api/project", {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (!projectResponse.ok) throw new Error("Error al cargar proyectos");
        const projectData = await projectResponse.json();

        // Recupera datos locales (estado y fecha) para los proyectos
        const storedData = JSON.parse(localStorage.getItem("projectData")) || {};
        const updatedProjects = projectData.map((project) => ({
          ...project,
          status: storedData[project._id]?.status || "Pendiente",
          date: storedData[project._id]?.date || "No definida",
        }));
        setProjects(updatedProjects);

        // Carga los clientes
        const clientResponse = await fetch("https://bildy-rpmaya.koyeb.app/api/client", {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (!clientResponse.ok) throw new Error("Error al cargar clientes");
        const clientData = await clientResponse.json();
        setClients(clientData);
      } catch (err) {
        setError("Error al cargar datos.");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // Guarda datos adicionales de proyectos en localStorage
  const saveToLocalStorage = (projectId, status, date) => {
    const storedData = JSON.parse(localStorage.getItem("projectData")) || {};
    storedData[projectId] = { status, date };
    localStorage.setItem("projectData", JSON.stringify(storedData));
  };

  // Maneja la creación o edición de un proyecto
  const onSubmit = async (data) => {
    try {
      const token = localStorage.getItem("jwt");
      let response;

      if (selectedProject) {
        // Actualiza un proyecto existente
        response = await fetch(`https://bildy-rpmaya.koyeb.app/api/project/${selectedProject._id}`, {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(data),
        });
        if (!response.ok) throw new Error("Error al actualizar proyecto");
        const updatedProject = await response.json();

        // Actualiza la lista de proyectos
        setProjects((prev) =>
          prev.map((project) =>
            project._id === updatedProject._id ? { ...project, ...updatedProject } : project
          )
        );
      } else {
        // Crea un nuevo proyecto
        response = await fetch("https://bildy-rpmaya.koyeb.app/api/project", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(data),
        });
        if (!response.ok) throw new Error("Error al crear proyecto");
        const newProject = await response.json();
        const currentDate = new Date().toLocaleDateString();

        // Guarda el nuevo proyecto en la lista y en localStorage
        saveToLocalStorage(newProject._id, "Pendiente", currentDate);
        setProjects([...projects, { ...newProject, status: "Pendiente", date: currentDate }]);
      }

      reset();
      setShowForm(false);
      setSelectedProject(null);
      alert("Proyecto guardado exitosamente.");
    } catch (err) {
      setError("No se pudo guardar el proyecto.");
    }
  };

  // Actualiza el estado de un proyecto
  const handleUpdateStatus = (projectId, newStatus) => {
    const updatedProjects = projects.map((project) =>
      project._id === projectId ? { ...project, status: newStatus } : project
    );
    setProjects(updatedProjects);
    saveToLocalStorage(projectId, newStatus, new Date().toLocaleDateString());
  };

  // Maneja la eliminación de un proyecto
  const handleDelete = async (projectId) => {
    if (!window.confirm("¿Estás seguro de que deseas eliminar este proyecto?")) return;

    try {
      const token = localStorage.getItem("jwt");
      const response = await fetch(`https://bildy-rpmaya.koyeb.app/api/project/${projectId}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!response.ok) throw new Error("Error al eliminar proyecto");

      // Actualiza la lista de proyectos eliminando el correspondiente
      setProjects(projects.filter((p) => p._id !== projectId));

      // Elimina los datos del proyecto de localStorage
      const storedData = JSON.parse(localStorage.getItem("projectData")) || {};
      delete storedData[projectId];
      localStorage.setItem("projectData", JSON.stringify(storedData));

      alert("Proyecto eliminado exitosamente.");
    } catch (err) {
      setError("No se pudo eliminar el proyecto.");
    }
  };

  // Prepara el formulario para editar un proyecto
  const handleEdit = (project) => {
    setSelectedProject(project);
    setValue("name", project.name);
    setValue("clientId", project.clientId);
    setShowForm(true);
  };

  // Muestra un mensaje de carga mientras se obtienen los datos
  if (loading) return <div className="loading">Cargando datos...</div>;

  return (
    <div className="projects-layout">
      <Sidebar />
      <div className="projects-content">
        <h1>Gestión de Proyectos</h1>
        {error && <p className="error-text">{error}</p>}

        <button onClick={() => setShowForm(!showForm)} className="btn btn-primary">
          {showForm ? "Ocultar Formulario" : "Crear Proyecto"}
        </button>

        {/* Formulario de creación/edición de proyectos */}
        {showForm && (
          <form onSubmit={handleSubmit(onSubmit)} className="project-form">
            <h2>{selectedProject ? "Editar Proyecto" : "Crear Proyecto"}</h2>
            <label>Nombre del Proyecto:</label>
            <input {...register("name", { required: "El nombre es obligatorio" })} />
            {errors.name && <p className="error-text">{errors.name.message}</p>}

            <label>Cliente Asociado:</label>
            <select {...register("clientId", { required: "Selecciona un cliente" })}>
              <option value="">Seleccionar Cliente</option>
              {clients.map((client) => (
                <option key={client._id} value={client._id}>
                  {client.name}
                </option>
              ))}
            </select>
            {errors.clientId && <p className="error-text">{errors.clientId.message}</p>}

            <button type="submit" className="btn btn-success">Guardar Proyecto</button>
          </form>
        )}

        {/* Lista de proyectos */}
        <div className="projects-list">
          {projects.length > 0 ? (
            <ul>
              {projects.map((project, index) => (
                <li key={project._id} className="project-item">
                  <h3>{index + 1}. {project.name}</h3>
                  <p>Cliente: {clients.find((c) => c._id === project.clientId)?.name || "No definido"}</p>
                  <p>Estado: {project.status}</p>
                  <p>Fecha: {project.date}</p>
                  <div className="buttons">
                    <button onClick={() => handleEdit(project)} className="btn btn-warning">
                      Editar
                    </button>
                    <button onClick={() => handleUpdateStatus(project._id, "Finalizado")} className="btn btn-primary">
                      Finalizar Proyecto
                    </button>
                    <button onClick={() => handleDelete(project._id)} className="btn btn-danger">
                      Eliminar Proyecto
                    </button>
                  </div>
                </li>
              ))}
            </ul>
          ) : (
            <p>No hay proyectos registrados aún.</p>
          )}
        </div>
      </div>
    </div>
  );
}










