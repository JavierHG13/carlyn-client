import { createContext, useContext, useState, useEffect } from "react";
import type { ReactNode } from "react";
import { useNavigate } from "react-router-dom";
import api from "../services/axios";

type UserRole = "Admin" | "Barbero" | "Cliente";

interface User {
    id: number;
    nombre: string;
    email: string;
    telefono?: string;
    rol_id: number;
    rol: UserRole; 
    foto?: string | null;
    activo: boolean;
    created_at: string;
    updated_at: string;
}

interface RegisterData {
    nombreCompleto: string;
    correoElectronico: string;
    telefono?: string;
    contrasena: string;
}

interface VerifyEmailData {
    correoElectronico: string;
    code: string;
}

interface AuthContextValue {
    user: User | null;
    loading: boolean;
    login: (credentials: { correoElectronico: string; contrasena: string }) => Promise<void>;
    loginOAuth: (accessToken: string) => Promise<void>;
    logout: () => void;
    isAuthenticated: boolean;
    errors?: string;
    hasRole: (requiredRole: UserRole) => boolean;
    updateUser: (updatedUser: User) => void;
    register: (data: RegisterData) => Promise<void>;
    verifyEmail: (data: VerifyEmailData) => Promise<void>;
    resendCode: (correoElectronico: string) => Promise<void>;
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const [user, setUser] = useState<User | null>(null);
    const [loading, setLoading] = useState<boolean>(true);
    const [errors, setErrors] = useState<string | undefined>(undefined);
    const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
    const navigate = useNavigate();

    //Verificar sesión al cargar app
    useEffect(() => {
        const checkAuth = async () => {
            try {
                const token = localStorage.getItem("jwt");

                if (!token) {
                    setLoading(false);
                    return;
                }

                const response = await api.get("/auth/profile");

                console.log("Obteniendo autenticacion")
                console.log("Perfil obtenido", response.data)

                setUser(response.data.user);
                setIsAuthenticated(true);
            } catch {
                setUser(null);
                setIsAuthenticated(false);
            } finally {
                setLoading(false);
            }
        };

        checkAuth();
    }, []);

    // 🔐 Login normal
    const login = async (credentials: { correoElectronico: string; contrasena: string }) => {
        setLoading(true);
        setErrors(undefined);

        try {
            const response = await api.post("/auth/login", credentials);
            const { token, user } = response.data;

            localStorage.setItem("jwt", token);

            console.log()
            setUser(user);
            setIsAuthenticated(true);

            // Redirección según rol
            navigate(user.rol === "Admin" ? "/admin" : "/inicio");

        } catch (err: any) {
            setIsAuthenticated(false);
            setErrors(err.response?.data?.message || "Credenciales incorrectas");
        } finally {
            setLoading(false);
        }
    };

    // 🔐 Login con Google
    const loginOAuth = async (credential: string) => {
        setLoading(true);
        setErrors(undefined);

        try {
            const response = await api.post("/auth/google", { googleToken: credential });
            const { token, user } = response.data;

            localStorage.setItem("jwt", token);

            console.log("User del backend", user)
            setUser(user);
            setIsAuthenticated(true);

            navigate(user.rol === "Admin" ? "/admin" : "/inicio");

        } catch (err: any) {
            setIsAuthenticated(false);
            setErrors(err.response?.data?.message || "Error al iniciar sesión con Google");
        } finally {
            setLoading(false);
        }
    };

    // 📝 Registro
    const register = async (data: RegisterData) => {
        setLoading(true);
        setErrors(undefined);

        try {
            await api.post("/auth/register", data);
            navigate("/verify-email", { state: { correoElectronico: data.correoElectronico } });
        } catch (err: any) {
            setErrors(err.response?.data?.message || "Error al registrarse");
        } finally {
            setLoading(false);
        }
    };

    // 📧 Verificar correo
    const verifyEmail = async (data: VerifyEmailData) => {
        setLoading(true);
        setErrors(undefined);

        try {
            await api.post("/auth/verify-email", data);
            navigate("/login", { state: { verified: true } });
        } catch (err: any) {
            setErrors(err.response?.data?.message || "Código incorrecto o expirado");
            throw err;
        } finally {
            setLoading(false);
        }
    };

    // 🔁 Reenviar código
    const resendCode = async (correoElectronico: string) => {
        try {
            await api.post("/auth/resend-code", { correoElectronico });
        } catch (err: any) {
            setErrors(err.response?.data?.message || "Error al reenviar el código");
            throw err;
        }
    };

    // 🚪 Logout
    const logout = () => {
        localStorage.removeItem("jwt");
        setUser(null);
        setIsAuthenticated(false);
        navigate("/login");
    };

    // 🎭 Validar rol
    const hasRole = (requiredRole: UserRole) => {
        return user?.rol === requiredRole;
    };

    // 🔄 Actualizar usuario
    const updateUser = (updatedUser: User) => {
        setUser(updatedUser);
    };

    // 🧹 Limpiar errores después de 5s
    useEffect(() => {
        if (!errors) return;
        const timer = setTimeout(() => setErrors(undefined), 5000);
        return () => clearTimeout(timer);
    }, [errors]);

    return (
        <AuthContext.Provider
            value={{
                user,
                loading,
                login,
                loginOAuth,
                logout,
                hasRole,
                errors,
                isAuthenticated,
                updateUser,
                register,
                verifyEmail,
                resendCode
            }}
        >
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = (): AuthContextValue => {
    const context = useContext(AuthContext);
    if (!context) throw new Error("useAuth debe usarse dentro de un AuthProvider");
    return context;
};