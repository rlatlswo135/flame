import { createContext, type RefObject } from "react";

type DrawerContextValue = {
	dialog: RefObject<HTMLDialogElement | null>;
	isOpen: boolean;
	entered: boolean;
	reducedMotion: boolean;
	contentId: string;
	open: () => void;
	close: () => void;
	handleClose: () => void;
	placement: "top" | "right" | "bottom" | "left";
};

export const DrawerContext = createContext<DrawerContextValue | null>(null);
