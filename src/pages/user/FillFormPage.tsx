import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import CheckCircleOutlineIcon from "@mui/icons-material/CheckCircleOutlineOutlined";
import { Box, Button, Card, CardContent, Typography } from "@mui/material";
import { useEffect, useMemo, useState } from "react";
import { Link as RouterLink, useParams } from "react-router-dom";
import { Model } from "survey-core";
import { PlainDark, PlainLight } from "survey-core/themes";
import { Survey } from "survey-react-ui";
import { useForms } from "../../forms/useForms.ts";
import { useColorMode } from "../../theme/useColorMode.ts";

export function FillFormPage() {
  const { formId } = useParams();
  const { mode } = useColorMode();
  const { forms, addSubmission } = useForms();
  const [submitted, setSubmitted] = useState(false);
  const form = forms.find((item) => item.id === formId && item.status === "active");

  const survey = useMemo(() => {
    if (!form) {
      return null;
    }
    const model = new Model(structuredClone(form.schema));
    model.showTitle = false;
    return model;
  }, [form]);

  useEffect(() => {
    if (!survey) {
      return;
    }
    survey.applyTheme(mode === "dark" ? PlainDark : PlainLight);
  }, [mode, survey]);

  useEffect(() => {
    if (!survey || !form) {
      return;
    }

    const handleComplete = (sender: Model) => {
      addSubmission({
        id: crypto.randomUUID(),
        formId: form.id,
        formTitle: form.title,
        answers: sender.data as Record<string, unknown>,
        submittedAt: new Date().toISOString(),
      });
      setSubmitted(true);
    };

    survey.onComplete.add(handleComplete);
    return () => {
      survey.onComplete.remove(handleComplete);
    };
  }, [addSubmission, form, survey]);

  if (!form || !survey) {
    return (
      <Box sx={{ maxWidth: 720 }}>
        <Typography variant="h5">Form not available</Typography>
        <Typography color="text.secondary" sx={{ mt: 1, mb: 2 }}>
          This form is not published in the current session.
        </Typography>
        <Button component={RouterLink} to="/forms" startIcon={<ArrowBackIcon />}>
          Back to forms
        </Button>
      </Box>
    );
  }

  if (submitted) {
    return (
      <Box sx={{ maxWidth: 720, mx: "auto" }}>
        <Card>
          <CardContent sx={{ py: 6, textAlign: "center" }}>
            <CheckCircleOutlineIcon color="success" sx={{ fontSize: 48, mb: 1 }} />
            <Typography variant="h5">Submitted</Typography>
            <Typography color="text.secondary" sx={{ mt: 1, mb: 3 }}>
              Your answers for {form.title} were saved for this session.
            </Typography>
            <Button component={RouterLink} to="/forms" variant="contained">
              Back to forms
            </Button>
          </CardContent>
        </Card>
      </Box>
    );
  }

  return (
    <Box sx={{ maxWidth: 880, mx: "auto" }}>
      <Button component={RouterLink} to="/forms" startIcon={<ArrowBackIcon />} sx={{ mb: 2 }}>
        Forms
      </Button>
      <Typography variant="h4">{form.title}</Typography>
      {form.description ? (
        <Typography color="text.secondary" sx={{ mt: 1, mb: 2 }}>
          {form.description}
        </Typography>
      ) : null}
      <Card>
        <CardContent>
          <Survey model={survey} />
        </CardContent>
      </Card>
    </Box>
  );
}
