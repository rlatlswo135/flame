import { createContext } from "react";
import type { FloatingBaseReturn } from "@/hooks/use-floating-base";

type ComboboxContextValue = FloatingBaseReturn & {
	value: string;
	onChange: (value: string) => void;
	search: string;
	onSearchChange: (search: string) => void;
};

export const ComboboxContext = createContext<ComboboxContextValue | null>(null);
