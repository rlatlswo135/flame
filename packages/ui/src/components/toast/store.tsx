import type { ReactNode } from "react";

type ToastStatus = "active" | "exiting";

type Toast = {
	id: number;
	timeoutId: NodeJS.Timeout;
	content: ReactNode;
	status: ToastStatus;
};

type ToastAnimation = {
	enter: Keyframe[];
	exit: Keyframe[];
	options?: KeyframeAnimationOptions;
};

type ToastOptions = {
	timeout?: number;
};

let _id = 0;
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
	markExiting: (id: number) => {
		toasts = toasts.map((t) =>
			t.id === id ? { ...t, status: "exiting" as const } : t,
		);
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
	const id = ++_id;

	const timeoutId = setTimeout(() => {
		toastStore.markExiting(id);
		toastStore.signal();
	}, options?.timeout ?? 3000);

	toastStore.unshift({ id, content, timeoutId, status: "active" });
	toastStore.signal();
};

export type { ToastAnimation };
