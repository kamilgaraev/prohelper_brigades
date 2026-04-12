import { useQuery } from '@tanstack/react-query';
import { Alert, CircularProgress, Grid, Paper, Stack, Typography } from '@mui/material';

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

export function ResponsesPage() {
  const responsesQuery = useQuery({
    queryKey: brigadeQueryKeys.responses,
    queryFn: () => brigadeCabinetService.getResponses(),
  });

  return (
    <PageSection title="Мои отклики" subtitle="История откликов на запросы подрядчиков и текущий статус рассмотрения.">
      {responsesQuery.isLoading ? (
        <Stack alignItems="center" py={4}>
          <CircularProgress />
        </Stack>
      ) : responsesQuery.isError ? (
        <Alert severity="error">Не удалось загрузить отклики бригады.</Alert>
      ) : !responsesQuery.data?.length ? (
        <Alert severity="info">Вы ещё не откликались на запросы подрядчиков.</Alert>
      ) : (
        <Grid container spacing={2}>
          {responsesQuery.data.map((response) => (
            <Grid key={response.id} size={{ xs: 12, md: 6 }}>
              <Paper elevation={0} sx={{ p: 2.5, borderRadius: 4, border: '1px solid rgba(15, 118, 110, 0.12)' }}>
                <Stack spacing={1.5}>
                  <Stack direction="row" justifyContent="space-between" spacing={1.5}>
                    <div>
                      <Typography variant="h6">{response.request?.title ?? `Запрос #${response.request_id}`}</Typography>
                      <Typography color="text.secondary">
                        {response.request?.contractor_organization_name ?? 'Подрядчик не указан'}
                      </Typography>
                    </div>
                    <BrigadeStatusChip kind="response" status={response.status} />
                  </Stack>
                  <Typography variant="body2" color="text.secondary">
                    Отправлен: {formatDate(response.created_at)}
                  </Typography>
                  <Typography variant="body2">
                    {response.cover_message || 'Комментарий к отклику не добавлен.'}
                  </Typography>
                </Stack>
              </Paper>
            </Grid>
          ))}
        </Grid>
      )}
    </PageSection>
  );
}
