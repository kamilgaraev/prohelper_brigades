import { createBrowserRouter, Navigate } from 'react-router-dom';

import { PublicLayout } from '@/layouts/PublicLayout';
import { CabinetLayout } from '@/layouts/CabinetLayout';
import { ProtectedRoute } from '@/router/guards';
import { LoginPage } from '@/pages/public/LoginPage';
import { RegisterPage } from '@/pages/public/RegisterPage';
import { RecoveryPage } from '@/pages/public/RecoveryPage';
import { OnboardingPage } from '@/pages/onboarding/OnboardingPage';
import { DashboardPage } from '@/pages/cabinet/DashboardPage';
import { ProfilePage } from '@/pages/cabinet/ProfilePage';
import { MembersPage } from '@/pages/cabinet/MembersPage';
import { DocumentsPage } from '@/pages/cabinet/DocumentsPage';
import { InvitationsPage } from '@/pages/cabinet/InvitationsPage';
import { RequestsPage } from '@/pages/cabinet/RequestsPage';
import { ResponsesPage } from '@/pages/cabinet/ResponsesPage';
import { AssignmentsPage } from '@/pages/cabinet/AssignmentsPage';

export const router = createBrowserRouter([
  {
    path: '/',
    element: <PublicLayout />,
    children: [
      { index: true, element: <Navigate to="/login" replace /> },
      { path: 'login', element: <LoginPage /> },
      { path: 'register', element: <RegisterPage /> },
      { path: 'recovery', element: <RecoveryPage /> },
    ],
  },
  {
    element: <ProtectedRoute />,
    children: [
      {
        path: '/onboarding',
        element: <OnboardingPage />,
      },
      {
        path: '/cabinet',
        element: <CabinetLayout />,
        children: [
          { index: true, element: <DashboardPage /> },
          { path: 'profile', element: <ProfilePage /> },
          { path: 'members', element: <MembersPage /> },
          { path: 'documents', element: <DocumentsPage /> },
          { path: 'invitations', element: <InvitationsPage /> },
          { path: 'requests', element: <RequestsPage /> },
          { path: 'responses', element: <ResponsesPage /> },
          { path: 'assignments', element: <AssignmentsPage /> },
        ],
      },
    ],
  },
]);
