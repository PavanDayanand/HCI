import { Box, Button, Card, CardActions, CardContent, Chip, Typography } from "@mui/material";
import { Link as RouterLink } from "react-router-dom";
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
            <Card key={form.id} sx={{ display: "flex", flexDirection: "column" }}>
              <CardContent sx={{ flex: 1 }}>
                <Chip size="small" label="Open" color="success" sx={{ mb: 1.5 }} />
                <Typography variant="h6">{form.title}</Typography>
                <Typography color="text.secondary" sx={{ mt: 1 }}>
                  {form.description || "No description"}
                </Typography>
              </CardContent>
              <CardActions sx={{ px: 2, pb: 2 }}>
                <Button component={RouterLink} to={`/forms/${form.id}`} variant="contained">
                  Fill form
                </Button>
              </CardActions>
            </Card>
          ))}
        </Box>
      )}

      <Typography variant="h6" sx={{ mt: 5, mb: 1.5 }}>
        Submissions
      </Typography>
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
