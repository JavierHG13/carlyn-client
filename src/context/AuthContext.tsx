import { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { useNavigate } from "react-router-dom";
import api from "../services/axios";

type UserRole = "Cliente" | "Admin" | "Empleado" | "Propietario";

const ROLE_MAP: Record<number, UserRole> = {
    1: "Admin",
    2: "Cliente",
    3: "Empleado",
    4: "Propietario",
};

interface User {
    id: string;
    nombre_completo: string;
    correo_electronico: string;
    telefono?: string;
    id_rol: number;
    rol?: UserRole; // derivado del id_rol
}

// Agregar a AuthContextValue
interface AuthContextValue {
    user: User | null;
    loading: boolean;
    login: (credentials: { correo_electronico: string; contrasena: string }) => Promise<void>;
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

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const [user, setUser] = useState<User | null>(null);
    const [loading, setLoading] = useState<boolean>(true);
    const [errors, setErrors] = useState<string | undefined>(undefined);
    const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
    const navigate = useNavigate();

    // Enriquecer usuario con rol legible
    const enrichUser = (userData: User): User => ({
        ...userData,
        rol: ROLE_MAP[userData.id_rol],
    });

    // Verificar autenticación al cargar la aplicación
    useEffect(() => {
        const checkAuth = async () => {
            try {
                const token = localStorage.getItem("jwt");
                if (!token) return;

                const response = await api.get("/auth/profile"); // ✅ corregido
                setUser(enrichUser(response.data));
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

    // Función para iniciar sesión
    const login = async (credentials: { correo_electronico: string; contrasena: string }): Promise<void> => {
        setLoading(true);
        try {
            const response = await api.post("/auth/login", credentials);
            const { token, user } = response.data; // ✅ faltaba esto

            localStorage.setItem("jwt", token);
            const enriched = enrichUser(user);
            setUser(enriched);
            setIsAuthenticated(true);

            navigate(enriched.rol === "Admin" ? "/dashboard" : "/inicio");
        } catch (err: any) {
            setIsAuthenticated(false);
            setErrors(err.response?.data?.message || "Credenciales incorrectas");
        } finally {
            setLoading(false);
        }
    };

    // Función para iniciar sesión con Google
    const loginOAuth = async (credential: string): Promise<void> => {
        setLoading(true);
        try {
            const response = await api.post("/auth/google", { googleToken: credential }); // ✅ corregido
            const { token, user } = response.data;

            localStorage.setItem("jwt", token);
            const enriched = enrichUser(user);
            setUser(enriched);
            setIsAuthenticated(true);

            navigate(enriched.rol === "Cliente" ? "/inicio" : "/dashboard");
        } catch (err: any) {
            setIsAuthenticated(false);
            setErrors(err.response?.data?.message || "Error al iniciar sesión con Google");
        } finally {
            setLoading(false);
        }
    };

    const register = async (data: RegisterData): Promise<void> => {
        setLoading(true);
        try {
            await api.post("/auth/register", data);
            navigate("/verify-email", { state: { correoElectronico: data.correoElectronico } });
        } catch (err: any) {
            setErrors(err.response?.data?.message || "Error al registrarse");
        } finally {
            setLoading(false);
        }
    };

    const verifyEmail = async (data: VerifyEmailData): Promise<void> => {
        setLoading(true);
        try {
            await api.post("/auth/verify-email", data);
            navigate("/login", { state: { verified: true } }); // para mostrar mensaje de éxito en login
        } catch (err: any) {
            setErrors(err.response?.data?.message || "Código incorrecto o expirado");
            throw err; // re-throw para que la vista pueda resetear los inputs
        } finally {
            setLoading(false);
        }
    };

    const resendCode = async (correoElectronico: string): Promise<void> => {
        try {
            await api.post("/auth/resend-code", { correoElectronico });
        } catch (err: any) {
            setErrors(err.response?.data?.message || "Error al reenviar el código");
            throw err;
        }
    };

    // Función para cerrar sesión
    const logout = (): void => {
        localStorage.removeItem("jwt");
        setUser(null);
        setIsAuthenticated(false);
        navigate("/login");
    };

    // Verificar rol
    const hasRole = (requiredRole: UserRole): boolean => {
        return user?.rol === requiredRole; // ✅ usa el rol enriquecido
    };

    const updateUser = (updatedUser: User) => setUser(enrichUser(updatedUser));

    // Limpiar errores después de 5 segundos
    useEffect(() => {
        if (!errors) return;
        const timer = setTimeout(() => setErrors(undefined), 5000);
        return () => clearTimeout(timer);
    }, [errors]);

    return (
        <AuthContext.Provider
            value={{ user, loading, login, loginOAuth, logout, hasRole, errors, isAuthenticated, updateUser, register, verifyEmail, resendCode }}
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