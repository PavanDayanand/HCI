import { useState } from "react";
import type { ReactNode } from "react";
import type { FormRecord, SubmissionRecord, SurveySchema } from "../types/form.ts";
import { FormContext } from "./formContext.ts";

const starterSchema: SurveySchema = {
  title: "Community feedback",
  pages: [
    {
      name: "page1",
      elements: [
        {
          type: "text",
          name: "fullName",
          title: "Full name",
          isRequired: true,
        },
        {
          type: "dropdown",
          name: "suburb",
          title: "Suburb",
          choices: ["Lower Hutt", "Petone", "Wainuiomata", "Eastbourne"],
        },
        {
          type: "comment",
          name: "message",
          title: "Your feedback",
          isRequired: true,
        },
      ],
    },
  ],
};

const starterForm: FormRecord = {
  id: "community-feedback",
  title: "Community feedback",
  description: "Tell Hutt City what is working and what should improve.",
  status: "active",
  schema: starterSchema,
  updatedAt: new Date().toISOString(),
};

export function FormProvider({ children }: { children: ReactNode }) {
  const [forms, setForms] = useState<FormRecord[]>([starterForm]);
  const [submissions, setSubmissions] = useState<SubmissionRecord[]>([]);

  function saveForm(nextForm: FormRecord) {
    setForms((currentForms) => {
      const alreadyThere = currentForms.some((form) => form.id === nextForm.id);
      if (!alreadyThere) {
        return [nextForm, ...currentForms];
      }
      return currentForms.map((form) => (form.id === nextForm.id ? nextForm : form));
    });
  }

  function publishForm(formId: string) {
    setForms((currentForms) =>
      currentForms.map((form) =>
        form.id === formId ? { ...form, status: "active", updatedAt: new Date().toISOString() } : form,
      ),
    );
  }

  function unpublishForm(formId: string) {
    setForms((currentForms) =>
      currentForms.map((form) =>
        form.id === formId ? { ...form, status: "draft", updatedAt: new Date().toISOString() } : form,
      ),
    );
  }

  function deleteForm(formId: string) {
    setForms((currentForms) => currentForms.filter((form) => form.id !== formId));
  }

  function addSubmission(submission: SubmissionRecord) {
    setSubmissions((currentSubmissions) => [submission, ...currentSubmissions]);
  }

  return (
    <FormContext.Provider
      value={{ forms, submissions, saveForm, publishForm, unpublishForm, deleteForm, addSubmission }}
    >
      {children}
    </FormContext.Provider>
  );
}
