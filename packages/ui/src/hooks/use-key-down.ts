import { useEffect, useEffectEvent } from "react";

type Key =
	| "Enter"
	| "ArrowDown"
	| "ArrowUp"
	| "ArrowLeft"
	| "ArrowRight"
	| "Escape";

type UseKeydownProps = {
	key: Key;
	handler: () => void;

	enabled?: boolean;
};

export const useKeyDown = ({ key, handler, enabled }: UseKeydownProps) => {
	const event = useEffectEvent((e: KeyboardEvent) => {
		if (!enabled) return;
		if (e.key !== key) return;

		handler();
	});

	useEffect(() => {
		document.addEventListener("keydown", event);
		return () => {
			document.removeEventListener("keydown", event);
		};
	}, []);
};
