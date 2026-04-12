import { useMemo } from 'react';
import type { PropsWithChildren } from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ThemeProvider, createTheme } from '@mui/material/styles';

import { AuthProvider } from '@/providers/AuthProvider';

export function AppProviders({ children }: PropsWithChildren) {
  const queryClient = useMemo(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            refetchOnWindowFocus: false,
            retry: 1,
            staleTime: 60_000,
          },
        },
      }),
    [],
  );

  const theme = useMemo(
    () =>
      createTheme({
        palette: {
          primary: {
            main: '#0f766e',
          },
          secondary: {
            main: '#ea580c',
          },
          background: {
            default: '#f4f7f2',
            paper: '#ffffff',
          },
        },
        shape: {
          borderRadius: 16,
        },
        typography: {
          fontFamily: '"Segoe UI", "Inter", sans-serif',
        },
      }),
    [],
  );

  return (
    <ThemeProvider theme={theme}>
      <QueryClientProvider client={queryClient}>
        <AuthProvider>{children}</AuthProvider>
      </QueryClientProvider>
    </ThemeProvider>
  );
}
