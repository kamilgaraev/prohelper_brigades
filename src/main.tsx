import React from 'react';
import ReactDOM from 'react-dom/client';
import { CssBaseline } from '@mui/material';
import { RouterProvider } from 'react-router-dom';

import { router } from '@/router';
import { AppProviders } from '@/providers/AppProviders';
import '@/styles/global.css';

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
  <React.StrictMode>
    <AppProviders>
      <CssBaseline />
      <RouterProvider router={router} />
    </AppProviders>
  </React.StrictMode>,
);
