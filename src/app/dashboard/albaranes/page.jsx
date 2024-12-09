"use client";

import { useState, useEffect } from "react";
import Sidebar from "@/ui/sidebar";
import "./albaranes.css";

export default function AlbaranesPage() {
  // Estado para almacenar los albaranes y clientes.
  const [deliveryNotes, setDeliveryNotes] = useState([]);
  const [clients, setClients] = useState([]);
  const [error, setError] = useState(null); // Manejo de errores.
  const [isSidebarOpen, setIsSidebarOpen] = useState(false); // Estado para controlar el sidebar.

  // Actualiza el estado del sidebar cuando se abre o cierra.
  const handleSidebarToggle = (isOpen) => {
    setIsSidebarOpen(isOpen);
  };

  // Fetch inicial de albaranes y clientes al montar el componente.
  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = localStorage.getItem("jwt"); // Obtiene el token del almacenamiento local.

        // Fetch para obtener albaranes.
        const deliveryNoteResponse = await fetch("https://bildy-rpmaya.koyeb.app/api/deliverynote", {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (!deliveryNoteResponse.ok) throw new Error("Error al cargar los albaranes");
        const deliveryNotesData = await deliveryNoteResponse.json();

        // Fetch para obtener clientes.
        const clientResponse = await fetch("https://bildy-rpmaya.koyeb.app/api/client", {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (!clientResponse.ok) throw new Error("Error al cargar clientes");
        const clientsData = await clientResponse.json();

        setDeliveryNotes(deliveryNotesData); // Actualiza los albaranes.
        setClients(clientsData); // Actualiza los clientes.
      } catch (err) {
        setError("Error al cargar los albaranes o clientes."); // Manejo de errores.
      }
    };

    fetchData();
  }, []);

  // Obtiene el nombre del cliente a partir de su ID.
  const getClientName = (clientId) => {
    const client = clients.find((c) => c._id === clientId);
    return client ? client.name : "Sin cliente";
  };

  // Elimina un albarán por ID.
  const handleDelete = async (id) => {
    if (!window.confirm("¿Estás seguro de que quieres eliminar este albarán?")) return;

    try {
      const token = localStorage.getItem("jwt");
      const response = await fetch(`https://bildy-rpmaya.koyeb.app/api/deliverynote/${id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!response.ok) throw new Error("Error al eliminar el albarán");
      setDeliveryNotes(deliveryNotes.filter((note) => note._id !== id)); // Actualiza el estado.
      alert("Albarán eliminado correctamente.");
    } catch (err) {
      setError("No se pudo eliminar el albarán."); // Manejo de errores.
    }
  };

  // Descarga un PDF de un albarán por ID.
  const handleDownloadPDF = async (id) => {
    try {
      const token = localStorage.getItem("jwt");
      const response = await fetch(`https://bildy-rpmaya.koyeb.app/api/deliverynote/pdf/${id}`, {
        method: "GET",
        headers: { Authorization: `Bearer ${token}` },
      });

      if (!response.ok) throw new Error("Error al descargar el PDF del albarán");

      const blob = await response.blob(); // Convierte la respuesta a Blob.
      const url = window.URL.createObjectURL(blob); // Crea una URL temporal.

      const link = document.createElement("a"); // Crea un enlace para la descarga.
      link.href = url;
      link.download = `Albaran_${id}.pdf`;
      link.click(); // Simula un clic para descargar.
    } catch (err) {
      setError("No se pudo descargar el albarán."); // Manejo de errores.
    }
  };

  return (
    <div className={`albaranes-layout ${isSidebarOpen ? "sidebar-open" : ""}`}> {/* Layout principal. */}
      <Sidebar onToggle={handleSidebarToggle} /> {/* Barra lateral con control de apertura/cierre. */}
      <div className="albaranes-content"> {/* Contenido principal de la página. */}
        <h1>Gestión de Albaranes</h1> {/* Título principal. */}
        {error && <p className="error-text">{error}</p>} {/* Mensaje de error, si existe. */}

        {/* Botón para redirigir a la creación de un nuevo albarán. */}
        <button
          onClick={() => (window.location.href = "/dashboard/albaranes/create")}
          className="btn btn-primary"
        >
          Crear Nuevo Albarán
        </button>

        {/* Lista de albaranes */}
        <div className="albaranes-list">
          {deliveryNotes.length > 0 ? (
            <ul>
              {deliveryNotes.map((note) => (
                <li key={note._id} className="albaran-item"> {/* Elemento individual de albarán. */}
                  <p><strong>Descripción:</strong> {note.description || "Sin descripción"}</p>
                  <p><strong>Proyecto:</strong> {note.projectId?.name || "Sin proyecto"}</p>
                  <p><strong>Cliente:</strong> {getClientName(note.clientId)}</p>
                  <div className="buttons"> {/* Botones de acciones. */}
                    <button
                      onClick={() => handleDelete(note._id)}
                      className="btn btn-danger"
                    >
                      Eliminar
                    </button>
                    <button
                      onClick={() => handleDownloadPDF(note._id)}
                      className="btn btn-secondary"
                    >
                      Descargar PDF
                    </button>
                  </div>
                </li>
              ))}
            </ul>
          ) : (
            <p>No hay albaranes disponibles.</p> /* Mensaje si no hay albaranes. */
          )}
        </div>
      </div>
    </div>
  );
}




