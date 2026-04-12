import { AxiosError } from 'axios';

type ApiValidationErrors = Record<string, string[]>;

type ApiErrorResponse = {
  message?: string | null;
  errors?: ApiValidationErrors;
};

export function getErrorMessage(error: unknown, fallback: string): string {
  if (error instanceof AxiosError) {
    const payload = error.response?.data as ApiErrorResponse | undefined;

    if (payload?.message) {
      return payload.message;
    }

    const firstValidationError = payload?.errors ? Object.values(payload.errors)[0]?.[0] : null;

    if (firstValidationError) {
      return firstValidationError;
    }
  }

  if (error instanceof Error && error.message) {
    return error.message;
  }

  return fallback;
}
