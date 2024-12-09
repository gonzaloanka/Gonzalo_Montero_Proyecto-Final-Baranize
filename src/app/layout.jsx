import "./globals.css";
import Header from "../ui/header";
import Footer from "../ui/footer";
import Sidebar from "../ui/sidebar";

export const metadata = {
  title: "Gestión de Albaranes",
  description: "Aplicación para digitalizar albaranes de manera eficiente",
};

export default function Layout({ children }) {
  const isDashboard =
    typeof window !== "undefined" && window.location.pathname.startsWith("/dashboard");

  return (
    <html lang="es">
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </head>
      <body className="layout-body">
        <Header />
        <div className={`layout-container ${isDashboard ? "dashboard-layout" : ""}`}>
          {isDashboard && <Sidebar />}
          <main className={`layout-main ${isDashboard ? "dashboard-main" : ""}`}>
            {children}
          </main>
        </div>
        <Footer />
      </body>
    </html>
  );
}
