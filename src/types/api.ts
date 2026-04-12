export type ApiEnvelope<T> = {
  success: boolean;
  message: string | null;
  data: T;
};
