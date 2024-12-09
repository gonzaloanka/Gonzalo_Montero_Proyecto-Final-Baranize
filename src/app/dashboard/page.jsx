"use client";

import Sidebar from "@/ui/sidebar";
import "./dashboard.css";

export default function DashboardPage() {
  return (
    <div className="dashboard-layout"> {/* Contenedor principal del Dashboard. */}
      <Sidebar /> {/* Barra lateral para navegar entre las secciones. */}
      <div className="dashboard-content"> {/* Contenido principal del Dashboard. */}
        <h1 className="dashboard-title">Bienvenido al Dashboard</h1> {/* Título de bienvenida. */}
        <p className="dashboard-text">
          Utiliza el menú lateral para navegar entre las diferentes secciones:
          <strong> Gestión de Clientes</strong>, <strong>Proyectos</strong> y
          <strong> Albaranes</strong>.
        </p>

        {/* Sección de tarjetas para destacar funcionalidades principales. */}
        <div className="dashboard-cards">
          <div className="dashboard-card"> {/* Tarjeta individual para "Clientes". */}
            <img src="/images/client.png" alt="Clientes" className="card-image" /> {/* Imagen representativa. */}
            <h2>Clientes</h2>
            <p>Gestiona y organiza la información de tus clientes de forma sencilla.</p>
          </div>
          <div className="dashboard-card"> {/* Tarjeta individual para "Proyectos". */}
            <img src="/images/project.png" alt="Proyectos" className="card-image" /> {/* Imagen representativa. */}
            <h2>Proyectos</h2>
            <p>Supervisa el progreso de tus proyectos con herramientas eficientes.</p>
          </div>
          <div className="dashboard-card"> {/* Tarjeta individual para "Albaranes". */}
            <img src="/images/deliverynote.png" alt="Albaranes" className="card-image" /> {/* Imagen representativa. */}
            <h2>Albaranes</h2>
            <p>Digitaliza y organiza los albaranes de tu empresa de manera profesional.</p>
          </div>
        </div>
      </div>
    </div>
  );
}


