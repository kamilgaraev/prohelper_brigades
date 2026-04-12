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

export function DocumentsPage() {
  const queryClient = useQueryClient();
  const [title, setTitle] = useState('');
  const [documentType, setDocumentType] = useState('');
  const [documentFile, setDocumentFile] = useState<File | null>(null);
  const [feedback, setFeedback] = useState<{ severity: 'success' | 'error'; message: string } | null>(null);

  const documentsQuery = useQuery({
    queryKey: brigadeQueryKeys.documents,
    queryFn: () => brigadeCabinetService.getDocuments(),
  });

  const uploadMutation = useMutation({
    mutationFn: async () => {
      if (!documentFile) {
        throw new Error('Выберите файл для загрузки.');
      }

      await brigadeCabinetService.uploadDocument({
        title: title.trim(),
        document_type: documentType.trim(),
        document: documentFile,
      });
    },
    onSuccess: async () => {
      setFeedback({ severity: 'success', message: 'Документ загружен.' });
      setTitle('');
      setDocumentType('');
      setDocumentFile(null);
      await queryClient.invalidateQueries({ queryKey: brigadeQueryKeys.documents });
    },
    onError: (error) => {
      setFeedback({
        severity: 'error',
        message: getErrorMessage(error, 'Не удалось загрузить документ.'),
      });
    },
  });

  const deleteMutation = useMutation({
    mutationFn: (documentId: number) => brigadeCabinetService.deleteDocument(documentId),
    onSuccess: async () => {
      setFeedback({ severity: 'success', message: 'Документ удалён.' });
      await queryClient.invalidateQueries({ queryKey: brigadeQueryKeys.documents });
    },
    onError: (error) => {
      setFeedback({
        severity: 'error',
        message: getErrorMessage(error, 'Не удалось удалить документ.'),
      });
    },
  });

  return (
    <Stack spacing={3}>
      <PageSection title="Документы" subtitle="Загрузите подтверждающие документы, чтобы пройти проверку и быстрее получать назначения.">
        <Stack spacing={2.5}>
          {feedback ? <Alert severity={feedback.severity}>{feedback.message}</Alert> : null}
          <Grid container spacing={2}>
            <Grid size={{ xs: 12, md: 5 }}>
              <TextField fullWidth label="Название документа" value={title} onChange={(event) => setTitle(event.target.value)} />
            </Grid>
            <Grid size={{ xs: 12, md: 4 }}>
              <TextField fullWidth label="Тип документа" value={documentType} onChange={(event) => setDocumentType(event.target.value)} />
            </Grid>
            <Grid size={{ xs: 12, md: 3 }}>
              <Button component="label" variant="outlined" fullWidth sx={{ minHeight: 56 }}>
                {documentFile ? 'Файл выбран' : 'Выбрать файл'}
                <input hidden type="file" onChange={(event) => setDocumentFile(event.target.files?.[0] ?? null)} />
              </Button>
            </Grid>
          </Grid>
          {documentFile ? <Typography color="text.secondary">{documentFile.name}</Typography> : null}
          <Button variant="contained" onClick={() => uploadMutation.mutate()} disabled={uploadMutation.isPending}>
            Загрузить документ
          </Button>
        </Stack>
      </PageSection>

      <PageSection title="Загруженные файлы" subtitle="Следите за статусом проверки и при необходимости обновляйте документы.">
        {documentsQuery.isLoading ? (
          <Stack alignItems="center" py={4}>
            <CircularProgress />
          </Stack>
        ) : documentsQuery.isError ? (
          <Alert severity="error">Не удалось загрузить документы бригады.</Alert>
        ) : !documentsQuery.data?.length ? (
          <Alert severity="info">Документы пока не загружены.</Alert>
        ) : (
          <Grid container spacing={2}>
            {documentsQuery.data.map((document) => (
              <Grid key={document.id} size={{ xs: 12, md: 6 }}>
                <Paper elevation={0} sx={{ p: 2.5, borderRadius: 4, border: '1px solid rgba(15, 118, 110, 0.12)' }}>
                  <Stack spacing={1.5}>
                    <Stack direction="row" justifyContent="space-between" spacing={1.5}>
                      <div>
                        <Typography variant="h6">{document.title}</Typography>
                        <Typography color="text.secondary">{document.document_type}</Typography>
                      </div>
                      <BrigadeStatusChip kind="document" status={document.verification_status} />
                    </Stack>
                    <Typography variant="body2" color="text.secondary">
                      Файл: {document.file_name ?? 'Без названия'} • Загружен: {formatDate(document.created_at)}
                    </Typography>
                    {document.verification_notes ? <Typography variant="body2">{document.verification_notes}</Typography> : null}
                    <Stack direction={{ xs: 'column', md: 'row' }} spacing={1.5}>
                      <Button component="a" href={document.file_path} target="_blank" rel="noreferrer" variant="outlined">
                        Открыть
                      </Button>
                      <Button color="error" onClick={() => deleteMutation.mutate(document.id)} disabled={deleteMutation.isPending}>
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
