import { createContext, type RefObject } from "react";

export type DialogContextType = {
  dialog: RefObject<HTMLDialogElement | null>;
  open: () => void;
  close: () => void;
  closeOutside?: boolean;
};

export const DialogContext = createContext<DialogContextType | null>(null);
