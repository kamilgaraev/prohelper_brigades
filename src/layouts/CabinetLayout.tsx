import { AppBar, Box, Button, Chip, Container, Stack, Toolbar, Typography } from '@mui/material';
import { NavLink, Outlet } from 'react-router-dom';

import { useAuth } from '@/hooks/useAuth';
import { getBrigadeStatusLabel } from '@/components/BrigadeStatusChip';

const links = [
  { to: '/cabinet', label: 'Обзор' },
  { to: '/cabinet/profile', label: 'Профиль' },
  { to: '/cabinet/members', label: 'Состав' },
  { to: '/cabinet/documents', label: 'Документы' },
  { to: '/cabinet/invitations', label: 'Приглашения' },
  { to: '/cabinet/requests', label: 'Запросы' },
  { to: '/cabinet/responses', label: 'Отклики' },
  { to: '/cabinet/assignments', label: 'Назначения' },
];

export function CabinetLayout() {
  const { logout, user } = useAuth();

  return (
    <Box sx={{ minHeight: '100vh', backgroundColor: 'background.default' }}>
      <AppBar position="sticky" color="inherit" elevation={0} sx={{ borderBottom: '1px solid rgba(15, 118, 110, 0.12)' }}>
        <Toolbar sx={{ justifyContent: 'space-between', gap: 2 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
            <Box component="img" src="/logo.svg" alt="" sx={{ width: 44, height: 44, objectFit: 'contain' }} />
            <Box>
            <Typography variant="h6" sx={{ fontWeight: 700 }}>
              ProHelper Brigades
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Кабинет бригады
            </Typography>
            </Box>
          </Box>
          <Stack direction="row" spacing={1.5} alignItems="center">
            <Chip label={getBrigadeStatusLabel('profile', user?.verification_status ?? 'draft')} color="primary" variant="outlined" />
            <Button variant="outlined" onClick={() => void logout()}>
              Выйти
            </Button>
          </Stack>
        </Toolbar>
      </AppBar>
      <Container maxWidth="xl" sx={{ py: 4 }}>
        <Stack direction={{ xs: 'column', md: 'row' }} spacing={4} alignItems="flex-start">
          <Box sx={{ minWidth: { md: 240 }, width: { xs: '100%', md: 240 }, p: 2, borderRadius: 4, backgroundColor: 'background.paper', border: '1px solid rgba(15, 118, 110, 0.12)' }}>
            <Stack spacing={1}>
              {links.map((link) => (
                <Button
                  key={link.to}
                  component={NavLink}
                  to={link.to}
                  sx={{ justifyContent: 'flex-start' }}
                >
                  {link.label}
                </Button>
              ))}
            </Stack>
          </Box>
          <Box sx={{ flex: 1, width: '100%' }}>
            <Outlet />
          </Box>
        </Stack>
      </Container>
    </Box>
  );
}
