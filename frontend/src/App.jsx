// src/App.jsx
import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import Login from "./pages/Login";
import AdminLayout from "./admin/AdminLayout";
import PropertyList from "./admin/PropertyList";
import CreateProperty from "./admin/CreateProperty";
import UserManager from "./admin/components/UserManager";
import Dashboard from "./admin/components/Dashboard";
import PrivateRoute from "./components/PrivateRoute";
import EditPropertyForm from "./admin/EditPropertyForm";
import SearchResults from "./pages/SearchResults";
import PropertyDetail from "./pages/PropertyDetail";
import Contacto from "./pages/Contacto";

const App = () => {
  return (
    <BrowserRouter>
      <Routes>
        {/* Rutas públicas */}
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/admin/login" element={<Login />} />
        <Route path="/resultados" element={<SearchResults />} />
        <Route path="/propiedades/:id" element={<PropertyDetail />} />
        <Route path="/contacto" element={<Contacto />} />

        {/* Rutas protegidas (Administración) */}
        <Route
          path="/admin"
          element={
            <PrivateRoute>
              <AdminLayout />
            </PrivateRoute>
          }
        >
          {/* Rutas anidadas bajo /admin */}
          <Route index element={<Dashboard />} />
          <Route path="usuarios" element={<UserManager />} />
          <Route path="propiedades" element={<PropertyList />} />
          <Route path="propiedades/new" element={<CreateProperty />} />
          <Route path="create-property" element={<CreateProperty />} />
          <Route path="editar-propiedad/:id" element={<EditPropertyForm />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
};

export default App;
