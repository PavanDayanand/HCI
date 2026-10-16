import { createContext } from "react";
import type { ColorMode } from "./appTheme.ts";

export type ColorModeContextValue = {
  mode: ColorMode;
  toggleMode: () => void;
};

export const ColorModeContext = createContext<ColorModeContextValue | null>(null);
