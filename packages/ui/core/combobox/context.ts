import { createContext, type KeyboardEvent } from "react";
import type { FloatingBaseReturn } from "@/hooks/use-floating-base";

export type ComboboxContextValue = FloatingBaseReturn & {
	value: string;
	listId: string;
	inputValue: string;
	activeId: string | null;
	matches: (label: string) => boolean;
	onInputChange: (value: string) => void;
	onSearchKeyDown: (event: KeyboardEvent<HTMLInputElement>) => void;
	setActiveId: (id: string | null) => void;
	selectOption: (value: string, label: string) => void;
};

export const ComboboxContext = createContext<ComboboxContextValue | null>(null);
