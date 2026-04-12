import { useState } from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import {
  Alert,
  Button,
  CircularProgress,
  FormControlLabel,
  Grid,
  Paper,
  Stack,
  Switch,
  TextField,
  Typography,
} from '@mui/material';

import { PageSection } from '@/components/PageSection';
import { brigadeCabinetService } from '@/services/brigadeCabinetService';
import { getErrorMessage } from '@/services/errorUtils';
import { brigadeQueryKeys } from '@/services/brigadeQueryKeys';

type MemberFormState = {
  full_name: string;
  role: string;
  phone: string;
  is_manager: boolean;
  is_active: boolean;
};

const emptyForm: MemberFormState = {
  full_name: '',
  role: '',
  phone: '',
  is_manager: false,
  is_active: true,
};

export function MembersPage() {
  const queryClient = useQueryClient();
  const [editingMemberId, setEditingMemberId] = useState<number | null>(null);
  const [form, setForm] = useState<MemberFormState>(emptyForm);
  const [feedback, setFeedback] = useState<{ severity: 'success' | 'error'; message: string } | null>(null);

  const membersQuery = useQuery({
    queryKey: brigadeQueryKeys.members,
    queryFn: () => brigadeCabinetService.getMembers(),
  });

  const saveMutation = useMutation({
    mutationFn: async () => {
      const payload = {
        full_name: form.full_name.trim(),
        role: form.role.trim(),
        phone: form.phone.trim() || undefined,
        is_manager: form.is_manager,
        is_active: form.is_active,
      };

      if (editingMemberId) {
        await brigadeCabinetService.updateMember(editingMemberId, payload);
        return;
      }

      await brigadeCabinetService.createMember(payload);
    },
    onSuccess: async () => {
      setFeedback({
        severity: 'success',
        message: editingMemberId ? 'Участник обновлён.' : 'Участник добавлен.',
      });
      setEditingMemberId(null);
      setForm(emptyForm);
      await queryClient.invalidateQueries({ queryKey: brigadeQueryKeys.members });
    },
    onError: (error) => {
      setFeedback({
        severity: 'error',
        message: getErrorMessage(error, 'Не удалось сохранить участника бригады.'),
      });
    },
  });

  const deleteMutation = useMutation({
    mutationFn: (memberId: number) => brigadeCabinetService.deleteMember(memberId),
    onSuccess: async () => {
      setFeedback({ severity: 'success', message: 'Участник удалён.' });
      if (editingMemberId) {
        setEditingMemberId(null);
        setForm(emptyForm);
      }
      await queryClient.invalidateQueries({ queryKey: brigadeQueryKeys.members });
    },
    onError: (error) => {
      setFeedback({
        severity: 'error',
        message: getErrorMessage(error, 'Не удалось удалить участника бригады.'),
      });
    },
  });

  const handleEdit = (member: Awaited<ReturnType<typeof brigadeCabinetService.getMembers>>[number]) => {
    setEditingMemberId(member.id);
    setForm({
      full_name: member.full_name,
      role: member.role,
      phone: member.phone ?? '',
      is_manager: member.is_manager,
      is_active: member.is_active,
    });
    setFeedback(null);
  };

  return (
    <Stack spacing={3}>
      <PageSection title="Состав бригады" subtitle="Добавляйте участников, отмечайте менеджеров и держите команду в актуальном состоянии.">
        <Stack spacing={2.5}>
          {feedback ? <Alert severity={feedback.severity}>{feedback.message}</Alert> : null}
          <Grid container spacing={2}>
            <Grid size={{ xs: 12, md: 6 }}>
              <TextField
                fullWidth
                label="ФИО"
                value={form.full_name}
                onChange={(event) => setForm((current) => ({ ...current, full_name: event.target.value }))}
              />
            </Grid>
            <Grid size={{ xs: 12, md: 6 }}>
              <TextField
                fullWidth
                label="Роль"
                value={form.role}
                onChange={(event) => setForm((current) => ({ ...current, role: event.target.value }))}
              />
            </Grid>
            <Grid size={{ xs: 12, md: 6 }}>
              <TextField
                fullWidth
                label="Телефон"
                value={form.phone}
                onChange={(event) => setForm((current) => ({ ...current, phone: event.target.value }))}
              />
            </Grid>
            <Grid size={{ xs: 12, md: 6 }}>
              <Stack direction={{ xs: 'column', md: 'row' }} spacing={1}>
                <FormControlLabel
                  control={
                    <Switch
                      checked={form.is_manager}
                      onChange={(event) => setForm((current) => ({ ...current, is_manager: event.target.checked }))}
                    />
                  }
                  label="Менеджер бригады"
                />
                <FormControlLabel
                  control={
                    <Switch
                      checked={form.is_active}
                      onChange={(event) => setForm((current) => ({ ...current, is_active: event.target.checked }))}
                    />
                  }
                  label="Активен"
                />
              </Stack>
            </Grid>
          </Grid>

          <Stack direction={{ xs: 'column', md: 'row' }} spacing={1.5}>
            <Button variant="contained" onClick={() => saveMutation.mutate()} disabled={saveMutation.isPending}>
              {editingMemberId ? 'Сохранить изменения' : 'Добавить участника'}
            </Button>
            {editingMemberId ? (
              <Button
                variant="outlined"
                onClick={() => {
                  setEditingMemberId(null);
                  setForm(emptyForm);
                  setFeedback(null);
                }}
              >
                Отменить редактирование
              </Button>
            ) : null}
          </Stack>
        </Stack>
      </PageSection>

      <PageSection title="Команда" subtitle="Список участников, который можно быстро обновить перед отправкой профиля заказчикам.">
        {membersQuery.isLoading ? (
          <Stack alignItems="center" py={4}>
            <CircularProgress />
          </Stack>
        ) : membersQuery.isError ? (
          <Alert severity="error">Не удалось загрузить состав бригады.</Alert>
        ) : !membersQuery.data?.length ? (
          <Alert severity="info">Состав пока пуст. Добавьте хотя бы бригадира или менеджера.</Alert>
        ) : (
          <Grid container spacing={2}>
            {membersQuery.data.map((member) => (
              <Grid key={member.id} size={{ xs: 12, md: 6 }}>
                <Paper elevation={0} sx={{ p: 2.5, borderRadius: 4, border: '1px solid rgba(15, 118, 110, 0.12)' }}>
                  <Stack spacing={1.5}>
                    <div>
                      <Typography variant="h6">{member.full_name}</Typography>
                      <Typography color="text.secondary">
                        {member.role}
                        {member.phone ? ` • ${member.phone}` : ''}
                      </Typography>
                    </div>
                    <Typography variant="body2" color="text.secondary">
                      {member.is_manager ? 'Менеджер бригады' : 'Участник команды'} • {member.is_active ? 'Активен' : 'Неактивен'}
                    </Typography>
                    <Stack direction="row" spacing={1.5}>
                      <Button variant="outlined" onClick={() => handleEdit(member)}>
                        Редактировать
                      </Button>
                      <Button color="error" onClick={() => deleteMutation.mutate(member.id)} disabled={deleteMutation.isPending}>
                        Удалить
                      </Button>
                    </Stack>
                  </Stack>
                </Paper>
              </Grid>
            ))}
          </Grid>
        )}
      </PageSection>
    </Stack>
  );
}
