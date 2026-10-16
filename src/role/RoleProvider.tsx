import { useState } from "react";
import type { ReactNode } from "react";
import { RoleContext } from "./roleContext.ts";
import type { AppRole } from "./roleContext.ts";

export function RoleProvider({ children }: { children: ReactNode }) {
  const [role, setRole] = useState<AppRole>("admin");

  return <RoleContext.Provider value={{ role, setRole }}>{children}</RoleContext.Provider>;
}
