import api from './axios';
import type { Cita } from '../types/citas';

export interface AppointmentPaymentRequest {
  localId: number;
  barberoId: number;
  servicioId: number;
  fecha: string;
  horaInicio: string;
}

export interface AppointmentPreference {
  preferenceId: string;
  initPoint: string;
  sandboxInitPoint?: string;
  externalReference: string;
  total: number;
  depositAmount: number;
  remainingAmount: number;
  appointmentId?: number;
}

export interface AppointmentPaymentConfirmation {
  message: string;
  data: Cita;
  payment: {
    id: number;
    status: string;
    amount: number;
    externalReference: string;
  };
}

export const paymentService = {
  createAppointmentPreference: async (
    payload: AppointmentPaymentRequest
  ): Promise<AppointmentPreference> => {
    const response = await api.post('/payments/appointments/preference', payload);
    return response.data;
  },

  createExistingAppointmentPreference: async (
    appointmentId: number
  ): Promise<AppointmentPreference> => {
    const response = await api.post(`/payments/appointments/${appointmentId}/preference`);
    return response.data;
  },

  confirmAppointmentPayment: async (
    paymentId: string
  ): Promise<AppointmentPaymentConfirmation> => {
    const response = await api.post('/payments/appointments/confirm', { paymentId });
    return response.data;
  },
};
