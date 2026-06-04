import { type RefObject, useEffect, useRef } from "react";

const FOCUSABLE_SELECTOR =
	'a[href], button:not(:disabled), input:not(:disabled), select:not(:disabled), textarea:not(:disabled), [tabindex]:not([tabindex="-1"])';

export const useFocusTrap = (
	targetRef: RefObject<HTMLElement | null>,
	enabled: boolean,
) => {
	const prevFocusRef = useRef<HTMLElement | null>(null);

	useEffect(() => {
		const target = targetRef.current;
		if (!enabled || !target) return;

		const getFocusable = () =>
			target.querySelectorAll<HTMLElement>(FOCUSABLE_SELECTOR);

		prevFocusRef.current = document.activeElement as HTMLElement;

		const focusable = getFocusable();
		const first = focusable[0];

		if (first) {
			first.focus();
		} else {
			target.setAttribute("tabindex", "-1");
			target.focus();
		}

		const handleKeydown = (e: KeyboardEvent) => {
			if (e.key !== "Tab") return;

			const focusable = getFocusable();

			if (focusable.length === 0) {
				e.preventDefault();
				return;
			}

			const first = focusable[0];
			const last = focusable[focusable.length - 1];

			if (e.shiftKey && document.activeElement === first) {
				e.preventDefault();
				last.focus();
			} else if (!e.shiftKey && document.activeElement === last) {
				e.preventDefault();
				first.focus();
			}
		};

		target.addEventListener("keydown", handleKeydown);

		return () => {
			target.removeEventListener("keydown", handleKeydown);
			prevFocusRef.current?.focus();
		};
	}, [enabled, targetRef]);
};
