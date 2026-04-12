import { useMemo } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Alert, Button, CircularProgress, Grid, Paper, Stack, Typography } from '@mui/material';
import { useNavigate } from 'react-router-dom';

import { BrigadeStatusChip } from '@/components/BrigadeStatusChip';
import { PageSection } from '@/components/PageSection';
import { brigadeCabinetService } from '@/services/brigadeCabinetService';
import { brigadeQueryKeys } from '@/services/brigadeQueryKeys';

const formatDate = (value?: string | null) =>
  value
    ? new Intl.DateTimeFormat('ru-RU', {
        day: '2-digit',
        month: 'long',
        year: 'numeric',
      }).format(new Date(value))
    : 'Не указана';

export function DashboardPage() {
  const navigate = useNavigate();
  const profileQuery = useQuery({
    queryKey: brigadeQueryKeys.profile,
    queryFn: () => brigadeCabinetService.getProfile(),
  });
  const invitationsQuery = useQuery({
    queryKey: brigadeQueryKeys.invitations,
    queryFn: () => brigadeCabinetService.getInvitations(),
  });
  const requestsQuery = useQuery({
    queryKey: brigadeQueryKeys.requests,
    queryFn: () => brigadeCabinetService.getRequests(),
  });
  const responsesQuery = useQuery({
    queryKey: brigadeQueryKeys.responses,
    queryFn: () => brigadeCabinetService.getResponses(),
  });
  const assignmentsQuery = useQuery({
    queryKey: brigadeQueryKeys.assignments,
    queryFn: () => brigadeCabinetService.getAssignments(),
  });

  const isLoading =
    profileQuery.isLoading ||
    invitationsQuery.isLoading ||
    requestsQuery.isLoading ||
    responsesQuery.isLoading ||
    assignmentsQuery.isLoading;

  const hasError =
    profileQuery.isError ||
    invitationsQuery.isError ||
    requestsQuery.isError ||
    responsesQuery.isError ||
    assignmentsQuery.isError;

  const stats = useMemo(() => {
    const invitations = invitationsQuery.data ?? [];
    const requests = requestsQuery.data ?? [];
    const responses = responsesQuery.data ?? [];
    const assignments = assignmentsQuery.data ?? [];

    return [
      {
        label: 'Входящие приглашения',
        value: invitations.filter((item) => item.status === 'pending').length,
      },
      {
        label: 'Доступные запросы',
        value: requests.filter((item) => item.status === 'open').length,
      },
      {
        label: 'Мои отклики',
        value: responses.length,
      },
      {
        label: 'Активные назначения',
        value: assignments.filter((item) => ['planned', 'active'].includes(item.status)).length,
      },
    ];
  }, [assignmentsQuery.data, invitationsQuery.data, requestsQuery.data, responsesQuery.data]);

  if (isLoading) {
    return (
      <PageSection title="Обзор кабинета" subtitle="Собираем ваши данные и активные сценарии найма.">
        <Stack alignItems="center" py={4}>
          <CircularProgress />
        </Stack>
      </PageSection>
    );
  }

  if (hasError || !profileQuery.data) {
    return (
      <PageSection title="Обзор кабинета" subtitle="Сводка по профилю, приглашениям и назначениям.">
        <Alert severity="error">Не удалось загрузить обзор кабинета бригады.</Alert>
      </PageSection>
    );
  }

  const nextInvitation = (invitationsQuery.data ?? []).find((item) => item.status === 'pending');
  const nextAssignment = (assignmentsQuery.data ?? []).find((item) => item.status === 'active') ?? (assignmentsQuery.data ?? [])[0];

  return (
    <Stack spacing={3}>
      <PageSection title="Обзор кабинета" subtitle="Ключевые показатели и быстрые переходы по рабочим сценариям.">
        <Stack spacing={3}>
          <Stack direction={{ xs: 'column', md: 'row' }} spacing={1.5} alignItems={{ xs: 'flex-start', md: 'center' }}>
            <BrigadeStatusChip kind="profile" status={profileQuery.data.verification_status} />
            <BrigadeStatusChip kind="availability" status={profileQuery.data.availability_status} />
            <Typography color="text.secondary">
              {profileQuery.data.name} • {profileQuery.data.team_size ? `${profileQuery.data.team_size} чел.` : 'Размер не указан'}
            </Typography>
          </Stack>

          <Grid container spacing={2}>
            {stats.map((item) => (
              <Grid key={item.label} size={{ xs: 12, sm: 6, lg: 3 }}>
                <Paper elevation={0} sx={{ p: 2.5, borderRadius: 4, border: '1px solid rgba(15, 118, 110, 0.12)' }}>
                  <Typography variant="body2" color="text.secondary">
                    {item.label}
                  </Typography>
                  <Typography variant="h4" sx={{ mt: 1, fontWeight: 700 }}>
                    {item.value}
                  </Typography>
                </Paper>
              </Grid>
            ))}
          </Grid>

          <Stack direction={{ xs: 'column', md: 'row' }} spacing={1.5}>
            <Button variant="contained" onClick={() => navigate('/cabinet/invitations')}>
              Открыть приглашения
            </Button>
            <Button variant="outlined" onClick={() => navigate('/cabinet/requests')}>
              Смотреть запросы
            </Button>
            <Button variant="outlined" onClick={() => navigate('/cabinet/profile')}>
              Обновить профиль
            </Button>
          </Stack>
        </Stack>
      </PageSection>

      <Grid container spacing={3}>
        <Grid size={{ xs: 12, lg: 6 }}>
          <PageSection title="Следующее действие" subtitle="Сценарий, который требует внимания прямо сейчас.">
            {nextInvitation ? (
              <Stack spacing={1.5}>
                <Typography variant="h6">{nextInvitation.project_name ?? 'Объект без названия'}</Typography>
                <Typography color="text.secondary">
                  {nextInvitation.contractor_organization_name ?? 'Подрядчик не указан'}
                </Typography>
                <Typography variant="body2">{nextInvitation.message || 'Подрядчик пока не добавил комментарий к приглашению.'}</Typography>
                <Typography variant="body2" color="text.secondary">
                  Старт работ: {formatDate(nextInvitation.starts_at)}
                </Typography>
                <Button variant="outlined" onClick={() => navigate('/cabinet/invitations')}>
                  Перейти к решению по приглашению
                </Button>
              </Stack>
            ) : (
              <Alert severity="info">Новых приглашений пока нет. Проверьте открытые запросы подрядчиков.</Alert>
            )}
          </PageSection>
        </Grid>
        <Grid size={{ xs: 12, lg: 6 }}>
          <PageSection title="Текущее назначение" subtitle="Ближайший активный или запланированный объект.">
            {nextAssignment ? (
              <Stack spacing={1.5}>
                <Typography variant="h6">{nextAssignment.project_name}</Typography>
                <Stack direction="row" spacing={1} alignItems="center">
                  <BrigadeStatusChip kind="assignment" status={nextAssignment.status} />
                  <Typography color="text.secondary">
                    {nextAssignment.contractor_organization_name ?? 'Подрядчик не указан'}
                  </Typography>
                </Stack>
                <Typography variant="body2" color="text.secondary">
                  Начало: {formatDate(nextAssignment.starts_at)} • Завершение: {formatDate(nextAssignment.ends_at)}
                </Typography>
                {nextAssignment.notes ? <Typography variant="body2">{nextAssignment.notes}</Typography> : null}
                <Button variant="outlined" onClick={() => navigate('/cabinet/assignments')}>
                  Открыть список назначений
                </Button>
              </Stack>
            ) : (
              <Alert severity="info">Активных назначений пока нет. Как только подрядчик подтвердит сотрудничество, объект появится здесь.</Alert>
            )}
          </PageSection>
        </Grid>
      </Grid>
    </Stack>
  );
}
