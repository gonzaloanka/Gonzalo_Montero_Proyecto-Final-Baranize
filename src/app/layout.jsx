import "./globals.css";
import Header from "../ui/header";
import Footer from "../ui/footer";
import Sidebar from "../ui/sidebar";

// Metadata de la aplicación
export const metadata = {
  title: "Gestión de Albaranes", // Título del documento
  description: "Aplicación para digitalizar albaranes de manera eficiente", // Breve descripción para SEO
};

// Componente de layout principal
export default function Layout({ children }) {
  // Detecta si la página actual pertenece al dashboard
  const isDashboard =
    typeof window !== "undefined" && window.location.pathname.startsWith("/dashboard");

  return (
    <html lang="es"> {/* Idioma establecido como español */}
      <head>
        {/* Configuración para dispositivos móviles */}
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </head>
      <body className="layout-body">
        {/* Header global visible en todas las páginas */}
        <Header />

        {/* Contenedor principal que varía según el contexto */}
        <div className={`layout-container ${isDashboard ? "dashboard-layout" : ""}`}>
          {/* Sidebar solo visible en las páginas del dashboard */}
          {isDashboard && <Sidebar />}

          {/* Contenido principal */}
          <main className={`layout-main ${isDashboard ? "dashboard-main" : ""}`}>
            {children}
          </main>
        </div>

        {/* Footer global visible en todas las páginas */}
        <Footer />
      </body>
    </html>
  );
}
