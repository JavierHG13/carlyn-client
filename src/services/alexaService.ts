import api from "./axios";

export interface AlexaLinkResponse {
  message: string;
  data: {
    alexaUserId: string;
  };
}

export const alexaService = {
  confirmLink: async (code: string): Promise<AlexaLinkResponse> => {
    const response = await api.post<AlexaLinkResponse>("/skill/link/confirm", { code });
    return response.data;
  },

  unlink: async (): Promise<{ message: string }> => {
    const response = await api.delete<{ message: string }>("/skill/link");
    return response.data;
  },
};
