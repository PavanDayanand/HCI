import CloseIcon from "@mui/icons-material/Close";
import AddIcon from "@mui/icons-material/Add";
import UploadFileOutlinedIcon from "@mui/icons-material/UploadFileOutlined";
import AutoAwesomeOutlinedIcon from "@mui/icons-material/AutoAwesomeOutlined";
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutlineOutlined";
import EditOutlinedIcon from "@mui/icons-material/EditOutlined";
import MoreVertOutlinedIcon from "@mui/icons-material/MoreVertOutlined";
import PublishOutlinedIcon from "@mui/icons-material/PublishOutlined";
import SearchIcon from "@mui/icons-material/Search";
import UnpublishedOutlinedIcon from "@mui/icons-material/UnpublishedOutlined";
import VisibilityOutlinedIcon from "@mui/icons-material/VisibilityOutlined";
import {
  Box,
  Alert,
  Button,
  Chip,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  IconButton,
  InputAdornment,
  ListItemIcon,
  ListItemText,
  Menu,
  MenuItem,
  Paper,
  Tab,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Tabs,
  TextField,
  Typography,
} from "@mui/material";
import { useMemo, useRef, useState } from "react";
import type { MouseEvent } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { Model } from "survey-core";
import { PlainDark, PlainLight } from "survey-core/themes";
import { Survey } from "survey-react-ui";
import { FormMark } from "../../components/FormMark.tsx";
import { EmptyState } from "../../components/EmptyState.tsx";
import { PageHeader } from "../../components/PageHeader.tsx";
import { useForms } from "../../forms/useForms.ts";
import { importSurvey } from "../../forms/importSurvey.ts";
import { useColorMode } from "../../theme/useColorMode.ts";
import { formatWhen } from "../../types/form.ts";
import type { FormRecord, FormStatus } from "../../types/form.ts";

type BuilderTab = "active" | "draft" | "ai";

export function FormBuilderPage() {
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const { mode } = useColorMode();
  const { forms, saveForm, publishForm, unpublishForm, deleteForm } = useForms();
  const uploadInput = useRef<HTMLInputElement>(null);
  const [importError, setImportError] = useState("");
  const [importing, setImporting] = useState(false);
  const [search, setSearch] = useState("");
  const [formToDelete, setFormToDelete] = useState<FormRecord | null>(null);
  const [previewForm, setPreviewForm] = useState<FormRecord | null>(null);

  const tabParam = searchParams.get("tab");
  const tab: BuilderTab = tabParam === "draft" || tabParam === "ai" ? tabParam : "active";

  const activeForms = forms.filter((form) => form.status === "active");
  const draftForms = forms.filter((form) => form.status === "draft");
  const sourceForms = tab === "active" ? activeForms : draftForms;
  const query = search.trim().toLowerCase();
  const visibleForms = query
    ? sourceForms.filter((form) => form.title.toLowerCase().includes(query) || form.description.toLowerCase().includes(query))
    : sourceForms;

  const previewModel = useMemo(() => {
    if (!previewForm) {
      return null;
    }
    const model = new Model(structuredClone(previewForm.schema));
    model.applyTheme(mode === "dark" ? PlainDark : PlainLight);
    model.showCompleteButton = false;
    model.mode = "display";
    return model;
  }, [mode, previewForm]);

  return (
    <Box>
      <PageHeader
        title="Form Builder"
        subtitle="Create, edit, and publish forms."
        action={
          <Box sx={{ display: "flex", gap: 1, flexWrap: "wrap" }}>
            <Button variant="outlined" startIcon={<UploadFileOutlinedIcon />} disabled={importing} onClick={() => uploadInput.current?.click()}>
              {importing ? "Importing…" : "Upload JSON"}
            </Button>
            <Button variant="contained" startIcon={<AddIcon />} onClick={() => navigate("/admin/forms/new")}>
              Create form
            </Button>
          </Box>
        }
      />

      <input
        ref={uploadInput}
        type="file"
        accept=".json,application/json"
        aria-label="Upload SurveyJS JSON"
        hidden
        onChange={async (event) => {
          const file = event.currentTarget.files?.[0];
          event.currentTarget.value = "";
          if (!file) return;
          setImportError("");
          if (file.size > 5 * 1024 * 1024) {
            setImportError("Choose a JSON file smaller than 5 MB.");
            return;
          }
          setImporting(true);
          try {
            const form = importSurvey(await file.text(), file.name);
            saveForm(form);
            navigate(`/admin/forms/${form.id}/edit`);
          } catch (error) {
            setImportError(error instanceof Error ? error.message : "Unable to import this file. Please try again.");
          } finally {
            setImporting(false);
          }
        }}
      />
      {importError ? <Alert severity="error" onClose={() => setImportError("")} sx={{ mb: 3 }}>{importError}</Alert> : null}

      <Paper elevation={0} sx={{ overflow: "hidden", bgcolor: "transparent" }}>
        <Box
          sx={{
            pb: 3,
            display: "flex",
            alignItems: "center",
            gap: 2,
            flexWrap: "wrap",

          }}
        >
          <Tabs
            aria-label="Form status"
            variant="scrollable"
            scrollButtons="auto"
            value={tab}
            onChange={(_event, nextTab: BuilderTab) => {
              if (nextTab === "active") {
                setSearchParams({});
                return;
              }
              setSearchParams({ tab: nextTab });
            }}
            sx={{
              minHeight: 38,
              p: 0.5,
              maxWidth: "100%",
              bgcolor: "action.hover",
              borderRadius: "999px",
              "& .MuiTabs-indicator": { display: "none" },
              "& .MuiTabs-list": { gap: 0.5 },
              "& .MuiTab-root": {
                minHeight: 34,
                minWidth: 0,
                px: 1.5,
                py: 0.75,
                borderRadius: "999px",
                fontSize: 13,
                textTransform: "none",
                color: "text.secondary",
              },
              "& .MuiTab-root.Mui-selected": { bgcolor: "background.paper", color: "text.primary", boxShadow: "0 1px 4px rgba(0,0,0,0.08)" },
            }}
          >
            <Tab value="active" label={<Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>Active <Box component="span" sx={{ fontSize: 11, opacity: 0.6 }}>{activeForms.length}</Box></Box>} />
            <Tab value="draft" label={<Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>Drafts <Box component="span" sx={{ fontSize: 11, opacity: 0.6 }}>{draftForms.length}</Box></Box>} />
            <Tab value="ai" label="AI Builder" />
          </Tabs>
          {tab !== "ai" ? (
            <TextField
              size="small"
              placeholder="Search forms…"
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              slotProps={{
                htmlInput: { "aria-label": "Search forms" },
                input: {
                  startAdornment: (
                    <InputAdornment position="start">
                      <Box sx={{ display: "grid", placeItems: "center", width: 26, height: 26, borderRadius: "7px", bgcolor: "background.paper", color: "primary.main", border: 1, borderColor: "divider" }}>
                        <SearchIcon sx={{ fontSize: 17 }} />
                      </Box>
                    </InputAdornment>
                  ),
                  endAdornment: search ? (
                    <InputAdornment position="end">
                      <IconButton size="small" aria-label="Clear search" onClick={() => setSearch("")}>
                        <CloseIcon sx={{ fontSize: 16 }} />
                      </IconButton>
                    </InputAdornment>
                  ) : null,
                },
              }}
              sx={{
                ml: { sm: "auto" },
                width: { xs: "100%", sm: 280 },
                "& .MuiOutlinedInput-root": {
                  fontSize: 13,
                  borderRadius: "12px",
                  bgcolor: "action.hover",
                  pl: 1,
                  transition: "background-color 0.2s, box-shadow 0.2s",
                  "& fieldset": { borderColor: "transparent" },
                  "&:hover fieldset": { borderColor: "divider" },
                  "&.Mui-focused": {
                    bgcolor: "background.paper",
                    boxShadow: "0 0 0 3px rgba(107,156,119,0.12)",
                  },
                  "&.Mui-focused fieldset": { borderColor: "primary.main", borderWidth: 1 },
                },
              }}
            />
          ) : null}
        </Box>

        {tab === "ai" ? (
          <Box sx={{ px: 3, py: 8, textAlign: "center" }}>
            <AutoAwesomeOutlinedIcon sx={{ fontSize: 36, color: "primary.main", mb: 1.5 }} />
            <Typography variant="h6">AI Builder</Typography>
            <Typography color="text.secondary" sx={{ mt: 1 }}>
              This tab is ready. PDF upload and conversion will be added later.
            </Typography>
          </Box>
        ) : visibleForms.length === 0 ? (
          <EmptyState
            title={search ? "No matching forms" : tab === "active" ? "No active forms" : "No drafts yet"}
            message={
              search
                ? "Try a different name."
                : tab === "active"
                  ? "Publish a draft and it will show up here."
                  : "Create a form and save it as a draft."
            }
          />
        ) : (
          <TableContainer>
            <Table aria-label="Forms" sx={{ "& td, & th": { px: { xs: 1.5, sm: 2.5 } }, "& th": { borderTop: 1, borderColor: "divider", py: 1.5 }, "& tbody tr:last-child td": { borderBottom: 1, borderColor: "divider" } }}>
              <TableHead>
                <TableRow>
                  <TableCell>Form name</TableCell>
                  <TableCell sx={{ width: { xs: 75, sm: 140 } }}>Status</TableCell>
                  <TableCell sx={{ width: 180, display: { xs: "none", sm: "table-cell" } }}>Updated</TableCell>
                  <TableCell align="right" sx={{ width: { xs: 48, sm: 100 }, whiteSpace: "nowrap" }}>
                    Actions
                  </TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {visibleForms.map((form) => (
                  <TableRow key={form.id} hover>
                    <TableCell>
                      <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
                        <Box sx={{ display: { xs: "none", sm: "block" } }}><FormMark /></Box>
                        <Box>
                      <Button
                        variant="text"
                        color="inherit"
                        onClick={() => navigate(`/admin/forms/${form.id}/edit`)}
                        sx={{
                          p: 0,
                          minWidth: 0,
                          justifyContent: "flex-start",
                          textAlign: "left",
                          "&:hover": { bgcolor: "transparent", textDecoration: "underline" },
                        }}
                      >
                        {form.title}
                      </Button>
                      <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5, fontSize: 13 }}>
                        {form.description || "No description"}
                      </Typography>
                        </Box>
                      </Box>
                    </TableCell>
                    <TableCell>
                      <StatusChip status={form.status} />
                    </TableCell>
                    <TableCell sx={{ display: { xs: "none", sm: "table-cell" } }}>
                      <Typography variant="body2" color="text.secondary">
                        {formatWhen(form.updatedAt)}
                      </Typography>
                    </TableCell>
                    <TableCell align="right">
                      <FormActionsMenu
                        form={form}
                        onPreview={() => setPreviewForm(form)}
                        onEdit={() => navigate(`/admin/forms/${form.id}/edit`)}
                        onPublish={() => publishForm(form.id)}
                        onUnpublish={() => unpublishForm(form.id)}
                        onDelete={() => setFormToDelete(form)}
                      />
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        )}
        {tab !== "ai" && visibleForms.length > 0 ? (
          <Typography sx={{ mt: 2, fontSize: 12, color: "text.secondary" }}>
            {visibleForms.length} {tab === "active" ? "active" : "draft"} {visibleForms.length === 1 ? "form" : "forms"}{query ? " matching your search" : ""}
          </Typography>
        ) : null}
      </Paper>

      <Dialog open={Boolean(formToDelete)} onClose={() => setFormToDelete(null)} fullWidth maxWidth="xs">
        <DialogTitle>Delete form</DialogTitle>
        <DialogContent>
          <Typography>Delete {formToDelete?.title}? This only removes it from the current session.</Typography>
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 2 }}>
          <Button onClick={() => setFormToDelete(null)}>Cancel</Button>
          <Button
            color="error"
            variant="contained"
            onClick={() => {
              if (formToDelete) {
                deleteForm(formToDelete.id);
              }
              setFormToDelete(null);
            }}
          >
            Delete
          </Button>
        </DialogActions>
      </Dialog>

      <Dialog open={Boolean(previewForm)} onClose={() => setPreviewForm(null)} fullWidth maxWidth="md">
        <DialogTitle>{previewForm?.title}</DialogTitle>
        <DialogContent>{previewModel ? <Survey model={previewModel} /> : null}</DialogContent>
        <DialogActions sx={{ px: 3, pb: 2 }}>
          <Button onClick={() => setPreviewForm(null)}>Close</Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}

function FormActionsMenu({
  form,
  onPreview,
  onEdit,
  onPublish,
  onUnpublish,
  onDelete,
}: {
  form: FormRecord;
  onPreview: () => void;
  onEdit: () => void;
  onPublish: () => void;
  onUnpublish: () => void;
  onDelete: () => void;
}) {
  const [anchorEl, setAnchorEl] = useState<HTMLElement | null>(null);
  const open = Boolean(anchorEl);

  function close() {
    setAnchorEl(null);
  }

  return (
    <>
      <IconButton
        size="small"
        aria-label={`Actions for ${form.title}`}
        onClick={(event: MouseEvent<HTMLElement>) => setAnchorEl(event.currentTarget)}
      >
        <MoreVertOutlinedIcon fontSize="small" />
      </IconButton>
      <Menu anchorEl={anchorEl} open={open} onClose={close} anchorOrigin={{ vertical: "bottom", horizontal: "right" }} transformOrigin={{ vertical: "top", horizontal: "right" }}>
        <MenuItem
          onClick={() => {
            close();
            onPreview();
          }}
        >
          <ListItemIcon>
            <VisibilityOutlinedIcon fontSize="small" />
          </ListItemIcon>
          <ListItemText>Preview</ListItemText>
        </MenuItem>
        <MenuItem
          onClick={() => {
            close();
            onEdit();
          }}
        >
          <ListItemIcon>
            <EditOutlinedIcon fontSize="small" />
          </ListItemIcon>
          <ListItemText>Edit</ListItemText>
        </MenuItem>
        {form.status === "draft" ? (
          <MenuItem
            onClick={() => {
              close();
              onPublish();
            }}
          >
            <ListItemIcon>
              <PublishOutlinedIcon fontSize="small" />
            </ListItemIcon>
            <ListItemText>Publish</ListItemText>
          </MenuItem>
        ) : (
          <MenuItem
            onClick={() => {
              close();
              onUnpublish();
            }}
          >
            <ListItemIcon>
              <UnpublishedOutlinedIcon fontSize="small" />
            </ListItemIcon>
            <ListItemText>Unpublish</ListItemText>
          </MenuItem>
        )}
        <MenuItem
          onClick={() => {
            close();
            onDelete();
          }}
        >
          <ListItemIcon>
            <DeleteOutlineIcon fontSize="small" />
          </ListItemIcon>
          <ListItemText>Delete</ListItemText>
        </MenuItem>
      </Menu>
    </>
  );
}

function StatusChip({ status }: { status: FormStatus }) {
  return <Chip size="small" label={status === "active" ? "Active" : "Draft"} color={status === "active" ? "success" : "default"} />;
}
