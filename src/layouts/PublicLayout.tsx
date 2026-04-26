import { Outlet } from 'react-router-dom';
import { Box, Container, Paper, Stack, Typography } from '@mui/material';

export function PublicLayout() {
  return (
    <Box sx={{ minHeight: '100vh', display: 'flex', alignItems: 'center', background: 'linear-gradient(180deg, #eef7f4 0%, #f7f5ef 100%)', py: 6 }}>
      <Container maxWidth="lg">
        <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', md: '1.1fr 0.9fr' }, gap: 4, alignItems: 'center' }}>
          <Box>
            <Stack direction="row" spacing={1.5} alignItems="center" sx={{ mb: 3 }}>
              <Box component="img" src="/logo.svg" alt="" sx={{ width: 54, height: 54, objectFit: 'contain' }} />
              <Typography variant="h5" sx={{ fontWeight: 800, letterSpacing: 0 }}>
                ProHelper
              </Typography>
            </Stack>
            <Typography variant="overline" sx={{ color: 'primary.main', letterSpacing: 1.6 }}>
              ProHelper Brigades
            </Typography>
            <Typography variant="h2" sx={{ mt: 1, fontWeight: 700, maxWidth: 560 }}>
              Внешний кабинет для строительных бригад и найма на объекты.
            </Typography>
            <Typography variant="body1" sx={{ mt: 2, maxWidth: 540, color: 'text.secondary' }}>
              Бригада регистрируется один раз, заполняет профиль, управляет составом и получает приглашения от подрядчиков на проекты.
            </Typography>
          </Box>
          <Paper elevation={0} sx={{ p: 4, borderRadius: 6, border: '1px solid rgba(15, 118, 110, 0.12)' }}>
            <Outlet />
          </Paper>
        </Box>
      </Container>
    </Box>
  );
}
