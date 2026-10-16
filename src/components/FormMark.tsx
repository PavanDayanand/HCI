import { Box } from "@mui/material";

// A small paper motif shared by the form list and the user cards.
// It is decorative: the form title provides the accessible name.
export function FormMark() {
  return (
    <Box
      aria-hidden="true"
      sx={{
        width: 46,
        height: 52,
        flexShrink: 0,
        display: "grid",
        placeItems: "center",
        bgcolor: "action.hover",
        borderRadius: "10px",
      }}
    >
      <Box
        sx={{
          width: 25,
          height: 32,
          border: 1,
          borderColor: "divider",
          borderLeft: "3px solid",
          borderLeftColor: "primary.main",
          bgcolor: "background.paper",
          borderRadius: "3px",
          p: "7px 5px",
          boxShadow: "1px 2px 0 rgba(0,0,0,0.04)",
        }}
      >
        <Box sx={{ height: "2px", bgcolor: "primary.main", mb: "4px", width: "70%" }} />
        <Box sx={{ height: "1px", bgcolor: "text.disabled", mb: "3px" }} />
        <Box sx={{ height: "1px", bgcolor: "text.disabled", width: "75%" }} />
      </Box>
    </Box>
  );
}
