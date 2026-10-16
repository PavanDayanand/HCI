import { Box, Toolbar } from "@mui/material";
import type { ReactNode } from "react";

export function EditorShell({ children }: { children: ReactNode }) {
  return (
    <Box sx={{ height: "100vh", display: "flex", flexDirection: "column", bgcolor: "background.default" }}>
      {children}
    </Box>
  );
}

export function EditorTopBar({ children }: { children: ReactNode }) {
  return (
    <Toolbar
      sx={{
        minHeight: "64px !important",
        gap: 1.5,
        px: 2,
        bgcolor: "background.paper",
        borderBottom: 1,
        borderColor: "divider",
      }}
    >
      {children}
    </Toolbar>
  );
}
