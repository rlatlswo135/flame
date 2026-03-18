import type {
	FloatingPortalProps,
	UseFloatingReturn,
	UseInteractionsReturn,
	UseTransitionStylesProps,
} from "@floating-ui/react";
import { createContext } from "react";

type SelectContextType = {
	focusTrap: boolean;
	value: string;
	onChange: (value: string) => void;

	portal: boolean | FloatingPortalProps;
	floating: UseFloatingReturn;
	interactions: UseInteractionsReturn;
	transition: boolean | UseTransitionStylesProps;
};

export const SelectContext = createContext<SelectContextType | null>(null);
