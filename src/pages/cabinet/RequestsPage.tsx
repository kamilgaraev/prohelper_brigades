import { useState } from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { Alert, Button, CircularProgress, Grid, Paper, Stack, TextField, Typography } from '@mui/material';

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

export function RequestsPage() {
  const queryClient = useQueryClient();
  const [drafts, setDrafts] = useState<Record<number, string>>({});

  const requestsQuery = useQuery({
    queryKey: brigadeQueryKeys.requests,
    queryFn: () => brigadeCabinetService.getRequests(),
  });
  const responsesQuery = useQuery({
    queryKey: brigadeQueryKeys.responses,
    queryFn: () => brigadeCabinetService.getResponses(),
  });

  const responseMutation = useMutation({
    mutationFn: ({ requestId, coverMessage }: { requestId: number; coverMessage: string }) =>
      brigadeCabinetService.createResponse({
        request_id: requestId,
        cover_message: coverMessage.trim() || undefined,
      }),
    onSuccess: async (_, variables) => {
      setDrafts((current) => ({ ...current, [variables.requestId]: '' }));
      await Promise.all([
        queryClient.invalidateQueries({ queryKey: brigadeQueryKeys.responses }),
        queryClient.invalidateQueries({ queryKey: brigadeQueryKeys.dashboard }),
      ]);
    },
  });

  const respondedRequestIds = new Set((responsesQuery.data ?? []).map((item) => item.request_id));

  return (
    <PageSection title="Запросы подрядчиков" subtitle="Открытые запросы на привлечение бригад, на которые можно откликнуться прямо из кабинета.">
      {requestsQuery.isLoading || responsesQuery.isLoading ? (
        <Stack alignItems="center" py={4}>
          <CircularProgress />
        </Stack>
      ) : requestsQuery.isError || responsesQuery.isError ? (
        <Alert severity="error">Не удалось загрузить доступные запросы.</Alert>
      ) : !requestsQuery.data?.length ? (
        <Alert severity="info">Сейчас нет открытых запросов от подрядчиков.</Alert>
      ) : (
        <Grid container spacing={2}>
          {requestsQuery.data.map((request) => (
            <Grid key={request.id} size={{ xs: 12, lg: 6 }}>
              <Paper elevation={0} sx={{ p: 2.5, borderRadius: 4, border: '1px solid rgba(15, 118, 110, 0.12)' }}>
                <Stack spacing={1.5}>
                  <Stack direction="row" justifyContent="space-between" spacing={1.5}>
                    <div>
                      <Typography variant="h6">{request.title}</Typography>
                      <Typography color="text.secondary">
                        {request.contractor_organization_name ?? 'Подрядчик не указан'}
                        {request.project_name ? ` • ${request.project_name}` : ''}
                      </Typography>
                    </div>
                    <BrigadeStatusChip kind="request" status={request.status} />
                  </Stack>
                  <Typography variant="body2">
                    {request.description || 'Подрядчик не добавил подробное описание запроса.'}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Специализация: {request.specialization_name ?? 'Не указана'} • Город: {request.city ?? 'Не указан'}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Размер команды: {request.team_size_min ?? '—'} - {request.team_size_max ?? '—'} • Опубликован: {formatDate(request.published_at)}
                  </Typography>
                  <TextField
                    fullWidth
                    multiline
                    minRows={3}
                    label={respondedRequestIds.has(request.id) ? 'Обновить комментарий к отклику' : 'Комментарий к отклику'}
                    value={drafts[request.id] ?? ''}
                    onChange={(event) => setDrafts((current) => ({ ...current, [request.id]: event.target.value }))}
                  />
                  <Stack direction={{ xs: 'column', md: 'row' }} spacing={1.5} alignItems={{ xs: 'stretch', md: 'center' }}>
                    <Button
                      variant="contained"
                      onClick={() => responseMutation.mutate({ requestId: request.id, coverMessage: drafts[request.id] ?? '' })}
                      disabled={responseMutation.isPending}
                    >
                      {respondedRequestIds.has(request.id) ? 'Обновить отклик' : 'Откликнуться'}
                    </Button>
                    {respondedRequestIds.has(request.id) ? (
                      <Typography color="text.secondary">Отклик уже отправлен и может быть обновлён.</Typography>
                    ) : null}
                  </Stack>
                </Stack>
              </Paper>
            </Grid>
          ))}
        </Grid>
      )}
      {responseMutation.isError ? <Alert severity="error" sx={{ mt: 2 }}>{getErrorMessage(responseMutation.error, 'Не удалось отправить отклик.')}</Alert> : null}
      {responseMutation.isSuccess ? <Alert severity="success" sx={{ mt: 2 }}>Отклик сохранён.</Alert> : null}
    </PageSection>
  );
}
