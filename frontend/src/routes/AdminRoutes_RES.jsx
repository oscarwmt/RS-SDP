import React from "react";
import { Route, Routes } from "react-router-dom";
import AdminLayout from "../components/AdminLayout";
import PropertyList from "../pages/PropertyList";
import UserList from "../pages/UserList";
// ...otros imports...

const AdminRoutes = () => {
  return (
    <Routes>
      <Route path="/admin" element={<AdminLayout />}>
        <Route index element={<div>Inicio</div>} />
        <Route path="propiedades" element={<PropertyList />} />
        <Route path="usuarios" element={<UserList />} />
        <Route path="otros" element={<div>Otros</div>} />
      </Route>
    </Routes>
  );
};

export default AdminRoutes;
