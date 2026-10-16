import { Box, Typography } from "@mui/material";

type EmptyStateProps = {
  title: string;
  message: string;
};

export function EmptyState({ title, message }: EmptyStateProps) {
  return (
    <Box sx={{ px: 3, py: 8, textAlign: "center" }}>
      <Typography variant="h6">{title}</Typography>
      <Typography color="text.secondary" sx={{ mt: 1 }}>
        {message}
      </Typography>
    </Box>
  );
}
