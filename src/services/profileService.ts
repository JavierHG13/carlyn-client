import api from './axios';

export interface ProfileUpdateData {
  nombre: string;
  telefono?: string;
  foto?: string;
}

export const profileService = {
  update: async (data: ProfileUpdateData) => {
    const response = await api.put('/auth/profile', data);
    return response.data.user;
  },
};
