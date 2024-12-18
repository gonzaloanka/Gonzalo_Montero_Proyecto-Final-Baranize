import "./globals.css";
import Header from "../ui/header";
import Footer from "../ui/footer";
import Sidebar from "../ui/sidebar";

export const metadata = {
  title: "Gestión de Albaranes",
  description: "Aplicación para digitalizar albaranes de manera eficiente",
};

export default function Layout({ children }) {
  // Determina si la página actual es parte del dashboard.
  const isDashboard =
    typeof window !== "undefined" && // Comprueba si el código se ejecuta en el cliente (no en el servidor).
    window.location.pathname.startsWith("/dashboard"); // Verifica si la ruta comienza con "/dashboard".

  return (
    <html lang="es">
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </head>
      <body className="layout-body">
        <Header />
        <div className={`layout-container ${isDashboard ? "dashboard-layout" : ""}`}>
          {/* Si es parte del dashboard, incluye el Sidebar. */}
          {isDashboard && <Sidebar />}
          <main className={`layout-main ${isDashboard ? "dashboard-main" : ""}`}>
            {children}
          </main>
        </div>
        <Footer /> {/* Incluye el pie de página en todas las páginas. */}
      </body>
    </html>
  );
}
