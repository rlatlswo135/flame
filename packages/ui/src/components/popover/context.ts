import type { UseInteractionsReturn } from "@floating-ui/react";
import { createContext } from "react";
import type { FloatingBaseReturn } from "@/src/hooks/use-floating-base";

type PopoverContextValue = FloatingBaseReturn & {
	interactions: UseInteractionsReturn;
};

export const PopoverContext = createContext<PopoverContextValue | null>(null);
