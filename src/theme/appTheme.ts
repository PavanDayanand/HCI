import { createTheme } from "@mui/material/styles";

export type ColorMode = "light" | "dark";

export function createAppTheme(mode: ColorMode) {
  const light = mode === "light";

  return createTheme({
    palette: {
      mode,
      primary: {
        main: light ? "#12823c" : "#2ecc71",
      },
      background: {
        default: light ? "#f6f7f9" : "#0c0d0f",
        paper: light ? "#ffffff" : "#16181d",
      },
      text: {
        primary: light ? "#1b1c1e" : "#f4f5f7",
        secondary: light ? "#5c5f66" : "#9aa0a6",
      },
      divider: light ? "rgba(15, 17, 21, 0.1)" : "rgba(255, 255, 255, 0.08)",
    },
    shape: {
      borderRadius: 12,
    },
    typography: {
      fontFamily: '"Inter", "SF Pro Text", "Helvetica Neue", Helvetica, Arial, sans-serif',
      h4: {
        fontSize: "1.75rem",
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
            borderRadius: 8,
            paddingInline: 14,
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
              backgroundColor: light ? "rgba(15, 17, 21, 0.06)" : "rgba(255, 255, 255, 0.08)",
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
              fontWeight: 600,
              color: light ? "#3c3f46" : "#c5c9d0",
              backgroundColor: light ? "#f7f8fa" : "#1c1e24",
            },
          },
        },
      },
      MuiTableCell: {
        styleOverrides: {
          root: {
            borderColor: light ? "rgba(15, 17, 21, 0.08)" : "rgba(255, 255, 255, 0.08)",
          },
        },
      },
    },
  });
}
