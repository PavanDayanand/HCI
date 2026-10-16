import { CssBaseline, ThemeProvider } from "@mui/material";
import { useMemo, useState } from "react";
import type { ReactNode } from "react";
import { createAppTheme } from "./appTheme.ts";
import type { ColorMode } from "./appTheme.ts";
import { ColorModeContext } from "./colorModeContext.ts";

export function ColorModeProvider({ children }: { children: ReactNode }) {
  const [mode, setMode] = useState<ColorMode>("light");
  const theme = useMemo(() => createAppTheme(mode), [mode]);

  function toggleMode() {
    setMode((current) => (current === "light" ? "dark" : "light"));
  }

  return (
    <ColorModeContext.Provider value={{ mode, toggleMode }}>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        {children}
      </ThemeProvider>
    </ColorModeContext.Provider>
  );
}
