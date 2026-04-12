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

export function AssignmentsPage() {
  const assignmentsQuery = useQuery({
    queryKey: brigadeQueryKeys.assignments,
    queryFn: () => brigadeCabinetService.getAssignments(),
  });

  return (
    <PageSection title="Назначения на объекты" subtitle="Подтверждённые проекты, где бригада уже участвует или выходит на площадку.">
      {assignmentsQuery.isLoading ? (
        <Stack alignItems="center" py={4}>
          <CircularProgress />
        </Stack>
      ) : assignmentsQuery.isError ? (
        <Alert severity="error">Не удалось загрузить назначения бригады.</Alert>
      ) : !assignmentsQuery.data?.length ? (
        <Alert severity="info">Подтверждённых назначений пока нет.</Alert>
      ) : (
        <Grid container spacing={2}>
          {assignmentsQuery.data.map((assignment) => (
            <Grid key={assignment.id} size={{ xs: 12, md: 6 }}>
              <Paper elevation={0} sx={{ p: 2.5, borderRadius: 4, border: '1px solid rgba(15, 118, 110, 0.12)' }}>
                <Stack spacing={1.5}>
                  <Stack direction="row" justifyContent="space-between" spacing={1.5}>
                    <div>
                      <Typography variant="h6">{assignment.project_name}</Typography>
                      <Typography color="text.secondary">
                        {assignment.contractor_organization_name ?? 'Подрядчик не указан'}
                      </Typography>
                    </div>
                    <BrigadeStatusChip kind="assignment" status={assignment.status} />
                  </Stack>
                  <Typography variant="body2" color="text.secondary">
                    Старт: {formatDate(assignment.starts_at)} • Завершение: {formatDate(assignment.ends_at)}
                  </Typography>
                  {assignment.notes ? <Typography variant="body2">{assignment.notes}</Typography> : null}
                </Stack>
              </Paper>
            </Grid>
          ))}
        </Grid>
      )}
    </PageSection>
  );
}
