import type { UseInteractionsReturn } from "@floating-ui/react";
import { createContext } from "react";
import type { FloatingBaseReturn } from "@/src/hooks/use-floating-base";

type SelectContextValue = FloatingBaseReturn & {
	value: string;
	onChange: (value: string) => void;
	interactions: UseInteractionsReturn;
};

export const SelectContext = createContext<SelectContextValue | null>(null);
