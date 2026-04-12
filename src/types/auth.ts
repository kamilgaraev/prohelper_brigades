import type { BrigadeProfile } from '@/types/brigades';

export type BrigadeAuthUser = BrigadeProfile;

export type BrigadeLoginPayload = {
  email: string;
  password: string;
};

export type BrigadeRegisterPayload = {
  name: string;
  email: string;
  phone?: string;
  password: string;
  password_confirmation: string;
  brigade_name: string;
};

export type BrigadeAuthResponse = {
  token: string;
  brigade: BrigadeAuthUser;
};
