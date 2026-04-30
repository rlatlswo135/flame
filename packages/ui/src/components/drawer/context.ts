import { createContext, type RefObject } from "react";
import type { TransitionStatus } from "@/src/hooks/use-exit-transition";

type DrawerContextValue = {
	isOpen: boolean;
	contentId: string;
	baseZIndex: number;
	open: () => void;
	close: () => void;
	placement: "top" | "right" | "bottom" | "left";
	status: TransitionStatus;
	mounted: boolean;
	transitionRef: RefObject<HTMLElement | null>;
};

export const DrawerContext = createContext<DrawerContextValue | null>(null);
