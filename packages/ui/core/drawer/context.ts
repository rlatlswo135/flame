import {
	createContext,
	type Dispatch,
	type RefObject,
	type SetStateAction,
} from "react";

type DrawerContextValue = {
	dialog: RefObject<HTMLDialogElement | null>;
	isOpen: boolean;
	setIsOpen: Dispatch<SetStateAction<boolean>>;
	contentId: string;
	open: () => void;
	close: () => void;
	placement: "top" | "right" | "bottom" | "left";
	closeOutside?: boolean;
	keepMounted?: boolean;
	onClose?: () => void;
};

export const DrawerContext = createContext<DrawerContextValue | null>(null);
