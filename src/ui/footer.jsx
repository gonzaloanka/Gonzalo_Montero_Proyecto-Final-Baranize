import "./footer.css";

const Footer = () => {
  return (
    <footer className="footer">
      <div className="footer-container">
        <p>
          © {new Date().getFullYear()} Baranize. Todos los derechos reservados.
        </p>
        <p>Desarrollado por Gonzalo Montero Sierra.</p>
      </div>
    </footer>
  );
};

export default Footer;


