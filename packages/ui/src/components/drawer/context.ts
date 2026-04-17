import { createContext } from "react";

type DrawerContextValue = {
	isOpen: boolean;
	open: () => void;
	close: () => void;
};

export const DrawerContext = createContext<DrawerContextValue | null>(null);
