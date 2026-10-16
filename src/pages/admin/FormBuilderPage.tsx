import AddIcon from "@mui/icons-material/Add";
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
import { useMemo, useState } from "react";
import type { MouseEvent } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { Model } from "survey-core";
import { PlainDark, PlainLight } from "survey-core/themes";
import { Survey } from "survey-react-ui";
import { EmptyState } from "../../components/EmptyState.tsx";
import { PageHeader } from "../../components/PageHeader.tsx";
import { useForms } from "../../forms/useForms.ts";
import { useColorMode } from "../../theme/useColorMode.ts";
import { formatWhen } from "../../types/form.ts";
import type { FormRecord, FormStatus } from "../../types/form.ts";

type BuilderTab = "active" | "draft" | "ai";

export function FormBuilderPage() {
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const { mode } = useColorMode();
  const { forms, publishForm, unpublishForm, deleteForm } = useForms();
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
          <Button variant="contained" startIcon={<AddIcon />} onClick={() => navigate("/admin/forms/new")}>
            Create form
          </Button>
        }
      />

      <Paper elevation={0} sx={{ overflow: "hidden", borderRadius: 3, border: 1, borderColor: "divider" }}>
        <Box
          sx={{
            px: 2,
            py: 1.5,
            display: "flex",
            alignItems: "center",
            gap: 2,
            flexWrap: "wrap",
            borderBottom: 1,
            borderColor: "divider",
          }}
        >
          <Tabs
            value={tab}
            onChange={(_event, nextTab: BuilderTab) => {
              if (nextTab === "active") {
                setSearchParams({});
                return;
              }
              setSearchParams({ tab: nextTab });
            }}
            sx={{ minHeight: 40, "& .MuiTab-root": { minHeight: 40 } }}
          >
            <Tab value="active" label={`Active (${activeForms.length})`} />
            <Tab value="draft" label={`Drafts (${draftForms.length})`} />
            <Tab value="ai" label="AI Builder" />
          </Tabs>
          {tab !== "ai" ? (
            <TextField
              size="small"
              placeholder="Search"
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              slotProps={{
                input: {
                  startAdornment: (
                    <InputAdornment position="start">
                      <SearchIcon fontSize="small" />
                    </InputAdornment>
                  ),
                },
              }}
              sx={{ ml: "auto", width: 260 }}
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
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Name</TableCell>
                  <TableCell width={140}>Status</TableCell>
                  <TableCell width={180}>Updated</TableCell>
                  <TableCell align="right" width={120} sx={{ whiteSpace: "nowrap" }}>
                    Actions
                  </TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {visibleForms.map((form) => (
                  <TableRow key={form.id} hover>
                    <TableCell>
                      <Typography sx={{ fontWeight: 600 }}>{form.title}</Typography>
                      <Typography variant="body2" color="text.secondary">
                        {form.description || "No description"}
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <StatusChip status={form.status} />
                    </TableCell>
                    <TableCell>
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
