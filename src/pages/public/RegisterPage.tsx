import { useState } from 'react';
import type { FormEvent } from 'react';
import { Alert, Button, Stack, TextField, Typography } from '@mui/material';
import { useNavigate } from 'react-router-dom';

import { useAuth } from '@/hooks/useAuth';
import { getErrorMessage } from '@/services/errorUtils';

export function RegisterPage() {
  const navigate = useNavigate();
  const { register } = useAuth();
  const [error, setError] = useState<string | null>(null);
  const [form, setForm] = useState({
    name: '',
    email: '',
    phone: '',
    brigade_name: '',
    password: '',
    password_confirmation: '',
  });

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();

    try {
      setError(null);
      await register(form);
      navigate('/onboarding');
    } catch (submitError) {
      setError(getErrorMessage(submitError, 'Не удалось создать кабинет бригады.'));
    }
  };

  return (
    <Stack component="form" spacing={2.5} onSubmit={handleSubmit}>
      <div>
        <Typography variant="h4" sx={{ fontWeight: 700 }}>
          Регистрация бригады
        </Typography>
        <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
          Создайте кабинет бригады, чтобы заполнить профиль, пройти модерацию и начать получать приглашения на объекты.
        </Typography>
      </div>
      {error ? <Alert severity="error">{error}</Alert> : null}
      <TextField label="Контактное лицо" value={form.name} onChange={(event) => setForm((current) => ({ ...current, name: event.target.value }))} required />
      <TextField label="Название бригады" value={form.brigade_name} onChange={(event) => setForm((current) => ({ ...current, brigade_name: event.target.value }))} required />
      <TextField label="Email" type="email" value={form.email} onChange={(event) => setForm((current) => ({ ...current, email: event.target.value }))} required />
      <TextField label="Телефон" value={form.phone} onChange={(event) => setForm((current) => ({ ...current, phone: event.target.value }))} required />
      <TextField label="Пароль" type="password" value={form.password} onChange={(event) => setForm((current) => ({ ...current, password: event.target.value }))} required />
      <TextField
        label="Подтверждение пароля"
        type="password"
        value={form.password_confirmation}
        onChange={(event) => setForm((current) => ({ ...current, password_confirmation: event.target.value }))}
        required
      />
      <Button type="submit" variant="contained" size="large">
        Создать кабинет
      </Button>
    </Stack>
  );
}
