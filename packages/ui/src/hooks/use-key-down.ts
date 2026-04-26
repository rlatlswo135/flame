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
	// TODO: useEffectEvent 활용
	const event = useEffectEvent(handler);

	useEffect(() => {}, []);
};
