import { useEffect, useState } from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { Alert, Button, CircularProgress, Grid, MenuItem, Stack, TextField } from '@mui/material';
import { useNavigate } from 'react-router-dom';

import { BrigadeStatusChip } from '@/components/BrigadeStatusChip';
import { PageSection } from '@/components/PageSection';
import { useAuth } from '@/hooks/useAuth';
import { brigadeCabinetService } from '@/services/brigadeCabinetService';
import { getErrorMessage } from '@/services/errorUtils';
import { brigadeQueryKeys } from '@/services/brigadeQueryKeys';

type BrigadeProfileFormState = {
  name: string;
  description: string;
  team_size: string;
  contact_person: string;
  contact_phone: string;
  contact_email: string;
  availability_status: 'available' | 'partially_available' | 'busy';
  regions: string;
  specializations: string;
};

const emptyForm: BrigadeProfileFormState = {
  name: '',
  description: '',
  team_size: '',
  contact_person: '',
  contact_phone: '',
  contact_email: '',
  availability_status: 'available',
  regions: '',
  specializations: '',
};

const normalizeList = (value: string): string[] =>
  value
    .split(',')
    .map((item) => item.trim())
    .filter(Boolean);

export function BrigadeProfileForm({
  title,
  subtitle,
  redirectAfterSave,
  redirectAfterReview,
}: {
  title: string;
  subtitle: string;
  redirectAfterSave?: string;
  redirectAfterReview?: string;
}) {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { refreshProfile } = useAuth();
  const [feedback, setFeedback] = useState<{ severity: 'success' | 'error'; message: string } | null>(null);
  const [form, setForm] = useState<BrigadeProfileFormState>(emptyForm);

  const profileQuery = useQuery({
    queryKey: brigadeQueryKeys.profile,
    queryFn: () => brigadeCabinetService.getProfile(),
  });

  useEffect(() => {
    if (!profileQuery.data) {
      return;
    }

    setForm({
      name: profileQuery.data.name ?? '',
      description: profileQuery.data.description ?? '',
      team_size: profileQuery.data.team_size ? String(profileQuery.data.team_size) : '',
      contact_person: profileQuery.data.contact_person ?? '',
      contact_phone: profileQuery.data.contact_phone ?? '',
      contact_email: profileQuery.data.contact_email ?? '',
      availability_status: profileQuery.data.availability_status ?? 'available',
      regions: profileQuery.data.regions.join(', '),
      specializations: profileQuery.data.specializations.join(', '),
    });
  }, [profileQuery.data]);

  const saveMutation = useMutation({
    mutationFn: async (submitForReview: boolean) =>
      brigadeCabinetService.updateProfile({
        name: form.name.trim(),
        description: form.description.trim() || null,
        team_size: form.team_size ? Number(form.team_size) : null,
        contact_person: form.contact_person.trim(),
        contact_phone: form.contact_phone.trim(),
        contact_email: form.contact_email.trim(),
        availability_status: form.availability_status,
        regions: normalizeList(form.regions),
        specializations: normalizeList(form.specializations),
        submit_for_review: submitForReview,
      }),
    onSuccess: async (_, submitForReview) => {
      setFeedback({
        severity: 'success',
        message: submitForReview ? 'Профиль отправлен на модерацию.' : 'Профиль сохранён.',
      });
      await Promise.all([
        queryClient.invalidateQueries({ queryKey: brigadeQueryKeys.profile }),
        queryClient.invalidateQueries({ queryKey: brigadeQueryKeys.dashboard }),
      ]);
      await refreshProfile();

      if (submitForReview && redirectAfterReview) {
        navigate(redirectAfterReview);
        return;
      }

      if (!submitForReview && redirectAfterSave) {
        navigate(redirectAfterSave);
      }
    },
    onError: (error) => {
      setFeedback({
        severity: 'error',
        message: getErrorMessage(error, 'Не удалось сохранить профиль бригады.'),
      });
    },
  });

  if (profileQuery.isLoading) {
    return (
      <PageSection title={title} subtitle={subtitle}>
        <Stack alignItems="center" py={4}>
          <CircularProgress />
        </Stack>
      </PageSection>
    );
  }

  if (profileQuery.isError || !profileQuery.data) {
    return (
      <PageSection title={title} subtitle={subtitle}>
        <Alert severity="error">Не удалось загрузить профиль бригады.</Alert>
      </PageSection>
    );
  }

  return (
    <PageSection title={title} subtitle={subtitle}>
      <Stack spacing={2.5}>
        <Stack direction={{ xs: 'column', md: 'row' }} spacing={1.5} alignItems={{ xs: 'flex-start', md: 'center' }}>
          <BrigadeStatusChip kind="profile" status={profileQuery.data.verification_status} />
          <BrigadeStatusChip kind="availability" status={profileQuery.data.availability_status} />
        </Stack>

        {feedback ? <Alert severity={feedback.severity}>{feedback.message}</Alert> : null}

        <Grid container spacing={2}>
          <Grid size={{ xs: 12, md: 6 }}>
            <TextField
              fullWidth
              label="Название бригады"
              value={form.name}
              onChange={(event) => setForm((current) => ({ ...current, name: event.target.value }))}
              required
            />
          </Grid>
          <Grid size={{ xs: 12, md: 6 }}>
            <TextField
              fullWidth
              label="Контактное лицо"
              value={form.contact_person}
              onChange={(event) => setForm((current) => ({ ...current, contact_person: event.target.value }))}
              required
            />
          </Grid>
          <Grid size={{ xs: 12 }}>
            <TextField
              fullWidth
              label="Описание"
              multiline
              minRows={4}
              value={form.description}
              onChange={(event) => setForm((current) => ({ ...current, description: event.target.value }))}
            />
          </Grid>
          <Grid size={{ xs: 12, md: 4 }}>
            <TextField
              fullWidth
              label="Размер бригады"
              type="number"
              value={form.team_size}
              onChange={(event) => setForm((current) => ({ ...current, team_size: event.target.value }))}
            />
          </Grid>
          <Grid size={{ xs: 12, md: 4 }}>
            <TextField
              fullWidth
              label="Телефон"
              value={form.contact_phone}
              onChange={(event) => setForm((current) => ({ ...current, contact_phone: event.target.value }))}
              required
            />
          </Grid>
          <Grid size={{ xs: 12, md: 4 }}>
            <TextField
              fullWidth
              label="Email"
              type="email"
              value={form.contact_email}
              onChange={(event) => setForm((current) => ({ ...current, contact_email: event.target.value }))}
              required
            />
          </Grid>
          <Grid size={{ xs: 12, md: 6 }}>
            <TextField
              select
              fullWidth
              label="Доступность"
              value={form.availability_status}
              onChange={(event) =>
                setForm((current) => ({
                  ...current,
                  availability_status: event.target.value as BrigadeProfileFormState['availability_status'],
                }))
              }
            >
              <MenuItem value="available">Свободна</MenuItem>
              <MenuItem value="partially_available">Частично занята</MenuItem>
              <MenuItem value="busy">Занята</MenuItem>
            </TextField>
          </Grid>
          <Grid size={{ xs: 12, md: 6 }}>
            <TextField
              fullWidth
              label="Регионы через запятую"
              value={form.regions}
              onChange={(event) => setForm((current) => ({ ...current, regions: event.target.value }))}
            />
          </Grid>
          <Grid size={{ xs: 12 }}>
            <TextField
              fullWidth
              label="Специализации через запятую"
              value={form.specializations}
              onChange={(event) => setForm((current) => ({ ...current, specializations: event.target.value }))}
            />
          </Grid>
        </Grid>

        <Stack direction={{ xs: 'column', md: 'row' }} spacing={1.5}>
          <Button
            variant="contained"
            onClick={() => saveMutation.mutate(false)}
            disabled={saveMutation.isPending}
          >
            Сохранить профиль
          </Button>
          <Button
            variant="outlined"
            onClick={() => saveMutation.mutate(true)}
            disabled={saveMutation.isPending}
          >
            Отправить на модерацию
          </Button>
        </Stack>
      </Stack>
    </PageSection>
  );
}
