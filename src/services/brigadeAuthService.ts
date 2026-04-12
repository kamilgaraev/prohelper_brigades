import api, { setApiToken } from '@/services/api';
import type { ApiEnvelope } from '@/types/api';
import type { BrigadeAuthResponse, BrigadeAuthUser, BrigadeLoginPayload, BrigadeRegisterPayload } from '@/types/auth';

export const brigadeAuthService = {
  setToken(token: string | null) {
    setApiToken(token);
  },
  async login(payload: BrigadeLoginPayload): Promise<BrigadeAuthResponse> {
    const response = await api.post<ApiEnvelope<BrigadeAuthResponse>>('/auth/login', payload);
    return response.data.data;
  },
  async register(payload: BrigadeRegisterPayload): Promise<BrigadeAuthResponse> {
    const response = await api.post<ApiEnvelope<BrigadeAuthResponse>>('/auth/register', {
      name: payload.brigade_name,
      contact_person: payload.name,
      contact_phone: payload.phone ?? '',
      contact_email: payload.email,
      password: payload.password,
      password_confirmation: payload.password_confirmation,
    });
    return response.data.data;
  },
  async me(): Promise<BrigadeAuthUser> {
    const response = await api.get<ApiEnvelope<BrigadeAuthUser>>('/auth/me');
    return response.data.data;
  },
  async logout(): Promise<void> {
    await api.post('/auth/logout');
  },
};
