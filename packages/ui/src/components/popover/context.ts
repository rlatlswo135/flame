import type {
	FloatingPortalProps,
	UseFloatingReturn,
	UseInteractionsReturn,
	UseTransitionStylesProps,
} from "@floating-ui/react";
import { createContext } from "react";

type PopoverContextValue = {
	onClose: (() => void) | undefined;
	onOpen: (() => void) | undefined;
	focusTrap: boolean;
	portal: boolean | FloatingPortalProps;
	floating: UseFloatingReturn;
	interactions: UseInteractionsReturn;
	transition: boolean | UseTransitionStylesProps;
};

export const PopoverContext = createContext<PopoverContextValue | null>(null);
