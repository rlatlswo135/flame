import type { ReactNode } from "react";

type Toast = {
	id: number;
	timeoutId: NodeJS.Timeout;
	content: ReactNode;
};
type ToastOptions = {
	timeout?: number;
};

let toasts: Toast[] = [];
const listeners: Set<() => void> = new Set();

export const toastStore = {
	subscribe: (listener: () => void) => {
		listeners.add(listener);
		return () => {
			listeners.delete(listener);
		};
	},
	signal: () => {
		for (const lt of listeners) {
			lt();
		}
	},
	unshift: (toast: Toast) => {
		toasts = [toast, ...toasts];
	},
	remove: (id: number) => {
		const filteredToast: Toast[] = [];

		toasts.forEach((t) => {
			if (t.id === id) {
				clearTimeout(t.timeoutId);
			} else {
				filteredToast.push(t);
			}
		});
		toasts = filteredToast;
	},
	reset: () => {
		toasts.forEach((t) => {
			clearTimeout(t.timeoutId);
		});
		toasts = [];
	},
	getSnapshot: () => toasts,
};

export const toast = (content: ReactNode, options?: ToastOptions) => {
	const id = Date.now();

	const timeoutId = setTimeout(() => {
		toastStore.remove(id);
		toastStore.signal();
	}, options?.timeout ?? 3000);

	toastStore.unshift({ id, content, timeoutId });
	toastStore.signal();
};
