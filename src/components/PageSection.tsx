import type { PropsWithChildren } from 'react';
import { Paper, Stack, Typography } from '@mui/material';

type PageSectionProps = PropsWithChildren<{
  title: string;
  subtitle?: string;
}>;

export function PageSection({ title, subtitle, children }: PageSectionProps) {
  return (
    <Paper elevation={0} sx={{ p: 3, borderRadius: 5, border: '1px solid rgba(15, 118, 110, 0.12)' }}>
      <Stack spacing={2.5}>
        <div>
          <Typography variant="h5" sx={{ fontWeight: 700 }}>
            {title}
          </Typography>
          {subtitle ? (
            <Typography variant="body2" color="text.secondary" sx={{ mt: 0.75 }}>
              {subtitle}
            </Typography>
          ) : null}
        </div>
        {children}
      </Stack>
    </Paper>
  );
}
