import { BrowserRouter, Routes, Route } from "react-router-dom";
import MainLayout from "./layouts/MainLayout";

import { Home } from "./pages/public/Home";
import { Login } from "./pages/auth/Login";
import { Register } from "./pages/auth/Register";
import { AuthProvider } from "./context/AuthContext";
import { VerifyEmail } from "./pages/auth/VerifyEmail";
import { AdminDashboard } from "./pages/admin/AdminDashboard";
import { AdminUsers } from "./pages/admin/AdminUsers";

function App() {
  return (

    <BrowserRouter>
      <AuthProvider>
        <Routes>

          <Route element={<MainLayout />}>

            <Route path="/" element={<Home />} />
            <Route path="/home" element={<Home />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/verify-email" element={<VerifyEmail />} />
            <Route path="/admin" element={<AdminDashboard />} /> 
             <Route path="/admin/usuarios" element={<AdminUsers />} />

          </Route>

        </Routes>
      </AuthProvider>
    </BrowserRouter >

  );
}

export default App;