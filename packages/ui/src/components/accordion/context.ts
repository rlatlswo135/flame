import { createContext, type Dispatch, type SetStateAction } from "react";

type AccordionContextValue = {
	single: boolean;
	activeItemId: string;
	setActiveItemId: Dispatch<SetStateAction<string>>;
};

type AccordionItemContextValue = {
	toggle: () => void;
	isExpanded: boolean;
};

export const AccordionContext = createContext<AccordionContextValue | null>(
	null,
);

export const AccordionItemContext =
	createContext<AccordionItemContextValue | null>(null);
