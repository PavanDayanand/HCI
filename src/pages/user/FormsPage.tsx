import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import { Box, Button, Card, CardActions, CardContent, Chip, Typography } from "@mui/material";
import { Link as RouterLink } from "react-router-dom";
import { FormMark } from "../../components/FormMark.tsx";
import { EmptyState } from "../../components/EmptyState.tsx";
import { PageHeader } from "../../components/PageHeader.tsx";
import { useForms } from "../../forms/useForms.ts";
import { formatWhen } from "../../types/form.ts";

export function FormsPage() {
  const { forms, submissions } = useForms();
  const publishedForms = forms.filter((form) => form.status === "active");

  return (
    <Box sx={{ maxWidth: 1100, mx: "auto" }}>
      <PageHeader title="Forms" subtitle="Published forms you can fill in and submit." />

      {publishedForms.length === 0 ? (
        <Card>
          <EmptyState title="No forms yet" message="When an admin publishes a form, it will appear here." />
        </Card>
      ) : (
        <Box
          sx={{
            display: "grid",
            gridTemplateColumns: { xs: "1fr", md: "1fr 1fr" },
            gap: 2,
          }}
        >
          {publishedForms.map((form) => (
            <Card key={form.id} sx={{ display: "flex", flexDirection: "column", borderTop: "3px solid", borderTopColor: "primary.main", transition: "border-color 0.2s", "&:hover": { borderColor: "primary.main" } }}>
              <CardContent sx={{ flex: 1, p: 3 }}>
                <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 3 }}>
                  <FormMark />
                  <Chip size="small" label="Open" color="success" />
                </Box>
                <Typography variant="h6">{form.title}</Typography>
                <Typography color="text.secondary" sx={{ mt: 1 }}>
                  {form.description || "No description"}
                </Typography>
              </CardContent>
              <CardActions sx={{ mx: 3, pb: 2, pt: 2, mb: 1, px: 0, borderTop: 1, borderColor: "divider", justifyContent: "space-between" }}>
                <Typography sx={{ fontSize: 11, color: "text.secondary" }}>Updated {formatWhen(form.updatedAt)}</Typography>
                <Button component={RouterLink} to={`/forms/${form.id}`} variant="text" endIcon={<ArrowForwardIcon fontSize="small" />}>
                  Fill form
                </Button>
              </CardActions>
            </Card>
          ))}
        </Box>
      )}

      <Box sx={{ display: "flex", alignItems: "center", gap: 1.25, mt: 5, mb: 2 }}>
        <Typography sx={{ fontSize: 16, fontWeight: 600 }}>Submissions</Typography>
        <Chip size="small" label={submissions.length} />
      </Box>
      {submissions.length === 0 ? (
        <Typography color="text.secondary">Nothing submitted in this session yet.</Typography>
      ) : (
        <Box sx={{ display: "grid", gap: 1.5 }}>
          {submissions.map((submission) => (
            <Card key={submission.id}>
              <CardContent>
                <Typography sx={{ fontWeight: 600 }}>{submission.formTitle}</Typography>
                <Typography variant="body2" color="text.secondary">
                  Submitted {formatWhen(submission.submittedAt)}
                </Typography>
              </CardContent>
            </Card>
          ))}
        </Box>
      )}
    </Box>
  );
}
