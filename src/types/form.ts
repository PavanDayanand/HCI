export type FormStatus = "draft" | "active";

export type SurveySchema = Record<string, unknown>;

export type FormRecord = {
  id: string;
  title: string;
  description: string;
  status: FormStatus;
  schema: SurveySchema;
  updatedAt: string;
};

export type SubmissionRecord = {
  id: string;
  formId: string;
  formTitle: string;
  answers: Record<string, unknown>;
  submittedAt: string;
};

export type ChartKind = "bar" | "pie" | "line";

export const COUNT_FIELD = "__count";

export type AnalyticsWidget = {
  id: string;
  formId: string;
  xField: string;
  yField: string;
  chartType: ChartKind;
};

export type FormField = {
  name: string;
  title: string;
  type: string;
};

const skipFieldTypes = new Set(["html", "image", "file", "signature", "expression"]);
const numericFieldTypes = new Set(["number", "rating", "nouislider", "slider"]);

export function listFormFields(schema: SurveySchema): FormField[] {
  const pages = schema.pages;
  if (!Array.isArray(pages)) {
    return [];
  }

  const fields: FormField[] = [];
  for (const page of pages) {
    if (!page || typeof page !== "object") {
      continue;
    }
    const elements = (page as { elements?: unknown }).elements;
    if (Array.isArray(elements)) {
      collectElements(elements, fields);
    }
  }
  return fields;
}

function collectElements(elements: unknown[], fields: FormField[]) {
  for (const element of elements) {
    if (!element || typeof element !== "object") {
      continue;
    }
    const item = element as Record<string, unknown>;
    if (Array.isArray(item.elements)) {
      collectElements(item.elements, fields);
    }
    if (typeof item.name !== "string" || skipFieldTypes.has(String(item.type))) {
      continue;
    }
    fields.push({
      name: item.name,
      title: typeof item.title === "string" ? item.title : item.name,
      type: typeof item.type === "string" ? item.type : "text",
    });
  }
}

export function isNumericField(field: FormField) {
  return numericFieldTypes.has(field.type);
}

export function answerLabel(value: unknown) {
  if (value == null || value === "") {
    return "Blank";
  }
  if (Array.isArray(value)) {
    return value.length === 0 ? "Blank" : value.map(String).join(", ");
  }
  if (typeof value === "object") {
    return JSON.stringify(value);
  }
  return String(value);
}

export function createEmptySchema(): SurveySchema {
  return {
    pages: [
      {
        name: "page1",
        elements: [],
      },
    ],
  };
}

export function formatWhen(value: string) {
  return new Date(value).toLocaleString(undefined, {
    day: "numeric",
    month: "short",
    hour: "numeric",
    minute: "2-digit",
  });
}
