"use client";

import "./home.css";

const Home = () => {
  return (
    <div className="home-container">
      <header className="home-header">
        <div className="hero">
          <h1 className="hero-title">Baranize</h1>
          <p className="hero-subtitle">
            Simplifica la gestión de tus albaranes, clientes y proyectos con nuestra herramienta profesional.
          </p>
          <div className="cta-buttons">
            <a href="/register" className="btn btn-primary">Registrarse</a>
            <a href="/login" className="btn btn-secondary">Iniciar Sesión</a>
          </div>
        </div>
      </header>
      <main className="features-section">
        <h2 className="features-title">Por qué elegir nuestra solución</h2>
        <div className="features-grid">
          <div className="feature-item">
            <img src="/images/facildeusar.png" alt="Fácil de usar" />
            <h3>Fácil de Usar</h3>
            <p>
              Interfaz intuitiva diseñada para maximizar la eficiencia en la gestión de albaranes.
            </p>
          </div>
          <div className="feature-item">
            <img src="/images/candado.png" alt="Seguridad" />
            <h3>Seguridad</h3>
            <p>
              Tus datos están protegidos con cifrado de última generación.
            </p>
          </div>
          <div className="feature-item">
            <img src="/images/personalizacion.png" alt="Personalización" />
            <h3>Personalización</h3>
            <p>
              Adapta nuestra herramienta a las necesidades específicas de tu negocio.
            </p>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Home;





