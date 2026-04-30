import { createContext, type Dispatch, type RefObject, type SetStateAction } from "react";
import type { TransitionStatus } from "@/src/hooks/use-exit-transition";

type AccordionContextValue = {
	single: boolean;
	activeItemId: string | null;
	setActiveItemId: Dispatch<SetStateAction<string | null>>;
};

type AccordionItemContextValue = {
	toggle: () => void;
	isExpanded: boolean;
	contentId: string;
	mounted: boolean;
	status: TransitionStatus;
	transitionRef: RefObject<HTMLElement | null>;
};

export const AccordionContext = createContext<AccordionContextValue | null>(
	null,
);

export const AccordionItemContext =
	createContext<AccordionItemContextValue | null>(null);
