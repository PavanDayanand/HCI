import { useState } from "react";
import type { ReactNode } from "react";
import type { AnalyticsWidget, FormRecord, SubmissionRecord, SurveySchema } from "../types/form.ts";
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

const starterSubmissions: SubmissionRecord[] = [
  {
    id: "sub-1",
    formId: starterForm.id,
    formTitle: starterForm.title,
    answers: { fullName: "Aroha Chen", suburb: "Petone", message: "More lighting on Jackson Street." },
    submittedAt: new Date().toISOString(),
  },
  {
    id: "sub-2",
    formId: starterForm.id,
    formTitle: starterForm.title,
    answers: { fullName: "James Patel", suburb: "Lower Hutt", message: "The library hours work well." },
    submittedAt: new Date().toISOString(),
  },
  {
    id: "sub-3",
    formId: starterForm.id,
    formTitle: starterForm.title,
    answers: { fullName: "Mere Te Rangi", suburb: "Wainuiomata", message: "Please add a weekend bus." },
    submittedAt: new Date().toISOString(),
  },
  {
    id: "sub-4",
    formId: starterForm.id,
    formTitle: starterForm.title,
    answers: { fullName: "Sam Walsh", suburb: "Petone", message: "The playground is looking great." },
    submittedAt: new Date().toISOString(),
  },
  {
    id: "sub-5",
    formId: starterForm.id,
    formTitle: starterForm.title,
    answers: { fullName: "Nina Costa", suburb: "Eastbourne", message: "More recycling bins on the waterfront." },
    submittedAt: new Date().toISOString(),
  },
];

export function FormProvider({ children }: { children: ReactNode }) {
  const [forms, setForms] = useState<FormRecord[]>([starterForm]);
  const [submissions, setSubmissions] = useState<SubmissionRecord[]>(starterSubmissions);
  const [widgets, setWidgets] = useState<AnalyticsWidget[]>([]);

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
    setWidgets((currentWidgets) => currentWidgets.filter((widget) => widget.formId !== formId));
  }

  function addSubmission(submission: SubmissionRecord) {
    setSubmissions((currentSubmissions) => [submission, ...currentSubmissions]);
  }

  function addWidget(widget: AnalyticsWidget) {
    setWidgets((currentWidgets) => [widget, ...currentWidgets]);
  }

  function deleteWidget(widgetId: string) {
    setWidgets((currentWidgets) => currentWidgets.filter((widget) => widget.id !== widgetId));
  }

  return (
    <FormContext.Provider
      value={{
        forms,
        submissions,
        widgets,
        saveForm,
        publishForm,
        unpublishForm,
        deleteForm,
        addSubmission,
        addWidget,
        deleteWidget,
      }}
    >
      {children}
    </FormContext.Provider>
  );
}
