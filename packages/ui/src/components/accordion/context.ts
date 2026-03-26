import { createContext, type Dispatch, type SetStateAction } from "react";

type AccordionContextValue = {
	single: boolean;
	activeItemId: string | null;
	setActiveItemId: Dispatch<SetStateAction<string | null>>;
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
