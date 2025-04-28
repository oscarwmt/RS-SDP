// frontend/src/admin/components/Header.jsx
import React from "react";

const Header = () => {
  return (
    <header className="h-16 flex items-center justify-between px-6 bg-white shadow-sm border-b">
      <h1 className="text-lg font-semibold text-gray-800">Dashboard</h1>
      <div className="flex items-center gap-4">
        <span className="text-sm text-gray-600">Admin</span>
        <img
          src="https://via.placeholder.com/32"
          alt="Avatar"
          className="w-8 h-8 rounded-full"
        />
      </div>
    </header>
  );
};

export default Header;
