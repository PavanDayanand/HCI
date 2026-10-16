import { createContext } from "react";
import type { FormRecord, SubmissionRecord } from "../types/form.ts";

export type FormContextValue = {
  forms: FormRecord[];
  submissions: SubmissionRecord[];
  saveForm: (form: FormRecord) => void;
  publishForm: (formId: string) => void;
  unpublishForm: (formId: string) => void;
  deleteForm: (formId: string) => void;
  addSubmission: (submission: SubmissionRecord) => void;
};

export const FormContext = createContext<FormContextValue | null>(null);
