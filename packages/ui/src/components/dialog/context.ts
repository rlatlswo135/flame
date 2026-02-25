import { createContext, type RefObject } from "react";

export type DialogContextValue = {
  dialog: RefObject<HTMLDialogElement | null>;
  open: () => void;
  close: () => void;
  closeOutside?: boolean;
};

export const DialogContext = createContext<DialogContextValue | null>(null);
