import { Box, Stack, Typography } from "@mui/material";
import type { ReactNode } from "react";

type PageHeaderProps = {
  title: string;
  subtitle: string;
  action?: ReactNode;
};

export function PageHeader({ title, subtitle, action }: PageHeaderProps) {
  return (
    <Stack
      direction={{ xs: "column", sm: "row" }}
      spacing={2}
      sx={{ mb: 4, pb: 3, borderBottom: 1, borderColor: "divider", alignItems: { sm: "center" }, justifyContent: "space-between" }}
    >
      <Box>
        <Box sx={{ display: "flex", alignItems: "center", gap: 1.5, mb: 1.5 }}>
          <Box sx={{ width: 7, height: 7, borderRadius: "2px", bgcolor: "primary.main" }} />
          <Typography sx={{ fontSize: 10, fontWeight: 600, letterSpacing: "0.16em", color: "text.secondary", textTransform: "uppercase" }}>
            Hutt City Intelligence
          </Typography>
        </Box>
        <Typography variant="h4" sx={{ fontSize: { xs: 30, md: 36 }, fontWeight: 600, letterSpacing: "-0.045em", lineHeight: 1.15 }}>{title}</Typography>
        <Typography color="text.secondary" sx={{ mt: 0.75, fontSize: 14 }}>
          {subtitle}
        </Typography>
      </Box>
      {action}
    </Stack>
  );
}
