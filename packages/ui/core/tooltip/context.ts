import { createContext } from "react";
import type { FloatingBaseReturn } from "@/hooks/use-floating-base";

export const TooltipContext = createContext<FloatingBaseReturn | null>(null);
