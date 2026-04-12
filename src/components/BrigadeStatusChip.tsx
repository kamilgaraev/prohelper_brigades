import { Chip } from '@mui/material';
import type { ChipProps } from '@mui/material';

type BrigadeStatusKind =
  | 'profile'
  | 'availability'
  | 'invitation'
  | 'request'
  | 'response'
  | 'assignment'
  | 'document';

const statusLabels: Record<BrigadeStatusKind, Record<string, string>> = {
  profile: {
    draft: 'Черновик',
    pending_review: 'На модерации',
    approved: 'Одобрена',
    rejected: 'Отклонена',
    suspended: 'Приостановлена',
  },
  availability: {
    available: 'Свободна',
    partially_available: 'Частично занята',
    busy: 'Занята',
  },
  invitation: {
    pending: 'Ожидает ответа',
    accepted: 'Принято',
    declined: 'Отклонено',
    cancelled: 'Отменено',
    expired: 'Истекло',
  },
  request: {
    open: 'Открыт',
    in_review: 'В работе',
    closed: 'Закрыт',
    cancelled: 'Отменён',
  },
  response: {
    pending: 'На рассмотрении',
    approved: 'Одобрен',
    rejected: 'Отклонён',
  },
  assignment: {
    planned: 'Запланировано',
    active: 'Активно',
    paused: 'Приостановлено',
    completed: 'Завершено',
    cancelled: 'Отменено',
  },
  document: {
    pending: 'На проверке',
    approved: 'Подтверждён',
    rejected: 'Отклонён',
  },
};

const statusColors: Record<BrigadeStatusKind, Record<string, ChipProps['color']>> = {
  profile: {
    draft: 'default',
    pending_review: 'warning',
    approved: 'success',
    rejected: 'error',
    suspended: 'default',
  },
  availability: {
    available: 'success',
    partially_available: 'warning',
    busy: 'default',
  },
  invitation: {
    pending: 'primary',
    accepted: 'success',
    declined: 'error',
    cancelled: 'default',
    expired: 'default',
  },
  request: {
    open: 'primary',
    in_review: 'warning',
    closed: 'success',
    cancelled: 'default',
  },
  response: {
    pending: 'warning',
    approved: 'success',
    rejected: 'error',
  },
  assignment: {
    planned: 'primary',
    active: 'success',
    paused: 'warning',
    completed: 'success',
    cancelled: 'default',
  },
  document: {
    pending: 'warning',
    approved: 'success',
    rejected: 'error',
  },
};

export function getBrigadeStatusLabel(kind: BrigadeStatusKind, status: string): string {
  return statusLabels[kind][status] ?? status;
}

export function BrigadeStatusChip({
  kind,
  status,
  size = 'small',
  variant = 'outlined',
}: {
  kind: BrigadeStatusKind;
  status: string;
  size?: ChipProps['size'];
  variant?: ChipProps['variant'];
}) {
  return <Chip label={getBrigadeStatusLabel(kind, status)} color={statusColors[kind][status] ?? 'default'} size={size} variant={variant} />;
}
