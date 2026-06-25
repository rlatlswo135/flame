import {
	createContext,
	type Dispatch,
	type RefObject,
	type SetStateAction,
} from "react";

type DialogContextValue = {
	dialog: RefObject<HTMLDialogElement | null>;
	contentId: string;
	open: () => void;
	close: () => void;
	isOpen: boolean;
	setIsOpen: Dispatch<SetStateAction<boolean>>;

	closeOutside?: boolean;
	keepMounted?: boolean;
	onClose?: () => void;
};

export const DialogContext = createContext<DialogContextValue | null>(null);
