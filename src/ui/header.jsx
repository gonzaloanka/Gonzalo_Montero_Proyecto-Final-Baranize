import "./header.css";
import Link from "next/link";

const Header = () => {
  return (
    <header className="header">
      <div className="header-container">
        <h1 className="header-title">Baranize</h1>
        <nav className="header-nav">
          <Link href="/" className="nav-link">Inicio</Link>
          <Link href="/register" className="nav-link">Registro</Link>
          <Link href="/login" className="nav-link">Login</Link>
        </nav>
      </div>
    </header>
  );
};

export default Header;

