import AddIcon from "@mui/icons-material/Add";
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutlineOutlined";
import {
  Box,
  Button,
  Card,
  CardContent,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  IconButton,
  MenuItem,
  TextField,
  Typography,
} from "@mui/material";
import { useState } from "react";
import { SimpleChart } from "../../components/SimpleChart.tsx";
import type { ChartPoint } from "../../components/SimpleChart.tsx";
import { EmptyState } from "../../components/EmptyState.tsx";
import { PageHeader } from "../../components/PageHeader.tsx";
import { useForms } from "../../forms/useForms.ts";
import {
  COUNT_FIELD,
  answerLabel,
  isNumericField,
  listFormFields,
} from "../../types/form.ts";
import type { ChartKind, FormRecord } from "../../types/form.ts";

const chartOptions: { value: ChartKind; label: string }[] = [
  { value: "bar", label: "Bar" },
  { value: "pie", label: "Pie" },
  { value: "line", label: "Line" },
];

export function AnalyticsPage() {
  const { forms, submissions, widgets, addWidget, deleteWidget } = useForms();
  const [open, setOpen] = useState(false);
  const [formId, setFormId] = useState("");
  const [xField, setXField] = useState("");
  const [yField, setYField] = useState(COUNT_FIELD);
  const [chartType, setChartType] = useState<ChartKind>("bar");

  const selectedForm = forms.find((form) => form.id === formId);
  const fields = selectedForm ? listFormFields(selectedForm.schema) : [];
  const yFields = fields.filter(isNumericField);

  function resetDialog() {
    setFormId("");
    setXField("");
    setYField(COUNT_FIELD);
    setChartType("bar");
  }

  function createWidget() {
    if (!formId || !xField) {
      return;
    }
    addWidget({
      id: crypto.randomUUID(),
      formId,
      xField,
      yField,
      chartType,
    });
    setOpen(false);
    resetDialog();
  }

  return (
    <Box>
      <PageHeader
        title="Analytics"
        subtitle="Build simple charts from form submissions in this session."
        action={
          <Button variant="contained" startIcon={<AddIcon />} onClick={() => setOpen(true)} disabled={forms.length === 0}>
            Create widget
          </Button>
        }
      />

      {widgets.length === 0 ? (
        <EmptyState title="No widgets yet" message="Create a widget, then pick a form, an X axis, a Y axis, and a chart type." />
      ) : (
        <Box
          sx={{
            display: "grid",
            gridTemplateColumns: { xs: "1fr", md: "1fr 1fr" },
            gap: 2,
          }}
        >
          {widgets.map((widget) => {
            const form = forms.find((item) => item.id === widget.formId);
            return (
              <WidgetCard
                key={widget.id}
                form={form}
                xField={widget.xField}
                yField={widget.yField}
                chartType={widget.chartType}
                points={buildPoints(form, submissions, widget.xField, widget.yField)}
                onDelete={() => deleteWidget(widget.id)}
              />
            );
          })}
        </Box>
      )}

      <Dialog open={open} onClose={() => setOpen(false)} fullWidth maxWidth="sm">
        <DialogTitle>Create widget</DialogTitle>
        <DialogContent sx={{ display: "grid", gap: 2, pt: "12px !important" }}>
          <TextField
            select
            label="Form name"
            value={formId}
            onChange={(event) => {
              setFormId(event.target.value);
              setXField("");
              setYField(COUNT_FIELD);
            }}
          >
            {forms.map((form) => (
              <MenuItem key={form.id} value={form.id}>
                {form.title}
              </MenuItem>
            ))}
          </TextField>
          <TextField
            select
            label="X axis"
            value={xField}
            onChange={(event) => setXField(event.target.value)}
            disabled={!selectedForm}
            helperText="The field used to group answers."
          >
            {fields.map((field) => (
              <MenuItem key={field.name} value={field.name}>
                {field.title}
              </MenuItem>
            ))}
          </TextField>
          <TextField
            select
            label="Y axis"
            value={yField}
            onChange={(event) => setYField(event.target.value)}
            disabled={!selectedForm}
            helperText="Count of submissions, or a number field to add up."
          >
            <MenuItem value={COUNT_FIELD}>Count of submissions</MenuItem>
            {yFields.map((field) => (
              <MenuItem key={field.name} value={field.name}>
                {field.title}
              </MenuItem>
            ))}
          </TextField>
          <TextField select label="Chart type" value={chartType} onChange={(event) => setChartType(event.target.value as ChartKind)}>
            {chartOptions.map((option) => (
              <MenuItem key={option.value} value={option.value}>
                {option.label}
              </MenuItem>
            ))}
          </TextField>
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 2 }}>
          <Button onClick={() => setOpen(false)}>Cancel</Button>
          <Button variant="contained" onClick={createWidget} disabled={!formId || !xField}>
            Add widget
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}

function WidgetCard({
  form,
  xField,
  yField,
  chartType,
  points,
  onDelete,
}: {
  form?: FormRecord;
  xField: string;
  yField: string;
  chartType: ChartKind;
  points: ChartPoint[];
  onDelete: () => void;
}) {
  const fields = form ? listFormFields(form.schema) : [];
  const xTitle = fields.find((field) => field.name === xField)?.title ?? xField;
  const yTitle = yField === COUNT_FIELD ? "Submissions" : (fields.find((field) => field.name === yField)?.title ?? yField);
  const chartLabel = chartOptions.find((option) => option.value === chartType)?.label ?? chartType;

  return (
    <Card>
      <CardContent>
        <Box sx={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: 1, mb: 2 }}>
          <Box>
            <Typography sx={{ fontWeight: 600 }}>{form?.title ?? "Form removed"}</Typography>
            <Typography variant="body2" color="text.secondary">
              {chartLabel} · {xTitle} / {yTitle}
            </Typography>
          </Box>
          <IconButton aria-label="Delete widget" onClick={onDelete} size="small">
            <DeleteOutlineIcon fontSize="small" />
          </IconButton>
        </Box>
        {form ? <SimpleChart kind={chartType} points={points} /> : <Typography color="text.secondary">This form is no longer in the session.</Typography>}
      </CardContent>
    </Card>
  );
}

function buildPoints(form: FormRecord | undefined, submissions: { formId: string; answers: Record<string, unknown> }[], xField: string, yField: string): ChartPoint[] {
  if (!form) {
    return [];
  }

  const buckets = new Map<string, number>();
  for (const submission of submissions) {
    if (submission.formId !== form.id) {
      continue;
    }
    const label = answerLabel(submission.answers[xField]);
    if (yField === COUNT_FIELD) {
      buckets.set(label, (buckets.get(label) ?? 0) + 1);
      continue;
    }
    const amount = Number(submission.answers[yField]);
    if (!Number.isNaN(amount)) {
      buckets.set(label, (buckets.get(label) ?? 0) + amount);
    }
  }

  return [...buckets.entries()].map(([label, value]) => ({ label, value }));
}
