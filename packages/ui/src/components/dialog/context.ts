import {
	createContext,
	type Dispatch,
	type RefObject,
	type SetStateAction,
} from "react";

type DialogContextValue = {
	dialog: RefObject<HTMLDialogElement | null>;
	open: () => void;
	close: () => void;
	closeOutside?: boolean;
	keepMounted?: boolean;
	isOpen: boolean;
	setIsOpen: Dispatch<SetStateAction<boolean>>;
};

export const DialogContext = createContext<DialogContextValue | null>(null);
