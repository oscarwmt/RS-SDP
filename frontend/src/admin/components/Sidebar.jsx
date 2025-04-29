// frontend/src/admin/components/Sidebar.jsx
import React from "react";
import { Link } from "react-router-dom";
import { Home, List, Settings } from "lucide-react";

const Sidebar = () => {
  return (
    <aside className="w-64 bg-white shadow-md">
      <div className="p-6 font-bold text-xl text-gray-700 border-b">
        Admin Panel
      </div>
      <nav className="p-4 space-y-2">
        <Link
          to="/admin"
          className="flex items-center gap-2 px-3 py-2 rounded-md hover:bg-gray-100 text-gray-700"
        >
          <Home size={18} />
          Inicio
        </Link>
        <Link
          to="/admin/propiedades"
          className="flex items-center gap-2 px-3 py-2 rounded-md hover:bg-gray-100 text-gray-700"
        >
          <List size={18} />
          Propiedades
        </Link>
        <Link
          to="/admin/ajustes"
          className="flex items-center gap-2 px-3 py-2 rounded-md hover:bg-gray-100 text-gray-700"
        >
          <Settings size={18} />
          Ajustes
        </Link>
      </nav>
    </aside>
  );
};

export default Sidebar;
