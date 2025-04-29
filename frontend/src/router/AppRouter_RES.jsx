import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Login from "../pages/Login";
import AdminLayout from "../admin/AdminLayout";
import ProtectedRoute from "./ProtectedRoute";
import CreateUser from "../pages/CreateUser"; // Importar la página de creación de usuarios
import PropertyDetail from "../pages/PropertyDetail"; // Importar la nueva página
import CreateProperty from "../admin/CreateProperty"; // Importar el componente CreateProperty
import PropertyList from "../admin/PropertyList"; // Importar PropertyList si es necesario

const AppRouter = () => {
  return (
    <Router>
      <Routes>
        {/* Rutas públicas */}
        <Route path="/login" element={<Login />} />
        <Route path="/crear-usuario" element={<CreateUser />} />
        <Route path="/propiedades/:id" element={<PropertyDetail />} />

        {/* Rutas protegidas */}
        <Route
          path="/admin/*"
          element={
            <ProtectedRoute>
              <AdminLayout />
            </ProtectedRoute>
          }
        >
          {/* Rutas anidadas dentro de AdminLayout */}
          <Route path="create-property" element={<CreateProperty />} />
          <Route path="property-list" element={<PropertyList />} />
        </Route>
      </Routes>
    </Router>
  );
};

export default AppRouter;
