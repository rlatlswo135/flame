import { createContext } from "react";

type AccordionContextValue = {
	single?: boolean;
};

type AccordionItemContextValue = {
	isExpanded: boolean;
	toggle: () => void;
};

export const AccordionContext = createContext<AccordionContextValue | null>(
	null,
);

export const AccordionItemContext =
	createContext<AccordionItemContextValue | null>(null);
