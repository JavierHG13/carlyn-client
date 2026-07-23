import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";
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
import { AdminLocales } from "./pages/admin/AdminLocales";
import { AdminHorarios } from "./pages/admin/AdminHorarios";
import { AdminPOS } from "./pages/admin/AdminPOS";
import { ProtectedRoute } from "./ProtectedRoute";
import { ProductList } from "./pages/public/productos/ProductList";
import { ProductDetail } from "./pages/public/productos/ProductDetail";
import { ServiciosPublicos } from "./pages/public/servicios/servicios";
import { ServicioDetail } from "./components/servicios/ServicioDetail";
import { AgendarCita } from "./pages/public/servicios/AgendarCita";
import { PagoCitaResultado } from "./pages/public/servicios/PagoCitaResultado";
import { Nosotros } from "./pages/public/nosotros";
import { AlexaLink } from "./pages/public/AlexaLink";
import { AlexaVincular } from "./pages/public/AlexaVincular";
import { AdminPrediccion } from './pages/admin/AdminPrediccion';
import { AdminKnowledgeProposal } from './pages/admin/AdminKnowledgeProposal';
import { BarberoDashboard } from "./pages/barbero/BarberoDashboard";


import { MisCitas } from "./pages/cliente/MisCitas";
import { MiPerfil } from "./pages/cliente/MiPerfil";
// Dentro de Routes

import './App.css'

function AppRoutes() {
  const location = useLocation();
  const state = location.state as { backgroundLocation?: typeof location } | null;
  const backgroundLocation = state?.backgroundLocation;

  return (
    <>
      <Routes location={backgroundLocation || location}>

        <Route element={<MainLayout />}>

          <Route path="/" element={<Home />} />
          <Route path="/productos" element={<ProductList />} />
          <Route path="/productos/:id" element={<ProductDetail />} />
          <Route path="/servicios" element={<ServiciosPublicos />} />
          <Route path="/servicios/:id" element={<ServicioDetail />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/verify-email" element={<VerifyEmail />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="/agendar-cita" element={<AgendarCita />} />
          <Route path="/pago/cita/resultado" element={<PagoCitaResultado />} />
          <Route path="/nostros" element={<Nosotros />} />
          <Route path="/alexa" element={<AlexaLink />} />
          <Route path="/alexa/vincular" element={<AlexaVincular />} />

          <Route element={<ProtectedRoute requiredRole="Cliente" />}>
            <Route path="/mis-citas" element={<MisCitas />} />
            <Route path="/mi-perfil" element={<MiPerfil />} />

          </Route>

          <Route element={<ProtectedRoute requiredRole="Barbero" />}>
            <Route path="/barbero" element={<BarberoDashboard />} />
          </Route>

        </Route>

        <Route element={<ProtectedRoute requiredRole="Admin" />}>
          <Route path="/admin" element={<AdminDashboard />} />
          <Route path="/admin/usuarios" element={<AdminUsers />} />
          <Route path="/admin/database" element={<AdminDatabase />} />
          <Route path="/admin/productos" element={<AdminProducts />} />
          <Route path="/admin/servicios" element={<AdminServicios />} />
          <Route path="/admin/citas" element={<AdminCitas />} />
          <Route path="/admin/barberos" element={<AdminBarberos />} />
          <Route path="/admin/locales" element={<AdminLocales />} />
          <Route path="/admin/horarios" element={<AdminHorarios />} />
          <Route path="/admin/pos" element={<AdminPOS />} />
          <Route path="/admin/prediccion" element={<AdminPrediccion />} />
          <Route path="/admin/conocimiento/:tipo" element={<AdminKnowledgeProposal />} />
        </Route>

      </Routes>

      {backgroundLocation && (
        <Routes>
          <Route path="/agendar-cita" element={<AgendarCita modal />} />
        </Routes>
      )}
    </>
  );
}

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <AppRoutes />
      </AuthProvider>
    </BrowserRouter >

  );
}

export default App;
