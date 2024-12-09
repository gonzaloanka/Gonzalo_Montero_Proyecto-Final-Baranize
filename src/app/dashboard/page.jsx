"use client";

import Sidebar from "@/ui/sidebar";
import "./dashboard.css";

export default function DashboardPage() {
  return (
    <div className="dashboard-layout">
      <Sidebar />
      <div className="dashboard-content">
        <h1 className="dashboard-title">Bienvenido al Dashboard</h1>
        <p className="dashboard-text">
          Utiliza el menú lateral para navegar entre las diferentes secciones:
          <strong> Gestión de Clientes</strong>, <strong>Proyectos</strong> y
          <strong> Albaranes</strong>.
        </p>

        <div className="dashboard-cards">
          <div className="dashboard-card">
            <img src="/images/client.png" alt="Clientes" className="card-image" />
            <h2>Clientes</h2>
            <p>Gestiona y organiza la información de tus clientes de forma sencilla.</p>
          </div>
          <div className="dashboard-card">
            <img src="/images/project.png" alt="Proyectos" className="card-image" />
            <h2>Proyectos</h2>
            <p>Supervisa el progreso de tus proyectos con herramientas eficientes.</p>
          </div>
          <div className="dashboard-card">
            <img src="/images/deliverynote.png" alt="Albaranes" className="card-image" />
            <h2>Albaranes</h2>
            <p>Digitaliza y organiza los albaranes de tu empresa de manera profesional.</p>
          </div>
        </div>
      </div>
    </div>
  );
}



