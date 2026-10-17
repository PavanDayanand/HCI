import { createContext } from "react";
import type { AnalyticsWidget, FormRecord, SubmissionRecord } from "../types/form.ts";

export type FormContextValue = {
  forms: FormRecord[];
  submissions: SubmissionRecord[];
  widgets: AnalyticsWidget[];
  saveForm: (form: FormRecord) => void;
  publishForm: (formId: string) => void;
  unpublishForm: (formId: string) => void;
  deleteForm: (formId: string) => void;
  addSubmission: (submission: SubmissionRecord) => void;
  addWidget: (widget: AnalyticsWidget) => void;
  deleteWidget: (widgetId: string) => void;
};

export const FormContext = createContext<FormContextValue | null>(null);
