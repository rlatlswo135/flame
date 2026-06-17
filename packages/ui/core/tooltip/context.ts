import type { UseInteractionsReturn } from "@floating-ui/react";
import { createContext } from "react";
import type { FloatingBaseReturn } from "@/hooks/use-floating-base";

type TooltipContextValue = FloatingBaseReturn & {
	interactions: UseInteractionsReturn;
};

export const TooltipContext = createContext<TooltipContextValue | null>(null);
