import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import DarkModeOutlinedIcon from "@mui/icons-material/DarkModeOutlined";
import LightModeOutlinedIcon from "@mui/icons-material/LightModeOutlined";
import SaveOutlinedIcon from "@mui/icons-material/SaveOutlined";
import { Box, Button, IconButton, TextField, Tooltip, Typography } from "@mui/material";
import { useEffect, useState } from "react";
import { Link as RouterLink, useNavigate, useParams } from "react-router-dom";
import { PlainDark, PlainLight } from "survey-core/themes";
import type { ICreatorOptions } from "survey-creator-core";
import { SurveyCreator, SurveyCreatorComponent } from "survey-creator-react";
import { useForms } from "../../forms/useForms.ts";
import { EditorShell, EditorTopBar } from "../../layout/EditorChrome.tsx";
import { useColorMode } from "../../theme/useColorMode.ts";
import { createEmptySchema } from "../../types/form.ts";
import type { FormRecord, SurveySchema } from "../../types/form.ts";

const creatorOptions: ICreatorOptions = {
  showLogicTab: true,
  showJSONEditorTab: true,
  showThemeTab: false,
  isAutoSave: false,
};

export function FormEditorPage() {
  const { formId } = useParams();
  return <FormEditor key={formId ?? "new"} formId={formId} />;
}

function FormEditor({ formId }: { formId?: string }) {
  const { mode } = useColorMode();
  const { forms, saveForm } = useForms();
  const existingForm = forms.find((form) => form.id === formId);

  if (formId && !existingForm) {
    return (
      <EditorShell>
        <EditorTopBar>
          <Button component={RouterLink} to="/admin/forms" startIcon={<ArrowBackIcon />}>
            Forms
          </Button>
        </EditorTopBar>
        <Box sx={{ p: 4 }}>
          <Typography variant="h5">Form not found</Typography>
          <Typography color="text.secondary" sx={{ mt: 1 }}>
            This form is not in the current session.
          </Typography>
        </Box>
      </EditorShell>
    );
  }

  return <EditorForm existingForm={existingForm} mode={mode} onSave={saveForm} />;
}

type EditorFormProps = {
  existingForm?: FormRecord;
  mode: "light" | "dark";
  onSave: (form: FormRecord) => void;
};

function EditorForm({ existingForm, mode, onSave }: EditorFormProps) {
  const navigate = useNavigate();
  const { toggleMode } = useColorMode();
  const [title, setTitle] = useState(existingForm?.title ?? "");
  const [description, setDescription] = useState(existingForm?.description ?? "");
  const [titleError, setTitleError] = useState("");
  const [creator] = useState(() => {
    const nextCreator = new SurveyCreator(creatorOptions);
    nextCreator.JSON = structuredClone(existingForm?.schema ?? createEmptySchema());
    return nextCreator;
  });

  useEffect(() => {
    const theme = mode === "dark" ? PlainDark : PlainLight;
    creator.applyCreatorTheme({ ...theme, isLight: mode === "light" });
    creator.applySurfaceTheme(theme);
  }, [creator, mode]);

  function save(status: "draft" | "active") {
    const nextTitle = title.trim();
    if (!nextTitle) {
      setTitleError("Enter a form name.");
      return;
    }

    onSave({
      id: existingForm?.id ?? crypto.randomUUID(),
      title: nextTitle,
      description: description.trim(),
      status,
      schema: creator.JSON as SurveySchema,
      updatedAt: new Date().toISOString(),
    });

    navigate(status === "active" ? "/admin/forms" : "/admin/forms?tab=draft");
  }

  return (
    <EditorShell>
      <EditorTopBar>
        <Button component={RouterLink} to="/admin/forms" startIcon={<ArrowBackIcon />} sx={{ flexShrink: 0 }}>
          Forms
        </Button>
        <TextField
          required
          size="small"
          placeholder="Form name"
          value={title}
          error={Boolean(titleError)}
          helperText={titleError}
          onChange={(event) => {
            setTitle(event.target.value);
            setTitleError("");
          }}
          sx={{ minWidth: 220 }}
        />
        <TextField
          size="small"
          placeholder="Description"
          value={description}
          onChange={(event) => setDescription(event.target.value)}
          sx={{ flex: 1, minWidth: 180 }}
        />
        <Button variant="outlined" startIcon={<SaveOutlinedIcon />} onClick={() => save("draft")}>
          Save draft
        </Button>
        <Button variant="contained" onClick={() => save("active")}>
          Publish
        </Button>
        <Tooltip title={mode === "light" ? "Dark mode" : "Light mode"}>
          <IconButton onClick={toggleMode} aria-label="Toggle color mode">
            {mode === "light" ? <DarkModeOutlinedIcon /> : <LightModeOutlinedIcon />}
          </IconButton>
        </Tooltip>
      </EditorTopBar>
      <Box
        sx={{
          flex: 1,
          minHeight: 0,
          "& .svc-creator": { height: "100%" },
        }}
      >
        <SurveyCreatorComponent creator={creator} />
      </Box>
    </EditorShell>
  );
}
