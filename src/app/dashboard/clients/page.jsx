"use client";

import Sidebar from "@/ui/sidebar";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import "./clients.css";

export default function ClientsPage() {
  // Estados para manejar clientes, cliente seleccionado, errores, formularios y archivos de logo
  const [clients, setClients] = useState([]); // Lista de clientes
  const [selectedClient, setSelectedClient] = useState(null); // Cliente seleccionado para ver detalles
  const [showForm, setShowForm] = useState(false); // Mostrar formulario de creación
  const [error, setError] = useState(null); // Errores
  const [logoFile, setLogoFile] = useState(null); // Archivo de logo seleccionado
  const { register, handleSubmit, formState: { errors }, reset } = useForm(); // Manejo de formularios

  // Efecto para cargar la lista de clientes al renderizar el componente
  useEffect(() => {
    const fetchClients = async () => {
      try {
        const token = localStorage.getItem("jwt"); // Obtiene el token JWT del almacenamiento local
        const response = await fetch("https://bildy-rpmaya.koyeb.app/api/client", {
          headers: { Authorization: `Bearer ${token}` }, // Autenticación con el token
        });
        if (!response.ok) throw new Error("Error al cargar clientes");
        const data = await response.json();
        setClients(data); // Actualiza la lista de clientes
      } catch (err) {
        setError("No se pudo cargar la lista de clientes."); // Manejo de errores
      }
    };
    fetchClients(); // Llama a la función de carga
  }, []);

  // Maneja la creación de un nuevo cliente
  const onSubmit = async (data) => {
    try {
      const token = localStorage.getItem("jwt");
      const response = await fetch("https://bildy-rpmaya.koyeb.app/api/client", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(data), // Convierte los datos del formulario a JSON
      });
      if (!response.ok) throw new Error("Error al crear cliente");
      const newClient = await response.json();
      setClients([...clients, newClient]); // Agrega el nuevo cliente a la lista
      reset(); // Limpia el formulario
      setShowForm(false); // Oculta el formulario
      alert("Cliente creado exitosamente."); // Notifica al usuario
    } catch (err) {
      setError("No se pudo crear el cliente.");
    }
  };

  // Maneja la subida de logos para un cliente
  const handleLogoUpload = async () => {
    if (!selectedClient || !logoFile) {
      alert("Selecciona un cliente y un archivo antes de subir el logo.");
      return;
    }

    const formData = new FormData();
    formData.append("image", logoFile, logoFile.name); // Agrega el archivo al FormData
    try {
      const token = localStorage.getItem("jwt");
      const response = await fetch(`https://bildy-rpmaya.koyeb.app/api/client/logo/${selectedClient._id}`, {
        method: "PATCH",
        headers: { Authorization: `Bearer ${token}` },
        body: formData, // Envía el archivo
      });
      if (!response.ok) throw new Error("Error al subir el logo");
      const updatedClient = await response.json();
      // Actualiza la lista de clientes con el nuevo logo
      setClients((prev) =>
        prev.map((client) =>
          client._id === selectedClient._id ? { ...client, logo: updatedClient.logo } : client
        )
      );
      alert("Logo actualizado exitosamente.");
    } catch (err) {
      setError("No se pudo subir el logo.");
    }
  };

  // Maneja la selección de un cliente para ver detalles
  const handleClientClick = async (clientId) => {
    try {
      const token = localStorage.getItem("jwt");
      const response = await fetch(`https://bildy-rpmaya.koyeb.app/api/client/${clientId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!response.ok) throw new Error("Error al cargar cliente");
      const data = await response.json();
      setSelectedClient(data); // Actualiza el cliente seleccionado
      setLogoFile(null); // Limpia el archivo de logo
    } catch (err) {
      setError("No se pudo cargar los detalles del cliente.");
    }
  };

  // Maneja la eliminación de un cliente
  const handleDelete = async (clientId) => {
    if (!window.confirm("¿Estás seguro de que quieres eliminar este cliente?")) {
      return;
    }
    try {
      const token = localStorage.getItem("jwt");
      const response = await fetch(`https://bildy-rpmaya.koyeb.app/api/client/${clientId}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!response.ok) throw new Error("Error al eliminar cliente");
      setClients(clients.filter((client) => client._id !== clientId)); // Elimina el cliente de la lista
      alert("Cliente eliminado exitosamente.");
    } catch (err) {
      setError("No se pudo eliminar el cliente.");
    }
  };

  return (
    <div className="clients-layout">
      <Sidebar /> {/* Barra lateral */}
      <div className="clients-content">
        <h1 className="title">Gestión de Clientes</h1>
        {error && <p className="error-text">{error}</p>} {/* Muestra errores si existen */}

        {/* Detalles del cliente seleccionado */}
        {selectedClient && (
          <div className="client-details">
            <h2>Detalles del Cliente</h2>
            {selectedClient.logo && (
              <img
                src={selectedClient.logo}
                alt={`${selectedClient.name} Logo`}
                className="client-logo"
              />
            )}
            <p><strong>Nombre:</strong> {selectedClient.name}</p>
            <p><strong>CIF:</strong> {selectedClient.cif}</p>
            <p>
              <strong>Dirección:</strong> {`${selectedClient.address.street}, ${selectedClient.address.number}, ${selectedClient.address.city}, ${selectedClient.address.province} (${selectedClient.address.postal})`}
            </p>
            <input
              type="file"
              onChange={(e) => setLogoFile(e.target.files[0])}
              className="btn"
            />
            <button onClick={handleLogoUpload} className="btn btn-primary">Subir Logo</button>
            <button onClick={() => setSelectedClient(null)} className="btn">Cerrar</button>
          </div>
        )}

        {/* Lista de clientes o mensaje si no hay clientes */}
        {clients.length === 0 ? (
          <div className="no-clients">
            <p>No tienes clientes registrados aún.</p>
            <button onClick={() => setShowForm(true)} className="btn btn-primary">Añadir Cliente</button>
          </div>
        ) : (
          <div className="clients-list">
            <button onClick={() => setShowForm(true)} className="btn btn-primary">Añadir Nuevo Cliente</button>
            <ul>
              {clients.map((client) => (
                <li key={client._id} className="client-item">
                  <div className="client-info">
                    {client.logo && <img src={client.logo} alt="Logo" className="client-logo" />}
                    <div>
                      <h3>{client.name}</h3>
                      <p>{client.cif}</p>
                    </div>
                  </div>
                  <div className="client-actions">
                    <button
                      onClick={() => handleClientClick(client._id)}
                      className="btn btn-secondary"
                    >
                      Ver Detalles
                    </button>
                    <button
                      onClick={() => handleDelete(client._id)}
                      className="btn btn-danger"
                    >
                      Eliminar
                    </button>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* Formulario para crear un nuevo cliente */}
        {showForm && (
          <form onSubmit={handleSubmit(onSubmit)} className="client-form">
            <h2>Crear Cliente</h2>
            <label>Nombre:</label>
            <input {...register("name", { required: "El nombre es obligatorio" })} />
            {errors.name && <p className="error-text">{errors.name.message}</p>}

            <label>CIF:</label>
            <input {...register("cif", { required: "El CIF es obligatorio" })} />
            {errors.cif && <p className="error-text">{errors.cif.message}</p>}

            <label>Dirección:</label>
            <input {...register("address.street", { required: "La calle es obligatoria" })} placeholder="Calle" />
            <input {...register("address.number", { required: "El número es obligatorio" })} placeholder="Número" />
            <input {...register("address.postal", { required: "El código postal es obligatorio" })} placeholder="Código Postal" />
            <input {...register("address.city", { required: "La ciudad es obligatoria" })} placeholder="Ciudad" />
            <input {...register("address.province", { required: "La provincia es obligatoria" })} placeholder="Provincia" />

            <button type="submit" className="btn btn-success">Guardar Cliente</button>
            <button type="button" onClick={() => setShowForm(false)} className="btn btn-danger">Cancelar</button>
          </form>
        )}
      </div>
    </div>
  );
}







