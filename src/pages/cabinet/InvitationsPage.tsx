import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { Alert, Button, CircularProgress, Grid, Paper, Stack, Typography } from '@mui/material';

import { BrigadeStatusChip } from '@/components/BrigadeStatusChip';
import { PageSection } from '@/components/PageSection';
import { brigadeCabinetService } from '@/services/brigadeCabinetService';
import { getErrorMessage } from '@/services/errorUtils';
import { brigadeQueryKeys } from '@/services/brigadeQueryKeys';

const formatDate = (value?: string | null) =>
  value
    ? new Intl.DateTimeFormat('ru-RU', {
        day: '2-digit',
        month: 'long',
        year: 'numeric',
      }).format(new Date(value))
    : 'Не указана';

export function InvitationsPage() {
  const queryClient = useQueryClient();
  const invitationsQuery = useQuery({
    queryKey: brigadeQueryKeys.invitations,
    queryFn: () => brigadeCabinetService.getInvitations(),
  });

  const acceptMutation = useMutation({
    mutationFn: (invitationId: number) => brigadeCabinetService.acceptInvitation(invitationId),
    onSuccess: async () => {
      await Promise.all([
        queryClient.invalidateQueries({ queryKey: brigadeQueryKeys.invitations }),
        queryClient.invalidateQueries({ queryKey: brigadeQueryKeys.assignments }),
        queryClient.invalidateQueries({ queryKey: brigadeQueryKeys.dashboard }),
      ]);
    },
  });

  const declineMutation = useMutation({
    mutationFn: (invitationId: number) => brigadeCabinetService.declineInvitation(invitationId),
    onSuccess: async () => {
      await Promise.all([
        queryClient.invalidateQueries({ queryKey: brigadeQueryKeys.invitations }),
        queryClient.invalidateQueries({ queryKey: brigadeQueryKeys.dashboard }),
      ]);
    },
  });

  return (
    <PageSection title="Входящие приглашения" subtitle="Приглашения подрядчиков на объекты с быстрым решением по сотрудничеству.">
      {invitationsQuery.isLoading ? (
        <Stack alignItems="center" py={4}>
          <CircularProgress />
        </Stack>
      ) : invitationsQuery.isError ? (
        <Alert severity="error">Не удалось загрузить приглашения.</Alert>
      ) : !invitationsQuery.data?.length ? (
        <Alert severity="info">Новых приглашений пока нет.</Alert>
      ) : (
        <Grid container spacing={2}>
          {invitationsQuery.data.map((invitation) => (
            <Grid key={invitation.id} size={{ xs: 12, md: 6 }}>
              <Paper elevation={0} sx={{ p: 2.5, borderRadius: 4, border: '1px solid rgba(15, 118, 110, 0.12)' }}>
                <Stack spacing={1.5}>
                  <Stack direction="row" justifyContent="space-between" spacing={1.5}>
                    <div>
                      <Typography variant="h6">{invitation.project_name ?? 'Объект без названия'}</Typography>
                      <Typography color="text.secondary">{invitation.contractor_organization_name ?? 'Подрядчик не указан'}</Typography>
                    </div>
                    <BrigadeStatusChip kind="invitation" status={invitation.status} />
                  </Stack>
                  <Typography variant="body2">
                    {invitation.message || 'Подрядчик пока не оставил пояснение к приглашению.'}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Старт: {formatDate(invitation.starts_at)} • Ответ до: {formatDate(invitation.expires_at)}
                  </Typography>
                  {invitation.status === 'pending' ? (
                    <Stack direction={{ xs: 'column', md: 'row' }} spacing={1.5}>
                      <Button variant="contained" onClick={() => acceptMutation.mutate(invitation.id)} disabled={acceptMutation.isPending}>
                        Принять
                      </Button>
                      <Button variant="outlined" color="inherit" onClick={() => declineMutation.mutate(invitation.id)} disabled={declineMutation.isPending}>
                        Отклонить
                      </Button>
                    </Stack>
                  ) : null}
                  {acceptMutation.isError ? <Alert severity="error">{getErrorMessage(acceptMutation.error, 'Не удалось принять приглашение.')}</Alert> : null}
                  {declineMutation.isError ? <Alert severity="error">{getErrorMessage(declineMutation.error, 'Не удалось отклонить приглашение.')}</Alert> : null}
                </Stack>
              </Paper>
            </Grid>
          ))}
        </Grid>
      )}
    </PageSection>
  );
}
