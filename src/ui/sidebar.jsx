"use client";

import React, { useState } from "react";
import Link from "next/link";
import "./sidebar.css";

const Sidebar = ({ onToggle }) => {
  const [isOpen, setIsOpen] = useState(false);

  const toggleSidebar = () => {
    setIsOpen(!isOpen);
    if (onToggle) {
      onToggle(!isOpen);
    }
  };

  return (
    <div className={`sidebar ${isOpen ? "open" : "closed"}`}>
      <button className="toggle-button" onClick={toggleSidebar}>
        {isOpen ? "<<" : ">>"}
      </button>
      <nav className="sidebar-nav">
        <ul>
          <li>
            <Link href="/dashboard">Dashboard</Link>
          </li>
          <li>
            <Link href="/dashboard/clients">Clientes</Link>
          </li>
          <li>
            <Link href="/dashboard/projects">Proyectos</Link>
          </li>
          <li>
            <Link href="/dashboard/albaranes">Albaranes</Link>
          </li>
        </ul>
      </nav>
    </div>
  );
};

export default Sidebar;


