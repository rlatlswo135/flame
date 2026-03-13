import type {
	UseFloatingReturn,
	UseInteractionsReturn,
} from "@floating-ui/react";
import { createContext } from "react";

type PopoverContextValue = {
	onClose: (() => void) | undefined;
	onOpen: (() => void) | undefined;
	floating: UseFloatingReturn;
	interactions: UseInteractionsReturn;
};

export const PopoverContext = createContext<PopoverContextValue | null>(null);
