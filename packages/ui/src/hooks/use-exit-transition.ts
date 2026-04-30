import { type RefObject, useEffect, useRef, useState } from "react";

type TransitionStatus = "entering" | "entered" | "exiting" | "exited";

type UseExitTransitionOptions = {
	timeout?: number;
};

export const useExitTransition = (
	open: boolean,
	options?: UseExitTransitionOptions,
) => {
	const timeout = options?.timeout ?? 300;
	const transitionRef = useRef<HTMLElement | null>(null);
	const hasOpened = useRef(open);
	const [status, setStatus] = useState<TransitionStatus>(
		open ? "entering" : "exited",
	);

	useEffect(() => {
		if (open) {
			hasOpened.current = true;
			setStatus("entering");
			const timer = setTimeout(() => setStatus("entered"), 0);
			return () => clearTimeout(timer);
		}

		// Skip exit transition on initial mount when starting closed
		if (!hasOpened.current) return;

		setStatus("exiting");

		const el = transitionRef.current;
		let timer: ReturnType<typeof setTimeout>;

		const done = () => setStatus("exited");

		if (el) {
			const handleEnd = () => {
				clearTimeout(timer);
				done();
			};
			el.addEventListener("transitionend", handleEnd, { once: true });
			timer = setTimeout(() => {
				el.removeEventListener("transitionend", handleEnd);
				done();
			}, timeout);

			return () => {
				el.removeEventListener("transitionend", handleEnd);
				clearTimeout(timer);
			};
		}

		timer = setTimeout(done, timeout);
		return () => clearTimeout(timer);
	}, [open, timeout]);

	const mounted = status !== "exited";

	return {
		mounted,
		status,
		transitionRef: transitionRef as RefObject<HTMLElement | null>,
	};
};

export type { TransitionStatus };
