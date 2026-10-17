import { createTheme } from "@mui/material/styles";

export type ColorMode = "light" | "dark";

export function createAppTheme(mode: ColorMode) {
  const light = mode === "light";

  return createTheme({
    palette: {
      mode,
      primary: {
        main: light ? "#215a9c" : "#8eb6e8",
      },
      background: {
        default: light ? "#e8eef5" : "#0e141c",
        paper: light ? "#f7f9fc" : "#161d28",
      },
      text: {
        primary: light ? "#1c2433" : "#e8eef6",
        secondary: light ? "#5d6673" : "#9aa6b8",
      },
      divider: light ? "rgba(15, 17, 21, 0.1)" : "rgba(255, 255, 255, 0.08)",
    },
    shape: {
      borderRadius: 12,
    },
    typography: {
      fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Text", "Segoe UI", sans-serif',
      h4: {
        fontSize: "1.6rem",
        fontWeight: 600,
        letterSpacing: "-0.03em",
      },
      h5: {
        fontWeight: 600,
        letterSpacing: "-0.02em",
      },
      h6: {
        fontWeight: 600,
      },
      button: {
        textTransform: "none",
        fontWeight: 600,
      },
    },
    components: {
      MuiButton: {
        styleOverrides: {
          root: {
            borderRadius: 9,
            boxShadow: "none",
            paddingInline: 16,
            "&:hover": { boxShadow: "none" },
          },
        },
      },
      MuiCard: {
        styleOverrides: {
          root: {
            borderRadius: 12,
            backgroundImage: "none",
            boxShadow: "none",
            border: "1px solid",
            borderColor: light ? "rgba(15, 17, 21, 0.08)" : "rgba(255, 255, 255, 0.08)",
          },
        },
      },
      MuiPaper: {
        styleOverrides: {
          root: {
            backgroundImage: "none",
          },
        },
      },
      MuiOutlinedInput: {
        styleOverrides: {
          root: {
            borderRadius: 8,
          },
        },
      },
      MuiTooltip: {
        styleOverrides: {
          tooltip: {
            fontSize: 12,
          },
        },
      },
      MuiListItemButton: {
        styleOverrides: {
          root: {
            "&.Mui-selected": {
              backgroundColor: light ? "#ffffff" : "rgba(255, 255, 255, 0.08)",
              boxShadow: light ? "0 1px 4px rgba(15, 17, 21, 0.06)" : "none",
              "&:hover": {
                backgroundColor: light ? "rgba(15, 17, 21, 0.09)" : "rgba(255, 255, 255, 0.12)",
              },
            },
          },
        },
      },
      MuiTableHead: {
        styleOverrides: {
          root: {
            "& .MuiTableCell-root": {
              fontWeight: 500,
              fontSize: 12,
              color: light ? "#6a6c70" : "#c5c9d0",
              backgroundColor: "transparent",
            },
          },
        },
      },
      MuiTableCell: {
        styleOverrides: {
          root: {
            borderColor: light ? "rgba(15, 17, 21, 0.06)" : "rgba(255, 255, 255, 0.08)",
            padding: "18px 20px",
          },
        },
      },
      MuiChip: {
        styleOverrides: {
          root: { fontWeight: 500, fontSize: 12, height: 25 },
          colorSuccess: {
            backgroundColor: light ? "#eaf6ee" : "#19372a",
            color: light ? "#237847" : "#8bdbac",
          },
        },
      },
    },
  });
}
