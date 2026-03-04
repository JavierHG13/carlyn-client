
import { User, LoginCredentials, RegisterData, ApiResponse } from '../types';

// Simulamos una "base de datos" en memoria
let MOCK_USERS: User[] = [
  { id: '1', name: 'Cliente Demo', email: 'demo@barberia.com' },
];

// Helper para simular un delay de red
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

export const mockApi = {
  // --- Autenticación ---
  login: async (credentials: LoginCredentials): Promise<ApiResponse<User>> => {
    await delay(800); // Simulamos latencia

    const user = MOCK_USERS.find(u => u.email === credentials.email);
    // En un caso real, aquí validarías la contraseña. Para el mock, cualquier password sirve si el email existe.
    if (user) {
      // Guardamos en localStorage para simular una sesión
      localStorage.setItem('mockUser', JSON.stringify(user));
      return { success: true, data: user };
    } else {
      return { success: false, message: 'Credenciales inválidas' };
    }
  },

  register: async (userData: RegisterData): Promise<ApiResponse<User>> => {
    await delay(1000);

    const userExists = MOCK_USERS.find(u => u.email === userData.email);
    if (userExists) {
      return { success: false, message: 'El email ya está registrado' };
    }

    const newUser: User = {
      id: String(MOCK_USERS.length + 1),
      name: userData.name,
      email: userData.email,
    };
    MOCK_USERS.push(newUser);
    localStorage.setItem('mockUser', JSON.stringify(newUser));
    return { success: true, data: newUser, message: 'Usuario creado con éxito' };
  },

  logout: async (): Promise<ApiResponse<null>> => {
    await delay(300);
    localStorage.removeItem('mockUser');
    return { success: true };
  },

  getCurrentUser: async (): Promise<ApiResponse<User | null>> => {
    await delay(200);
    const userJson = localStorage.getItem('mockUser');
    if (userJson) {
      return { success: true, data: JSON.parse(userJson) };
    }
    return { success: true, data: null };
  },

  // --- Datos para el Home ---
  getDashboardData: async (): Promise<ApiResponse<any>> => {
    await delay(600);
    // Datos de ejemplo para el home
    return {
      success: true,
      data: {
        upcomingAppointments: [
          { id: 'a1', service: 'Corte de Cabello', barber: 'Carlos', time: '10:30 AM', date: '2024-05-20' },
          { id: 'a2', service: 'Afeitado Clásico', barber: 'Juan', time: '4:00 PM', date: '2024-05-21' },
        ],
        recentServices: [
          { id: 's1', name: 'Corte + Barba', price: '$25', date: '2024-05-10' },
          { id: 's2', name: 'Corte de Cabello', price: '$15', date: '2024-05-03' },
        ],
        popularBarbers: [
          { id: 'b1', name: 'Carlos', specialty: 'Cortes clásicos', rating: 4.9 },
          { id: 'b2', name: 'Miguel', specialty: 'Barba y bigote', rating: 4.8 },
        ]
      }
    };
  }
};