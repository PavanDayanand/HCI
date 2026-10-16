import { Model } from "survey-core";
import type { FormRecord } from "../types/form.ts";

export function importSurvey(text: string, filename: string): FormRecord {
  let schema: unknown;
  try {
    schema = JSON.parse(text);
  } catch {
    throw new Error("This file contains invalid JSON. Check its formatting and try again.");
  }

  if (!schema || typeof schema !== "object" || Array.isArray(schema)) {
    throw new Error("Upload a SurveyJS form definition as a JSON object.");
  }
  const definition = schema as Record<string, unknown>;
  if (!Array.isArray(definition.pages) && !Array.isArray(definition.elements)) {
    throw new Error("This is not a SurveyJS form definition. It must contain pages or elements.");
  }

  const model = new Model();
  try {
    model.fromJSON(definition, { validatePropertyValues: true });
    if (model.jsonErrors?.length) {
      throw new Error("Some properties or question types are not supported by this SurveyJS editor. Check the form definition and try again.");
    }
    const names = new Set<string>();
    for (const question of model.getAllQuestions()) {
      if (!question.name || names.has(question.name)) {
        throw new Error("Each question must have a unique, non-empty name.");
      }
      names.add(question.name);
    }
  } finally {
    model.dispose();
  }

  return {
    id: crypto.randomUUID(),
    title: typeof definition.title === "string" && definition.title.trim()
      ? definition.title.trim()
      : filename.replace(/\.(survey\.)?json$/i, "").replace(/[-_]/g, " ").trim() || "Imported form",
    description: typeof definition.description === "string" ? definition.description : "",
    status: "draft",
    schema: definition,
    updatedAt: new Date().toISOString(),
  };
}
