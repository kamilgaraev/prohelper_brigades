import { useState } from 'react';
import type { FormEvent } from 'react';
import { Alert, Button, Stack, TextField, Typography } from '@mui/material';
import { Link as RouterLink, useNavigate } from 'react-router-dom';

import { useAuth } from '@/hooks/useAuth';
import { getErrorMessage } from '@/services/errorUtils';

export function LoginPage() {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();

    try {
      setError(null);
      await login({ email, password });
      navigate('/cabinet');
    } catch (submitError) {
      setError(getErrorMessage(submitError, 'Не удалось выполнить вход.'));
    }
  };

  return (
    <Stack component="form" spacing={2.5} onSubmit={handleSubmit}>
      <div>
        <Typography variant="h4" sx={{ fontWeight: 700 }}>
          Вход для бригады
        </Typography>
        <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
          Войдите, чтобы управлять профилем, составом и приглашениями на объекты.
        </Typography>
      </div>
      {error ? <Alert severity="error">{error}</Alert> : null}
      <TextField label="Email" type="email" value={email} onChange={(event) => setEmail(event.target.value)} required />
      <TextField label="Пароль" type="password" value={password} onChange={(event) => setPassword(event.target.value)} required />
      <Button type="submit" variant="contained" size="large">
        Войти
      </Button>
      <Button component={RouterLink} to="/register">
        Создать кабинет бригады
      </Button>
      <Button component={RouterLink} to="/recovery">
        Не помню пароль
      </Button>
    </Stack>
  );
}
