import { createContext } from "react";

type ToastContextValue = {
	id: string;
};

export const ToastContext = createContext<ToastContextValue | null>(null);
