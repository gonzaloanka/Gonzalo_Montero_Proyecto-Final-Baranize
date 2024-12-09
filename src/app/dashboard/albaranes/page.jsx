"use client";

import { useState, useEffect } from "react";
import Sidebar from "@/ui/sidebar";
import "./albaranes.css";

export default function AlbaranesPage() {
  const [deliveryNotes, setDeliveryNotes] = useState([]);
  const [clients, setClients] = useState([]);
  const [error, setError] = useState(null);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const handleSidebarToggle = (isOpen) => {
    setIsSidebarOpen(isOpen);
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = localStorage.getItem("jwt");

        const deliveryNoteResponse = await fetch("https://bildy-rpmaya.koyeb.app/api/deliverynote", {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (!deliveryNoteResponse.ok) throw new Error("Error al cargar los albaranes");
        const deliveryNotesData = await deliveryNoteResponse.json();

        const clientResponse = await fetch("https://bildy-rpmaya.koyeb.app/api/client", {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (!clientResponse.ok) throw new Error("Error al cargar clientes");
        const clientsData = await clientResponse.json();

        setDeliveryNotes(deliveryNotesData);
        setClients(clientsData);
      } catch (err) {
        setError("Error al cargar los albaranes o clientes.");
      }
    };

    fetchData();
  }, []);

  const getClientName = (clientId) => {
    const client = clients.find((c) => c._id === clientId);
    return client ? client.name : "Sin cliente";
  };

  const handleDelete = async (id) => {
    if (!window.confirm("¿Estás seguro de que quieres eliminar este albarán?")) return;

    try {
      const token = localStorage.getItem("jwt");
      const response = await fetch(`https://bildy-rpmaya.koyeb.app/api/deliverynote/${id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!response.ok) throw new Error("Error al eliminar el albarán");
      setDeliveryNotes(deliveryNotes.filter((note) => note._id !== id));
      alert("Albarán eliminado correctamente.");
    } catch (err) {
      setError("No se pudo eliminar el albarán.");
    }
  };

  const handleDownloadPDF = async (id) => {
    try {
      const token = localStorage.getItem("jwt");
      const response = await fetch(`https://bildy-rpmaya.koyeb.app/api/deliverynote/pdf/${id}`, {
        method: "GET",
        headers: { Authorization: `Bearer ${token}` },
      });

      if (!response.ok) throw new Error("Error al descargar el PDF del albarán");

      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);

      const link = document.createElement("a");
      link.href = url;
      link.download = `Albaran_${id}.pdf`;
      link.click();
    } catch (err) {
      setError("No se pudo descargar el albarán.");
    }
  };

  return (
    <div className={`albaranes-layout ${isSidebarOpen ? "sidebar-open" : ""}`}>
      <Sidebar onToggle={handleSidebarToggle} />
      <div className="albaranes-content">
        <h1>Gestión de Albaranes</h1>
        {error && <p className="error-text">{error}</p>}

        <button
          onClick={() => (window.location.href = "/dashboard/albaranes/create")}
          className="btn btn-primary"
        >
          Crear Nuevo Albarán
        </button>

        <div className="albaranes-list">
          {deliveryNotes.length > 0 ? (
            <ul>
              {deliveryNotes.map((note) => (
                <li key={note._id} className="albaran-item">
                  <p><strong>Descripción:</strong> {note.description || "Sin descripción"}</p>
                  <p><strong>Proyecto:</strong> {note.projectId?.name || "Sin proyecto"}</p>
                  <p><strong>Cliente:</strong> {getClientName(note.clientId)}</p>
                  <div className="buttons">
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
            <p>No hay albaranes disponibles.</p>
          )}
        </div>
      </div>
    </div>
  );
}



