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
	target?: HTMLElement;
};

export const useKeyDown = ({
	key,
	handler,
	enabled,
	target,
}: UseKeydownProps) => {
	// TODO: handler내부 중첩 스코프 확인
	const event = useEffectEvent((e: KeyboardEvent) => {
		if (!enabled) return;
		if (e.key !== key) return;

		handler();
	});

	useEffect(() => {
		const targetElement = (target ?? document) as HTMLElement;

		targetElement.addEventListener("keydown", event);
		return () => {
			targetElement.removeEventListener("keydown", event);
		};
	}, [target]);
};
