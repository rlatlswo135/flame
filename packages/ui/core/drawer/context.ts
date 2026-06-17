import { createContext } from "react";

type DrawerContextValue = {
	isOpen: boolean;
	contentId: string;
	baseZIndex: number;
	open: () => void;
	close: () => void;
	placement: "top" | "right" | "bottom" | "left";
};

export const DrawerContext = createContext<DrawerContextValue | null>(null);
