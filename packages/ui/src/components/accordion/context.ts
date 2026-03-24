import { createContext, type Dispatch, type SetStateAction } from "react";

type AccordionContextValue = {
	single: boolean;
	expandedId: string;
	setExpandedId: Dispatch<SetStateAction<string>>;
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
