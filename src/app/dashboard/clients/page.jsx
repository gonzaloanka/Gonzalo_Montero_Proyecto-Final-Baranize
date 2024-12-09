"use client";

import Sidebar from "@/ui/sidebar";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import "./clients.css";

export default function ClientsPage() {
  const [clients, setClients] = useState([]);
  const [selectedClient, setSelectedClient] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [error, setError] = useState(null);
  const [logoFile, setLogoFile] = useState(null);
  const { register, handleSubmit, formState: { errors }, reset } = useForm();

  useEffect(() => {
    const fetchClients = async () => {
      try {
        const token = localStorage.getItem("jwt");
        const response = await fetch("https://bildy-rpmaya.koyeb.app/api/client", {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (!response.ok) throw new Error("Error al cargar clientes");
        const data = await response.json();
        setClients(data);
      } catch (err) {
        setError("No se pudo cargar la lista de clientes.");
      }
    };
    fetchClients();
  }, []);

  const onSubmit = async (data) => {
    try {
      const token = localStorage.getItem("jwt");
      const response = await fetch("https://bildy-rpmaya.koyeb.app/api/client", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(data),
      });
      if (!response.ok) throw new Error("Error al crear cliente");
      const newClient = await response.json();
      setClients([...clients, newClient]);
      reset();
      setShowForm(false);
      alert("Cliente creado exitosamente.");
    } catch (err) {
      setError("No se pudo crear el cliente.");
    }
  };

  const handleLogoUpload = async () => {
    if (!selectedClient || !logoFile) {
      alert("Selecciona un cliente y un archivo antes de subir el logo.");
      return;
    }

    const formData = new FormData();
    formData.append("image", logoFile, logoFile.name);
    try {
      const token = localStorage.getItem("jwt");
      const response = await fetch(`https://bildy-rpmaya.koyeb.app/api/client/logo/${selectedClient._id}`, {
        method: "PATCH",
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: formData,
      });
      if (!response.ok) throw new Error("Error al subir el logo");
      const updatedClient = await response.json();
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

  const handleClientClick = async (clientId) => {
    try {
      const token = localStorage.getItem("jwt");
      const response = await fetch(`https://bildy-rpmaya.koyeb.app/api/client/${clientId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!response.ok) throw new Error("Error al cargar cliente");
      const data = await response.json();
      setSelectedClient(data);
      setLogoFile(null);
    } catch (err) {
      setError("No se pudo cargar los detalles del cliente.");
    }
  };

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
      setClients(clients.filter((client) => client._id !== clientId));
      alert("Cliente eliminado exitosamente.");
    } catch (err) {
      setError("No se pudo eliminar el cliente.");
    }
  };

  return (
    <div className="clients-layout">
      <Sidebar />
      <div className="clients-content">
        <h1 className="title">Gestión de Clientes</h1>
        {error && <p className="error-text">{error}</p>}

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






