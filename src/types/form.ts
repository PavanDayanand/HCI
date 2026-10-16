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
