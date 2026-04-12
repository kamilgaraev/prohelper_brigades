import { Button, Stack, TextField, Typography } from '@mui/material';

export function RecoveryPage() {
  return (
    <Stack spacing={2.5}>
      <div>
        <Typography variant="h4" sx={{ fontWeight: 700 }}>
          Восстановление доступа
        </Typography>
        <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
          Экран уже готов для маршрута восстановления. Подключение почтового сценария добавим следующим этапом на едином backend.
        </Typography>
      </div>
      <TextField label="Email" type="email" />
      <Button variant="contained" size="large" disabled>
        Отправить инструкцию
      </Button>
    </Stack>
  );
}
