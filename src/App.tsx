import { BrowserRouter, Routes, Route } from "react-router-dom";
import MainLayout from "./layouts/MainLayout";

import { Home } from "./pages/public/Home";
import { Login } from "./pages/auth/Login";
import { Register } from "./pages/auth/Register";
import { AuthProvider } from "./context/AuthContext";
import { VerifyEmail } from "./pages/auth/VerifyEmail";
import { ForgotPassword } from "./pages/auth/ForgotPassword";
import { AdminDashboard } from "./pages/admin/AdminDashboard";
import { AdminUsers } from "./pages/admin/AdminUsers";
import { AdminDatabase } from "./pages/admin/AdminDatabase";
import { AdminProducts } from "./pages/admin/AdminProducts";
import { AdminBarberos } from "./pages/admin/AdminBarberos";
import { AdminServicios } from "./pages/admin/AdminServicios";
import { AdminCitas } from "./pages/admin/AdminCitas";
import { ProtectedRoute } from "./ProtectedRoute";
import { ProductList } from "./pages/public/productos/ProductList";
import { ProductDetail } from "./pages/public/productos/ProductDetail";
import { ServiciosPublicos } from "./pages/public/servicios/servicios";
import { AgendarCita } from "./pages/public/servicios/AgendarCita";
import { Nosotros } from "./pages/public/nosotros";
import { AdminPrediccion } from './pages/admin/AdminPrediccion';


import { MisCitas } from "./pages/cliente/MisCitas";
// Dentro de Routes

import './App.css'

function App() {
  return (

    <BrowserRouter>
      <AuthProvider>

        <Routes>

          <Route element={<MainLayout />}>

            <Route path="/" element={<Home />} />
            <Route path="/productos" element={<ProductList />} />
            <Route path="/productos/:id" element={<ProductDetail />} />
            <Route path="/servicios" element={<ServiciosPublicos />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/verify-email" element={<VerifyEmail />} />
            <Route path="/forgot-password" element={<ForgotPassword />} />
            <Route path="/agendar-cita" element={<AgendarCita />} />
            <Route path="/nostros" element={<Nosotros />} />


            <Route element={<ProtectedRoute requiredRole="Admin" />}>
              <Route path="/admin" element={<AdminDashboard />} />
              <Route path="/admin/usuarios" element={<AdminUsers />} />
              <Route path="/admin/database" element={<AdminDatabase />} />
              <Route path="/admin/productos" element={<AdminProducts />} />
              <Route path="/admin/servicios" element={<AdminServicios />} />
              <Route path="/admin/citas" element={<AdminCitas />} />
              <Route path="/admin/barberos" element={<AdminBarberos />} />
              <Route path="/admin/prediccion" element={<AdminPrediccion />} />


            </Route>

            <Route element={<ProtectedRoute requiredRole="Cliente" />}>
              <Route path="/mis-citas" element={<MisCitas />} />

            </Route>

          </Route>

        </Routes>
      </AuthProvider>
    </BrowserRouter >

  );
}

export default App;