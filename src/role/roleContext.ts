import { createContext } from "react";

export type AppRole = "admin" | "user";

export type RoleContextValue = {
  role: AppRole;
  setRole: (role: AppRole) => void;
};

export const RoleContext = createContext<RoleContextValue | null>(null);
