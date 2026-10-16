import { useContext } from "react";
import { FormContext } from "./formContext.ts";

export function useForms() {
  const context = useContext(FormContext);
  if (!context) {
    throw new Error("useForms must be used inside FormProvider");
  }
  return context;
}
